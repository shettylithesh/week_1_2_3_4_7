/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

function wait(n) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        }, n * 1000);
    })
}

let n = 5;
let PromiseObj = wait(n);

PromiseObj.then(()=>{
    console.log(`Promise resolved after ${n} seconds`)
});
