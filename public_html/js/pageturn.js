$(document).ready(function(){
    navArrowsFirstLast();
});

//NAVIGATION ARROWS 
// add / remove class "running" to temporarily disable click event handler, thus preventing 
// accidental double-clicks, that were previously messing up stack order of pages
$("#nav").on("click", "span:not(.running)", function () {
    // testcode console.log($(this));
   $(this).addClass("running");
   if ($(this).attr("id")== "left_arrow"){
       turnLeftPage();
       setTimeout(function () {
           // testcode console.log($(this)); 
            $("#left_arrow").removeClass("running");}, 1100 );
   } else {
       turnRightPage();
       setTimeout(function () {
           // testcode console.log($(this));
            $("#right_arrow").removeClass("running");}, 1100 );
   }
   
});

//hides navigation arrows on first/last page 
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
    
    if ( selection !== "Where to go..."){
        switch (selection) {
            case '1 Ubud':
            case '1 Denpasar':
            case '1 Menjangan':
            case '1 Gilis':
                var $page = $("#p1");
                break;
            case '2 Colombo':
            case '2 Galle':
            case '2 Kandy':
            case '2 Anuradhapura':
                var $page = $("#p2");
                break;
            case '3 Taipei':
            case '3 AliShan':
            case '3 SpringScream':
            case '3 Tailuge':
                var $page = $("#p3");
                break;
            case '4 Hong Kong':
            case '4 1.July Protests':
            case '4 Lantau':
            case '4 Shek O':
                var $page = $("#p4");
                break;    
            case '5 Cebu':
            case '5 Koh Tao':
            case '5 Chiang Mai':
            case '5 Ayuthaya':
                var $page = $("#p5");
                break;
            case '6 Koh Chang':
            case '6 Chiang Rai':
            case '6 Bangkok':
            case '6 Sukothai':
                var $page = $("#p6");
                break;    
            case '7 Pulau Tioman':
            case '7 KL':
            case '7 Airobatics':
            case '7 Penang':
                var $page = $("#p7");
                break;     
            case '8 Siem Reap':
            case '8 Sihanouville':
            case '8 Phnom Phen':
            case '8 Cities':
                var $page = $("#p8");
                break;
            case '9 Singapore':
            case '9 Zoukout':
            case '9 F1 Night Race':
            case '9 Pulau Ubin':
                var $page = $("#p9");
                break;
            case '10 Hanoi':
            case '10 Hoi An':
            case '10 Saigon':
            case '10 NaThrang':
                var $page = $("#p10");
                break;
            case '11 Shanghai':
            case '11 JingAn':
            case '11 Anhui':
            case '11 XuHui':
                var $page = $("#p11");
                break;    
            case '12 Yangshuo':
            case '12 Lijiang':
            case '12 Hangzhou':
            case '12 Wuyishan':
                var $page = $("#p12");
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
   

