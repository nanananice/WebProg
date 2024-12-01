// Function to convert the table to JSON
function autoconvert() {
    var table = document.getElementById("originalTable");

    // Header
    var toJson = { 'Header': [] };
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        toJson['Header'].push(table.rows[0].cells[i].innerHTML.toLowerCase());
    }

    // Body
    toJson['Body'] = [];
    for (var i = 1; i < table.rows.length - 1; i++) { // Adjusted to exclude footer rows
        var row = {};
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            var headerCell = toJson['Header'][j];
            row[headerCell] = table.rows[i].cells[j].innerHTML;
        }
        toJson['Body'].push(row);
    }

    // Footer
    toJson['Footer'] = [
        {
            "value": table.rows[table.rows.length - 1].cells[0].innerHTML,
            "span": table.rows[table.rows.length - 1].cells[0].getAttribute("colspan") || 1
        },
        {
            "value": table.rows[table.rows.length - 1].cells[1].innerHTML,
            "span": table.rows[table.rows.length - 1].cells[1].getAttribute("colspan") || 1
        }
    ];

    // Display the JSON
    var display = document.getElementById("displayTextarea");
    display.value = JSON.stringify(toJson, null, 2); // Prettify JSON
}



// Function to create a new table from JSON data
function convert() { 
    var total = 0;
    var jsonData = JSON.parse(document.getElementById("displayTextarea").value);
    var newTable = document.getElementById("newTable");

    // Clear existing content in the new table
    newTable.innerHTML = "";

    // Create table header
    var headerRow = newTable.insertRow(0);
    for (var i = 0; i < jsonData['Header'].length; i++) {
        var headerCell = headerRow.insertCell(i);
        headerCell.innerHTML = jsonData['Header'][i];
    }

    // Create table body
    for (var i = 0; i < jsonData['Body'].length; i++) {
        var newRow = newTable.insertRow(i + 1);
        for (var j = 0; j < jsonData['Header'].length; j++) {
            var headerCell = jsonData['Header'][j];
            var cellValue = jsonData['Body'][i][headerCell];
            var newCell = newRow.insertCell(j);
            newCell.innerHTML = cellValue;
            if (j == jsonData['Body'].length) {
                total += parseInt(cellValue);
            }
        }
    }

    // Create table footer
    var footerRow = newTable.insertRow(jsonData['Body'].length + 1);

    // Create a single footer cell for "Total" with the specified colspan
    var totalFooterCell = footerRow.insertCell(0);
    totalFooterCell.innerHTML = jsonData['Footer'][0].value;
    totalFooterCell.colSpan = jsonData['Footer'][0].span;

    // Create a separate footer cell for the value "3000" with the specified colspan
    var valueFooterCell = footerRow.insertCell(1);
    valueFooterCell.innerHTML = total;
    valueFooterCell.colSpan = jsonData['Footer'][1].span;
}
