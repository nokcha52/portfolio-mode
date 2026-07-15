$(document).ready(function(){
    searchBox()
})

// 키워드 → 이동할 페이지 매핑
var searchPageMap = {
    "keyboard": "search_keyboard.html",
    "keycap": "search_keycap.html",
    "switch": "search_switch.html",
    "encore": "search_encore.html",
    "sonnet": "search_sonnet.html",
    "envoy": "search_envoy.html",
    "tempo": "search_tempo.html",
    "sixtyfive": "search_sixtyfive.html",
    "loop": "search_loop.html",
    "eighty": "search_eighty.html"
};

function searchBox(){
    $("#searchInput").on("keydown", function(e){
        if(e.key === "Enter"){
            e.preventDefault();

            var keyword = $(this).val().trim().toLowerCase();
            if(keyword === ""){
                return;
            }

            // 키워드 목록 중 입력값을 포함하는(부분 일치) 첫 번째 항목 찾기
            var matchedKey = Object.keys(searchPageMap).find(function(key){
                return key.includes(keyword);
            });

            if(matchedKey){
                window.location.href = searchPageMap[matchedKey];
            } else {
                showNoResultMessage(keyword);
            }
        }
    });

    $(".clear_btn").on("click", function(){
        $("#searchInput").val("");
        $("#searchNoResult").remove();
    });
}

function showNoResultMessage(keyword){
    $("#searchNoResult").remove();

    var $msg = $("<p id='searchNoResult'>No results found for \"" + keyword + "\".</p>");
    $(".searchBox").after($msg);
}