// firebase-admin.js
const admin = require('firebase-admin');

// Only initialize Firebase if credentials are provided (skip in test environments)
if (!admin.apps.length) {
  const hasFirebaseCredentials =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL;

  if (hasFirebaseCredentials) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('✅ Firebase Admin initialized');
  } else if (process.env.NODE_ENV === 'test') {
    console.log('⚠️ Running in test mode without Firebase credentials');
  } else {
    console.warn('⚠️ Firebase credentials not found. Firebase features will be unavailable.');
  }
}

module.exports = admin;
