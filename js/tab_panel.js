document.addEventListener('DOMContentLoaded', () => {
    const tabContainers = document.querySelectorAll('.tab_cont');

    tabContainers.forEach(tabCont => {
        const tabButtons = tabCont.querySelectorAll('.tab_btn');
        if (!tabButtons.length) return;

        const parent = tabCont.parentElement;
        if (!parent) return;

        // [수정] tabCont 바로 뒤에 나오는 형제 요소들 중 data-category를 가진 요소만 필터링
        // 이렇게 하면 div.tab_panel 내부의 article들은 상위 tab_cont의 영향을 받지 않습니다.
        const panels = Array.from(parent.children).filter(
            el => el !== tabCont && el.dataset.category !== undefined
        );
        if (!panels.length) return;

        function showPanel(category) {
            panels.forEach(panel => {
                // [수정] 기존 flex 레이아웃을 유지하기 위해 display 속성을 빈값('')으로 초기화하거나 
                // block 대신 각 요소의 원래 기본값 또는 적절한 상태로 변경합니다.
                if (panel.dataset.category === category) {
                    panel.style.display = ''; // CSS에 정의된 원래 display(flex 등)가 작동하도록 함
                } else {
                    panel.style.display = 'none';
                }
            });
        }

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showPanel(btn.dataset.category);
            });
        });

        const initialBtn = tabCont.querySelector('.tab_btn.active') || tabButtons[0];
        initialBtn.classList.add('active');
        showPanel(initialBtn.dataset.category);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.card_overflow, .mini_card');

    sliders.forEach((slider) => {
        let isDown = false;
        let startX;
        let scrollLeft;

        // 1. 마우스를 누르는 순간 (클릭 시작)
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            // 클릭한 시작 지점 좌표와 원래 스크롤 위치 저장
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing'; // 마우스 커서 모양을 잡는 모양으로 변경
        });

        // 2. 마우스가 박스 영역을 벗어났을 때 (조작 중단)
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        // 3. 마우스 클릭을 뗐을 때 (움직임 끝)
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        // 4. 마우스를 클릭한 채로 움직일 때 (실제 드래그 스크롤)
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return; // 마우스가 눌려있지 않다면 실행 안 함
            e.preventDefault();  // 이미지나 텍스트가 블록 지정되는 기본 현상 막기
            
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5; // 곱하는 숫자가 커질수록 드래그 속도가 빨라집니다.
            slider.scrollLeft = scrollLeft - walk;
        });

        // 초기 커서 모양 스타일 지정
        slider.style.cursor = 'grab';
    });
});