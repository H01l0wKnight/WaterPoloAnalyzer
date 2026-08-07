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
const matchRef = collection(db, "match");

// ==========================
// HTML
// ==========================

const playerSelect = document.getElementById("player");
const dateInput = document.getElementById("date");
const quarterSelect = document.getElementById("quarter");
const timeInput = document.getElementById("time");
const menuSelect = document.getElementById("menu");
const resultSelect = document.getElementById("result");
const saveBtn = document.getElementById("saveBtn");

const table = document.getElementById("matchTable");

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
// 上半分 = 右
// 下半分 = 左
// ==========================

function getArea(x, y) {

    const centerY = court.clientHeight / 2;

    if (y < centerY) {

        return "右";

    }

    return "左";

}

// ==========================
// マーカー表示
// ==========================

function createMarker(x, y, result) {

    const marker = document.createElement("div");

    marker.classList.add("marker");

    switch (result) {

        case "goal":
            marker.classList.add("goalShot");
            break;

        case "miss":
            marker.classList.add("missShot");
            break;

        case "gk":
            marker.classList.add("gkShot");
            break;

    }

    marker.style.left = x + "px";
    marker.style.top = y + "px";

    court.appendChild(marker);

}

// ==========================
// マーカー全削除
// ==========================

function clearMarkers() {

    document.querySelectorAll(".marker").forEach(marker => {

        marker.remove();

    });

}
// ==========================
// 登録
// ==========================

saveBtn.addEventListener("click", async () => {

    if (playerSelect.value === "") {

        alert("選手を選択してください");
        return;

    }

    if (clickX === 0 && clickY === 0) {

        alert("コートをクリックしてください");
        return;

    }

    const data = {

        player: playerSelect.value,

        date: dateInput.value,

        quarter: quarterSelect.value,

        time: timeInput.value,

        menu: menuSelect.value,

        result: resultSelect.value,

        x: clickX,

        y: clickY,

        area: getArea(clickX, clickY),

        createdAt: serverTimestamp()

    };

    try {

        await addDoc(matchRef, data);

        alert("登録しました");

        // 次回入力のために座標表示をリセット
        positionText.textContent =
            "コートをクリックしてください";

        clickX = 0;
        clickY = 0;

    } catch (error) {

        console.error(error);

        alert("保存に失敗しました");

    }

});

// ==========================
// 結果表示
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
// リアルタイム一覧表示
// ==========================

onSnapshot(matchRef, (snapshot) => {

    table.innerHTML = "";

    // コート上のマーカーを一度削除
    clearMarkers();

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        // ----- 表 -----

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${data.date ?? ""}</td>

            <td>${data.quarter ?? ""}</td>

            <td>${data.time ?? ""}</td>

            <td>${data.player}</td>

            <td>${data.menu}</td>

            <td>${resultText(data.result)}</td>

            <td>${data.area}</td>

            <td>

                <button
                    class="deleteBtn"
                    data-id="${docSnap.id}">

                    削除

                </button>

            </td>

        `;

        table.appendChild(tr);

        // ----- マーカー表示 -----

        if (
            typeof data.x === "number" &&
            typeof data.y === "number"
        ) {

            createMarker(
                data.x,
                data.y,
                data.result
            );

        }

    });

    // ==========================
    // 削除処理
    // ==========================

    document.querySelectorAll(".deleteBtn").forEach(button => {

        button.addEventListener("click", async () => {

            if (!confirm("この記録を削除しますか？")) {

                return;

            }

            try {

                await deleteDoc(
                    doc(
                        db,
                        "match",
                        button.dataset.id
                    )
                );

            } catch (error) {

                console.error(error);

                alert("削除に失敗しました");

            }

        });

    });

});
