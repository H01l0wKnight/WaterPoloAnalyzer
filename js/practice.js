import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==========================
// HTML取得
// ==========================

const playerSelect = document.getElementById("player");
const dateInput = document.getElementById("date");
const court = document.getElementById("court");
const positionText = document.getElementById("position");
const saveBtn = document.getElementById("saveBtn");

// ==========================
// 今日の日付
// ==========================

const today = new Date();
dateInput.value = today.toISOString().split("T")[0];

// ==========================
// Firestore
// ==========================

const playersRef = collection(db, "players");
const practiceRef = collection(db, "practice");

// ==========================
// クリック座標
// ==========================

let clickX = null;
let clickY = null;

// ==========================
// コートクリック
// ==========================

court.addEventListener("click", (e) => {

    const rect = court.getBoundingClientRect();

    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;

    positionText.textContent =
        `X:${Math.round(clickX)}  Y:${Math.round(clickY)}`;

    // 古いマーカー削除
    const oldMarker = document.querySelector(".tempMarker");

    if (oldMarker) {
        oldMarker.remove();
    }

    // 新しいマーカー
    const marker = document.createElement("div");

    marker.className = "marker tempMarker";

    const result = document.getElementById("result").value;

    if(result==="goal"){

        marker.classList.add("goalShot");

    }else if(result==="miss"){

        marker.classList.add("missShot");

    }else{

        marker.classList.add("gkShot");

    }

    marker.style.left = clickX + "px";
    marker.style.top = clickY + "px";

    court.appendChild(marker);

});

// ==========================
// 選手読み込み
// ==========================

async function loadPlayers(){

    playerSelect.innerHTML="";

    try{

        const snapshot = await getDocs(playersRef);

        if(snapshot.empty){

            playerSelect.innerHTML =
            "<option>選手が登録されていません</option>";

            return;

        }

        snapshot.forEach((doc)=>{

            const player = doc.data();

            const option = document.createElement("option");

            option.value = doc.id;

            option.textContent =
                `${player.number} ${player.name} (${player.position})`;

            playerSelect.appendChild(option);

        });

    }

    catch(error){

        console.error(error);

        alert("選手の取得に失敗しました");

    }

}

// ==========================
// 練習記録保存
// ==========================

saveBtn.addEventListener("click", savePractice);

async function savePractice(){

    if(clickX===null || clickY===null){

        alert("コートをクリックしてください");

        return;

    }

    const playerId = playerSelect.value;

    const playerName =
        playerSelect.options[playerSelect.selectedIndex].text;

    const date = dateInput.value;

    const menu =
        document.getElementById("menu").value;

    const result =
        document.getElementById("result").value;

    try{

        await addDoc(practiceRef,{

            playerId,
            playerName,
            date,
            menu,
            result,
            x:Math.round(clickX),
            y:Math.round(clickY),
            createdAt:serverTimestamp()

        });

        alert("登録しました！");

    }
    clickX = null;
clickY = null;

positionText.textContent =
"コートをクリックしてください";

const marker =
document.querySelector(".tempMarker");

if(marker){

    marker.remove();

}

    catch(error){

        console.error(error);

        alert("保存に失敗しました");

    }

}

// ==========================
// 初期処理
// ==========================

loadPlayers();
// ==========================
// 練習一覧
// ==========================

const table = document.getElementById("practiceTable");

const practiceQuery = query(
    practiceRef,
    orderBy("createdAt","desc")
);

onSnapshot(practiceQuery,(snapshot)=>{

    table.innerHTML="";

    snapshot.forEach((doc)=>{

        const data = doc.data();

        let result="";

        switch(data.result){

            case "goal":

                result="ゴール";

                break;

            case "miss":

                result="外れ";

                break;

            case "gk":

                result="GKセーブ";

                break;

        }

        table.innerHTML +=`

<tr>

<td>${data.date}</td>

<td>${data.playerName}</td>

<td>${data.menu}</td>

<td>${result}</td>

</tr>

`;

    });

});
