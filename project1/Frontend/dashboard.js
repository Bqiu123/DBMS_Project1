// dashboard.js

// When the "Submit Request for Quote" button is clicked
document.querySelector('#submit-quote-btn').onclick = function () {
    const propertyAddress = document.querySelector('#property-address').value;
    const squareFeet = document.querySelector('#square-feet').value;
    const proposedPrice = document.querySelector('#proposed-price').value;
    const note = document.querySelector('#note').value;

    const clientID = sessionStorage.getItem('clientID');

    if (!clientID) {
        alert("You must be logged in to submit a quote request.");
        return;
    }

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

    document.querySelectorAll('.toggle-result-btn').forEach(button => {
        button.onclick = function () {
            const quoteID = button.dataset.id;
            const isVisible = button.dataset.visible === 'true';

            if (isVisible) {
                document.querySelector('#quote-result-section').style.display = 'none';
                button.textContent = 'View Quote';
                button.dataset.visible = 'false';
            } else {
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

    // Format start and end times to match the database format
    const startTime = new Date(details.StartTime).toLocaleString('en-US', { hour12: false });
    const endTime = new Date(details.EndTime).toLocaleString('en-US', { hour12: false });

    detailsDiv.innerHTML = `
        <p><strong>Price:</strong> ${details.Price}</p>
        <p><strong>Start Time:</strong> ${startTime}</p>
        <p><strong>End Time:</strong> ${endTime}</p>
        <p><strong>Response Note:</strong> ${details.ResponseNote}</p>
    `;

    resultSection.style.display = 'block';
    button.textContent = 'Hide Quote';
    button.dataset.visible = 'true';

    // Attach event listeners for "Accept", "Reject", "Negotiate" buttons
    document.querySelector('#accept-quote-btn').onclick = function () {
        acceptQuote(button.dataset.id);
    };

    document.querySelector('#reject-quote-btn').onclick = function () {
        rejectQuote(button.dataset.id);
    };

    document.querySelector('#negotiate-quote-btn').onclick = function () {
        document.querySelector('#negotiate-form').style.display = 'block';
        document.querySelector('#submit-negotiate-btn').onclick = function () {
            const note = document.querySelector('#negotiate-note').value;
            negotiateQuote(button.dataset.id, note);
        };
    };
}

function acceptQuote(quoteID) {
    fetch('http://localhost:5050/acceptQuote', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ quoteID: quoteID })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Quote accepted successfully.");
            updateQuoteUI('accepted');
        } else {
            alert("Failed to accept quote.");
        }
    })
    .catch(err => console.error("Error accepting quote: ", err));
}

function rejectQuote(quoteID) {
    fetch('http://localhost:5050/rejectQuoteResponse', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ quoteID: quoteID })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Quote rejected successfully.");
            updateQuoteUI('rejected');
        } else {
            alert("Failed to reject quote.");
        }
    })
    .catch(err => console.error("Error rejecting quote: ", err));
}

function negotiateQuote(quoteID, note) {
    fetch('http://localhost:5050/negotiateQuote', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ quoteID: quoteID, note: note })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Negotiation note submitted successfully.");
            location.reload(); // Keep buttons unchanged
        } else {
            alert("Failed to submit negotiation note.");
        }
    })
    .catch(err => console.error("Error negotiating quote: ", err));
}

// Helper function to update the UI after accepting or rejecting the quote
function updateQuoteUI(action) {
    const quoteActions = document.querySelector('#quote-actions');
    const negotiateForm = document.querySelector('#negotiate-form');

    quoteActions.style.display = 'none';
    negotiateForm.style.display = 'none';

    if (action === 'accepted') {
        document.querySelector('#quote-details').innerHTML += `<p><strong>Quote Status:</strong> Quote Accepted</p>`;
    } else if (action === 'rejected') {
        document.querySelector('#quote-details').innerHTML += `<p><strong>Quote Status:</strong> Quote Rejected</p>`;
    }
}


// When the "Logout" button is clicked
document.querySelector('#logout-btn').onclick = function () {
    window.location.href = 'login.html';
};

