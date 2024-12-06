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

// Fetch and display client requests
document.addEventListener('DOMContentLoaded', function () {
    const clientID = sessionStorage.getItem('clientID');

    if (!clientID) {
        alert("You must be logged in to view your requests.");
        return;
    }

    fetch(`http://localhost:5050/clientRequests/${clientID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadClientRequestsTable(data.data);
            } else {
                alert("Failed to load client requests.");
            }
        })
        .catch(err => console.error("Error fetching client requests:", err));
});

function loadClientRequestsTable(data) {
    const tableBody = document.querySelector('#client-requests-table tbody');
    tableBody.innerHTML = '';

    data.forEach(request => {
        let row = `<tr>
            <td>${request.QuoteID}</td>
            <td>${request.PropertyAddress}</td>
            <td>${request.SquareFeet}</td>
            <td>${request.ProposedPrice}</td>
            <td>${request.Note ? request.Note : 'No additional information'}</td>
            <td>${request.RequestStatus}</td>
            <td>`;

        if (request.RequestStatus === 'Pending') {
            row += `Pending`;
        } else if (request.RequestStatus === 'Accepted') {
            row += `<button class="toggle-result-btn" data-id="${request.QuoteID}" data-visible="false">View Quote</button>`;
        } else if (request.RequestStatus === 'Rejected') {
            row += `Rejected: ${request.RejectionNote}`;
        }

        row += `</td></tr>`;
        tableBody.innerHTML += row;
    });

    // Add event listeners to toggle buttons
    document.querySelectorAll('.toggle-result-btn').forEach(button => {
        button.onclick = function () {
            const quoteID = button.dataset.id;
            const isVisible = button.dataset.visible === 'true';

            if (isVisible) {
                // Hide the result and update the button
                document.querySelector('#quote-result-section').style.display = 'none';
                button.textContent = 'View Quote';
                button.dataset.visible = 'false';
            } else {
                // Fetch and show the result
                fetchQuoteResponseDetails(quoteID, button);
            }
        };
    });
}

function fetchQuoteResponseDetails(quoteID, button) {
    fetch(`http://localhost:5050/quoteResponse/${quoteID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayQuoteResponseDetails(data.data, button);
            } else {
                alert("Failed to fetch quote response details.");
            }
        })
        .catch(err => console.error("Error fetching quote response details:", err));
}

function displayQuoteResponseDetails(details, button) {
    const resultSection = document.querySelector('#quote-result-section');
    const detailsDiv = document.querySelector('#quote-details');

    // Populate the details into the section
    detailsDiv.innerHTML = `
        <p><strong>Price:</strong> ${details.Price}</p>
        <p><strong>Start Time:</strong> ${details.StartTime}</p>
        <p><strong>End Time:</strong> ${details.EndTime}</p>
        <p><strong>Response Note:</strong> ${details.ResponseNote}</p>
    `;

    // Show the result section and update the button
    resultSection.style.display = 'block';
    button.textContent = 'Hide Quote';
    button.dataset.visible = 'true';
}



// When the "Logout" button is clicked
document.querySelector('#logout-btn').onclick = function () {
    window.location.href = 'login.html';
};

