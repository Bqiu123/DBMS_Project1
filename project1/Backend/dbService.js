// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 


// if you use .env to configure
/*
console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("PASSWORD: " + process.env.PASSWORD);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});
*/

// if you configure directly in this file, there is a security issue, but it will work
const connection = mysql.createConnection({
     host:"localhost",
     user:"root",        
     password:"",
     database:"web_app",
     port:3306
});



connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 

class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        return instance? instance: new DbService();
    }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "names" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "names" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */

   async registerClient(username, firstName, lastName, address, creditCardNumber, phoneNumber, email, password) {
      try {
          const dateRegistered = new Date();
          const response = await new Promise((resolve, reject) => {
              const query = `
                  INSERT INTO client (username, first_name, last_name, address, credit_card_number, phone_number, email, password, date_registered)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
              `;
              connection.query(query, [username, firstName, lastName, address, creditCardNumber, phoneNumber, email, password, dateRegistered], (err, result) => {
                  if (err) reject(new Error(err.message));
                  else resolve(result.insertId);
              });
          });
  
          console.log("New client registered with ID: ", response);
          return response;
      } catch (error) {
          console.log(error);
      }
  }
  


   async authenticateUser(username, password) {
      try {
         const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM client WHERE username = ? AND password = ?;";
            connection.query(query, [username, password], (err, results) => {
                  if (err) reject(new Error(err.message));
                  else resolve(results.length > 0);
            });
         });

         return response; // returns true if user exists, false otherwise
      } catch (error) {
         console.log(error);
      }
   }


   async updateSigninTime(username) {
      try {
         const response = await new Promise((resolve, reject) => {
            const query = "UPDATE client SET signintime = ? WHERE username = ?";
            const currentTime = new Date();
            connection.query(query, [currentTime, username], (err, result) => {
                  if (err) reject(new Error(err.message));
                  else resolve(result.affectedRows);
            });
         });

         return response === 1 ? true : false;
      } catch (error) {
         console.log(error);
      }
   }


}

module.exports = DbService;
