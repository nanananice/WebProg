var toJson;
function autoConvert() {
    var table = document.getElementById("originalTable");
    var rowsize = table.rows.length - 1;
    var colsize = table.rows[0].cells.length - 1;
    var span = table.rows[0].cells.length - 1;
    // header
    toJson = "{'Header': [";
    for (var i=0; i<table.rows[0].cells.length; i++) {
        if (i != table.rows[0].cells.length - 1) {
            toJson += "'" + table.rows[0].cells[i].innerHTML.toLowerCase() + "',";
        }
        else {
            toJson += "'" + table.rows[0].cells[i].innerHTML.toLowerCase() + "'";
        }
    }
    toJson += "],";
    // body
    toJson += "{'Body': [";
    for (var i = 1; i < table.rows.length - 1; i++) {
        toJson += "{ ";
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            if (j != table.rows[j].cells.length - 1) {
                toJson += "'" + table.rows[0].cells[j].innerHTML.toLowerCase() + "'" + " : '" + table.rows[i].cells[j].innerHTML.toLowerCase() + "',";
            }
            else {
                toJson += "'" + table.rows[0].cells[j].innerHTML.toLowerCase() + "'" + " : '" + table.rows[i].cells[j].innerHTML.toLowerCase() + "'";
            }
        }
        toJson += "},";
    }
    toJson += "], ";
    // footer
    toJson += "{'Footer': [";
    toJson += "{" + "'value': 'total', 'span':" + span + "}";
    toJson += "{" + "'value': " + table.rows[rowsize].cells[1].innerHTML.toLowerCase() + "}";
    toJson += "]}";


    display = document.getElementById("displayTextarea");
    display.innerHTML = (JSON.stringify(toJson));
}

var jsonData = document.getElementById("displayTextarea").value;
function convert(jsonData) {
    try {
        // Parse the JSON data
        var data = JSON.parse(jsonData);

        // Check if the JSON data has the expected structure
        if (!data.Header || !data.Body || !data.Footer) {
            throw new Error("Invalid JSON structure: The JSON object must have 'Header', 'Body', and 'Footer' properties.");
        }

        // Find the table where you want to insert the data
        var table = document.getElementById("newTable");

        // Clear any existing rows in the table
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }

        // Create a header row
        var headerRow = table.insertRow(0);
        for (var i = 0; i < data.Header.length; i++) {
            var cell = headerRow.insertCell(i);
            cell.innerHTML = data.Header[i];
        }

        // Create body rows
        var bodyData = data.Body;
        for (var i = 0; i < bodyData.length; i++) {
            var rowData = bodyData[i];
            var row = table.insertRow(i + 1);

            for (var j = 0; j < data.Header.length; j++) {
                var cell = row.insertCell(j);
                var columnName = data.Header[j];
                cell.innerHTML = rowData[columnName];
            }
        }

        // Create footer row
        var footerRow = table.insertRow(table.rows.length);
        for (var i = 0; i < data.Footer.length; i++) {
            var cell = footerRow.insertCell(i);
            cell.innerHTML = data.Footer[i].value;
            if (data.Footer[i].span) {
                cell.colSpan = data.Footer[i].span;
            }
        }
    } catch (error) {
        alert("Invalid JSON data: " + error.message);
    }
}


