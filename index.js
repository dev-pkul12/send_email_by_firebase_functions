const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Set your SendGrid API key here
sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

const sendEmail = (eventType, data) => {
    const msg = {
        to: "recipient@example.com",
        from: "sender@example.com",
        subject: `Firestore Document ${eventType}`,
        text: `Document ID: ${data.id} \nData: ${JSON.stringify(data)}`,
    };

    sgMail.send(msg).then(() => {
        console.log(`Email sent for ${eventType} event`);
    }).catch((error) => {
        console.error(`Error sending email: ${error}`);
    });
};