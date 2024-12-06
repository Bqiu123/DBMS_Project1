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
