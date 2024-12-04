// dashboard.js


// When the "Submit Request for Quote" button is clicked
document.querySelector('#submit-quote-btn').onclick = function () {
    const propertyAddress = document.querySelector('#property-address').value;
    const squareFeet = document.querySelector('#square-feet').value;
    const proposedPrice = document.querySelector('#proposed-price').value;
    const note = document.querySelector('#note').value;

    // Assuming the client ID is stored in session storage after login
    const clientID = sessionStorage.getItem('clientID');

    if (!clientID) {
        alert("You must be logged in to submit a quote request.");
        return;
    }

    // Send a POST request to the backend to save the quote request
    fetch('http://localhost:5050/quoteRequest', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            clientID: clientID,
            propertyAddress: propertyAddress,
            squareFeet: squareFeet,
            proposedPrice: proposedPrice,
            note: note
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Quote request submitted successfully.");
            // Clear the form fields after successful submission
            document.querySelector('#property-address').value = "";
            document.querySelector('#square-feet').value = "";
            document.querySelector('#proposed-price').value = "";
            document.querySelector('#note').value = "";
        } else {
            alert("Failed to submit quote request.");
        }
    })
    .catch(err => console.error("Error submitting quote request: ", err));
};


// When the "Logout" button is clicked
document.querySelector('#logout-btn').onclick = function () {
    window.location.href = 'login.html';
};

