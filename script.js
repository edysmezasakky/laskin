const currentValueElement = document.querySelector("#current-value");
const previousValueElement = document.querySelector("#previous-value");
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "0";
let previousValue = "";
let operation = null;
let shouldResetCurrent = false;

function updateDisplay() {
  currentValueElement.textContent = currentValue;
  previousValueElement.textContent = operation
    ? `${previousValue} ${operation}`
    : "";
}

function appendNumber(number) {
  if (shouldResetCurrent) {
    currentValue = "";
    shouldResetCurrent = false;
  }

  if (number === "." && currentValue.includes(".")) {
    return;
  }

  if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function chooseOperation(nextOperation) {
  if (operation && !shouldResetCurrent) {
    calculate();
  }

  previousValue = currentValue;
  operation = nextOperation;
  shouldResetCurrent = true;
  updateDisplay();
}

function calculate() {
  if (!operation || previousValue === "") {
    return;
  }

  const firstNumber = Number(previousValue);
  const secondNumber = Number(currentValue);
  let result;

  switch (operation) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "×":
      result = firstNumber * secondNumber;
      break;
    case "÷":
      if (secondNumber === 0) {
        currentValue = "Cannot divide by 0";
        previousValue = "";
        operation = null;
        shouldResetCurrent = true;
        updateDisplay();
        return;
      }
      result = firstNumber / secondNumber;
      break;
    case "%":
      result = firstNumber % secondNumber;
      break;
    default:
      return;
  }

  currentValue = Number.isInteger(result)
    ? String(result)
    : String(Number(result.toFixed(10)));
  previousValue = "";
  operation = null;
  shouldResetCurrent = true;
  updateDisplay();
}

function clearCalculator() {
  currentValue = "0";
  previousValue = "";
  operation = null;
  shouldResetCurrent = false;
  updateDisplay();
}

function deleteLastDigit() {
  if (shouldResetCurrent || currentValue === "Cannot divide by 0") {
    clearCalculator();
    return;
  }

  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  updateDisplay();
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => chooseOperation(button.dataset.operation));
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.action === "clear") {
      clearCalculator();
    } else if (button.dataset.action === "delete") {
      deleteLastDigit();
    } else if (button.dataset.action === "equals") {
      calculate();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key) || event.key === ".") {
    appendNumber(event.key);
  } else if (["+", "-", "*", "/", "%"].includes(event.key)) {
    const symbols = { "*": "×", "/": "÷" };
    chooseOperation(symbols[event.key] || event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    calculate();
  } else if (event.key === "Backspace") {
    deleteLastDigit();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();
