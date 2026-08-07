import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==========================
// Firestore
// ==========================

const playerRef = collection(db, "players");
const practiceRef = collection(db, "practice");
const matchRef = collection(db, "match");

// ==========================
// 練習分析 HTML
// ==========================

const practicePlayer =
    document.getElementById("practicePlayer");

const practiceMenu =
    document.getElementById("practiceMenu");

const practiceResult =
    document.getElementById("practiceResult");

const practiceCourt =
    document.getElementById("practiceCourt");

const practiceShot =
    document.getElementById("practiceShot");

const practiceGoal =
    document.getElementById("practiceGoal");

const practiceMiss =
    document.getElementById("practiceMiss");

const practiceGK =
    document.getElementById("practiceGK");

const practiceRate =
    document.getElementById("practiceRate");

// ==========================
// 試合分析 HTML
// ==========================

const matchPlayer =
    document.getElementById("matchPlayer");

const matchQuarter =
    document.getElementById("matchQuarter");

const matchResult =
    document.getElementById("matchResult");

const matchCourt =
    document.getElementById("matchCourt");

const matchShot =
    document.getElementById("matchShot");

const matchGoal =
    document.getElementById("matchGoal");

const matchMiss =
    document.getElementById("matchMiss");

const matchGK =
    document.getElementById("matchGK");

const matchRate =
    document.getElementById("matchRate");

// ==========================
// タブ
// ==========================

const tabButtons =
    document.querySelectorAll(".tabButton");

const tabContents =
    document.querySelectorAll(".tabContent");

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        tabButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        tabContents.forEach(tab =>
            tab.classList.remove("active")
        );

        button.classList.add("active");

        document
            .getElementById(button.dataset.tab + "Tab")
            .classList.add("active");

    });

});

// ==========================
// 選手読込
// ==========================

async function loadPlayers() {

    practicePlayer.innerHTML =
        '<option value="all">全選手</option>';

    matchPlayer.innerHTML =
        '<option value="all">全選手</option>';

    const snapshot =
        await getDocs(playerRef);

    snapshot.forEach(docSnap => {

        const player = docSnap.data();

        const option1 =
            document.createElement("option");

        option1.value = player.name;
        option1.textContent =
            player.number + " " + player.name;

        practicePlayer.appendChild(option1);

        const option2 =
            document.createElement("option");

        option2.value = player.name;
        option2.textContent =
            player.number + " " + player.name;

        matchPlayer.appendChild(option2);

    });

}

loadPlayers();

// ==========================
// データ保存用
// ==========================

let practiceData = [];

let matchData = [];
// ==========================
// マーカー作成
// ==========================

function createMarker(court, data) {

    const marker = document.createElement("div");

    marker.classList.add("marker");

    switch (data.result) {

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

    marker.style.left = data.x + "px";
    marker.style.top = data.y + "px";

    // 後で詳細表示に使用
    marker.title =
        `${data.player}
${data.menu}
${data.result}`;

    court.appendChild(marker);

}

// ==========================
// コート初期化
// ==========================

function clearCourt(court){

    court
        .querySelectorAll(".marker")
        .forEach(marker=>{

            marker.remove();

        });

}

// ==========================
// Practice取得
// ==========================

onSnapshot(practiceRef,(snapshot)=>{

    practiceData=[];

    snapshot.forEach(docSnap=>{

        practiceData.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });

    updatePractice();

});

// ==========================
// Match取得
// ==========================

onSnapshot(matchRef,(snapshot)=>{

    matchData=[];

    snapshot.forEach(docSnap=>{

        matchData.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });

    updateMatch();

});
// ==========================
// 練習分析
// ==========================

function updatePractice() {

    clearCourt(practiceCourt);

    let goal = 0;
    let miss = 0;
    let gk = 0;

    const player =
        practicePlayer.value;

    const menu =
        practiceMenu.value;

    const result =
        practiceResult.value;

    const list =
        practiceData.filter(data => {

            if (
                player !== "all" &&
                data.player !== player
            ) {
                return false;
            }

            if (
                menu !== "all" &&
                data.menu !== menu
            ) {
                return false;
            }

            if (
                result !== "all" &&
                data.result !== result
            ) {
                return false;
            }

            return true;

        });

    list.forEach(data => {

        createMarker(
            practiceCourt,
            data
        );

        switch (data.result) {

            case "goal":
                goal++;
                break;

            case "miss":
                miss++;
                break;

            case "gk":
                gk++;
                break;

        }

    });

    const total =
        list.length;

    practiceShot.textContent =
        total;

    practiceGoal.textContent =
        goal;

    practiceMiss.textContent =
        miss;

    practiceGK.textContent =
        gk;

    if (total === 0) {

        practiceRate.textContent =
            "0%";

    } else {

        practiceRate.textContent =
            (
                goal / total * 100
            ).toFixed(1)
            + "%";

    }

}

// ==========================
// イベント
// ==========================

practicePlayer.addEventListener(
    "change",
    updatePractice
);

practiceMenu.addEventListener(
    "change",
    updatePractice
);

practiceResult.addEventListener(
    "change",
    updatePractice
);
// ==========================
// 練習メニュー読込
// ==========================

function loadPracticeMenu() {

    const menus = [...new Set(

        practiceData.map(data => data.menu)

    )];

    practiceMenu.innerHTML =
        '<option value="all">全メニュー</option>';

    menus.sort();

    menus.forEach(menu => {

        const option =
            document.createElement("option");

        option.value = menu;

        option.textContent = menu;

        practiceMenu.appendChild(option);

    });

}
