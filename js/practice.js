import { db } from "./firebase.js";

import {

collection,
addDoc,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const playersRef = collection(db,"players");
const practiceRef = collection(db,"practice");
