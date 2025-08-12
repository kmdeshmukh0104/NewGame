# Product Requirements Document: Enhanced 2048 Game

## 1. Introduction

### Purpose
This document outlines the requirements for an enhanced version of the classic 2048 game, incorporating user authentication, personalized score tracking, and a robust API for data management. The goal is to provide a more engaging and persistent gaming experience for users.

### Scope
This project encompasses the development of a web-based 2048 game client and a backend API to manage user accounts, game sessions, and score data. It will include features for user registration, login, displaying current and highest scores, and a history of past game scores.

### Target Audience
Casual gamers who enjoy puzzle games and wish to track their progress and compete with themselves over time.

## 2. Goals & Objectives

### Business Goals
*   Increase user engagement and retention through personalized features.
*   Provide a platform for future expansion (e.g., leaderboards, social features).
*   Demonstrate proficiency in full-stack web development.

### User Goals
*   Users can create an account and log in to save their game progress.
*   Users can easily view their current and highest scores.
*   Users can review their past game performance.
*   Users can enjoy a seamless and responsive 2048 gameplay experience.

## 3. User Stories (High-Level)

*   **As a new user**, I want to create an account so I can save my game progress and scores.
*   **As a returning user**, I want to log in so I can access my saved games and score history.
*   **As a player**, I want to see my current score update in real-time during the game.
*   **As a player**, I want to see my all-time highest score prominently displayed on the main game page.
*   **As a player**, I want to view a list of my past game scores, including the date and score achieved.
*   **As a player**, I want to play the classic 2048 game with standard rules and mechanics.

## 4. Functional Requirements

### 4.1. Game Core
*   **Tile Generation:** Random generation of 2s or 4s in empty cells.
*   **Movement & Merging:** Support for up, down, left, and right swipes/key presses, with correct tile merging logic (e.g., 2+2=4).
*   **Game Over Condition:** Detection when no more moves or merges are possible.
*   **Win Condition:** Detection when a 2048 tile is created.
*   **Score Calculation:** Accumulation of points based on merged tile values.
*   **Board Rendering:** Dynamic rendering of the game board and tiles based on the game state.

### 4.2. User Authentication
*   **User Registration:**
    *   Users can create an account with a unique username and password.
    *   Password strength validation.
    *   Error handling for existing usernames or invalid inputs.
*   **User Login:**
    *   Users can log in with their registered username and password.
    *   Session management (e.g., JWT tokens for authenticated API requests).
    *   Error handling for incorrect credentials.
*   **User Logout:**
    *   Users can securely log out, invalidating their session.

### 4.3. Score Management
*   **Current Score Display:** Real-time update of the current game score during gameplay.
*   **Highest Score Display:** Fetch and display the user's highest score on the main game interface.
*   **Game Score Storage:**
    *   Upon game completion (game over or win), the final score is saved to the user's history.
    *   If the current score exceeds the user's highest score, the highest score is updated.
*   **Score History:**
    *   Users can access a dedicated page to view a chronological list of their past game scores.
    *   Each entry should include the score and the date/time of the game.

### 4.4. User Interface (UI)
*   **Login/Registration Page:**
    *   Clear input fields for username and password.
    *   Buttons for "Login" and "Register".
    *   Links to switch between login and registration forms.
*   **Main Game Page:**
    *   Prominent display of the 2048 game board.
    *   Dedicated sections for "Current Score" and "Highest Score".
    *   "Game Over" and "You Win" overlays with appropriate messages and restart/continue options.
*   **Score History Page:**
    *   A clear, sortable, and paginated list of past game scores.
*   **Responsive Design:** The UI should be usable across various screen sizes (desktop, tablet, mobile).

## 5. Non-Functional Requirements

*   **Performance:**
    *   Game animations and tile movements should be smooth and responsive.
    *   API response times for authentication and score operations should be minimal (e.g., <200ms).
*   **Security:**
    *   Passwords must be securely hashed and stored (e.g., bcrypt).
    *   API endpoints must be protected with authentication (e.g., JWT).
    *   Protection against common web vulnerabilities (e.g., XSS, CSRF).
*   **Scalability:**
    *   The backend API and database should be designed to handle a growing number of users and game sessions.
*   **Usability:**
    *   The user interface should be intuitive and easy to navigate.
    *   Clear feedback should be provided for user actions (e.g., successful login, error messages).
*   **Maintainability:**
    *   Codebase should be well-structured, documented, and follow established coding standards.
    *   Automated tests should be implemented for critical functionalities.

## 6. API Design (High-Level)

All API endpoints should be prefixed with `/api`. Responses should be in JSON format.

### 6.1. Authentication Endpoints
*   **`POST /api/register`**
    *   **Request Body:**
        ```json
        {
            "username": "string",
            "password": "string"
        }
        ```
    *   **Response (Success 201):**
        ```json
        {
            "message": "User registered successfully",
            "token": "jwt_token_string"
        }
        ```
    *   **Response (Error 400/409):**
        ```json
        {
            "error": "Error message"
        }
        ```
*   **`POST /api/login`**
    *   **Request Body:**
        ```json
        {
            "username": "string",
            "password": "string"
        }
        ```
    *   **Response (Success 200):**
        ```json
        {
            "message": "Login successful",
            "token": "jwt_token_string"
        }
        ```
    *   **Response (Error 401):**
        ```json
        {
            "error": "Invalid credentials"
        }
        ```
*   **`POST /api/logout`**
    *   **Authentication:** Required (JWT in Header)
    *   **Response (Success 200):**
        ```json
        {
            "message": "Logged out successfully"
        }
        ```

### 6.2. User Data Endpoints (Authentication Required)
*   **`GET /api/user/me`**
    *   **Authentication:** Required
    *   **Response (Success 200):**
        ```json
        {
            "username": "string",
            "highestScore": 0
        }
        ```

### 6.3. Game Data Endpoints (Authentication Required)
*   **`POST /api/game/start`**
    *   **Authentication:** Required
    *   **Response (Success 201):**
        ```json
        {
            "sessionId": "uuid_string",
            "message": "New game session started"
        }
        ```
*   **`POST /api/game/{sessionId}/end`**
    *   **Authentication:** Required
    *   **Path Parameters:** `sessionId` (UUID of the game session)
    *   **Request Body:**
        ```json
        {
            "score": 12345,
            "isWin": true
        }
        ```
    *   **Response (Success 200):**
        ```json
        {
            "message": "Game session ended and score saved",
            "newHighestScore": 12345 // Only if highest score was updated
        }
        ```
*   **`GET /api/scores/history`**
    *   **Authentication:** Required
    *   **Query Parameters (Optional):** `limit`, `offset`, `sortBy`
    *   **Response (Success 200):**
        ```json
        {
            "scores": [
                {"id": "uuid", "score": 1024, "date": "2023-10-27T10:00:00Z"},
                {"id": "uuid", "score": 512, "date": "2023-10-26T09:30:00Z"}
            ],
            "total": 2
        }
        ```
*   **`GET /api/scores/highest`**
    *   **Authentication:** Required
    *   **Response (Success 200):**
        ```json
        {
            "highestScore": 12345
        }
        ```

## 7. Technology Stack (Suggested)

*   **Frontend:**
    *   HTML, CSS, JavaScript
    *   Framework: React (with Create React App or Next.js for SSR/SSG)
    *   State Management: Redux or React Context API
    *   Styling: CSS Modules or Styled Components
*   **Backend:**
    *   Language: Node.js
    *   Framework: Express.js
    *   Database ORM: Mongoose (for MongoDB) or Sequelize (for SQL databases)
    *   Authentication: Passport.js or JWT
*   **Database:**
    *   MongoDB (NoSQL, flexible schema for scores/users) or PostgreSQL (Relational, if more structured data is preferred).
*   **Deployment:**
    *   Frontend: Netlify, Vercel, GitHub Pages
    *   Backend: Heroku, AWS EC2, DigitalOcean Droplets
*   **Version Control:** Git, GitHub/GitLab/Bitbucket
*   **Testing:** Jest, React Testing Library (Frontend), Mocha/Chai (Backend)
