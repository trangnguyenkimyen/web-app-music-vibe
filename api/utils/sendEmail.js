const { google } = require('googleapis');
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (email, subject, url) => {
    try {

        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: 'vibemusicappvn@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // Cấu hình các tùy chọn handlebars cho transporter
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.hbs',
                partialsDir: path.resolve('./views'),
                defaultLayout: ''
            },
            viewPath: path.resolve('./views/'),
            extName: '.hbs'
        }));

        await transporter.sendMail({
            from: '"vibe" <vibemusicappvn@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line               
            template: 'mail', // html body  
            context: {
                url: url
            }
        });

        console.log("Email sent successfully");
    } catch (err) {
        console.error(err);
    }
};

const resetPassword = async (email, username, subject, url) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: 'vibemusicappvn@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // Cấu hình các tùy chọn handlebars cho transporter
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.hbs',
                partialsDir: path.resolve('./views'),
                defaultLayout: ''
            },
            viewPath: path.resolve('./views/'),
            extName: '.hbs'
        }));

        await transporter.sendMail({
            from: '"vibe" <vibemusicappvn@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line               
            template: 'resetPass', // html body  
            context: {
                url: url,
                username: username
            }
        });

        console.log("Email sent successfully");
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    sendEmail,
    resetPassword
};