document.addEventListener("DOMContentLoaded", () => {
  loadPortfolio();
  loadSellHistory();
});

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function loadPortfolio() {
  const data = JSON.parse(localStorage.getItem('portfolio')) || [];
  const tbody = document.getElementById('portfolioBody');
  tbody.innerHTML = '';
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input value="${item.coin}" onchange="updateData(${index}, 'coin', this.value)"/></td>
      <td><input type="number" value="${item.quantity}" onchange="updateData(${index}, 'quantity', parseFloat(this.value))"/></td>
      <td><input type="number" value="${item.marketValue}" onchange="updateData(${index}, 'marketValue', parseFloat(this.value))"/></td>
      <td><input type="number" value="${item.avgPrice}" onchange="updateData(${index}, 'avgPrice', parseFloat(this.value))"/></td>
      <td>${(item.quantity * item.avgPrice).toFixed(2)}</td>
      <td><button onclick="sellAsset(${index})">Sell</button></td>
    `;
    tbody.appendChild(row);
  });
}

function updateData(index, field, value) {
  const data = JSON.parse(localStorage.getItem('portfolio')) || [];
  data[index][field] = value;
  localStorage.setItem('portfolio', JSON.stringify(data));
  loadPortfolio();
}

function addRow() {
  const data = JSON.parse(localStorage.getItem('portfolio')) || [];
  data.push({ coin: '', quantity: 0, marketValue: 0, avgPrice: 0 });
  localStorage.setItem('portfolio', JSON.stringify(data));
  loadPortfolio();
}

function sellAsset(index) {
  const data = JSON.parse(localStorage.getItem('portfolio')) || [];
  const asset = data[index];
  const sellQty = prompt("Enter quantity to sell:");
  const sellPrice = prompt("Enter sell price per coin:");
  const qty = parseFloat(sellQty);
  const price = parseFloat(sellPrice);
  if (isNaN(qty) || isNaN(price) || qty <= 0 || qty > asset.quantity) return alert("Invalid input.");
  
  asset.quantity -= qty;
  if (asset.quantity === 0) {
    data.splice(index, 1);
  } else {
    data[index] = asset;
  }
  localStorage.setItem('portfolio', JSON.stringify(data));
  logSell(asset.coin, qty, price);
  loadPortfolio();
}

function logSell(coin, qty, price) {
  const history = JSON.parse(localStorage.getItem('sellHistory')) || [];
  const date = new Date().toLocaleString();
  const total = (qty * price).toFixed(2);
  history.push({ coin, qty, price, total, date });
  localStorage.setItem('sellHistory', JSON.stringify(history));
  loadSellHistory();
}

function loadSellHistory() {
  const history = JSON.parse(localStorage.getItem('sellHistory')) || [];
  const tbody = document.getElementById('historyBody');
  tbody.innerHTML = '';
  history.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.coin}</td>
      <td>${entry.qty}</td>
      <td>${entry.price}</td>
      <td>${entry.total}</td>
      <td>${entry.date}</td>
    `;
    tbody.appendChild(row);
  });
}
