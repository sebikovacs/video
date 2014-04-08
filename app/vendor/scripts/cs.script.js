/* SHARED VARS */
var firstrun = true,
    liveEffects = ['fade','scale'],
    liveEasing = 'smooth',
    liveSpeed = 500,
    touch = false,
    list = false,
    clickEv = 'click';

/* SANDBOX */
function mixSandBox(){
  
  // INSTANTIATE MIXITUP ON SANDBOX
  
  if($('#sandBox').length){
    $('#sandBox').mixitup({
      buttonEvent: clickEv,
      onMixStart: function(config){
        
        // PAUSE LOGO ON SANDBOX ACTIVITY
        if(typeof timer != 'undefined'){
          clearInterval(timer);
        };
        if(typeof counter != 'undefined'){
          clearInterval(counter);
        };
        
        // UPDATE EFFECTS LIST
        config.effects = liveEffects;
        
        // UPDATE EASING
        config.easing = liveEasing;
        
        // UPDATE SPEED
        config.transitionSpeed = liveSpeed;
        
        return config;
      },
      onMixEnd: function(config){
        
        // ADD LIST STYING
        var wait = setTimeout(function(){
          if(config.layoutMode == 'list'){
            list = true;
          };
          
          sortSandBox();
        },100);
      }
    });
  }
}

function sortSandBox(){
  var listSB = $('#sandBox .item');
  listSB.removeClass('first');
  $("#sandBox .item:nth-child(4n)").addClass('first');
}

var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

/* Handle pagination in collection page */
var pInfScrDelay = 2000;
function pInfScrExecute() {
	pInfScrNode = $('.collection .more').last();
	pInfScrURL = $('.collection .more a').last().attr("href");
	
	if (pInfScrNode.length > 0 && pInfScrNode.css('display') != 'none') {
	  $.ajax({
		type: 'GET',
		url: pInfScrURL,
		beforeSend: function () {
		  pInfScrNode.clone().empty().insertAfter(pInfScrNode).append('<img src="./assets/images/loader.gif">');
		  pInfScrNode.hide();
		},
		success: function (data) {
		  setTimeout(function() {
			pInfScrNode.next().remove();
			pInfScrNode.remove();
			var filteredData = $(data).find(".collection-matrix");
			filteredData.insertBefore($("#product-list-foot"));
          }, pInfScrDelay);
		},
		dataType: "html"
	  });
	}
}

function attachClickEvent() {
	$('.collection .more a').click(function (event) {
	  pInfScrExecute();
	  event.stopPropagation();
	  return false;
	});
}

/* Fucntion get width browser */
function getWidthBrowser() {
  var myWidth;
  
  if( typeof( window.innerWidth ) == 'number' ) { 
    //Non-IE 
    myWidth = window.innerWidth;
    //myHeight = window.innerHeight; 
  } 
  else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { 
    //IE 6+ in 'standards compliant mode' 
    myWidth = document.documentElement.clientWidth; 
    //myHeight = document.documentElement.clientHeight; 
  } 
    else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { 
      //IE 4 compatible 
      myWidth = document.body.clientWidth; 
      //myHeight = document.body.clientHeight; 
    }
    
    return myWidth;
}

// handles Animate
function dataAnimate(){
  $('[data-animate]').each(function(){
    
    var $toAnimateElement = $(this);
    
    var toAnimateDelay = $(this).attr('data-delay');
    
    var toAnimateDelayTime = 0;
    
    if( toAnimateDelay ) { toAnimateDelayTime = Number( toAnimateDelay ); } else { toAnimateDelayTime = 200; }
    
    if( !$toAnimateElement.hasClass('animated') ) {
      
      $toAnimateElement.addClass('not-animated');
      
      var elementAnimation = $toAnimateElement.attr('data-animate');
      
      $toAnimateElement.appear(function () {
        
        setTimeout(function() {
          $toAnimateElement.removeClass('not-animated').addClass( elementAnimation + ' animated');
        }, toAnimateDelayTime);
        
      },{accX: 0, accY: -80},'easeInCubic');
      
    }
    
  });
}

/* Handle Add to Cart */
function handleAddToCart(){
	$('body').on('click', '.add-to-cart',function(e) {
		if (typeof e !== 'undefined') e.preventDefault();
		var $this = $(this);
		
		// Hide Modal
		$('.modal').modal('hide');
		
		// Fly image to Cart
		var parent = $this.parents($this.attr('data-parent'));
		var image = $(parent).prev().find('.image-fly');
		flyToCart(image, '#umbrella .cart-link', 700);
		
		// Notify Cart
		var cartURL = './ajax/_product-cart.html';
		$.ajax({
			type: 'GET',
			url: cartURL,
			beforeSend: function () {
			},
			success: function (data) {
			  notifyProduct(data);
			},
			dataType: "html"
		});
	});
}
function flyToCart(imgobj, cart, time){
  
  if(imgobj){
    var imgsrc = imgobj.attr('src');

    imgobj.animate_from_to(cart, {
      pixels_per_second: time, 
      initial_css: {
        'image': imgsrc
      },
      callback: function(){
      }
    });
  }
}
function notifyProduct($info){
  var wait = setTimeout(function(){
    $.jGrowl($info,{life: 5000 });	
  },200);
}

// Scroll parallax elements
function scrollParallaxElements() {
  if(touch == false){
    $('.parallax').each(function() {
      var $this   = $(this);
      $this.css('background-position', '50% 0px');
    });
  }
}

function callbackSearchMobile(){
  var button = $('.is-mobile .is-mobile-search i');
  var form = $('.is-mobile .is-mobile-search .search-form');
  button.mouseup(function(search) {
    form.show();
  });
  form.mouseup(function() { 
    return false;
  });
  $(this).mouseup(function(search) {
    if(!($(search.target).parent('.is-mobile .is-mobile-search').length > 0)) {
      form.hide();
    }
  });  
}

// Perform operations upon scrolling the window
$(window).scroll(function() {
  // Scroll parallax elements
  scrollParallaxElements();
  
  
  // Listener for header
  var scrollTop = $(this).scrollTop();
  var heightHeader = $('#top').outerHeight();
  
  if(getWidthBrowser() >= 1024){
    if(scrollTop > heightHeader){
      $('#topnavigation').addClass('on');
    }
    else{
      $('#topnavigation').removeClass('on');
    }
  }
  
  if($(this).scrollTop()>600){
	$('#bttop').fadeIn();
  }
	else{
	$('#bttop').fadeOut();
  }
});

$(window).resize(function() {
  if(getWidthBrowser() < 1024){
    $('#topnavigation').removeClass('on');
  }
});


/* zoom image elevateZoom */
$(window).load(function() {
  if(touch == false){
    if($("#product-img").length){
		$("#product-img").elevateZoom({
			scrollZoom : true,
			gallery:'gallery_01',     
			cursor: 'pointer',
			containLensZoom: true,
			zoomType:'window',
			zoomWindowWidth: 300,
			zoomWindowHeight: 400,
			galleryActiveClass: 'active',
			loadingIcon: './assets/images/loader.gif'
		});
		   
		   
	    //pass the images to Fancybox
	    $("#product-img").bind("click", function(e) {  
			var ez =   $('#product-img').data('elevateZoom');	
			$.fancybox(ez.getGalleryList());
			return false;
		});
	}
   }
});


jQuery(document).ready(function($) {
  
  /* DETECT PLATFORM */
  $.support.touch = 'ontouchend' in document;
  
  if ($.support.touch) {
    touch = true;
    $('body').addClass('touch');
    clickEv = 'touchstart';
  }
  else{
    $('body').addClass('notouch');
    scrollParallaxElements();
  }
  
  /* Handle Scroll to top */
  $("#bttop").click(function (e) {
    e.preventDefault();
    $('body,html').animate({scrollTop:0},800,'swing');
  });

  /* Handle Animate */
  if(touch == false){
    dataAnimate();
  }
  
  /* Handle Add to Cart */
  handleAddToCart();
  
  /* Handle pagination in collection page */
  attachClickEvent();
  
  /* Focus Newsletter */
  $("input#email-input").focus(function() {
    $(this).parent().addClass('focus');
  }).blur(function() {
    $(this).parent().removeClass('focus');
  });
  
  /* Handle Main Carousel */
  if($("#homeCarousel").length){
	$("#homeCarousel").owlCarousel({
		items: 2,
		itemsDesktop: [1199, 3],
		mouseDraggable: false,
		stopOnHover: true,
		slideSpeed: 1000,
		autoPlay: false,
		pagination: true,
		scrollPerPage: true
	});
  }
  
  /* Handle Homepage Featured Collections */
  if($("#home_collections").length){
	$("#home_collections").owlCarousel({
		items: 6,
		itemsDesktop: [1199, 3],
		pagination: false,
		slideSpeed: 1000,
		scrollPerPage: true,
		navigation: true,
		navigationText: [
		  "<i class='icon-long-arrow-left prev-home-collections'></i>",
		  "<i class='icon-long-arrow-right next-home-collections'></i>"
		],
		beforeMove: function (elem) {
		  if (touch == false) {
			var that = $(
			  "#home_collections");
			var items = that.find(
			  '.not-animated');
			items.removeClass(
			  'not-animated')
			.unbind('appear');
		  }
		}
	});
  }
  
  /* Handle Homepage Featured Products */
  if($("#product-sliders").length){
	$("#product-sliders").owlCarousel({
	  items : 4,
	  itemsDesktop : [1199,3],
	  pagination : false,
	  slideSpeed : 1000,
	  scrollPerPage : true,
	  navigation: true,
	  navigationText: [
		"<i class='icon-long-arrow-left prev-featured-product'></i>",
		"<i class='icon-long-arrow-right next-featured-product'></i>"
	  ],
	  beforeMove: function(elem) {
		if(touch == false){
		  var that = $("#product-sliders");
		  var items = that.find('.not-animated');
		  items.removeClass('not-animated').unbind('appear');
		}
	  }
	});
  }
  
  /* Handle Related Proeducts */
  if($(".prod-related").length){
	$(".prod-related").owlCarousel({
		items: 4,
		itemsDesktop: [1199, 3],
		pagination: false,
		slideSpeed: 1000,
		scrollPerPage: true,
		navigation: true,
		navigationText: ["<i class='icon-long-arrow-left slider-pro-prev'></i>", "<i class='icon-long-arrow-right slider-pro-next'></i>"],
		beforeMove: function (elem) {
		  if (touch == false) {
			var that = $(".prod-related");
			var items = that.find('.not-animated');
			items.removeClass('not-animated')
			.unbind('appear');
		  }
		}
	});
  }
  
  /* Handle Product thumbs */
  if($("#product .product-thumb").length){
	$("#product .product-thumb").carouFredSel({
	  circular: false,
	  infinite: false,
	  responsive: true,
	  direction: 'down',
	  prev: '#product .prev-thumb',
	  next: '#product .next-thumb',
	  height: '100%',
	  auto: false,
	  swipe: {
		onMouse: true,
		onTouch: true
	  },
	  items: {
		width: '100%',
		visible: {
		  min: 1,
		  max: 3
		}
	  }
	});
  }
  if($("#product .product-thumb-hid").length){
	$("#product .product-thumb-hid").carouFredSel({
	  circular: false,
	  infinite: false,
	  responsive: true,
	  //mousewheel: true,
	  prev: '#product .prev-thumb-hid',
	  next: '#product .next-thumb-hid',
	  width: '100%',
	  auto: false,
	  swipe: {
		onMouse: true,
		onTouch: true
	  },
	  items: {
		width:80,
		height: 80,
		visible: {
		  min: 1,
		  max: 5
		}
	  }
	});
  }
  
  /* Handle Quickshop */
  $('body').on('click','.quick_shop',function(e){
	 var action = $(this).attr('data-target');
	 $.ajax({
	  url : action,
	  type: "GET",
	  success: function(response) {
	   $('<div class="modal fade" tabindex="-1" data-width="800" aria-hidden="true"></div>').html(response).modal();
	   
	   $("#product-img-qs")
		.elevateZoom({
		  gallery: 'gallery_01_qs',
		  scrollZoom: true,
		  cursor: 'pointer',
		  zoomType: 'window',
		  zoomWindowWidth: 300,
		  zoomWindowHeight: 400,
		  galleryActiveClass: 'active',
		  loadingIcon: './assets/images/loader.gif'
		});
		$("#product-img-qs").bind("click", function (e) {
		  var ez = $('#product-img-qs')
		  .data('elevateZoom');
		  $.fancybox(ez.getGalleryList());
		  return false;
		});
		$('#quick-shop-image').on('touchstart', '.thumb-zoom', function () {
		  var $this = $(this);
		  var parent = $this.parents('.product-image-thumb');
		  var child = $this.find('img');
		  var src_original = child.attr('data-src-original');
		  var src_display = child.attr('data-src-display');
		  parent.find('.thumb-zoom')
		  .removeClass('active');
		  $this.addClass('active');
		  parent.find('.main-image')
		  .find('img')
		  .attr('data-zoom-image', src_original);
		  parent.find('.main-image')
		  .find('img')
		  .attr('src', src_display);
		  return false;
		});
		$("#quick-shop-image .product-thumb").carouFredSel({
		  circular: false,
		  infinite: false,
		  responsive: true,
		  direction: 'down',
		  prev: '#quick-shop-image .prev-thumb',
		  next: '#quick-shop-image .next-thumb',
		  height: '100%',
		  auto: false,
		  swipe: {
			onMouse: true,
			onTouch: true
		  },
		  items: {
			width: '100%',
			visible: {
			  min: 1,
			  max: 3
			}
		  }
		});
	  }
	 });
	 e.preventDefault();
  });
  $('body').on('hidden.bs.modal', '.modal', function() {
	 $(this).remove();
  });
  
  // Create contact map
  /* GMap */
  if(jQuery().gMap){
    $('#contact_map').gMap({
      zoom: 17,
      scrollwheel: false,
      maptype: 'ROADMAP',
      markers:[
        {
          address: '249 Ung Văn Khiêm, phường 25, Ho Chi Minh City, Vietnam',
          html: '_address'
        }
      ]
    });
  }
  
  callbackSearchMobile();
  
  //add class if MAC_safari
  if (navigator.appVersion.indexOf("Mac")!=-1){
    if (navigator.userAgent.indexOf("Safari") > -1){
      $('body').addClass('macos');
    }
  }
  
  $(".dropdown-toggle").parent().hover(function (){
    if(touch == false && getWidthBrowser() > 768 ){
      $(this).find('.dropdown-menu').stop(true, true).slideDown(300);
    }
  }, function (){
    if(touch == false && getWidthBrowser() > 768 ){
      $(this).find('.dropdown-menu').hide();
    }
  });
  
  $('.dropdown-menu').on(clickEv, function (e) {
    e.stopPropagation();
  });
  $('.dropdown-menu').on('click', function (e) {
    e.stopPropagation();
  });
  $('.btn-navbar').on('click', function() {
    return true;
  });
  
  $('#collection_tags').on('change', function() {
    window.location = $(this).val();
  });
  
  if($("img.unveil").length){
    $("img.unveil").unveil(300);
  }
  
  /* Product image */
   
  $('#product').on(clickEv, '.thumb-zoom a', function() {
    
    var $this = $(this);
    var parent = $this.parents('.product-image');
    var child = $this.find('img');
    var src_original = child.attr('data-src-original');
    var src_display = child.attr('data-src-display');

    parent.find('.thumb-zoom a').removeClass('active');
    $this.addClass('active');
    
    parent.find('.main-image').find('img').attr('data-zoom-image', src_original);
    parent.find('.main-image').find('img').attr('src', src_display);
    
    return false;
  });
  
  /* Quantity */
  $('body').on('click', '.qty-up', function() {
    var $this = $(this);
    
    var qty = $this.data('src');
    $('body '+qty).val(parseInt($(qty).val()) + 1);
  });
  $('body').on(clickEv, '.qty-down', function() {
    var $this = $(this);
    
    var qty = $this.data('src');
    
    if(parseInt($(qty).val()) > 1)
    	$('body '+qty).val(parseInt($(qty).val()) - 1);
  });

  
  /* Tooltip */
  $('.btooltip').tooltip();
   
  /* Add class hover for product */
   $('.row-left .hoverBorder').hover( function() {
     $(this).addClass('hover');
   }, function() {
     $(this).removeClass('hover');
   });
  

  /* INSTANTIATE SANDBOX */
  mixSandBox();
  
  /* Sort by */
  $('#sortForm li.sort').click(function(){  // add event any time the sort box changes
    
    var button = $('#sortButton');
    var box = $('#sortBox');
    
    $('#sortButton .name').html($(this).html());
    
    button.removeClass('active');
    box.hide();
  });
  
  sortbyPopup();
  function sortbyPopup(){
    var warper = $('#sortButtonWarper');
    var button = $('#sortButton');
    var box = $('#sortBox');
    var form = $('#sortBox #sortForm');
    warper.click(function(sort) {
      box.toggle();
      button.toggleClass('active');
    });
    form.mouseup(function() { 
      return false;
    });
    $(this).mouseup(function(sort) {
      if(!($(sort.target).parent('#sortButton').length > 0)) {
        button.removeClass('active');
        box.hide();
      }
    });
  }
  
  /* GRID/LIST */
  
  $('#goList').on(clickEv, function(e){
    $(this).parent().find('li').removeClass('active');
    $(this).addClass('active');
    
    $('#sandBox .mix').addClass('full_width');
    $('#sandBox .mix .row-left').addClass('span4');
    $('#sandBox .mix .row-right').addClass('span8');
    
    $('#sandBox').mixitup('toList');
  });
  
  $('#goGrid').on(clickEv, function(e){
    $(this).parent().find('li').removeClass('active');
    $(this).addClass('active');
    
    $('#sandBox .mix').removeClass('full_width');
    $('#sandBox .mix .row-left').removeClass('span4');
    $('#sandBox .mix .row-right').removeClass('span8');
    
    $('#sandBox').mixitup('toGrid');
  });
});