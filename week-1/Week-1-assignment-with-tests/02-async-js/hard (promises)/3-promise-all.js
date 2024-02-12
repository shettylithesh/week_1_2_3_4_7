/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */


function waitOneSecond() {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve();
    }, 1000);
  });

}

function waitTwoSecond() {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve();
    }, 2000);
  });
}

function waitThreeSecond() {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve();
    }, 3000);
  });
}

function calculateTime() {
  let start = Date.now();
  let combinedPromise = Promise.all([waitOneSecond(), waitTwoSecond(), waitThreeSecond()]);
  combinedPromise.then(()=>{
    let elapsedTime = (Date.now() - start)/1000;
    console.log("Time taken : " + elapsedTime);
  })
}

calculateTime();