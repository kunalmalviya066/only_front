const API_URL = "http://127.0.0.1:5000"; // Change this to your backend URL after deployment

// Register User
async function register() {
    const mobile = document.getElementById("reg_mobile").value;
    const password = document.getElementById("reg_password").value;
    
    if (!mobile || !password) {
        alert("Please enter mobile and password");
        return;
    }

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("User registered successfully!");
        window.location.href = "index.html";
    } else {
        alert(data.error || "Registration failed");
    }
}

// Login User
async function login() {
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;
    
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert(data.error || "Invalid credentials!");
    }
}

// Logout User
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Add Customer
async function addCustomer() {
    const name = document.getElementById("name").value;
    const mobile = document.getElementById("customer_mobile").value;
    const balance = document.getElementById("balance").value || 0;
    const token = localStorage.getItem("token");
    
    if (!name || !mobile) {
        alert("Please enter name and mobile");
        return;
    }
    
    const response = await fetch(`${API_URL}/add_customer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, mobile, balance })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Customer added successfully!");
        fetchCustomers();
    } else {
        alert(data.error || "Failed to add customer");
    }
}

// Fetch Customers
async function fetchCustomers() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/customers`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const customers = await response.json();
    const table = document.getElementById("customerTable");
    table.innerHTML = "";

    customers.forEach((customer, index) => {
        table.innerHTML += `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.mobile}</td>
                <td>
                    <input type="number" value="${customer.balance}" id="balance_${index}">
                    <button onclick="updateBalance(${customer.id}, ${index})">Update</button>
                </td>
                <td>
                    <button onclick="generateInvoice('${customer.name}', ${customer.id}, ${customer.balance}')">Invoice</button>
                </td>
            </tr>
        `;
    });
}

// Update Customer Balance
async function updateBalance(customerID, index) {
    const newBalance = document.getElementById(`balance_${index}`).value;
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/update_balance`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ customerID, newBalance })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Balance updated successfully!");
        fetchCustomers();
    } else {
        alert(data.error || "Failed to update balance");
    }
}

// Generate Invoice
function generateInvoice(name, id, amount) {
    document.getElementById("invoiceName").innerText = name;
    document.getElementById("invoiceID").innerText = id;
    document.getElementById("invoiceAmount").innerText = amount;
    document.getElementById("invoiceSignature").innerHTML = `
        <span style="font-family: cursive;">${name}</span> &nbsp;
        <span style="font-family: serif;">${name}</span>
    `;

    document.getElementById("invoiceModal").style.display = "block";
}

// Close Invoice Modal
function closeInvoice() {
    document.getElementById("invoiceModal").style.display = "none";
}

// Print Invoice
function printInvoice() {
    window.print();
}

// Search Customer
function searchCustomer() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#customerTable tr");
    
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("dashboard.html")) fetchCustomers();
});
