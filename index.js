const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Set your SendGrid API key here
sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

// Function to send an email using SendGrid
const sendEmail = (eventType, data) => {
  const msg = {
    to: "recipient@example.com", // Replace with recipient's email address
    from: "sender@example.com",   // Replace with sender's email address
    subject: `Firestore Document ${eventType}`,
    text: `Document ID: ${data.id} \nData: ${JSON.stringify(data)}`,
  };

  // Send the email using SendGrid
  sgMail.send(msg)
    .then(() => {
      console.log(`Email sent for ${eventType} event`);
    })
    .catch((error) => {
      console.error(`Error sending email: ${error}`);
    });
};

// Cloud Function triggered when a document is created, updated, or deleted
exports.firestoreListener = functions.firestore
  .document("yourCollection/{documentId}") // Replace with your Firestore collection path
  .onWrite((change, context) => {
    // Determine the event type (created, updated, or deleted)
    const eventType = change.after.exists ? "updated" : "deleted";
    
    // Get the document data based on the event type
    const data = change.after.exists ? change.after.data() : change.before.data();
    
    // Call the sendEmail function to send an email
    sendEmail(eventType, { id: context.params.documentId, data });

    // The function doesn't return any value, so we return null
    return null;
  });
