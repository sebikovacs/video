Shopify.updateCartInfo = function(cart, cart_summary_id, cart_count_id) {
	if ((typeof cart_summary_id) === 'string') {
		var cart_summary = jQuery('#' + cart_summary_id);
		if (cart_summary.length) {
			// Start from scratch.
			cart_summary.empty();
			// Pull it all out.
          	
			jQuery.each(cart, function(key, value) {
				if (key === 'items') {
					
					if (value.length) {
                      	jQuery('<div class="items control-container"></div>').appendTo(cart_summary);
						var table = jQuery('#' + cart_summary_id + ' div.items');
                      
						jQuery.each(value, function(i, item) {						
							jQuery('<div class="row-fluid"><div class="span3 cart-left"><div class="close_btn"><a class="cart-close" title="Remove" href="javascript:void(0);" onclick="Shopify.removeItem(' + item.variant_id + ')"><i class="icon-remove-sign"></i></a></div><a class="cart-image" href="' + item.url + '"><img src="' + item.image + '" alt="" title=""/></a></div><div class="span9 cart-right"><div class="cart-title"><a href="' + item.url + '">' + item.title + '</a></div><div class="cart-price"><span class="money">' + Shopify.formatMoney(item.price) + '</span> x ' + item.quantity + '</div></div></div>').appendTo(table);
						});
						
						jQuery('<div class="row-fluid last"><div class="span6">Total</div><div class="span6 text-right"><span class="money">' + Shopify.formatMoney(cart.total_price) + '</span></div></div>').appendTo(table);
						
						jQuery('<div class="row-fluid"><button class="btn btn-block btn-1" onclick="window.location=\'/checkout\'">Checkout</button></div><div class="row-fluid"><button class="btn btn-block btn-4" onclick="window.location=\'/cart\'">View Shopping Cart</button></div>').appendTo(cart_summary);
					}
					else {
						jQuery('<div class="empty text-center"><em>Your shopping cart is empty. Check out our <a href="/collections/all">catalog</a> to see what\'s available.</em></div>').appendTo(cart_summary);
					}
				}
			});
			
			
		}
	}
	// Update cart count.
	if ((typeof cart_count_id) === 'string') {
		if (cart.item_count == 0) { 
			jQuery('#' + cart_count_id).html('your cart is empty'); 
		}
		else if (cart.item_count == 1) {
			jQuery('#' + cart_count_id).html('1 item in your cart');
		}
		else {
			jQuery('#' + cart_count_id).html(cart.item_count + ' items in your cart');
		}
	}
  
  /* Update cart info */
  updateCartDesc(cart);
  
  /* Update currency */
  jQuery('[name=currencies]').change();
};

Shopify.onCartUpdate = function(cart) {
	Shopify.updateCartInfo(cart, 'cart-info', 'shopping-cart');
};

jQuery(document).ready(function($) {
	
  // Let's get the cart and show what's in it in the cart box.	
  Shopify.getCart(function(cart) {
    
    Shopify.updateCartInfo(cart, 'cart-info');		
  });
  
});