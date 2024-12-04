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
                        response.json({ success: true });
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



// create

// read 

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
