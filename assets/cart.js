function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
}

class CartRemoveButton extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', (event) => {
        event.preventDefault();
        const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
        cartItems.updateQuantity(this.dataset.index, 0);
      });
    }
}
customElements.define('cart-remove-button', CartRemoveButton);
  
class CartItems extends HTMLElement {
    constructor() {
      super();
      this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
        .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
  
      this.debouncedOnChange = debounce((event) => {
        this.onChange(event);
      }, 300);
  
      this.addEventListener('change', this.debouncedOnChange.bind(this));
      document.querySelectorAll('.bls__add-giftwrap-cart').forEach(
        (giftwrap) => giftwrap.addEventListener('click', this.addGiftwrapCartClick.bind(this))
    );
    }
  
    onChange(event) {
      this.updateQuantity(event.target.dataset.index, event.target.dataset.key, event.target.value, document.activeElement.getAttribute('name'));
    }
  
    getSectionsToRender() {
      return [
        {
          id: 'main-cart-items',
          section: document.getElementById('main-cart-items').dataset.id,
          selector: '.js-contents',
        }
      ];
    }
  
    updateQuantity(line, key, quantity, name) {
        quantity = quantity ? quantity : 0;
        this.enableLoading(line);
    
        const body = JSON.stringify({
            line,
            quantity,
            sections: this.getSectionsToRender().map((section) => section.section),
            sections_url: window.location.pathname
        });
  
      fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
        .then((response) => {
          return response.text();
        })
        .then((state) => {
            const parsedState = JSON.parse(state);
            document.querySelectorAll(".cart-count").forEach(el => {
                el.innerHTML = parsedState.item_count;
            })
            const html = new DOMParser().parseFromString(parsedState.sections[document.getElementById('main-cart-items').dataset.id], 'text/html');
            if (parsedState.item_count == 0) {
                this.getSectionsToRender().forEach((section => {
                    const elementToReplace = document.querySelector('.cart-wrapper');
                    elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], '.cart-wrapper');
                }));
            } else {
                this.getSectionsToRender().forEach((section => {
                    const elementToReplace =
                        document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
                    elementToReplace.innerHTML =
                        this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
                }));
                const totals = this.getSectionInnerHTML(parsedState.sections[document.getElementById('main-cart-items').dataset.id], '.cart__footer .totals');
                const totals_content = document.querySelector('.cart__footer .totals');
                if (totals && totals_content) totals_content.innerHTML = totals;
                const cart_gift_html = html.getElementById('bls__gift');
                const cart_gift = document.getElementById('bls__gift');
                if ( cart_gift ) {
                    cart_gift.innerHTML = cart_gift_html.innerHTML;
                    document.querySelectorAll('.bls__add-giftwrap-cart').forEach(
                        (giftwrap) => giftwrap.addEventListener('click', this.addGiftwrapCartClick.bind(this))
                    );
                }

                const cart_threshold = document.querySelector('.bls__cart-thres-js');
                if ( cart_threshold) {
                    if (html.querySelector('.bls__cart-thres-js').classList.contains('cart_shipping_free')) {
                        cart_threshold.classList.add('cart_shipping_free');
                    } else {
                        cart_threshold.classList.remove('cart_shipping_free');
                    }
                    cart_threshold.querySelector('.bls__cart-thres').innerHTML = html.querySelector('.bls__cart-thres').innerHTML;
                    setTimeout(function() {
                        cart_threshold.querySelector('.percent_shipping_bar').setAttribute('style', html.querySelector('.percent_shipping_bar').getAttribute('style'));
                    }, 500);
                }
                this.updateLiveRegions(line, key, parsedState.item_count);
            }
            this.disableLoading();
        }).catch(() => {
            this.disableLoading();
        }).finally(() => {
          BlsLazyloadImg.init();
        });
    }
  
    updateLiveRegions(line, key, itemCount) {
        
      if (this.currentItemCount === itemCount) {
        
        const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
        const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
        for (var item of document.querySelectorAll('.cart-item__error-text')) {
            item.classList.remove('error');
        }
        lineItemError
          .querySelector(`.cart-item__error-text-${key}`).classList.add('error');
        lineItemError
          .querySelector(`.cart-item__error-text-${key}`)
          .innerHTML = window.cartStrings.quantityError.replace(
            '[quantity]',
            quantityElement.value
          );
      }
  
      this.currentItemCount = itemCount;
    }

    addGiftwrapCartClick(event) {
        event.preventDefault();
        const target = event.currentTarget;
        const variant_id = target.getAttribute('data-variant-id');
        const body = JSON.stringify({
            id: Number(variant_id),
            quantity: 1,
            sections: this.getSectionsToRender().map((section) => section.section),
            sections_url: window.location.pathname
        });
      
        fetch(`${routes.cart_add_url}`, {...fetchConfig(), ...{ body }})
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const parsedState = JSON.parse(state);
            fetch('/cart.json')
            .then(res => res.json())
            .then(cart => {
                document.querySelectorAll(".cart-count").forEach(el => {
                    el.innerHTML = cart.item_count;
                });
            })
            .catch((error) => {
                throw error;
            });
            const html = new DOMParser().parseFromString(parsedState.sections[document.getElementById('main-cart-items').dataset.id], 'text/html');
            if (parsedState.item_count == 0) {
                this.getSectionsToRender().forEach((section => {
                    const elementToReplace = document.querySelector('.cart-wrapper');
                    elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], '.cart-wrapper');
                }));
            } else {
                this.getSectionsToRender().forEach((section => {
                    const elementToReplace =
                        document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
                    elementToReplace.innerHTML =
                        this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
                }));
    
                const totals = this.getSectionInnerHTML(parsedState.sections[document.getElementById('main-cart-items').dataset.id], '.cart__footer .totals');
                const totals_content = document.querySelector('.cart__footer .totals');
                if (totals && totals_content) totals_content.innerHTML = totals;

                const cart_gift_html = html.getElementById('bls__gift');
                const cart_gift = document.getElementById('bls__gift');
                if ( cart_gift ) {
                    cart_gift.innerHTML = cart_gift_html.innerHTML;
                }

                const cart_threshold = document.querySelector('.bls__cart-thres-js');
                if ( cart_threshold) {
                    if (html.querySelector('.bls__cart-thres-js').classList.contains('cart_shipping_free')) {
                        cart_threshold.classList.add('cart_shipping_free');
                    } else {
                        cart_threshold.classList.remove('cart_shipping_free');
                    }
                    cart_threshold.querySelector('.bls__cart-thres').innerHTML = html.querySelector('.bls__cart-thres').innerHTML;
                    setTimeout(function() {
                        cart_threshold.querySelector('.percent_shipping_bar').setAttribute('style', html.querySelector('.percent_shipping_bar').getAttribute('style'));
                    }, 500);
                }
            }
            this.disableLoading();
            BlsLazyloadImg.init();
        }).catch(() => {
            this.disableLoading();
        });
    }
  
    getSectionInnerHTML(html, selector) {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
  
    enableLoading(line) {
        document.body.classList.add('start', 'loading');
        document.activeElement.blur();
    }
  
    disableLoading() {
        document.body.classList.add('finish');
        setTimeout(function() {
            document.body.classList.remove('start', 'loading', 'finish');
        }, 500)
    }
}
  
customElements.define('cart-items', CartItems);
  
if (!customElements.get('cart-note')) {
    customElements.define('cart-note', class CartNote extends HTMLElement {
      constructor() {
        super();
        this.addEventListener('change', debounce((event) => {
          const body = JSON.stringify({ note: event.target.value });
          fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{ body }});
        }, 300))
      }
    });
};
  