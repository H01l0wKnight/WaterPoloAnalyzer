let selectedX = 0;
let selectedY = 0;


// 選手読み込み

window.onload=function(){


let players =
JSON.parse(localStorage.getItem("players")) || [];


let select =
document.getElementById("playerSelect");



players.forEach(player=>{


let option=document.createElement("option");

option.value=player.name;

option.textContent=player.name;


select.appendChild(option);


});


displayRecords();


}




// コートクリック

document.getElementById("court")
.onclick=function(e){


let rect=this.getBoundingClientRect();


selectedX=e.clientX-rect.left;

selectedY=e.clientY-rect.top;



alert(
"位置登録しました\nX:"
+Math.round(selectedX)
+" Y:"
+Math.round(selectedY)
);


};





// 成功ボタン

document.getElementById("goalBtn")
.onclick=function(){

saveShot(true);

};



// 失敗ボタン

document.getElementById("missBtn")
.onclick=function(){

saveShot(false);

};





function saveShot(result){



let player=
document.getElementById("playerSelect").value;



if(player==""){

alert("選手を選択してください");

return;

}



let data=JSON.parse(
localStorage.getItem("matchShots")
)||[];



let shot={


player:player,

quarter:
document.getElementById("quarter").value,


time:
document.getElementById("gameTime").value,


type:
document.getElementById("shotType").value,


result:
result ? "成功":"失敗",


x:selectedX,

y:selectedY


};



data.push(shot);



localStorage.setItem(
"matchShots",
JSON.stringify(data)
);



alert("保存しました");


displayRecords();



}





function displayRecords(){


let list=
document.getElementById("recordList");


list.innerHTML="";



let data=
JSON.parse(localStorage.getItem("matchShots"))
||[];



data.forEach(s=>{


let tr=document.createElement("tr");



tr.innerHTML=

`
<td>${s.player}</td>
<td>${s.quarter}</td>
<td>${s.time}</td>
<td>${s.type}</td>
<td>${s.result}</td>
`;



list.appendChild(tr);


});



}
