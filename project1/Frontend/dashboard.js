// dashboard.js

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