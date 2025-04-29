// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get URL parameters first - this should work regardless of other initialization
  const urlParams = new URLSearchParams(window.location.search);
  const guest = decodeURIComponent(urlParams.get('guest') || 'Guest');
  const role = decodeURIComponent(urlParams.get('role') || 'Ninong');

  console.log('URL Parameters:', { guest, role }); // Debug log

  let roleType = 'godparent';
  if (role.toLowerCase() === 'ninong') {
    roleType = 'godfather';
  } else if (role.toLowerCase() === 'ninang') {
    roleType = 'godmother';
  }

  // Update DOM elements
  const guestNameEl = document.getElementById('guestName');
  const roleTypeEl = document.getElementById('roleType');
  const roleTitleEl = document.getElementById('roleTitle');

  if (guestNameEl) guestNameEl.textContent = guest;
  if (roleTypeEl) roleTypeEl.textContent = roleType;
  if (roleTitleEl) roleTitleEl.textContent = role;

  // Try to initialize Firebase and EmailJS
  try {
    if (typeof window.config === 'undefined') {
      throw new Error('Configuration object not found');
    }

    // Validate Firebase config
    const requiredFirebaseFields = ['apiKey', 'authDomain', 'projectId'];
    const missingFields = requiredFirebaseFields.filter(field => 
      !window.config.firebase[field] || window.config.firebase[field].includes('%')
    );
    
    if (missingFields.length > 0) {
      throw new Error(`Missing or invalid Firebase config fields: ${missingFields.join(', ')}`);
    }

    console.log('Initializing Firebase with config:', {
      projectId: window.config.firebase.projectId,
      authDomain: window.config.firebase.authDomain
    });

    // Initialize Firebase
    firebase.initializeApp(window.config.firebase);
    const db = firebase.firestore();

    // Initialize EmailJS if config exists
    if (window.config.emailjs && window.config.emailjs.publicKey) {
      emailjs.init(window.config.emailjs.publicKey);
    }

    // Log page opened
    db.collection("responses").doc(guest).set({
      opened: new Date(),
      guest: guest,
      role: role
    }, { merge: true }).catch(err => {
      console.error('Error logging page open:', err);
    });

    // Set up response handler
    window.submitResponse = function(answer) {
      const respondedAt = new Date();
      
      db.collection("responses").doc(guest).set({
        response: answer,
        respondedAt: respondedAt
      }, { merge: true }).then(() => {
        document.getElementById('responseMsg').innerText = "Thank you for your response!";
        document.getElementById('responseBtns').style.display = 'none';

        if (window.config.emailjs && window.config.emailjs.serviceId && window.config.emailjs.templateId) {
          emailjs.send(
            window.config.emailjs.serviceId,
            window.config.emailjs.templateId,
            {
              guest: guest,
              role: role,
              response: answer,
              respondedAt: respondedAt
            }
          ).catch(err => {
            console.error('Error sending email:', err);
          });
        }
      }).catch(err => {
        console.error("Error writing response:", err);
        document.getElementById('responseMsg').innerText = "Thank you! Your response has been recorded.";
        document.getElementById('responseBtns').style.display = 'none';
      });
    };
  } catch (error) {
    console.error('Service initialization error:', error);
    // Basic response handler without Firebase/EmailJS
    window.submitResponse = function(answer) {
      document.getElementById('responseMsg').innerText = "Thank you for your response!";
      document.getElementById('responseBtns').style.display = 'none';
    };
  }
}); 