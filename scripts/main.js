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
    if (typeof config !== 'undefined') {
      // Initialize EmailJS
      emailjs.init(config.emailjs.publicKey);

      // Firebase config and initialization
      firebase.initializeApp(config.firebase);
      const db = firebase.firestore();

      // Log page opened
      db.collection("responses").doc(guest).set({
        opened: new Date()
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

          emailjs.send(
            config.emailjs.serviceId,
            config.emailjs.templateId,
            {
              guest: guest,
              role: role,
              response: answer,
              respondedAt: respondedAt
            }
          ).catch(err => {
            console.error('Error sending email:', err);
          });
        }).catch(err => {
          console.error("Error writing response:", err);
        });
      };
    } else {
      console.warn('Config not found - Firebase and EmailJS features will be disabled');
      // Basic response handler without Firebase/EmailJS
      window.submitResponse = function(answer) {
        document.getElementById('responseMsg').innerText = "Thank you for your response!";
        document.getElementById('responseBtns').style.display = 'none';
      };
    }
  } catch (error) {
    console.error('Service initialization error:', error);
    // Basic response handler without Firebase/EmailJS
    window.submitResponse = function(answer) {
      document.getElementById('responseMsg').innerText = "Thank you for your response!";
      document.getElementById('responseBtns').style.display = 'none';
    };
  }
}); 