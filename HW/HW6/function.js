var current = 1;
var days_of_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var startday = 7;

function start() {
    updateDisplayedMonth(current);
}

function show_monthOf2023(m_of_year, total_days_of_year) {
    var tableHTML = "<table>";
    tableHTML += "<tr><td><button onclick='before()'>&lt;</button></td><td colspan='5'>" + m_of_year + "/2023</td><td><button onclick='next()'>&gt;</button></td></tr>";
    tableHTML += "<tr><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td><td>Sun</td></tr>";

    var daysInMonth = days_of_month[current - 1];
    var dayCounter = 1;
    
    for (var week = 1; dayCounter <= daysInMonth; week++) {
        tableHTML += "<tr>";
        for (var day = 1; day <= 7; day++) {
            if ((week === 1 && day < startday) || dayCounter > daysInMonth) {
                tableHTML += "<td></td>";
            } else {
                tableHTML += "<td>" + dayCounter + "</td>";
                dayCounter++;
            }
        }
        tableHTML += "</tr>";
    }

    tableHTML += "</table>";

    document.body.innerHTML = tableHTML;
}

function updateDisplayedMonth(m_of_year) {
    show_monthOf2023(m_of_year, 365);
}

function before() {
    if (current > 1) {
        startday = startday - days_of_month[current-2] % 7;
        if (startday == 0) {
            startday = 7;
        }
        current -= 1;
        updateDisplayedMonth(current);
    }
}

function next() {
    if (current < 12) {
        startday = (startday + days_of_month[current-1]) % 7
        if (startday == 0) {
            startday = 7;
        }
        current += 1;
        updateDisplayedMonth(current);
    }
}
