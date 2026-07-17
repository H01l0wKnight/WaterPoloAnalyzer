import { db } from "./firebase.js";

import {

collection,

addDoc,

deleteDoc,

doc,

onSnapshot

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const number = document.getElementById("number");
const name = document.getElementById("name");
const position = document.getElementById("position");

const table = document.getElementById("playerTable");

const playersRef = collection(db,"players");

// 選手追加
document.getElementById("addBtn").onclick = async ()=>{

    if(name.value==""){

        alert("名前を入力してください");

        return;

    }

    await addDoc(playersRef,{

        number:Number(number.value),

        name:name.value,

        position:position.value

    });

    number.value="";
    name.value="";

};

// リアルタイム更新
onSnapshot(playersRef,(snapshot)=>{

    table.innerHTML="";

    snapshot.forEach((player)=>{

        const data=player.data();

        table.innerHTML +=`

<tr>

<td>${data.number}</td>

<td>${data.name}</td>

<td>${data.position}</td>

<td>

<button onclick="deletePlayer('${player.id}')">

🗑

</button>

</td>

</tr>

`;

    });

});

// 削除
window.deletePlayer = async(id)=>{

    await deleteDoc(doc(db,"players",id));

};
