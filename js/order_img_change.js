document.addEventListener('DOMContentLoaded', () => {
    const mainImg = document.querySelector('.mainImg');

    document.querySelectorAll('.product_card').forEach(card => {
        const tabButtons = card.querySelectorAll('.pack_tab_cont .tab_btn');
        const figImg = card.querySelector('.encore_fig img');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const imgSrc = btn.dataset.img;
                if (!imgSrc) return;

                if (figImg) figImg.src = imgSrc;
                if (mainImg) mainImg.src = imgSrc;

                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const priceSpan = card.querySelector('.price_span');
                if (priceSpan && btn.dataset.price) {
                    priceSpan.textContent = `$${btn.dataset.price}`;
                }
            });
        });
    });
});