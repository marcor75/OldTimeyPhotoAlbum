"use strict";
// get img alt attribute and set caption
function setCaption (){
    
    $("#caption").empty();  
    var caption = $(".current").attr("alt");
   
    $("#caption").text(caption);
    
};

//check image orientation and adjust #lightboximg accordingly
function getImageOrientation () {
        var width   = $(".current").width();
        var height  = $(".current").height();

        if(width > height) {
            console.log("landscape");
            $(".current").addClass("landscape");
            $("#caption").css({"margin-left":"0", "margin-top": "65px"});

        } else {
            console.log("portrait");
            $(".current").addClass("portrait");
            $("#caption").css({"margin-left":"-35%", "margin-top": "115px"});
        } 
}; 

// using event delegation for click event to prevent page from turning when img clicked 
$(".page").delegate("img", "click", function(event) {
    event.preventDefault();
    event.stopPropagation();
       
  // wrap setCaption-call into a callback fct. to ensure .load has finished before firing setCaption
    var url = $(this).attr("id");
    $("#lightboximg").load(url+".html", function(){
        setCaption();
    //check w / h only AFTER the .current image has loaded      
        $(".current").load(function() {
            getImageOrientation();
        });
        $("#overlay, #lightboximg, #caption, #navPrev, #navNext").fadeIn(400); // looks smoother than "css("display", "block")"
    });        
});

// close Button > click event close lightbox
$("#closeBtn").click(function(){
   $("#overlay, #lightboximg, #caption, #navPrev, #navNext").css("display", "none");
    $("#lightboximg").empty();
});

// navigation arrows - NEXT
$("#navNext").click(function(){         
    console.log("Nextbutton.click");
    
    var currentSlide = $(".current");
    var nextSlide = currentSlide.next();
    
    
    if(nextSlide.length === 0) {
      nextSlide = $(".picture").first();
    };
        
    currentSlide.removeClass("current");
    nextSlide.addClass("current");
    
    setCaption();
    getImageOrientation();
 });
 
 // navigation arrows - Previous
$("#navPrev").click(function(){         
    console.log("Prevbutton.click");
    
    var currentSlide = $(".current");
    var prevSlide = currentSlide.prev();
    
    
    if(prevSlide.length === 0) {
      prevSlide = $(".picture").last();
    };
      
    currentSlide.removeClass("current");
    prevSlide.addClass("current");
    
    setCaption();
    getImageOrientation();
 });
 
 
 
