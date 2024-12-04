// When the login button is clicked
document.querySelector('#login-btn').onclick = function () {
    const username = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;

    if (username && password) {
        fetch('http://localhost:5050/login', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('clientID', data.clientID); // Save clientID
                // Check if the user is David Smith
                if (data.isDavidSmith) {
                    window.location.href = 'davidsmithdashboard.html'; // Redirect David Smith to a different page
                } else {
                    window.location.href = 'dashboard.html'; // Redirect others to the regular dashboard
                }
            } else {
                alert("Invalid username or password");
            }
        })
        .catch(err => console.error(err));
    } else {
        alert("Please enter both username and password");
    }
};


// When the register button is clicked
document.querySelector('#register-btn').onclick = function () {
    window.location.href = 'register.html'; // Redirect to the registration page
};
