document.addEventListener('DOMContentLoaded', () => {
  initReviewQuestionTabs();
  initSortBox();
  initStarRating();
  initModals();
  initVoting();
  initPagination();
});

/* ============================================
   1. Review / Questions 탭 전환
============================================ */
function initReviewQuestionTabs() {
  const reviewCenter = document.querySelector('.review_center');
  if (!reviewCenter) return;

  const tabBtns = reviewCenter.querySelectorAll('.tab_btn.trans');
  const writeBtns = reviewCenter.querySelectorAll('.write_btn');
  const panels = document.querySelectorAll('.tab_panel[data-panel]');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category; // "review" 또는 "question"

      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== category;
      });

      writeBtns.forEach((wb) => {
        wb.hidden = wb.dataset.tabAction !== category;
      });
    });
  });
}

/* ============================================
   2. 정렬(sortBox) 드롭다운 + 화살표 회전
============================================ */
function initSortBox() {
  const sortBox = document.querySelector('.sortBox');
  if (!sortBox) return;

  const selectedBtn = sortBox.querySelector('.selectedValue');
  const selectedText = selectedBtn.querySelector('span');
  const optionList = sortBox.querySelector('.option_list');

  selectedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = optionList.hidden;
    optionList.hidden = !willOpen;
    sortBox.classList.toggle('is-open', willOpen);
  });

  optionList.querySelectorAll('li').forEach((li) => {
    li.addEventListener('click', () => {
      selectedText.textContent = li.textContent;
      optionList.hidden = true;
      sortBox.classList.remove('is-open');
      sortReviews(li.dataset.value);
    });
  });

  document.addEventListener('click', (e) => {
    if (!sortBox.contains(e.target)) {
      optionList.hidden = true;
      sortBox.classList.remove('is-open');
    }
  });
}

// "2 weeks ago" / "1 months ago" 같은 텍스트를 "며칠 전"인지로 환산 (작을수록 최근)
function parseRelativeDate(text) {
  const match = text.match(/(\d+)\s*(day|week|month|year)/i);
  if (!match) return Infinity;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const unitToDays = { day: 1, week: 7, month: 30, year: 365 };

  return value * unitToDays[unit];
}

function sortReviews(sortType) {
  const grid = document.querySelector('.review_grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.review_cont'));

  const getRating = (card) =>
    card.querySelectorAll('.review_head .star_cont img[src*="filled"]').length;

  const getLikes = (card) =>
    parseInt(card.querySelector('.thumb_up .caption-s').textContent, 10);

  const getDateValue = (card) => {
    const dateSpan = card.querySelector('.review_head > span.label-s');
    return parseRelativeDate(dateSpan?.textContent || '');
  };

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
      cards.sort((a, b) => getDateValue(a) - getDateValue(b));
      break;
    default:
      return; // Featured는 원래 순서 유지
  }

  cards.forEach((card) => grid.appendChild(card));
  refreshPagination();
}

/* ============================================
   3. 별점 선택 (리뷰 모달 안 star_select)
============================================ */
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

/* ============================================
   4. 모달 (write 버튼 → 입력 모달 → 성공 모달)
============================================ */
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
  document.querySelectorAll('.write_btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tabAction === 'review'
        ? 'reviewModalOverlay'
        : 'questionModalOverlay';
      openModal(document.getElementById(targetId));
    });
  });

  document.querySelectorAll('.modal_overlay').forEach((modal) => {
    modal.querySelector('.close_btn')?.addEventListener('click', () => closeModal(modal));
    modal.querySelector('.cancel_btn')?.addEventListener('click', () => closeModal(modal));
    modal.querySelector('.confirm_btn')?.addEventListener('click', () => closeModal(modal));
  });

  document.getElementById('reviewForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('리뷰 제출:', { text: formData.get('reviewText') });

    closeModal(document.getElementById('reviewModalOverlay'));
    e.target.reset();
    resetStarRating();
    openModal(document.getElementById('reviewSuccessModalOverlay'));
  });

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

/* ============================================
   5. Good / Bad 투표
============================================ */
function initVoting() {
  document.querySelectorAll('.review_cont').forEach((card) => {
    const upBtn = card.querySelector('.thumb_up');
    const downBtn = card.querySelector('.thumb_down');

    upBtn.addEventListener('click', () => toggleVote(card, 'up'));
    downBtn.addEventListener('click', () => toggleVote(card, 'down'));
  });
}

function toggleVote(card, type) {
  const current = card.dataset.voted || '';

  if (current === type) {
    setVoteState(card, '');
  } else {
    setVoteState(card, type);
  }
}

function setVoteState(card, type) {
  const upBtn = card.querySelector('.thumb_up');
  const downBtn = card.querySelector('.thumb_down');
  const previous = card.dataset.voted || '';

  if (previous === 'up') adjustCount(upBtn, -1);
  if (previous === 'down') adjustCount(downBtn, -1);
  paintIcon(upBtn, false);
  paintIcon(downBtn, false);

  card.dataset.voted = type;

  if (type === 'up') {
    adjustCount(upBtn, 1);
    paintIcon(upBtn, true);
  } else if (type === 'down') {
    adjustCount(downBtn, 1);
    paintIcon(downBtn, true);
  }
}

function adjustCount(btn, delta) {
  const countSpan = btn.querySelector('.caption-s');
  const current = parseInt(countSpan.textContent, 10);
  countSpan.textContent = current + delta;
}

function paintIcon(btn, isActive) {
  const img = btn.querySelector('img');
  const isUp = btn.classList.contains('thumb_up');
  img.src = isActive
    ? `images/icon/icon_thumb${isUp ? 'up' : 'down'}_filled.svg`
    : `images/icon/icon_thumb${isUp ? 'up' : 'down'}.svg`;
}

/* ============================================
   6. 반응형 페이지네이션 (3열/9개 · 2열/8개 · 1열/6개)
============================================ */
let allReviewCards = [];
let currentPage = 1;

function getItemsPerPage() {
  const width = window.innerWidth;
  if (width >= 1024) return 9; // 데스크톱: 3열
  if (width >= 768) return 8;  // 태블릿: 2열
  return 6;                    // 모바일: 1열
}

function initPagination() {
  allReviewCards = Array.from(document.querySelectorAll('.review_grid .review_cont'));
  renderPage(1);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderPage(1), 200);
  });
}

function refreshPagination() {
  allReviewCards = Array.from(document.querySelectorAll('.review_grid .review_cont'));
  renderPage(1);
}

function renderPage(page) {
  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(allReviewCards.length / itemsPerPage);
  currentPage = Math.min(Math.max(page, 1), totalPages || 1);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  allReviewCards.forEach((card, i) => {
    card.hidden = i < start || i >= end;
  });

  renderPaginationButtons(totalPages);
}
function renderPaginationButtons(totalPages) {
    const paginationNav = document.querySelector('.pagination');
    if (!paginationNav) return;
    paginationNav.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page_btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.dataset.page = i;

        btn.addEventListener('click', () => {
            renderPage(i);
        });

        paginationNav.appendChild(btn);
    }
}