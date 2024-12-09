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
