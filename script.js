document.addEventListener("DOMContentLoaded", function () {
    const invoiceForm = document.getElementById("invoiceForm");
    const invoiceDisplay = document.getElementById("invoiceDisplay");
    const invoiceContent = document.getElementById("invoiceContent");
    const addItemButton = document.getElementById("addItem");
    const itemFields = document.getElementById("itemFields");

    addItemButton.addEventListener("click", function () {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.innerHTML = `
            <label>Description:</label>
            <input type="text" class="itemDescription" required>
            <label>Quantity:</label>
            <input type="number" class="itemQuantity" min="1" required>
            <label>Price per Unit:</label>
            <input type="number" class="itemPrice" step="0.01" required>
            <label>Tax Rate (%):</label>
            <input type="number" class="itemTax" step="0.01" required>
        `;
        itemFields.appendChild(itemDiv);
    });

    invoiceForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const customerName = document.getElementById("customerName").value;
        const customerAddress = document.getElementById("customerAddress").value;

        const items = [];
        document.querySelectorAll(".item").forEach((itemDiv) => {
            const description = itemDiv.querySelector(".itemDescription").value;
            const quantity = parseFloat(itemDiv.querySelector(".itemQuantity").value);
            const price = parseFloat(itemDiv.querySelector(".itemPrice").value);
            const taxRate = parseFloat(itemDiv.querySelector(".itemTax").value);
            items.push({ description, quantity, price, taxRate });
        });

        let totalBeforeTax = 0;
        let totalTax = 0;

        let invoiceHTML = `
            <h3>Customer Details</h3>
            <p>Name: ${customerName}</p>
            <p>Address: ${customerAddress}</p>
            <h3>Item Details</h3>
            <table>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Tax</th>
                    <th>Total</th>
                </tr>
        `;

        items.forEach((item) => {
            const itemTotal = item.quantity * item.price;
            const itemTax = (item.taxRate / 100) * itemTotal;
            totalBeforeTax += itemTotal;
            totalTax += itemTax;
            invoiceHTML += `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.taxRate}%</td>
                    <td>$${(itemTotal + itemTax).toFixed(2)}</td>
                </tr>
            `;
        });

        const totalAmount = totalBeforeTax + totalTax;

        invoiceHTML += `
            </table>
            <h3>Summary</h3>
            <p>Total Before Tax: $${totalBeforeTax.toFixed(2)}</p>
            <p>Total Tax: $${totalTax.toFixed(2)}</p>
            <p><strong>Total Amount Due: $${totalAmount.toFixed(2)}</strong></p>
        `;

        invoiceContent.innerHTML = invoiceHTML;
        invoiceForm.classList.add("hidden");
        invoiceDisplay.classList.remove("hidden");
    });

    document.getElementById("editInvoice").addEventListener("click", function () {
        invoiceForm.classList.remove("hidden");
        invoiceDisplay.classList.add("hidden");
    });

    document.getElementById("downloadInvoice").addEventListener("click", function () {
        const invoiceHTML = invoiceContent.innerHTML;
        const blob = new Blob([invoiceHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.html";
        a.click();
    });

    document.getElementById("printInvoice").addEventListener("click", function () {
        window.print();
    });
});
