document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.left_side ul li');
    const sections = document.querySelectorAll('.right_side section[id^="section_move"]');

    if (!navItems.length || !sections.length) return;

    let isClickScrolling = false;
    let scrollEndTimer = null;

    function setActive(targetId) {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.target === targetId);
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            isClickScrolling = true;
            setActive(targetId);

            targetSection.scrollIntoView({
                behavior: 'instant',
                block: 'start'
            });

            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                isClickScrolling = false;
            }, 150);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        if (isClickScrolling) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
});