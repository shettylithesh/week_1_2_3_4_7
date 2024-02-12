function counter(){
  let count = 0;
  recursiveCounter(count);
}

function recursiveCounter(count){
    console.log(count);
  setTimeout(recursiveCounter, 1000, ++count)
}
counter();