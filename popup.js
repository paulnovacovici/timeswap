const salaryInput = document.getElementById("salaryInput");
const saveButton = document.getElementById("saveButton");
const statusDiv = document.getElementById("status");

// Load saved salary when popup opens
function loadSalary() {
  // Use chrome.storage.local (persists on user's machine)
  // chrome.storage.sync could be used to sync across logged-in devices,
  // but has stricter quotas. Local is usually fine.
  chrome.storage.local.get(["hourlySalary"], function (result) {
    if (chrome.runtime.lastError) {
      console.error("Error loading salary:", chrome.runtime.lastError);
      statusDiv.textContent = "Error loading salary.";
      statusDiv.style.color = "red";
    } else if (result.hourlySalary !== undefined) {
      salaryInput.value = result.hourlySalary;
      console.log("Salary loaded:", result.hourlySalary);
    } else {
      console.log("No salary previously saved.");
    }
  });
}

// Save salary when button is clicked
function saveSalary() {
  const salaryValue = salaryInput.value;
  // Basic validation - ensure it's a non-empty positive number
  const salaryNumber = parseFloat(salaryValue);

  if (salaryValue === "" || isNaN(salaryNumber) || salaryNumber < 0) {
    statusDiv.textContent = "Please enter a valid positive number.";
    statusDiv.style.color = "red";
    setTimeout(() => {
      statusDiv.textContent = "";
      statusDiv.style.color = "green";
    }, 3000); // Clear after 3s
    return;
  }

  chrome.storage.local.set({ hourlySalary: salaryNumber }, function () {
    if (chrome.runtime.lastError) {
      console.error("Error saving salary:", chrome.runtime.lastError);
      statusDiv.textContent = "Error saving salary.";
      statusDiv.style.color = "red";
    } else {
      console.log("Salary saved:", salaryNumber);
      statusDiv.textContent = "Salary saved successfully!";
      statusDiv.style.color = "green";
      // Optional: Close popup after saving
      // setTimeout(() => window.close(), 1000);
    }
    // Clear status message after a few seconds
    setTimeout(() => {
      statusDiv.textContent = "";
    }, 3000);
  });
}

// Add event listener to the button
saveButton.addEventListener("click", saveSalary);

// Add event listener to input field to allow saving with Enter key
salaryInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default form submission if it were in a form
    saveSalary();
  }
});

// Load the currently saved salary when the popup is opened
document.addEventListener("DOMContentLoaded", loadSalary);
