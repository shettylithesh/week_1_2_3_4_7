const express = require('express');
const app = express();
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');


let ADMINS = [];
let USERS = [];
let COURSES = [];

//req data parsers
app.use(express.json());

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
  res.send({ "message": "Admin created successfully'" })
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let username = req.get("username");
  let password = req.get("password");

  if (isUserAuthenticated(username, password, ADMINS)) {
    console.log(`Admin ${username} logged in successfully`)
    console.log("CURRENT ADMINS: ");
    console.log(ADMINS);
    res.send("Logged in successfully");
  } else {
    res.send("User not Found or incorrect password used");
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  let newCourse = req.body;
  let username = req.get("username");
  let password = req.get("password");
  if (isUserAuthenticated(username, password, ADMINS)) {
    let courseId = uuidv4();
    newCourse.courseId = courseId;
    COURSES.push(newCourse);
    console.log("CURRENT COURSES AVAILABLE: ");
    console.log(COURSES);
    res.send({ message: 'Course created successfully', courseId: courseId })
  } else {
    res.send("User doesnot exist or incorrect password used")
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  let username = req.get("username");
  let password = req.get("password");
  if (isUserAuthenticated(username, password, ADMINS)) {
    let courseId = req.params.courseId;
    let courseIndex = getCourseIndex(courseId);
    if (getCourseIndex(courseId) != -1) {
      let updatedCourse = req.body;
      updatedCourse.courseId = courseId;
      COURSES[courseIndex] = updatedCourse;
      console.log("CURRENT COURSES AVAILABLE: ");
      console.log(COURSES);
      res.send({ message: 'Course updated successfully' });
    } else {
      res.send({ message: 'Course id doesnot exist' })
    }
  } else {
    res.send("User doesnot exist or incorrect password used");
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  let username = req.get("username");
  let password = req.get("password");
  if (isUserAuthenticated(username, password, ADMINS)) {
    let allCourses = {};
    allCourses.courses = COURSES;
    res.send(allCourses);
  } else {
    res.send("User doesnot exist or incorrect password used");
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let user = {};
  user.username = req.body.username;
  user.password = req.body.password;
  user.uuid = uuidv4();
  USERS.push(user);
  res.send({ "message": "User created successfully" });
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  let username = req.get("username");
  let password = req.get("password");

  if (isUserAuthenticated(username, password, USERS)) {
    res.send("Logged in successfully");
  } else {
    res.send("User doesnot exist or incorrect password used");
  }

});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  let username = req.get("username");
  let password = req.get("password");

  if (isUserAuthenticated(username, password, USERS)) {
    let allCourses = {};
    allCourses.courses = COURSES;
    res.send(allCourses);
  } else {
    res.send("User doesnot exist or incorrect password used");
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  if (isUserAuthenticated(username, password, USERS)) {
    let courseId = req.params.courseId;
    if (getCourseIndex(courseId) != -1) {
      for (let i = 0; i < USERS.length; i++) {
        if (USERS[i].username == username) {
          if (USERS[i].purchasedCourseIds != null) {
            USERS[i].purchasedCourseIds.add(courseId);
          } else {
            USERS[i].purchasedCourseIds = new Set();
            USERS[i].purchasedCourseIds.add(courseId);
          }
          res.send({ message: 'Course purchased successfully' });
        }
      }
    } else {
      res.send("Course Id passed doesn't exist");
    }
  } else {
    res.send("User doesnot exist or incorrect password used");
  }

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  if (isUserAuthenticated(username, password, USERS)) {
    let userPurchasedCourses = {};
    userPurchasedCourses.purchasedCourses = [];

    let purchasedCourseIds = new Set();
    for (let i = 0; i < USERS.length; i++) {
      if (USERS[i].username == username) {
        purchasedCourseIds = USERS[i].purchasedCourseIds;
      }
    }

    for (let i = 0; i < COURSES.length; i++) {
      if (purchasedCourseIds.has(COURSES[i].courseId)) {
        userPurchasedCourses.purchasedCourses.push(COURSES[i]);
      }
    }
    res.send(userPurchasedCourses);

  } else {
    res.send("User doesnot exist or incorrect password used");
  }

});

//util functions 

//can be a middleware instead 
function isUserAuthenticated(username, password, userData) {
  for (let i = 0; i < userData.length; i++) {
    if (userData[i].username == username) {
      if (userData[i].password == password) {
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
    if (COURSES[i].courseId == courseId) {
      return i;
    }
  }
  return -1;
}


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
