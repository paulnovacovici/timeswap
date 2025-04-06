const hourlyRateInput = document.getElementById("hourlyRateInput");
const salaryInput = document.getElementById("salaryInput");
const payTypeRadios = document.getElementsByName("payType");
const computedHourly = document.getElementById("computedHourly");
const saveButton = document.getElementById("saveButton");
const statusDiv = document.getElementById("status");
const hourlyRateContainer = document.getElementById("hourlyRateContainer");
const salaryContainer = document.getElementById("salaryContainer");

// Show or hide relevant fields based on selected pay type
function showRelevantFields(payType) {
  if (payType === "hourly") {
    hourlyRateContainer.style.display = "block";
    salaryContainer.style.display = "none";
    salaryInput.value = "";
  } else {
    hourlyRateContainer.style.display = "none";
    salaryContainer.style.display = "block";
    hourlyRateInput.value = "";
  }
}

// Load the stored hourly rate when the popup opens
function loadStoredData() {
  chrome.storage.local.get(["hourlySalary"], function (result) {
    if (chrome.runtime.lastError) {
      console.error("Error loading rate:", chrome.runtime.lastError);
      statusDiv.textContent = "Error loading rate.";
      statusDiv.style.color = "red";
    } else if (result.hourlySalary !== undefined) {
      // If there is a saved hourly salary, default to the "hourly" pay type
      payTypeRadios.forEach(radio => {
        if (radio.value === "hourly") {
          radio.checked = true;
        }
      });
      showRelevantFields("hourly");
      hourlyRateInput.value = result.hourlySalary;
      computedHourly.textContent = `$${Number(result.hourlySalary).toFixed(2)}`;
    } else {
      // No salary previously saved.
      // Default to hourly
      payTypeRadios.forEach(radio => {
        if (radio.value === "hourly") {
          radio.checked = true;
        }
      });
      showRelevantFields("hourly");
    }
  });
}

// Compute the hourly rate based on selected pay type
function computeHourlyRate() {
  let selectedPayType = getSelectedPayType();
  let hr = 0;
  if (selectedPayType === "hourly") {
    hr = parseFloat(hourlyRateInput.value) || 0;
  } else {
    let annual = parseFloat(salaryInput.value) || 0;
    // Convert annual salary to hourly rate (assuming ~2080 working hours in a year)
    hr = annual / 2080;
  }
  return hr;
}

// Utility to get the selected pay type
function getSelectedPayType() {
  let selectedValue = "hourly"; // default
  payTypeRadios.forEach(radio => {
    if (radio.checked) {
      selectedValue = radio.value;
    }
  });
  return selectedValue;
}

// Update the displayed computed hourly rate
function updateComputedHourly() {
  let hr = computeHourlyRate();
  computedHourly.textContent = hr > 0 ? `$${hr.toFixed(2)}` : "$0.00";
}

// Save the final computed hourly rate to chrome storage
function saveRate() {
  let hr = computeHourlyRate();
  if (hr <= 0) {
    statusDiv.textContent = "Please enter a valid rate or salary.";
    statusDiv.style.color = "red";
    setTimeout(() => {
      statusDiv.textContent = "";
      statusDiv.style.color = "green";
    }, 3000);
    return;
  }
  chrome.storage.local.set({ hourlySalary: hr }, function () {
    if (chrome.runtime.lastError) {
      console.error("Error saving rate:", chrome.runtime.lastError);
      statusDiv.textContent = "Error saving rate.";
      statusDiv.style.color = "red";
    } else {
      console.log("Rate saved:", hr);
      statusDiv.textContent = "Rate saved successfully!";
      statusDiv.style.color = "green";
    }
    setTimeout(() => {
      statusDiv.textContent = "";
      statusDiv.style.color = "green";
    }, 3000);
  });
}

function convertToHours() {
  // TODO: Implement conversion logic
}

// Add event listeners
payTypeRadios.forEach(radio => {
  radio.addEventListener("change", (event) => {
    showRelevantFields(event.target.value);
    updateComputedHourly();
  });
});

hourlyRateInput.addEventListener("input", updateComputedHourly);
salaryInput.addEventListener("input", updateComputedHourly);
saveButton.addEventListener("click", saveRate);
const convertButton = document.getElementById("convertButton");
convertButton.addEventListener("click", convertToHours);

// On DOM load, initialize UI
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
});