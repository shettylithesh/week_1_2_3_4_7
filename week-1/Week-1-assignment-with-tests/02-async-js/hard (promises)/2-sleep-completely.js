/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep (seconds) {
    let start = Date.now();
    let elapsedTime = 0;
    while(elapsedTime < seconds){
        elapsedTime = (Date.now() - start)/1000; //milliseconds -> sec
    }

}

console.log("Main thread started executing");

let n = 10;
sleep(n);

console.log(`Main thread resumed after ${n} seconds`);