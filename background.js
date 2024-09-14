chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 检查消息内容
    console.log(message);
    switch (message.action) {
        case "getJquery":
            var staticFile = chrome.runtime.getURL(
                "static/jquery-3.6.0.min.js"
            );

            // 使用fetch API加载文件
            fetch(staticFile)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.text(); // 假设文件是文本格式
                })
                .then((text) => {
                    broadcastMessage({
                        action: "appendScript",
                        data: "console.log('load：jQuery.js');" + text,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching file:", error);
                });
            break;

        default:
            break;
    }
});

function broadcastMessage(message) {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, message);
        });
    });
}
