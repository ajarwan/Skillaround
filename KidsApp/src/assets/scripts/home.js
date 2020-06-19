(function ($) {
    'use strict';
    var dir = document.documentElement.getAttribute('dir');
    
   

    $(document).on("ready", function () {


       

        $('ul.tabs li').click(function () {
            var tab_id = $(this).attr('data-tab');

            $(this).siblings().removeClass('current');
            $(this).parents('.tab-wrap').find('.tab-content').removeClass('current');
            //$('ul.tabs li').removeClass('current');
            //$('.tab-content').removeClass('current');  

            $(this).addClass('current');
            $("#" + tab_id).addClass('current');

            $('.slick-slider').slick('setPosition');

            /* setTimeout(function(){
                 newsSlider.update(); 
                 $('.slick-slider').slick('setPosition');   
             },50);*/
        });


        setTimeout(function () {
            //initMap(); 
        }, 1500);

    });


    $(window).resize(function () {
    })


    // for admin
    $(function() {

        $('[data-toggle="offcanvas"]').on("click", function () {
          $('.sidebar-offcanvas').toggleClass('active')
        });  
  
        $('.toggleBtn').bootstrapToggle();
  
        $(".progress").each(function() {
      
          var value = $(this).attr('data-value');
          var left = $(this).find('.progress-left .progress-bar');
          var right = $(this).find('.progress-right .progress-bar');
      
          if (value > 0) {
            if (value <= 50) {
              right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
            } else {
              right.css('transform', 'rotate(180deg)')
              left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
            }
          }
      
        })
      
        function percentageToDegrees(percentage) {
      
          return percentage / 100 * 360
      
        }
      
      });
    // for admin

})(jQuery);

(function ($) {
    'use strict';
    var viewport = window.innerWidth;



    $(document).ready(function () {

       

        $('body').addClass('is-loaded');

        $('.search-toggle').click(function (e) {
            $(this).parent().toggleClass('search-open')
        });


        scrollToDiv(60);


        $('.footer-links a').click(function (e) {
            e.preventDefault();
            var elem = $(this).attr('href');

            if (elem != '') {
                $('html, body').animate({
                    scrollTop: $(elem).offset().top - 70
                }, 500);
            }
        });
        
        

    });


    /*ACCORDION*/

    
    $(window).resize(function () {

    });

    function scrollToDiv(offset) {
        if (viewport < 992) {
            $('body').on('click', 'a.scroll', function (e) {
                $('.navbar-toggler').click();
            });
        }

        $('body').on('click', 'a.scroll', function (e) {
            e.preventDefault();
            $('.navbar-toggler').click();
            $(document).off("scroll");
            if ($(this).closest('.navbar-nav').length) {
                $('.navbar-nav a.scroll').each(function () {
                    $(this).parent().removeClass('active');
                });
                $(this).parent().addClass('active');
            }

            //  new scripts
            var target = $(this).attr('data-href');
            var $target = $(target);

            if (!$(target).length) {
                window.location.href = $(this).attr('href');
            }

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - offset
            }, 500, 'swing', function () {
                $(document).on("scroll");
            });
        });
    }

    /*--------------- MENU SCROLL ----------------------*/
    // Cache selectors
    var lastId, topMenu = $(".navbar-nav"),
        topMenuHeight = topMenu.outerHeight() + 60, // All list items
        menuItems = topMenu.find("a"), // Anchors corresponding to menu items
        scrollItems = menuItems.map(function () {
            var item = $($(this).attr("data-href"));
            if (item.length) {
                return item;
            }
        });

    $(window).scroll(function () {
        // Get container scroll position
        var fromTop = $(this).scrollTop() + topMenuHeight;
        // Get id of current scroll item
        var cur = scrollItems.map(function () {
            if ($(this).offset().top < fromTop) return this;
        });
        // Get the id of the current element
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";
        if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems.parent().removeClass("active").end().filter("[data-href='#" + id + "']").parent().addClass("active");
        }
    });

})(jQuery);

