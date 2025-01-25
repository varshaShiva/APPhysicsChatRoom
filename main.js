document.addEventListener('DOMContentLoaded', () => {
    const messages = [];
    let currentUser = null;
    let userColor = '#00ff00';

    const authContainer = document.getElementById('auth-container');
    const loginForm = document.getElementById('login-form');
    const logoutForm = document.getElementById('logout-form');
    const chatContainer = document.getElementById('chat-container');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const imageInput = document.getElementById('image-input');
    const sendImageButton = document.getElementById('send-image-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const colorPicker = document.getElementById('color-picker');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const saveColorButton = document.getElementById('save-color-button');

    const renderMessages = () => {
        messagesContainer.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.style.backgroundColor = message.color;
            if (message.imageUrl) {
                const imageElement = document.createElement('img');
                imageElement.src = message.imageUrl;
                messageElement.appendChild(imageElement);
            } else {
                messageElement.textContent = message.text;
            }
            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const sendMessage = (text) => {
        if (currentUser) {
            messages.push({ text, color: userColor });
            renderMessages();
        } else {
            alert('Please log in to send messages.');
        }
    };

    const sendImage = (file) => {
        if (currentUser) {
            const reader = new FileReader();
            reader.onload = (e) => {
                messages.push({ imageUrl: e.target.result, color: userColor });
                renderMessages();
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please log in to send images.');
        }
    };

    loginButton.addEventListener('click', () => {
        currentUser = usernameInput.value;
        if (currentUser) {
            authContainer.classList.add('d-none');
            chatContainer.classList.remove('d-none');
            logoutForm.classList.remove('d-none');
            loginForm.classList.add('d-none');
        } else {
            alert('Please enter a username.');
        }
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        authContainer.classList.remove('d-none');
        chatContainer.classList.add('d-none');
        logoutForm.classList.add('d-none');
        loginForm.classList.remove('d-none');
    });

    saveColorButton.addEventListener('click', () => {
        userColor = colorPicker.value;
        alert('Color saved successfully!');
    });

    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    sendImageButton.addEventListener('click', () => {
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            sendImage(file);
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});