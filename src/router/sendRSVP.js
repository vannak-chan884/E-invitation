// src/router/sendRSVP.js
import emailjs from "emailjs-com";

// Function to send RSVP
export const sendRSVP = (formData, onSuccess, onError) => {
  emailjs
    .send(
      "e-invitation",  // Replace with your EmailJS Service ID
      "e-invitation", // Replace with your EmailJS Template ID
      formData,        // ✅ Use formData instead of undefined templateParams
      "C36o8eMJ0mZJezG-s"   // Replace with your EmailJS Public Key
    )
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      onError(error);
    });
};

