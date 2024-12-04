// register.js
document.querySelector('#register-btn').onclick = function () {
    const username = document.querySelector('#register-username').value;
    const firstName = document.querySelector('#register-first-name').value;
    const lastName = document.querySelector('#register-last-name').value;
    const address = document.querySelector('#register-address').value;
    const creditCardNumber = document.querySelector('#register-credit-card-number').value;
    const phoneNumber = document.querySelector('#register-phone-number').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;

    if (username && firstName && lastName && address && creditCardNumber && phoneNumber && email && password) {
        fetch('http://localhost:5050/register', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                username: username,
                firstName: firstName,
                lastName: lastName,
                address: address,
                creditCardNumber: creditCardNumber,
                phoneNumber: phoneNumber,
                email: email,
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
                document.querySelector('#register-address').value = "";
                document.querySelector('#register-credit-card-number').value = "";
                document.querySelector('#register-phone-number').value = "";
                document.querySelector('#register-email').value = "";
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
