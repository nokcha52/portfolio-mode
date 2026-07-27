document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.btn_search');
    const searchBox = document.querySelector('.product_list .searchBox');
    const searchCloseBtn = searchBox?.querySelector('.close_btn');
    const searchInput = searchBox?.querySelector('input');

    const sortToggleBtn = document.querySelector('.btn_sortToggle');
    const sortBox = document.querySelector('.product_list .sortBox');
    const selectedValueBtn = sortBox?.querySelector('.selectedValue');
    const optionList = sortBox?.querySelectorAll('.option_list li');

    const productList = document.querySelector('.product_list > ul');
    const paginationNav = document.querySelector('.pagination');

    if (!productList) return;

    const noResultMsg = document.createElement('li');
    noResultMsg.className = 'no_result body-l';
    noResultMsg.textContent = 'No result';
    noResultMsg.style.display = 'none';
    noResultMsg.style.width = '100%';
    noResultMsg.style.textAlign = 'center';
    productList.appendChild(noResultMsg);

    const allItems = Array.from(productList.children).filter(item => item !== noResultMsg);

    function getItemsPerPage() {
        return window.innerWidth >= 1024 ? 9 : 8;
    }

    let itemsPerPage = getItemsPerPage();
    let currentCategory = 'all';
    let currentPage = 1;
    let currentKeyword = '';
    let currentSort = null;

    searchBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        searchBox.classList.toggle('active');
        sortBox?.classList.remove('active');
    });

    searchCloseBtn?.addEventListener('click', () => {
        searchBox.classList.remove('active');
        searchInput.value = '';
        currentKeyword = '';
        currentPage = 1;
        render();
    });

    sortToggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        sortBox.classList.toggle('active');
        searchBox?.classList.remove('active');
    });

    optionList?.forEach(option => {
        option.addEventListener('click', () => {
            currentSort = option.dataset.value;
            selectedValueBtn.textContent = option.textContent;
            sortBox.classList.remove('active');
            currentPage = 1;
            render();
        });
    });

    searchInput?.addEventListener('input', () => {
        currentKeyword = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        render();
    });

    document.addEventListener('click', (e) => {
        if (searchBox && !searchBox.contains(e.target)) {
            searchBox.classList.remove('active');
        }
        if (sortBox && !sortBox.contains(e.target)) {
            sortBox.classList.remove('active');
        }
    });

    function render() {
        let result = currentCategory === 'all'
            ? [...allItems]
            : allItems.filter(item => item.dataset.category.split(' ').includes(currentCategory));

        if (currentKeyword) {
            result = result.filter(item => {
                const name = item.querySelector('.text_cont h3').textContent.trim().toLowerCase();
                return name.includes(currentKeyword);
            });
        }

        if (currentSort) {
            result.sort((a, b) => {
                const nameA = a.querySelector('.text_cont h3').textContent.trim();
                const nameB = b.querySelector('.text_cont h3').textContent.trim();
                const priceA = parseFloat(a.querySelector('.text_cont > span.label-m').textContent.replace(/[^0-9.]/g, ''));
                const priceB = parseFloat(b.querySelector('.text_cont > span.label-m').textContent.replace(/[^0-9.]/g, ''));

                switch (currentSort) {
                    case 'alpha-asc': return nameA.localeCompare(nameB);
                    case 'alpha-desc': return nameB.localeCompare(nameA);
                    case 'price-high': return priceB - priceA;
                    case 'price-low': return priceA - priceB;
                    default: return 0;
                }
            });
        }

        const totalPages = Math.ceil(result.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const visibleItems = result.slice(start, end);

        allItems.forEach(item => {
            if (item.parentNode === productList) {
                productList.removeChild(item);
            }
        });

        visibleItems.forEach(item => {
            productList.insertBefore(item, noResultMsg);
        });

        noResultMsg.style.display = result.length === 0 ? '' : 'none';

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!paginationNav) return;
        paginationNav.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = 'page_btn' + (i === currentPage ? ' active' : '');
            btn.textContent = i;
            btn.dataset.page = i;

            btn.addEventListener('click', () => {
                currentPage = i;
                render();
            });

            paginationNav.appendChild(btn);
        }
    }

    window.addEventListener('resize', () => {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 1;
            render();
        }
    });

    window.ProductListCore = {
        setCategory(category) {
            currentCategory = category;
            currentPage = 1;
            render();
        },
        render
    };

    render();
});