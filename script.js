const messagesList = document.getElementById('messagesList');
let filteredMessages = [];
let currentPage = 1;
const messagesPerPage = 10;

// 載入留言並顯示
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const currentTime = new Date().getTime();
    const validMessages = messages.filter((messageObj) => currentTime - messageObj.timestamp < 86400000);
    validMessages.sort((a, b) => b.timestamp - a.timestamp);
    localStorage.setItem('messages', JSON.stringify(validMessages));
    filteredMessages = validMessages;
    renderMessages();
}

// 開啟留言彈窗
function openMessageModal() {
    const myModal = new bootstrap.Modal(document.getElementById('messageModal'));
    myModal.show();
}

function resetForm() {
    document.getElementById('messageForm').reset();
}

// 渲染當前頁的留言
function renderMessages() {
    messagesList.innerHTML = '';
    const start = (currentPage - 1) * messagesPerPage;
    const end = start + messagesPerPage;
    const messagesToShow = filteredMessages.slice(start, end);

    messagesToShow.forEach(({ location, message, suitable, timestamp }) => {
        displayMessage(location, message, suitable, timestamp);
    });

    document.getElementById('prevButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = end >= filteredMessages.length;
}

// 顯示單條留言
function displayMessage(location, message, suitable, timestamp) {
    const messageItem = document.createElement('li');
    messageItem.classList.add('list-group-item');

    const date = new Date(timestamp);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    messageItem.innerHTML = `
        <em>${location}</em><br>
        ${message} <br>
        <span>是否適合打球: <strong>${suitable}</strong></span><br>
        <small>${formattedDate} ${formattedTime}</small>
    `;
    messagesList.appendChild(messageItem);
}

// 搜尋並過濾留言
function filterMessages() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const messages = JSON.parse(localStorage.getItem('messages')) || [];

    filteredMessages = messages
        .filter(({ location, message, suitable }) => 
            location.toLowerCase().includes(searchTerm) ||
            message.toLowerCase().includes(searchTerm) ||
            suitable.toLowerCase().includes(searchTerm)
        )
        .sort((a, b) => b.timestamp - a.timestamp);

    currentPage = 1;
    renderMessages();
}

// 提交留言
document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const location = document.getElementById('location').value.trim();
    const message = document.getElementById('message').value.trim();
    const suitable = document.getElementById('suitable').value;
    const timestamp = new Date().getTime();

    if (location && message && suitable) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({ location, message, suitable, timestamp });
        localStorage.setItem('messages', JSON.stringify(messages));

        loadMessages();
        document.getElementById('messageForm').reset();

        const myModalEl = document.getElementById('messageModal');
        const modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
    }
});

// 下一頁
function nextPage() {
    if (currentPage * messagesPerPage < filteredMessages.length) {
        currentPage++;
        renderMessages();
    }
}

// 上一頁
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderMessages();
    }
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
    } else if (selectedValue === "桃園") {
        document.getElementById("taoyuan").style.display = 'block';
    } else if (selectedValue === "新竹") {
        document.getElementById("hsinchu").style.display = 'block';
    } else if (selectedValue === "台中") {
        document.getElementById("taichung").style.display = 'block';
    }
}
