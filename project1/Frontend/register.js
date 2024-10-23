// register.js
document.querySelector('#register-btn').onclick = function () {
    const username = document.querySelector('#register-username').value;
    const firstName = document.querySelector('#register-first-name').value;
    const lastName = document.querySelector('#register-last-name').value;
    const age = document.querySelector('#register-age').value;
    const salary = document.querySelector('#register-salary').value;
    const password = document.querySelector('#register-password').value;

    if (username && firstName && lastName && age && salary && password) {
        fetch('http://localhost:5050/register', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                username: username,
                firstName: firstName,
                lastName: lastName,
                age: age,
                salary: salary,
                password: password 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("User registered successfully");
                // Clear the input fields after successful registration
                document.querySelector('#register-username').value = "";
                document.querySelector('#register-first-name').value = "";
                document.querySelector('#register-last-name').value = "";
                document.querySelector('#register-age').value = "";
                document.querySelector('#register-salary').value = "";
                document.querySelector('#register-password').value = "";
            } else {
                alert("Failed to register user");
            }
        })
        .catch(err => console.error(err));
    } else {
        alert("Please fill out all fields");
    }
};


// When the "Back to Login" button is clicked
document.querySelector('#back-to-login-btn').onclick = function () {
    window.location.href = 'login.html'; // Redirect to the login page
};