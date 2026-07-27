document.addEventListener('DOMContentLoaded', () => {
  initPolicyModals();
  initCartModal();
});

let policyBackdrop = null;

function openPolicyModal(modal) {
  if (!modal) return;

  if (!policyBackdrop) {
    policyBackdrop = document.createElement('div');
    policyBackdrop.className = 'modal_backdrop';
    policyBackdrop.addEventListener('click', () => closePolicyModal(modal));
    document.body.appendChild(policyBackdrop);
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closePolicyModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  policyBackdrop?.remove();
  policyBackdrop = null;
  document.body.style.overflow = '';
}

function initPolicyModals() {
  document.querySelectorAll('.policy_cont button[data-policy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = `policy_${btn.dataset.policy}_overlay`;
      openPolicyModal(document.getElementById(targetId));
    });
  });
  document.querySelectorAll('.modal_overlay.policy').forEach((modal) => {
    modal.querySelector('.close_btn')?.addEventListener('click', () => closePolicyModal(modal));
  });
}

let cartBackdrop = null;

function openCartModal(modal) {
  if (!modal) return;

  if (!cartBackdrop) {
    cartBackdrop = document.createElement('div');
    cartBackdrop.className = 'modal_backdrop';
    cartBackdrop.addEventListener('click', () => closeCartModal(modal));
    document.body.appendChild(cartBackdrop);
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeCartModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  cartBackdrop?.remove();
  cartBackdrop = null;
  document.body.style.overflow = '';
}

function initCartModal() {
  document.querySelectorAll('button[data-category="addtocart"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector('.modal_overlay.cart[data-category="addtocart"]');
      openCartModal(modal);
    });
  });
  document.querySelectorAll('.modal_overlay.cart .btn_gray').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal_overlay.cart');
      closeCartModal(modal);
    });
  });
}