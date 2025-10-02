// firebaseAdmin.js
require('dotenv').config();
const admin = require('firebase-admin');

const initializeFirebase = () => {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Production: Use environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } else {
    // Development: Use service account file
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
};

initializeFirebase();

module.exports = admin;
