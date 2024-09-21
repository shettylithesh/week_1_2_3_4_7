/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
    return new Promise((resolve, reject)=>{
        console.log("Async code inside promise object getting started") //1
        setTimeout(()=>{
            resolve();
        }, n * 1000);
        console.log("Main thread was here first and was not blocked by setTimeout"); //2
    })
}

let n = 5;
let PromiseObj = wait(n);

console.log("Async code has started in the background since promise obj is created, it doesn't care about promise resolution"); //3

PromiseObj.then(()=>{
    console.log(`Promise resolved after ${n} seconds`) //5 .then() is async its waiting for promiseObj to get resolved, once its resolved only then it adds the callback to the queue 
});

console.log("Main thread was finally here without getting blocked"); //4