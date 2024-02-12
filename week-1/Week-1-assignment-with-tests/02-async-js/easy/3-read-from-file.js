const fs = require('fs');
const path = require('path');

function readFromFile(fileName) {
  // Write code here
  fs.readFile(fileName, 'utf8', function(err, data) {
    if(err){
      console.error("Error reading file : "+err.message);
    }
    console.log("data from file " + fileName);
    console.log(data);
  })
  
}


readFromFile(path.resolve('hello.txt'))