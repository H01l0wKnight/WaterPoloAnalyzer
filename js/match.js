let clickX = 0;
let clickY = 0;


const court =
document.getElementById("court");


// コートクリック

court.addEventListener("click",function(e){


const rect =
court.getBoundingClientRect();


clickX =
e.clientX - rect.left;


clickY =
e.clientY - rect.top;



document.getElementById("position").innerHTML =

"X："+Math.round(clickX)
+" Y："+Math.round(clickY);


});




// 登録

document
.getElementById("saveButton")
.addEventListener("click",function(){


const player =
document.getElementById("player").value;


const result =
document.getElementById("result").value;



if(player==""){

alert("選手名を入力してください");

return;

}




// マーカー作成

const marker =
document.createElement("div");


marker.classList.add("marker");



if(result=="goal")
marker.classList.add("goalShot");


if(result=="miss")
marker.classList.add("missShot");


if(result=="gk")
marker.classList.add("gkShot");



marker.style.left =
clickX+"px";


marker.style.top =
clickY+"px";



court.appendChild(marker);





let text="";


if(result=="goal")
text="ゴール";

if(result=="miss")
text="外れ";

if(result=="gk")
text="GK";



const row =

`
<tr>
<td>${player}</td>
<td>${Math.round(clickX)}</td>
<td>${Math.round(clickY)}</td>
<td>${text}</td>
</tr>
`;



document
.getElementById("tableBody")
.innerHTML += row;



});