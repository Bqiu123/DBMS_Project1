document.addEventListener('DOMContentLoaded', function () {
    // Load all requests on page load
    loadAllRequests();
    loadAllQuoteResponses();
    loadAllOrders();
    loadAllBills();
    loadTopClients();
    loadClientsWithPendingOrRejectedResponses();
    loadAcceptedQuotesThisMonth();
    loadClientsWithoutRequests();
    loadLargestDriveways();
    loadOverdueBills();
    loadBadClients();
    loadGoodClients();


    // Back button functionality
    document.querySelector('#back-btn').onclick = function () {
        window.location.href = 'davidsmithdashboard.html';
    };
});

function loadAllRequests() {
    fetch('http://localhost:5050/allRequests')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateRequestTable(data.data);
            } else {
                alert("Failed to load requests.");
            }
        })
        .catch(err => console.error("Error loading requests:", err));
}

function populateRequestTable(data) {
    const tableBody = document.querySelector('#request-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(request => {
        const row = `
            <tr>
                <td>${request.QuoteID}</td>
                <td>${request.ClientID}</td>
                <td>${request.first_name} ${request.last_name}</td>
                <td>${request.PropertyAddress}</td>
                <td>${request.SquareFeet}</td>
                <td>${request.ProposedPrice}</td>
                <td>${request.Note ? request.Note : 'No additional information'}</td>
                <td>${request.RequestStatus}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadAllQuoteResponses() {
    fetch('http://localhost:5050/allQuoteResponses')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateQuoteResponseTable(data.data);
            } else {
                alert("Failed to load quote responses.");
            }
        })
        .catch(err => console.error("Error loading quote responses:", err));
}

function populateQuoteResponseTable(data) {
    const tableBody = document.querySelector('#quote-response-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(response => {
        const startTime = new Date(response.StartTime).toLocaleString();
        const endTime = new Date(response.EndTime).toLocaleString();

        const row = `
            <tr>
                <td>${response.ResponseID}</td>
                <td>${response.QuoteID}</td>
                <td>${response.ClientID}</td>
                <td>${response.first_name} ${response.last_name}</td>
                <td>${response.PropertyAddress}</td>
                <td>${response.Price}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td>${response.ResponseNote || 'No note'}</td>
                <td>${response.QuoteStatus}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadAllOrders() {
    fetch('http://localhost:5050/allOrders')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateOrderTable(data.data);
            } else {
                alert("Failed to load orders.");
            }
        })
        .catch(err => console.error("Error loading orders:", err));
}

function populateOrderTable(data) {
    const tableBody = document.querySelector('#order-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(order => {
        const workStartTime = order.WorkStartTime
            ? new Date(order.WorkStartTime).toLocaleString()
            : 'Not started';
        const workEndTime = order.WorkEndTime
            ? new Date(order.WorkEndTime).toLocaleString()
            : 'Not completed';

        const row = `
            <tr>
                <td>${order.OrderID}</td>
                <td>${order.QuoteID}</td>
                <td>${order.ClientID}</td>
                <td>${order.first_name} ${order.last_name}</td>
                <td>${order.PropertyAddress}</td>
                <td>${order.Status}</td>
                <td>${workStartTime}</td>
                <td>${workEndTime}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadAllBills() {
    fetch('http://localhost:5050/allBills')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateBillsTable(data.data);
            } else {
                alert("Failed to load bills.");
            }
        })
        .catch(err => console.error("Error loading bills:", err));
}

function populateBillsTable(data) {
    const tableBody = document.querySelector('#bills-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(bill => {
        const generatedTime = bill.GeneratedTime
            ? new Date(bill.GeneratedTime).toLocaleString()
            : 'Not generated';
        const paidTime = bill.PaidTime
            ? new Date(bill.PaidTime).toLocaleString()
            : 'Not paid';

        const row = `
            <tr>
                <td>${bill.BillID}</td>
                <td>${bill.OrderID}</td>
                <td>${bill.QuoteID}</td>
                <td>${bill.ClientID}</td>
                <td>${bill.first_name} ${bill.last_name}</td>
                <td>${bill.PropertyAddress}</td>
                <td>${bill.Price}</td>
                <td>${bill.BillStatus}</td>
                <td>${generatedTime}</td>
                <td>${paidTime}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadTopClients() {
    fetch('http://localhost:5050/topClients')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateTopClientsTable(data.data);
            } else {
                alert("Failed to load top clients.");
            }
        })
        .catch(err => console.error("Error loading top clients:", err));
}

function populateTopClientsTable(data) {
    const tableBody = document.querySelector('#top-clients-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(client => {
        const row = `
            <tr>
                <td>${client.ClientID}</td>
                <td>${client.first_name} ${client.last_name}</td>
                <td>${client.CompletedOrders}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadClientsWithPendingOrRejectedResponses() {
    fetch('http://localhost:5050/clientsWithPendingOrRejectedResponses')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populatePendingRejectedClientsTable(data.data);
            } else {
                alert("Failed to load clients with pending or rejected responses.");
            }
        })
        .catch(err => console.error("Error loading clients with pending or rejected responses:", err));
}

function populatePendingRejectedClientsTable(data) {
    const tableBody = document.querySelector('#pending-rejected-clients-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(client => {
        const row = `
            <tr>
                <td>${client.ClientID}</td>
                <td>${client.first_name} ${client.last_name}</td>
                <td>${client.AffectedResponses}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadAcceptedQuotesThisMonth() {
    fetch('http://localhost:5050/acceptedQuotesThisMonth')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateAcceptedQuotesThisMonthTable(data.data);
            } else {
                alert("Failed to load accepted quotes for this month.");
            }
        })
        .catch(err => console.error("Error loading accepted quotes for this month:", err));
}

function populateAcceptedQuotesThisMonthTable(data) {
    const tableBody = document.querySelector('#accepted-quotes-this-month-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(quote => {
        const startTime = new Date(quote.StartTime).toLocaleString();
        const endTime = new Date(quote.EndTime).toLocaleString();

        const row = `
            <tr>
                <td>${quote.ClientID}</td>
                <td>${quote.first_name} ${quote.last_name}</td>
                <td>${quote.QuoteID}</td>
                <td>${quote.Price}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadClientsWithoutRequests() {
    fetch('http://localhost:5050/clientsWithoutRequests')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateClientsWithoutRequestsTable(data.data);
            } else {
                alert("Failed to load clients without requests.");
            }
        })
        .catch(err => console.error("Error loading clients without requests:", err));
}

function populateClientsWithoutRequestsTable(data) {
    const tableBody = document.querySelector('#clients-without-requests-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(client => {
        const dateRegistered = new Date(client.date_registered).toLocaleDateString();

        const row = `
            <tr>
                <td>${client.ClientID}</td>
                <td>${client.first_name} ${client.last_name}</td>
                <td>${client.email}</td>
                <td>${dateRegistered}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadLargestDriveways() {
    fetch('http://localhost:5050/largestDriveways')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateLargestDrivewaysTable(data.data);
            } else {
                alert("Failed to load largest driveways.");
            }
        })
        .catch(err => console.error("Error loading largest driveways:", err));
}

function populateLargestDrivewaysTable(data) {
    const tableBody = document.querySelector('#largest-driveways-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(driveway => {
        const row = `
            <tr>
                <td>${driveway.PropertyAddress}</td>
                <td>${driveway.SquareFeet}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadOverdueBills() {
    fetch('http://localhost:5050/overdueBills')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateOverdueBillsTable(data.data);
            } else {
                alert("Failed to load overdue bills.");
            }
        })
        .catch(err => console.error("Error loading overdue bills:", err));
}

function populateOverdueBillsTable(data) {
    const tableBody = document.querySelector('#overdue-bills-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(bill => {
        const generatedTime = new Date(bill.GeneratedTime).toLocaleString();

        const row = `
            <tr>
                <td>${bill.BillID}</td>
                <td>${bill.OrderID}</td>
                <td>${bill.Price}</td>
                <td>${generatedTime}</td>
                <td>${bill.ClientID}</td>
                <td>${bill.first_name} ${bill.last_name}</td>
                <td>${bill.PropertyAddress}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadBadClients() {
    fetch('http://localhost:5050/badClients')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateBadClientsTable(data.data);
            } else {
                alert("Failed to load bad clients.");
            }
        })
        .catch(err => console.error("Error loading bad clients:", err));
}

function populateBadClientsTable(data) {
    const tableBody = document.querySelector('#bad-clients-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(client => {
        const row = `
            <tr>
                <td>${client.ClientID}</td>
                <td>${client.first_name} ${client.last_name}</td>
                <td>${client.email}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function loadGoodClients() {
    fetch('http://localhost:5050/goodClients')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateGoodClientsTable(data.data);
            } else {
                alert("Failed to load good clients.");
            }
        })
        .catch(err => console.error("Error loading good clients:", err));
}

function populateGoodClientsTable(data) {
    const tableBody = document.querySelector('#good-clients-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach(client => {
        const row = `
            <tr>
                <td>${client.ClientID}</td>
                <td>${client.first_name} ${client.last_name}</td>
                <td>${client.email}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
