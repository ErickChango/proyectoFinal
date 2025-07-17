$(document).ready(function(){
   
    function resetAnimation(element) {
        var classes = element.attr('class');
        element.removeClass('animate');
        setTimeout(function(){ 
            element.addClass(classes);
        }, 20);
    }


    $('.animate').each(function() {
        var $this = $(this);
        resetAnimation($this);
    });
});