$(document).ready(function(){
    megaMenu();
    popDown();
    loginForm();
    hamburgerBtn();
    tabletMenu();
    subscribeForm();
});

var isLoggedIn = false;

// ------------------------------
// 1. 데스크탑 상단 메뉴 (keyboard, keycap, component, about, help, search)
// ------------------------------
function megaMenu(){
    var $menuBtn = $(".menu li, .subMenu li[data-tabName='search']");

    $menuBtn.on("click", function(e){
        e.preventDefault();
        var tabName = $(this).attr("data-tabName");
        var $target = $("#" + tabName + ".megaMenu");

        if($target.length === 0) return;

        var isAlreadyActive = $target.hasClass("actived");

        $menuBtn.removeClass("actived");
        $(".megaMenu").not(".tablet").removeClass("actived");

        if(!isAlreadyActive){
            $(this).addClass("actived");
            $target.addClass("actived");
        }
    });
}

// ------------------------------
// 2. 데스크탑 로그인/계정 popDown
// ------------------------------
function popDown(){
    var $loginBtn = $(".subMenu li[data-tabName='login']");

    $loginBtn.on("click", function(e){
        e.preventDefault();
        var $target = isLoggedIn ? $("#login_after") : $("#login_before");
        var isAlreadyActive = $target.hasClass("actived");

        $loginBtn.removeClass("actived");
        $(".popDown").removeClass("actived");

        if(!isAlreadyActive){
            $(this).addClass("actived");
            $target.addClass("actived");
        }
    });
}

// ------------------------------
// 3. 로그인 폼 제출
// ------------------------------
function loginForm(){
    $("#login_before").on("submit", function(e){
        e.preventDefault();

        var $btn = $(this).find("button[type='submit']");
        var originalText = $btn.text();
        $btn.text("Logging in...").prop("disabled", true);

        setTimeout(function(){
            onLoginSuccess($("#loginEmail").val());
            $btn.text(originalText).prop("disabled", false);
        }, 500);
    });

    $("#login_after").on("click", ".logout_btn", function(e){
        e.preventDefault();
        onLogout();
    });
}

// ------------------------------
// 4. 햄버거(menuBar) 아이콘 클릭 → 로그인 여부에 따라 다른 메뉴 열기
// ------------------------------
function hamburgerBtn(){
    $(document).on("click", ".subMenu li[data-tabName='menuBar']", function(e){
        e.preventDefault();

        var $target = isLoggedIn ? $("#tablet_menu_after") : $("#menuBar");
        var isAlreadyActive = $target.hasClass("actived");

        $(".megaMenu").removeClass("actived");

        if(!isAlreadyActive){
            $target.addClass("actived");
        }
    });
}

// ------------------------------
// 5. 태블릿/모바일 메뉴 내부 동작
// ------------------------------
function tabletMenu(){
    // close 버튼 (menuBar, tablet_menu_after 전용): 열려있는 메뉴 전체 닫기
    $(document).on("click", ".megaMenu.tablet .close_btn", function(){
        $(".megaMenu").removeClass("actived");
    });

    // keyboards/keycaps/component/about/help 버튼 → 해당 메가메뉴 열기
    $(document).on("click", ".megaMenu.tablet button[data-target]", function(){
        var targetId = $(this).attr("data-target");

        $(".megaMenu").removeClass("actived");
        $("#" + targetId + ".megaMenu").addClass("actived");
    });

    // #keyboard, #keycap, #component, #about, #help 안의 back 버튼
    // → 로그인 여부에 따라 이전 단계(menuBar 또는 tablet_menu_after)로 복귀
    $(document).on("click", ".back_btn", function(){
        $(".megaMenu").removeClass("actived");
        var $prevLevel = isLoggedIn ? $("#tablet_menu_after") : $("#menuBar");
        $prevLevel.addClass("actived");
    });

    // "My account" 클릭 → 계정 상세(tablet_account_detail)로 이동
    $(document).on("click", "#tablet_menu_after a[href='login_main.html']", function(e){
        e.preventDefault();
        $(".megaMenu").removeClass("actived");
        $("#tablet_account_detail").addClass("actived");
    });

    // tablet_account_detail의 back 버튼 → tablet_menu_after로 복귀
    $(document).on("click", "#tablet_account_detail .back_btn", function(){
        $(".megaMenu").removeClass("actived");
        $("#tablet_menu_after").addClass("actived");
    });

    // tablet_account_detail의 Log out 버튼
    $(document).on("click", "#tablet_account_detail .log_out_btn button", function(){
        onLogout();
    });
}

// ------------------------------
// 6. 로그인 성공 / 로그아웃 공통 처리
// ------------------------------
function onLoginSuccess(email){
    isLoggedIn = true;
    $("#login_after .title3").text(email);

    $(".popDown").removeClass("actived");
    $(".subMenu li").removeClass("actived");

    var wasTabletMenuOpen = $(".megaMenu.tablet").hasClass("actived");
    if(wasTabletMenuOpen){
        $(".megaMenu").removeClass("actived");
        $("#tablet_menu_after").addClass("actived");
    }

    showToast("Logged in successfully!");
}

function onLogout(){
    isLoggedIn = false;

    $(".popDown").removeClass("actived");
    $(".subMenu li").removeClass("actived");
    $("#login_before").addClass("actived");
    $(".subMenu li[data-tabName='login']").addClass("actived");
    $("#login_before")[0].reset();

    var wasTabletMenuOpen = $(".megaMenu.tablet").hasClass("actived");
    if(wasTabletMenuOpen){
        $(".megaMenu").removeClass("actived");
        $("#menuBar").addClass("actived");
    }

    showToast("Logged out successfully");
}

// ------------------------------
// 7. 토스트 메시지
// ------------------------------
function showToast(message){
    var $toast = $("#toast");
    $toast.text(message).addClass("show");

    setTimeout(function(){
        $toast.removeClass("show");
    }, 2000);
}

function subscribeForm(){
    $(".subscribe-form").on("submit", function(e){
        e.preventDefault();

        var $form = $(this);
        var $input = $form.find("#emailInput");
        var $btn = $form.find("button[type='submit'], button");
        var email = $input.val().trim();

        // 아주 기본적인 이메일 형식 체크
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(email)){
            $input.focus();
            return;
        }

        $btn.text("Thanks! Please confirm your subscription through the email we sent you.");
        $btn.prop("disabled", true);
        $input.prop("disabled", true).val("");
    });
}

document.querySelectorAll('.delayLink').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetUrl = link.href;

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 6000);
    });
});