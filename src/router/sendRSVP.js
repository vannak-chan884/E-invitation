// src/router/sendRSVP.js
import emailjs from "emailjs-com";

// Function to send RSVP
export const sendRSVP = (formData, onSuccess, onError) => {
  emailjs
    .send(
      "naknoy",  // Replace with your EmailJS Service ID
      "naknoy", // Replace with your EmailJS Template ID
      formData,        // ✅ Use formData instead of undefined templateParams
      "BDpXdwLquvj4nlQS0"   // Replace with your EmailJS Public Key
    )
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      onError(error);
    });
};

