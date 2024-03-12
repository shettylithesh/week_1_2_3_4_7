/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const { v4: uuidv4 } = require('uuid');

let users = [];

app.use(express.json())
app.post('/signup', (req, res)=>{
  let userInfo = req.body;
  let userName = userInfo["email"];

  let index = getUser(userName);

  if(index == -1){
    let userId = uuidv4();
    userInfo["id"] = userId;
    users.push(userInfo);
    res.status(201).send('Signup successful');
  }else{
    res.status(400).send();
  }
});

app.post('/login', (req, res) =>{
  let credentials = req.body;
  let index = getUser(credentials["email"]);
  if(index != -1 && users[index]["password"] == credentials["password"]){
    let user = users[index];
    user["authToken"] = uuidv4();
    res.status(200).json(user);
  }else{
    res.status(401).send('Unauthorized');
  }
});
//returns index of the user if user exists or else retuens -1
app.get('/data', (req, res) =>{
  let email = req.headers["email"];
  let password = req.headers["password"];
  let index = getUser(email);
  if(index != -1 && users[index]["password"] == password){
    res.status(200).json({"users" : users});
  }else{
    res.status(401).send('Unauthorized');
  }
});

app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});

function getUser(userName){
  for(let i = 0; i < users.length; i++){
    if(userName == users[i]["email"]){
      return i;
    }
  }
  return -1;
}
// let port = 3000;
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app;
