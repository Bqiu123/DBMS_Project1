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


// Search users by first and/or last name
document.querySelector('#search-users-btn').onclick = function () {
    const firstName = document.querySelector('#search-first-name').value.trim();
    const lastName = document.querySelector('#search-last-name').value.trim();

    fetch(`http://localhost:5050/users/search?firstName=${firstName}&lastName=${lastName}`, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const usersContainer = document.querySelector('#search-users-result');
        if (data.data.length === 0) {
            usersContainer.innerHTML = '<p>No users found.</p>';
        } else {
            let usersHtml = '<h3>Search Results:</h3><ul>';
            data.data.forEach(user => {
                usersHtml += `<li>Username: ${user.username}, Name: ${user.first_name} ${user.last_name}, Registered On: ${new Date(user.date_registered).toLocaleString()}</li>`;
            });
            usersHtml += '</ul>';
            usersContainer.innerHTML = usersHtml;
        }
    })
    .catch(err => console.error("Error searching users: ", err));
};


// Search user by ID
document.querySelector('#search-user-by-id-btn').onclick = function () {
    const userId = document.querySelector('#search-user-id').value.trim();

    if (userId === "") {
        alert("Please enter a User ID to search.");
        return;
    }

    fetch(`http://localhost:5050/users/searchById?id=${userId}`, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const userContainer = document.querySelector('#search-user-by-id-result');
        if (!data.data) {
            userContainer.innerHTML = '<p>No user found with the given ID.</p>';
        } else {
            const user = data.data;
            userContainer.innerHTML = `
                <h3>User Found:</h3>
                <p>Username: ${user.username}</p>
                <p>Name: ${user.first_name} ${user.last_name}</p>
                <p>Registered On: ${new Date(user.date_registered).toLocaleString()}</p>
            `;
        }
    })
    .catch(err => console.error("Error searching user by ID: ", err));
};

// Search users by salary range
document.querySelector('#search-users-by-salary-btn').onclick = function () {
    const minSalary = document.querySelector('#min-salary').value.trim();
    const maxSalary = document.querySelector('#max-salary').value.trim();

    fetch(`http://localhost:5050/users/searchBySalary?minSalary=${minSalary}&maxSalary=${maxSalary}`, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const usersContainer = document.querySelector('#search-users-by-salary-result');
        if (data.data.length === 0) {
            usersContainer.innerHTML = '<p>No users found with the given salary range.</p>';
        } else {
            let usersHtml = '<h3>Search Results by Salary:</h3><ul>';
            data.data.forEach(user => {
                usersHtml += `<li>Username: ${user.username}, Name: ${user.first_name} ${user.last_name}, Salary: ${user.salary}</li>`;
            });
            usersHtml += '</ul>';
            usersContainer.innerHTML = usersHtml;
        }
    })
    .catch(err => console.error("Error searching users by salary: ", err));
};

// Search users by age range
document.querySelector('#search-users-by-age-btn').onclick = function () {
    const minAge = document.querySelector('#min-age').value.trim();
    const maxAge = document.querySelector('#max-age').value.trim();

    fetch(`http://localhost:5050/users/searchByAge?minAge=${minAge}&maxAge=${maxAge}`, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const usersContainer = document.querySelector('#search-users-by-age-result');
        if (data.data.length === 0) {
            usersContainer.innerHTML = '<p>No users found with the given age range.</p>';
        } else {
            let usersHtml = '<h3>Search Results by Age:</h3><ul>';
            data.data.forEach(user => {
                usersHtml += `<li>Username: ${user.username}, Name: ${user.first_name} ${user.last_name}, Age: ${user.age}</li>`;
            });
            usersHtml += '</ul>';
            usersContainer.innerHTML = usersHtml;
        }
    })
    .catch(err => console.error("Error searching users by age: ", err));
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