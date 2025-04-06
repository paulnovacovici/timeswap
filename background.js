// Background script for TimeSwap extension
console.log("TimeSwap background script loaded");

// Example of handling installation event
chrome.runtime.onInstalled.addListener(() => {
  console.log("TimeSwap extension installed");
});

chrome.runtime.onUpdateAvailable.addListener(function (details) {
  console.log("reloading update");
  chrome.runtime.reload();
});
