require("dotenv").config();

const express = require("express");
const app = express.Router();
const nodemailer = require("nodemailer");

app.get('/', (req, res) => {
    res.send({ message: "Send contact using POST"})
});

app.post('/', (req, res) => {
    const {name, email, contact, message} = req.body
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465, 
        secure: true,
        auth: {
            user: process.env.MAIL, 
            pass: process.env.PASS
        }
    });

    var mailOptions = {
        from: email,
        to: "ddk2707@gmail.com",
        subject: `${contact}`,
        text: `Name: ${name}
        Email: ${email}
        contacted you with this message: ${message}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(400).send({message: "Email could not be sent" + error})
        } else {
            console.log('Email sent: ' + info,response);
            res,send({ message: "Message sent successfully"})
        }
    });
})

module.exports = app