const express = require('express');
const app = express();
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');
const { MongoClient, ServerApiVersion } = require('mongodb');
var jwt = require('jsonwebtoken');


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
    if (req.path === "/login" && !isUserAuthenticated(username, password, (req.baseUrl === "/admin") ? "ADMINS" : "USERS")) {
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
          if (isUserAuthenticated(req.username, req.password, (req.baseUrl === "/admin") ? "ADMINS" : "USERS")) {
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
  user.password = Hash(req.body.password);
  user.uuid = uuidv4();
  addAdmin(user);
  console.log("Admin Created successfully")
  res.body.message = "Admin created successfully";
  res.send(res.body);
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  console.log(`Admin ${req.get("username")} logged in successfully`)
  res.body.message = "Logged in successfully";
  res.send(res.body);
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  let courseId = uuidv4();
  let newCourse = req.body;
  newCourse.courseId = courseId;
  addCourseAsAdmin(newCourse);
  res.send({message: 'Course created successfully', courseId: courseId})
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  let updatedCourse = req.body;
  updatedCourse.courseId = req.params.courseId;
  if(updateCourseAsAdmin(updatedCourse)){
    res.send({message: 'Course updated successfully'});
  }else{
    res.send({message: 'Course id doesnot exist'})
  }
});

app.get('/admin/courses', async (req, res) => {
  // array of courses
  let allCourses = await getAllCourses();
  res.send(allCourses);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let user = {};
  user.username = req.body.username;
  user.password = Hash(req.body.password);
  user.uuid = uuidv4();
  addUser(user);
  res.body.message = "User created successfully";
  res.send(res.body);
});

app.post('/users/login', (req, res) => {
  console.log(`User ${req.get("username")} logged in successfully`)
  res.body.message = "Logged in successfully";
  res.send(res.body);
});

app.get('/users/courses', async (req, res) => {
  let allCourses = await getAllCourses();
  res.send(allCourses);

});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course

  let username = req.username;
  addPurchasedCourseIntoUsers(username, req.params.courseId);
  res.send({message: 'Course purchased successfully'});
  //res.send("Course Id passed doesn't exist")

});

app.get('/users/purchasedCourses', async (req, res) => {
  // logic to view purchased courses

  let userPurchasedCourseIds = await getPurchasedCourseIds(req.username);
  let purchasedCourses = {"courses": []};
  for (let courseId of userPurchasedCourseIds) {
    let course = await getCourseById(courseId);
    purchasedCourses["courses"].push(course);
  }
  res.send(purchasedCourses);
});

//util functions

//can be a middleware instead
async function isUserAuthenticated(username, password, collectionName) {

  let userInfo = await getUserInfo(username, collectionName);
  let passwordHash = Hash(password);
  if(passwordHash === userInfo.password){
    return true;
  }
  return false;
}


function Hash(password){
  let hash = password;
  return hash;
}

//  DB connection
const password = "mBETp6ZeWgEYBoiH"
const uri = `mongodb+srv://litheshshetty:${password}@cluster0.ieiik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const db = client.db("Course-selling-app");
const admins = db.collection("ADMINS");
const users = db.collection("USERS");
const courses = db.collection("COURSES");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error_
    await client.close();
  }
}
run().catch(console.dir);

//db interaction functions write all CRUD functions and use those in url handlers
async function getUserInfo(username, collectionName) {
  await client.connect();
  const collection = (collectionName === "USERS") ? users : admins;
  const result = await collection.findOne({ username : username });
  console.log(result);
  return result;
}

async function addAdmin(user){
  await client.connect();
  const result = await admins.insertOne(user);
  console.log(result);
  console.log(
      `new Admin was added`,
  );
}

async function addCourseAsAdmin(newCourse){
  await client.connect();
  const result = await courses.insertOne(newCourse);
  console.log(result);
  console.log(
      `new Course was added`,
  );
}

//return true if updated, false if courseId is non-existent
async function updateCourseAsAdmin(updatedCourse){
  await client.connect();

  const result = await courses.updateOne({ "courseId" : updatedCourse.courseId },
      {$set: {"title": updatedCourse.title, "description": updatedCourse.description, "price": updatedCourse.price, "imageLink":updatedCourse.imageLink, "published":updatedCourse.published}}
  );
  console.log(result);
  console.log(
      `Course was updated`,
  );

}


async function addUser(user){
  await client.connect();
  const result = await users.insertOne(user);
  console.log(result);
  console.log(
      `new User was added`,
  );
}


async function addPurchasedCourseIntoUsers(username, courseId) {
  await client.connect();
  //append new courseId to the array
  let updateDocument = {
    $push:{
      purchasedCourseIds : courseId
    }
  }
  const result = await users.updateOne({username : username}, updateDocument, {upsert : true});
  console.log(result);
  console.log(
      `new Course was added to purchased courses`,
  );
}

//array of courseIds purchased by a specific user
async function getPurchasedCourseIds(username){
  await client.connect();
  const results = await users.findOne({ username : username });
  console.log(results);
  return results.purchasedCourseIds;
}

//return array of all the courses
async function getAllCourses(){
  await client.connect();
  const result = await courses.find().toArray();
  console.log(result);
  return result;
}

async function getCourseById(courseId) {
  await client.connect();
  const course = await courses.findOne({ courseId : courseId });
  console.log(course);
  return course;

}


app.listen(3000, () => {
  console.log('Course-sell Server is listening on port 3000');
});

