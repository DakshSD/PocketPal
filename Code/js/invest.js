const email = localStorage.getItem("params");
function fetchExpenditures() {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:5500/investments?email=${encodeURIComponent(email)}`;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                populateExpendituresTable(data);
            } else {
                console.error('Failed to fetch expenditures: ', xhr.status);
            }
        }
    };
    xhr.open('GET', url);
    xhr.send();
}

function populateExpendituresTable(expenditures) {
    const expendituresBody = document.getElementById('expendituresBody');
    expendituresBody.innerHTML = '';

    expenditures.forEach(exp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exp.date}</td>
            <td>${exp.time}</td>
            <td>${exp.name}</td>
            <td>${exp.amt}</td>
            <td>${exp.quantity}</td>
            <td>${exp.total_amt}</td>
        `;
        expendituresBody.appendChild(row);
    });
}

fetchExpenditures();