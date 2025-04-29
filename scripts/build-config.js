const fs = require('fs');
const path = require('path');

// Create the config content
const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  },
  emailjs: {
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID
  }
};

// Helper function to copy a file or directory
function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Create the output directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy static files
const staticFiles = ['index.html', 'styles', 'scripts'];
for (const file of staticFiles) {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
  }
}

// Write the config file
const configContent = `window.config = ${JSON.stringify(config, null, 2)};`;
fs.writeFileSync(path.join(publicDir, 'config.js'), configContent);

console.log('Build completed successfully!'); 