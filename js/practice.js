import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ----------------------
// HTML取得
// ----------------------

const playerSelect = document.getElementById("player");
const dateInput = document.getElementById("date");

// ----------------------
// 今日の日付を自動入力
// ----------------------

const today = new Date();

dateInput.value = today.toISOString().split("T")[0];

// ----------------------
// Firebase
// ----------------------

const playersRef = collection(db, "players");

// ----------------------
// 選手読み込み
// ----------------------

async function loadPlayers() {

    playerSelect.innerHTML = "";

    try {

        const snapshot = await getDocs(playersRef);

        if (snapshot.empty) {

            playerSelect.innerHTML =
                "<option>選手が登録されていません</option>";

            return;
        }

        snapshot.forEach((doc) => {

            const player = doc.data();

            const option = document.createElement("option");

            option.value = doc.id;

            option.textContent =
                `${player.number}　${player.name}（${player.position}）`;

            playerSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("選手の取得に失敗しました");

    }

}

// ----------------------
// 初期処理
// ----------------------

loadPlayers();
