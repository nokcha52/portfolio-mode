document.addEventListener('DOMContentLoaded', () => {
    if (window.__checkoutPageInitialized) return;
    window.__checkoutPageInitialized = true; 
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const orderListWrap = document.querySelector('.right_side .cart_item').parentElement;
    const itemTemplate = orderListWrap.querySelector('.cart_item');
    const templateHtml = itemTemplate.outerHTML;
    itemTemplate.remove();
    
    function renderOrder() {
        orderListWrap.querySelectorAll('.cart_item').forEach(el => el.remove());

        if (cart.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'body-m';
            empty.textContent = 'Your cart is empty.';
            orderListWrap.appendChild(empty);
            return;
        }

        cart.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = templateHtml;
            const article = wrapper.firstElementChild;

            article.dataset.id = item.id;

            const img = article.querySelector('.cart_item_img img');
            img.src = item.image;
            img.alt = item.name;

            article.querySelector('.cart_item_name').textContent = item.name;

            const optionsText = Object.values(item.options || {}).filter(Boolean).join(' / ');
            const qtyText = item.qty > 1 ? ` (x${item.qty})` : '';
            article.querySelector('.cart_item_options').textContent = optionsText + qtyText;

            article.querySelector('.cart_item_price').textContent = `$${(item.price * item.qty).toFixed(2)}`;

            orderListWrap.appendChild(article);
        });
    }
    let shippingPrice = 0;
    let discountRate = 0;

    const VALID_COUPONS = {
        'MODE10': 0.1,
        'MODE20': 0.2
    };

    function calcSubtotal() {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function updateSummary() {
        const subtotal = calcSubtotal();
        const discountAmount = subtotal * discountRate;
        const total = Math.max(subtotal - discountAmount + shippingPrice, 0);

        document.querySelector('.sub_price').textContent = `$${subtotal.toFixed(2)}`;

        const discPriceEl = document.querySelector('.disc_price');
        const couponAppliedEl = document.querySelector('.coupon_applied');
        discPriceEl.textContent = discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : '$0.00';
        if (couponAppliedEl) couponAppliedEl.parentElement.style.display = discountAmount > 0 ? 'block' : 'none';

        document.querySelector('.shipping_price').textContent = shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`;
        document.querySelector('.total_price').textContent = `$${total.toFixed(2)}`;

        const gpayTotal = document.querySelector('#gpay_overlay .label-l');
        if (gpayTotal) gpayTotal.textContent = `$${total.toFixed(2)}`;
    }

    
    const shippingRows = document.querySelectorAll('.shipping_price_cont .radio_row');
    shippingRows.forEach(row => {
        const radio = row.querySelector('input[type="radio"]');
        radio.addEventListener('change', () => {
            shippingPrice = parseFloat(row.dataset.price) || 0;
            updateSummary();
        });
    });
    
    const discountInput = document.querySelector('.discount_input_area input');
    const applyBtn = document.querySelector('.discount_input_area .apply_btn');

    applyBtn.addEventListener('click', () => {
        const code = discountInput.value.trim().toUpperCase();

        if (VALID_COUPONS[code]) {
            discountRate = VALID_COUPONS[code];
            showToast('Coupon applied.');
        } else {
            discountRate = 0;
            showToast('Invalid coupon code.');
        }
        updateSummary();
    });
    
    const toastEl = document.getElementById('toast');
    let toastTimer;

    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
    }

    const modalBackdrop = document.getElementById('modal_backdrop');
    const gpayOverlay = document.getElementById('gpay_overlay');
    const gpayOpenBtn = document.querySelector('.left_side section:first-of-type button');
    const gpayCloseBtn = gpayOverlay ? gpayOverlay.querySelector('.head_cont img') : null;

    function openGpayModal() {
        if (!gpayOverlay || !modalBackdrop) return;
        modalBackdrop.hidden = false;
        gpayOverlay.hidden = false;
    }

    function closeGpayModal() {
        if (!gpayOverlay || !modalBackdrop) return;
        modalBackdrop.hidden = true;
        gpayOverlay.hidden = true;
    }

    if (gpayOpenBtn) gpayOpenBtn.addEventListener('click', openGpayModal);
    if (gpayCloseBtn) gpayCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeGpayModal();
    });

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeGpayModal();
        });
    }

    if (gpayOverlay) {
        const gpayPayBtn = gpayOverlay.querySelector('.btn_blue');
        if (gpayPayBtn) {
            gpayPayBtn.addEventListener('click', () => {
                closeGpayModal();
                showToast('Payment completed.');
            });
        }
    }

    // ---------------------------------------------------
    // 8. 일반 결제 버튼 (하단 Pay now)
    // ---------------------------------------------------
    const payNowBtn = document.querySelector('.right_side .btn_blue');
    if (payNowBtn) {
        payNowBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty.');
                return;
            }
            showToast('Payment completed.');
        });
    }

    // ---------------------------------------------------
    // 초기 실행
    // ---------------------------------------------------
    renderOrder();
    updateSummary();
});