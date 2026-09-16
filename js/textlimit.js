document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.checkbox p').forEach(p => {
        p.addEventListener('click', () => {
            const checkbox = p.parentElement.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = !checkbox.checked;
        });
    });

    document.querySelectorAll('.input_box').forEach(box => {
        const textarea = box.querySelector('textarea');
        const countSpan = box.querySelector('.text500 span, p span');
        if (textarea && countSpan) {
            textarea.addEventListener('input', () => {
                countSpan.textContent = textarea.value.length;
            });
        }
    });
});