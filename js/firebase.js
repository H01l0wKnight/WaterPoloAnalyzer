import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyCTvhEP37XzPOm2Y81qSYFrlU9KyxJr138",

authDomain: "waterpoloanalyzer.firebaseapp.com",

projectId: "waterpoloanalyzer",

storageBucket: "waterpoloanalyzer.firebasestorage.app",

messagingSenderId: "168983018272",

appId: "1:168983018272:web:6c3b32c9dfd021775f7545"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
