(function ($) {
    'use strict';
    var viewport = window.innerWidth;
    var dir = document.documentElement.getAttribute('dir'); 
    
/*   var bLazy = new Blazy({
        offset: 350,
        loadInvisible: true
    });*/
    
    $(document).ready(function(){
        $('.page-section').viewportChecker({
            classToAdd: 'inView'
        });
        
        //$('body').addClass('is-loaded');
        
        $('.search-toggle').click(function(e){
            $(this).parent().toggleClass('search-open')    
        });
        
        $('.back-btn').click(function(e){
            window.history.back()
        });
        
       
        
        
        setTimeout(function(){
            //$('.media-center ul.tabs li:first-child').click();  
        }, 1500); 
        
    });

   
    
    $(window).resize(function () {

    });
    
    
     
  
})(jQuery);  
