const clientInput = document.getElementById('clientName');
const addClientBtn = document.getElementById('addClientBtn');
const clientsDiv = document.getElementById('clients');

let clients = JSON.parse(localStorage.getItem('clients')) || [];

function save() {
  localStorage.setItem('clients', JSON.stringify(clients));
  render();
}

addClientBtn.onclick = () => {
  const name = clientInput.value.trim();
  if (!name) return;
  clients.push({ name, products: [] });
  clientInput.value = '';
  save();
};

function removeClient(i) {
  clients.splice(i, 1);
  save();
}

function addProduct(i) {
  const name = prompt('Nombre del producto (ej: Taco al Pastor)');
  const price = parseFloat(prompt('Precio por unidad $'));
  const qty = parseInt(prompt('Cantidad'), 10);
  if (name && !isNaN(price) && !isNaN(qty)) {
    clients[i].products.push({ name, price, qty });
    save();
  }
}

function editProduct(ci, pi) {
  const product = clients[ci].products[pi];
  const name = prompt('Nuevo nombre del producto:', product.name) || product.name;
  const price = parseFloat(prompt('Nuevo precio por unidad $:', product.price)) || product.price;
  const qty = parseInt(prompt('Nueva cantidad:', product.qty), 10) || product.qty;
  if (!isNaN(price) && !isNaN(qty)) {
    clients[ci].products[pi] = { name, price, qty };
    save();
  }
}

function removeProduct(ci, pi) {
  clients[ci].products.splice(pi, 1);
  save();
}

function totalProducts(products) {
  return products.reduce((s, p) => s + p.price * p.qty, 0).toFixed(2);
}

function render() {
  clientsDiv.innerHTML = '';
  clients.forEach((client, ci) => {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.innerHTML = `
      <div class="client-header">
        <span>${client.name}</span>
        <button onclick="removeClient(${ci})">X</button>
      </div>
      <div class="products">
        ${client.products.map((p, pi) =>
          `<div class="product-item">
             <span>${p.qty} × ${p.name} — $${(p.price * p.qty).toFixed(2)}</span>
             <button onclick="editProduct(${ci}, ${pi})">✏️</button>
             <button onclick="removeProduct(${ci}, ${pi})">🗑️</button>
           </div>`
        ).join('')}
        <button onclick="addProduct(${ci})">+ Agregar producto</button>
      </div>
      <div class="total">Total: $${totalProducts(client.products)}</div>
    `;
    clientsDiv.appendChild(card);
  });
}

window.removeClient = removeClient;
window.addProduct = addProduct;
window.editProduct = editProduct;
window.removeProduct = removeProduct;

render();
