document.addEventListener('DOMContentLoaded', function() {
    // Fetch pending quote requests and display them in the table
    fetch('http://localhost:5050/pendingQuotes')
    .then(response => response.json())
    .then(data => loadQuoteRequestsTable(data['data']));
});

function loadQuoteRequestsTable(data) {
    const tableBody = document.querySelector('#quote-requests-table tbody');
    tableBody.innerHTML = '';

    data.forEach(quote => {
        let row = `<tr>
                    <td>${quote.QuoteID}</td>
                    <td>${quote.ClientID}</td>
                    <td>${quote.PropertyAddress}</td>
                    <td>${quote.SquareFeet}</td>
                    <td>${quote.ProposedPrice}</td>
                    <td>${quote.Note ? quote.Note : 'No additional information'}</td> <!-- Display the note -->
                    <td>`;

        // Show appropriate action based on RequestStatus
        if (quote.RequestStatus === 'Pending') {
            row += `
                <button class="reject-btn" data-id="${quote.QuoteID}">Reject</button>
                <button class="generate-quote-btn" data-id="${quote.QuoteID}">Generate Quote</button>`;
        } else if (quote.RequestStatus === 'Accepted') {
            row += `Quote Generated`;
        } else if (quote.RequestStatus === 'Rejected') {
            row += `Request Rejected`;
        }

        row += `</td></tr>`;
        tableBody.innerHTML += row;
    });

    // Add event listeners to the reject buttons
    document.querySelectorAll('.reject-btn').forEach(button => {
        button.onclick = function () {
            const quoteID = button.dataset.id;
            document.querySelector('#rejection-form').style.display = 'block';
            document.querySelector('#submit-rejection-btn').onclick = function () {
                const rejectionNote = document.querySelector('#rejection-note').value;
                rejectQuoteRequest(quoteID, rejectionNote);
            };
        };
    });

    // Add event listeners to the generate quote buttons
    document.querySelectorAll('.generate-quote-btn').forEach(button => {
        button.onclick = function () {
            const quoteID = button.dataset.id;
            document.querySelector('#quote-generation-form').style.display = 'block';
            document.querySelector('#submit-quote-btn').onclick = function () {
                const price = document.querySelector('#price').value;
                const startTime = document.querySelector('#start-time').value;
                const endTime = document.querySelector('#end-time').value;
                const responseNote = document.querySelector('#response-note').value;
                generateQuote(quoteID, price, startTime, endTime, responseNote);
            };
        };
    });
}

// Call this function when the document is loaded or after an action is performed (e.g., quote generation)
document.addEventListener('DOMContentLoaded', function() {
    // Fetch all quote requests including pending, accepted, and rejected
    fetch('http://localhost:5050/getAllQuoteRequests')
        .then(response => response.json())
        .then(data => loadQuoteRequestsTable(data['data']));
    
    // Add event listener for the logout button
    const logoutButton = document.querySelector('#logout-btn');
    logoutButton.onclick = function () {
        // Clear any stored session data (if applicable)
        // For example: sessionStorage.removeItem('userSession');
        
        // Redirect to the login page
        window.location.href = 'login.html';
    };
});



function rejectQuoteRequest(quoteID, rejectionNote) {
    fetch('http://localhost:5050/rejectQuote', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ quoteID: quoteID, rejectionNote: rejectionNote })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Quote request rejected successfully.");
            location.reload();
        } else {
            alert("Failed to reject quote request.");
        }
    })
    .catch(err => console.error("Error rejecting quote request: ", err));
}

function generateQuote(quoteID, price, startTime, endTime, responseNote) {
    fetch('http://localhost:5050/generateQuote', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ quoteID: quoteID, price: price, startTime: startTime, endTime: endTime, responseNote: responseNote })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Quote generated successfully.");
            location.reload();
        } else {
            alert("Failed to generate quote.");
        }
    })
    .catch(err => console.error("Error generating quote: ", err));
}
