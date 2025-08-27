// ====== CONFIG ======
const TAX_RATE = 0.20; // 20% educativo
const QR_SRC = 'assets/qr-pr-educacao.png'; // imagem do QR

// ====== STATE ======
const productsSeed = [
  { id: 1, name: 'Bola',  price: 40.00, img: 'assets/1.png'  },
  { id: 2, name: 'Boné',price: 20.00, img: 'assets/2.png'  },
  { id: 3, name: 'Caderno',   price: 10.00, img: 'assets/3.png'  },
  { id: 4, name: 'Camiseta', price: 80.00, img: 'assets/4.png' },
  { id: 5, name: 'Canetinhas',    price: 10.00,  img: 'assets/05.png' },
  { id: 6, name: 'Carrinho de controle Remoto',     price: 50.00, img: 'assets/06.png' },
];
const cart = new Map(); // id -> { id, name, price, qty }

const els = {};
document.addEventListener('DOMContentLoaded', () => {
  // produtos
  els.products = document.getElementById('products');
  // desktop
  els.cartItems = document.getElementById('cart-items');
  els.cartTotal = document.getElementById('cart-total');
  els.checkoutBtn = document.getElementById('checkout-btn');
  // mobile bar
  els.mobileBar = document.getElementById('mobile-cart-bar');
  els.mobileOpen = document.getElementById('mobile-cart-open');
  els.mobileCount = document.getElementById('mobile-cart-count');
  els.mobileTotal = document.getElementById('mobile-cart-total');
  els.mobileCheckout = document.getElementById('mobile-checkout-btn');
  // drawer
  els.drawer = document.getElementById('drawer');
  els.drawerBackdrop = document.getElementById('drawer-backdrop');
  els.drawerClose = document.getElementById('drawer-close');
  els.cartItemsMobile = document.getElementById('cart-items-mobile');
  els.drawerTotal = document.getElementById('drawer-total');
  els.drawerCheckout = document.getElementById('drawer-checkout');
  // receipt
  els.receiptBackdrop = document.getElementById('receipt-backdrop');
  els.receiptModal = document.getElementById('receipt-modal');
  els.nfNumero = document.getElementById('nf-numero');
  els.nfData = document.getElementById('nf-data');
  els.nfItens = document.getElementById('nf-itens');
  els.nfBase = document.getElementById('nf-base');
  els.nfImpostos = document.getElementById('nf-impostos');
  els.nfTotal = document.getElementById('nf-total');
  els.nfQR = document.getElementById('nf-qr');
  els.nfPrint = document.getElementById('nf-print');
  els.nfClose = document.getElementById('nf-close');

  renderProducts();
  wireEvents();
  refreshUI();
});

function renderProducts() {
  els.products.innerHTML = '';
  productsSeed.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img" style="background-image:url('${p.img || ''}')"></div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <div class="price">R$ ${p.price.toFixed(2)}</div>
        <button data-id="${p.id}">Adicionar ao carrinho</button>
      </div>`;
    card.querySelector('button').addEventListener('click', () => addToCart(p));
    els.products.appendChild(card);
  });
}

function addToCart(p) {
  const item = cart.get(p.id) || { ...p, qty: 0 };
  item.qty += 1;
  cart.set(p.id, item);
  refreshUI(true);
}

function changeQty(id, delta) {
  const item = cart.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.delete(id);
  else cart.set(id, item);
  refreshUI();
}

function totals() {
  let base = 0;
  cart.forEach(i => {
    base += i.qty * i.price;
  });
  const impostos = base * TAX_RATE;
  const total = base;
  return { base, impostos, total };
}

function money(v) {
  return `R$ ${v.toFixed(2)}`;
}

function refreshUI(flashMobile = false) {
  // desktop cart
  els.cartItems.innerHTML = '';
  cart.forEach(i => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="cart-name">${i.name}</span>
      <div class="qty">
        <button class="qty-btn" aria-label="menos">-</button>
        <span>${i.qty}</span>
        <button class="qty-btn" aria-label="mais">+</button>
      </div>
      <strong>${money(i.qty * i.price)}</strong>
    `;
    const minusBtn = li.querySelectorAll('.qty-btn')[0];
    const plusBtn  = li.querySelectorAll('.qty-btn')[1];
    minusBtn.addEventListener('click', () => changeQty(i.id, -1));
    plusBtn.addEventListener('click', () => changeQty(i.id, +1));
    els.cartItems.appendChild(li);
  });

  // mobile cart
  els.cartItemsMobile.innerHTML = '';
  cart.forEach(i => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="cart-name">${i.name}</span>
      <div class="qty">
        <button class="qty-btn">-</button>
        <span>${i.qty}</span>
        <button class="qty-btn">+</button>
      </div>
      <strong>${money(i.qty * i.price)}</strong>
    `;
    const mMinusBtn = li.querySelectorAll('.qty-btn')[0];
    const mPlusBtn  = li.querySelectorAll('.qty-btn')[1];
    mMinusBtn.addEventListener('click', () => changeQty(i.id, -1));
    mPlusBtn.addEventListener('click', () => changeQty(i.id, +1));
    els.cartItemsMobile.appendChild(li);
  });

  // totals
  const t = totals();
  els.cartTotal.textContent = money(t.total);
  els.drawerTotal.textContent = money(t.total);

  // mobile bar
  let count = 0;
  cart.forEach(i => count += i.qty);
  els.mobileCount.textContent = count;
  els.mobileTotal.textContent = money(t.total);

  const hasItems = count > 0;
  els.checkoutBtn.disabled = !hasItems;
  els.mobileCheckout.disabled = !hasItems;
  els.drawerCheckout.disabled = !hasItems;

  // feedback na barra ao adicionar
  if (flashMobile) {
    els.mobileBar.classList.add('pulse');
    setTimeout(() => els.mobileBar.classList.remove('pulse'), 250);
  }
}

function wireEvents() {
  els.checkoutBtn.addEventListener('click', openReceipt);
  els.mobileCheckout.addEventListener('click', openReceipt);
  els.drawerCheckout.addEventListener('click', openReceipt);

  // drawer
  els.mobileOpen.addEventListener('click', openDrawer);
  els.drawerClose.addEventListener('click', closeDrawer);
  els.drawerBackdrop.addEventListener('click', closeDrawer);

  // nota
  els.nfPrint.addEventListener('click', () => window.print());
  els.nfClose.addEventListener('click', closeReceipt);
  els.receiptBackdrop.addEventListener('click', closeReceipt);
}

function openDrawer() {
  els.drawer.classList.add('open');
  els.drawer.setAttribute('aria-hidden', 'false');
  els.drawerBackdrop.hidden = false;
}

function closeDrawer() {
  els.drawer.classList.remove('open');
  els.drawer.setAttribute('aria-hidden', 'true');
  els.drawerBackdrop.hidden = true;
}

function openReceipt() {
  closeDrawer();
  // meta
  const now = new Date();
  els.nfNumero.textContent = String(Math.floor(100000 + Math.random() * 900000));
  els.nfData.textContent = now.toLocaleString('pt-BR');

  // tabela
  els.nfItens.innerHTML = '';
  let base = 0, impostos = 0;
  cart.forEach(i => {
    const subtotal = i.qty * i.price;
    const tax = subtotal * TAX_RATE;
    base += subtotal;
    impostos += tax;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i.name}</td>
      <td>${i.qty}</td>
      <td>${money(i.price)}</td>
      <td>${money(tax)}</td>
      <td>${money(subtotal)}</td>
    `;
    els.nfItens.appendChild(tr);
  });

  els.nfBase.textContent = money(base);
  els.nfImpostos.textContent = money(impostos);
  els.nfTotal.textContent = money(base);

  // QR fixo
  els.nfQR.src = QR_SRC;
  els.nfQR.onclick = () => {
    window.open('https://www.educacaofiscal.pr.gov.br/', '_blank');
  };

  // mostra modal
  els.receiptBackdrop.hidden = false;
  els.receiptModal.hidden = false;
}

function closeReceipt() {
  els.receiptBackdrop.hidden = true;
  els.receiptModal.hidden = true;
}
