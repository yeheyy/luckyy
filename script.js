document.addEventListener("DOMContentLoaded", () => {
  loadPortfolio();
  loadSellHistory();
});

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function loadPortfolio() {
  const data = JSON.parse(localStorage.getItem('portfolio')) || [];
  const tbody = document.getElementById('portfolioBody');
  tbody.innerHTML = '';
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    const totalCost = (item.quantity * item.avgPrice).toFixed(2);
    row.innerHTML = `
      <td><input value="${item.coin}" onchange="updateData(${index}, 'coin', this.value)"/></td>
      <td>${item.quantity}</td>
      <td>${item.marketValue}</td>
      <td>${item.avgPrice.toFixed(2)}</td>
      <td>${totalCost}</td>
      <td>
        <button onclick="buyAsset(${index})">Buy</button>
        <button onclick="sellAsset(${index})">Sell</button>
      </td>
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

function buyAsset(index) {
  const data = JSON.parse(localStorage.getItem('portfolio')) || [];
  const asset = data[index];
  const buyQty = parseFloat(prompt("Enter quantity to buy:"));
  const buyPrice = parseFloat(prompt("Enter buy price per coin:"));

  if (isNaN(buyQty) || isNaN(buyPrice) || buyQty <= 0 || buyPrice <= 0) {
    alert("Invalid input.");
    return;
  }

  const totalOld = asset.quantity * asset.avgPrice;
  const totalNew = buyQty * buyPrice;
  const newQty = asset.quantity + buyQty;

  asset.avgPrice = (totalOld + totalNew) / newQty;
  asset.quantity = newQty;
  asset.marketValue = asset.quantity * buyPrice;

  data[index] = asset;
  localStorage.setItem('portfolio', JSON.stringify(data));
  loadPortfolio();
}

function sellAsset(index) {
  const data = JSON.parse(localStorage.getItem('portfolio')) || [];
  const asset = data[index];
  const sellQty = parseFloat(prompt("Enter quantity to sell:"));
  const sellPrice = parseFloat(prompt("Enter sell price per coin:"));

  if (isNaN(sellQty) || isNaN(sellPrice) || sellQty <= 0 || sellQty > asset.quantity) {
    alert("Invalid input.");
    return;
  }

  asset.quantity -= sellQty;
  asset.marketValue = asset.quantity * sellPrice;

  if (asset.quantity === 0) {
    data.splice(index, 1);
  } else {
    data[index] = asset;
  }

  localStorage.setItem('portfolio', JSON.stringify(data));
  logSell(asset.coin, sellQty, sellPrice);
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
