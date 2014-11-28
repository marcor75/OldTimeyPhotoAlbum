$(document).ready(function(){
    navArrowsFirstLast();
});

//NAVIGATION ARROWS 
$("#left_arrow").on("click", function () {
    turnLeftPage();
});

$("#right_arrow").on("click", function () {
    turnRightPage();
});


var navArrowsFirstLast = function() {
    if($(".turned").hasClass("first")){
        $("#left_arrow").hide();
    } else {
        $("#left_arrow").show();
    } if($(".turned").prev().hasClass("last")){
        $("#right_arrow").hide();
    } else {
        $("#right_arrow").show();
    }; 
};

//on PAGE CLICK-navigation. Not reliable in firefox; workaround w/ larger nav arrows 
$(".page").delegate("div", "click", function(){    
    // check if page has been turned over
    if ($(this).parent(".page").hasClass("turned")) {
        // turn page back to original position
        turnLeftPage();
       
    // else page IS in original position on right 
    } else {
        // turn over to the left
        turnRightPage();
    };
});

// turns over right page    
function turnRightPage(callback) {
    var $page = $(".turned").prev(".page:not(.last)");
    $page.prev(".page").addClass("open"); //class open makes images on that page visible
    $page.css({
        "transform": "rotateY(-180deg)",
        "transform-origin": "left"
    });

    var currentZindex = parseInt($page.css("z-index"));
    // set new z-index; 100 is arbitraryly chosen number to make index change easily reversible - not very 'future proof' though (e.g. if more pages added)    
    $page.css("z-index", 100 - currentZindex);

    //change class AFTER transition (frm. treehouse-site)
    $page.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        $page.unbind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        
        //need to double-set z-index or else second time turning page open setting z-index does not work (tried in Chrome 38.0.2125.111 m)
        $page.css("z-index", 100 - currentZindex);
        $(".turned").removeClass("turned");
        $page.removeClass("open"); 
        $page.addClass("turned");
        
        navArrowsFirstLast ();
        
        if(typeof callback == "function") {
            callback.call();
        }
    });
}

// turns over left page
function turnLeftPage(callback) {
    var $page = $(".turned:not(.first)");
    // lower page number is next in markup 
    var $prevPage = $page.next();
    $prevPage.addClass("turned");
    
    $page.addClass("open");                 
    $page.css({
        "transform": "rotateY(0deg)",
        "transform-origin": "left"
    });

    
    var currentZindex = parseInt($page.css("z-index"));
    // after turning change class and z-index        
    $page.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        $page.unbind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        $page.prev(".page").removeClass("open"); 
        $page.removeClass("turned");
        
        // set new z-index; 100 is arbitraryly chosen number to make index change easily reversible - not very 'future proof' though (e.g. if more pages added)    
        $page.css("z-index", 100 - currentZindex);
        
        navArrowsFirstLast ();
        //callback function thx to Antoine Combes
        if(typeof callback == "function") {
            callback.call();
        }
    });
}


//find page (w/ ID) where dropdown selection is located
$("#places").on("change", function () {
    var selection = $("select option:selected").text();
    
    if ( selection != "Where to go..."){
        switch (selection) {
            case '4 Cebu':
                var $page = $("#p4");
                break;
            case '8 Siem Reap':
                var $page = $("#p8");
                break;
            case '2 Sri Lanka':
                var $page = $("#p2");
                break;
            case '10 Vietnam':
                var $page = $("#p10");
                break;
            case '12 Yangshuo':
                var $page = $("#p12");
                break;
            case '11 Shanghai':
                var $page = $("#p11");
                break;
            case '9 Singapore':
                var $page = $("#p9");
                break;
            case '7 KL':
                var $page = $("#p7");
                break;
            case '5 Hong Kong':
                var $page = $("#p5");
                break;
            case '3 Wuyi Shan':
                var $page = $("#p3");
                break;
            case '1 Bali':
                var $page = $("#p1");
                break;
            case '6 Koh Chang':
                var $page = $("#p6");
                break;
            default:
                var $page = $("#p1");
        } // end switch
    }   // end if
    //cache currently open left page
    var $currentPage = $(".turned .back");
    var currentPageId = $currentPage.attr("id");
    var foundPageId = $page.attr("id");
    console.log("found page: " + foundPageId);
    console.log("currentPage: " + currentPageId);
    var currentPagePos = parseInt(currentPageId.slice(1));
    var foundPagePos = parseInt(foundPageId.slice(1));
    var pageDifference = Math.abs(foundPagePos - currentPagePos);
    console.log("page Difference is: " + pageDifference);

    //determine whether to flip pages forward or back
    if (currentPagePos < foundPagePos) { // => turn right page
        //determine how many times need to turn page. Since current page is always on left hand side (LTR book)
        // if pageDifference is 1, no need to turn over page
        if (pageDifference > 1 && pageDifference % 2 != 0) {
            var numPageTurns = (pageDifference - 1) / 2;
            pageForward(numPageTurns);
            //console.log("number of FORWARD page turns: "+numPageTurns);
        } else if (pageDifference > 1 && pageDifference % 2 == 0) {
            var numPageTurns = pageDifference / 2;
            pageForward(numPageTurns);
        }
    } else { //if (currentPagePos > foundPagePos) => turn left page
        if (pageDifference % 2 != 0) {
            var numPageTurns = (pageDifference + 1) / 2;
            pageBack(numPageTurns);
            //console.log("number of Back page turns: "+numPageTurns);
        } else if (pageDifference % 2 == 0) {
            var numPageTurns = pageDifference / 2;
            pageBack(numPageTurns);
            //console.log("number of Back page turns: "+numPageTurns);
        }
    }
});

//function to call turnRightPage - revised. Thx to Antoine Combes
function pageForward(numPageTurns) {
    console.log("number of FORWARD page turns: " + numPageTurns);
    if(numPageTurns > 0) {
        $(".page").css({
                "transition": "transform 0.5s linear"
        });
        turnRightPage(function(){
            pageForward(numPageTurns - 1);
        });
        $(".page").css({
                 "transition": "transform 1s ease-in-out"
        });
        navArrowsFirstLast ();
    } 
}

//function to call turnRightPage - revised. Thx to Antoine Combes
function pageBack(numPageTurns) {
    console.log("number of BACK page turns: " + numPageTurns);
    if(numPageTurns > 0) {
        $(".page").css({
                "transition": "transform 0.5s linear"
        });
        turnLeftPage(function(){
            pageBack(numPageTurns - 1);
        });
        $(".page").css({
                 "transition": "transform 1s ease-in-out"
        });
        navArrowsFirstLast ();
    }
}
   

