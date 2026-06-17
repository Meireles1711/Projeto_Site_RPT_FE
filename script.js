  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB4WxTlKWLc_tXx5jlNURmHKfz9P1xYc2Q",
    authDomain: "nvstore-3b5a1.firebaseapp.com",
    projectId: "nvstore-3b5a1",
    storageBucket: "nvstore-3b5a1.firebasestorage.app",
    messagingSenderId: "792835163032",
    appId: "1:792835163032:web:7fb21222bc3f24a46161ed",
    measurementId: "G-0B69NX091W"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);