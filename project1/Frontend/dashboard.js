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
