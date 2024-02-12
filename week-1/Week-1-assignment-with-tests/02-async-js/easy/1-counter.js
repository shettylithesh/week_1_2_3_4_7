function counter(){
  let count = 0;
  setInterval(function(){
    console.log(count);
    count++;
  }, 1000);
}

counter();