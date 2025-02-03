const display = document.getElementById("display");

function addToDisplay(value) {
  if (value === "." && display.value.includes(".")) {
    return;
  }

  const lastChar = display.value[display.value.length - 1];
  const operators = "+-*/%^";
  if (
    operators.includes(value) &&
    (operators.includes(lastChar) || display.value === "")
  ) {
    return;
  }
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculateResult() {
  try {
    if (!isValidExpression(display.value)) {
      throw new Error("Syntax Error");
    }
    display.value = readDisplay(display.value);
    if (isNaN(display.value) || !isFinite(display.value)) {
      throw new Error("Error");
    }
  } catch (error) {
    display.value = "Error";
  }
}

function isValidExpression(expression) {
  try {
    new Function(`return (${expression})`);
    return true;
  } catch {
    return false;
  }
}

function readDisplay(expression) {
  const clearExpr = formatExpr(expression);
  const tokens = extractTokens(clearExpr);
  const reverseNotation = convertToReverseNotation(tokens);
  return evaluateReverseNotation(reverseNotation);
}

function formatExpr(expression) {
  return expression
    .replace(/\s+/g, "")
    .replace(/(\d)(\()/g, "$1*(")
    .replace(/(\))(\d)/g, ")*$2")
    .replace(/(\))(\()/g, ")*(")
    .replace(/\)\(/g, ")*(")
    .replace(/\(\(/g, "(")
    .replace(/\)\)/g, ")");
}

function extractTokens(expression) {
  const regex = /\d+(\.\d+)?|[+\-*/%^()]/g;
  return expression.match(regex);
}

function convertToReverseNotation(tokens) {
  const output = [];
  const stack = [];

  for (const token of tokens) {
    if (!isNaN(token)) {
      output.push(Number(token));
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      stack.pop();
    } else {
      while (
        stack.length &&
        precedence(stack[stack.length - 1]) >= precedence(token)
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    }
  }

  while (stack.length) {
    output.push(stack.pop());
  }

  return output;
}

function evaluateReverseNotation(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (!isNaN(token)) {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(applyOperator(a, b, token));
    }
  }

  return stack[0];
}

function precedence(operator) {
  return operator === "+" || operator === "-" ? 1 : 2;
}

function applyOperator(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? "Error" : a / b;
    case "^":
      return Math.pow(a, b);
    default:
      throw new Error("Invalid Operator");
  }
}

function calculateSquareRoot() {
  const value = Number(display.value);
  display.value = value >= 0 ? Math.sqrt(value) : "Error";
}

function calculatePower() {
  const base = Number(display.value);
  const exponent = Number(prompt("Enter the exponent:"));
  display.value = isNaN(exponent) ? "Error" : Math.pow(base, exponent);
}

function calculateLog() {
  const value = Number(display.value);
  display.value = value > 0 ? Math.log10(value) : "Error";
}

function calculatePi() {
  display.value = Math.PI;
}

function calculateTrig(func) {
  const radians = Number(display.value) * (Math.PI / 180);
  switch (func) {
    case "sin":
      display.value = Math.sin(radians);
      break;
    case "cos":
      display.value = Math.cos(radians);
      break;
    case "tan":
      display.value = Math.tan(radians);
      break;
    default:
      display.value = "Error";
  }
}

function calculatePercentage() {
  display.value = Number(display.value) / 100;
}
