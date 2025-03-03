const API_URL = "http://127.0.0.1:5000";

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

// Add or Update Customer
async function addOrUpdateCustomer() {
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
        alert("Customer added/updated successfully!");
        fetchCustomers();
    } else {
        alert(data.error || "Failed to add/update customer");
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
    
    customers.forEach(({ name, mobile, balance }) => {
        table.innerHTML += `<tr>
            <td>${name}</td>
            <td>${mobile}</td>
            <td>${balance}</td>
            <td><button onclick="generateInvoice('${name}', '${mobile}', ${balance})">Invoice</button></td>
        </tr>`;
    });
}

// Search Customer
function searchCustomer() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#customerTable tr");
    
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}

// Generate Invoice
function generateInvoice(name, mobile, balance) {
    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
        <html>
        <head><title>Invoice</title></head>
        <body>
            <h2>Invoice</h2>
            <p>Customer: <strong>${name}</strong></p>
            <p>Mobile: <strong>${mobile}</strong></p>
            <p>Amount: <strong>₹${balance}</strong></p>
            <p><strong>Signature:</strong> <i style="font-family: cursive;">${name}</i></p>
            <p>Company Name: <strong>UK Lacony</strong></p>
            <p>Ref: ADL1006 | T%C APPLY</p>
            <p>Thanks for Adding!</p>
        </body>
        </html>
    `);
    invoiceWindow.document.close();
    invoiceWindow.print();
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("dashboard.html")) fetchCustomers();
});
