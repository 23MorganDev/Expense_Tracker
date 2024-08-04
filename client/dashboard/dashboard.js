document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transactionForm');
    const transactionListEl = document.getElementById('transactionList');
    const balanceEl = document.getElementById('balance');
    const statusEl = document.getElementById('status');
    const logoutBtn = document.getElementById('logout');

    // Fetch data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/transactions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // Update balance and transaction list
            balanceEl.textContent = `Balance: $${data.balance.toFixed(2)}`;
            transactionListEl.innerHTML = data.transactions.map(transaction => `
                <li>
                    <span>${transaction.date}</span> - 
                    <span>${transaction.category}</span>: 
                    <span>$${transaction.amount.toFixed(2)}</span>
                </li>
            `).join('');

        } catch (error) {
            statusEl.textContent = 'Error fetching data';
            console.error('Error fetching data:', error);
        }
    };

    fetchData();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value;
        const amount = parseFloat(form.querySelector('#amount').value);
        const date = form.querySelector('#date').value;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, amount, date })
            });

            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }

            // Refresh data
            fetchData();
            form.reset();
            statusEl.textContent = 'Transaction added successfully';

        } catch (error) {
            statusEl.textContent = 'Error adding transaction';
            console.error('Error adding transaction:', error);
        }
    });

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = './login.html';
    });
});
