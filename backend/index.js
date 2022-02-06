import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import fileUpload from 'express-fileupload';
import path from 'path';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = '$2a$12$m6ELtq/TRLPcqvjwKoOVAux6iUSozpitTl4awut3iztseDx5LzPXu';


// set current working directory
const __dirname = path.resolve();
// public image directory
const cdnDir = path.join(__dirname, 'public');
// set website address
const SITE = 'https://mitsuki.qbmenu.ca/';


// set port, listen for requests
const PORT = process.env.PORT || 3500;

//database connection info
var connection;
const connectionInfo = {
    host: '127.0.0.1', 
    user:'admin', 
    password: 'Ja4YSuWPk@8DPC@',
    database: 'qr_menu'
};


var app = express();
app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(cdnDir));
app.use(fileUpload({
    limits: {
        fileSize: 1024 * 10240 // 10 MB
    },
    abortOnLimit: true
 }));



//auto connect and reconnect to database function
function connectToDb(callback) {
  const attemptConnection = () => {
    console.log('Connecting to database...')
    connectionInfo.connectTimeout = 2000 // same as setTimeout to avoid server overload 
    connection = mysql.createConnection(connectionInfo)
    connection.connect(function (err) {
      if (err) {
        console.log('Error connecting to database, trying again in 2 secs...')
        connection.destroy() // end immediately failed connection before creating new one
        setTimeout(attemptConnection, 2000)
      } else {
        callback()
      }
    })
    connection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Renewing database connection...');
        } else {
            console.log('database error...', err);
        }
        attemptConnection();
    });

  }
  attemptConnection()
}
// now you simply call it with normal callback
connectToDb( () => {
    console.log("Connected to database!");
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));



//fetch all categories
app.get('/api/api', (req, res) => {

        console.log('Fetching all categories...');
        res.send('it works');
   
});


//user login
app.post('/api/login', (req, res) => {

        const username = req.body.username;
        const password = req.body.password;

        //search for user in DB
        const query = "SELECT * FROM user_list WHERE username=?;";
        connection.query(query, [username], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
        console.log('Fetching user... '+username);

        //if user is found
        if(result.length > 0) {
            //compare password
            bcrypt.compare(password,result[0].password)
            .then(doMatch=>{
                //if password matches
                if(doMatch){
                    console.log('login success...');
                    const token = jwt.sign({user_id:result[0].user_id},JWT_SECRET)
                    res.json({status:1,token});
                    return;
                }else{
                    //if password doesnt match
                    console.log('password invalid...');
                    res.json({status:2,message:'Password is invalid.'});
                    return;
                }
            }).catch(err=>{
                console.log(err);
                return;
            })
        }
        //if no user is found 
        if(result.length === 0) {
            console.log('no user found...');
            res.json({status:3,message:'Username doesn\'t exist.'});
            return;
        }

        console.log('Login attempt...');
        return;

    });
   
});


/***********************************************************************************
************************************************************************************/
//          Main Category Manager Routes
//
//
/***********************************************************************************
************************************************************************************/

//fetch all main categories
app.post('/api/fetch/main_categories', (req, res) => {

    let query = "SELECT * FROM main_category_list ORDER BY main_category_order_index;";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching all main categories...');
        res.send(result);
    });
});

//Add main category
app.post('/api/add/main_category', (req, res) => {


    // if no file uploaded
    if(!req.files) {
            return res.status(400).json({ msg: 'No image uploaded' });
        }

    //set var to file from request
    const file = req.files.file;

    //set upload path
    const uploadPath = cdnDir+'/assets/';
    const timestamp = Date.now();
    const fileName = timestamp+'_'+file.name;
    const filePath = uploadPath+fileName;

    //move file to directory
    file.mv(filePath, err => {

        if(err) {
            console.error(err);
            res.status(400).send(err);
        } 

    })

    //grab rest of form data
    const categoryImgURL = SITE+'assets/'+fileName;
    const categoryName = req.body.categoryName;

    //insert new row
    const query = "INSERT INTO main_category_list (main_category_name, main_category_img_url) VALUES (?, ?);";
    connection.query(query, [categoryName, categoryImgURL], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Adding main category...', result.affectedRows);
        const lastInsertID = result.insertId;

        //update category order index of row with category id (kind of like manual auto increment)
        const query = "UPDATE main_category_list SET main_category_order_index=LAST_INSERT_ID() WHERE main_category_id=LAST_INSERT_ID();";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Adding main category (matching)...', result.affectedRows);

                //fetch updated category list
                let query = "SELECT * FROM main_category_list ORDER BY main_category_order_index;";
                connection.query(query, (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated main categories...');
                    res.send(result);
                });
            

        });
    });
});


//Delete main category
app.post('/api/delete/main_category', (req, res) => {

    const selCategory = req.body.selCategory;
    const query = "DELETE FROM main_category_list WHERE main_category_id=?;";
    connection.query(query, [selCategory], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting main category...', result.affectedRows);


            //fetch updated category list
            let query = "SELECT * FROM main_category_list ORDER BY main_category_order_index;";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching main updated categories...');
                res.send(result);
            });
    });
});


//Move main category
app.post('/api/move/main_category', (req, res) => {

    const currentRowID = req.body.currentRowID;
    const currentRowOrderID = req.body.currentRowOrderID;
    const nextRowID = req.body.nextRowID;
    const nextRowOrderID = req.body.nextRowOrderID;

    //set order index of row above with current one
    const query = "UPDATE main_category_list SET main_category_order_index=? WHERE main_category_id=?;";
    connection.query(query, [currentRowOrderID, nextRowID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Moving current main category...', result.affectedRows);

        //set order index of current row with the one above
        const query = "UPDATE main_category_list SET main_category_order_index=? WHERE main_category_id=?;";
        connection.query(query, [nextRowOrderID, currentRowID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Moving next main category...', result.affectedRows);

            //fetch new update main category list
            let query = "SELECT * FROM main_category_list ORDER BY main_category_order_index;";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated main categories...');
                res.send(result);
            });
        });
    });
});


//edit main category
app.post('/api/edit/main_category', (req, res) => {


    if(req.files) {

        //set var to file from request
        const file = req.files.file;

        //set upload path
        const uploadPath = cdnDir+'/assets/';
        const timestamp = Date.now();
        const fileName = timestamp+'_'+file.name;
        const filePath = uploadPath+fileName;


        //move file to directory
        file.mv(filePath, err => {

            if(err) {
                console.error(err);
                res.status(400).send(err);
            } 

        })

        //grab rest of form data
        const categoryName = req.body.categoryName;
        const selCategory = req.body.selCategory;
        const categoryImgURL = SITE+'assets/'+fileName;


        let query = "UPDATE main_category_list SET main_category_name=?, main_category_img_url=? WHERE main_category_id=?;";
        connection.query(query, [categoryName, categoryImgURL, selCategory], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Editing main category...');

            //fetch updated category list
            let query = "SELECT * FROM main_category_list ORDER BY main_category_order_index;";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated main categories...');
                res.send(result);
            });

        });
    }

    if(!req.files) {

        const categoryName = req.body.categoryName;
        const selCategory = req.body.selCategory;


        let query = "UPDATE main_category_list SET main_category_name=? WHERE main_category_id=?;";
        connection.query(query, [categoryName, selCategory], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Editing main category...');

            //fetch updated category list
            let query = "SELECT * FROM main_category_list ORDER BY main_category_order_index;";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated main categories...');
                res.send(result);
            });

        });
    }
});

/***********************************************************************************
************************************************************************************/
//          Category Manager Routes
//
//
/***********************************************************************************
************************************************************************************/
//fetch all categories
app.get('/api/fetch/categories', (req, res) => {

    let query = "SELECT * FROM category_list ORDER BY category_order_index;";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching all categories...');
        res.send(result);
    });
});



//Add category
app.post('/api/add/category', (req, res) => {


    const categoryName = req.body.categoryName;
    const selMainCategoryID = req.body.selMainCategoryID;

    //insert new row
    const query = "INSERT INTO category_list (category_name, main_category_id) VALUES (?, ?);";
    connection.query(query, [categoryName, selMainCategoryID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Adding category...', result.affectedRows);
        const lastInsertID = result.insertId;

        //update category order index of row with category id (kind of like manual auto increment)
        const query = "UPDATE category_list SET category_order_index=LAST_INSERT_ID() WHERE category_id=LAST_INSERT_ID();";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Adding category (matching)...', result.affectedRows);

                //fetch updated category list
                let query = "SELECT * FROM category_list ORDER BY category_order_index;";
                connection.query(query, (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated categories...');
                    res.send(result);
                });
            

        });
    });
});


//Delete category
app.post('/api/delete/category', (req, res) => {

    const selCategory = req.body.selCategory;
    const query = "DELETE FROM category_list WHERE category_id=?;";
    connection.query(query, [selCategory], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting category...', result.affectedRows);


            //fetch updated category list
            let query = "SELECT * FROM category_list ORDER BY category_order_index;";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated categories...');
                res.send(result);
            });
    });
});


//Move category
app.post('/api/move/category', (req, res) => {

    const currentRowID = req.body.currentRowID;
    const currentRowOrderID = req.body.currentRowOrderID;
    const currentRowMainCatID = req.body.currentRowMainCatID;

    const nextRowID = req.body.nextRowID;
    const nextRowOrderID = req.body.nextRowOrderID;
    const nextRowMainCatID = req.body.nextRowMainCatID;

    //set order index of row above with current one
    const query = "UPDATE category_list SET category_order_index=?, main_category_id=? WHERE category_id=?;";
    connection.query(query, [currentRowOrderID, nextRowMainCatID, nextRowID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Moving current category...', result.affectedRows);

        //set order index of current row with the one above
        const query = "UPDATE category_list SET category_order_index=?, main_category_id=? WHERE category_id=?;";
        connection.query(query, [nextRowOrderID, currentRowMainCatID, currentRowID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Moving next category...', result.affectedRows);

            //fetch new update category list
            let query = "SELECT * FROM category_list ORDER BY category_order_index;";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated categories...');
                res.send(result);
            });
        });
    });
});


//edit category
app.post('/api/edit/category', (req, res) => {

    const categoryName = req.body.categoryName;
    const selCategory = req.body.selCategory;
    const selMainCategoryID = req.body.selMainCategoryID;


    let query = "UPDATE category_list SET category_name=?, main_category_id=? WHERE category_id=?;";
    connection.query(query, [categoryName, selMainCategoryID, selCategory], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Editing category...');

        //fetch updated category list
        let query = "SELECT * FROM category_list ORDER BY category_order_index;";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated categories...');
            res.send(result);
        });

    });
});




/***********************************************************************************
************************************************************************************/
//          Menu Manager Routes
//
//
/***********************************************************************************
************************************************************************************/

//fetch all menu items from category
app.post('/api/fetch/items', (req, res) => {

    const selCategoryID = req.body.selCategoryID;

    let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
    connection.query(query, [selCategoryID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching items from category...');
        res.send(result);
    });
});



//Add item
app.post('/api/add/item', (req, res) => {

    // if no file uploaded
    if(!req.files) {
            return res.status(400).json({ msg: 'No image uploaded' });
        }

    //set var to file from request
    const file = req.files.file;

    //set upload path
    const uploadPath = cdnDir+'/assets/';
    const timestamp = Date.now();
    const fileName = timestamp+'_'+file.name;
    const filePath = uploadPath+fileName;

    //move file to directory
    file.mv(filePath, err => {

        if(err) {
            console.error(err);
            res.status(400).send(err);
        } 
        console.log("Uploading file..."+file.name) 

    })

    //grab rest of form data
    const selCategoryID = req.body.selCategoryID;
    const itemName = req.body.itemName;
    const itemDesc = req.body.itemDesc;
    const itemPrice = req.body.itemPrice;
    const itemImgURL = SITE+'assets/'+fileName;


        //insert new row
        const query = "INSERT INTO item_list (item_name, item_desc, item_price, item_img_url, category_id) VALUES (?, ?, ?, ?, ?);";
        connection.query(query, [itemName, itemDesc, itemPrice, itemImgURL, selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Adding item...', result.affectedRows);

            //update item order index of row with item id (kind of like manual auto increment)
            const query = "UPDATE item_list SET item_order_index=LAST_INSERT_ID() WHERE item_id=LAST_INSERT_ID();";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Adding item (matching)...', result.affectedRows);

                //fetch updated item list
                let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
                connection.query(query, [selCategoryID], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated items...');
                    res.send(result);
                });

            });
        });

  

});


//Edit item
app.post('/api/edit/item', (req, res) => {

    // if file uploaded
    if(req.files) {
            
        //set var to file from request
        const file = req.files.file;

        //set upload path
        const uploadPath = cdnDir+'/assets/';
        const timestamp = Date.now();
        const fileName = timestamp+'_'+file.name;
        const filePath = uploadPath+fileName;


        //move file to directory
        file.mv(filePath, err => {

            if(err) {
                console.error(err);
                res.status(400).send(err);
            }
            console.log("Uploading file..."+file.name) 

        })

        //grab rest of form data
        const selCategoryID = req.body.selCategoryID;
        const selItemID = req.body.selItemID;
        const selItemName = req.body.selItemName;
        const selItemDesc = req.body.selItemDesc;
        const selItemPrice = req.body.selItemPrice;
        const itemImgURL = SITE+'assets/'+fileName;


            //update item row
            const query = "UPDATE item_list SET item_name=?, item_desc=?, item_price=?, item_img_url=? WHERE item_id=?;";
            connection.query(query, [selItemName, selItemDesc, selItemPrice, itemImgURL, selItemID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Editing item...', result.affectedRows);


                //fetch updated item list
                let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
                connection.query(query, [selCategoryID], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated items...');
                    res.send(result);
                });

            });

    }
    if(!req.files) {

        const selCategoryID = req.body.selCategoryID;
        const selItemID = req.body.selItemID;
        const selItemName = req.body.selItemName;
        const selItemDesc = req.body.selItemDesc;
        const selItemPrice = req.body.selItemPrice;


            //update item row
            const query = "UPDATE item_list SET item_name=?, item_desc=?, item_price=? WHERE item_id=?;";
            connection.query(query, [selItemName, selItemDesc, selItemPrice, selItemID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Editing item...', result.affectedRows);


                //fetch updated item list
                let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
                connection.query(query, [selCategoryID], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated items...');
                    res.send(result);
                });

            });
    }

});

//Move item
app.post('/api/move/item', (req, res) => {

    const selCategoryID = req.body.selCategoryID;
    const currentRowID = req.body.currentRowID;
    const currentRowOrderID = req.body.currentRowOrderID;
    const nextRowID = req.body.nextRowID;
    const nextRowOrderID = req.body.nextRowOrderID;

    //set order index of row above with current one
    const query = "UPDATE item_list SET item_order_index=? WHERE item_id=? AND category_id=?;";
    connection.query(query, [currentRowOrderID, nextRowID, selCategoryID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Moving current item...', result.affectedRows);

        //set order index of current row with the one above
        const query = "UPDATE item_list SET item_order_index=? WHERE item_id=? AND category_id=?;";
        connection.query(query, [nextRowOrderID, currentRowID, selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Moving next category...', result.affectedRows);

            //fetch new update item list
            let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
            connection.query(query, [selCategoryID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated items...');
                res.send(result);
            });
        });
    });
});

//Change item category
app.post('/api/change/item', (req, res) => {

    const selItemID = req.body.selItemID;
    const selNewCategoryID = req.body.selNewCategoryID;
    const selCategoryID = req.body.selCategoryID

    const query = "UPDATE item_list SET category_id=? WHERE item_id=?;";
    connection.query(query, [selNewCategoryID, selItemID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Changing item category...', result.affectedRows);
        //fetch updated item list
        let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
        connection.query(query, [selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated items...');
            res.send(result);
        });
    });
});


//Delete item
app.post('/api/delete/item', (req, res) => {

    const selCategoryID = req.body.selCategoryID
    const selItemID = req.body.selItemID;

    const query = "DELETE FROM item_list WHERE item_id=?;";
    connection.query(query, [selItemID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting item...', result.affectedRows);
        //fetch updated category list
        let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
        connection.query(query, [selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated items...');
            res.send(result);
        });
    });
});


//Enable or Disable item
app.post('/api/toggle/item', (req, res) => {

    const selCategoryID = req.body.selCategoryID
    const selItemID = req.body.selItemID;
    const disabled = req.body.disabled;

    const query = "UPDATE item_list SET disabled=? WHERE item_id=?;";
    connection.query(query, [disabled, selItemID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Toggling item...', result.affectedRows);
        //fetch updated item list
        let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index;";
        connection.query(query, [selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated items...');
            res.send(result);
        });
    });
});


/***********************************************************************************
************************************************************************************/
//          Customer Front Routes
//
//
/***********************************************************************************
************************************************************************************/


//fetch all menu items from category that aren't disabled
app.post('/api/fetch/front/items', (req, res) => {

    let query = "SELECT * FROM item_list WHERE disabled=0 ORDER BY item_order_index;";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching items...');
        res.send(result);
    });
});



app.post('/api/place/order', (req, res) => {

    const cartToken = req.body.cartToken;
    const cart = req.body.cart;

            let query = "INSERT INTO session_list (cart_token, expiry) VALUES (?, now() + interval 2 DAY);";
            connection.query(query, [cartToken], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Placing new order...');

                const lastInsertID = result.insertId;

                Promise.all(              
                    cart.map((item) => {
                        let query = "INSERT INTO in_cart (session_id, item_id, quantity) VALUES (?, ?, ?)";
                        connection.query(query, [lastInsertID, item.itemID, item.itemQty], (err, result) => {
                            if(err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log('Adding item to new order...');
                        });
                    })
                ).then((result) => {

                    res.send(result);
                    
                })
                .catch((e) => {
                console.log("error ", e)}); 
            });

});

//fetch all menu items from category that aren't disabled
app.post('/api/fetch/order', (req, res) => {

    const cartToken = req.body.cartToken;

    let query = "SELECT t1.session_id, t1.expiry, t2.item_id, t2.quantity, t3.item_name, t3.item_price, t4.category_name FROM session_list AS t1 INNER JOIN in_cart AS t2 ON t2.session_id = t1.session_id INNER JOIN item_list AS t3 ON t3.item_id = t2.item_id INNER JOIN category_list AS t4 ON t4.category_id = t3.category_id WHERE t1.cart_token=? ORDER BY category_order_index;";
    connection.query(query, [cartToken], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching cart order...');
        res.send(result);
    });
});

/***********************************************************************************
************************************************************************************/
//          Admin Panel Routes
//
//
/***********************************************************************************
************************************************************************************/


//fetch all menu items from category that aren't disabled
app.post('/api/fetch/admin/config', (req, res) => {

    let query = "SELECT * FROM config_list;";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching admin config...');
        res.send(result);
    });
});

//fetch all menu items from category that aren't disabled
app.post('/api/toggle/admin/cart', (req, res) => {

    const cartDisabled = req.body.cartDisabled;
    console.log(cartDisabled);

    let query = "UPDATE config_list SET cart_disabled=? WHERE config_id=0;";
    connection.query(query, [cartDisabled], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Toggling cart system...');

        let query = "SELECT * FROM config_list;";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching admin config...');
            res.send(result);
        });
    });
});

