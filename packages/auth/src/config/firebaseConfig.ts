import * as admin from 'firebase-admin';
// Initialize firebase admin SDK

admin.initializeApp({
  credential: admin.credential.cert('/home/hungnguyen/Tài liệu/doan/packages/auth/src/key.json'),
  storageBucket: 'clone-facebook-3caa4.appspot.com'
});

function uploadFile(file: any) {
  const newNameFile = new Date().toISOString() + file.originalname;
  const blob = bucket.file(newNameFile);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });
  console.log(bucket.name);
  console.log(blob.name);
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
  return new Promise((resolve, reject) => {
    blobStream.on('error', function (err: any) {
      reject(err);
    });

    blobStream.on('finish', () => {
      resolve({
        filename: newNameFile,
        url: publicUrl,
      });
    });

    blobStream.end(file.buffer);
  });
}

// Cloud storage
const bucket: any = admin.storage().bucket();

export { bucket, uploadFile};
