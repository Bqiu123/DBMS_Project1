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

document.addEventListener('DOMContentLoaded', function () {
    // Fetch quotes with client notes
    fetch('http://localhost:5050/quotesWithNotes')
        .then(response => response.json())
        .then(data => loadClientNotesTable(data['data']));

    // Add event listener to handle logout
    const logoutButton = document.querySelector('#logout-btn');
    logoutButton.onclick = function () {
        window.location.href = 'login.html';
    };
});

function formatDateTimeToLocal(dateTime) {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function loadClientNotesTable(data) {
    const tableBody = document.querySelector('#client-notes-table tbody');
    tableBody.innerHTML = '';

    data.forEach((quote) => {
        const formattedStartTime = formatDateTimeToLocal(quote.StartTime);
        const formattedEndTime = formatDateTimeToLocal(quote.EndTime);

        let row = `<tr>
                    <td>${quote.QuoteID}</td>
                    <td>${quote.ClientNote}</td>
                    <td>${quote.Price}</td>
                    <td>${formattedStartTime}</td>
                    <td>${formattedEndTime}</td>
                    <td>
                        <button class="adjust-quote-btn" data-id="${quote.QuoteID}" data-price="${quote.Price}" data-start="${formattedStartTime}" data-end="${formattedEndTime}">Adjust</button>
                    </td>
                </tr>`;
        tableBody.innerHTML += row;
    });

    document.querySelectorAll('.adjust-quote-btn').forEach((button) => {
        button.onclick = function () {
            const quoteID = button.dataset.id;
            const originalPrice = button.dataset.price;
            const originalStart = button.dataset.start;
            const originalEnd = button.dataset.end;

            document.querySelector('#adjusted-price').value = "";
            document.querySelector('#adjusted-start-time').value = "";
            document.querySelector('#adjusted-end-time').value = "";

            document.querySelector('#update-quote-form').style.display = 'block';

            document.querySelector('#submit-update-btn').onclick = function () {
                const adjustedPrice = document.querySelector('#adjusted-price').value || originalPrice;
                const adjustedStartTime = document.querySelector('#adjusted-start-time').value || originalStart;
                const adjustedEndTime = document.querySelector('#adjusted-end-time').value || originalEnd;

                updateQuoteDetails(quoteID, adjustedPrice, adjustedStartTime, adjustedEndTime);
            };
        };
    });
}


function updateQuoteDetails(quoteID, adjustedPrice, adjustedStartTime, adjustedEndTime) {
    const body = { quoteID };

    if (adjustedPrice.trim() !== "") {
        body.adjustedPrice = adjustedPrice;
    }
    if (adjustedStartTime.trim() !== "") {
        body.adjustedStartTime = adjustedStartTime;
    }
    if (adjustedEndTime.trim() !== "") {
        body.adjustedEndTime = adjustedEndTime;
    }

    fetch('http://localhost:5050/updateQuoteDetails', {
        headers: {
            'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Quote updated successfully.");
                location.reload();
            } else {
                alert("Failed to update quote.");
            }
        })
        .catch((err) => console.error("Error updating quote:", err));
}

function loadPendingOrdersTable() {
    fetch('http://localhost:5050/pendingOrders')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#pending-orders-table tbody');
            tableBody.innerHTML = '';

            data['data'].forEach(order => {
                let row = `
                    <tr>
                        <td>${order.OrderID}</td>
                        <td>${order.QuoteID}</td>
                        <td>${order.PropertyAddress}</td>
                        <td>${order.Price}</td>
                        <td>${order.Status}</td>
                        <td>
                            <button class="generate-bill-btn" data-id="${order.OrderID}">Generate Bill</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            // Add event listeners to "Generate Bill" buttons
            document.querySelectorAll('.generate-bill-btn').forEach(button => {
                button.onclick = function () {
                    const orderID = button.dataset.id;
                    if (confirm("Did you finish the work for this order?")) {
                        generateBill(orderID);
                    }
                };
            });
        })
        .catch(err => console.error("Error loading pending orders:", err));
}


function generateBill(orderID) {
    fetch('http://localhost:5050/generateBill', {
        headers: {
            'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ orderID: orderID }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Bill generated successfully.");
                loadPendingOrdersTable();
            } else {
                alert("Failed to generate bill.");
            }
        })
        .catch(err => console.error("Error generating bill:", err));
}

document.addEventListener('DOMContentLoaded', function () {
    loadPendingOrdersTable();
});

