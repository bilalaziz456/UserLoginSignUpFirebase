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


let ref = db.ref().child('User Information');
let host, link;
router.post('/createAccount', jsonParser, function (req, res) {
    let userInfo = {
        'first_name': req.body.firstName,
        'last_name': req.body.lastName,
        'email': req.body.email,
        'password': req.body.password,
        'status': 0,
        'product_key': '',
        'roles' : 1
    };
    //let usersInfoRef = ref.child('User Information');
    ref.push(userInfo);
    host = req.get('host');
    link = "http://" + req.get('host') + "/verifyEmail?id=" + req.body.email;

    let mailOptions = {
        from: '"Admin" <testadnandash07@gmail.com>',
        to: req.body.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    };
    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            res.end("error");
        } else {
            res.send({message: "Verify email", email : req.body.email});
        }
    });

});

router.get('/verifyEmail', (req, res) => {
    let productKey = Math.random().toString(11).slice(2);
    ref.orderByChild('email').limitToFirst(1).equalTo(req.query.id).on('value', (snap) => {
        if(snap.val() !== null) {
            db.ref('User Information/'+Object.keys(snap.val())[0]+'').update({status : 1, product_key : productKey}).then(() =>{
                let mailOptions = {
                    from: '"Admin" <testadnandash07@gmail.com>',
                    to: req.query.id,
                    subject: "Product Key",
                    html: 'Hello,<br> Your product key is <b>'+productKey+'</b>'
                };
                transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        res.end("error");
                    } else {
                        res.redirect('http://localhost:3000');
                    }
                });
            });

        }
    });
});
router.post('/login', jsonParser, (req, res) => {
    let productKeyValue = '';
    let role = 0;
    let queryEmail = ref.orderByChild('email').equalTo(req.body.email);
    queryEmail.on('value', (snap) => {
        if (snap.val() === null) {
            res.send({message: 'Email doest not exist'})
        } else {
            ref.orderByChild('password').equalTo(req.body.password).on('value', (snap) => {
                if (snap.val() === null) {
                    res.send({message: 'Password is not correct'})
                } else {
                    ref.orderByChild('status').equalTo(1).on('value', (snap) => {
                        if (snap.val() === null) {
                            res.send({message: 'Verify your email'})
                        } else {
                            snap.forEach(function(childSnapshot) {
                               if(childSnapshot.val().email === req.body.email) {
                                   productKeyValue = childSnapshot.val().product_key;
                                   role = childSnapshot.val().roles
                               }
                            });
                            res.send({message: 'Login successful', productKey : productKeyValue, role : role});
                        }
                    })
                }
            })
        }
    });
});

module.exports = router;
