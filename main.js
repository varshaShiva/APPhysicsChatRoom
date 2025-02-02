// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD6ytTzouafi7VtwEoMxWl19Y22k0z4ids",
    authDomain: "physics-266c5.firebaseapp.com",
    databaseURL: "https://physics-266c5-default-rtdb.firebaseio.com",
    projectId: "physics-266c5",
    storageBucket: "physics-266c5.firebasestorage.app",
    messagingSenderId: "372682267257",
    appId: "1:372682267257:web:f0cc07f35d20a0c6ef12a8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();
const db = firebase.database();
const messagesRef = db.ref('messages');
const usersRef = db.ref('users');

// Function to add message to the database
function sendMessage(message) {
    const user = auth.currentUser;
    if (user) {
        usersRef.child(user.uid).once('value').then((snapshot) => {
            const userData = snapshot.val();
            const color = userData.color || '#00ff00'; // Default to green if no color is set
            messagesRef.push().set({
                message: message,
                userId: user.uid,
                color: color,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }
}

// Function to save selected color
function saveColor() {
    const user = auth.currentUser;
    const color = document.getElementById('color-picker').value;
    if (user && color) {
        usersRef.child(user.uid).update({ color: color }).then(() => {
            alert('Color saved successfully!');
        }).catch((error) => {
            console.error('Error saving color:', error);
        });
    } else {
        alert('Please log in to save your color.');
    }
}

// Function to display messages from the database
messagesRef.on('child_added', function(snapshot) {
    const data = snapshot.val();
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Assign the user's chosen color
    if (data.color) {
        messageElement.style.backgroundColor = data.color;
    }

    messageElement.textContent = data.message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Function to handle user login
function login(email, password) {
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        const user = userCredential.user;
        usersRef.child(user.uid).once('value').then((snapshot) => {
            const userData = snapshot.val();
            // Set the color picker value to the user's color
            document.getElementById('color-picker').value = userData.color || '#00ff00';
            document.getElementById('auth-container').classList.add('d-none');
            document.getElementById('chat-container').classList.remove('d-none');
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }).catch((error) => {
        console.error('Login Error:', error.message);
        alert(`Login Error: ${error.message}`);
    });
}

// Function to handle user registration
function register(email, password, color) {
    if (password.length < 6) {
        alert('Password should be at least 6 characters');
        return;
    }
    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        const user = userCredential.user;
        usersRef.child(user.uid).set({ color: color }).then(() => {
            // After registration, log the user in
            login(email, password);
        }).catch((error) => {
            console.error('Error setting user color:', error);
        });
    }).catch((error) => {
        console.error('Registration Error:', error.message);
        alert(`Registration Error: ${error.message}`);
    });
}

// Function to handle user logout
function logout() {
    auth.signOut().then(() => {
        document.getElementById('auth-container').classList.remove('d-none');
        document.getElementById('chat-container').classList.add('d-none');
    }).catch((error) => {
        console.error('Logout Error:', error.message);
        alert(`Logout Error: ${error.message}`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const colorPicker = document.getElementById('color-picker');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const saveColorButton = document.getElementById('save-color-button');
    const logoutButton = document.getElementById('logout-button');

    loginButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        login(email, password);
    });

    registerButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const color = colorPicker.value;
        register(email, password, color);
    });

    saveColorButton.addEventListener('click', () => {
        saveColor();
    });

    logoutButton.addEventListener('click', () => {
        logout();
    });

    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});