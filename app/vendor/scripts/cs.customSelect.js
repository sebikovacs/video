(function($){
 $.fn.extend({
 
    customStyle : function(options) {
      if(!$.browser.msie || ($.browser.msie&&$.browser.version>6)){
      return this.each(function() {
            var currentSelected = $(this).find(':selected');
        	$(this).wrapAll('<div class="wrapper"/>');
            $(this).after('<span class="custom-style-select-box"><span class="custom-style-select-box-inner">'+currentSelected.text()+'</span></span><i class="icon-caret-down"></i>').css({zIndex:'1000',position:'absolute', opacity:0,fontSize:$(this).next().css('font-size')});
            var selectBoxSpan = $(this).next();
            var selectBoxWidth = parseInt($(this).outerWidth()) - parseInt(selectBoxSpan.css('padding-left')) -parseInt(selectBoxSpan.css('padding-right'));         
            var selectBoxSpanInner = selectBoxSpan.find(':first-child');
        	selectBoxSpan.css({display:'block', overflow:'hidden'});
            selectBoxSpanInner.css({width:(selectBoxWidth - 10), display:'inline-block'});
            var selectBoxHeight = parseInt(selectBoxSpan.height()) + parseInt(selectBoxSpan.css('padding-top')) + parseInt(selectBoxSpan.css('padding-bottom'));
            $(this).change(function(){
            	selectBoxSpanInner.text($(this).find(':selected').text()).parent().addClass('changed');
            });
            
      });
      }
    }
 });
})(jQuery);