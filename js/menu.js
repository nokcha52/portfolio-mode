$(document).ready(function(){
    megaMenu();
    popDown();
    loginForm();
    hamburgerBtn();
    tabletMenu();
    subscribeForm();
});

var isLoggedIn = false;

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

function tabletMenu(){

    $(document).on("click", ".megaMenu.tablet .close_btn", function(){
        $(".megaMenu").removeClass("actived");
    });

    $(document).on("click", ".megaMenu.tablet button[data-target]", function(){
        var targetId = $(this).attr("data-target");

        $(".megaMenu").removeClass("actived");
        $("#" + targetId + ".megaMenu").addClass("actived");
    });

    $(document).on("click", ".back_btn", function(){
        $(".megaMenu").removeClass("actived");
        var $prevLevel = isLoggedIn ? $("#tablet_menu_after") : $("#menuBar");
        $prevLevel.addClass("actived");
    });

    $(document).on("click", "#tablet_menu_after a[href='login_main.html']", function(e){
        e.preventDefault();
        $(".megaMenu").removeClass("actived");
        $("#tablet_account_detail").addClass("actived");
    });

    $(document).on("click", "#tablet_account_detail .back_btn", function(){
        $(".megaMenu").removeClass("actived");
        $("#tablet_menu_after").addClass("actived");
    });

    $(document).on("click", "#tablet_account_detail .log_out_btn button", function(){
        onLogout();
    });
}
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
