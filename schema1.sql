-- Database: mialma

-- Table for couples
CREATE TABLE couples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_name VARCHAR(255) NOT NULL UNIQUE,
    initiated_date DATE NOT NULL,
    invite_token VARCHAR(255) UNIQUE NULL, -- Token for second partner signup
    token_expires_at DATETIME NULL,
    chat_count INT DEFAULT 0, -- For leaderboard (total messages)
    post_like_count INT DEFAULT 0 -- For leaderboard (total likes on all posts)
);

-- Table for couple members
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT,
    username VARCHAR(255) NOT NULL, -- "Boyfriend" or "Girlfriend" to distinguish in code
    password_hash VARCHAR(255) NOT NULL,
    nickname_to_partner VARCHAR(255) NOT NULL,
    partner_nickname_to_me VARCHAR(255) NULL, -- Filled on second partner signup
    profile_picture_url VARCHAR(255) NULL, -- Path to uploaded profile image
    FOREIGN KEY (couple_id) REFERENCES couples(id)
);

-- Table for chat messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT,
    sender_id INT,
    message_content TEXT NOT NULL,
    message_type ENUM('text', 'image', 'video', 'voice') DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Table for couple posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT,
    user_id INT, -- Who created the post
    content TEXT NOT NULL,
    media_url VARCHAR(255) NULL, -- Path to image or video
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table for post likes
CREATE TABLE post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT, -- Who liked the post
    UNIQUE KEY (post_id, user_id), -- A user can only like a post once
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);