document.addEventListener('DOMContentLoaded', () => {
    const openBtns = document.querySelectorAll('.open_modal_btn');
    const contactOverlay = document.getElementById('contactOverlay');
    const successOverlay = document.getElementById('successOverlay');

    if (!contactOverlay || !successOverlay) {
        console.warn('contactOverlay 또는 successOverlay를 찾을 수 없습니다.');
        return;
    }

    const closeBtn = contactOverlay.querySelector('.modal_close_btn');
    const form = contactOverlay.querySelector('fieldset');
    const submitBtn = contactOverlay.querySelector('.submit_btn');
    const doneBtn = document.getElementById('doneBtn');
    const countrySelect = document.getElementById('countrySelect');

    // 문의 모달 열기
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            contactOverlay.classList.add('active');
        });
    });

    // 문의 모달 닫기 (X 버튼)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            contactOverlay.classList.remove('active');
        });
    }

    // 문의 모달 바깥 클릭 시 닫기
    contactOverlay.addEventListener('click', (e) => {
        if (e.target === contactOverlay) {
            contactOverlay.classList.remove('active');
        }
    });

    // ===== 파일 업로드 파일명 표시 =====
    function bindFileInput(inputId, displayId) {
        const input = document.getElementById(inputId);
        const display = document.getElementById(displayId);
        if (!input || !display) return;

        input.addEventListener('change', () => {
            if (input.files.length === 0) {
                display.textContent = 'Upload file';
            } else if (input.files.length === 1) {
                display.textContent = input.files[0].name;
            } else {
                display.textContent = `${input.files.length}개 파일 선택됨`;
            }
        });
    }
    bindFileInput('resume', 'resumeFileName');
    bindFileInput('additionalDocs', 'additionalDocsFileName');

    // ===== TOAST =====
    function showToast(message) {
        let toast = document.getElementById('formToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'formToast';
            toast.style.cssText = `
                position: fixed;
                bottom: 32px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: #fff;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2500);
    }

    // ===== 제출 버튼 클릭 (검증 없이 바로 전환) =====
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactOverlay.classList.remove('active');
            successOverlay.classList.add('active');
        });
    } else {
        console.warn('.submit_btn을 찾을 수 없습니다.');
    }

    // ===== 완료 팝업 닫기 =====
    if (doneBtn) {
        doneBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
            if (form) form.reset();
        });
    }

    successOverlay.addEventListener('click', (e) => {
        if (e.target === successOverlay) {
            successOverlay.classList.remove('active');
        }
    });
});