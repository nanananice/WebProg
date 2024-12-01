var current = new Date();

var alertTime = []


function AlertTime(time, message){
    this.time = time;
    this.message = message;
}

function displayTable(array){
    const tablectn = document.getElementById("alert-table");
    tablectn.innerHTML = "";
    const table = document.createElement("table");
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    th1.innerHTML = "Time";
    th2.innerHTML = "Alert Word";
    tr.appendChild(th1);
    tr.appendChild(th2);
    table.appendChild(tr);

    for (let i = 0; i < array.length; i++) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        td1.innerHTML = array[i].time.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false});
        td2.innerHTML = array[i].message;
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    tablectn.appendChild(table);
}

function displayForm(array){
    const tablectn = document.getElementById("alert-table");
    tablectn.innerHTML = "";
    const table = document.createElement("table");

    for (let i = 0; i < array.length; i++) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");

        const timeinput = document.createElement("input");
        const messageinput = document.createElement("input");
        const removebtn = document.createElement("input");
        

        timeinput.setAttribute("type", "time");
        timeinput.setAttribute("value", array[i].time.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false}));

        messageinput.setAttribute("type", "text");
        messageinput.setAttribute("value", array[i].message);

        removebtn.setAttribute("type", "button");
        removebtn.setAttribute("value", "Remove");


        removebtn.addEventListener("click", function(e){
            array.splice(i, 1);
            displayForm(array);
        });

        td1.appendChild(timeinput);
        td2.appendChild(messageinput);
        td3.appendChild(removebtn);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
    }
    const addrowbtn = document.createElement("input");
    addrowbtn.setAttribute("type", "button");
    addrowbtn.setAttribute("value", "Add Row");
    addrowbtn.addEventListener("click", function(){
        save();
        array.push(new AlertTime(new Date(current.getFullYear(), current.getMonth(), current.getDate(), 0, 0, 0), ""));
        displayForm(array);
    });
    tablectn.appendChild(table);
    tablectn.appendChild(addrowbtn);
}

function save(){
    const table = document.getElementById("alert-table").getElementsByTagName("table")[0];
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].getElementsByTagName("td");
        alertTime[i].time = new Date(current.getFullYear(), current.getMonth(), current.getDate(), tds[0].getElementsByTagName("input")[0].value.split(":")[0], tds[0].getElementsByTagName("input")[0].value.split(":")[1], 0);
        alertTime[i].message = tds[1].getElementsByTagName("input")[0].value;
    }

    alertTime.sort(function(a, b){
        return a.time.getTime() - b.time.getTime();
    });
}

function prasetoObj(){
    let data = [];
    for (let i = 0; i < alertTime.length; i++) {
        let obj = {};
        obj.date = document.getElementById("time").value;
        obj.time = alertTime[i].time.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false});
        obj.activity = alertTime[i].message;
        data.push(obj);
    }
    return data;
}

function savetolocalstorage(){
    let object = prasetoObj();
    const olddata = JSON.parse(localStorage.getItem("alertTime"));
    let savedata = olddata == null ? [] : olddata;

    if (olddata == null) {
        localStorage.setItem("alertTime", JSON.stringify(object));
        return;
    }

    for (let i = 0; i < object.length; i++) {
        if(olddata.find(x => x.time == object[i].time && x.activity == object[i].activity) != undefined){
            continue;
        }else{
            savedata.push(object[i]);
        }
    }

    localStorage.setItem("alertTime", JSON.stringify(savedata));
}

function export_schedule(){
    const json = JSON.stringify(prasetoObj());
    console.log(json);
    const blob = new Blob([json], {type: "application/json"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "schedule.json");
    a.click();
}
    


function loadData(){
    const date = document.getElementById("time").value;
    const json = localStorage.getItem("alertTime");
    const data = JSON.parse(json);
    let newdata = [];
    if(data == null){
        return newdata;
    }
    for (let i = 0; i < data.length; i++) {
        if(data[i].date != date){
            continue;
        }
        newdata.push(new AlertTime(new Date(current.getFullYear(), current.getMonth(), current.getDate(), data[i].time.split(":")[0], data[i].time.split(":")[1], 0), data[i].activity));
    }

    return newdata;
}



document.addEventListener("DOMContentLoaded", function(){
    const date = document.getElementById("time");
    date.value = `${current.getFullYear()}-${(current.getMonth()+1).toString().padStart(2, "0")}-${current.getDate().toString().padStart(2, "0")}`; // `2021-04-30
    alertTime = loadData();
    displayTable(alertTime);
    const edit = document.getElementById("edit");
    edit.addEventListener("click", function(e){
        if(e.target.value == "Edit"){
            displayForm(alertTime);
            e.target.value = "Save";
        }else{
            save();
            displayTable(alertTime);
            e.target.value = "Edit";
        }
    });

    const exportbtn = document.getElementById("export");
    exportbtn.addEventListener("click", export_schedule);

    const savebtn = document.getElementById("save");
    savebtn.addEventListener("click", savetolocalstorage);

    date.addEventListener("change", function(){
        alertTime = loadData();
        displayTable(alertTime);
    });

    const importbtn = document.getElementById("import");
    importbtn.addEventListener("change", function(e){
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e){
            const data = JSON.parse(e.target.result);
            localStorage.setItem("alertTime", JSON.stringify(data));
            alertTime = loadData();
            displayTable(alertTime);
        }
        reader.readAsText(file);
    });

});