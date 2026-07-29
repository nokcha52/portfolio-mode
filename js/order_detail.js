document.addEventListener('DOMContentLoaded', () => {
    function setTextAll(className, text) {
        document.querySelectorAll('.' + className).forEach(el => {
            el.textContent = text;
        });
    }
    function getCleanText(el) {
        return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    }
    function extractPrice(article) {
        const priceEl = article.querySelector('.label-s');
        if (!priceEl) return 0;
        const match = priceEl.textContent.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    const KEYBOARD_PRICES = {
        encore: 299.00,
        sonnet: 289.00,
        sixtyfive: 270.00,
        envoy: 190.00,
        tempo: 215.00
    };

    const mainEl = document.querySelector('main');
    const keyboardType = mainEl ? mainEl.dataset.keyboard : '';
    const BASE_PRICE = KEYBOARD_PRICES[keyboardType] || 0;

    const selectedPrices = {
        pcb: 0,
        plate: 0,
        switch: 0,
        stabilizer: 0,
        keycap: 0
    };

    const selectedNames = {
        edition: '',
        pcb: '',
        plate: '',
        switch: '',
        stabilizer: '',
        keycap: ''
    };

    let selectedImage = '';
    let quantity = 1;

    function updateTotalPrice() {
        const partsSum = Object.values(selectedPrices).reduce((sum, p) => sum + p, 0);
        const total = (BASE_PRICE + partsSum) * quantity;
        setTextAll('total_price', `$${total.toFixed(2)}`);
    }

    const editionButtons = document.querySelectorAll('.edition_part .tab_btn');
    const editionImgConts = document.querySelectorAll('.edition_part .img_cont');

    function selectEdition(btn) {
        editionButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        editionImgConts.forEach(cont => {
            cont.style.display = (cont.dataset.category === category) ? 'flex' : 'none';
        });

        setTextAll('edit_click', getCleanText(btn));
        selectedNames.edition = getCleanText(btn);

        const activeImgCont = document.querySelector(`.img_cont[data-category="${category}"]`);
        const firstImg = activeImgCont ? activeImgCont.querySelector('img') : null;
        selectedImage = firstImg ? firstImg.src : '';
    }

    editionButtons.forEach(btn => {
        btn.addEventListener('click', () => selectEdition(btn));
    });

    if (editionButtons.length) {
        selectEdition(editionButtons[0]);
    }

    const sectionConfigs = [
        { selector: '.pcb_part',        clickClass: 'pcb_click',    key: 'pcb' },
        { selector: '.plate_part',      clickClass: 'plate_click',  key: 'plate' },
        { selector: '.switch_part',     clickClass: 'switch_click', key: 'switch' },
        { selector: '.stabilizer_part', clickClass: 'stab_click',   key: 'stabilizer' },
        { selector: '.keycap_part',     clickClass: 'keycap_click', key: 'keycap' },
    ];

    sectionConfigs.forEach(({ selector, clickClass, key }) => {
        const section = document.querySelector(selector);
        if (!section) return;

        const cards = section.querySelectorAll('article.card_slot');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const name = getCleanText(card.querySelector('.title4'));
                const price = extractPrice(card);

                selectedPrices[key] = price;
                selectedNames[key] = name;

                setTextAll(clickClass, name);
                updateTotalPrice();
            });
        });
    });

    const minusButtons = document.querySelectorAll('.minus_btn');
    const plusButtons = document.querySelectorAll('.plus_btn');

    function updateQuantityDisplay() {
        setTextAll('count_cont', quantity);
        minusButtons.forEach(btn => {
            btn.disabled = quantity <= 1;
        });
    }

    minusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                updateQuantityDisplay();
                updateTotalPrice();
            }
        });
    });

    plusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            quantity++;
            updateQuantityDisplay();
            updateTotalPrice();
        });
    });

    const addToCartButtons = document.querySelectorAll('[data-category="addtocart"]');

    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const unitPrice = BASE_PRICE + Object.values(selectedPrices).reduce((sum, p) => sum + p, 0);

            const cartItem = {
                id: Date.now(),
                name: keyboardType.charAt(0).toUpperCase() + keyboardType.slice(1),
                options: { ...selectedNames },
                price: parseFloat(unitPrice.toFixed(2)),
                qty: quantity,
                image: selectedImage
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });

    updateQuantityDisplay();
    updateTotalPrice();
});