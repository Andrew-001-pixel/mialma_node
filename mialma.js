// mialma.js - A single-file Node.js/Express application for MiAlma

// 1. MODULE IMPORTS
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer'); 
const { v4: uuidv4 } = require('uuid'); 
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's PORT or a local default
const SALT_ROUNDS = 10;

// 2. DATABASE CONFIGURATION
// NOTE: Ensure your MySQL server is running and the 'mialma' database exists.
const db = mysql.createConnection({
  host: 'sqlXXX.freehostingnoads.net', // your FreeHostingNoAds host
  user: 'u123456789_root',             // your database username
  password: '1Mialma@123',            // your database password
  database: '4644643_mialma',     // your database name
    multipleStatements: true 
});


db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        process.exit(1);
    }
    console.log('Connected to database as ID', db.threadId);
});

// 3. MIDDLEWARE SETUP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session management
app.use(session({
    secret: 'MiAlma_Secret_Key_For_Session_Security', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// File Upload Configuration (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Creates a unique name to prevent collisions
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Authentication Check Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// 4. EMBEDDED CSS, JAVASCRIPT & HTML TEMPLATES
// --- STYLES (Kept the same as last update for brevity) ---
const STYLES = `
/* MiAlma Final Refined Styles */
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');

:root {
    --primary-color: #e91e63; /* Deep Pink/Rose */
    --secondary-color: #ff80ab; /* Muted Pink */
    --accent-color: #f44336; /* Classic Red */
    --background-color: #fce4ec; /* Light Pink/Cream */
    --text-color: #333;
    --border-radius: 12px;
    --shadow: 0 8px 20px rgba(0, 0, 0, 0.15); 
    --transition-duration: 0.3s;
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5; 
    color: var(--text-color);
    display: flex;
    flex-direction: column; 
    min-height: 100vh;
    align-items: center; 
    justify-content: center; 
}

h1, h2, h3 {
    color: var(--primary-color);
    margin-top: 0;
}

a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-duration);
}
a:hover {
    color: var(--accent-color);
}

.container {
    padding: 20px;
    max-width: 100%;
    margin: auto;
    width: 100%;
}

/* Forms & Inputs */
.form-container {
    background: white;
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    max-width: 450px;
    margin: 50px auto;
}

input[type="text"], input[type="password"], input[type="date"], textarea, input[type="file"], input[type="range"] {
    width: 100%;
    padding: 12px;
    margin: 8px 0 20px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 1em;
}

/* Password Toggle Container */
.password-container {
    position: relative;
    margin: 8px 0 20px 0;
}
.password-container input {
    margin: 0; 
    padding-right: 40px; 
}
.password-container .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #999;
}

button {
    background-color: var(--primary-color);
    color: white;
    padding: 12px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
    transition: background-color var(--transition-duration), transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

button:hover {
    background-color: var(--accent-color);
    transform: translateY(-1px);
}
button i { font-size: 1.2em; }

/* --- App Layout (Fixed Reduced Height) --- */
.app-wrapper {
    max-width: 1000px;
    width: 95%;
    height: 90vh; 
    min-height: 600px;
    max-height: 800px;
    margin: 20px auto;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    display: flex;
    background-color: white; 
}

#app-layout {
    display: flex;
    flex-grow: 1;
    width: 100%;
    position: relative;
}

/* Sidebar */
#sidebar {
    width: 70px; 
    background-color: var(--primary-color);
    color: white;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%; 
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.nav-item {
    padding: 18px 0; 
    text-align: center;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
}

.nav-item:hover, .nav-item.active {
    background-color: var(--accent-color);
}

.nav-icon {
    font-size: 24px;
}

/* Main Content Area */
#main-content {
    flex-grow: 1;
    padding: 20px;
    background-color: white;
    position: relative;
    overflow-y: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: opacity var(--transition-duration);
    box-sizing: border-box; 
}

/* Updated Header */
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
}
.app-header .header-info {
    display: flex;
    align-items: center;
    gap: 15px;
}
.app-header .profile-pic {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--secondary-color);
}
.app-header h2 {
    margin: 0;
    font-size: 1.5em;
    color: var(--text-color);
}
.app-header h2 i {
    color: var(--primary-color);
    margin-right: 8px;
}
/* Removed settings-icon styles as it is removed from header */


/* --- Preloader Styles (Kept the same) --- */
#preloader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: opacity 0.5s ease-out;
    pointer-events: none; 
    opacity: 0; 
}

#preloader.show {
    opacity: 1;
    pointer-events: auto;
}

.heart-loader {
    width: 60px;
    height: 60px;
    position: relative;
    transform: rotate(-45deg);
}

.heart-loader:before,
.heart-loader:after {
    content: "";
    position: absolute;
    width: 30px;
    height: 30px;
    background: var(--primary-color);
    border-radius: 50%;
    animation: heartbeat 1s infinite;
}

.heart-loader:before {
    left: 30px;
    top: 0;
}

.heart-loader:after {
    left: 0;
    top: 30px;
}

@keyframes heartbeat {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.7); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
}
/* End Preloader Styles */


/* Chat Page Specific */
#chat-page {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0; 
}

#messages-container {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: var(--background-color); /* Fallback */
    border-radius: 10px;
    position: relative;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
    /* Opacity will be controlled by JS for background image */
}

.message {
    padding: 12px 15px; 
    margin-bottom: 10px;
    border-radius: 20px; 
    max-width: 40%;
    word-wrap: break-word;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message.sent {
    background-color: var(--primary-color);
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 5px;
}

.message.received {
    background-color: #fff; 
    color: var(--text-color);
    margin-right: auto;
    border: 1px solid #ddd;
    border-bottom-left-radius: 5px;
}

.message small {
    font-size: 0.7em;
    opacity: 0.8;
    margin-top: 5px;
}

.message-content img, .message-content video {
    max-width: 40%; 
    height: auto;
    display: block;
    border-radius: 8px;
    margin-top: 5px;
}

.message-content audio {
    width: 100%;
    margin-top: 5px;
}

.chat-input-area {
    padding: 10px 0 0 0; 
    background-color: white;
    border-top: 1px solid #eee;
    flex-shrink: 0; 
}

#chat-input-row {
    display: flex;
    flex-grow: 1;
    align-items: center;
}

#chat-message-input {
    flex-grow: 1;
    margin: 0 10px 0 0;
    border-radius: 25px; 
    padding: 12px 15px;
}

.action-buttons {
    display: flex;
    gap: 5px;
    margin-right: 5px;
}

.action-buttons button, .send-button {
    width: 45px !important;
    height: 45px;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    font-size: 1.3em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.send-button.heart {
    background-color: var(--accent-color);
    margin-left: 10px;
}
.send-button.text {
    border-radius: 25px; 
    width: 80px !important;
    padding: 10px 15px;
    height: auto;
}

/* Voice Note Simulation UI */
.voice-recording-ui {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-grow: 1;
    background-color: #fff3e0; 
    padding: 8px 15px;
    border-radius: 25px;
    color: #e65100;
    font-weight: bold;
    margin-right: 10px;
    border: 1px solid #ff9800;
}
.voice-recording-ui i {
    font-size: 1.5em;
    animation: pulse 1s infinite;
}
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}


/* Post View Styles */
.post {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: var(--border-radius);
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.post strong {
    color: var(--primary-color);
}
.post-actions button {
    border-radius: 6px !important; 
    width: 48% !important; 
    height: auto !important;
    padding: 8px 15px !important;
    font-size: 1em;
}

/* Responsive adjustments (Kept the same) */
@media (max-width: 768px) {
    .app-wrapper {
        margin: 0;
        height: 100vh;
        max-height: none;
        border-radius: 0;
    }
    #sidebar {
        width: 100%;
        height: 60px; 
        flex-direction: row;
        padding-top: 0;
        position: fixed;
        bottom: 0;
        z-index: 100;
        border-top: 1px solid var(--secondary-color);
    }
    .nav-item {
        flex-grow: 1;
        padding: 10px 0;
    }
    #main-content {
        margin-bottom: 60px; 
        height: auto;
    }
    #app-layout {
        flex-direction: column;
    }
    .action-buttons button, .send-button {
        width: 40px !important;
        height: 40px;
    }
    .send-button.text {
        width: 70px !important;
    }
}
`;

// --- JAVASCRIPT (Client-Side Logic) ---
const JAVASCRIPT = `
// MiAlma Client-Side Logic
const mainContent = document.getElementById('main-content');
const preloader = document.getElementById('preloader');
let currentView = 'chat'; 
let isRecordingVoice = false;

// Utility to create heart emojis for background animation
function createHeart() {
    const container = document.getElementById('messages-container');
    if (!container) return; 

    const heart = document.createElement('div');
    heart.classList.add('heart-bg-animation');
    heart.innerHTML = '&#x2764;'; 
    heart.style.position = 'absolute';
    heart.style.color = 'rgba(255, 0, 0, 0.2)'; 
    heart.style.zIndex = '0';
    heart.style.left = Math.random() * 90 + 5 + '%';
    heart.style.animation = 'floatUp ' + (Math.random() * 10 + 5) + 's linear infinite';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 15000); 
}

const HEART_ANIMATION_CSS = \`
    @keyframes floatUp {
        0% { transform: translateY(100%); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100%); opacity: 0; }
    }
    .heart-bg-animation {
        position: absolute;
    }
\`;

// Inject heart animation CSS if not already present
if (!document.querySelector('style[data-heart-css]')) {
    const style = document.createElement('style');
    style.setAttribute('data-heart-css', 'true');
    document.head.appendChild(style);
}
// Set initial CSS (must be done after element is appended for some browsers)
document.querySelector('style[data-heart-css]').innerHTML = HEART_ANIMATION_CSS;


// --- Navigation Logic ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            if (view) {
                loadView(view);
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Initial load (only if we are on the app layout)
    if(document.getElementById('app-layout')) {
        loadView('chat');
        document.querySelector('[data-view="chat"]').classList.add('active');
    }
    setupPasswordToggles(); // Setup toggles on login/signup pages too
});

// Password Toggle Functionality
function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling; 
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('bi-eye-slash-fill');
            this.classList.toggle('bi-eye-fill');
        });
    });
}


// Load content into the main area (Includes Preloader Logic)
async function loadView(viewName) {
    console.log("Loading view:", viewName);
    currentView = viewName;
    if (window.chatInterval) clearInterval(window.chatInterval);
    if (window.heartInterval) clearInterval(window.heartInterval);
    
    // 1. Show preloader
    if (preloader) preloader.classList.add('show');
    mainContent.style.opacity = '0'; 

    try {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate minimum load time

        const response = await fetch(\`/view/\${viewName}\`);
        if (response.ok) {
            mainContent.innerHTML = await response.text();
            
            if (viewName === 'chat') {
                if (!window.heartInterval) window.heartInterval = setInterval(createHeart, 1000);
                setupChatListeners();
                await fetchMessages(); 
                // CRUCIAL: Re-start polling only for chat view
                window.chatInterval = setInterval(fetchMessages, 3000); 
            } else {
                 isRecordingVoice = false;
            }
            
            if (viewName === 'posts' || viewName === 'add-post') {
                 setupPostListeners();
            }
            if (viewName === 'settings') {
                 setupSettingsFormListeners();
            }
        } else {
            console.error(\`Failed to load view \${viewName}: \${response.status} \${response.statusText}\`);
            mainContent.innerHTML = '<div style="text-align: center; padding-top: 50px;"><h2><i class="bi bi-x-circle"></i> Error loading content.</h2><p>Could not load the requested view.</p></div>';
        }
    } catch (error) {
        console.error('Fetch error loading view:', viewName, error);
        mainContent.innerHTML = '<div style="text-align: center; padding-top: 50px;"><h2><i class="bi bi-wifi-off"></i> Network Error.</h2><p>Please check your connection and try again.</p></div>';
    } finally {
        // 2. Hide preloader and show content
        setTimeout(() => {
             if (preloader) preloader.classList.remove('show');
             mainContent.style.opacity = '1'; 
        }, 500); 
    }
}

// --- Chat Logic ---
function setupChatListeners() {
    console.log("Setting up chat listeners...");
    const sendBtn = document.getElementById('send-message-button');
    const voiceNoteBtn = document.getElementById('voice-note-button');
    const mediaInput = document.getElementById('chat-media-input');
    const voiceInputArea = document.getElementById('voice-input-area');
    const chatForm = document.getElementById('chat-form'); 
    
    // Safety check for critical elements
    if (!voiceInputArea || !sendBtn || !chatForm) {
        console.warn("Chat elements not found, skipping chat listener setup.");
        return;
    }
    
    // Voice Note Toggler
    if (voiceNoteBtn) {
        voiceNoteBtn.addEventListener('click', () => {
            isRecordingVoice = !isRecordingVoice;
            if (isRecordingVoice) {
                // SIMULATE recording UI
                voiceInputArea.innerHTML = \`
                    <div class="voice-recording-ui">
                        <i class="bi bi-mic-fill"></i> Recording <span>...</span>
                        <button type="button" id="send-voice-note-button" title="Send" style="background-color: green; margin-left: auto; width: 45px!important; height: 45px!important; border-radius: 50%;">
                            <i class="bi bi-send"></i>
                        </button>
                        <button type="button" id="cancel-voice-note-button" title="Cancel" style="background-color: gray; width: 45px!important; height: 45px!important; border-radius: 50%;">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                \`;
                setupVoiceNoteListeners();
            } else {
                // Return to normal chat input
                voiceInputArea.innerHTML = \`
                    <input type="text" id="chat-message-input" placeholder="Type a message..." autocomplete="off">
                \`;
                // Re-setup all chat listeners for the newly created input field
                setupChatListeners(); 
            }
            toggleSendButtonState();
        });
    }

    // Function to check input and toggle send button/heart icon
    function toggleSendButtonState() {
        const currentInput = document.getElementById('chat-message-input');
        const mediaBtn = document.getElementById('media-upload-button');
        const voiceBtn = document.getElementById('voice-note-button');
        
        if (isRecordingVoice) {
            sendBtn.style.display = 'none';
            if(mediaBtn) mediaBtn.style.display = 'none';
            if(voiceBtn) voiceBtn.style.display = 'none';
        } else {
            sendBtn.style.display = 'flex'; // Ensure button is visible
            if(mediaBtn) mediaBtn.style.display = 'block';
            if(voiceBtn) voiceBtn.style.display = 'block';

            if (currentInput && currentInput.value.trim().length > 0) {
                sendBtn.innerHTML = '<i class="bi bi-send-fill"></i>';
                sendBtn.classList.remove('heart');
                sendBtn.classList.add('text');
                sendBtn.setAttribute('title', 'Send Message');
            } else {
                sendBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
                sendBtn.classList.add('heart');
                sendBtn.classList.remove('text');
                sendBtn.setAttribute('title', 'Send Heart');
            }
        }
    }

    // Input listener for the message field
    const currentChatInput = document.getElementById('chat-message-input');
    if (currentChatInput) {
        currentChatInput.addEventListener('input', toggleSendButtonState);
        currentChatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    toggleSendButtonState(); // Initial state setup


    // Handle Form Submission (Text or Heart)
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentInput = document.getElementById('chat-message-input');
        const content = currentInput ? (currentInput.value.trim()) : '';
        const type = (currentInput && content.length > 0) ? 'text' : 'heart'; 
        
        // Prevent sending empty messages if not a heart
        if (content.length === 0 && type !== 'heart') return;

        // Clear input and toggle state immediately
        if (currentInput) currentInput.value = ''; 
        toggleSendButtonState();

        try {
            const response = await fetch('/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content.length > 0 ? content : '❤️', message_type: type })
            });

            if (response.ok) {
                 console.log("Message sent successfully (API call ok). Fetching messages now...");
                await fetchMessages();
            } else {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
                alert('Failed to send message: ' + (errorData.error || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Network error sending message:', error);
            alert('Network error while sending message.');
        }
    });
    
    // Handle Media File Input
    document.getElementById('media-upload-button')?.addEventListener('click', () => {
        mediaInput?.click();
    });

    mediaInput?.addEventListener('change', async (e) => {
        if (e.target.files.length === 0) return;
        
        if (preloader) preloader.classList.add('show');
        const formData = new FormData();
        formData.append('media', e.target.files[0]);

        try {
            const response = await fetch('/chat/send-media', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log("Media sent successfully (API call ok). Fetching messages now...");
                await fetchMessages();
            } else {
                const errorData = await response.json();
                alert('Failed to upload media: ' + (errorData.error || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Error uploading media:', error);
            alert('Network error while uploading media.');
        } finally {
             if (preloader) preloader.classList.remove('show');
             e.target.value = null; // Clear the input so same file can be uploaded again
        }
    });
}

// Voice Note Listeners
function setupVoiceNoteListeners() {
    console.log("Setting up voice note listeners...");
    const sendVoiceBtn = document.getElementById('send-voice-note-button');
    const cancelVoiceBtn = document.getElementById('cancel-voice-note-button');

    // Restore normal input function
    const restoreNormalInput = () => {
        isRecordingVoice = false;
        document.getElementById('voice-input-area').innerHTML = \`
             <input type="text" id="chat-message-input" placeholder="Type a message..." autocomplete="off">
        \`;
        setupChatListeners(); // Re-set listeners for the new input field
    };

    sendVoiceBtn?.addEventListener('click', async () => {
        restoreNormalInput();
        try {
            // Simulated upload - Sending a placeholder audio file URL
            const response = await fetch('/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: '/uploads/simulated_voice_note.mp3', // Placeholder URL
                    message_type: 'voice' 
                })
            });
            
            if (response.ok) {
                console.log("Voice Note sent successfully (API call ok). Fetching messages now...");
                await fetchMessages();
            } else {
                const errorData = await response.json();
                console.error("Server responded with error for voice note:", errorData);
                alert('Failed to send voice note: ' + (errorData.error || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Network error sending simulated voice note:', error);
            alert('Error sending voice note (simulated).');
        }
    });
    
    cancelVoiceBtn?.addEventListener('click', restoreNormalInput);
}


// Fetch Messages (Polling)
async function fetchMessages() {
    const container = document.getElementById('messages-container');
    if (!container) {
        console.warn("Messages container not found for fetching messages.");
        return;
    }

    try {
        const response = await fetch('/chat/messages');
        const data = await response.json();
        
        if (!data.messages) {
            console.warn("API did not return messages array:", data);
            return;
        }

        // Only scroll if user is near the bottom
        const shouldScroll = container.scrollHeight - container.clientHeight <= container.scrollTop + 50; 

        const newHTML = data.messages.map(msg => \`
            <div class="message \${msg.is_me ? 'sent' : 'received'}">
                <strong>\${msg.sender_nickname}:</strong>
                <div class="message-content">\${renderMessageContent(msg)}</div>
                <small>\${new Date(msg.created_at).toLocaleTimeString()}</small>
            </div>
        \`).join('');

        // Update only if content has changed to avoid unnecessary re-renders
        if (container.innerHTML.trim() !== newHTML.trim()) {
            container.innerHTML = newHTML;
            // Scroll to bottom after new content is added
            if (shouldScroll) {
                container.scrollTop = container.scrollHeight;
            }
        }
        
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function renderMessageContent(msg) {
    if (msg.message_type === 'image') {
        return \`<img src="\${msg.message_content}" alt="Image"> \`;
    } else if (msg.message_type === 'video') {
        return \`<video controls src="\${msg.message_content}"></video>\`;
    } else if (msg.message_type === 'voice') {
        // Voice Note content (the URL) is the message_content
        return \`<div style="display: flex; align-items: center; gap: 10px;"><i class="bi bi-mic-fill" style="font-size: 1.2em;"></i> <audio controls src="\${msg.message_content}"></audio></div>\`;
    } else if (msg.message_type === 'heart') { // Render heart explicitly
        return \`<i class="bi bi-heart-fill" style="color: white; font-size: 1.5em;"></i>\`; // Or whatever heart icon you prefer
    }
    return msg.message_content;
}

// --- Post & Settings Logic (Copy Link Function Included) ---
function setupPostListeners() {
    console.log("Setting up post listeners...");
    document.querySelectorAll('.like-button').forEach(btn => {
        btn.addEventListener('click', async function() {
            const postId = this.getAttribute('data-post-id');
            const response = await fetch(\`/posts/like/\${postId}\`, { method: 'POST' });
            if (response.ok) {
                // BUG FIX: Reload posts view to see the change
                loadView('posts'); 
            } else {
                alert('Failed to process like.');
            }
        });
    });
    
    const addPostForm = document.getElementById('add-post-form');
    if (addPostForm) {
        addPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addPostForm);
            
            if (preloader) preloader.classList.add('show');

            try {
                const response = await fetch('/posts/add', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    alert('Post added successfully!');
                    loadView('posts'); 
                } else {
                    const errorData = await response.text();
                    alert('Failed to add post: ' + errorData);
                }
            } catch (error) {
                console.error('Error adding post:', error);
                alert('Network error while adding post.');
            } finally {
                if (preloader) preloader.classList.remove('show');
            }
        });
    }
}

function setupSettingsFormListeners() {
    console.log("Setting up settings form listeners...");
    document.getElementById('profile-form')?.addEventListener('submit', setupSettingsFormSubmit);
    document.getElementById('bg-form')?.addEventListener('submit', setupSettingsFormSubmit);
    document.getElementById('bg-opacity-form')?.addEventListener('submit', setupSettingsFormSubmit); // New form

    document.getElementById('copy-invite-link')?.addEventListener('click', () => {
        const linkElement = document.getElementById('invite-link-text');
        if (linkElement) {
            const link = linkElement.innerText.trim();
            navigator.clipboard.writeText(link).then(() => {
                alert('Invite link copied to clipboard! (P.S. Remember to restart the server if you changed the port!)');
            }).catch(err => {
                console.error('Could not copy text: ', err);
                alert('Could not copy link. Please copy it manually.');
            });
        }
    });
}

async function setupSettingsFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    if (preloader) preloader.classList.add('show');

    try {
        const response = await fetch(form.action, { method: 'POST', body: formData });
        const textResponse = await response.text(); // Get raw text to check for script
        
        if (preloader) preloader.classList.remove('show');

        if (response.ok) {
            // Check if it's the chat background update that expects a script for reload
            if (form.id === 'bg-form') { 
                if (textResponse.includes('<script>')) {
                    document.body.innerHTML = textResponse; // This is a full page reload trigger
                } else {
                    alert('Chat background updated!');
                    loadView('settings'); // Fallback, though a full reload is expected for bg change
                }
            } else {
                alert('Settings updated!');
                loadView('settings'); 
            }
        } else {
            alert('Failed to update settings: ' + textResponse);
        }
    } catch (err) {
        if (preloader) preloader.classList.remove('show');
        console.error('Settings update error:', err);
        alert('Failed to update settings due to network or server error.');
    }
}

// Global function exposed for settings button
window.confirmBreakup = function() {
    if (confirm("⚠️ ARE YOU SURE YOU WANT TO BREAK UP? This will permanently delete your couple account and all data. This action is irreversible.")) {
        fetch('/settings/breakup', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Couple account successfully broken up and deleted. You will now be logged out.');
                    window.location.href = '/logout';
                } else {
                    alert(data.message || 'Failed to delete account.');
                }
            })
            .catch(err => {
                console.error('Breakup error:', err);
                alert('An error occurred during breakup.');
            });
    }
}
`;


// --- HTML TEMPLATES (Embedded - No Change) ---

// Component for Password Input with Toggle
const PASSWORD_INPUT = (name, placeholder) => `
    <div class="password-container">
        <input type="password" placeholder="${placeholder}" name="${name}" required>
        <i class="bi bi-eye-slash-fill toggle-password"></i>
    </div>
`;


const PRELOADER_HTML = `
<div id="preloader" class="show">
    <div class="heart-loader"></div>
    <h3 style="color: var(--primary-color); margin-top: 20px;">MiAlma is Loading...</h3>
</div>
`;

const BASE_HTML = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | MiAlma</title>
    <link rel="icon" href="./assets/bg.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <style>${STYLES}</style>
</head>
<body>
    ${bodyContent}
    <script>${JAVASCRIPT}</script>
</body>
</html>
`;

const APP_LAYOUT = (coupleName) => `
<div class="app-wrapper">
    <div id="app-layout">
        ${PRELOADER_HTML}
        
        <div id="sidebar">
            <div class="nav-item active" data-view="chat"><i class="bi bi-chat-heart-fill nav-icon"></i></div>
            <div class="nav-item" data-view="posts"><i class="bi bi-image-fill nav-icon"></i></div>
            <div class="nav-item" data-view="leaderboard"><i class="bi bi-trophy-fill nav-icon"></i></div>
            <div class="nav-item" data-view="notifications"><i class="bi bi-bell-fill nav-icon"></i></div>
            <div class="nav-item" data-view="add-post"><i class="bi bi-plus-circle-fill nav-icon"></i></div>
            <div class="nav-item" data-view="settings"><i class="bi bi-gear-fill nav-icon"></i></div>
            <div class="nav-item" onclick="window.location.href='/logout'"><i class="bi bi-box-arrow-left nav-icon"></i></div>
        </div>

        <div id="main-content">
            <h2 style="text-align: center; margin-top: 50px;"><i class="bi bi-arrow-clockwise"></i> Loading...</h2>
        </div>
    </div>
</div>
`;

const LOGIN_PAGE = (message) => `
<div class="form-container">
    <h1>Login to MiAlma</h1>
    ${message ? `<p style="color: red;">${message}</p>` : ''}
    <form action="/login" method="POST">
        <label for="couple_name"><b>Couple Name</b></label>
        <input type="text" placeholder="Enter Couple Name" name="couple_name" required>

        <label for="password"><b>Password</b></label>
        ${PASSWORD_INPUT('password', 'Enter Password')}
            
        <button type="submit">Login</button>
    </form>
    <p style="text-align: center; margin-top: 20px;">
        Don't have an account? <a href="/signup1">Create a Couple Account</a>
    </p>
</div>
`;

const SIGNUP1_PAGE = (message) => `
<div class="form-container">
    <h1>Create Couple Account (Step 1 of 2)</h1>
    ${message ? `<p style="color: red;">${message}</p>` : ''}
    <form action="/signup1" method="POST">
        <label for="couple_name"><b>Your Couple Name</b></label>
        <input type="text" placeholder="e.g., The Lovers" name="couple_name" required>

        <label for="initiated_date"><b>Initiated Date</b></label>
        <input type="date" name="initiated_date" required>

        <label for="my_nickname"><b>Your Nickname (How you want to be called)</b></label>
        <input type="text" placeholder="e.g., Sweetheart" name="my_nickname" required>
        
        <label for="partner_nickname"><b>Your Partner's Nickname (How you call them)</b></label>
        <input type="text" placeholder="e.g., My Star" name="partner_nickname" required>
        
        <label for="my_password"><b>Your Password</b></label>
        ${PASSWORD_INPUT('my_password', 'Enter Password')}
            
        <button type="submit">Create Account & Get Invite Link</button>
    </form>
</div>
`;

const INVITE_LINK_PAGE = (coupleName, inviteLink) => `
<div class="form-container">
    <h1>Account Created!</h1>
    <p>Your couple account for <b>${coupleName}</b> is ready! Now, invite your partner.</p>
    
    <h3><i class="bi bi-link-45deg"></i> Share this link with your partner:</h3>
    <div style="background-color: #eee; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <p id="invite-link-text" style="word-break: break-all; font-weight: bold; color: green; margin: 0;">${inviteLink}</p>
    </div>
    
    <p>Once they use the link and sign up, you can both log in with the couple name.</p>
    <a href="/login"><button type="button" style="background-color: #333;">Go to Login</button></a>
</div>
`;

const SIGNUP2_PAGE = (coupleName, initiatedDate, token) => `
<div class="form-container">
    <h1>Join ${coupleName} (Step 2 of 2)</h1>
    <p>Couple initiated on: <b>${initiatedDate}</b></p>
    <form action="/signup2" method="POST">
        <input type="hidden" name="token" value="${token}">

        <label for="my_nickname"><b>Your Nickname (How you want to be called)</b></label>
        <input type="text" placeholder="e.g., Honeybear" name="my_nickname" required>
        
        <label for="partner_nickname"><b>Your Partner's Nickname (How you call them)</b></label>
        <input type="text" placeholder="e.g., My King/Queen" name="partner_nickname" required>
        
        <label for="my_password"><b>Your Password</b></label>
        ${PASSWORD_INPUT('my_password', 'Enter Password')}
            
        <button type="submit">Complete Join</button>
    </form>
</div>
`;

// --- Dynamic View Templates (Loaded via AJAX - Small change to Chat View for opacity fallback) ---

const CHAT_VIEW = (nickname, partnerNickname, couple) => {
    // Determine background style based on couple settings
    const opacity = (couple.chat_bg_opacity !== undefined && couple.chat_bg_opacity !== null) ? couple.chat_bg_opacity : 0.8;
    const chatBgStyle = couple.chat_bg_url
        ? `background-image: url('${couple.chat_bg_url}'); background-size: cover; background-position: center; opacity: ${opacity};`
        : `background-color: var(--background-color);`; // Fallback to default if no image
    
    return `
<div class="app-header">
    <div class="header-info">
        <img src="${couple.profile_picture_url || '/uploads/default_couple_pic.png'}" alt="Couple Photo" class="profile-pic">
        <h2><i class="bi bi-chat-heart-fill"></i> chat with ${partnerNickname}</h2>
    </div>
</div>
<div id="chat-page">
    <div id="messages-container" style="${chatBgStyle}">
    </div>
    <div class="chat-input-area">
        <form id="chat-form" style="display: flex; flex-grow: 1; align-items: center;">
            <div id="chat-input-row" style="display: flex; flex-grow: 1; align-items: center;">
                <div id="voice-input-area" style="flex-grow: 1;">
                    <input type="text" id="chat-message-input" placeholder="Type a message..." autocomplete="off">
                </div>
                <input type="file" id="chat-media-input" name="media" accept="image/*,video/*,audio/*" style="display:none;">
                
                <div class="action-buttons">
                    <button type="button" id="media-upload-button" title="Upload Media" style="background-color: #4caf50;"><i class="bi bi-paperclip"></i></button>
                    <button type="button" id="voice-note-button" title="Voice Note" style="background-color: #ff9800;"><i class="bi bi-mic-fill"></i></button>
                </div>
            </div>

            <button type="submit" id="send-message-button" class="send-button heart" title="Send Heart" style="margin-left: 10px;">
                <i class="bi bi-heart-fill"></i>
            </button>
        </form>
    </div>
</div>
`;
};

const POSTS_VIEW = (couple, postsHTML) => `
<div class="app-header">
    <div class="header-info">
        <img src="${couple.profile_picture_url || '/uploads/default_couple_pic.png'}" alt="Couple Photo" class="profile-pic">
        <h2><i class="bi bi-image-fill"></i> ${couple.couple_name}'s Posts</h2>
    </div>
</div>
<div id="posts-list" style="overflow-y: auto; flex-grow: 1; padding-right: 5px;">
    ${postsHTML}
</div>
`;

const ADD_POST_VIEW = (couple) => `
<div class="app-header">
    <div class="header-info">
        <img src="${couple.profile_picture_url || '/uploads/default_couple_pic.png'}" alt="Couple Photo" class="profile-pic">
        <h2><i class="bi bi-plus-circle-fill"></i> Add a New Post</h2>
    </div>
</div>
<div class="form-container" style="max-width: 100%; margin: 20px 0;">
    <form id="add-post-form" enctype="multipart/form-data">
        <label for="post_content"><b>What's on your mind?</b></label>
        <textarea name="content" id="post_content" rows="4" placeholder="Share a memory or thought..." required></textarea>
        
        <label for="post_media"><b>Image or Video (Optional)</b></label>
        <input type="file" name="media" id="post_media" accept="image/*,video/*">

        <button type="submit"><i class="bi bi-pencil-square"></i> Post</button>
    </form>
</div>
`;

const LEADERBOARD_VIEW = (leaderboardHTML) => `
<div class="app-header">
    <h2><i class="bi bi-trophy-fill"></i> Leaderboard</h2>
</div>
<p style="font-size: 0.9em; color: #666;">Ranked by weighted score: (Chat Messages * 0.7) + (Post Likes * 0.3)</p>
<div id="leaderboard-list" style="overflow-y: auto; flex-grow: 1; padding-right: 5px;">
    <div class="leaderboard-item" style="font-weight: bold; border-bottom: 2px solid var(--accent-color); display: flex; justify-content: space-between; padding: 10px 0; margin-bottom: 5px;">
        <span>Rank | Couple Name</span>
        <span>Score</span>
    </div>
    ${leaderboardHTML}
</div>
`;

const NOTIFICATIONS_VIEW = (notificationsHTML) => `
<div class="app-header">
    <h2><i class="bi bi-bell-fill"></i> Notifications</h2>
</div>
<div id="notifications-list" style="overflow-y: auto; flex-grow: 1; padding-right: 5px;">
    ${notificationsHTML}
</div>
`;

const SETTINGS_VIEW = (user, couple, inviteLink) => `
<div class="app-header">
    <h2><i class="bi bi-gear-fill"></i> Settings</h2>
</div>
<div style="overflow-y: auto; flex-grow: 1; padding-right: 5px;">
    <div class="form-container" style="max-width: 100%; margin: 0 0 20px 0; box-shadow: none; border: 1px solid #ddd;">
        <h3><i class="bi bi-person-badge"></i> Profile & Couple Info</h3>
        <p><b>Current Couple:</b> ${couple.couple_name}</p>
        <p><b>Your Nickname:</b> ${user.partner_nickname_to_me}</p>
        
        <form id="profile-form" action="/settings/update-profile" method="POST" enctype="multipart/form-data">
            <label for="new_couple_name"><b>Change Couple Name</b></label>
            <input type="text" name="new_couple_name" id="new_couple_name" placeholder="Enter new couple name (optional)" value="${couple.couple_name}">

            <label for="profile_pic"><b>Upload Couple Profile Picture</b></label>
            <input type="file" name="profile_pic" id="profile_pic" accept="image/*">
            <img src="${couple.profile_picture_url || '/uploads/default_couple_pic.png'}" alt="Profile" style="max-width: 100px; border-radius: 50%; display: block; margin: 10px 0; border: 3px solid var(--secondary-color);">

            <button type="submit"><i class="bi bi-save-fill"></i> Update Profile</button>
        </form>
    </div>

    <div class="form-container" style="max-width: 100%; margin: 0 0 20px 0; box-shadow: none; border: 1px solid #ddd;">
        <h3><i class="bi bi-link-45deg"></i> Partner Invite Link</h3>
        ${inviteLink ? `
            <div style="background-color: #eee; padding: 10px; border-radius: 6px;">
                <p style="margin: 0; font-size: 0.9em;">Link is only available if your partner hasn't joined yet.</p>
                <a id="invite-link-text" href="${inviteLink}" style="word-break: break-all; font-weight: bold; color: green;">${inviteLink}</a>
            </div>
            <button type="button" class="copy-button" id="copy-invite-link" style="margin-top: 10px; background-color: #007bff;"><i class="bi bi-clipboard"></i> Copy Link</button>
        ` : `<p style="color: gray;">Your partner has already joined! Invite link no longer needed.</p>`}
    </div>

    <div class="form-container" style="max-width: 100%; margin: 0 0 20px 0; box-shadow: none; border: 1px solid #ddd;">
        <h3><i class="bi bi-image"></i> Chat Background</h3>
        <p>Set a romantic background image for your chat! (Current: ${couple.chat_bg_url ? 'Custom' : 'Default'})</p>
        <form id="bg-form" action="/settings/update-bg" method="POST" enctype="multipart/form-data">
            <label for="chat_bg"><b>Upload Chat Background Image</b></label>
            <input type="file" name="chat_bg" id="chat_bg" accept="image/*" required>
            <button type="submit"><i class="bi bi-upload"></i> Set Chat Background</button>
        </form>
        
        <form id="bg-opacity-form" action="/settings/update-bg-opacity" method="POST" style="margin-top: 20px;">
            <label for="chat_bg_opacity"><b>Background Opacity (${Math.round((couple.chat_bg_opacity || 0.8) * 100)}%)</b></label>
            <input type="range" id="chat_bg_opacity" name="chat_bg_opacity" min="0" max="1" step="0.05" value="${couple.chat_bg_opacity || 0.8}" 
                   oninput="this.previousElementSibling.innerHTML = '<b>Background Opacity (' + Math.round(this.value * 100) + '%)</b>'">
            <button type="submit" style="background-color: #007bff;"><i class="bi bi-sliders"></i> Set Opacity</button>
        </form>
    </div>

    <div class="form-container" style="max-width: 100%; margin: 0; box-shadow: none; border: 1px solid #ddd;">
        <h3><i class="bi bi-exclamation-triangle-fill"></i> Danger Zone</h3>
        <button type="button" onclick="confirmBreakup()" style="background-color: red;">
            <i class="bi bi-trash-fill"></i> Breakup & Delete Account
        </button>
        <a href="/logout"><button type="button" style="background-color: #333; margin-top: 10px;"><i class="bi bi-box-arrow-right"></i> Logout</button></a>
    </div>
</div>
`;


// 5. ROUTES (Backend logic)

// --- Utility Functions ---

async function getCoupleAndUser(userId, coupleId) {
    const [userResults] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = userResults[0];
    
    const [coupleResults] = await db.promise().query('SELECT * FROM couples WHERE id = ?', [coupleId]);
    const couple = coupleResults[0];

    return { user, couple };
}

// --- Authentication & Setup Routes (No Change) ---

app.get('/', (req, res) => {
    if (req.session.userId) return res.redirect('/app');
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(BASE_HTML("Login", LOGIN_PAGE(req.session.message)));
    req.session.message = null; 
});

app.post('/login', (req, res) => {
    const { couple_name, password } = req.body;

    const sql = `
        SELECT u.* FROM users u
        JOIN couples c ON u.couple_id = c.id
        WHERE c.couple_name = ?
    `;

    db.query(sql, [couple_name], async (err, users) => {
        if (err) {
            console.error('Login DB Error:', err);
            return res.status(500).send('DB Error');
        }

        const user = users.find(u => bcrypt.compareSync(password, u.password_hash));

        if (user) {
            req.session.userId = user.id;
            req.session.coupleId = user.couple_id;
            res.redirect('/app');
        } else {
            req.session.message = 'Invalid Couple Name or Password.';
            res.redirect('/login');
        }
    });
});

app.get('/signup1', (req, res) => {
    res.send(BASE_HTML("Sign Up", SIGNUP1_PAGE(req.session.message)));
    req.session.message = null;
});

app.post('/signup1', async (req, res) => {
    const { couple_name, initiated_date, my_password, partner_nickname, my_nickname } = req.body;

    db.query('SELECT id FROM couples WHERE couple_name = ?', [couple_name], async (err, results) => {
        if (err) {
            console.error('Signup1 DB Error:', err);
            return res.status(500).send('DB Error');
        }
        if (results.length > 0) {
            req.session.message = 'Couple Name already taken.';
            return res.redirect('/signup1');
        }

        try {
            const passwordHash = await bcrypt.hash(my_password, SALT_ROUNDS);
            const inviteToken = uuidv4(); 
            const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 19).replace('T', ' ');

            await db.promise().query('START TRANSACTION');

            const coupleInsert = `INSERT INTO couples (couple_name, initiated_date, invite_token, token_expires_at) VALUES (?, ?, ?, ?)`;
            const [coupleResult] = await db.promise().query(coupleInsert, [couple_name, initiated_date, inviteToken, tokenExpiresAt]);
            const coupleId = coupleResult.insertId;

            const userInsert = `INSERT INTO users (couple_id, username, password_hash, nickname_to_partner, partner_nickname_to_me) VALUES (?, ?, ?, ?, ?)`;
            await db.promise().query(userInsert, [coupleId, 'Partner1', passwordHash, partner_nickname, my_nickname]);

            await db.promise().query('COMMIT');

            const inviteLink = `${req.protocol}://${req.get('host')}/signup2/${inviteToken}`;
            res.send(BASE_HTML("Invite Partner", INVITE_LINK_PAGE(couple_name, inviteLink)));

        } catch (error) {
            await db.promise().query('ROLLBACK');
            console.error('Signup Error:', error);
            req.session.message = 'A server error occurred during sign up.';
            res.redirect('/signup1');
        }
    });
});

app.get('/signup2/:token', (req, res) => {
    const { token } = req.params;

    const sql = `
        SELECT c.id AS couple_id, c.couple_name, c.initiated_date
        FROM couples c
        LEFT JOIN users u ON c.id = u.couple_id
        WHERE c.invite_token = ? AND c.token_expires_at > NOW()
        GROUP BY c.id
        HAVING COUNT(u.id) = 1
    `;

    db.query(sql, [token], (err, results) => {
        if (err) {
            console.error('Signup2 DB Error:', err);
            req.session.message = 'DB Error during invite link validation.';
            return res.redirect('/login');
        }
        if (results.length === 0) {
            req.session.message = 'Invalid or expired invite link. Please ask your partner for a new one.';
            return res.redirect('/login');
        }

        const couple = results[0];
        req.session.signupToken = token;
        
        const coupleName = couple.couple_name;
        const initiatedDate = new Date(couple.initiated_date).toLocaleDateString();
        res.send(BASE_HTML(`Join ${coupleName}`, SIGNUP2_PAGE(coupleName, initiatedDate, token)));
    });
});

app.post('/signup2', async (req, res) => {
    const token = req.session.signupToken || req.body.token;
    const { my_password, partner_nickname, my_nickname } = req.body;

    if (!token) {
        req.session.message = 'Session expired. Please use the invite link again.';
        return res.redirect('/login');
    }

    const findSql = `
        SELECT c.id AS couple_id, u1.id AS p1_id
        FROM couples c
        JOIN users u1 ON c.id = u1.couple_id
        WHERE c.invite_token = ?
        LIMIT 1
    `;

    db.query(findSql, [token], async (err, results) => {
        if (err) {
            console.error('Signup2 find couple DB Error:', err);
            req.session.message = 'DB Error finding couple.';
            req.session.signupToken = null;
            return res.redirect('/login');
        }
        if (results.length === 0) {
            req.session.message = 'Invalid or expired token, or partner already joined.';
            req.session.signupToken = null;
            return res.redirect('/login');
        }

        const { couple_id, p1_id } = results[0];

        try {
            const passwordHash = await bcrypt.hash(my_password, SALT_ROUNDS);

            await db.promise().query('START TRANSACTION');

            const user2Insert = `INSERT INTO users (couple_id, username, password_hash, nickname_to_partner, partner_nickname_to_me) VALUES (?, ?, ?, ?, ?)`;
            const [user2Result] = await db.promise().query(user2Insert, [couple_id, 'Partner2', passwordHash, partner_nickname, my_nickname]);
            const user2Id = user2Result.insertId;
            
            // Update partner's nickname for the first user, and clear invite token
            const updateSql = `
                UPDATE users SET nickname_to_partner = ? WHERE id = ?;
                UPDATE couples SET invite_token = NULL, token_expires_at = NULL WHERE id = ?;
            `;
            await db.promise().query(updateSql, [my_nickname, p1_id, couple_id]);

            await db.promise().query('COMMIT');

            req.session.signupToken = null;
            req.session.userId = user2Id;
            req.session.coupleId = couple_id;
            req.session.message = 'Successfully joined! Welcome to MiAlma.';
            res.redirect('/app');

        } catch (error) {
            await db.promise().query('ROLLBACK');
            console.error('Signup2 Error:', error);
            req.session.message = 'A server error occurred during sign up (2).';
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});


app.get('/app', isAuthenticated, async (req, res) => {
    try {
        const sql = `
            SELECT c.couple_name
            FROM users u
            JOIN couples c ON u.couple_id = c.id
            WHERE u.id = ?
        `;
        const [results] = await db.promise().query(sql, [req.session.userId]);
        if (results.length === 0) return res.redirect('/logout');

        const { couple_name } = results[0];
        res.send(BASE_HTML(couple_name, APP_LAYOUT(couple_name)));

    } catch (error) {
        console.error('App load error:', error);
        res.status(500).send('An error occurred loading the application.');
    }
});


// --- Dynamic Content/View Routes (No Change) ---

app.get('/view/:viewName', isAuthenticated, async (req, res) => {
    const viewName = req.params.viewName;
    const coupleId = req.session.coupleId;
    const userId = req.session.userId;

    try {
        const { user, couple } = await getCoupleAndUser(userId, coupleId);

        if (!user || !couple) {
            console.error("User or Couple data missing for view:", viewName, "UserId:", userId, "CoupleId:", coupleId);
            return res.status(404).send('User or Couple data missing.');
        }
        
        // Ensure couple.chat_bg_opacity is a valid number, default to 0.8
        if (typeof couple.chat_bg_opacity === 'string') {
            couple.chat_bg_opacity = parseFloat(couple.chat_bg_opacity);
        }
        if (isNaN(couple.chat_bg_opacity) || couple.chat_bg_opacity === null) {
            couple.chat_bg_opacity = 0.8;
        }


        switch (viewName) {
            case 'chat':
                const [partnerUserResult] = await db.promise().query(
                    'SELECT partner_nickname_to_me FROM users WHERE couple_id = ? AND id != ?', 
                    [coupleId, userId]
                );
                const partnerNickname = partnerUserResult[0]?.partner_nickname_to_me || 'My Love';

                res.send(CHAT_VIEW(user.partner_nickname_to_me, partnerNickname, couple));
                break;

            case 'posts':
                const [posts] = await db.promise().query(`
                    SELECT p.*, u.partner_nickname_to_me AS creator_nickname, 
                           (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
                           (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    WHERE p.couple_id = ?
                    ORDER BY p.created_at DESC
                `, [userId, coupleId]);

                const postsHTML = posts.map(p => `
                    <div class="post">
                        <p style="color: gray; margin-bottom: 10px; font-size: 0.9em;"><i class="bi bi-person-circle"></i> <strong>Posted by: ${p.creator_nickname}</strong> on ${new Date(p.created_at).toLocaleDateString()}</p>
                        <p style="font-size: 1.1em; margin-bottom: 15px;">${p.content}</p>
                        ${p.media_url ? 
                            (p.media_url.match(/\.(mp4|webm|ogg)$/i) ? 
                            `<div style="text-align: center; margin-bottom: 15px;"><video controls src="${p.media_url}" style="max-width: 90%; max-height: 400px; border-radius: 8px; object-fit: cover;"></video></div>` : 
                            `<div style="text-align: center; margin-bottom: 15px;"><img src="${p.media_url}" style="max-width: 90%; max-height: 400px; border-radius: 8px; object-fit: cover;" /></div>`)
                            : ''}
                        <div class="post-actions" style="display: flex; justify-content: space-between;">
                            <button class="like-button" data-post-id="${p.id}" style="${p.is_liked > 0 ? 'background-color: var(--accent-color);' : 'background-color: #f0f0f0; color: #333;'}; width: 48%;">
                                <i class="bi bi-heart-fill"></i> ${p.is_liked > 0 ? 'Liked!' : 'Like'} (${p.likes_count})
                            </button>
                            <button style="background-color: #eee; color: #333; width: 48%; border: 1px solid #ccc;"><i class="bi bi-chat-dots-fill"></i> Comment (Simulated)</button>
                        </div>
                    </div>
                `).join('');
                res.send(POSTS_VIEW(couple, postsHTML));
                break;
            
            case 'add-post':
                res.send(ADD_POST_VIEW(couple));
                break;

            case 'leaderboard':
                const [leaderboard] = await db.promise().query(`
                    SELECT couple_name, chat_count, post_like_count, 
                           (chat_count * 0.7 + post_like_count * 0.3) AS score
                    FROM couples
                    ORDER BY score DESC
                    LIMIT 10
                `);

                const leaderboardHTML = leaderboard.map((c, index) => `
                    <div class="leaderboard-item" style="${c.couple_name === couple.couple_name ? 'background-color: var(--secondary-color); font-weight: bold; border: 2px solid var(--primary-color);' : 'background-color: #fff; border: 1px solid #eee;'} border-radius: 6px; padding: 10px; margin: 5px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; justify-content: space-between;">
                        <span><i class="bi bi-person-heart"></i> ${index + 1}. ${c.couple_name}</span>
                        <span>${Math.round(c.score)}</span>
                    </div>
                `).join('');
                res.send(LEADERBOARD_VIEW(leaderboardHTML));
                break;

            case 'notifications':
                const notifications = [
                    { time: '5m ago', message: 'Your post was liked by your partner! ❤️', icon: 'bi-heart-fill' },
                    { time: '1h ago', message: 'You moved up to #3 on the leaderboard! 🏆 (Simulated)', icon: 'bi-trophy-fill' },
                    { time: '1d ago', message: 'Your partner added a new post: "Best day ever!"', icon: 'bi-image-fill' }
                ];

                const notificationsHTML = notifications.map(n => `
                    <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 15px; background-color: #fff; border-radius: 6px; margin-bottom: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <i class="bi ${n.icon}" style="font-size: 1.5em; color: var(--primary-color);"></i>
                        <div>
                            <p style="margin: 0; font-size: 1.1em;">${n.message}</p>
                            <small style="color: gray;">${n.time}</small>
                        </div>
                    </div>
                `).join('');
                res.send(NOTIFICATIONS_VIEW(notificationsHTML));
                break;

            case 'settings':
                const [partnerCountResult] = await db.promise().query(
                    'SELECT COUNT(id) AS count FROM users WHERE couple_id = ?', 
                    [coupleId]
                );
                
                let inviteLink = null;
                if (partnerCountResult[0].count === 1 && couple.invite_token) {
                     inviteLink = `${req.protocol}://${req.get('host')}/signup2/${couple.invite_token}`;
                }
                
                res.send(SETTINGS_VIEW(user, couple, inviteLink));
                break;

            default:
                res.status(404).send('View not found.');
        }
    } catch (error) {
        console.error(`Error loading view ${viewName}:`, error);
        res.status(500).send('Server error loading content.');
    }
});

// --- API Endpoints ---

// Chat Messages API (Polling)
app.get('/chat/messages', isAuthenticated, async (req, res) => {
    const coupleId = req.session.coupleId;
    const userId = req.session.userId;
    console.log(`[Messages API] Fetching messages for Couple ID: ${coupleId}, User ID: ${userId}`);

    try {
        const [messages] = await db.promise().query(`
            SELECT m.message_content, m.created_at, m.message_type, m.user_id, u.partner_nickname_to_me AS sender_nickname
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.couple_id = ?
            ORDER BY m.created_at ASC
            LIMIT 50
        `, [coupleId]);

        const formattedMessages = messages.map(m => ({
            message_content: m.message_content,
            created_at: m.created_at,
            message_type: m.message_type,
            sender_nickname: m.sender_nickname,
            // CRUCIAL: Check if the message user_id matches the session userId
            is_me: m.user_id === userId 
        }));
        
        console.log(`[Messages API] Fetched ${formattedMessages.length} messages.`);
        res.json({ messages: formattedMessages });

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// Send Text/Heart/Voice Message
app.post('/chat/send', isAuthenticated, async (req, res) => {
    const { message, message_type = 'text' } = req.body; 
    const userId = req.session.userId;
    const coupleId = req.session.coupleId;

    if (!message && message_type !== 'heart') { 
        return res.status(400).json({ error: 'Message content is required for non-heart messages.' });
    }
    
    console.log(`[Chat Send] User: ${userId}, Type: ${message_type}, Content: ${message.substring(0, 50)}...`);


    try {
        // Insert message
        const messageInsert = 'INSERT INTO messages (couple_id, user_id, message_content, message_type) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().query(messageInsert, [coupleId, userId, message, message_type]);
        console.log(`[Chat Send] Message inserted with ID: ${result.insertId}`);

        // Increment chat count
        const countUpdate = 'UPDATE couples SET chat_count = chat_count + 1 WHERE id = ?';
        await db.promise().query(countUpdate, [coupleId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending message (DB or Server error):', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

// Send Media Message
app.post('/chat/send-media', isAuthenticated, upload.single('media'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No media file provided.' });
    }

    const userId = req.session.userId;
    const coupleId = req.session.coupleId;
    const filePath = `/uploads/${req.file.filename}`;
    let messageType;

    if (req.file.mimetype.startsWith('image')) {
        messageType = 'image';
    } else if (req.file.mimetype.startsWith('video')) {
        messageType = 'video';
    } else if (req.file.mimetype.startsWith('audio')) {
        messageType = 'voice';
    } else {
        // Delete file if type is not supported
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Unsupported media type.' });
    }

    console.log(`[Chat Send Media] User: ${userId}, Type: ${messageType}, Path: ${filePath}`);

    try {
        const messageInsert = 'INSERT INTO messages (couple_id, user_id, message_content, message_type) VALUES (?, ?, ?, ?)';
        await db.promise().query(messageInsert, [coupleId, userId, filePath, messageType]);
        
        // Increment chat count
        const countUpdate = 'UPDATE couples SET chat_count = chat_count + 1 WHERE id = ?';
        await db.promise().query(countUpdate, [coupleId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending media message:', error);
        res.status(500).json({ error: 'Failed to send media message.' });
    }
});

// Add Post (No Change)
app.post('/posts/add', isAuthenticated, upload.single('media'), async (req, res) => {
    const { content } = req.body;
    const userId = req.session.userId;
    const coupleId = req.session.coupleId;
    let mediaUrl = null;

    if (!content && !req.file) {
        return res.status(400).send('Content or media is required for a post.');
    }

    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
    }

    try {
        const sql = 'INSERT INTO posts (couple_id, user_id, content, media_url) VALUES (?, ?, ?, ?)';
        await db.promise().query(sql, [coupleId, userId, content, mediaUrl]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).send('Failed to add post.');
    }
});

// Like Post (No Change)
app.post('/posts/like/:postId', isAuthenticated, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.session.userId;
    const coupleId = req.session.coupleId;

    try {
        // Check if already liked
        const [existing] = await db.promise().query('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);

        if (existing.length > 0) {
            // Unlike
            const deleteLike = 'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?';
            await db.promise().query(deleteLike, [postId, userId]);
            
            // Decrement post_like_count on couple
            await db.promise().query('UPDATE couples SET post_like_count = post_like_count - 1 WHERE id = ?', [coupleId]);
        } else {
            // Like
            const insertLike = 'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)';
            await db.promise().query(insertLike, [postId, userId]);
            
            // Increment post_like_count on couple
            await db.promise().query('UPDATE couples SET post_like_count = post_like_count + 1 WHERE id = ?', [coupleId]);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).send('Failed to process like.');
    }
});

// Update Profile/Couple Info (No Change)
app.post('/settings/update-profile', isAuthenticated, upload.single('profile_pic'), async (req, res) => {
    const { new_couple_name } = req.body;
    const userId = req.session.userId;
    const coupleId = req.session.coupleId;
    let updates = [];
    let updateValues = [];

    try {
        if (new_couple_name) {
            updates.push('couple_name = ?');
            updateValues.push(new_couple_name);
        }

        if (req.file) {
            const profilePicUrl = `/uploads/${req.file.filename}`;
            updates.push('profile_picture_url = ?');
            updateValues.push(profilePicUrl);
        }

        if (updates.length > 0) {
            const coupleUpdateSql = `UPDATE couples SET ${updates.join(', ')} WHERE id = ?`;
            updateValues.push(coupleId);
            await db.promise().query(coupleUpdateSql, updateValues);
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Failed to update profile.');
    }
});

// Update Chat Background Image (No Change)
app.post('/settings/update-bg', isAuthenticated, upload.single('chat_bg'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No background file provided.');
    }
    const coupleId = req.session.coupleId;
    const bgUrl = `/uploads/${req.file.filename}`;

    try {
        const sql = 'UPDATE couples SET chat_bg_url = ? WHERE id = ?';
        await db.promise().query(sql, [bgUrl, coupleId]);
        
        // This sends a script to reload the full page to ensure CSS/JS re-evaluation
        res.send('<script>window.location.reload();</script>');
    } catch (error) {
        console.error('Error updating background:', error);
        res.status(500).send('Failed to update background.');
    }
});

// Update Chat Background Opacity (No Change)
app.post('/settings/update-bg-opacity', isAuthenticated, async (req, res) => {
    const { chat_bg_opacity } = req.body;
    const coupleId = req.session.coupleId;

    if (isNaN(parseFloat(chat_bg_opacity)) || parseFloat(chat_bg_opacity) < 0 || parseFloat(chat_bg_opacity) > 1) {
        return res.status(400).send('Invalid opacity value.');
    }

    try {
        const sql = 'UPDATE couples SET chat_bg_opacity = ? WHERE id = ?';
        await db.promise().query(sql, [parseFloat(chat_bg_opacity), coupleId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating background opacity:', error);
        res.status(500).send('Failed to update background opacity.');
    }
});

// Breakup (Delete Account) (No Change)
app.post('/settings/breakup', isAuthenticated, async (req, res) => {
    const coupleId = req.session.coupleId;

    try {
        await db.promise().query('START TRANSACTION');
        
        // Delete associated records first (messages, posts, likes)
        await db.promise().query('DELETE FROM messages WHERE couple_id = ?', [coupleId]);
        await db.promise().query('DELETE FROM post_likes WHERE post_id IN (SELECT id FROM posts WHERE couple_id = ?)', [coupleId]);
        await db.promise().query('DELETE FROM posts WHERE couple_id = ?', [coupleId]);
        
        // Delete users
        await db.promise().query('DELETE FROM users WHERE couple_id = ?', [coupleId]);
        
        // Delete couple
        await db.promise().query('DELETE FROM couples WHERE id = ?', [coupleId]);
        
        await db.promise().query('COMMIT');

        req.session.destroy(() => {
            res.json({ success: true });
        });
    } catch (error) {
        await db.promise().query('ROLLBACK');
        console.error('Breakup error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete account due to a server error.' });
    }
});


// Static files for uploads (media)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. SERVER START
app.listen(PORT, () => {
    console.log(`MiAlma app running at http://localhost:${PORT}`);
    console.log("REMINDER: Restart the server after any change to mialma.js");
});
