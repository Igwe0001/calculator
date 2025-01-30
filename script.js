const input = document.querySelectorAll("input");
const pale = document.querySelectorAll(".pale");

const keys = document.querySelector(".keys-container");

const previous = document.querySelector("[data-previous-operand]");
const current = document.querySelector("[data-current-operand]");
const sign = document.querySelector("[data-sign]");

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

// Theme change
input.forEach((e) =>
  e.addEventListener("click", () => {
    let newTheme;

    if (e.checked) {
      if (e.value !== "light" && e.value !== "navy") {
        pale.forEach((e) => {
          e.classList.add("pale-number");
        });
      } else {
        pale.forEach((e) => {
          e.classList.remove("pale-number");
        });
      }
      if (e.value === "light") {
        newTheme = "light";
      } else if (e.value === "navy") {
        newTheme = "navy";
      }
      document.documentElement.setAttribute("data-theme", newTheme);
    }
    localStorage.setItem("theme", newTheme);
  })
);

// Add comma logic
function addCommas(num) {
  // Split the number into integer and decimal parts
  let [integerPart, decimalPart] = num.split(".");

  // Add commas to the integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there's a decimal part, append it back
  if (num.includes(".")) {
    return integerPart + "." + decimalPart;
  }
  return integerPart;
}

// Delete number
function deleted(str) {
  return str.slice(0, -1);
}

// Calculate
function calculate(n1, operator, n2) {
  let result = "";

  if (operator === "" || n2.length === "") return;

  if (operator === "add") {
    result = parseFloat(n1) + parseFloat(n2);
  } else if (operator === "subtract") {
    result = parseFloat(n1) - parseFloat(n2);
  } else if (operator === "multiply") {
    result = parseFloat(n1) * parseFloat(n2);
  } else if (operator === "divide") {
    result = parseFloat(n1) / parseFloat(n2);
  }

  return result;
}

// Event delegation
keys.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    let displayedNum = previous.textContent;
    let currentNum = current.textContent;

    // Remove commas for calculation
    displayedNum = displayedNum.replace(/,/g, "");
    currentNum = currentNum.replace(/,/g, "");

    if (!action) {
      if (displayedNum === "0") {
        previous.textContent = keyContent;
      } else if (displayedNum.length <= 6) {
        previous.textContent = displayedNum + keyContent;
      }
    }

    if (!action) {
      if (previous.textContent !== "0" && sign.textContent !== "") {
        previous.textContent = displayedNum;
        if (currentNum.length <= 6) {
          current.textContent = currentNum + keyContent;
        }
      }
    }

    if (action === "decimal") {
      if (!displayedNum.includes(".")) {
        if (previous.textContent === "0") {
          previous.textContent = displayedNum + ".";
        } else if (previous.textContent !== "") {
          previous.textContent = displayedNum + ".";
        }
      }

      if (sign.textContent !== "") {
        if (displayedNum.includes(".") === false) {
          previous.textContent = displayedNum;
        }
        if (!currentNum.includes(".")) {
          if (current.textContent !== "") {
            current.textContent = currentNum + ".";
          } else {
            current.textContent = currentNum + "0.";
          }
        }
      }
    }

    let firstValue = displayedNum;
    let operator = sign.dataset.operator;
    let secondValue = currentNum;

    if (
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
    ) {
      sign.textContent = key.textContent;
      sign.dataset.operator = action;
      if (previous.textContent === "0") {
        sign.textContent = "";
      }

      if (
        previous.textContent !== "" &&
        sign.textContent !== "" &&
        current.textContent !== ""
      ) {
        previous.textContent = calculate(firstValue, operator, secondValue);
        current.textContent = "";
      }
    }

    if (action === "calculate") {
      if (sign.textContent === "" || current.textContent === "") {
        previous.textContent = displayedNum;
      } else {
        previous.textContent = calculate(firstValue, operator, secondValue);
        sign.textContent = "";
        current.textContent = "";
      }
    }

    if (action === "reset") {
      previous.textContent = "0";
      current.textContent = "";
      sign.textContent = "";
    }

    if (action === "delete") {
      if (current.textContent !== "") {
        current.textContent = deleted(secondValue);
      } else if (sign.textContent !== "" && current.textContent === "") {
        sign.textContent = "";
      } else if (sign.textContent === "" && current.textContent === "") {
        previous.textContent = deleted(displayedNum);
        if (previous.textContent === "") {
          previous.textContent = "0";
        }
      }
    }

    previous.textContent = addCommas(previous.textContent);
    current.textContent = addCommas(current.textContent);
  }
});
