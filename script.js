/* script.js
 * Este arquivo fornece a lógica de interação para a vendinha.
 */

// Lista de produtos. Cada produto tem id, nome, preço e caminho da imagem.
const products = [
  { id: 1,  name: 'Bola',                    price: 50.00, image: 'assets/1.png' },
  { id: 2,  name: 'Boné',                    price: 30.00, image: 'assets/2.png' },
  { id: 3,  name: 'Caderno',                 price: 15.00, image: 'assets/3.png' },
  { id: 4,  name: 'Camiseta',                price: 40.00, image: 'assets/4.png' },
  { id: 5,  name: 'Canetinhas',              price: 20.00, image: 'assets/5.png' },
  { id: 6,  name: 'Carrinho de controle remoto', price: 120.00, image: 'assets/6.png' },
  { id: 7,  name: 'Celular',                 price: 1500.00, image: 'assets/7.png' },
  { id: 8,  name: 'Escova de dentes',        price: 5.00, image: 'assets/8.png' },
  { id: 9,  name: 'Mochila',                 price: 80.00, image: 'assets/9.png' },
  { id: 10, name: 'Pendrive',                price: 25.00, image: 'assets/10.png' },
  { id: 11, name: 'Perfume',                 price: 90.00, image: 'assets/11.png' },
  { id: 12, name: 'Presilhas e Pulseira',    price: 20.00, image: 'assets/12.png' },
  { id: 13, name: 'Skate',                   price: 200.00, image: 'assets/13.png' },
  { id: 14, name: 'Tênis',                   price: 150.00, image: 'assets/14.png' },
  { id: 15, name: 'Ursinho de pelúcia',      price: 35.00, image: 'assets/15.png' },
  { id: 16, name: 'Arroz 5kg',               price: 25.00, image: 'assets/16.png' },
  { id: 17, name: 'Banana (cacho)',          price: 5.00, image: 'assets/17.png' },
  { id: 18, name: 'Carne',                   price: 30.00, image: 'assets/18.png' },
  { id: 19, name: 'Feijão 1kg',              price: 8.00, image: 'assets/19.png' },
  { id: 20, name: '1 litro de leite',        price: 6.00, image: 'assets/20.png' },
  { id: 21, name: 'Pacote de balas',         price: 3.00, image: 'assets/21.png' },
  { id: 22, name: 'Pão 750g',                price: 7.00, image: 'assets/22.png' },
  { id: 23, name: 'Sorvete',                 price: 10.00, image: 'assets/23.png' },
  { id: 24, name: 'Caixa de suco 1L',        price: 4.00, image: 'assets/24.png' },
  { id: 25, name: 'Tomate',                  price: 8.00, image: 'assets/25.png' }
];

// Estado do carrinho: um mapa de id de produto para quantidade.
const cart = {};

// Seleciona elementos do DOM que serão atualizados.
const productGridEl   = document.getElementById('product-grid');
const cartItemsEl     = document.getElementById('cart-items');
const cartTotalEl     = document.getElementById('cart-total');
const checkoutBtnEl   = document.getElementById('checkout-btn');
const receiptModalEl  = document.getElementById('receipt-modal');
const receiptTableBody= document.querySelector('#receipt-table tbody');
const receiptDateEl   = document.getElementById('receipt-date');
const receiptTotalEl  = document.getElementById('receipt-total');
const printBtnEl      = document.getElementById('print-btn');
const closeReceiptBtnEl = document.getElementById('close-receipt-btn');

// Formata números como moeda brasileira (R$).
const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Carrega os produtos na grade de produtos.
function loadProducts() {
  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    const info = document.createElement('div');
    info.className = 'product-info';

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.textContent = formatCurrency(product.price);

    const btn = document.createElement('button');
    btn.textContent = 'Adicionar ao carrinho';
    btn.addEventListener('click', () => addToCart(product.id));

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(btn);
    card.appendChild(img);
    card.appendChild(info);
    productGridEl.appendChild(card);
  });
}

// Adiciona um item ao carrinho.
function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  updateCartUI();
}

// Remove ou diminui quantidade de um item do carrinho.
function changeCartQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] <= 0) {
    delete cart[productId];
  }
  updateCartUI();
}

// Atualiza a interface do carrinho.
function updateCartUI() {
  // Limpa lista.
  cartItemsEl.innerHTML = '';

  let total = 0;
  // Para cada item do carrinho, cria elemento de lista.
  Object.keys(cart).forEach((productId) => {
    const product = products.find(p => p.id === Number(productId));
    const qty = cart[productId];
    const subtotal = product.price * qty;
    total += subtotal;

    const li = document.createElement('li');
    // Nome do item
    const nameSpan = document.createElement('span');
    nameSpan.className = 'cart-item-name';
    nameSpan.textContent = product.name;

    // Controles de quantidade
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '–';
    minusBtn.className = 'qty-btn';
    minusBtn.addEventListener('click', () => changeCartQuantity(product.id, -1));

    const qtySpan = document.createElement('span');
    qtySpan.className = 'cart-item-qty';
    qtySpan.textContent = qty;

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.className = 'qty-btn';
    plusBtn.addEventListener('click', () => changeCartQuantity(product.id, 1));

    // Subtotal
    const priceSpan = document.createElement('span');
    priceSpan.className = 'cart-item-price';
    priceSpan.textContent = formatCurrency(subtotal);

    // Append children
    li.appendChild(nameSpan);
    li.appendChild(minusBtn);
    li.appendChild(qtySpan);
    li.appendChild(plusBtn);
    li.appendChild(priceSpan);

    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = formatCurrency(total);
  // Habilita botão de checkout se tiver itens.
  checkoutBtnEl.disabled = total === 0;
}

// Taxa de imposto utilizada na simulação (20% dos produtos). Este valor é apenas ilustrativo.
const taxRate = 0.20;

// Gera a nota fiscal e exibe modal.
function generateReceipt() {
  // Define data e hora da compra.
  const now = new Date();
  const formattedDate = now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  receiptDateEl.textContent = formattedDate;
  // Limpa tabela de itens anteriores.
  receiptTableBody.innerHTML = '';
  let totalPurchase = 0;
  let totalTaxes = 0;
  Object.keys(cart).forEach((productId) => {
    const product = products.find(p => p.id === Number(productId));
    const qty = cart[productId];
    const unitPrice = product.price;
    // Calcula imposto aproximado (assume preço final inclui imposto). Base = preço/(1+taxRate), imposto = preço - base.
    const basePrice = unitPrice / (1 + taxRate);
    const unitTax  = unitPrice - basePrice;
    const itemTax  = unitTax * qty;
    const itemTotal= unitPrice * qty;
    totalPurchase += itemTotal;
    totalTaxes += itemTax;
    const tr = document.createElement('tr');
    const tdName  = document.createElement('td');
    tdName.textContent = product.name;
    const tdQty   = document.createElement('td');
    tdQty.textContent = qty;
    const tdUnit  = document.createElement('td');
    tdUnit.textContent = formatCurrency(unitPrice);
    const tdTax   = document.createElement('td');
    tdTax.textContent = formatCurrency(itemTax);
    const tdTotal = document.createElement('td');
    tdTotal.textContent = formatCurrency(itemTotal);
    tr.appendChild(tdName);
    tr.appendChild(tdQty);
    tr.appendChild(tdUnit);
    tr.appendChild(tdTax);
    tr.appendChild(tdTotal);
    receiptTableBody.appendChild(tr);
  });
  // Atualiza totais na nota fiscal.
  const receiptTaxesEl = document.getElementById('receipt-taxes');
  receiptTaxesEl.textContent = formatCurrency(totalTaxes);
  receiptTotalEl.textContent = formatCurrency(totalPurchase);
  receiptModalEl.classList.remove('hidden');
}

// Imprime a nota fiscal em uma nova janela com diagramação semelhante à de uma nota real.
function printReceipt() {
  const dateStr = receiptDateEl.textContent;
  // Clona os dados do carrinho para não depender de estado externo durante a impressão
  const cartSnapshot = JSON.parse(JSON.stringify(cart));
  // Cria janela
  const printWindow = window.open('', '', 'width=800,height=800');
  const styles = `
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1, h2, h3 { text-align: center; margin: 0; }
    .header-info { margin-bottom: 1rem; }
    .header-info p { margin: 0.1rem 0; font-size: 0.9rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.85rem; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background-color: #f0f8ff; }
    tfoot td { font-weight: bold; }
    .disclaimer { margin-top: 1rem; font-size: 0.8rem; font-style: italic; color: #555; text-align: center; }
    .qr-code { display:block; margin:1rem auto; }
  `;
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Nota Fiscal</title><style>${styles}</style></head><body>`;
  // Cabeçalho da nota
  html += '<h1>Vendinha do Fisco</h1>';
  html += '<div class="header-info">';
  html += '<p>CNPJ: 00.000.000/0001-00</p>';
  html += '<p>Endereço: Rua Exemplo, 123 - São Paulo/SP</p>';
  html += `<p>Data/hora da emissão: ${dateStr}</p>`;
  html += '<p>Cliente: Consumidor Final</p>';
  html += '</div>';
  // Tabela de produtos
  html += '<table><thead><tr><th>Produto</th><th>Qtd</th><th>Vlr Unit.</th><th>Impostos</th><th>Total</th></tr></thead><tbody>';
  let totalPurchase = 0;
  let totalTaxes = 0;
  Object.keys(cartSnapshot).forEach((productId) => {
    const product = products.find(p => p.id === Number(productId));
    const qty = cartSnapshot[productId];
    const unitPrice = product.price;
    const basePrice = unitPrice / (1 + taxRate);
    const unitTax = unitPrice - basePrice;
    const itemTax = unitTax * qty;
    const itemTotal = unitPrice * qty;
    totalPurchase += itemTotal;
    totalTaxes += itemTax;
    html += `<tr><td>${product.name}</td><td>${qty}</td><td>${formatCurrency(unitPrice)}</td><td>${formatCurrency(itemTax)}</td><td>${formatCurrency(itemTotal)}</td></tr>`;
  });
  html += '</tbody>';
  html += `<tfoot><tr><td colspan="4">Total de impostos</td><td>${formatCurrency(totalTaxes)}</td></tr>`;
  html += `<tr><td colspan="4">Total da compra</td><td>${formatCurrency(totalPurchase)}</td></tr></tfoot></table>`;
  const qrLink = encodeURIComponent('https://www.educacaofiscal.pr.gov.br/');
  html += `<img class="qr-code" src="https://chart.googleapis.com/chart?chs=120x120&cht=qr&chl=${qrLink}" alt="QR Code da Educação Fiscal do Paraná">`;
  html += '<p class="disclaimer">Este documento não tem valor fiscal e foi gerado com um simulador educacional.</p>';
  html += '</body></html>';
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}

// Esconde o modal da nota fiscal e limpa o carrinho.
function closeReceipt() {
  receiptModalEl.classList.add('hidden');
  // Após imprimir/fechar, esvaziar carrinho.
  Object.keys(cart).forEach((key) => delete cart[key]);
  updateCartUI();
}

// Configura event listeners
checkoutBtnEl.addEventListener('click', generateReceipt);
printBtnEl.addEventListener('click', printReceipt);
closeReceiptBtnEl.addEventListener('click', closeReceipt);

// Carrega grade de produtos ao iniciar
loadProducts();
// Atualiza carrinho inicialmente (vazio)
updateCartUI();
