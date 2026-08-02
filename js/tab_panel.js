document.addEventListener('DOMContentLoaded', () => {
    const tabContainers = document.querySelectorAll('.tab_cont');

    tabContainers.forEach(tabCont => {
        const tabButtons = tabCont.querySelectorAll('.tab_btn');
        if (!tabButtons.length) return;

        const parent = tabCont.parentElement;
        if (!parent) return;

        const categories = Array.from(tabButtons).map(btn => btn.dataset.category);

        const panels = Array.from(parent.children).filter(
            el => el !== tabCont && categories.includes(el.dataset.category)
        );
        if (!panels.length) return;

        function showPanel(category) {
            panels.forEach(panel => {
                panel.style.display = (panel.dataset.category === category) ? '' : 'none';
            });
        }

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showPanel(btn.dataset.category);
            });
        });

        const initialBtn = tabCont.querySelector('.tab_btn.active') || tabButtons[0];
        initialBtn.classList.add('active');
        showPanel(initialBtn.dataset.category);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.card_overflow, .mini_card');

    sliders.forEach((slider) => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing'; 
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return; 
            e.preventDefault(); 
            
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5; 
            slider.scrollLeft = scrollLeft - walk;
        });
        slider.style.cursor = 'grab';
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const packBtns = document.querySelectorAll('.pack_tab_cont .tab_btn'); 
    const priceSpans = document.querySelectorAll('.price_span');

    packBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            packBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const price = btn.dataset.price;
            priceSpans.forEach(span => {
                span.textContent = `$${price}`;
            });
        });
    });
});