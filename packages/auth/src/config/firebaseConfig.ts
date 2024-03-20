import * as admin from 'firebase-admin';

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(process.env.path_to_credential as admin.ServiceAccount),
  storageBucket: 'clone-facebook-3caa4.appspot.com'
});

// Cloud storage
const bucket: any = admin.storage().bucket();

export { bucket };
