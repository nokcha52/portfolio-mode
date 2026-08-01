document.addEventListener('DOMContentLoaded', () => {
    const rightTabBtns = document.querySelectorAll('.right_side .tab_cont button[data-righttab]');
    const figures = document.querySelectorAll('.img_cont > figure[data-righttab]');

    function showFigure(target) {
        figures.forEach(fig => {
            fig.style.display = (fig.dataset.righttab === target) ? '' : 'none';
        });
    }
    
    showFigure(rightTabBtns[0]?.dataset.righttab);

    rightTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rightTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showFigure(btn.dataset.righttab);
        });
    });
});
