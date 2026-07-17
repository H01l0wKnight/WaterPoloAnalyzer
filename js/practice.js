import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp
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
    // ----------------------
// コートクリック
// ----------------------

const court = document.getElementById("court");
const positionText = document.getElementById("position");

let clickX = 0;
let clickY = 0;

court.addEventListener("click", (e) => {

    const rect = court.getBoundingClientRect();

    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;

    positionText.textContent =
        `X:${Math.round(clickX)}  Y:${Math.round(clickY)}`;

    // 古いマーカーを削除
    const oldMarker = document.querySelector(".tempMarker");
    if (oldMarker) {
        oldMarker.remove();
    }

    // 新しいマーカー
    const marker = document.createElement("div");

    marker.className = "marker tempMarker";

    marker.style.left = clickX + "px";
    marker.style.top = clickY + "px";

    court.appendChild(marker);

});

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
