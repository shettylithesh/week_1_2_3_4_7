/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
    if(str1.length != str2.length){
      return false;
    }
    str1 = str1.trim().toUpperCase();
    str2 = str2.trim().toUpperCase();

    const alphaHash = new Array(26).fill(0);

    for(let i = 0; i < str1.length; i++){
        alphaHash[str1.charCodeAt(i) - "A".charCodeAt(0)]++;
        alphaHash[str2.charCodeAt(i) - "A".charCodeAt(0)]--;
    }
    
    const isAnagram = alphaHash.every(ele => ele == 0);
    return isAnagram;
}

module.exports = isAnagram;
