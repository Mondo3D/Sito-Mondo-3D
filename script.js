// ============================
// CARRELLO
// ============================

const cartSidebar = document.getElementById('cart-sidebar');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = [];

function toggleCart() {
    cartSidebar.classList.toggle('open');
}

function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Il carrello è vuoto.</p>';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            total += item.price;
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <div class="item-info">
                    ${item.name} - € ${item.price.toFixed(2)}
                </div>
                <button class="remove-btn">Rimuovi</button>
            `;
            itemEl.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromCart(item.id);
            });
            cartItemsContainer.appendChild(itemEl);
        });
        checkoutBtn.disabled = false;
    }

    cartCount.textContent = cart.length;
    cartTotal.textContent = `€ ${total.toFixed(2)}`;
}

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const card = e.target.closest('.product-card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        addToCart(id, name, price);
    });
});

// ============================
// SCROLL AUTOMATICO PRODOTTI
// ============================

const scrollWrapper = document.querySelector('.products-scroll-wrapper');
const scrollRange = document.getElementById('products-scroll-range');
let scrollSpeed = 1;
let scrollInterval;

function startAutoScroll() {
    scrollInterval = requestAnimationFrame(autoScroll);
}

function autoScroll() {
    if (scrollWrapper.scrollWidth > scrollWrapper.clientWidth) {
        scrollWrapper.scrollLeft += scrollSpeed;
        if (scrollWrapper.scrollLeft >= scrollWrapper.scrollWidth - scrollWrapper.clientWidth) {
            scrollWrapper.scrollLeft = 0;
        }
        updateSlider();
    }
    scrollInterval = requestAnimationFrame(autoScroll);
}

function updateSlider() {
    const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
    const percentage = (scrollWrapper.scrollLeft / maxScroll) * 100;
    scrollRange.value = percentage;
}

scrollWrapper.addEventListener('mouseenter', () => cancelAnimationFrame(scrollInterval));
scrollWrapper.addEventListener('mouseleave', startAutoScroll);

scrollRange.addEventListener('input', () => {
    const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
    scrollWrapper.scrollLeft = (scrollRange.value / 100) * maxScroll;
});

startAutoScroll();

// ============================
// CAROSELLO IMMAGINI
// ============================

let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slider .slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    slides.forEach((slide, i) => {
        slide.style.display = i === slideIndex ? 'block' : 'none';
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === slideIndex);
    });
}

function plusSlides(n) {
    slideIndex += n;
    showSlide(slideIndex);
}

function currentSlide(n) {
    slideIndex = n - 1;
    showSlide(slideIndex);
}

showSlide(slideIndex);
