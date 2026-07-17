import { db } from "./firebase.js";

import {

collection,
addDoc,
deleteDoc,
doc,
onSnapshot,
getDocs

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const playerSelect=document.getElementById("player");
const table=document.getElementById("practiceTable");

let x=0;
let y=0;

// 選手取得

async function loadPlayers(){

const snapshot=await getDocs(collection(db,"players"));

snapshot.forEach(p=>{

const data=p.data();

playerSelect.innerHTML+=`
<option value="${data.name}">
${data.number} ${data.name}
</option>
`;

});

}

loadPlayers();

// コートクリック

const court=document.getElementById("court");

court.addEventListener("click",(e)=>{

const rect=court.getBoundingClientRect();

x=Math.round(e.clientX-rect.left);

y=Math.round(e.clientY-rect.top);

document.getElementById("position").innerHTML=

`X:${x}　Y:${y}`;

});

// 登録

document.getElementById("saveBtn").onclick=async()=>{

await addDoc(collection(db,"practice"),{

player:playerSelect.value,

menu:document.getElementById("menu").value,

result:document.getElementById("result").value,

x:x,

y:y,

date:new Date()

});

};

// 一覧表示

onSnapshot(collection(db,"practice"),snapshot=>{

table.innerHTML="";

snapshot.forEach(record=>{

const data=record.data();

table.innerHTML+=`

<tr>

<td>${data.player}</td>

<td>${data.menu}</td>

<td>${data.result}</td>

<td>${data.x}</td>

<td>${data.y}</td>

<td>

<button data-id="${record.id}" class="deleteBtn">
🗑
</button>

</td>

</tr>

`;

});

// 削除イベント
document.querySelectorAll(".deleteBtn").forEach(btn=>{
    btn.addEventListener("click", async (e)=>{
        const id = e.target.dataset.id;
        await deleteDoc(doc(db,"practice",id));
    });
});

});
