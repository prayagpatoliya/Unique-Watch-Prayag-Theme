"use strict";
window.theme = window.theme || {};
const options = {
    templateProduct: '.bls__template-product',
    flashSold: '.bls__flash-sold',
    countdownTimer: '.bls__countdown-timer',
    visitors: '.bls__visitors',
    countdowProduct: '.bls__countdow-product',
    paymentButton: '.bls__payment-button',
    navTabs: '.nav-tabs a',
    accorditionTabs: '.data.accordition',
    productInfomationTab: '.bls__product-tabs-content',
    tabContent: '.tab-content .tab-item',
    productAddons: '.bls__product_addons',
    shareCopy: '.bls__share-copy',
    compareColorsBtn: '.bls__compare-color-btn',
    photoZoomImage: '.bls__zoom-image',
    mediaImage: '.bls__media-image'
};

theme.ProductVideo = (function() {
    var videos = {};
  
    var hosts = {
        shopify: 'shopify',
        external: 'external'
    };
  
    var selectors = {
        productMediaWrapper: '[data-product-single-media-wrapper]'
    };
  
    var attributes = {
        enableVideoLooping: 'enable-video-looping',
        videoId: 'video-id'
    };
  
    function init(videoContainer, sectionId) {
        if (!videoContainer) {
            return;
        }
  
        var videoElement = videoContainer.querySelector('iframe, video');
  
        if (!videoElement) {
            return;
        }
  
        var mediaId = videoContainer.getAttribute('data-product-media-id');
        videos[mediaId] = {
            mediaId: mediaId,
            sectionId: sectionId,
            host: hostFromVideoElement(videoElement),
            container: videoContainer,
            element: videoElement,
            ready: function() {
                createPlayer(this);
            }
        };
  
        window.Shopify.loadFeatures([
            {
                name: 'video-ui',
                version: '2.0',
                onLoad: setupVideos
            }
        ]);
        theme.LibraryLoader.load('plyrShopifyStyles');
    }
  
    function setupVideos(errors) {
        if (errors) {
            fallbackToNativeVideo();
            return;
        }
    
        loadVideos();
    }
  
    function createPlayer(video) {
        if (video.player) {
            return;
        }
        
        var productMediaWrapper = video.container.closest(
            selectors.productMediaWrapper
        );
  
        var enableLooping = productMediaWrapper.getAttribute(
          'data-' + attributes.enableVideoLooping
        ) === 'true';
  
      // eslint-disable-next-line no-undef
        video.player = new Shopify.Video(video.element, {
            loop: { active: enableLooping }
        });
  
        var pauseVideo = function() {
            if (!video.player) return;
            video.player.pause();
        };
  
        productMediaWrapper.addEventListener('mediaHidden', pauseVideo);
        productMediaWrapper.addEventListener('xrLaunch', pauseVideo);

        productMediaWrapper.addEventListener('mediaVisible', function() {
            if (theme.Helpers.isTouch()) return;
            if (!video.player) return;
            video.player.play();
        });
    }
  
    function hostFromVideoElement(video) {
        if (video.tagName === 'VIDEO') {
            return hosts.shopify;
        }
    
        return hosts.external;
    }
  
    function loadVideos() {
        for (var key in videos) {
            if (videos.hasOwnProperty(key)) {
                var video = videos[key];
                video.ready();
            }
        }
    }
  
    function fallbackToNativeVideo() {
        for (var key in videos) {
            if (videos.hasOwnProperty(key)) {
                var video = videos[key];
        
                if (video.nativeVideo) continue;
        
                if (video.host === hosts.shopify) {
                    video.element.setAttribute('controls', 'controls');
                    video.nativeVideo = true;
                }
            }
        }
    }
  
    function removeSectionVideos(sectionId) {
        for (var key in videos) {
            if (videos.hasOwnProperty(key)) {
                var video = videos[key];
        
                if (video.sectionId === sectionId) {
                    if (video.player) video.player.destroy();
                    delete videos[key];
                }
            }
        }
    }
  
    return {
        init: init,
        hosts: hosts,
        loadVideos: loadVideos,
        removeSectionVideos: removeSectionVideos
    };
})();

theme.ProductModel = (function() {
    var modelJsonSections = {};
    var models = {};
    var xrButtons = {};
  
    var selectors = {
      mediaGroup: '[data-product-single-media-group]',
      xrButton: '[data-shopify-xr]'
    };
  
    function init(modelViewerContainers, sectionId) {
      modelJsonSections[sectionId] = {
        loaded: false
      };
  
      modelViewerContainers.forEach(function(modelViewerContainer, index) {
        var mediaId = modelViewerContainer.getAttribute('data-product-media-id');
        var modelViewerElement = modelViewerContainer.querySelector(
          'model-viewer'
        );
        var modelId = modelViewerElement.getAttribute('data-model-id');
  
        if (index === 0) {
          var mediaGroup = modelViewerContainer.closest(selectors.mediaGroup);
          var xrButton = mediaGroup.querySelector(selectors.xrButton);
          xrButtons[sectionId] = {
            element: xrButton,
            defaultId: modelId
          };
        }
  
        models[mediaId] = {
          modelId: modelId,
          sectionId: sectionId,
          container: modelViewerContainer,
          element: modelViewerElement
        };
      });
  
      window.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: setupShopifyXr
        },
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: setupModelViewerUi
        }
      ]);
      theme.LibraryLoader.load('modelViewerUiStyles');
    }
  
    function setupShopifyXr(errors) {
      if (errors) return;
  
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', function() {
          setupShopifyXr();
        });
        return;
      }
  
      for (var sectionId in modelJsonSections) {
        if (modelJsonSections.hasOwnProperty(sectionId)) {
          var modelSection = modelJsonSections[sectionId];
  
          if (modelSection.loaded) continue;
          var modelJson = document.querySelector('#ModelJson-' + sectionId);
  
          window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
          modelSection.loaded = true;
        }
      }
      window.ShopifyXR.setupXRElements();
    }
  
    function setupModelViewerUi(errors) {
      if (errors) return;
  
      for (var key in models) {
        if (models.hasOwnProperty(key)) {
          var model = models[key];
          if (!model.modelViewerUi) {
            model.modelViewerUi = new Shopify.ModelViewerUI(model.element);
          }
          setupModelViewerListeners(model);
        }
      }
    }
  
    function setupModelViewerListeners(model) {
      var xrButton = xrButtons[model.sectionId];
  
      model.container.addEventListener('mediaVisible', function() {
        xrButton.element.setAttribute('data-shopify-model3d-id', model.modelId);
        if (theme.Helpers.isTouch()) return;
        model.modelViewerUi.play();
      });
  
      model.container.addEventListener('mediaHidden', function() {
        xrButton.element.setAttribute(
          'data-shopify-model3d-id',
          xrButton.defaultId
        );
        model.modelViewerUi.pause();
      });
  
      model.container.addEventListener('xrLaunch', function() {
        model.modelViewerUi.pause();
      });
    }
  
    function removeSectionModels(sectionId) {
      for (var key in models) {
        if (models.hasOwnProperty(key)) {
          var model = models[key];
          if (model.sectionId === sectionId) {
            models[key].modelViewerUi.destroy();
            delete models[key];
          }
        }
      }
      delete modelJsonSections[sectionId];
    }
  
    return {
      init: init,
      removeSectionModels: removeSectionModels
    };
})();

theme.LibraryLoader = (function() {
    var types = {
      link: 'link',
      script: 'script'
    };
  
    var status = {
      requested: 'requested',
      loaded: 'loaded'
    };
  
    var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';
  
    var libraries = {
      plyrShopifyStyles: {
        tagId: 'plyr-shopify-styles',
        src: cloudCdn + 'plyr/v2.0/shopify-plyr.css',
        type: types.link
      },
      modelViewerUiStyles: {
        tagId: 'shopify-model-viewer-ui-styles',
        src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
        type: types.link
      }
    };
  
    function load(libraryName, callback) {
      var library = libraries[libraryName];
  
      if (!library) return;
      if (library.status === status.requested) return;
  
      callback = callback || function() {};
      if (library.status === status.loaded) {
        callback();
        return;
      }
  
      library.status = status.requested;
  
      var tag;
  
      switch (library.type) {
        case types.script:
          tag = createScriptTag(library, callback);
          break;
        case types.link:
          tag = createLinkTag(library, callback);
          break;
      }
  
      tag.id = library.tagId;
      library.element = tag;
  
      var firstScriptTag = document.getElementsByTagName(library.type)[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  
    function createScriptTag(library, callback) {
      var tag = document.createElement('script');
      tag.src = library.src;
      tag.addEventListener('load', function() {
        library.status = status.loaded;
        callback();
      });
      return tag;
    }
  
    function createLinkTag(library, callback) {
      var tag = document.createElement('link');
      tag.href = library.src;
      tag.rel = 'stylesheet';
      tag.type = 'text/css';
      tag.addEventListener('load', function() {
        library.status = status.loaded;
        callback();
      });
      return tag;
    }
  
    return {
      load: load
    };
})();

class VariantSelects extends HTMLElement {
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
        this.updateOptions();
        this.updateMasterId();
        this.toggleAddButton(true, '', false);
        this.updatePickupAvailability();
        this.removeErrorMessage();
        if (!this.currentVariant) {
            this.toggleAddButton(true, '', true);
            this.setUnavailable();
        } else {
            this.updateMedia();
            this.updateURL();
            this.updateVariantInput();
            this.renderProductInfo();
        }
    }
  
    updateOptions() {
        this.options = Array.from(this.querySelectorAll('.bls__option-swatch.active'), (select) => select.getAttribute('data-value'));
    }
  
    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
            return this.options[index] === option;
            }).includes(false);
        });
    }
  
    updateMedia() {
        if (!this.currentVariant) return;
        if (!this.currentVariant.featured_media) return;

        if ( document.querySelector('.bls__product-images').classList.contains('bls__product-grid-1') || document.querySelector('.bls__product-images').classList.contains('bls__product-grid-2')) {
            var target = document.querySelector('.bls__media-image[data-media-id="'+`${this.currentVariant.featured_media.id}`+'"]');
            var scrollContainer = target;
            do {
                scrollContainer = scrollContainer.parentNode;
                if (!scrollContainer) return;
                scrollContainer.scrollTop += 1;
            } while (scrollContainer.scrollTop == 0);
            
            var targetY = 0;
            do {
                if (target == scrollContainer) break;
                targetY += target.offsetTop;
            } while (target = target.offsetParent);
            
            scroll = function(c, a, b, i) {
                i++; if (i > 30) return;
                c.scrollTop = a + (b - a) / 30 * i;
                setTimeout(function(){ scroll(c, a, b, i); }, 20);
            }
            scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
        }
    }
  
    updateURL() {
        if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
        window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }
  
    updateVariantInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="id"]');
            input.value = this.currentVariant.id;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        if ( document.querySelector('.sticky-addcart-opstion')) {
            document.querySelector('.sticky-addcart-opstion').value = this.currentVariant.id;
        }
        
    }
  
    updatePickupAvailability() {
        const pickUpAvailability = document.querySelector('pickup-availability');
        if (!pickUpAvailability) return;
    
        if (this.currentVariant && this.currentVariant.available) {
            pickUpAvailability.fetchAvailability(this.currentVariant.id);
        } else {
            pickUpAvailability.removeAttribute('available');
            pickUpAvailability.innerHTML = '';
        }
    }
  
    removeErrorMessage() {
        const section = this.closest('section');
        if (!section) return;
    
        const productForm = section.querySelector('product-form');
        if (productForm) productForm.handleErrorMessage();
    }
  
    renderProductInfo() {
        if (!this.currentVariant) return;
        let qty = 0;
        let percent = 0;
        let sale = false;
        let soldOut = false;
        let variantStrings = window.variantStrings.soldOut;
        let availability = window.variantStrings.inStock;
        const compare_at_price = this.currentVariant.compare_at_price;
        const unit_price = this.currentVariant.unit_price
        const unit_price_measurement = this.currentVariant.unit_price_measurement

        const price = this.currentVariant.price;
        const form = document.getElementById(`product-form-${this.dataset.section}`);
        const product = form.closest('.bls__product-details-infor');
        this.getVariantQtyData().find((variantQty) => {
            if (variantQty.id === this.currentVariant.id) {
                qty = variantQty.qty;
            }
        });
        if (compare_at_price && compare_at_price > price) {
            sale = true;
            percent = (compare_at_price - price)/compare_at_price*100;
        }
        if (unit_price && unit_price_measurement) {
          const price_num = Shopify.formatMoney(unit_price, cartStrings.money_format)
          const price_unit = unit_price_measurement.reference_value != 1 ? unit_price_measurement.reference_value : unit_price_measurement.reference_unit
          product.querySelector('.unit-price .number').innerHTML = price_num;
          product.querySelector('.unit-price .unit').innerHTML = price_unit;
        } 
        if (this.currentVariant.available && qty < 1) {
            availability = window.variantStrings.preOrder;
            variantStrings = window.variantStrings.preOrder;
        } else if (!this.currentVariant.available) {
            availability = window.variantStrings.outStock;
            soldOut = true;
        } else {
            availability = window.variantStrings.inStock;
            variantStrings = window.variantStrings.addToCart;
        }
        const product_label = product.querySelector('.bls__product-label');
        if (product_label) {
            product_label.remove();
        }
        if (sale || soldOut) {
            var element = document.createElement('div');
            element.classList.add('bls__product-label', 'mb-5','fs-12', 'pointer-events-none', 'inline-block', 'static');
            product.insertBefore(element, product.children[0]);
            const label = product.querySelector('.bls__product-label');
            var element_lale = document.createElement('div');
            if (sale) {
                element_lale.classList.add('bls__sale-label');
                element_lale.innerText = -percent.toFixed(0)+'%';
            } else {
                element_lale.classList.add('bls__sold-out-label');
                element_lale.innerText = window.variantStrings.soldOut;
            }
            label.appendChild(element_lale)
        }

        if (product.querySelector('.bls__availability-value')) {
            product.querySelector('.bls__availability-value').textContent = availability;
        }
        if (product.querySelector('.bls__product-sku-value')) {
            product.querySelector('.bls__product-sku-value').textContent = this.currentVariant.sku;
        }
        const price_format = Shopify.formatMoney(this.currentVariant.price, cartStrings.money_format);
        product.querySelector('.price__regular .price').innerHTML = price_format;
        const bls__price = product.querySelector('.bls__price');
        bls__price.classList.remove('price--sold-out', 'price--on-sale');
        bls__price.querySelector('.price__regular .price').classList.remove('special-price');
        if (compare_at_price && compare_at_price > price) {
            const compare_format = Shopify.formatMoney(compare_at_price, cartStrings.money_format)
            product.querySelector('.compare-price').innerHTML = compare_format;
            bls__price.classList.add('price--on-sale');
            product.querySelector('.price__regular .price').classList.add('special-price');
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
        if (text){
            addButtonText.textContent = text;
        } else { 
            addButtonText.textContent = window.variantStrings.addToCart;
        }
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
customElements.define('variant-selects', VariantSelects);

var BlsEventMainProductShopify = (function() {
    return {
        init: function() {
            this.setupEventListeners();
            this.eventFlashSold();
            this.eventVisitors();
            this.eventCountdowProduct();
            this.eventProductTabs();
            this.eventCompareColors();
            this.stickyAddToCartButton();
            this.productMedia();
            this.eventMediaGalleryProduct();
            this.eventProductBoughTogether();
        },

        setupEventListeners: function() {
            document.querySelectorAll(options.productAddons).forEach( addons => {
                addons.addEventListener("click", e => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const id = target.getAttribute('data-id');
                    const text = target.getAttribute('data-text');
                    const content = document.getElementById(id);
                    let heading = '';
                    if (id == 'share-popup') {
                        heading = ' dlg-disable-heading';
                    }
                    if(content){
                        var promotion = EasyDialogBox.create(id, 'dlg'+heading+' dlg-disable-footer dlg-disable-drag', text, content.innerHTML);
                        promotion.onClose = promotion.destroy;
                        promotion.show(300);
                    }
                    if (id == 'compare-color-popup') {
                        this.eventCompareColors();
                    }
                    if (id == 'share-popup') {
                        this.eventCopyShare();
                    }
                }, false);
            });

            const prodData = document.querySelector("[data-product-json]");
            if (prodData != null) {
                var productJson = JSON.parse(
                    prodData.innerHTML
                );
                var storedProducts = JSON.parse(localStorage.getItem("bls__recently-viewed-products"));
                if (storedProducts) {
                    if (storedProducts.length <= 10) {
                        this.addProductEntry(productJson, storedProducts);
                    }
                }
                else{
                    this.addProductEntry(productJson, storedProducts);
                }
            }
        },

        addProductEntry: function(productJson, storedProducts) {
            if (storedProducts === null) storedProducts = [];
            var currentProductID = productJson.id;
            var currentProductHandle = productJson.handle;
            var product = {
              handle: currentProductHandle,
              id: currentProductID
            };
            if (JSON.parse(localStorage.getItem("product")) != currentProductHandle) {
              localStorage.setItem("product", JSON.stringify(product));
            }
            for (var i = storedProducts.length; i--;) {
              var curProduct = storedProducts[i];
              if (curProduct.handle === product.handle) {
                storedProducts.splice(i, 1)
                break;
              }
            }
            storedProducts.push(product);
            if (localStorage.getItem(storedProducts)) {
              localStorage.getItem("bls__recently-viewed-products", JSON.stringify(storedProducts));
            } else {
              localStorage.setItem("bls__recently-viewed-products", JSON.stringify(storedProducts));
            }
        },

        eventMediaGalleryProduct: function () {
            const thumbnails_gallery = document.querySelector('.bls__swiper-gallery-thumbnails');
            const gallery = document.querySelector('.bls__swiper-gallery');
            var thumbnails;
            var thumbnails_mobile;
            var gallery_slide;
            var gallery_slide_mobile;
            if (thumbnails_gallery) {
                if (thumbnails_gallery.classList.contains('bls__swiper-vertical')) {
                    var thumbnails = new Swiper('.bls__swiper-gallery-thumbnails.bls__swiper-vertical', {
                        spaceBetween: 10,
                        slidesPerView: 8,
                        freeMode: true,
                        direction: "vertical",
                        watchSlidesProgress: true
                    })
                } else {
                    var thumbnails = new Swiper('.bls__swiper-gallery-thumbnails', {
                        spaceBetween: 10,
                        slidesPerView: 5,
                        freeMode: true,
                        watchSlidesProgress: true,
                        navigation: {
                            nextEl: ".swiper-next",
                            prevEl: ".swiper-prev"
                        }
                    })
                }
            }
            if (gallery) {
                if (thumbnails) {
                    var gallery_slide = new Swiper('.bls__swiper-gallery', {
                        loop: false,
                        speed: 600,
                        navigation: {
                            nextEl: ".swiper-next",
                            prevEl: ".swiper-prev"
                        },
                        thumbs: {
                            swiper: thumbnails
                        }
                    })
                } else {
                    const autoplaying = gallery.dataset.autoplay === "true"
                    const itemMobile = gallery?.dataset.mobile
                    const spacing = gallery?.dataset.spacing
                    const row = gallery?.dataset.sectionId
                    var gallery_slide = new Swiper('.bls__swiper-gallery', {
                        slidesPerView: itemMobile,
                        spaceBetween: Number(spacing),
                        autoplay: autoplaying,
                        speed: 600,
                        loop: false,
                        grid: {
                            rows: row,
                        },
                        navigation: {
                            nextEl: ".swiper-next",
                            prevEl: ".swiper-prev",
                        },
                        pagination: {
                            clickable: true,
                            el: ".swiper-pagination",
                        }
                    })
                }
            };

            const thumbnails_gallery_mobile = document.querySelector('.bls__swiper-gallery-thumbnails-mobile');
            const gallery_mobile = document.querySelector('.bls__swiper-gallery-mobile');

            if (thumbnails_gallery_mobile && gallery_mobile) {
                var thumbnails_mobile = new Swiper('.bls__swiper-gallery-thumbnails-mobile', {
                    spaceBetween: 10,
                    slidesPerView: 4,
                    freeMode: true,
                    watchSlidesProgress: true,
                    navigation: {
                        nextEl: ".swiper-next",
                        prevEl: ".swiper-prev"
                    }
                })
            }

            if (thumbnails_mobile) {
                var gallery_slide_mobile = new Swiper('.bls__swiper-gallery-mobile', {
                    spaceBetween: 0,
                    speed: 600,
                    loop: false,
                    navigation: {
                        nextEl: ".swiper-next",
                        prevEl: ".swiper-prev"
                    },
                    thumbs: {
                        swiper: thumbnails_mobile
                    }
                })
            } else {
                var gallery_slide_mobile = new Swiper('.bls__swiper-gallery-mobile', {
                    slidesPerView: 1,
                    longSwipesMs: 600,
                    spaceBetween: 0,
                    autoplay: false,
                    loop: false,
                    navigation: {
                        nextEl: ".swiper-next",
                        prevEl: ".swiper-prev",
                    },
                    pagination: {
                        clickable: true,
                        el: ".swiper-pagination",
                    }
                })
            }

            
            document.querySelectorAll('.bls__product-details-infor .bls__option-swatch').forEach( (button) => {
                button.addEventListener('click', (e) => {
                    const target = e.currentTarget;
                    setTimeout(function() {
                        var options = Array.from(target.closest('variant-selects').querySelectorAll('.bls__option-swatch.active'), (select) => select.getAttribute('data-value'));
                        var variantData = JSON.parse(target.closest('variant-selects').querySelector('[type="application/json"]').textContent);
                        var currentVariant = variantData.find((variant) => {
                            return !variant.options.map((option, index) => {
                                return options[index] === option;
                            }).includes(false);
                        });
                        if (!currentVariant) return;
                        if (!currentVariant.featured_media) return;
                        var featured_media_id = currentVariant.featured_media.id;
                        var position = target.closest('.bls__template-product').querySelector(`.product__media-gallery [data-media-id="${featured_media_id}"]`).getAttribute('data-position');
                        if (gallery_slide) {
                            gallery_slide.slideTo(position-1, 600);
                        }
                        if (gallery_slide_mobile) {
                            gallery_slide_mobile.slideTo(position-1, 600);
                        }
                    }, 100);
                }, false);
            });

            if (gallery_slide) {
                gallery_slide.on('slideChange', function () {
                    var index = gallery_slide.realIndex + 1;
                    var slide = gallery.querySelector(`.gallery-img[data-position="${index}"]`);
                    if (slide.classList.contains('model')) {
                        gallery_slide.allowTouchMove = false;
                    } else {
                        gallery_slide.allowTouchMove = true;
                    }
                });
            }

            gallery_slide_mobile.on('slideChange', function () {
                var index = gallery_slide_mobile.realIndex + 1;
                var slide = gallery_mobile.querySelector(`.gallery-img[data-position="${index}"]`);
                if (slide.classList.contains('model')) {
                    gallery_slide_mobile.allowTouchMove = false;
                } else {
                    gallery_slide_mobile.allowTouchMove = true;
                }
            });
        },

        productMedia: function() {
            var position = 0;
            document.querySelectorAll(options.photoZoomImage).forEach( item => {
                var items = this.getProductItems(item);
                item.addEventListener("click", e => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    if (target.classList.contains('external_video') || target.classList.contains('video') || target.classList.contains('model')) {
                        return;
                    }
                    if (target.getAttribute('data-position')) {
                        position = target.getAttribute('data-position');
                    } else if (target.closest('.product__media-list').querySelector('.swiper-slide-active')){
                        position = target.closest('.product__media-list').querySelector('.swiper-slide-active').getAttribute('data-position');
                    }
                    const gallery = GLightbox({
                        elements: items,
                        startAt: position-1,
                        openEffect: 'fade',
                        closeEffect: 'fade',
                        loop: false,
                        draggable: false,
                        autoplayVideos: false,
                    });
                    gallery.open(); 
                }, false);
            });

            var sectionId = document.querySelector('.bls__template-product').getAttribute('data-section');
            var productMediaTypeVideoDesktop = document.querySelectorAll('[data-product-media-type-video-desktop]');
            productMediaTypeVideoDesktop.forEach(function(el) {
                theme.ProductVideo.init(el, sectionId);
            });

            var productMediaTypeVideoMobile = document.querySelectorAll('[data-product-media-type-video-mobile]');
            productMediaTypeVideoMobile.forEach(function(el) {
                theme.ProductVideo.init(el, sectionId);
            });

            var modelViewerElementsDesktop = document.querySelectorAll('[data-product-media-type-model-desktop]');
            if (modelViewerElementsDesktop.length >= 1) {
                theme.ProductModel.init(modelViewerElementsDesktop, sectionId);
            }

            var modelViewerElementsMobile = document.querySelectorAll('[data-product-media-type-model-mobile]');
            if (modelViewerElementsMobile.length >= 1) {
                theme.ProductModel.init(modelViewerElementsMobile, sectionId);
            }
        },

        getProductItems: function(item) {
            var items = [];
            item.closest('.product__media-list').querySelectorAll(options.mediaImage).forEach( img => {
                var $this = img,
                    src = $this.getAttribute('data-src'),
                    width = $this.getAttribute('data-width');
                if ( $this.classList.contains('video') ) {
                    var source = $this.getAttribute('data-source-url');
                    items.push({
                        href: source,
                        type: 'video',
                        source: 'local',
                        width: width,
                    });
                } else if ($this.classList.contains('external_video')) {
                    var data_source = $this.getAttribute('data-source');
                    var data_source_id = $this.getAttribute('data-video-id');
                    var source = 'youtube';
                    var source_url = '';
                    if (data_source == 'youtube') {
                        source = 'youtube';
                        source_url = 'https://www.youtube.com/watch?v='+data_source_id+'';
                    } else {
                        source = 'vimeo';
                        source_url = 'https://vimeo.com/'+data_source_id+'';
                    }
                    items.push({
                        href: source_url,
                        type: 'video',
                        source: source,
                        width: width,
                    });
                } else {
                    items.push({
                        href: src
                    });
                }
            }); 
            return items;
        },

        eventCopyShare: function() {
            document.querySelectorAll(options.shareCopy).forEach( action => {
                action.addEventListener("click", e => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    var text = document.getElementById("share-popup-input");
                    text.select();
                    text.setSelectionRange(0, 99999);
                    navigator.clipboard.writeText(text.value);
                    target.classList.add('active');
                }, false);
            });
        },

        eventCompareColors: function() {
            document.querySelectorAll(options.compareColorsBtn).forEach( compare => {
                compare.addEventListener("click", e => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const color = target.getAttribute('data-color');
                    const image = target.getAttribute('data-image');
                    if(target.classList.contains('active')) {
                        target.classList.remove('active');
                        document.querySelector('.dlg .item-compare-color.'+color.replace(" ", "-")+'').remove();
                        setTimeout(function() {
                            if (!document.querySelector('.dlg .item-compare-color')) {
                                document.querySelector('.dlg .compare-color-empty').classList.remove('d-none');
                            }
                        }, 100)
                    } else {
                        document.querySelector('.dlg .compare-color-empty').classList.add('d-none');
                        target.classList.add('active');
                        if (color && image) {
                            const html = '<div class="image"><img src="'+image+'" alt="'+color+'"></div><p class="mt-10 heading-color capitalize">'+color+'</p>';
                            const el = document.createElement('div');
                            el.classList.add('item-compare-color', color.replace(" ", "-"));
                            el.innerHTML = html;
                            document.querySelector('.dlg .bls__compare-colors-list').appendChild(el);
                        }
                    }
                }, false);
            });
        },

        eventProductTabs: function() {
            document.querySelectorAll(options.navTabs).forEach( tabToggle => {
                tabToggle.addEventListener("click", e => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const tab_id = target.getAttribute('data-block-id');
                    if(!target.closest('.data.item').classList.contains('active')){
                        for (var item of document.querySelectorAll('.data.item')) {
                            item.classList.remove('active');
                        }
                        for (var item of document.querySelectorAll(options.tabContent)) {
                            item.classList.remove('active');
                            item.querySelector('.tab-panel').style.display = 'none';
                        }
                        const conditions = document.getElementById(tab_id);
                        conditions.classList.add('active');
                        conditions.querySelector('.tab-panel').style.display = 'block';
                        target.closest('.data.item').classList.add('active');
                    }
                }, false);
            });

            document.querySelectorAll(options.accorditionTabs).forEach( tabToggle => {
                tabToggle.addEventListener("click", e => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const tab_id = target.getAttribute('data-block-id');
                    const conditions = document.getElementById(tab_id);
                    if (!conditions) return;
                    if(conditions.classList.contains('active')){
                        slideAnime({
                            target: conditions.querySelector('.tab-panel'),
                            animeType: 'slideUp'
                        });
                        conditions.classList.remove('active');
                    } else {
                        for (var item of document.querySelectorAll(options.tabContent)) {
                            item.classList.remove('active');
                            slideAnime({
                                target: item.querySelector('.tab-panel'),
                                animeType: 'slideUp'
                            });
                        }
                        slideAnime({
                            target: conditions.querySelector('.tab-panel'),
                            animeType: 'slideDown'
                        });
                        conditions.classList.add('active');
                    }
                }, false);
            });

            if (document.querySelector('.inside-product-main-infomation')) {
                const el = document.querySelector(options.productInfomationTab);
                el.classList.remove('hidden');
                setTimeout(function() {
                    el.querySelector('.loading').remove();
                    el.appendChild(document.querySelector('.inside-product-main-infomation .product.info.detailed'));
                }, 500);
            }
        },

        eventFlashSold: function() {
            Shopify.eventFlashSold();
        },

        eventVisitors: function() {
            const element = document.querySelector(options.visitors);
            if (!element) return;
            const max = Number(element.getAttribute('data-count-range-max'));
            const min = Number(element.getAttribute('data-count-range-min'));
            const view_duration = Number(element.getAttribute('data-view-duration'));
            var visitors = Math.floor(Math.random() * (max - min + 1) ) + min;
            document.querySelector(".bls__visitor-count").innerHTML = visitors;
            setInterval(function() {
                var visitors = Math.floor(Math.random() * (max - min + 1) ) + min;
                document.querySelector(".bls__visitor-count").innerHTML = visitors;
            }, view_duration*1000);
            element.style.display = 'block';
        },

        stickyAddToCartButton: function() {
            document.addEventListener("DOMContentLoaded", function () {
                var productCartButton = document.querySelector('.product-form__submit'), stickyAddToCartButton = document.querySelector('#bls__sticky-addcart'), previousTop = 0;
                if (stickyAddToCartButton && stickyAddToCartButton.classList.contains('only-show-desktop')) {
                    if (window.innerWidth >= 992) {
                        document.body.classList.add('sticky-addtocart-show');
                    }
                } else {
                    document.body.classList.add('sticky-addtocart-show');
                }
                if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype && stickyAddToCartButton) {
                    let productCartButtonObserver = new IntersectionObserver(function (entries, observer) {
                        entries.forEach(function (entry) {
                            let showstickyAddToCartButton = (entry.boundingClientRect.top < previousTop && entry.boundingClientRect.top < 0);
                            if (showstickyAddToCartButton) {
                                stickyAddToCartButton.classList.add('sticky-addcart-show');
                            } else {
                                stickyAddToCartButton.classList.remove('sticky-addcart-show');
                            }
                            previousTop = entry.boundingClientRect.top;
                        });
                    }, { threshold: 0.5});
                    productCartButtonObserver.observe(productCartButton);
                }
            });
        },

        eventCountdowProduct: function() {
            const element = document.querySelector(options.countdowProduct);
            if (!element) return;
            const dataProductID = document.querySelector(options.templateProduct).getAttribute('data-product-id');
            fetch('/admin/orders.json')
                .then( res => res.json())
                .then(orders => {
                    var sum = 0;
                    var orders = orders.orders;
                    orders.forEach(function(item, index) {
                        item.line_items.forEach(function(itemi, index) {
                            if(itemi.product_id == dataProductID){
                                var num = itemi.quantity;
                                sum += (num || 0);
                            }
                        });
                    });
                    var variants = parseInt(element.querySelector(".bls__count").innerText);
                    var count = variants+sum;
                    var a = 100*(variants/count);
                    setTimeout(function() {
                        element.querySelector(".progressbar div").style.width = a + "%";
                    }, 300)
                })
                .catch((error) => {
                    throw error;
            });
            setInterval(function() {
                fetch('/admin/orders.json')
                    .then( res => res.json())
                    .then(orders => {
                        var sumqt = 0;
                        var orders = orders.orders;
                        orders.forEach(function(item, index) {
                            item.line_items.forEach(function(itemi, index) {
                                if(itemi.product_id == dataProductID){
                                    var num = itemi.quantity;
                                    sumqt += (num || 0);
                                }
                            });
                        });
                        var sumqty = 0;
                        fetch('/admin/products/'+dataProductID+'/variants.json')
                            .then( res => res.json())
                            .then(variant => {
                                var variants = variant.variants;
                                variants.forEach(function(itemvariant, index) {
                                    var numqty = itemvariant.inventory_quantity;
                                    sumqty += (numqty || 0);
                                });
                                element.querySelector(".bls__count").innerHTML = sumqty;
                            })
                            .catch((error) => {
                                throw error;
                        });
                        var variants = parseInt(element.querySelector(".bls__count").innerText);
                        var count = variants+sumqt;
                        var a = 100*(variants/count);
                        setTimeout(function() {
                            element.querySelector(".progressbar div").style.width = a + "%";
                        }, 300)
                    })
                    .catch((error) => {
                        throw error;
                });
            }, 10000)
        },

        eventProductBoughTogether: function() {
            var boughTogether = document.querySelector('.productBoughTogether[type="application/json"]');
            if (!boughTogether) return;
            var variantData = JSON.parse(boughTogether.innerText);
            var query = '';
            variantData.forEach((e, key, variantData) => {
                if (!Object.is(variantData.length - 1, key)) {
                    query += e+'%20OR%20id:';
                }
                else{
                    query += e;
                }
            });
            var productAjaxURL = "?q=id:" + query+'&section_id=product-bough-together';
            fetch(`${window.routes.search_url}${productAjaxURL}`)
            .then(response => response.text())
            .then(async (responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');
                document.getElementById('bls__product-bought-together').innerHTML = html.querySelector('.bls__bought-together').innerHTML;
            }).catch((e) => {
                throw error;
            }).finally(() => {
                this.eventProductBoughTogetherAction();
                BlsLazyloadImg.init();
            });
        },

        eventProductBoughTogetherAction: function() {
            var _this = this;
            document.querySelectorAll('.bought-together-checkbox').forEach(checkbox => {
                checkbox.addEventListener("change", (event) => {
                    var total_price = 0,total_compare_price = 0,save_price = 0,price,compare_price;
                    if (event.target.checked) {
                        event.target.closest('.product-bought-together-item').classList.add('select');
                        event.target.closest('.product-bought-together-item').querySelector('.product-variant-option').removeAttribute('disabled');
                        event.target.closest('.product-bought-together-item').querySelector('.quantity').removeAttribute('disabled');
                    } else {
                        event.target.closest('.product-bought-together-item').classList.remove("select");
                        event.target.closest('.product-bought-together-item').querySelector('.product-variant-option').setAttribute('disabled', true);
                        event.target.closest('.product-bought-together-item').querySelector('.quantity').setAttribute('disabled', true);
                    }
                    setTimeout(function () {
                        var bought_together_select = document.querySelectorAll('.product-bought-together-item.select')
                        bought_together_select.forEach( item => {
                            var option = item.querySelector('.product-variant-option');
                            price = option.getAttribute('data-price');
                            compare_price = option.getAttribute('data-compare-price');
                            total_price = total_price + Number(price);
                            total_compare_price = total_compare_price + Number(compare_price);
                        });
                        save_price = total_compare_price - total_price;
                        _this.eventProductBoughTogetherUpdatePrice(total_price, total_compare_price, save_price);
                        if (bought_together_select.length <= 1) {
                            document.querySelector('.bought-together-submit').setAttribute('disabled', true);
                        } else {
                            document.querySelector('.bought-together-submit').removeAttribute('disabled');
                        }
                    }, 50)
                }, false);
            });
            document.querySelectorAll('#bls__product-bought-together .product-variant-option').forEach(select => {
                select.addEventListener("change", (event) => {
                    var target = event.target;
                    var total_price = 0,total_compare_price = 0,save_price = 0,
                        image = target.options[target.selectedIndex].getAttribute('data-image'),
                        price = target.options[target.selectedIndex].getAttribute('data-price'),
                        compare_price = target.options[target.selectedIndex].getAttribute('data-compare-price');
                    var img = target.closest('.product-bought-together-item').querySelector('img');
                    if ( img ) {
                        img.removeAttribute('srcset');
                        img.setAttribute('src', image);
                    }
                    var info_price = target.closest('.product-bought-together-item').querySelector('.info-price');
                    info_price.querySelector('.price__regular .price').innerHTML = Shopify.formatMoney(price, cartStrings.money_format);
                    const bls__price = info_price.querySelector('.bls__price');
                    bls__price.classList.remove('price--sold-out', 'price--on-sale');
                    bls__price.querySelector('.price__regular .price').classList.remove('special-price');
                    if (compare_price && compare_price > price) {
                        const compare_format = Shopify.formatMoney(compare_price, cartStrings.money_format)
                        bls__price.querySelector('.compare-price').innerHTML = compare_format;
                        bls__price.classList.add('price--on-sale');
                        bls__price.querySelector('.price__regular .price').classList.add('special-price');
                    }
                    target.setAttribute('data-price', price);
                    target.setAttribute('data-compare-price', compare_price);
                    document.querySelectorAll('.product-bought-together-item.select').forEach( item => {
                        var option = item.querySelector('.product-variant-option');
                        price = option.getAttribute('data-price');
                        compare_price = option.getAttribute('data-compare-price');
                        total_price = total_price + Number(price);
                        total_compare_price = total_compare_price + Number(compare_price);
                    });
                    save_price = total_compare_price - total_price;
                    _this.eventProductBoughTogetherUpdatePrice(total_price, total_compare_price, save_price);
                }, false);
            });

            document.querySelectorAll('.bought-together-submit').forEach(
                (button) => {
                    button.addEventListener('click', this.submitBoughtTogether.bind(this), false)
                }
            );
        },

        submitBoughtTogether: function(event) {
            event.preventDefault();
            const target = event.currentTarget;
            const cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
            const form = document.getElementById('bls__bought-together-form');
            const config = fetchConfig('json');
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            delete config.headers['Content-Type'];
            const formData = new FormData(form);
            if (cart) {
                formData.append('sections', cart.getSectionsToRender().map((section) => section.id));
                formData.append('sections_url', window.location.pathname);
            }
            console.log(formData);
            config.body = formData;
            target.classList.add('btn-loading');
            fetch(`${routes.cart_add_url}.js`, config)
                .then((response) => {
                    return response.text();
                })
                .then((state) => {
                    fetch('/cart.json')
                        .then(res => res.json())
                        .then(cart => {
                            document.querySelectorAll(".cart-count").forEach(el => {
                                el.innerHTML = cart.item_count;
                            })
                        })
                        .catch((error) => {
                            throw error;
                        });
                    const parsedState = JSON.parse(state);
                    cart.getSectionsToRender().forEach((section => {
                        const elementToReplace = document.getElementById(section.id);
                        const html = new DOMParser().parseFromString(parsedState.sections[section.id], 'text/html');
                        elementToReplace.innerHTML = html.querySelector('#form-mini-cart').innerHTML;
                        const cart_threshold = document.querySelector('.bls__cart-thres-js');
                        if (cart_threshold) {
                            if (html.querySelector('.bls__cart-thres-js').classList.contains('cart_shipping_free')) {
                                cart_threshold.classList.add('cart_shipping_free');
                            } else {
                                cart_threshold.classList.remove('cart_shipping_free');
                            }
                            cart_threshold.querySelector('.bls__cart-thres').innerHTML = html.querySelector('.bls__cart-thres').innerHTML;
                            setTimeout(function () {
                                cart_threshold.querySelector('.percent_shipping_bar').setAttribute('style', html.querySelector('.percent_shipping_bar').getAttribute('style'));
                            }, 500);
                        }
                        const countdown = cart.querySelector('.cart-countdown-time');
                        const html_countdown = html.querySelector('.cart-countdown-time');
                        if (countdown && html_countdown) {
                            countdown.innerHTML = html_countdown.innerHTML;
                            cart.countdownTimer();
                        }
                    }));
                    cart.cartAction();
                })
                .catch((e) => {
                    throw e;
                })
                .finally(() => {
                    target.classList.remove('btn-loading');
                    cart.open();
                    BlsLazyloadImg.init();
                });
        },

        eventProductBoughTogetherUpdatePrice: function(total_price, total_compare_price, save_price) {
            var total = document.querySelector('.bought-together-container .total-product');
            if (total) {
                total.querySelector('.saved-price .price').innerHTML = Shopify.formatMoney(save_price, cartStrings.money_format);
                total.querySelector('.bls__total-price .price__sale .price-item').innerHTML = Shopify.formatMoney(total_compare_price, cartStrings.money_format);
                total.querySelector('.bls__total-price .price').innerHTML = Shopify.formatMoney(total_price, cartStrings.money_format);
                if (total_compare_price > total_price) {
                    total.querySelector('.bls__total-price').classList.add('price--on-sale');
                    total.querySelector('.bls__total-price .price').classList.add('special-price');
                } else {
                    total.querySelector('.bls__total-price').classList.remove('price--on-sale');
                    total.querySelector('.bls__total-price .price').classList.remove('special-price');
                }
                if (save_price > 1) {
                    total.querySelector('.saved-price').classList.add('d-block');
                    total.querySelector('.saved-price').classList.remove('d-none');
                } else {
                    total.querySelector('.saved-price').classList.add('d-none');
                    total.querySelector('.saved-price').classList.remove('d-block');
                }
            }
        }
    }
})();
BlsEventMainProductShopify.init();