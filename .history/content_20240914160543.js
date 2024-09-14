// 发送消息到background.js
console.log("content.js");
sendMessage({ action: "getJquery" });

// 监听来自background.js的特定消息（可选）
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 检查消息内容以确定是否处理

    switch (message.action) {
        case "appendScript":
            break;

        default:
            break;
    }
});

function sendMessage(data) {
    chrome.runtime.sendMessage(data);
}

window.onload = () => {
    console.log("document onload");
    executeAfterTime("2024-09-14T16:05:30");
};

function executeAfterTime(targetDateStr) {
    // 将目标时间字符串转换为Date对象
    const targetDate = new Date(targetDateStr);

    // 获取当前时间
    const now = new Date();

    // 计算时间差（毫秒）
    const timeDiff = targetDate - now;

    // 如果目标时间已经过去，则立即执行
    if (timeDiff <= 0) {
        console.log("时间到了");
    } else {
        // 否则，使用setTimeout在指定时间后执行
        setTimeout(() => {
            executeAfterTime(targetDateStr);
        }, 200);
    }
}

function execute() {
    var listNum = 0;
    var currentPath = location.pathname;
    console.log(currentPath);

    switch (currentPath) {
        case "/otn/leftTicket/init":
            // 查询车次
            var tListEl = document.getElementById("queryLeftTable");

            // 设置基础信息
            // document.getElementById("fromStationText").value = "天津";
            // document.getElementById("toStationText").value = "洛阳";
            // document.getElementById("train_date").value = "2024-09-06";

            console.log(1);

            // 点击查询
            var queryBtn = document.getElementById("query_ticket");
            queryBtn.click();
            setTimeout(() => {
                scheduleBtn();
            }, 1000);

            // if (queryBtn) {
            //     console.log(2);
            //     // queryBtn.click();

            //     setTimeout(() => {
            //         scheduleBtn();
            //     }, 1000);
            // }

            return;

            // todo

            if (!hasChildNodes(tListEl)) {
                // 设置基础信息
                document.getElementById("fromStationText").value = "天津";
                document.getElementById("toStationText").value = "洛阳";
                document.getElementById("train_date").value = "2024-09-06";

                // 点击查询
                var queryBtn = document.getElementById("query_ticket");
                queryBtn.click();

                if (queryBtn) {
                    queryBtn.click();

                    setTimeout(() => {
                        scheduleBtn();
                    }, 1000);
                }
            } else {
                scheduleBtn();
            }
            break;
        case "/otn/confirmPassenger/initDc":
            // 提交订单
            submitOrder();
            break;
        case "/otn/payOrder/init":
            // 支付页面-倒计时10m
            return;
            var url =
                "https://evcard.sigreal.cn/manager/upms/api/user/loginSms";
            var data = { password: "yuejinming", username: "yuejinming" };
            sendPostRequest(url, data, function (error, response) {
                if (error) {
                    console.error("请求失败:", error);
                } else {
                    console.log("请求成功:", response);
                    // 处理响应数据
                }
            });
            break;

        default:
            break;
    }
}

function isListExist(params) {
    var tListEl = document.getElementById("queryLeftTable");
    console.log(tListEl);

    if (!tListEl) {
        if (listNum > 70) {
            isListExist = null;
        }
        setTimeout(() => {
            listNum++;
            isListExist();
        }, 1000);
    } else {
        scheduleBtn();
    }
}

function hasChildNodes(element) {
    return element.childNodes.length > 0;
}

function scheduleBtn() {
    var locationSearch = location.search;

    const spans = document.querySelectorAll("tbody .number");
    var trainNumber = "K269";

    if (locationSearch.indexOf("abc") == -1) {
        var url = location.href + "&abc=K4363";
        window.open(url);
    } else if (locationSearch.indexOf("abc") != -1) {
        // trainNumber = "K4363";
        localStorage.setItem("trainNumber", "K4363");
    }

    spans.forEach((span) => {
        // 车次 k269  K4363
        if (span.textContent == trainNumber) {
            const tr = span.closest("tr");
            const a = tr.querySelector("a.btn72");
            if (a) {
                setTimeout(() => {
                    a.click();
                }, 1000);
            }
        }
    });
}

function submitOrder() {
    var personnelStr = "娄红霞";
    if (localStorage.getItem("trainNumber")) {
        personnelStr = "岳金明";
    } else {
        personnelStr = "娄红霞";
    }

    // 选择人员
    var listItems = document.querySelectorAll("#normal_passenger_id li");
    listItems.forEach(function (listItem) {
        var label = listItem.querySelector("label");
        if (label && label.textContent === personnelStr) {
            var input = listItem.querySelector("input.check");
            input.click();
        }
    });

    // 选择席位
    var selectElement = document.getElementById("seatType_1");

    // 遍历select元素中的所有option
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text.includes("硬卧")) {
            selectElement.options[i].selected = true;
            break;
        }
    }

    // 提交进入选座弹窗
    var submitBtn = document.getElementById("submitOrder_id");
    submitBtn.click();

    setTimeout(() => {
        fastTrain();

        // 提交订单进入支付页面
        clickSubmitOrder(0);
    }, 500);
}

// 高铁座位
function highSpeedRail() {
    var submitBtn = document.getElementById("submitOrder_id");
    submitBtn.click();
    var el = document.getElementById("1D");
    el.click();
}

// 普快座位
function fastTrain() {
    var bedItems = document.querySelectorAll(".bed-item");
    bedItems.forEach(function (bedItem) {
        var txtElement = bedItem.querySelector(".txt");

        var personnelStr = "岳金明";
        var seatType = personnelStr == "岳金明" ? "上铺" : "下铺";
        if (txtElement && txtElement.textContent.trim() === seatType) {
            var numberControlDiv = bedItem.querySelector(
                ".number-control-mini"
            );

            var increaseButton =
                numberControlDiv.querySelector(".num-increase");

            // 触发点击事件
            increaseButton.click();
        }
    });
}

// 点击直到跳转订单页为止
function clickSubmitOrder(clickNum) {
    var pathName = location.pathname;
    if (clickNum > 200) {
        return;
    }

    //  && clickNum < 200
    if (pathName != "/otn/payOrder/init" && clickNum < 100) {
        clickNum++;
        var qrSubmitIdEl = document.getElementById("qr_submit_id");
        qrSubmitIdEl.click();
        setTimeout(() => {
            clickSubmitOrder(clickNum);
        }, 200);
    }
}

function sendPostRequest(url, data, callback) {
    // 创建一个XMLHttpRequest对象
    var xhr = new XMLHttpRequest();

    // 初始化一个请求
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("x-from-business-line", "ubi");
    // xhr.setRequestHeader("x-from-tenant", "9999");

    // 注册请求完成的事件处理程序
    xhr.onreadystatechange = function () {
        // 请求完成（readyState为4）且响应状态码为200
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 调用回调函数并传入响应的数据
            callback(null, xhr.responseText);
        } else if (xhr.readyState === 4) {
            // 处理请求失败的情况
            callback(xhr.statusText, null);
        }
    };

    // 发送请求
    xhr.send(JSON.stringify(data));
}
