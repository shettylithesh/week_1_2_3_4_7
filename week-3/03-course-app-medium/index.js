const express = require('express');
var jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//Auth middleware
app.use(["/admin", "/users"], JWTAuth);

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

//send 404 for unknown route


const AUTH_SECRET = "dummy-encryption-key"
//need a middleware to look after the whole Oauth for both user and admins
const JWTAuth = function(req, res, next){
  //if signup/login route generate the jwt and populate res with auth token
  if(req.path === "/signup" || req.path === "/login"){
    let username = req.get("username");
    let password = req.get("password");
    res.body.token = jwt.sign({username, password}, AUTH_SECRET, {expiresIn: '1h'});
    next();
  }else{
    //any other path then validate the passed token
    let token = req.get("Authorization").split(" ")[1];
    jwt.verify(token, AUTH_SECRET, (err, decoded) => {
      if(err){
        res.status(403).send("Token Expired or something went Wrong :" + err);
      }else{
        let username = decoded.username;
        let password = decoded.password;
        if(isUserAuthenticated(username, password,(req.baseUrl === "/admin")?ADMINS:USERS)){
          next();
        }else{
          res.status(403).send("Token Invalid");
        }
      }
    });
  }
}
function isUserAuthenticated(username, password, userData) {
  for (let i = 0; i < userData.length; i++) {
    if (userData[i].username === username) {
      if (userData[i].password === password) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
