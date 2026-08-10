document.addEventListener('click', function (e) {
    const btn = e.target.closest('.tab_btn_cont .tab_btn');
    if (!btn) return;

    const tabCont = btn.closest('.tab_btn_cont');
    const step = btn.dataset.step;

    tabCont.querySelectorAll('.tab_btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
    });

    const parent = tabCont.parentElement;
    parent.querySelectorAll(':scope > .tab_panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.step === step);
    });
});