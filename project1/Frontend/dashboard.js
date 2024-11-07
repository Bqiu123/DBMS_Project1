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


// when searching for users by first and/or last name
function searchUsers() {
    const firstName = document.getElementById('firstNameInput').value;
    const lastName = document.getElementById('lastNameInput').value;

    fetch(`/searchUsers?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = ''; // Clear previous results
            data.data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.textContent = `Name: ${user.first_name} ${user.last_name}`;
                resultsContainer.appendChild(userDiv);
            });
        })
        .catch(err => console.error('Failed to fetch users:', err));
}

// searching users by user id
function searchUserById() {
    const userId = document.getElementById('userIdInput').value;

    fetch(`/searchUserById/${encodeURIComponent(userId)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            const resultContainer = document.getElementById('userIdResults');
            resultContainer.innerHTML = ''; // Clear previous results
            const userDiv = document.createElement('div');
            userDiv.textContent = `Name: ${data.data.first_name} ${data.data.last_name}`;
            resultContainer.appendChild(userDiv);
        })
        .catch(err => {
            console.error('Failed to fetch user:', err);
            const resultContainer = document.getElementById('userIdResults');
            resultContainer.innerHTML = 'User not found';
        });
}

// search all users whose salary is between x and y
function searchUsersBySalary() {
    const minSalary = document.getElementById('minSalaryInput').value;
    const maxSalary = document.getElementById('maxSalaryInput').value;

    fetch(`/searchUsersBySalary?minSalary=${encodeURIComponent(minSalary)}&maxSalary=${encodeURIComponent(maxSalary)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('salarySearchResults');
            resultsContainer.innerHTML = ''; // Clear previous results
            data.data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.textContent = `Name: ${user.first_name} ${user.last_name}, Salary: ${user.salary}`;
                resultsContainer.appendChild(userDiv);
            });
        })
        .catch(err => {
            console.error('Failed to fetch users:', err);
            resultsContainer.innerHTML = 'Failed to fetch users';
        });
}

// search all users whose age is between x and y
function searchUsersByAge() {
    const minAge = document.getElementById('minAgeInput').value;
    const maxAge = document.getElementById('maxAgeInput').value;

    fetch(`/searchUsersByAge?minAge=${encodeURIComponent(minAge)}&maxAge=${encodeURIComponent(maxAge)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('ageSearchResults');
            resultsContainer.innerHTML = ''; // Clear previous results
            data.data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.textContent = `Name: ${user.first_name} ${user.last_name}, Age: ${user.age}`;
                resultsContainer.appendChild(userDiv);
            });
        })
        .catch(err => {
            console.error('Failed to fetch users:', err);
            resultsContainer.innerHTML = 'Failed to fetch users';
        });
}


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