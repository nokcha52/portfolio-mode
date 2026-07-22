document.addEventListener('DOMContentLoaded', () => {
  initPolicyModals();
  initCartModal();
});

/* ============================================
   Policy 모달 (Refund / Privacy / Terms of Service)
============================================ */
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
  // 버튼 클릭 → data-policy 값으로 대상 모달 찾아서 열기
  document.querySelectorAll('.policy_cont button[data-policy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = `policy_${btn.dataset.policy}_overlay`;
      openPolicyModal(document.getElementById(targetId));
    });
  });

  // 각 정책 모달의 닫기(X) 버튼
  document.querySelectorAll('.modal_overlay.policy').forEach((modal) => {
    modal.querySelector('.close_btn')?.addEventListener('click', () => closePolicyModal(modal));
  });
}

/* ============================================
   Cart 모달 (Add to Cart)
============================================ */
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
  // "Add to cart" 버튼 → data-category 값으로 매칭되는 모달 열기
  document.querySelectorAll('button[data-category="addtocart"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector('.modal_overlay.cart[data-category="addtocart"]');
      openCartModal(modal);
    });
  });

  // "Continue Shopping" 버튼 → 모달 닫기
  document.querySelectorAll('.modal_overlay.cart .btn_gray').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal_overlay.cart');
      closeCartModal(modal);
    });
  });
}