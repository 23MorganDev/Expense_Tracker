document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            authMsg.textContent = "User created successfully. Redirecting to login...";
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);

        } catch (error) {
            authMsg.textContent = 'An error occurred: ' + error.message;
        }
    });
});

