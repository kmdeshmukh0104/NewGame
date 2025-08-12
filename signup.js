function handleSignup(usernameValue, emailValue, passwordValue, errorMessageElement, localStorageMock, windowMock) {
    errorMessageElement.textContent = ''; // Clear previous error messages

    // Password validation: min 8 chars, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(passwordValue)) {
        errorMessageElement.textContent = 'Password must be at least 8 characters long, contain at least one uppercase letter and one number.';
        return false;
    }

    // Check for existing username
    const users = JSON.parse(localStorageMock.getItem('users')) || [];
    const usernameExists = users.some(user => user.username === usernameValue);

    if (usernameExists) {
        errorMessageElement.textContent = 'Username already taken. Please choose a different one.';
        return false;
    }

    // Store new user
    const newUser = { username: usernameValue, email: emailValue, password: passwordValue }; // In a real app, hash the password!
    users.push(newUser);
    localStorageMock.setItem('users', JSON.stringify(users));

    // Simulate alert and redirect
    // alert('Registration successful! You can now log in.'); // Cannot mock alert easily in Node.js tests
    windowMock.location.href = 'index.html'; // Redirect to main game page or login page
    return true;
}

// This part remains for the browser environment
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const errorMessageDiv = document.getElementById('error-message');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        handleSignup(username, email, password, errorMessageDiv, localStorage, window);
    });
});