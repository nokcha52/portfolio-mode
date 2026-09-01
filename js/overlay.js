document.addEventListener('DOMContentLoaded', function () {
  const receiveBtn = document.getElementById('receive_btn');
  const receiveReq = document.querySelector('.receive_req');
  const overlay = document.getElementById('modal_overlay');

  if (!receiveBtn || !receiveReq) return;

  receiveBtn.addEventListener('click', function (e) {
    e.preventDefault();

    receiveReq.hidden = false;
    if (overlay) overlay.hidden = false;
  });

  if (overlay) {
    overlay.addEventListener('click', function () {
      receiveReq.hidden = true;
      overlay.hidden = true;
    });
  }
});