const fs = require('fs');
const path = require('path');

function writeToFile(fileName, data) {
  // Write code here
  fs.writeFile(fileName, data, function(err) {
    if(err){
      console.error(err);
    }else{
      console.log(data); //closure
    }
  })
}


writeToFile(path.resolve('hello.txt'), 'Hello World!')