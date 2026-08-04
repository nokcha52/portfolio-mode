document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.left_side ul li');
    const sections = document.querySelectorAll('.right_side section[id^="section_move"]');

    if (!navItems.length || !sections.length) return;
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navItems.forEach(item => {
                    item.classList.toggle('active', item.dataset.target === id);
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
});