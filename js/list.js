document.querySelector('.btn_search').addEventListener('click', () => {
    document.querySelector('.searchBox').classList.toggle('active');
    document.querySelector('.sortBox').classList.remove('active'); // 다른 거 닫기
});

document.querySelector('.btn_sortToggle').addEventListener('click', () => {
    document.querySelector('.sortBox').classList.toggle('active');
    document.querySelector('.searchBox').classList.remove('active');
});