class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.reduce((total, item) => total + item.quantity, 0);
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cartItems && cartTotal) {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    <div class="cart-item-controls">
                        <input type="number" value="${item.quantity}" min="1" 
                               onchange="cart.updateQuantity(${item.id}, parseInt(this.value))">
                        <button onclick="cart.removeItem(${item.id})" class="remove-btn">Remove</button>
                    </div>
                </div>
            `).join('');

            cartTotal.textContent = this.getTotal().toFixed(2);

            if (checkoutBtn) {
                checkoutBtn.style.display = this.items.length > 0 ? 'block' : 'none';
            }
        }
    }
}

const cart = new Cart();

document.addEventListener('DOMContentLoaded', function() {
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const productCard = this.closest('.product-card') || this.closest('.product-info');
            const product = {
                id: productId,
                name: productCard.querySelector('h3, h2').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('$', ''))
            };

            cart.addItem(product);

            // Show feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.disabled = true;

            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    });

    // Initialize cart display
    cart.updateCartDisplay();
});