// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));


// Register service
app.post('/register', (request, response) => {
    console.log("app: register a new client.");

    const { username, firstName, lastName, address, creditCardNumber, phoneNumber, email, password } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.registerClient(username, firstName, lastName, address, creditCardNumber, phoneNumber, email, password);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to register client" });
        });
});


// Login service
app.post('/login', (request, response) => {
    console.log("app: user login attempt.");

    const { username, password } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.authenticateUser(username, password);

    result
        .then(data => {
            if (data) {
                // If the login is successful, update the signintime
                db.updateSigninTime(username)
                    .then(() => {
                        // Check if the user is David Smith
                        const isDavidSmith = (username.toLowerCase() === 'davidsmith');
                        response.json({ success: true, isDavidSmith: isDavidSmith, clientID: data.ClientID  });
                    })
                    .catch(err => {
                        console.log(err);
                        response.status(500).json({ success: false, message: "Failed to update sign-in time" });
                    });
            } else {
                response.json({ success: false, message: "Invalid credentials" });
            }
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Error during login" });
        });
});


// Quote Request Submission Service
app.post('/quoteRequest', (request, response) => {
    console.log("app: submit quote request.");

    const { clientID, propertyAddress, squareFeet, proposedPrice, note } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.submitQuoteRequest(clientID, propertyAddress, squareFeet, proposedPrice, note);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to submit quote request" });
        });
});

// Fetch pending quote requests
app.get('/pendingQuotes', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getPendingQuotes();

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch pending quotes" });
        });
});

// Reject a quote request
app.post('/rejectQuote', (request, response) => {
    const { quoteID, rejectionNote } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.rejectQuoteRequest(quoteID, rejectionNote);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to reject quote request" });
        });
});

// Generate a quote response
app.post('/generateQuote', (request, response) => {
    const { quoteID, price, startTime, endTime, responseNote } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.generateQuote(quoteID, price, startTime, endTime, responseNote);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to generate quote" });
        });
});

// Fetch all quote requests (including Pending and Accepted)
app.get('/getAllQuoteRequests', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllQuoteRequests();

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch quote requests" });
        });
});

// Fetch all requests made by a specific client
app.get('/clientRequests/:clientID', (request, response) => {
    const { clientID } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.getClientRequests(clientID);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch client requests" });
        });
});

app.get('/quoteResponse/:quoteID', (request, response) => {
    const { quoteID } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.getQuoteResponseDetails(quoteID);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch quote response details" });
        });
});


// Accept Quote
app.post('/acceptQuote', (request, response) => {
    const { quoteID } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.acceptQuote(quoteID);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to accept quote" });
        });
});

// Reject Quote Response
app.post('/rejectQuoteResponse', (request, response) => {
    const { quoteID } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.rejectQuoteResponse(quoteID);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to reject quote response" });
        });
});

// Negotiate Quote
app.post('/negotiateQuote', (request, response) => {
    const { quoteID, note } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.negotiateQuote(quoteID, note);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to submit negotiation note" });
        });
});

// Fetch quotes with Pending status and ClientNote
app.get('/quotesWithNotes', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getQuotesWithNotes();

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch quotes with notes" });
        });
});

// Update quote details
app.post('/updateQuoteDetails', (request, response) => {
    const { quoteID, adjustedPrice, adjustedStartTime, adjustedEndTime } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateQuoteDetails(quoteID, adjustedPrice, adjustedStartTime, adjustedEndTime);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to update quote details" });
        });
});


// Fetch pending orders
app.get('/pendingOrders', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getPendingOrders();

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch pending orders" });
        });
});

// Generate a bill for an order and update its status to Completed
app.post('/generateBill', (request, response) => {
    const { orderID } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.generateBillAndCompleteOrder(orderID);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to generate bill and update order status" });
        });
});

// Check QuoteStatus for a specific QuoteID
app.get('/checkQuoteStatus/:quoteID', (request, response) => {
    const { quoteID } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.getQuoteStatus(quoteID);

    result
        .then(status => {
            response.json({ success: true, status: status });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to check quote status" });
        });
});

// Fetch bills for a specific client
app.get('/clientBills/:clientID', (request, response) => {
    const { clientID } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.getClientBills(clientID);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch client bills" });
        });
});

// Pay bill
app.post('/payBill', (request, response) => {
    const { billID } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.payBill(billID);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to process bill payment" });
        });
});


// Negotiate a bill
app.post('/negotiateBill', (request, response) => {
    const { billID, note } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.negotiateBill(billID, note);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to submit negotiation note" });
        });
});

// Fetch client details
app.get('/client/:clientID', (request, response) => {
    const { clientID } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.getClientDetails(clientID);

    result
        .then(data => response.json({ success: true, ...data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch client details" });
        });
});

// Fetch bills with client notes
app.get('/billsWithNotes', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getBillsWithNotes();

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch bills with client notes" });
        });
});

// Adjust the price of a bill
app.post('/adjustBillPrice', (request, response) => {
    const { billID, newPrice } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.adjustBillPrice(billID, newPrice);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to adjust bill price" });
        });
});


// Get revenue for a date range
app.post('/calculateRevenue', (request, response) => {
    const { startDate, endDate } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.calculateRevenue(startDate, endDate);

    result
        .then(data => response.json({ success: true, revenue: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to calculate revenue" });
        });
});

// Fetch all requests with client details
app.get('/allRequests', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllRequests();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch requests" });
        });
});

// Fetch all quote responses with client details
app.get('/allQuoteResponses', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllQuoteResponses();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch quote responses" });
        });
});

// Fetch all orders with client and property details
app.get('/allOrders', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllOrders();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch orders" });
        });
});

// Fetch all bills with client and property details
app.get('/allBills', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllBills();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch bills" });
        });
});

// Fetch top clients with the most completed orders for David Smith
app.get('/topClients', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getTopClients();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch top clients" });
        });
});

// Fetch clients with at least 3 QuoteResponses marked as Rejected or Pending
app.get('/clientsWithPendingOrRejectedResponses', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getClientsWithPendingOrRejectedResponses();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch clients with pending or rejected responses" });
        });
});

// Fetch accepted quote responses for the current month
app.get('/acceptedQuotesThisMonth', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAcceptedQuotesThisMonth();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch accepted quotes for this month" });
        });
});

// Fetch clients who registered but never submitted any requests for quotes
app.get('/clientsWithoutRequests', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getClientsWithoutRequests();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch clients without requests" });
        });
});


// Fetch locations of the largest driveways David Smith worked on
app.get('/largestDriveways', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getLargestDriveways();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch largest driveways" });
        });
});

// Fetch overdue bills
app.get('/overdueBills', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getOverdueBills();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch overdue bills" });
        });
});

// Fetch bad clients
app.get('/badClients', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getBadClients();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch bad clients" });
        });
});

// Fetch good clients
app.get('/goodClients', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getGoodClients();

    result
        .then(data => response.json({ success: true, data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch good clients" });
        });
});


// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);
