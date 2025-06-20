// Gallery Data
const galleryData = [
  {
    id: 1,
    title: "Corporate Identity Refresh",
    desc: "A bold branding transformation for a global fintech leader. Vibrant, modern, and trustworthy.",
    price: 800,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Luxury Product Brochure",
    desc: "Elegant layouts and typography for a luxury watch brand. Turned heads at international expos.",
    price: 600,
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Event Poster Series",
    desc: "Vibrant, eye-catching posters for a cultural festival. Increased attendance by 40%.",
    price: 250,
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Tech Startup Logo",
    desc: "Minimal, futuristic logo for a blockchain startup. Instantly recognizable and scalable.",
    price: 400,
    img: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "App UI Design",
    desc: "Intuitive, clean interfaces for a mobile banking app. Users loved the experience!",
    price: 1200,
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80"
  }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart-pixelcraft')) || [];

// --- UTILITIES TO UPDATE BOTH CART COUNTERS ---
function updateCartCount() {
  const desktop = document.getElementById('cart-count');
  const mobile = document.getElementById('cart-count-mobile');
  if (desktop) desktop.textContent = cart.length;
  if (mobile) mobile.textContent = cart.length;
}

// Render Gallery
function renderGallery() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.innerHTML = '';
  galleryData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img class="gallery-img" src="${item.img}" alt="${item.title}">
      <div class="gallery-desc">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <span class="gallery-price">$${item.price}</span>
      </div>
      <div class="gallery-actions">
        <button class="btn primary add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
      </div>
    `;
    gallery.appendChild(div);
  });
  // Add event listeners after rendering
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      addToCartFromGallery(parseInt(this.getAttribute('data-id')));
    });
  });
}

function addToCartFromGallery(id) {
  const item = galleryData.find(g => g.id === id);
  cart.push({ ...item });
  localStorage.setItem('cart-pixelcraft', JSON.stringify(cart));
  updateCartCount();
  showCartBrief();
  // Only update cart UI if cart section is visible
  const cartSection = document.getElementById('cart');
  if (cartSection && cartSection.style.display !== 'none' && cartSection.style.display !== '') {
    renderCart();
  }
}

function removeCartItem(idx) {
  cart.splice(idx, 1);
  localStorage.setItem('cart-pixelcraft', JSON.stringify(cart));
  updateCartCount();

  const cartSection = document.getElementById('cart');
  if (cartSection && cartSection.style.display !== 'none' && cartSection.style.display !== '') {
    renderCart();
  }
}

function renderCart() {
  const cartSection = document.getElementById('cart');
  const cartItems = document.getElementById('cart-items');
  if (!cartItems || !cartSection) return;

  // Clear any empty-cart warning
  const cartWarning = document.getElementById('cart-warning');
  if (cartWarning) cartWarning.textContent = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    const actions = document.getElementById('cart-actions');
    if (actions) actions.style.display = 'none';
    return;
  }
  const actions = document.getElementById('cart-actions');
  if (actions) actions.style.display = 'flex';
  let html = '';
  cart.forEach((item, idx) => {
    html += `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-desc">${item.userdesc ? item.userdesc : item.desc}</div>
        </div>
        <div class="cart-item-price">$${item.price}</div>
        <button class="cart-item-remove" data-idx="${idx}" title="Remove item">&times;</button>
      </div>
    `;
  });
  cartItems.innerHTML = html;
  // Attach remove handlers
  cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      removeCartItem(parseInt(this.getAttribute('data-idx')));
    });
  });
}

// --- INIT ON DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
  // Hide cart section by default, show order section
  const cartSection = document.getElementById('cart');
  const orderSection = document.getElementById('order');
  if (cartSection) cartSection.style.display = 'none';
  if (orderSection) orderSection.style.display = '';

  // Add warning message area if not present
  let cartWarning = document.getElementById('cart-warning');
  if (!cartWarning) {
    cartWarning = document.createElement('div');
    cartWarning.id = 'cart-warning';
    cartWarning.style.color = 'red';
    cartWarning.style.margin = '8px 0';
    // Insert above cart-items
    if (cartSection) {
      cartSection.insertBefore(cartWarning, document.getElementById('cart-items'));
    }
  }

  // MOBILE NAVIGATION TOGGLE
  const nav = document.querySelector('header nav');
  const toggle = document.querySelector('.mobile-nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Optional: Close nav when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    // Optional: Close nav when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Cart buttons (desktop and mobile)
  function showCartNav(e) {
    if (e) e.preventDefault();
    const cartSection = document.getElementById('cart');
    const orderSection = document.getElementById('order');
    if (cartSection) {
      cartSection.style.display = 'block';
      cartSection.scrollIntoView({behavior: 'smooth'});
      renderCart();
    }
    if (orderSection) orderSection.style.display = 'none';
  }
  const cartLink = document.getElementById('cart-link');
  const cartLinkMobile = document.getElementById('cart-link-mobile');
  if (cartLink) cartLink.addEventListener('click', showCartNav);
  if (cartLinkMobile) cartLinkMobile.addEventListener('click', showCartNav);

  // Continue Shopping button
  const continueShopping = document.getElementById('continue-shopping');
  if (continueShopping) {
    continueShopping.addEventListener('click', function() {
      const cartSection = document.getElementById('cart');
      const orderSection = document.getElementById('order');
      if (cartSection) cartSection.style.display = 'none';
      if (orderSection) orderSection.style.display = '';
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        window.scrollTo({top: gallerySection.offsetTop, behavior: 'smooth'});
      }
    });
  }

  // Checkout: Only allow if cart is not empty, else show warning
  const checkoutBtn = document.getElementById('checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const cartWarning = document.getElementById('cart-warning');
      if (cart.length === 0) {
        if (cartWarning) {
          cartWarning.textContent = 'You need at least one item in the cart to place an order.';
        }
        return;
      }
      // Show order form and hide cart
      const cartSection = document.getElementById('cart');
      const orderSection = document.getElementById('order');
      if (cartSection) cartSection.style.display = 'none';
      if (orderSection) {
        orderSection.style.display = 'block';
        orderSection.scrollIntoView({behavior: 'smooth'});
      }
    });
  }

  // Order Form logic: Only allow submission if cart is not empty, and show order-warning in order section
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
      // Prevent submission if cart is empty
      if (cart.length === 0) {
        e.preventDefault();
        // Show the warning in the order section, above the form
        let orderWarning = document.getElementById('order-warning');
        if (!orderWarning) {
          orderWarning = document.createElement('div');
          orderWarning.id = 'order-warning';
          orderWarning.style.color = 'red';
          orderWarning.style.margin = '8px 0';
          const orderSection = document.getElementById('order');
          if (orderSection) {
            orderSection.insertBefore(orderWarning, orderForm);
          }
        }
        orderWarning.textContent = 'You need at least one item in the cart to place an order.';
        return;
      } else {
        // Remove previous warning if present
        const orderWarning = document.getElementById('order-warning');
        if (orderWarning) orderWarning.textContent = '';
      }

      // Proceed as usual if cart is not empty
      e.preventDefault();
      const name = document.getElementById('order-name').value.trim();
      const desc = document.getElementById('order-desc').value.trim();
      const email = document.getElementById('order-email').value.trim();
      if (!name || !desc || !email) return;

      // Hide cart, show order section (where the message will display)
      const cartSection = document.getElementById('cart');
      const orderSection = document.getElementById('order');
      if (cartSection) cartSection.style.display = 'none';
      if (orderSection) orderSection.style.display = 'block';

      // Show message
      document.getElementById('order-success').textContent = 'Order placed successfully! Our team will get in touch soon.';

      // Reset form fields
      orderForm.reset();

      // Clear cart after message timeout so you see the message first
      setTimeout(() => {
        document.getElementById('order-success').textContent = '';
        cart = [];
        localStorage.removeItem('cart-pixelcraft');
        updateCartCount();
        // Only update cart UI if cart section is visible
        const cartSection = document.getElementById('cart');
        if (cartSection && cartSection.style.display !== 'none' && cartSection.style.display !== '') {
          renderCart();
        }
      }, 3200);
    });
  }

  // Smooth scroll for nav and hide cart/order as needed
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // Hide cart and show order if needed
        const cartSection = document.getElementById('cart');
        const orderSection = document.getElementById('order');
        if (this.getAttribute('href') !== '#cart') {
          if (cartSection) cartSection.style.display = 'none';
          if (orderSection) orderSection.style.display = '';
        }
        target.scrollIntoView({behavior: 'smooth'});
      }
    });
  });

  // Initial Render
  renderGallery();
  updateCartCount();
});

function showCartBrief() {
  const cartLink = document.getElementById('cart-link');
  const cartLinkMobile = document.getElementById('cart-link-mobile');
  if (cartLink) cartLink.classList.add('active');
  if (cartLinkMobile) cartLinkMobile.classList.add('active');
  setTimeout(() => {
    if (cartLink) cartLink.classList.remove('active');
    if (cartLinkMobile) cartLinkMobile.classList.remove('active');
  }, 700);
}