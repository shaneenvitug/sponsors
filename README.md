# Wedding Primary Sponsors Invite

A beautiful, digital invitation page for wedding primary sponsors (Ninong and Ninang).

## Features

- Personalized invitations using URL parameters
- Beautiful, minimalist design
- Response tracking with Firebase
- Email notifications via EmailJS
- Mobile-responsive layout

## Setup

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Create `scripts/config.js` using the template in `scripts/config.example.js`:
```javascript
const config = {
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
    measurementId: "YOUR_FIREBASE_MEASUREMENT_ID"
  },
  emailjs: {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID"
  }
};
```

3. Serve the project using a local server (e.g., Live Server in VS Code)

## Usage

Access the invitation by opening the URL with the following parameters:
```
http://[your-domain]/index.html?guest=[GuestName]&role=[Ninong/Ninang]
```

Example:
```
http://localhost:5500/index.html?guest=Juan%20Dela%20Cruz&role=Ninong
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Firebase (Firestore)
- EmailJS
- Google Fonts (Julius Sans One) 