
(function ($) {
    window.bLazy = new Blazy({
        offset: 350,
        loadInvisible: true,
        breakpoints: [
            {
                width: 480, // max-width
                src: 'data-src-small'
            },
            {
                width: 991, // max-width
                src: 'data-src-medium'
            }
        ]
    }); 
    

    

    $('.showHideFooterBtn').click(function (e) {
       
        e.preventDefault();
       // $('body').toggleClass('footerActive');
       $('.footer-top').fadeToggle(); 
       $('.shBtntext').text(function(i, text){
            return text === "Hide Footer" ? "Show Footer" : "Hide Footer";
        })
    });

    $('.sign-in-dialog .tabBtn').on('click', function (event) {
        event.preventDefault();
        
        $('.siTabContent').removeClass('tab_active');
      //  $(this).parent().addClass('tab-active');
      //  $('.tabs-stage div').hide();
        $($(this).attr('href')).addClass('tab_active');
    });





    $('.scrollUp').click(function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 1000); 
        });

    $('header .form-control').on('keyup change', function(e){
        e.target.value != "" ? $(this).addClass('__filled') : $(this).removeClass('__filled');  
    });
    
    $('header .form-control').focus(function(){ 
        $(this).parent().addClass('__active');
    });

    $('header .form-control').on('blur', function(e){ 
        $(this).parent().removeClass('__active');
    });


    $('.navbar-toggler').click(function () { 
        $('body').toggleClass('navOpen');
    });
    
    $('.nav-close').click(function(){
        $('.navbar-toggler').click(); 
    });
     
    function scrollDOM(){
        var elemHash = window.location.hash;
        if(elemHash == '' || elemHash == '#'){
            document.body.scrollTop = 0; 
            document.documentElement.scrollTop = 0;     
        }else{
            if($(elemHash).length > 0){
                var yPos = document.querySelector(elemHash).offsetTop;
                document.body.scrollTop = yPos ; 
                document.documentElement.scrollTop = yPos ;   
            }
        } 
    }
    
    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
    
        if (scroll >= 20) {
            $("body").addClass("scrolled");
        } else {
            $("body").removeClass("scrolled");
        }
    });

    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
    
        if (scroll >= 100) {
            $("body").addClass("scrolled-more");
        } else {
            $("body").removeClass("scrolled-more");
        }
    });
        
    
/*    var $target = $('.navbar-toggler svg rect');
    setInterval(function(){
        $target.removeClass('square-active');
        var idx = Math.floor(Math.random() * $target.length);
        $target.eq(idx).addClass('square-active');
    }, 3000);*/   
    
    // if(window.innerWidth < 992 ){
    //     var i = 0;
    //     var $target = $('header .navbar-brand');
    //     setInterval(function () {
    //         $target.removeClass('active');
    //         $target.eq(i).addClass('active');
    //         if (i == $target.length - 1) i = 0;
    //         else i++;
    //     }, 4000); 
    // }

})(jQuery);