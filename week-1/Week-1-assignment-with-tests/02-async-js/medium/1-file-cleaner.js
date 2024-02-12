const fs = require('fs');
const path = require('path');

function fileCleaner(filepath){

  fs.readFile(filepath, 'utf-8', function(err, data){
    if(err) throw err;
    console.log("Before :" + data);
      data = data.replace(/ \s+ /g, ' ');
      fs.writeFile(filepath, data, function(err){
          if(err) throw err;
          else{
            console.log("After : "+ data)
          }
      });
  });
}

fileCleaner("hello.txt")