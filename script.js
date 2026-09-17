document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "umgsellCart";
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const openCartButton = document.getElementById("openCart");
    const closeCartButton = document.getElementById("closeCart");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function formatPrice(price) {
        return new Intl.NumberFormat("uk-UA").format(price);
    }

    function renderCart() {
        if (!cartItems) {
            return;
        }

        if (cart.length === 0) {
            cartItems.innerHTML = `<p class="empty-cart">Кошик порожній</p>`;
        } else {
            cartItems.innerHTML = "";

            cart.forEach((item, index) => {
                const element = document.createElement("div");

                element.className = "cart-item";

                element.innerHTML = `
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>${formatPrice(item.price)} грн</p>
                    </div>
                    <button class="remove-item" data-index="${index}">Видалити</button>
                `;

                cartItems.appendChild(element);
            });
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);

        if (cartCount) {
            cartCount.textContent = cart.length;
        }

        if (cartTotal) {
            cartTotal.textContent = `${formatPrice(total)} грн`;
        }

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                cart.splice(index, 1);
                saveCart();
                renderCart();
            });
        });
    }

    function openCart() {
        if (!cartOverlay) {
            return;
        }

        cartOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeCart() {
        if (!cartOverlay) {
            return;
        }

        cartOverlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    function addToCart(name, price) {
        cart.push({
            name: name,
            price: Number(price)
        });

        saveCart();
        renderCart();
        openCart();
    }

    if (openCartButton) {
        openCartButton.addEventListener("click", openCart);
    }

    if (closeCartButton) {
        closeCartButton.addEventListener("click", closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener("click", event => {
            if (event.target === cartOverlay) {
                closeCart();
            }
        });
    }

    const addButtons = document.querySelectorAll(".add-button");

    addButtons.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            addToCart(name, price);

            const oldText = button.textContent;

            button.textContent = "Додано";

            setTimeout(() => {
                button.textContent = oldText;
            }, 1000);
        });
    });

    const checkoutButton = document.querySelector(".checkout-button");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Ваш кошик порожній");
                return;
            }

            alert("Дякуємо! Оформлення замовлення буде доступне найближчим часом");
        });
    }

    renderCart();
});