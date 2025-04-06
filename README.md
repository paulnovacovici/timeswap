# TimeSwap Chrome Extension
TimeSwap is a Chrome extension designed to help you rethink spending by translating prices into the equivalent number of working hours based on your hourly rate or annual salary. This extension provides a simple way to visualize the true cost of items in terms of your personal earning power.

Features
Flexible Input: Set your hourly rate or annual salary directly through an intuitive popup interface.

Real-Time Conversion: Instantly converts prices displayed on webpages into equivalent working hours.

Persistent Storage: Your salary or hourly rate preferences are stored securely within your browser.

Dynamic Content Support: Automatically converts newly loaded or dynamically updated webpage content.

Installation
Clone or download this repository to your local machine.

Open Google Chrome and navigate to chrome://extensions/.

Enable Developer mode using the toggle in the top-right corner.

Click on "Load unpacked", then select the directory containing the manifest.json file of TimeSwap.

Usage
Click the TimeSwap icon in the Chrome toolbar to open the popup.

Choose either an Hourly Rate or an Annual Salary, input your earnings, and click "Save".

Click "Convert to Hours" to see prices across the active page instantly converted into your working hours.

Enjoy clearer spending decisions by quickly seeing how purchases impact your personal time.

Project Structure
graphql
Copy
Edit
timeswap/
├── background.js           # Background service worker script
├── content.js              # Script injected into webpages for converting prices
├── popup.html              # Popup interface HTML file
├── popup.js                # Logic for popup interactions and storage management
├── manifest.json           # Chrome extension manifest
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
Development
Permissions
storage: Used to securely save user preferences.

activeTab: Needed for sending messages from the popup to the currently active webpage.

Contributing
Feel free to open issues or submit pull requests to enhance TimeSwap’s functionality. Contributions are welcome!

License
This project is open source under the MIT License.
