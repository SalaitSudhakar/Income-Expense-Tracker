// Select DOM elements
const descriptionE1 = document.getElementById('descriptionE1');
const amountE1 = document.getElementById('amountE1');
const typeE1 = document.getElementById('typeE1');
const addTransactionBtnE1 = document.getElementById('addTransactionBtnE1');
const transactionListE1 = document.getElementById('transactionListE1');
const balanceE1 = document.getElementById('balanceE1');
const incomeE1 = document.getElementById('incomeE1');
const expenseE1 = document.getElementById('expenseE1');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentEditIndex = -1;

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update the summary (balance, income, and expenses)
function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    balanceE1.textContent = `Total Balance: ₹${netBalance.toFixed(2)}`;
    incomeE1.textContent = `Income: ₹${totalIncome.toFixed(2)}`;
    expenseE1.textContent = `Expenses: ₹${totalExpenses.toFixed(2)}`;
}

// Display transactions on the UI
function displayTransactions(transactions) {
    transactionListE1.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');

        // Description cell
        const descCell = document.createElement('td');
        descCell.className = 'px-1 sm:px-4 py-2 border border-gray-300 text-gray-800';
        descCell.textContent = transaction.description;

        // Amount cell
        const amountCell = document.createElement('td');
        amountCell.className = 'px-1 sm:px-4 py-2 border border-gray-300 text-gray-800';
        amountCell.textContent = `₹${transaction.amount.toFixed(2)}`;

        if (transaction.type === 'income') {
            amountCell.classList.add('text-green-600', 'font-semibold');
        } else if (transaction.type === 'expense') {
            amountCell.classList.add('text-red-600', 'font-semibold');
        }

        // Action cell (Edit and Delete buttons)
        const actionCell = document.createElement('td');
        actionCell.className = 'px-1 sm:px-4 sm:py-2 border border-gray-300 text-center';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'px-1 sm:px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-500 focus:outline-none';
        editBtn.innerHTML = '<i class="fas fa-edit text-center"></i>';
        editBtn.addEventListener('click', () => editTransaction(transaction));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'px-1 sm:px-3 py-1 bg-red-700 text-white rounded shadow hover:bg-red-600 focus:outline-none ml-2';
        deleteBtn.innerHTML = '<i class="fas fa-trash text-center"></i>';
        deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));

        // Append buttons to action cell
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        // Append cells to row
        row.appendChild(descCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);

        // Append row to table
        transactionListE1.appendChild(row);
    });
}

// Add a transaction
function addTransaction() {
    const description = descriptionE1.value.trim();
    const amount = parseFloat(amountE1.value);
    const type = typeE1.value;

    if (!description || isNaN(amount)) {
        alert('Please enter valid description and amount');
        return;
    }

    const transaction = { description, amount, type, id: Date.now() };

    if (currentEditIndex >= 0) {
        transactions[currentEditIndex] = transaction;
        currentEditIndex = -1;
    } else {
        transactions.push(transaction);
    }

    saveToLocalStorage();
    updateSummary();
    updateUI();
    clearInputs();
}

// Clear input fields
function clearInputs() {
    descriptionE1.value = '';
    amountE1.value = '';
    typeE1.value = 'income';
}

// Delete a transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
    updateSummary();
    updateUI();
}

// Edit a transaction
function editTransaction(transaction) {
    descriptionE1.value = transaction.description;
    amountE1.value = transaction.amount;
    typeE1.value = transaction.type;

    currentEditIndex = transactions.findIndex(t => t.id === transaction.id);
}

// Filter transactions based on radio buttons
function filterTransactions() {
    const filter = document.querySelector('input[name="filter"]:checked').value;

    let filteredTransactions = transactions;

    if (filter === 'income') {
        filteredTransactions = transactions.filter(t => t.type === 'income');
    } else if (filter === 'expense') {
        filteredTransactions = transactions.filter(t => t.type === 'expense');
    }

    displayTransactions(filteredTransactions);
}

// Update UI by showing transactions
function updateUI() {
    const filter = document.querySelector('input[name="filter"]:checked').value;

    let filteredTransactions = transactions;

    if (filter === 'income') {
        filteredTransactions = transactions.filter(t => t.type === 'income');
    } else if (filter === 'expense') {
        filteredTransactions = transactions.filter(t => t.type === 'expense');
    }

    displayTransactions(filteredTransactions);
}

// Event listeners
addTransactionBtnE1.addEventListener('click', addTransaction);
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', filterTransactions);
});

// Initial setup
updateSummary();
updateUI();
