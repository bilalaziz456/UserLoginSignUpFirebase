const express = require('express');
const bodyParser = require('body-parser');
const db = require("./connection");
const nodeMailer = require('nodemailer');

let router = express.Router();
let jsonParser = bodyParser.json();
let transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 25,
    auth: {
        user: 'testadnandash07@gmail.com',
        pass: 'Test123@4adiadnan007'
    },
    tls: {
        rejectUnauthorized: false
    }
});

let ref = db.ref().child('Product');
router.post('/addInventory' , jsonParser, (req, res) => {
    ref.set({
        inventory : req.body.inventory
    }).then(() => {
        res.send({message : 'Inventory added'})
    })
});

router.get('/purchase', jsonParser, (req, res) => {
    let inventoryDeduct;
    ref.orderByChild('inventory').once('value').then((snap) => {
        inventoryDeduct = snap.val().inventory - 1;
        ref.update({
            inventory : inventoryDeduct
        }).then(() => {
            if(inventoryDeduct < 3 && inventoryDeduct > 0){
                let mailOptions = {
                    from: '"Admin" <testadnandash07@gmail.com>',
                    to: 'testadnandash07@gmail.com',
                    subject: "Running out of Stock",
                    html: "Product is getting out of stock. Total inventory left <b>"+inventoryDeduct+"</b>"
                };
                transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        res.end("error");
                    }
                });
            }
            if(inventoryDeduct === 0) {
                let mailOptions = {
                    from: '"Admin" <testadnandash07@gmail.com>',
                    to: 'testadnandash07@gmail.com',
                    subject: "Out of Stock",
                    html: "Product is <b>out of stock.</b>"
                };
                transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        res.end("error");
                    } else {
                        res.send({message : 'Out of stock'})
                    }
                });
            }
        })
    })


});
module.exports = router;