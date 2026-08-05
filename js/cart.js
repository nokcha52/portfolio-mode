document.addEventListener('DOMContentLoaded', () => {
    if (window.__cartPageInitialized) return;
    window.__cartPageInitialized = true;

    const cartListEl = document.getElementById('cart_list');
    const itemTemplate = cartListEl.querySelector('.cart_item');
    const templateHtml = itemTemplate.outerHTML;
    itemTemplate.remove();

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let shippingPrice = 0;

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartListEl.querySelectorAll('.cart_item').forEach(el => el.remove());

        cart.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = templateHtml;
            const article = wrapper.firstElementChild;

            article.dataset.id = item.id;

            const img = article.querySelector('.cart_item_img img');
            img.src = item.image;
            img.alt = item.name;

            article.querySelector('.cart_item_name').textContent = item.name;

            const optionsText = Object.values(item.options).filter(Boolean).join(' / ');
            article.querySelector('.cart_item_options').textContent = optionsText;

            article.querySelector('.cart_item_price').textContent = `$${(item.price * item.qty).toFixed(2)}`;
            article.querySelector('.cart_qty_num').textContent = item.qty;

            const minusBtn = article.querySelector('.cart_minus');
            const plusBtn = article.querySelector('.cart_plus');
            const removeBtn = article.querySelector('.cart_remove');

            minusBtn.disabled = item.qty <= 1;

            minusBtn.addEventListener('click', () => {
                if (item.qty > 1) {
                    item.qty--;
                    saveCart();
                    renderCart();
                    updateSummary();
                }
            });

            plusBtn.addEventListener('click', () => {
                item.qty++;
                saveCart();
                renderCart();
                updateSummary();
            });

            removeBtn.addEventListener('click', () => {
                cart = cart.filter(c => c.id !== item.id);
                saveCart();
                renderCart();
                updateSummary();
            });

            cartListEl.appendChild(article);
        });
    }

    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        document.querySelector('.sub_price').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.shipping_price').textContent = `$${shippingPrice.toFixed(2)}`;

        const total = subtotal + shippingPrice;
        document.querySelector('.total_price').textContent = `$${total.toFixed(2)}`;
    }

    const deliveryArticles = document.querySelectorAll('.delivery_opt > div > article');

    deliveryArticles.forEach(article => {
        article.addEventListener('click', () => {
            deliveryArticles.forEach(a => a.classList.remove('active'));
            article.classList.add('active');

            shippingPrice = parseFloat(article.dataset.price);

            updateSummary();
        });
    });

    const policyButtons = document.querySelectorAll('.policy_cont [data-policy]');
    const policyOverlays = document.querySelectorAll('.modal_overlay.policy');
    const modalBackdrop = document.getElementById('modal_backdrop');

    function openModal(overlay) {
        overlay.hidden = false;
        if (modalBackdrop) modalBackdrop.hidden = false;
    }

    function closeModal(overlay) {
        overlay.hidden = true;
        if (modalBackdrop) modalBackdrop.hidden = true;
    }

    policyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.policy;
            const overlay = document.getElementById(`policy_${type}_overlay`);
            if (overlay) {
                openModal(overlay);
            }
        });
    });

    policyOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });

        const closeBtn = overlay.querySelector('.close_btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal(overlay);
            });
        }
    });

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => {
            policyOverlays.forEach(overlay => {
                if (!overlay.hidden) {
                    closeModal(overlay);
                }
            });
        });
    }

    renderCart();
    updateSummary();
});