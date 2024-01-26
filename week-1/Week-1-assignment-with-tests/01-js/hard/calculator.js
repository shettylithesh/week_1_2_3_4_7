/*
  Implement a class `Calculator` having below methods
    - initialise a result variable in the constructor and keep updating it after every arithmetic operation
    - add: takes a number and adds it to the result
    - subtract: takes a number and subtracts it from the result
    - multiply: takes a number and multiply it to the result
    - divide: takes a number and divide it to the result
    - clear: makes the `result` variable to 0
    - getResult: returns the value of `result` variable
    - calculate: takes a string expression which can take multi-arithmetic operations and give its result
      example input: `10 +   2 *    (   6 - (4 + 1) / 2) + 7`
      Points to Note: 
        1. the input can have multiple continuous spaces, you're supposed to avoid them and parse the expression correctly
        2. the input can have invalid non-numerical characters like `5 + abc`, you're supposed to throw error for such inputs

  Once you've implemented the logic, test your code by running
  - `npm run test-calculator`
*/

class Calculator {
  constructor() {
    this.result = 0;
  }

  add(num) {
    this.result += num;
  }

  subtract(num) {
    this.result -= num;
  }

  multiply(num) {
    this.result *= num;
  }

  divide(num) {
    if (num === 0) {
      throw new Error();
    }
    this.result /= num;
  }

  clear() {
    this.result = 0;
  }

  getResult() {
    return this.result;
  }

  //Only logic to remember is top of stack has to be the highest priority operator so far at any given time
  calculate(expression) {
    // parse the expression and remove all whitespaces if present
    expression = expression.replace(/\s/g, "");

    let stack1 = []; //operand stack
    let stack2 = []; //operator stack
    let priority = { "+": 1, "-": 1, "*": 2, "/": 2 };

    //Now on processed expression use stack and find result else throw error if invalid digit
    for (let i = 0; i < expression.length; i++) {
      let char = expression.charAt(i);

      if (this.isDigit(char)) {
        stack1.push(char);
      }else if(char === "("){
        stack2.push(char);
      }else if (this.isOperator(char)) {
        //priority check and accordingly pop the stack
        let top = stack2[stack2.length - 1];
        if (top != "(" && stack2.length != 0 && priority[char] <= priority[top]) {
          while (stack2.length != 0 && priority[char] <= priority[top]) {
            let operator = stack2.pop();
            let op2 = stack1.pop();
            let op1 = stack1.pop();
            stack1.push(this.solve(op1, op2, operator));
            top = stack2[stack2.length - 1];
          }
        }
        stack2.push(char);
      } else if (char === ")") {
        //pop till you find a open brace if no open brance found and stack empty throw error
        let top = stack2.pop();
        while (top != "(") {
          let operator = top;
          let op2 = stack1.pop();
          let op1 = stack1.pop();
          stack1.push(this.solve(op1, op2, operator));
          top = stack2.pop();
        }
      } else {
        throw new Error("Invalid character in the expression");
      }
    }
    //traversed expression fully but processing not completed yet
    while (stack2.length != 0) {
      let operator = stack2.pop();
      let op2 = stack1.pop();
      let op1 = stack1.pop();
      stack1.push(this.solve(op1, op2, operator));
    }
    this.result = parseInt(stack1[stack1.length - 1]);
  }

  solve(op1, op2, operator) {
    op1 = parseInt(op1);
    op2 = parseInt(op2);
    switch (operator) {
      case "+":
        return op1 + op2;
      case "-":
        return op1 - op2;
      case "*":
        return op1 * op2;
      case "/":
        if (op2 == 0) throw new Error("Divide by zero error");
        return op1 / op2;
    }
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isOperator(char) {
    return (
      char === "+" ||
      char === "-" ||
      char === "*" ||
      char === "/" 
    );
  }
}

let a = new Calculator();
// a.calculate("2+3*4")
// console.log(a.getResult())
a.calculate("(   5 + 3) /   6   ");
console.log(a.getResult());
a.calculate("1 - (4 + 2)");
console.log(a.getResult());
a.calculate("(2 + 3) * (6 - (4 + 1) / 2) + 7");
console.log(a.getResult());
a.calculate("1 +   2 *    (   6 - (4 + 1) / 2) + 7");
console.log(a.getResult());
console.log(a.calculate("1 * (2 + 3) + xyz"));
console.log(a.calculate("1 * (2 + 3) + xyz"));
module.exports = Calculator;
