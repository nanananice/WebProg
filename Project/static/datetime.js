let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    isLoggedIn = document.body.getAttribute('data-logged-in') === 'True';

        createDateButtons();
    
    setInterval(updateDateTime, 1000);
    updateDateTime();
});

function updateDateTime() {
    const now = new Date();
    const dateTimeStr = now.toLocaleString();
    document.getElementById('current-datetime').textContent = 'Current Date and Time: ' + dateTimeStr;
}

function createDateButtons() {
    
    const dateButtonsContainer = document.getElementById('date-buttons');
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        const button = document.createElement('button');
        button.textContent = date.toDateString();
        button.onclick = function() { createTimeSlots(date); };
        dateButtonsContainer.appendChild(button);
    }
}

async function createTimeSlots(selectedDate) {
    if (!isLoggedIn) {
        alert("You must be logged in to make a reservation.");
        return;
    }

    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const response = await fetch(`/available-slots/${formattedDate}`);
    const data = await response.json();

    for (let hour = 9; hour < 21; hour += 2) {
        const timeSlot = `${formatTime(hour)} - ${formatTime(hour + 2)}`;
        const reservation = data.reservations.find(res => res.time_slot === timeSlot);

        const button = document.createElement('button');
        button.textContent = timeSlot;

        if (reservation) {
            button.textContent += ` - Reserved by ${reservation.name}`;
            button.disabled = true;
        } else {
            button.onclick = () => createReservationForm(selectedDate, timeSlot);
        }

        timeSlotsContainer.appendChild(button);
    }
}


function createReservationForm(selectedDate, timeSlot) {
    if (!isLoggedIn) {
        alert("You must be logged in to make a reservation.");
        return;
    }
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = '';

    const form = document.createElement('form');
    form.innerHTML = `
        <label>Name: <input type="text" id="name" required></label>
        <label>Phone: <input type="tel" id="phone" required></label>
        <button type="submit">Reserve</button>
    `;

    form.onsubmit = (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        makeReservation(selectedDate, timeSlot, name, phone);
    };
    formContainer.appendChild(form);
}


async function makeReservation(date, timeSlot, name, phone) {
    const response = await fetch('/reserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `date=${date.toISOString().split('T')[0]}&time_slot=${encodeURIComponent(timeSlot)}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`
    });

    if (response.ok) { 
        window.location.reload();
    } else {
        alert("Failed to make a reservation. It might be already booked.");
    }
}


function formatTime(hour) {
    return `${hour}:00`;
}
