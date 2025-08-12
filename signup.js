document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Signup Data:');
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        // Simulate successful registration (for now)
        alert('Registration successful! (Data logged to console)');
        // In a real application, you would send this data to a backend API
        // and then redirect or update the UI based on the API response.

        // Redirect to main game page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
});