/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  str = str.toLowerCase();
  let start = 0;
  let end = str.length - 1;
  while(start < end) {
    while(str.charAt(start) in ["?", "," , "!", " "]){
      start++;
    }
    while(str.charAt(end) in ["?", "," , "!", " "]){
      end--;
    }
    if(str.charAt(start) != str.charAt(end)){
      return false;
    }
    start++;
    end--;
  }
  return true;
}

module.exports = isPalindrome;
