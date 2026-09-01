document.addEventListener('DOMContentLoaded', function () {
  const panels = document.querySelectorAll('[data-tabName]');
  const triggers = document.querySelectorAll('[data-target]');

  function showTab(tabName) {
    panels.forEach(function (panel) {
      if (panel.getAttribute('data-tabName') === tabName) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const target = trigger.getAttribute('data-target');
      showTab(target);
    });
  });
});