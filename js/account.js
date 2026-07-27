document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. 토스트 메시지 정의
    // ============================
    const TOAST_MESSAGES = {
        name_success: {
            type: 'success',
            title: 'Name updated',
            message: 'Name saved!'
        },
        name_fail: {
            type: 'fail',
            title: 'Name update failed',
            message: 'Changing "Name" Failed. please try again'
        },
        password_success: {
            type: 'success',
            title: 'Password updated',
            message: 'Your password has been changed successfully.\nYou can now use your new password to sign in.'
        },
        password_fail: {
            type: 'fail',
            title: 'Password update failed',
            message: 'Please make sure your new password meets the following requirements:\n\n• At least 8 characters long\n• Includes both letters and special characters\n• Different from your current password\n• New Password and Confirm Password must match\n\nPlease try again.'
        },
        email_success: {
            type: 'success',
            title: 'Email updated',
            message: 'Your email address has been updated successfully. Please use your new email address the next time you sign in.'
        },
        email_fail: {
            type: 'fail',
            title: 'Email update failed',
            message: 'We couldn\'t update your email. Please check your current password and try again.'
        },
        personal_data_success: {
            type: 'success',
            title: 'Success',
            message: 'Your personal data package has been sent to your email'
        }
    };

function showToast(key, duration = 3000) {
    const data = TOAST_MESSAGES[key];
    if (!data) {
        console.error(`Toast key "${key}" not found.`);
        return;
    }

    const toast = document.getElementById('toast');
    toast.querySelector('.toast_title').textContent = data.title;
    toast.querySelector('.toast_message').textContent = data.message;

    // 이전 타입 클래스 제거 후 새 타입 클래스 부여
    toast.classList.remove('toast_success', 'toast_fail');
    toast.classList.add(data.type === 'success' ? 'toast_success' : 'toast_fail');

    toast.classList.add('show');

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

    // ============================
    // 2. 모달 열기/닫기 + backdrop
    // ============================
    const allModals = document.querySelectorAll('.modal_overlay');
    const backdrop = document.getElementById('modal_backdrop');

    function openModal(name) {
        allModals.forEach(modal => {
            const key = modal.dataset.policy || modal.dataset.modal;
            if (key === name) {
                modal.hidden = false;
                modal.style.display = 'flex';
            } else {
                modal.hidden = true;
                modal.style.display = 'none';
            }
        });
        backdrop.hidden = false;
    }

    function closeModal(modal) {
        modal.hidden = true;
        modal.style.display = 'none';
        backdrop.hidden = true;
    }

    // data-policy 버튼 (모달 자기 자신 안의 요소는 제외)
    document.querySelectorAll('button[data-policy], a[data-policy]').forEach(btn => {
        if (btn.closest('.modal_overlay')) return;
        btn.addEventListener('click', () => {
            openModal(btn.dataset.policy);
        });
    });

    // data-open-modal 버튼 (체인 전환)
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.openModal);
        });
    });

    // 닫기(X) 버튼
    document.querySelectorAll('.modal_overlay .close_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal_overlay'));
        });
    });

    // Cancel / Discard 버튼
    document.querySelectorAll('.modal_overlay .btn_gray').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal_overlay'));
        });
    });

    // backdrop 클릭 시 닫기
    backdrop.addEventListener('click', () => {
        const openModalEl = document.querySelector('.modal_overlay:not([hidden])');
        if (openModalEl) closeModal(openModalEl);
    });

    // ============================
    // 3. Change Name 모달 — Save 버튼
    // ============================
    const changeNameModal = document.querySelector('.modal_overlay.change_name');
    if (changeNameModal) {
        const saveBtn = changeNameModal.querySelector('.btn_yellow');
        const firstNameInput = changeNameModal.querySelector('#firstName');
        const lastNameInput = changeNameModal.querySelector('#lastName');

        const spanConts = document.querySelectorAll('.user_info_cont .user_info .span_cont');
        const firstNameDisplay = spanConts[0]?.querySelector('span:last-child');
        const lastNameDisplay = spanConts[1]?.querySelector('span:last-child');

        saveBtn.addEventListener('click', () => {
            const newFirst = firstNameInput.value.trim();
            const newLast = lastNameInput.value.trim();

            if (!newFirst || !newLast) {
                showToast('name_fail');
                return;
            }

            firstNameDisplay.textContent = newFirst;
            lastNameDisplay.textContent = newLast;

            closeModal(changeNameModal);
            showToast('name_success');
        });
    }

    // ============================
    // 4. Change Password 아코디언 — Confirm 버튼
    // ============================
    document.querySelectorAll('.accordion_item').forEach(item => {
        const label = item.querySelector('.accordion_header span')?.textContent.trim();
        if (label !== 'Change Password') return;

        const body = item.querySelector('.accordion_body');
        const passwordInputs = body.querySelectorAll('input[type="password"]');
        // 순서: [0] Current Password, [1] New Password, [2] Confirm Password
        const currentPwInput = passwordInputs[0];
        const newPwInput = passwordInputs[1];
        const confirmPwInput = passwordInputs[2];
        const confirmBtn = body.querySelector('.btn_yellow');

        confirmBtn.addEventListener('click', () => {
            const currentPw = currentPwInput.value;
            const newPw = newPwInput.value;
            const confirmPw = confirmPwInput.value;

            const hasMinLength = newPw.length >= 8;
            const hasLetterAndSpecial = /[a-zA-Z]/.test(newPw) && /[^a-zA-Z0-9]/.test(newPw);
            const isDifferentFromCurrent = newPw !== currentPw;
            const matchesConfirm = newPw === confirmPw;

            if (hasMinLength && hasLetterAndSpecial && isDifferentFromCurrent && matchesConfirm) {
                showToast('password_success');
            } else {
                showToast('password_fail');
            }
        });
    });

    // ============================
    // 5. Change Email 아코디언 — Confirm 버튼
    // ============================
    document.querySelectorAll('.accordion_item').forEach(item => {
        const label = item.querySelector('.accordion_header span')?.textContent.trim();
        if (label !== 'Change Email') return;

        const body = item.querySelector('.accordion_body');
        const confirmBtn = body.querySelector('.btn_yellow');

        confirmBtn.addEventListener('click', () => {
            // 실제 검증 로직이 필요하면 여기에 추가
            showToast('email_success');
        });
    });

    // ============================
    // 6. Request personal data 버튼 (data-policy 없이 바로 토스트)
    // ============================
    const requestDataBtn = [...document.querySelectorAll('main button')]
        .find(btn => btn.textContent.trim() === 'Request personal data');

    if (requestDataBtn) {
        requestDataBtn.addEventListener('click', () => {
            showToast('personal_data_success');
        });
    }

});