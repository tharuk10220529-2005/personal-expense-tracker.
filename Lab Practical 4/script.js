document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById("transactionForm");
    const totalIncomeEl = document.getElementById("totalIncome");
    const totalExpenseEl = document.getElementById("totalExpense");
    const currentBalanceEl = document.getElementById("currentBalance");
    const transactionTableBody = document.getElementById("transactionTableBody");
    const filterType = document.getElementById("filterType");
    const searchBox = document.getElementById("searchBox");
    const clearBtn = document.getElementById("clearBtn");

    // Default current date setting
    document.getElementById("date").valueAsDate = new Date();

    // Load transactions from localStorage
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function saveAndRender() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
        updateSummary();
    }

    // Add Transaction
    transactionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const type = document.getElementById("type").value;
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        if (amount <= 0 || isNaN(amount)) {
            alert("Please enter a valid amount greater than zero.");
            return;
        }

        const newTransaction = {
            id: Date.now(),
            type,
            description,
            amount,
            category,
            date
        };

        transactions.push(newTransaction);
        alert("Transaction added successfully!");
        saveAndRender();
        transactionForm.reset();
        document.getElementById("date").valueAsDate = new Date();
    });

    // Clear Form Button
    clearBtn.addEventListener("click", () => {
        transactionForm.reset();
        document.getElementById("date").valueAsDate = new Date();
    });

    // Delete Transaction
    window.deleteTransaction = function (id) {
        transactions = transactions.filter(t => t.id !== id);
        saveAndRender();
    };

    // Update Totals Dashboard
    function updateSummary() {
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(t => {
            if (t.type === "Income") {
                totalIncome += t.amount;
            } else {
                totalExpense += t.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        totalIncomeEl.textContent = `LKR ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        totalExpenseEl.textContent = `LKR ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        currentBalanceEl.textContent = `LKR ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Render Table based on filter and search
    function renderTransactions() {
        const filterVal = filterType.value;
        const searchVal = searchBox.value.toLowerCase();

        let filtered = transactions.filter(t => {
            const matchesType = (filterVal === "All" || t.type === filterVal);
            const matchesSearch = t.description.toLowerCase().includes(searchVal) || t.category.toLowerCase().includes(searchVal);
            return matchesType && matchesSearch;
        });

        if (filtered.length === 0) {
            transactionTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No transactions found.</td></tr>`;
            return;
        }

        transactionTableBody.innerHTML = "";
        filtered.forEach(t => {
            const row = document.createElement("tr");
            const badgeClass = t.type === "Income" ? "bg-success" : "bg-danger";
            const amountPrefix = t.type === "Income" ? "+ LKR " : "- LKR ";

            row.innerHTML = `
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td><span class="badge ${badgeClass}">${t.type}</span></td>
                <td>${t.category}</td>
                <td class="${t.type === 'Income' ? 'text-success' : 'text-danger'} fw-semibold">${amountPrefix}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${t.id})">Delete</button></td>
            `;
            transactionTableBody.appendChild(row);
        });
    }

    filterType.addEventListener("change", renderTransactions);
    searchBox.addEventListener("input", renderTransactions);

    // Initial load
    updateSummary();
    renderTransactions();
});