import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==========================
// Firestore
// ==========================

const playerRef = collection(db, "players");
const practiceRef = collection(db, "practice");

// ==========================
// HTML
// ==========================

const playerSelect = document.getElementById("player");
const dateInput = document.getElementById("date");
const menuSelect = document.getElementById("menu");
const resultSelect = document.getElementById("result");
const saveBtn = document.getElementById("saveBtn");

const table = document.getElementById("practiceTable");

const court = document.getElementById("court");

const positionText = document.getElementById("position");

// 今日の日付

dateInput.valueAsDate = new Date();

// ==========================
// 選手読込
// ==========================

async function loadPlayers() {

    playerSelect.innerHTML =
        '<option value="">選手を選択</option>';

    const snapshot = await getDocs(playerRef);

    snapshot.forEach((docSnap) => {

        const p = docSnap.data();

        const option = document.createElement("option");

        option.value = p.name;

        option.textContent =
            p.number + "  " + p.name;

        playerSelect.appendChild(option);

    });

}

loadPlayers();

// ==========================
// コートクリック
// ==========================

let clickX = 0;
let clickY = 0;

court.addEventListener("click", (e) => {

    const rect = court.getBoundingClientRect();

    clickX = Math.round(e.clientX - rect.left);

    clickY = Math.round(e.clientY - rect.top);

    positionText.textContent =
        "X : " + clickX +
        "   Y : " + clickY;

});

// ==========================
// エリア判定
// ==========================

function getArea(x, y) {

    if (x < 300)
        return "左";

    if (x > 600)
        return "右";

    if (y < 150)
        return "上";

    if (y > 300)
        return "下";

    return "中央";

}
// ==========================
// マーカー表示
// ==========================

function createMarker(x, y, result) {

    const marker = document.createElement("div");

    marker.classList.add("marker");

    if (result == "goal") {

        marker.classList.add("goalShot");

    } else if (result == "miss") {

        marker.classList.add("missShot");

    } else {

        marker.classList.add("gkShot");

    }

    marker.style.left = x + "px";

    marker.style.top = y + "px";

    court.appendChild(marker);

}

// ==========================
// 登録
// ==========================

saveBtn.addEventListener("click", async () => {

    if (playerSelect.value == "") {

        alert("選手を選択してください");

        return;

    }

    if (clickX == 0 && clickY == 0) {

        alert("コートをクリックしてください");

        return;

    }

    const data = {

        player: playerSelect.value,

        date: dateInput.value,

        menu: menuSelect.value,

        result: resultSelect.value,

        x: clickX,

        y: clickY,

        area: getArea(clickX, clickY),

        createdAt: serverTimestamp()

    };

    await addDoc(practiceRef, data);

    createMarker(

        clickX,

        clickY,

        resultSelect.value

    );

    alert("登録しました");

});

// ==========================
// 記録一覧
// ==========================

function resultText(result) {

    switch (result) {

        case "goal":

            return "ゴール";

        case "miss":

            return "外れ";

        case "gk":

            return "GKセーブ";

        default:

            return result;

    }

}
// ==========================
// 一覧表示
// ==========================

onSnapshot(practiceRef, (snapshot) => {

    table.innerHTML = "";

    // 以前のマーカーを削除
    document.querySelectorAll(".marker").forEach(marker => {
        marker.remove();
    });

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        // ----- 表 -----

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${data.date ?? ""}</td>

            <td>${data.player}</td>

            <td>${data.menu}</td>

            <td>${resultText(data.result)}</td>

            <td>${data.area}</td>

            <td>

                <button class="deleteBtn" data-id="${docSnap.id}">

                    削除

                </button>

            </td>

        `;

        table.appendChild(tr);

        // ----- コートへマーカー表示 -----

        if (typeof data.x === "number" && typeof data.y === "number") {

            createMarker(

                data.x,

                data.y,

                data.result

            );

        }

    });

    // ==========================
    // 削除ボタン
    // ==========================

    document.querySelectorAll(".deleteBtn").forEach(button => {

        button.addEventListener("click", async () => {

            if (!confirm("この記録を削除しますか？")) {

                return;

            }

            await deleteDoc(

                doc(

                    db,

                    "practice",

                    button.dataset.id

                )

            );

        });

    });

});
