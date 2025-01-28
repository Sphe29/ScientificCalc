const display = document.getElementById('display');

function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = '';
}

function calculateResult() {
  try {
    display.value = evaluateExpression(display.value);
  } catch {
    display.value = 'Error';
  }
}

function evaluateExpression(expression) {
  const sanitizedExpression = sanitizeExpression(expression);
  const tokens = tokenize(sanitizedExpression);
  const rpn = convertToRPN(tokens);
  return evaluateRPN(rpn);
}

function sanitizeExpression(expression) {
  return expression
    .replace(/\s+/g, '')                
    .replace(/(\d)(\()/g, '$1*(')      
    .replace(/(\))(\d)/g, ')*$2')      
    .replace(/(\))(\()/g, ')*(')       
    .replace(/\)\(/g, ')*(')           
    .replace(/\(\(/g, '(')             
    .replace(/\)\)/g, ')');            
}

function tokenize(expression) {
  const regex = /\d+(\.\d+)?|[+\-*/()]|\s+/g;
  return expression.match(regex).filter((token) => !/^\s+$/.test(token));
}

function convertToRPN(tokens) {
  const output = [];
  const stack = [];

  for (const token of tokens) {
    if (!isNaN(token)) {
      output.push(Number(token));
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      stack.pop();
    } else {
      while (stack.length && precedence(stack[stack.length - 1]) >= precedence(token)) {
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

function evaluateRPN(tokens) {
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
  return operator === '+' || operator === '-' ? 1 : 2;
}

function applyOperator(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      throw new Error('Invalid Operator');
  }
}

function calculateSqrt() {
  display.value = Math.sqrt(Number(display.value));
}

function calculatePower() {
  const base = Number(prompt('Enter the base:'));
  const exponent = Number(prompt('Enter the exponent:'));
  display.value = Math.pow(base, exponent);
}

function calculateExp() {
  display.value = Math.exp(Number(display.value));
}

function calculateLog() {
  display.value = Math.log10(Number(display.value));
}

function calculatePi() {
  display.value = Math.PI;
}

function calculateTrig(func) {
  const radians = Number(display.value) * (Math.PI / 180);
  switch (func) {
    case 'sin':
      display.value = Math.sin(radians);
      break;
    case 'cos':
      display.value = Math.cos(radians);
      break;
    case 'tan':
      display.value = Math.tan(radians);
      break;
    default:
      display.value = 'Error';
  }
}
