"use strict";


var BlsWishlistPageShopify = (function() {
    return {
  
        initWishlistItems: function() {
            if (window.location.search.indexOf("page=") == -1) {
                this.init();
            }
        },
        
        init: function () {
            const wishlist_items = JSON.parse(localStorage.getItem('bls__wishlist-items'));
            const wishlistDiv = document.querySelector('.bls__wishlist-page-main');
            const div_no_product = wishlistDiv.querySelector('.bls__wishlist-no-product-js');
            if (wishlist_items === null || wishlist_items.length === 0) {
                div_no_product.classList.remove('d-none');
            }else{
                var query = '';
                wishlist_items.forEach((e, key, wishlist_items) => {
                    
                    if (!Object.is(wishlist_items.length - 1, key)) {
                    query += e+'%20OR%20handle:';
                    }
                    else{
                    query += e;
                    }
                })

                var productAjaxURL = "?view=wishlist&type=product&options[unavailable_products]=last&q=handle:"+query

                fetch(`${window.routes.search_url}${productAjaxURL}`)
                .then(response => response.text())
                .then((responseText) => {
                    const html = parser.parseFromString(responseText, 'text/html');
                    const row = document.createElement('div');
                    row.classList.add('row');
                    const exist_row = wishlistDiv.querySelector('.row');
                    if (exist_row) {
                        exist_row.remove();
                    }
                    if(wishlist_items.length !== 0 ){
                        wishlistDiv.innerHTML = html.querySelector(".bls__wishlist-page-section-inner").innerHTML
                    }
                }).catch((e) => {
                    console.error(e);
                }).finally(e => {
                    BlsColorSwatchesShopify.init();
                    BlsSubActionProduct.handleInitQuickviewAction();
                    BlsSubActionProduct.init();
                    BlsSectionProductAddCart.init();
                    BlsLazyloadImg.init();
                })   
            }
        }
      }
  })();
  BlsWishlistPageShopify.initWishlistItems();