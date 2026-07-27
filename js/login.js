document.addEventListener('DOMContentLoaded', () => {
    const tabPanels = document.querySelectorAll('main > div[data-tabname]');
    const tabButtons = document.querySelectorAll('main [data-tabname]');

    function showTab(targetName) {
        tabPanels.forEach(panel => {
            if (panel.dataset.tabname === targetName) {
                panel.style.display = 'flex';
            } else {
                panel.style.display = 'none';
            }
        });
    }

    tabButtons.forEach(btn => {
        if (btn.tagName === 'DIV') return;
        btn.addEventListener('click', () => {
            showTab(btn.dataset.tabname);
        });
    });

    tabPanels.forEach(panel => {
        panel.style.display = panel.hasAttribute('hidden') ? 'none' : 'flex';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');
    const loginBtn = document.querySelector('a[href="index.html"].btn_yellow');

    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Login successful!');

            setTimeout(() => {
                window.location.href = loginBtn.href;
            }, 1500);
        });
    }
});