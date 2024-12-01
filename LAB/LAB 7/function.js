var h = 8;
var m = 0;
var s = 0;

let data = [
    {
        time: "08:30",
        mes: "Wake up",
        alr: false
    },
    {
        time: "09:05",
        mes: "Lunch time",
        alr: false
    },
    {
        time: "10:00",
        mes: "Take a break",
        alr: false
    }
];

function time() {
    s += 1;
    if (s == 60) {
        s = 0;
        m += 1;
    }
    if (m == 60) {
        m = 0;
        h += 1;
    }
    if (h == 24) {
        h = 0;
    }
    document.getElementById("time").innerHTML = "Current Time(1000x faster): " + zfill(String(h),2) + ":" + zfill(String(m),2);
}

function table() {
    var table = "<table><thead><tr><th>Time</th><th>Alert word</th></tr></thead><tbody>"
    for(var len = 0; len < data.length; len++) {
        table += "<tr><td>" + data[len].time + "</td><td>" + data[len].mes + "</td></tr>"
    }
    table += "</tbody></table>"
    document.getElementById("table").innerHTML = table;
}

function check() {
    for(var len = 0; len < data.length; len++) {
        if (data[len].alr == false) {
                if (zfill(String(h),2) == (data[len].time).slice(0,2) && (zfill(String(m),2) == (data[len].time).slice(3,5))) {
                alert(data[len].mes)
                data[len].alr = true
                }
        }
    }
}

function edit() {
    var edit = "<table><tbody>";
    edit += "<button onclick='addrow()'>addrow</button>"
    for (var len = 0; len < data.length; len++) {
        edit += "<tr><td>" + "<input type='time' id='timeInput" + len + "' value='" + data[len].time + "'></input>" + "</td><td>" +
            "<input type='text' id='messageInput" + len + "' value='" + data[len].mes + "'></input>" + "</td><td><button onclick='remove(" + len + ")'>remove</button></td></tr>"
    }
    edit += "</tbody></table>"
    edit += "<button onclick='updateTable()'>Done</button>"
    document.getElementById("table").innerHTML = edit;
}

function updateTable() {
    for (var len = 0; len < data.length; len++) {
        var newTime = document.getElementById('timeInput' + len).value;
        var newMessage = document.getElementById('messageInput' + len).value;
        data[len].time = newTime;
        data[len].mes = newMessage;
        data[len].alr = false; 
    }
    table(); 
}

function remove(index) {
    data.splice(index, 1);
    edit();
}


function addrow() {
    let newrow = {
            time: "",
            mes: "",
            alr: false
        }
    data.push(newrow);
    edit();
}

function zfill(inputString, width) {
    const numZeros = Math.max(0, width - inputString.length);
    return '0'.repeat(numZeros) + inputString;
}


function start() {
    time();
    check();
}

setInterval(start,1);
document.addEventListener("DOMContentLoaded", function () {
    table();
  });