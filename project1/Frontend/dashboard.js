// dashboard.js

// When the "Logout" button is clicked
document.querySelector('#logout-btn').onclick = function () {
    window.location.href = 'login.html';
};

// When the "Get Users Who Have Never Logged In" button is clicked
document.querySelector('#get-never-logged-in-btn').onclick = function () {
    fetch('http://localhost:5050/users/neverloggedin', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const usersContainer = document.querySelector('#never-logged-in-users');
        if (data.data.length === 0) {
            usersContainer.innerHTML = '<p>No users have never logged in.</p>';
        } else {
            let usersHtml = '<h3>Users Who Have Never Logged In:</h3><ul>';
            data.data.forEach(user => {
                usersHtml += `<li>Username: ${user.username}, Name: ${user.first_name} ${user.last_name}</li>`;
            });
            usersHtml += '</ul>';
            usersContainer.innerHTML = usersHtml;
        }
    })
    .catch(err => console.error("Error fetching users who have never logged in: ", err));
};

// When the "Search Users Registered After John" button is clicked
document.querySelector('#search-after-john-btn').onclick = function () {
    fetch('http://localhost:5050/users/registeredAfterJohn', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const usersContainer = document.querySelector('#users-registered-after-john');
        if (data.data.length === 0) {
            usersContainer.innerHTML = '<p>No users registered after John.</p>';
        } else {
            let usersHtml = '<h3>Users Registered After John:</h3><ul>';
            data.data.forEach(user => {
                usersHtml += `<li>Username: ${user.username}, Name: ${user.first_name} ${user.last_name}, Registered On: ${new Date(user.date_registered).toLocaleString()}</li>`;
            });
            usersHtml += '</ul>';
            usersContainer.innerHTML = usersHtml;
        }
    })
    .catch(err => console.error("Error fetching users registered after John: ", err));
};

// When the "Search Users Registered on the Same Day as John" button is clicked
document.querySelector('#search-same-day-john-btn').onclick = function () {
    fetch('http://localhost:5050/users/registeredSameDayJohn', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const usersContainer = document.querySelector('#users-registered-same-day-john');
        if (data.data.length === 0) {
            usersContainer.innerHTML = '<p>No users registered on the same day as John.</p>';
        } else {
            let usersHtml = '<h3>Users Registered on the Same Day as John:</h3><ul>';
            data.data.forEach(user => {
                usersHtml += `<li>Username: ${user.username}, Name: ${user.first_name} ${user.last_name}, Registered On: ${new Date(user.date_registered).toLocaleString()}</li>`;
            });
            usersHtml += '</ul>';
            usersContainer.innerHTML = usersHtml;
        }
    })
    .catch(err => console.error("Error fetching users registered on the same day as John: ", err));
};

// When the "Get Users Registered Today" button is clicked
document.querySelector('#get-registered-today-btn').onclick = function () {
    fetch('http://localhost:5050/users/registeredToday', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const usersContainer = document.querySelector('#users-registered-today');
        if (data.data.length === 0) {
            usersContainer.innerHTML = '<p>No users registered today.</p>';
        } else {
            let usersHtml = '<h3>Users Registered Today:</h3><ul>';
            data.data.forEach(user => {
                usersHtml += `<li>Username: ${user.username}, Name: ${user.first_name} ${user.last_name}, Registered On: ${new Date(user.date_registered).toLocaleString()}</li>`;
            });
            usersHtml += '</ul>';
            usersContainer.innerHTML = usersHtml;
        }
    })
    .catch(err => console.error("Error fetching users registered today: ", err));
};