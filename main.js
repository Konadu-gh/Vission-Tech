/**
 * EBEN & CO. – Shared JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // Search Overlay
  const searchBtn = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      searchOverlay.style.display = 'flex';
      setTimeout(() => searchInput?.focus(), 100);
    });
  }
  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      searchOverlay.style.display = 'none';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchOverlay) {
        searchOverlay.classList.remove('active');
        searchOverlay.style.display = 'none';
      }
      closeCart();
    }
  });

  // Cart Sidebar
  const cartBtn = document.getElementById('cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartClose = document.getElementById('cart-close');

  function openCart() {
    cartSidebar?.classList.add('open');
    cartOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartSidebar?.classList.remove('open');
    cartOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Cart Logic
  let cart = JSON.parse(localStorage.getItem('ebenCart') || '[]');

  function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const emptyEl = document.getElementById('cart-empty');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = totalItems;

    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      if (totalEl) totalEl.textContent = 'GHS 0.00';
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    itemsEl.innerHTML = cart.map((item, idx) => `
      <div class="flex gap-4 py-4 border-b border-gray-100">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg bg-gray-100">
        <div class="flex-1">
          <h4 class="font-medium text-sm text-gray-900">${item.name}</h4>
          <p class="text-xs text-gray-500 mt-0.5">GHS ${item.price.toFixed(2)}</p>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="updateQty(${idx}, -1)" class="w-6 h-6 rounded border text-xs flex items-center justify-center hover:bg-gray-100">−</button>
            <span class="text-sm w-6 text-center">${item.qty}</span>
            <button onclick="updateQty(${idx}, 1)" class="w-6 h-6 rounded border text-xs flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${idx})" class="text-gray-400 hover:text-red-500 self-start">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (totalEl) totalEl.textContent = `GHS ${total.toFixed(2)}`;
  }

  window.addToCart = function(name, price, image) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, image, qty: 1 });
    }
    localStorage.setItem('ebenCart', JSON.stringify(cart));
    updateCartUI();
    openCart();
  };

  window.updateQty = function(idx, delta) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    localStorage.setItem('ebenCart', JSON.stringify(cart));
    updateCartUI();
  };

  window.removeFromCart = function(idx) {
    cart.splice(idx, 1);
    localStorage.setItem('ebenCart', JSON.stringify(cart));
    updateCartUI();
  };

  updateCartUI();

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Shop Filters
  const filterBtns = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => {
        b.classList.remove('bg-eben-green-900', 'text-white');
        b.classList.add('bg-white', 'text-gray-700');
      });
      btn.classList.add('bg-eben-green-900', 'text-white');
      btn.classList.remove('bg-white', 'text-gray-700');

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Shop Search
  const shopSearch = document.getElementById('shop-search');
  if (shopSearch) {
    shopSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      productCards.forEach(card => {
        const name = card.dataset.name?.toLowerCase() || '';
        card.style.display = name.includes(query) ? '' : 'none';
      });
    });
  }

  // Active Nav
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
