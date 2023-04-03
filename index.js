const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const axios = require('axios');
const nodemailer = require('nodemailer');
const CLIENT_ID = '358956356096-0v8h0vu7alqn4cbe540v22mvt7mp7tg6.apps.googleusercontent.com';
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'http://localhost:8000';
const REFRESH_TOKEN = '';
const multer = require('multer');
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/attachments')) // set your desired upload directory here
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // use the original filename
    }
});
const upload = multer({ storage: storage });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/js', express.static(__dirname + '/js'));

app.use(express.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/', (request, response) => {
    fs.readFile('./index.html' ,(error, data) => {
        if(error) {
            console.error('Error Reading home.html file', error);
            return response.end('ERROR');
        }
        else {
            return response.end(data);
        }
    });
});

app.get('/options', (request, response) => {
    fs.readFile('./options.html', (error, data) => {
        if (error) {
            console.error('Error Reading home.html file', error);
            return response.end('ERROR');
        }
        else {
            return response.end(data);
        }
    });
});

app.post('/send', upload.array('attachment'), async(request, response) => {
    console.log(request.body);
    console.log(request.file);
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: 'OAuth2',
                user: request.body.sender,
                //clientSecret: CLIENT_SECRET,
                //refreshToken: REFRESH_TOKEN,
                accessToken: request.body.access_token,
            },
        });
        if(request.files) {
            const mailOptions = {
                from: request.body.sender,
                to: [request.body.receiver],
                subject: request.body.subject,
                text: request.body.message,
                attachments: request.files.map(file => ({
                    filename : file.originalname,
                    path : file.path
                }))
            };
            const result = await transport.sendMail(mailOptions);
            console.log(result);
            return response.send(result);
        }else{
            const mailOptions = {
                from: request.body.sender,
                to: [request.body.receiver],
                subject: request.body.subject,
                text: request.body.message,
            };
            const result = await transport.sendMail(mailOptions);
            console.log(result);
            return response.send(result);
        }
    } catch (error) {
        console.log(error);
    }
    console.log('Mail Sent');
    return response.json({message : 'Mail Sent'});
})


app.listen(8000 , (error) => {
    if(error) console.error('Error in Starting Express Server on port 8000', error);
    else console.log('Success in starting Express Server on port 8000');
});
