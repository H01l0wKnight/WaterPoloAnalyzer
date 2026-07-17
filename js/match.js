let x = 0;
let y = 0;


//選手読み込み

window.onload=function(){


let players =
JSON.parse(localStorage.getItem("players"))
||[];



let select =
document.getElementById("player");



players.forEach(p=>{


let option=document.createElement("option");


option.value=p.name;

option.textContent=p.name;


select.appendChild(option);


});



loadRecords();


}





//コートクリック

document.getElementById("court")
.onclick=function(e){


let rect=this.getBoundingClientRect();



x=e.clientX-rect.left;

y=e.clientY-rect.top;



document.getElementById("position").innerHTML=


"位置 X:"
+Math.round(x)
+" Y:"
+Math.round(y);



};






//保存

document.getElementById("saveBtn")
.onclick=function(){



let player=
document.getElementById("player").value;



if(player==""){

alert("選手を選択してください");

return;

}




let records=
JSON.parse(localStorage.getItem("matchRecords"))
||[];




let data={


quarter:
document.getElementById("quarter").value,


time:
document.getElementById("time").value,


player:player,


menu:
document.getElementById("menu").value,


result:
document.getElementById("result").value,


x:x,


y:y



};



records.push(data);



localStorage.setItem(
"matchRecords",
JSON.stringify(records)
);



loadRecords();



};






function loadRecords(){



let table=
document.getElementById("matchTable");

table.innerHTML="";



let records=
JSON.parse(localStorage.getItem("matchRecords"))
||[];





records.forEach((r,index)=>{


let tr=document.createElement("tr");



tr.innerHTML=`

<td>${r.quarter}</td>

<td>${r.time}</td>

<td>${r.player}</td>

<td>${r.menu}</td>

<td>${r.result}</td>

<td>
(${Math.round(r.x)},${Math.round(r.y)})
</td>

<td>

<button onclick="deleteRecord(${index})">

削除

</button>

</td>

`;



table.appendChild(tr);



});



}




window.deleteRecord=function(index){


let records=
JSON.parse(localStorage.getItem("matchRecords"))
||[];



records.splice(index,1);



localStorage.setItem(
"matchRecords",
JSON.stringify(records)
);



loadRecords();



};
