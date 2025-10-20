/* ===================================== */
/* 🛒 LOGICA DEL CARRELLO */
/* ===================================== */

let cart = []; // Array che conterrà gli oggetti del carrello

// Ottenimento degli elementi DOM principali
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountBadge = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyCartMessage = cartItemsContainer.querySelector('.empty-cart-message');

/**
 * Funzione per aprire/chiudere il carrello laterale.
 */
function toggleCart() {
    cartSidebar.classList.toggle('open');
}

/**
 * Aggiorna il display del carrello laterale e il badge.
 */
function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''; // Svuota il contenuto precedente
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-message">Il carrello è vuoto.</p>`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        
        cart.forEach(item => {
            // Calcola il totale parziale
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Crea l'elemento HTML per il prodotto nel carrello
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-info">
                    <strong>${item.name}</strong> 
                    <p>${item.quantity} x € ${item.price.toFixed(2)}</p>
                </div>
                <span>€ ${itemTotal.toFixed(2)}</span>
                <button class="remove-btn" data-id="${item.id}">Rimuovi</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Aggiorna il totale e il badge
    cartTotalElement.textContent = `€ ${total.toFixed(2)}`;
    cartCountBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Aggiungi gli ascoltatori di eventi per i pulsanti "Rimuovi"
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            removeItemFromCart(productId);
        });
    });
}

/**
 * Aggiunge un prodotto al carrello o incrementa la quantità.
 * @param {string} id - ID del prodotto.
 * @param {string} name - Nome del prodotto.
 * @param {number} price - Prezzo del prodotto.
 */
function addItemToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCartDisplay();
    // Apri il carrello quando si aggiunge un prodotto
    if (!cartSidebar.classList.contains('open')) {
        toggleCart();
    }
}

/**
 * Rimuove un prodotto (o decrementa la quantità) dal carrello.
 * @param {string} id - ID del prodotto da rimuovere.
 */
function removeItemFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--; // Decrementa quantità
        } else {
            cart.splice(itemIndex, 1); // Rimuovi completamente se la quantità è 1
        }
    }

    updateCartDisplay();
}

/**
 * Funzione di Checkout (simulazione)
 */
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        alert(`Procedi al checkout! Totale da pagare: ${cartTotalElement.textContent}`);
        cart = []; // Svuota il carrello dopo il checkout simulato
        updateCartDisplay();
        toggleCart();
    } else {
        alert('Il carrello è vuoto!');
    }
});


// 🛒 Inizializzazione: Aggiungi gli ascoltatori di eventi ai pulsanti "Aggiungi al Carrello"
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Risale al div del prodotto per prendere i dati
            const productCard = e.target.closest('.product-card');
            const id = productCard.getAttribute('data-id');
            const name = productCard.getAttribute('data-name');
            // Nota: parseFloat è importante per i calcoli
            const price = parseFloat(productCard.getAttribute('data-price')); 
            
            addItemToCart(id, name, price);
        });
    });

    updateCartDisplay(); // Assicurati che il display sia aggiornato al caricamento
});

/* ===================================== */
/* 🖼️ LOGICA SLIDER/CAROUSEL AUTOMATICO */
/* ===================================== */

let slideIndex = 1;
let slideTimer; // Variabile per l'intervallo di scorrimento automatico

// Ottenimento degli elementi DOM per lo slider
const slides = document.getElementsByClassName("slide");
const dots = document.getElementsByClassName("dot");

/**
 * Mostra la slide specificata, gestendo il loop.
 * @param {number} n - L'indice della slide da mostrare (1-based).
 */
function showSlides(n) {
    let i;
    
    // Gestisce il loop: se si va oltre l'ultima, torna alla prima
    if (n > slides.length) {
        slideIndex = 1;
    }
    // Gestisce il loop: se si va prima della prima, torna all'ultima
    if (n < 1) {
        slideIndex = slides.length;
    }

    // Spostamento del carrello: calcola la posizione
    const sliderContainer = document.getElementById('image-slider');
    // Sposta il contenitore di (slideIndex - 1) * 100%
    sliderContainer.style.transform = `translateX(-${(slideIndex - 1) * 100}%)`;


    // Aggiorna gli indicatori (pallini)
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndex - 1].className += " active";
}

/**
 * Passa alla slide successiva/precedente.
 * @param {number} n - 1 per avanti, -1 per indietro.
 */
function plusSlides(n) {
    // Resetta il timer per evitare salti dopo un click manuale
    resetTimer(); 
    showSlides(slideIndex += n);
}

/**
 * Mostra una slide specifica cliccando sull'indicatore (dot).
 * @param {number} n - L'indice della slide da mostrare (1-based).
 */
function currentSlide(n) {
    // Resetta il timer per evitare salti dopo un click manuale
    resetTimer(); 
    showSlides(slideIndex = n);
}

/**
 * Fa scorrere automaticamente lo slider.
 */
function autoSlide() {
    slideIndex++;
    showSlides(slideIndex);
}

/**
 * Avvia il timer per lo scorrimento automatico.
 */
function startTimer() {
    // Scorrimento ogni 4 secondi (4000ms)
    slideTimer = setInterval(autoSlide, 4000); 
}

/**
 * Ferma e riavvia il timer.
 */
function resetTimer() {
    clearInterval(slideTimer);
    startTimer();
}

// 🖼️ Inizializzazione dello Slider
if (slides.length > 0) {
    showSlides(slideIndex); // Mostra la prima slide
    startTimer(); // Avvia lo scorrimento automatico
}
