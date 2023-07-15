class VariantRadiosProductSingle extends HTMLElement {
    constructor() {
        super();
        this.querySelectorAll('.bls__option-swatch').forEach(
            (button) => button.addEventListener('click', this.onVariantChange.bind(this), false)
        );
    }

    onVariantChange(event) {
        event.preventDefault();
        const target = event.currentTarget;
        const value = target.getAttribute('data-value');
        for (var item of target.closest('fieldset').querySelectorAll('.bls__option-swatch')) {
            item.classList.remove('active');
        }
        target.classList.toggle('active');
        target.closest('fieldset').querySelector('.swatch-selected-value').textContent = value;
        this.options = Array.from(this.querySelectorAll('.bls__option-swatch.active'), (select) => select.getAttribute('data-value'));
        this.updateMasterId();
        this.toggleAddButton(true, '', false);
        if (!this.currentVariant) {
            this.toggleAddButton(true, '', true);
            this.setUnavailable();
        } else {
            this.updateVariantInput();
            this.renderProductInfo();
        }
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return this.options[index] === option;
            }).includes(false);
        });
    }

    updateVariantInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}`);
        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="id"]');
            input.value = this.currentVariant.id;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    renderProductInfo() {
        if (!this.currentVariant) return;
        let qty = 0;
        let percent = 0;
        let sale = false;
        let sold_out = false;
        let pre_order = false;
        let availability = window.variantStrings.inStock;
        let variantStrings = window.variantStrings.soldOut;
        const compare_at_price = this.currentVariant.compare_at_price;
        const price = this.currentVariant.price;
        const form = document.getElementById(`product-form-${this.dataset.section}`);
        const product = form.closest('.bls__product-single');
        this.getVariantQtyData().find((variantQty) => {
            if (variantQty.id === this.currentVariant.id) {
                qty = variantQty.qty;
            }
        });
        if (compare_at_price && compare_at_price > price) {
            sale = true;
            percent = (compare_at_price - price)/compare_at_price*100;
        }
        if (this.currentVariant.available && qty < 1) {
            availability = window.variantStrings.preOrder;
            variantStrings = window.variantStrings.preOrder;
        } else if (!this.currentVariant.available) {
            availability = window.variantStrings.outStock;
        } else {
            availability = window.variantStrings.inStock;
            variantStrings = window.variantStrings.addToCart;
        }
        if (product.querySelector('.bls__availability-value')) {
            product.querySelector('.bls__availability-value').textContent = availability;
        }
        if (this.currentVariant.available && qty < 1) {
            pre_order = true;
        } else if (!this.currentVariant.available) {
            sold_out = true
        }
        const product_label = product.querySelector('.bls__product-label');
        if (product_label) {
            product_label.remove();
        }
        if (sale || pre_order || sold_out) {
            var element = document.createElement('div');
            element.classList.add('bls__product-label', 'fs-12', 'pointer-events-none', 'absolute');
            product.querySelector('.bls__product-details').insertBefore(element, product.querySelector('.bls__product-details').children[0]);
            const label = product.querySelector('.bls__product-label');
            if (sold_out) {
                var element_sold_out = document.createElement('div');
                element_sold_out.classList.add('bls__sold-out-label');
                element_sold_out.innerText = window.variantStrings.soldOut;
                label.appendChild(element_sold_out);
            } else {
                if (sale) {
                    var element_sale = document.createElement('div');
                    element_sale.classList.add('bls__sale-label');
                    element_sale.innerText = -percent.toFixed(0)+'%';
                    label.appendChild(element_sale);
                } 
                if (pre_order) {
                    var element_pre_order = document.createElement('div');
                    element_pre_order.classList.add('bls__pre-order-label');
                    element_pre_order.innerText = window.variantStrings.preOrder;
                    label.appendChild(element_pre_order);
                }
            }
        }

        if (this.currentVariant.featured_media) {
            setTimeout(() => {
                product.querySelector('.bls__product-main-img img').removeAttribute('srcset');
                product.querySelector('.bls__product-main-img img').setAttribute('src', this.currentVariant.featured_media.preview_image.src);
            }, 500);
        }

        product.querySelector('.bls__product-sku-value').textContent = this.currentVariant.sku;
        const price_format = Shopify.formatMoney(this.currentVariant.price, cartStrings.money_format);
        product.querySelector('.price__regular .price').innerHTML = price_format;
        const bls__price = product.querySelector('.bls__price');
        bls__price.classList.remove('price--sold-out', 'price--on-sale');
        bls__price.querySelector('.price__regular .price').classList.remove('special-price');
        if (compare_at_price && compare_at_price > price) {
            const compare_format = Shopify.formatMoney(compare_at_price, cartStrings.money_format)
            bls__price.querySelector('.compare-price').innerHTML = compare_format;
            bls__price.classList.add('price--on-sale');
            bls__price.querySelector('.price__regular .price').classList.add('special-price');
        } else if (!this.currentVariant.available) {
            bls__price.classList.add('price--sold-out');
        }
        this.toggleAddButton(!this.currentVariant.available, variantStrings);
    }

    toggleAddButton(disable = true, text, modifyClass = true) {
        const productForm = document.getElementById(`product-form-${this.dataset.section}`);
        if (!productForm) return;
        const addButton = productForm.querySelector('[name="add"]');
        const addButtonText = productForm.querySelector('[name="add"] > span');
        if (!addButton) return;
        if (disable) {
            addButton.setAttribute('disabled', 'disabled');
        } else {
            addButton.removeAttribute('disabled');
        }
        if (text) addButtonText.textContent = text;

        if (!modifyClass) return;
    }

    setUnavailable() {
        const button = document.getElementById(`product-form-${this.dataset.section}`);
        const addButton = button.querySelector('[name="add"]');
        const addButtonText = button.querySelector('[name="add"] > span');
        const price = document.getElementById(`price-${this.dataset.section}`);
        if (!addButton) return;
        addButtonText.textContent = window.variantStrings.unavailable;
        if (price) price.classList.add('visibility-hidden');
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
    }

    getVariantQtyData() {
        this.variantQtyData = JSON.parse(this.querySelector('.productVariantsQty').textContent);
        return this.variantQtyData;
    }
}
customElements.define('variant-radios-product-single', VariantRadiosProductSingle);