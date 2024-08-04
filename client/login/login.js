document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Store token in localStorage
            localStorage.setItem('token', data.token);

            authMsg.textContent = "Login successful. Redirecting to dashboard...";
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 2000);

        } catch (error) {
            authMsg.textContent = 'An error occurred: ' + error.message;
        }
    });
});
