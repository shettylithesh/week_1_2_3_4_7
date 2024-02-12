function clock() {
  setInterval(function () {
    let currentTime = new Date();

    // Get the current time
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();

    console.log(hours + ":" + minutes + ":" + seconds);
    console.log(hours > 12 ? hours - 12 + ":" + minutes + ":" + seconds + " " + "PM" : hours + ":" + minutes + ":" + seconds + " " + "AM");
  }, 1000);
}

clock();
