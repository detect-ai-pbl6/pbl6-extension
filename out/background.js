chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "LOGIN_PAGE_LOADED") {
        console.log("Login page has loaded in tab:", sender.tab ? sender.tab.id : "Unknown");
        sendResponse({ status: "Login.js loaded successfully" });
    }
    
    if (message.type === "UPDATE_TOKENS") {
        const { access, refresh, expiration, api_key } = message.data;

        // Lưu các giá trị vào chrome.storage.local
        chrome.storage.local.set(
            {
                accessToken: access,
                refreshToken: refresh,
                expirationTime: expiration,
                apiKey: api_key
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error("Error saving to storage:", chrome.runtime.lastError.message);
                    sendResponse({ message: "Error saving token." });
                } else {
                    chrome.storage.local.get(null, (items) => {
                        console.log("All storage items:", items);
                    });
                    
                    chrome.action.openPopup();
                    console.log("Tokens saved successfully.");
                    sendResponse({ message: "Tokens updated and saved!" });
                }
            }
        );
    } 
    
    if (message.type === "LOGOUT") {
        // Xóa dữ liệu trong chrome.storage.local
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error("Error clearing storage:", chrome.runtime.lastError.message);
                sendResponse({ message: "Error during logout." });
            } else {
                console.log("Storage cleared successfully.");

                // Gửi thông báo đến content script để xóa Web localStorage
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        chrome.tabs.sendMessage(tab.id, { type: "CLEAR_WEB_LOCALSTORAGE" });
                    });
                });

                sendResponse({ message: "Logged out successfully and data cleared." });
            }
        });
    }

    if (message.type === "LOGOUT_EXT") {
        // Xóa dữ liệu trong chrome.storage.local
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error("Error clearing storage:", chrome.runtime.lastError.message);
                sendResponse({ message: "Error during logout." });
            } else {
                console.log("Storage cleared successfully.");

                // Gửi thông báo đến content script để xóa Web localStorage
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        chrome.tabs.sendMessage(tab.id, { type: "CLEAR_WEB_LOGOUT_EXT" });
                    });
                });

                sendResponse({ message: "Logged out successfully and data cleared." });
            }
        });
    }

    if (message.type === "STORAGE_UPDATED") {
        console.log("STORAGE_UPDATED successfully.");

        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs.sendMessage(tab.id, {
                    type: "STORAGE_UPDATED_WEB",
                    payload: message.payload,
                });
            });
        });

        sendResponse({ message: "STORAGE_UPDATED." });
    }

    return true; // Để giữ connection mở cho sendResponse
});

