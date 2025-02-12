const express = require('express');
const app = express();
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');


let ADMINS = [];
let USERS = [];
let COURSES = [];

//req data parsers
app.use(express.json());

//Auth Middleware
const AUTH_SECRET = "dummy-encryption-key"
//need a middleware to look after the whole Oauth for both user and admins
const JWTAuth = function(req, res, next) {
  //if signup/login route generate the jwt and populate res with auth token
  if (req.path === "/signup" || req.path === "/login") {
    let username, password;
    if (req.path === "/login") {
      username = req.get("username");
      password = req.get("password");
    } else {
      username = req.body.username;
      password = req.body.password;
    }
    if (req.path === "/login" && !isUserAuthenticated(username, password, (req.baseUrl === "/admin") ? ADMINS : USERS)) {
      res.status(403).send("Invalid Credentials");
    }else{
      res.body = {};
      res.body.token = jwt.sign({username, password}, AUTH_SECRET, {expiresIn: '1h'});
      next();
    }
  } else {
    //any other path then validate the passed token
    if (req.get("Authorization") != null) {
      let token = req.get("Authorization").split(" ")[1];
      jwt.verify(token, AUTH_SECRET, (err, decoded) => {
        if (err) {
          res.status(403).send("Token Expired or something went Wrong : " + err);
        } else {
          req.username = decoded.username;
          req.password = decoded.password;
          if (isUserAuthenticated(req.username, req.password, (req.baseUrl === "/admin") ? ADMINS : USERS)) {
            next();
          } else {
            res.status(403).send("Token Invalid");
          }
        }
      });
    }else{
      res.status(403).send("Token missing");
    }
  }
}
//Auth middleware
app.use(["/admin", "/users"], JWTAuth);

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let user = {};
  user.username = req.body.username;
  user.password = req.body.password;
  user.uuid = uuidv4();
  ADMINS.push(user);
  console.log("Admin Created successfully")
  console.log("CURRENT ADMINS: ");
  console.log(ADMINS);
  res.body.message = "Admin created successfully";
  res.send(res.body);
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  console.log(`Admin ${req.get("username")} logged in successfully`)
  console.log("CURRENT ADMINS: ");
  console.log(ADMINS);
  res.body.message = "Logged in successfully";
  res.send(res.body);
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  let courseId = uuidv4();
  let newCourse = req.body;
  newCourse.courseId = courseId;
  COURSES.push(newCourse);
  console.log("CURRENT COURSES AVAILABLE: ");
  console.log(COURSES);
  res.send({message: 'Course created successfully', courseId: courseId})
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let courseIndex = getCourseIndex(courseId);
  if (getCourseIndex(courseId) !== -1) {
    let updatedCourse = req.body;
    updatedCourse.courseId = courseId;
    COURSES[courseIndex] = updatedCourse;
    console.log("CURRENT COURSES AVAILABLE: ");
    console.log(COURSES);
    res.send({message: 'Course updated successfully'});
  } else {
    res.send({message: 'Course id doesnot exist'})
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  let allCourses = {};
  allCourses.courses = COURSES;
  res.send(allCourses);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let user = {};
  user.username = req.body.username;
  user.password = req.body.password;
  user.uuid = uuidv4();
  USERS.push(user);
  console.log("User Created successfully")
  console.log("CURRENT USERS: ");
  console.log(USERS);
  res.body.message = "User created successfully";
  res.send(res.body);
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  console.log(`User ${req.get("username")} logged in successfully`)
  console.log("CURRENT USERS: ");
  console.log(USERS);
  res.body.message = "Logged in successfully";
  res.send(res.body);
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  let allCourses = {};
  allCourses.courses = COURSES;
  console.log("CURRENT COURSES AVAILABLE: ");
  console.log(COURSES);
  res.send(allCourses);

});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course

  let username = req.username;
  let courseId = req.params.courseId;
  if (getCourseIndex(courseId) !== -1) {
    for (let i = 0; i < USERS.length; i++) {
      if (USERS[i].username === username) {
        if (USERS[i].purchasedCourseIds != null) {
          USERS[i].purchasedCourseIds.add(courseId);
        } else {
          USERS[i].purchasedCourseIds = new Set();
          USERS[i].purchasedCourseIds.add(courseId);
        }
        console.log("CURRENT USERS: ");
        console.log(USERS);
        res.send({message: 'Course purchased successfully'});
      }
    }
  } else {
    res.send("Course Id passed doesn't exist");
  }


});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses

  let userPurchasedCourses = {};
  userPurchasedCourses.purchasedCourses = [];

  let purchasedCourseIds = new Set();
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].username === req.username) {
      purchasedCourseIds = USERS[i].purchasedCourseIds;
    }
  }

  for (let i = 0; i < COURSES.length; i++) {
    if (purchasedCourseIds.has(COURSES[i].courseId)) {
      userPurchasedCourses.purchasedCourses.push(COURSES[i]);
    }
  }
  res.send(userPurchasedCourses);


});

//util functions

//can be a middleware instead
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

//returns index of a particular courseId
function getCourseIndex(courseId) {
  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].courseId === courseId) {
      return i;
    }
  }
  return -1;
}

//  DB connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const password = mBETp6ZeWgEYBoiH
const uri = `mongodb+srv://litheshshetty:${password}@cluster0.ieiik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error_
    await client.close();
  }
}
run().catch(console.dir);

//db interaction functions write all CRUD functions and use those in url handlers

function insertIntoAdmins(){

}

function insertIntoUsers(){

}

function insertPurchasedCoursesIntoUsers(){

}

function getUserInfo(){

}

function addCourseAdmin(){

}

function updateCourseAdmin(){

}

function readCourses(){

}




app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

