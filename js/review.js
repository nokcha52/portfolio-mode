document.addEventListener('DOMContentLoaded', () => {
  initReviewQuestionTabs();
  initSortBox();
  initStarRating();
  initModals();
});

/* ------------------------------------------
   1. Review / Questions 탭 전환
------------------------------------------- */
function initReviewQuestionTabs() {
  const reviewCenter = document.querySelector('.review_center');
  if (!reviewCenter) return;

  const tabBtns = reviewCenter.querySelectorAll('.tab_btn.trans');
  const writeBtns = reviewCenter.querySelectorAll('.write_btn');
  const panels = document.querySelectorAll('.tab_panel[data-panel]');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category; // "review" 또는 "question"

      // 탭 버튼 active 전환
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // 클릭한 탭과 일치하는 패널만 보이기
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== category;
      });

      // Write a Review / Ask a Question 버튼도 함께 전환
      writeBtns.forEach((wb) => {
        wb.hidden = wb.dataset.tabAction !== category;
      });
    });
  });
}

/* ------------------------------------------
   2. 정렬(sortBox) 드롭다운
------------------------------------------- */
function initSortBox() {
  const sortBox = document.querySelector('.sortBox');
  if (!sortBox) return;

  const selectedBtn = sortBox.querySelector('.selectedValue');
  const selectedText = selectedBtn.querySelector('span');
  const optionList = sortBox.querySelector('.option_list');

  // 드롭다운 열기/닫기
  selectedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    optionList.hidden = !optionList.hidden;
  });

  // 옵션 선택
  optionList.querySelectorAll('li').forEach((li) => {
    li.addEventListener('click', () => {
      selectedText.textContent = li.textContent;
      optionList.hidden = true;
      sortReviews(li.dataset.value);
    });
  });

  // 바깥 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!sortBox.contains(e.target)) {
      optionList.hidden = true;
    }
  });
}

function sortReviews(sortType) {
  const grid = document.querySelector('.review_grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.review_cont'));

  const getRating = (card) => {
    const stars = card.querySelectorAll('.review_head .star_cont img');
    return Array.from(stars).filter((img) => img.src.includes('filled')).length;
  };

  const getLikes = (card) =>
    parseInt(card.querySelector('.thumb_up .caption-s').textContent, 10);

  switch (sortType) {
    case 'highest-rating':
      cards.sort((a, b) => getRating(b) - getRating(a));
      break;
    case 'lowest-rating':
      cards.sort((a, b) => getRating(a) - getRating(b));
      break;
    case 'most-helpful':
      cards.sort((a, b) => getLikes(b) - getLikes(a));
      break;
    case 'most-recent':
      // "2 weeks ago" 같은 텍스트는 정확한 정렬이 불가능해요.
      // 실제 정렬하려면 article에 data-date="2026-07-01" 같은 실제 날짜값을 추가해주셔야 합니다.
      console.warn('정확한 최신순 정렬을 위해서는 review_cont에 data-date 속성이 필요합니다.');
      return;
    default:
      return; // "Featured"는 원래 순서 유지
  }

  cards.forEach((card) => grid.appendChild(card));
}

/* ------------------------------------------
   3. 별점 선택 (리뷰 모달 안 star_select)
------------------------------------------- */
function initStarRating() {
  const starSelect = document.querySelector('.star_select');
  if (!starSelect) return;

  const stars = Array.from(starSelect.querySelectorAll('img'));

  const paintStars = (value) => {
    stars.forEach((star) => {
      const starValue = parseInt(star.dataset.value, 10);
      star.src = starValue <= value
        ? 'images/icon/icon_star_filled.svg'
        : 'images/icon/icon_star_empty.svg';
    });
  };

  stars.forEach((star) => {
    star.addEventListener('mouseenter', () => paintStars(parseInt(star.dataset.value, 10)));
    star.addEventListener('click', () => {
      starSelect.dataset.selected = star.dataset.value;
      paintStars(parseInt(star.dataset.value, 10));
    });
  });

  starSelect.addEventListener('mouseleave', () => {
    paintStars(parseInt(starSelect.dataset.selected || 0, 10));
  });
}

function resetStarRating() {
  const starSelect = document.querySelector('.star_select');
  if (!starSelect) return;
  starSelect.dataset.selected = 0;
  starSelect.querySelectorAll('img').forEach((star) => {
    star.src = 'images/icon/icon_star_empty.svg';
  });
}

/* ------------------------------------------
   4. 모달 (write 버튼 → 입력 모달 → 성공 모달)
------------------------------------------- */
let activeBackdrop = null;

function openModal(modal) {
  if (!modal) return;

  if (!activeBackdrop) {
    activeBackdrop = document.createElement('div');
    activeBackdrop.className = 'modal_backdrop';
    activeBackdrop.addEventListener('click', () => closeModal(modal));
    document.body.appendChild(activeBackdrop);
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  activeBackdrop?.remove();
  activeBackdrop = null;
  document.body.style.overflow = '';
}

function initModals() {
  // Write a Review / Ask a Question 버튼 → 해당 입력 모달 열기
  document.querySelectorAll('.write_btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tabAction === 'review'
        ? 'reviewModalOverlay'
        : 'questionModalOverlay';
      openModal(document.getElementById(targetId));
    });
  });

  // 닫기(X) / 취소 / 완료(Done) 버튼 → 자신이 속한 모달 닫기
  document.querySelectorAll('.modal_overlay').forEach((modal) => {
    modal.querySelector('.close_btn')?.addEventListener('click', () => closeModal(modal));
    modal.querySelector('.cancel_btn')?.addEventListener('click', () => closeModal(modal));
    modal.querySelector('.confirm_btn')?.addEventListener('click', () => closeModal(modal));
  });

  // 리뷰 제출 → 리뷰 입력 모달 닫고 → 리뷰 성공 모달 열기
  document.getElementById('reviewForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('리뷰 제출:', { text: formData.get('reviewText') });

    closeModal(document.getElementById('reviewModalOverlay'));
    e.target.reset();
    resetStarRating();
    openModal(document.getElementById('reviewSuccessModalOverlay'));
  });

  // 질문 제출 → 질문 입력 모달 닫고 → 질문 성공 모달 열기
  document.getElementById('question_form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('질문 제출:', {
      name: formData.get('userName'),
      email: formData.get('userEmail'),
      question: formData.get('questionText'),
    });

    closeModal(document.getElementById('questionModalOverlay'));
    e.target.reset();
    openModal(document.getElementById('questionSuccessModalOverlay'));
  });
}