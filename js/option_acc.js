document.addEventListener('DOMContentLoaded', function() {
  const options = document.querySelectorAll('.option');

  options.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');

      options.forEach(o => {
        const isTarget = o.getAttribute('data-target') === target;
        o.classList.toggle('active', isTarget);

        const panel = document.getElementById('panel_' + o.getAttribute('data-target'));
        panel.classList.toggle('open', isTarget);
      });
    });
  });
});