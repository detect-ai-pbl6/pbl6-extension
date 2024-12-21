let storageEvents = [];  // Mảng lưu trữ tất cả các sự kiện

window.addEventListener("storage", (event) => {
    console.log("event: ", event.storageArea);

    // Lưu thông tin sự kiện vào mảng
    storageEvents.push(event);
    
    // Kiểm tra sau khi tất cả các sự kiện đã được xử lý
    processStorageEvents();
});

function processStorageEvents() {
    let hasAccess = false;

    // Kiểm tra tất cả các sự kiện trong storageEvents
    for (const event of storageEvents) {
        const access = event.storageArea.getItem("access");

        if (access !== null && access !== "undefined") {
            hasAccess = true;
            break;  // Nếu tìm thấy access, không cần tiếp tục kiểm tra các sự kiện khác
        }
    }

    // Thực hiện hành động dựa trên kết quả kiểm tra
    if (hasAccess) {
        // Gửi thông điệp UPDATE_TOKENS
        storageEvents.forEach(event => {
            const access = event.storageArea.getItem("access");
            const refresh = event.storageArea.getItem("refresh");
            const expiration = event.storageArea.getItem("expiration");
            const api_key = event.storageArea.getItem("api_key");

            chrome.runtime.sendMessage(
                {
                    type: "UPDATE_TOKENS",
                    data: { access, refresh, expiration, api_key }
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError.message);
                    } else {
                        console.log("Response from background:", response.message);
                    }
                }
            );
        });
    } else {
        // Nếu không có access, thực hiện LOGOUT
        chrome.runtime.sendMessage({ type: "LOGOUT" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error during logout:", chrome.runtime.lastError.message);
            } else {
                console.log("Logout processed:", response.message);
            }
        });
    }

    // Sau khi xử lý, bạn có thể làm sạch mảng storageEvents nếu cần
    storageEvents = []; // Nếu muốn reset mảng sau khi đã xử lý tất cả các sự kiện
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CLEAR_WEB_LOGOUT_EXT") {
        // Xóa toàn bộ dữ liệu trong Web localStorage
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("expiration");
        localStorage.removeItem("api_key");

        console.log("Web localStorage cleared on logout.");

        location.reload();
        sendResponse({ message: "Web localStorage cleared." });
    }

    // Lắng nghe thông điệp từ Background Script
    if (message.type === "STORAGE_UPDATED_WEB") {
        const { accessToken, refreshToken, expirationTime, apiKey } = message.payload;

        // Lưu dữ liệu vào localStorage của web
        localStorage.setItem("access", accessToken);
        localStorage.setItem("refresh", refreshToken);
        localStorage.setItem("expiration", expirationTime);
        localStorage.setItem("api_key", apiKey);

        console.log("STORAGE_UPDATED_WEB:", message.payload);

        // Reload lại trang
        // location.reload();
        const targetUrl = "https://pbl6-frontend-hoai-baos-projects.vercel.app/detect";
        window.location.href = targetUrl;


        sendResponse({ message: "Web localStorage updated and page reloaded STORAGE_UPDATED_WEB." });
    }

    return true;    
});


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "CLEAR_WEB_LOCALSTORAGE") {
//         // Xóa toàn bộ dữ liệu trong Web localStorage
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         localStorage.removeItem("expiration");
//         localStorage.removeItem("api_key");

//         console.log("Web localStorage cleared on logout.");

//         location.reload();
//         sendResponse({ message: "Web localStorage cleared." });
//     }
//     return true;    
// });