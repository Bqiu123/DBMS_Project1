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
// Register service
app.post('/register', (request, response) => {
    console.log("app: register a new user.");

    const { username, firstName, lastName, age, salary, password } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.registerUser(username, firstName, lastName, age, salary, password);

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to register user" });
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
app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    // console.log(request.body); 

    const {name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
   // .then(data => console.log({data: data})) // debug first before return by response
   .catch(err => console.log(err));
});




// read 

// Get users who have never logged in
app.get('/users/neverloggedin', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getUsersNeverLoggedIn();

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: "Failed to fetch users" });
        });
});



app.get('/getAll', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:name', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = dbService.getDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
          const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
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
