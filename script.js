const resultDisplay = document.getElementById("resultDisplay");
const expressionDisplay = document.getElementById("expressionDisplay");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");
const themeToggle = document.getElementById("themeToggle");
const displayContainer = document.querySelector(".display");

let expression = "";
let justCalculated = false;

/* FORMAT DISPLAY */
function formatDisplay(exp) {
  return exp.replace(/\*/g, "x").replace(/\//g, "÷");
}

/* UPDATE DISPLAY */
function updateDisplay() {
  if (expression || resultDisplay.textContent !== "0") {
    displayContainer.classList.add("active");
  } else {
    displayContainer.classList.remove("active");
  }
}

/* SET HISTORY HEIGHT */
function setHistoryHeight() {
  const calculator = document.querySelector(".calculator");
  const history = document.querySelector(".history");
  history.style.height = calculator.offsetHeight + "px";
}
window.addEventListener("load", setHistoryHeight);
window.addEventListener("resize", setHistoryHeight);

/* THEME TOGGLE */
themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const theme = html.getAttribute("data-theme");
  if (theme === "light") {
    html.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    html.setAttribute("data-theme", "light");
    themeToggle.textContent = "🌙";
  }
});

/* BUTTON CLICK */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (justCalculated && (!isNaN(value) || value === ".")) {
      expression = "";
      expressionDisplay.textContent = "";
      resultDisplay.textContent = "0";
      justCalculated = false;
    }

    if (value === "C") {
      expression = "";
      expressionDisplay.textContent = "";
      resultDisplay.textContent = "0";
      justCalculated = false;
      updateDisplay();
      return;
    }

    if (value === "DEL") {
      expression = expression.slice(0, -1);
      expressionDisplay.textContent = formatDisplay(expression);
      if (expression === "") resultDisplay.textContent = "0";
      updateDisplay();
      return;
    }

   if (value === "%") {
    const match = expression.match(/(\d+\.?\d*)$/);
    if (match) {
      const num = parseFloat(match[0]);
      const percent = num / 100;
      expression = expression.slice(0, match.index) + percent;
      displayExpression = displayExpression.slice(0, match.index) + match[0] + "%";
    }
    expressionDisplay.textContent = displayExpression;
    updateDisplay();
    return;
  }

    if (value === "RESULT") {
      calculate();
      justCalculated = true;
      return;
    }

    if (justCalculated && (value === "+" || value === "-" || value === "x" || value === "÷")) {
      justCalculated = false;
    }

    if (value === "x") expression += "*";
    else if (value === "÷") expression += "/";
    else expression += value;

    expressionDisplay.textContent = formatDisplay(expression);
    updateDisplay();
  });
});

/* KEYBOARD SUPPORT */
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (justCalculated && (!isNaN(key) || key === ".")) {
    expression = "";
    expressionDisplay.textContent = "";
    resultDisplay.textContent = "0";
    justCalculated = false;
  }

  if (!isNaN(key) || key === ".") expression += key;
  else if (key === "+" || key === "-") {
    expression += key;
    justCalculated = false;
  } else if (key === "*" || key === "x") {
    expression += "*";
    justCalculated = false;
  } else if (key === "/") {
    expression += "/";
    justCalculated = false;
  } else if (key === "%") {
    const match = expression.match(/(\d+\.?\d*)$/);
    if (match) {
      const num = parseFloat(match[0]);
      const percent = num / 100;
      expression = expression.slice(0, match.index) + percent;
    }
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
    justCalculated = true;
    return;
  } else if (key === "Backspace") {
    expression = expression.slice(0, -1);
    justCalculated = false;
  } else if (key === "Escape") {
    expression = "";
    expressionDisplay.textContent = "";
    resultDisplay.textContent = "0";
    justCalculated = false;
    updateDisplay();
    return;
  } else return;

  expressionDisplay.textContent = formatDisplay(expression);
  updateDisplay();
});

/* CALCULATE */
function calculate() {
  try {
    const result = eval(expression);
    addHistory(expression, result);
    resultDisplay.textContent = result;
    expression = result.toString();
    updateDisplay();
  } catch {
    resultDisplay.textContent = "Error";
    expression = "";
    updateDisplay();
  }
}

/* HISTORY */
function addHistory(exp, res) {
  const item = document.createElement("div");
  item.className = "history-item";

  item.innerHTML = `
    <span class="history-exp">${formatDisplay(exp)} = ${res}</span>
    <span class="delete">🗑️</span>
  `;

  // Klik history → reuse
  item.querySelector(".history-exp").addEventListener("click", () => {
    expression = exp;
    expressionDisplay.textContent = formatDisplay(expression);
    resultDisplay.textContent = res;
    justCalculated = true;
    updateDisplay();
  });

  item.querySelector(".delete").addEventListener("click", () => {
    item.remove();
  });

  historyList.prepend(item);
}

clearHistory.addEventListener("click", () => {
  historyList.innerHTML = "";
});
