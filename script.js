const messagesList = document.getElementById('messagesList');
// 獲取顯示留言列表的 DOM 元素

let filteredMessages = [];
// 存放經過篩選的留言數據，用於顯示在當前頁面

let currentPage = 1;
// 當前顯示的頁碼

const messagesPerPage = 10;
// 每頁顯示的留言數量

// 載入留言並顯示
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    // 從 localStorage 獲取留言數據，如果沒有數據則初始化為空陣列

    const currentTime = new Date().getTime();
    // 獲取當前的時間戳，用於計算留言是否過期

    const validMessages = messages.filter((messageObj) => {
        return currentTime - messageObj.timestamp < 86400000;
    });
    // 過濾出 24 小時內的有效留言，86400000 毫秒等於一天

    validMessages.sort((a, b) => b.timestamp - a.timestamp);
    // 將有效留言按時間戳從最新到最舊排序

    localStorage.setItem('messages', JSON.stringify(validMessages));
    // 更新 localStorage 中的留言數據，只保存有效留言

    filteredMessages = validMessages;
    // 設定經過篩選並排序的留言為 filteredMessages，供顯示使用

    renderMessages();
    // 調用 renderMessages 函數，渲染當前頁面的留言
}

// 渲染當前頁的留言
function renderMessages() {
    messagesList.innerHTML = ''; // 清空留言顯示區域

    const start = (currentPage - 1) * messagesPerPage;
    const end = start + messagesPerPage;
    const messagesToShow = filteredMessages.slice(start, end);
    // 計算當前頁面顯示的留言範圍，並截取該頁的留言數據

    messagesToShow.forEach(({ location, message, suitable, timestamp }) => {
        displayMessage(location, message, suitable, timestamp);
    });
    // 逐一渲染每條留言

    document.getElementById('prevButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = end >= filteredMessages.length;
    // 更新分頁按鈕的禁用狀態，根據當前頁碼決定是否禁用上一頁或下一頁按鈕
}

// 顯示單條留言
function displayMessage(location, message, suitable, timestamp) {
    const messageItem = document.createElement('li');
    messageItem.classList.add('list-group-item');
    // 創建列表項元素來顯示單條留言，並添加 Bootstrap 樣式

    const date = new Date(timestamp);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    // 將時間戳格式化為可讀日期和時間

    messageItem.innerHTML = `
        <em>${location}</em><br>
        ${message} <br>
        <span>是否適合打球: <strong>${suitable}</strong></span><br>
        <small>${formattedDate} ${formattedTime}</small>
    `;
    // 設置列表項的 HTML 內容，包括地點、留言內容、適合狀況以及時間

    messagesList.appendChild(messageItem);
    // 將列表項添加到留言顯示區域
}

// 搜尋並過濾留言
function filterMessages() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    // 獲取搜尋關鍵字並轉為小寫

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    // 從 localStorage 獲取留言數據

    filteredMessages = messages
        .filter(({ location, message, suitable }) => {
            return (
                location.toLowerCase().includes(searchTerm) ||
                message.toLowerCase().includes(searchTerm) ||
                suitable.toLowerCase().includes(searchTerm) // 將「是否適合打球」欄位納入搜尋範圍
            );
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    // 篩選留言，符合搜尋關鍵字的項目會被保留，並按時間戳排序最新的在前

    currentPage = 1;
    // 搜尋完成後重置到第一頁

    renderMessages();
    // 渲染搜尋結果
}

// 提交留言
document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // 阻止表單的默認提交行為

    const location = document.getElementById('location').value.trim();
    const message = document.getElementById('message').value.trim();
    const suitable = document.getElementById('suitable').value;
    const timestamp = new Date().getTime();
    // 獲取地點、留言、適合狀況和當前時間戳

    if (location && message && suitable) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({ location, message, suitable, timestamp });
        localStorage.setItem('messages', JSON.stringify(messages));
        // 新留言加入到 localStorage 的 messages，並儲存更新

        loadMessages();
        // 重新載入留言，確保最新的留言顯示在頁面

        document.getElementById('messageForm').reset();
        // 清空表單內容

        alert('留言成功！');
        // 顯示成功提示
    }
});

// 下一頁
function nextPage() {
    if (currentPage * messagesPerPage < filteredMessages.length) {
        currentPage++;
        renderMessages();
    }
    // 當前頁面不是最後一頁時，頁碼增加，並渲染下一頁的留言
}

// 上一頁
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderMessages();
    }
    // 當前頁面不是第一頁時，頁碼減少，並渲染上一頁的留言
}

// 初始化時載入留言
loadMessages();

function openModal() {
    document.getElementById('imageModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// 按 ESC 鍵關閉 Modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});



// 根據選擇顯示對應地區的排球館內容
function displayContent() {
    // 隱藏所有地區內容區塊
    document.querySelectorAll('.content-area').forEach(function(area) {
        area.style.display = 'none';
    });

    // 獲取選中的地區
    const selectedValue = document.getElementById("suitable").value;

    // 顯示選中地區的內容
    if (selectedValue === "新北/台北") {
        document.getElementById("newTaipei").style.display = 'block';
    }
    // 可以繼續添加其他地區的顯示條件
}
