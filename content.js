// Content script for TimeSwap extension
console.log("TimeSwap content script loaded");

/**
 * Convert a string like "$79.99" or "$7999" into "X.X hours".
 * Handles cases where the decimal might be missing for cents.
 * Returns null if parsing fails.
 */
function dollarsToHours(amountStr) {
  let numericStr = amountStr.replace(/[^\d.]+/g, "");
  if (numericStr.indexOf(".") === -1 && numericStr.length > 2) {
    numericStr = numericStr.slice(0, -2) + "." + numericStr.slice(-2);
  } else if (numericStr.startsWith(".")) {
    numericStr = "0" + numericStr;
  }
  const value = parseFloat(numericStr);
  if (isNaN(value) || value < 0) return null;
  const hours = value / HOURLY_WAGE;
  return `${hours.toFixed(1)} hours`;
}

/**
 * Main function: Finds currency symbols, gathers price, converts, replaces.
 */
function convertMoneyToHours() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        const parent = node.parentElement;
        if (
          parent &&
          parent.closest(".hours-converted, .hours-container-processed")
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent && parent.tagName === "SCRIPT") {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.isConnected) {
          return NodeFilter.FILTER_REJECT;
        }
        if (/[£$€]/.test(node.nodeValue)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    }
  );

  const nodesToProcess = [];
  let n;
  while ((n = walker.nextNode())) {
    nodesToProcess.push(n);
  }

  console.log(nodesToProcess);

  const moneyRegex = /([£$€]\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/;

  for (const startNode of nodesToProcess) {
    const text = startNode.nodeValue;
    console.log(text, text.length);
    if (moneyRegex.test(text)) {
      // ✅ We found a full amount in this single node
      const originalPriceString = text.match(moneyRegex)[1];
      const hours = dollarsToHours(originalPriceString);
      if (hours) {
        const span = document.createElement("span");
        span.className = "hours-converted";
        span.setAttribute("data-original-price", originalPriceString);
        startNode.nodeValue = startNode.nodeValue.replace(
          originalPriceString,
          hours
        );
      }
      continue;
    } else if (text.length === 1) {
      const parent = startNode.parentElement?.parentElement;
      if (!parent) return;

      // ✅ Assign the TreeWalker to a variable
      const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      // ✅ Now this loop will work
      let n;
      const price = [];
      while ((n = walker.nextNode())) {
        if (/[$€£]/.test(n.textContent)) {
          price.push(n.textContent);
        } else if (/\d+/.test(n.textContent) && price.length === 1) {
          price.push(n.textContent);
        } else if (/\d+/.test(n.textContent) && price.length === 2) {
          price.push("." + n.textContent);
          break;
        }
      }
      const originalPriceString = price.join("");
      const hours = dollarsToHours(originalPriceString);
      const span = document.createElement("span");
      span.className = "hours-converted";
      span.textContent = hours;
      span.setAttribute("data-original-price", originalPriceString);
      parent.replaceChildren(span);
    }
  }
}
