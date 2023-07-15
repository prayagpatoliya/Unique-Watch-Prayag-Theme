"use strict";
const global = {
  announcementBar: "announcement-bar",
  overlay: ".bls__overlay",
  header: "header",
  mobile_stickybar: "shopify-section-mobile-stickybar",
};

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function backToTop() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  if (document.getElementById("bls__back-top")) {
    document.getElementById("bls__back-top").style.height = scrolled + "%";
  }
}

function mobileStickyBar() {
    var stickybar = document.querySelector(".bls__mobile-stickybar");
    var currentScroll = window.pageYOffset;
    let headerbar = 0;
    if (document.getElementById("announcement-bar")) {
        headerbar = document.getElementById("announcement-bar").clientHeight;
    }
    let headertopbar = 0;
    if (document.getElementById("shopify-section-top-bar")) {
        headertopbar = document.getElementById(
            "shopify-section-top-bar"
        ).clientHeight;
    }
    let headerpage = document.getElementById("page-header").clientHeight;
    let headerh = headerbar + headertopbar + headerpage + 50;
    if (currentScroll > headerh) {
        stickybar.classList.remove("d-none");
    } else {
        stickybar.classList.add("d-none");
    }
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function initComparisons() {
    var x, i;
    x = document.getElementsByClassName("img-comp-overlay");
    for (i = 0; i < x.length; i++) {
      compareImages(x[i]);
    }
    function compareImages(img) {
      var slider, img, clicked = 0, w, h;
      w = img.offsetWidth;
      h = img.offsetHeight;
      slider = img.closest(".img-comp-container").querySelector(".image-comparison__button");
      slider.addEventListener("mousedown", slideReady);
      window.addEventListener("mouseup", slideFinish);
      slider.addEventListener("touchstart", slideReady);
      window.addEventListener("touchend", slideFinish);
      function slideReady(e) {
        e.preventDefault();
        clicked = 1;
        window.addEventListener("mousemove", slideMove);
        window.addEventListener("touchmove", slideMove);
      }
      function slideFinish() {
        clicked = 0;
      }
      function slideMove(e) {
        var pos;
        if (clicked == 0) return false;
        pos = getCursorPos(e)
        if (pos < 0) pos = 0;
        if (pos > w) pos = w;
        slide(pos);
      }
      function getCursorPos(e) {
        var a, x = 0;
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        a = img.getBoundingClientRect();
        x = e.pageX - a.left;
        x = x - window.pageXOffset;
        
        return x;
      }
      function slide(x) {
        var x_ps = x + (slider.offsetWidth / 2) + 10;
        var percent = x_ps / w * 100;
        if (percent >= (100 - ((slider.offsetWidth / 2) + 10) / w * 100)) {
            percent = 100 - ((slider.offsetWidth /2) + 10) / w * 100;
        }

        img.closest(".img-comp-container").setAttribute(
            "style",
            "--percent: " +
                percent.toFixed(4) +
                "%;--height: " +
                h +
                "px "
          );
      }
    }
}
initComparisons();

const slideAnime = (setOptions) => {
  "use strict";
  const defaultOptions = {
    target: false,
    animeType: "slideToggle",
    duration: 400,
    easing: "ease",
    isDisplayStyle: "block",
  };
  const options = Object.assign({}, defaultOptions, setOptions);
  const target = options.target;

  if (!target) {
    return;
  }

  let animeType = options.animeType;
  const styles = getComputedStyle(target);
  if (animeType === "slideToggle") {
    animeType = styles.display === "none" ? "slideDown" : "slideUp";
  }
  if (
    (animeType === "slideUp" && styles.display === "none") ||
    (animeType === "slideDown" && styles.display !== "none") ||
    (animeType !== "slideUp" && animeType !== "slideDown")
  ) {
    return false;
  }
  target.style.overflow = "hidden";
  const duration = options.duration;
  const easing = options.easing;
  const isDisplayStyle = options.isDisplayStyle;

  if (animeType === "slideDown") {
    target.style.display = isDisplayStyle;
  }
  const heightVal = {
    height: target.getBoundingClientRect().height + "px",
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
  };

  Object.keys(heightVal).forEach((key) => {
    if (parseFloat(heightVal[key]) === 0) {
      delete heightVal[key];
    }
  });
  if (Object.keys(heightVal).length === 0) {
    return false;
  }
  let slideAnime;
  if (animeType === "slideDown") {
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = 0;
    });
    slideAnime = target.animate(heightVal, {
      duration: duration,
      easing: easing,
    });
  } else if (animeType === "slideUp") {
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = heightVal[key];
      heightVal[key] = 0;
    });
    slideAnime = target.animate(heightVal, {
      duration: duration,
      easing: easing,
    });
  }
  slideAnime.finished.then(() => {
    target.style.overflow = "";
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = "";
    });
    if (animeType === "slideUp") {
      target.style.display = "none";
    }
  });
};

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

Shopify.formatMoney = function (cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }
  return formatString.replace(placeholderRegex, value);
};

Shopify.eventFlashSold = function (dlg = false) {
  let element = document.querySelector(
    ".bls__product-details-infor .bls__flash-sold"
  );
  if (dlg) {
    element = document.querySelector(
      ".bls__quickview-content .bls__flash-sold"
    );
  }
  if (!element) return;
  const flash_sold = element.getAttribute("data-flash-sold");
  const flash_hours = element.getAttribute("data-flash-hours");
  const soldArray = flash_sold.split(",");
  const hoursArray = flash_hours.split(",");
  var sold = soldArray[Math.floor(Math.random() * soldArray.length)];
  var hour = hoursArray[Math.floor(Math.random() * hoursArray.length)];
  document.querySelector(".bls__flash-sold .product-sold").innerHTML = sold;
  document.querySelector(".bls__flash-sold .product-hour").innerHTML = hour;
  element.style.display = "block";
};

Shopify.addToastAction = function (strToast) {
  let messageToast = EasyDialogBox.create(
    null,
    "dlg-toast dlg-fade",
    null,
    strToast,
    null,
    null,
    20,
    500
  );
  messageToast.onHide = messageToast.destroy;
  messageToast.show().hide(3000);
};

Shopify.termsConditionsAction = function () {
  function conditions(evt) {
    const content = document.getElementById("popup-terms-conditions");
    const e = evt.currentTarget;
    if (!content) return;
    const text = content.getAttribute("data-text");
    var promotion = EasyDialogBox.create(
      "popup-terms-conditions",
      "dlg dlg-disable-footer dlg-disable-drag",
      text,
      content.innerHTML
    );
    promotion.onClose = promotion.destroy;
    promotion.show(300);
    e.href = "javascript: (function(){})();";
    e.target = "_self";
  }
  document.querySelectorAll(".bls__terms-conditions a").forEach((event) => {
    event.addEventListener("click", conditions);
  });
};

Shopify.eventCountDownTimer = function (dlg = false) {
  let element = document.querySelectorAll(".bls__countdown-timer");
  if (dlg) {
    element = document.querySelectorAll(
      ".bls__quickview-content .bls__countdown-timer"
    );
  }
  element.forEach((el) => {
    const day = el.getAttribute("data-days");
    const hrs = el.getAttribute("data-hrs");
    const secs = el.getAttribute("data-secs");
    const mins = el.getAttribute("data-mins");
    const time = el.getAttribute("data-time");
    var countDownDate = new Date(time).getTime();
    var timer = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      if (distance < 0) {
        el.classList.add("d-none");
        clearInterval(timer);
      } else {
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var html =
          '<span class="countdown-days"><span class="countdown_ti heading-weight">' +
          days +
          '</span> <span class="countdown_tx">' +
          day +
          "</span></span> " +
          '<span class="countdown-hours"><span class="countdown_ti heading-weight">' +
          hours +
          '</span> <span class="countdown_tx">' +
          hrs +
          "</span></span> " +
          '<span class="countdown-min"><span class="countdown_ti heading-weight">' +
          minutes +
          '</span> <span class="countdown_tx">' +
          mins +
          "</span></span> " +
          '<span class="countdown-sec"><span class="countdown_ti heading-weight">' +
          seconds +
          '</span> <span class="countdown_tx">' +
          secs +
          "</span></span>";
        el.querySelector(".bls__product-countdown").innerHTML = html;
        el.classList.remove("d-none");
      }
    }, 1000);
  });
};

Shopify.swiperSlideQickview = function () {
  var swiper_qickview = new Swiper("#bls__swiper-qickview", {
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: false,
    loop: true,
    navigation: {
      nextEl: document
        .getElementById("bls__swiper-qickview")
        .querySelector(".swiper-button-next"),
      prevEl: document
        .getElementById("bls__swiper-qickview")
        .querySelector(".swiper-button-prev"),
    },
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
  });

  document
    .querySelectorAll(".bls__quickview-content .bls__option-swatch")
    .forEach((button) => {
      button.addEventListener(
        "click",
        (e) => {
          const target = e.currentTarget;
          var options = Array.from(
            target
              .closest("#variant-radios")
              .querySelectorAll(".bls__option-swatch.active"),
            (select) => select.getAttribute("data-value")
          );
          var variantData = JSON.parse(
            target
              .closest("#variant-radios")
              .querySelector('[type="application/json"]').textContent
          );
          var currentVariant = variantData.find((variant) => {
            return !variant.options
              .map((option, index) => {
                return options[index] === option;
              })
              .includes(false);
          });
          if (!currentVariant) return;
          if (!currentVariant.featured_media) return;
          var featured_media_id = currentVariant.featured_media.id;
          var position = target
            .closest(".bls__product-quickview")
            .querySelector(`[data-media-id="${featured_media_id}"]`)
            .getAttribute("data-position");
          swiper_qickview.slideTo(position, 1000);
        },
        false
      );
    });

  var conditions = document.getElementById("conditions_form_qickview");
  if (conditions) {
    conditions.addEventListener("change", (event) => {
      if (event.currentTarget.checked) {
        document
          .querySelector(".bls-btn-checkout-qickview")
          .classList.remove("disabled");
      } else {
        document
          .querySelector(".bls-btn-checkout-qickview")
          .classList.add("disabled");
      }
    });
  }
};

var BlsEventShopify = (function () {
  return {
    init: function () {
      this.setupEventListeners();
      Shopify.eventCountDownTimer();
    },
    setupEventListeners: function () {
      window.onscroll = function () {
        backToTop();
        mobileStickyBar();
      };

      document
        .querySelectorAll(".collection-infinite-scroll a")
        .forEach((showMore) => {
          showMore.addEventListener(
            "click",
            (e) => {
              for (var item of document.querySelectorAll(
                ".collection-list__item.grid__item"
              )) {
                item.classList.remove("d-none");
              }
              showMore.parentElement.remove();
            },
            false
          );
        });

      const footer_block = document.querySelectorAll(
        ".bls__footer_block-title"
      );
      footer_block.forEach((footer) => {
        footer.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          const footerContent = parent.querySelector(
            ".bls__footer_block-content"
          );
          slideAnime({
            target: footerContent,
            animeType: "slideToggle",
          });
          const footer_block = target.closest(".bls__footer_block");
          if (!footer_block.classList.contains("active")) {
            footer_block.classList.add("active");
          } else {
            footer_block.classList.remove("active");
          }
        });
      });

      const mobile_stickybar = document.getElementById(global.mobile_stickybar);
      if (mobile_stickybar && document.querySelector("footer")) {
        document.querySelector("footer").classList.add("enable_menu-bottom");
      }

      const cookie_bar = document.getElementById("bls_cookie");
      if (cookie_bar) {
        if (!getCookie("cookie_bar")) {
          cookie_bar.classList.remove("d-none");
        }
        document
          .querySelectorAll("#bls_cookie .cookie-dismiss")
          .forEach((closeCookie) => {
            closeCookie.addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.closest("#bls_cookie").remove();
                setCookie("cookie_bar", "dismiss", 30);
              },
              false
            );
          });
      }

      const announcementBar = document.getElementById(global.announcementBar);
      if (announcementBar) {
        if (getCookie("announcement_bar")) {
          announcementBar.classList.add("d-none");
        }
        document
          .querySelectorAll("#announcement-bar .announcement-close")
          .forEach((closeAnnouncement) => {
            closeAnnouncement.addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.closest("#announcement-bar").remove();
                setCookie("announcement_bar", 1, 1);
              },
              false
            );
          });
      }

      const conditions = document.getElementById("product_conditions_form");
      if (conditions) {
        conditions.addEventListener("change", (event) => {
          if (event.currentTarget.checked) {
            document
              .querySelector(".bls__payment-button")
              .classList.remove("disabled");
          } else {
            document
              .querySelector(".bls__payment-button")
              .classList.add("disabled");
          }
        });
      }

      document.querySelectorAll(global.overlay).forEach((event) => {
        event.addEventListener(
          "click",
          (e) => {
            const target = e.currentTarget;
            target.classList.add("d-none-overlay");
            document.documentElement.classList.remove("hside_opened");
            for (var item of document.querySelectorAll(".bls__opend-popup")) {
              item.classList.remove("bls__opend-popup");
            }
            const btn = document.querySelector(".btn-filter");
            if (btn && btn.classList.contains("actived")) {
              btn.classList.remove("actived");
            }
            for (var item of document.querySelectorAll(".bls__addon")) {
              item.classList.remove("is-open");
            }
            for (var item of document.querySelectorAll(
              ".bls-minicart-wrapper"
            )) {
              item.classList.remove("addons-open");
            }
          },
          false
        );
      });

      document.querySelectorAll(".bls__terms-conditions a").forEach((event) => {
        event.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const content = document.getElementById("popup-terms-conditions");
            if (!content) return;
            const text = content.getAttribute("data-text");
            var promotion = EasyDialogBox.create(
              "popup-terms-conditions",
              "dlg dlg-disable-footer dlg-disable-drag",
              text,
              content.innerHTML
            );
            promotion.onClose = promotion.destroy;
            promotion.show(300);
          },
          false
        );
      });
    },
  };
})();
BlsEventShopify.init();

let newParser = new DOMParser();
var BlsSettingsSwiper = (function () {
  return {
    init: function () {
      this.BlsSettingsCarousel();
    },
    BlsSettingsCarousel: function () {
      document.querySelectorAll(".bls__swiper").forEach((element) => {
        this.BlsCarousel(element);
      });
    },

    BlsCarousel: function (e) {
      var autoplaying = e?.dataset.autoplay === "true";
      var loop = e.dataset.loop === "true";
      var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
      var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
      var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
      var autoplaySpeed = e?.dataset.autoplaySpeed
        ? e?.dataset.autoplaySpeed
        : 3000;
      var speed = e?.dataset.speed ? e?.dataset.speed : 400;
      var effect = e?.dataset.effect ? e?.dataset.effect : "slide";
      var sectionId = e?.dataset.sectionId;
      var row = e?.dataset.row ? e?.dataset.row : 1;
      var width = window.innerWidth;
      var spacing = e?.dataset.spacing ? e?.dataset.spacing : 0;
      spacing = Number(spacing);
      autoplaySpeed = Number(autoplaySpeed);
      speed = Number(speed);
      if (width <= 767) {
        if (spacing >= 15) {
          spacing = 15;
        }
      } else if (width <= 1199) {
        if (spacing >= 30) {
          spacing = 30;
        }
      }
      new Swiper("#bls__swiper-" + sectionId, {
        slidesPerView: itemMobile,
        spaceBetween: spacing,
        autoplay: autoplaying,
        delay: autoplaySpeed,
        loop: loop,
        effect: effect,
        speed: speed,
        grid: {
          rows: row,
          fill: "row",
        },
        navigation: {
          nextEl: e.querySelector(".swiper-button-next"),
          prevEl: e.querySelector(".swiper-button-prev"),
        },
        pagination: {
          clickable: true,
          el: e.querySelector(".swiper-pagination"),
        },
        breakpoints: {
          768: {
            slidesPerView: itemTablet,
          },
          1200: {
            slidesPerView: itemDesktop,
          },
        },
      });
    },
  };
})();
BlsSettingsSwiper.init();

document.addEventListener("shopify:section:load", function (event) {
  var id = event.detail.sectionId;
  var section = event.target.querySelector("[" + "data-id" + '="' + id + '"]');
  if (section) {
    var element = section.querySelector(".bls__swiper");
    if (element) {
      BlsSettingsSwiper.BlsCarousel(element);
    }
  }
  if (id) {
    BlsLazyloadImg.init();
  }
});

var BlsToggle = (function () {
  return {
    init: function () {
      this.initToggle(), this.backToTop(), this.initToggleLookbook();
    },
    initToggle: function () {
      var faq_parent = ".bls__page-faq-items > .bls__page-faq-title";
      document.querySelectorAll(faq_parent).forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.currentTarget;
          const parent = target.parentElement;
          const faqContent = parent.querySelector(".bls__page-faq-content");
          slideAnime({
            target: faqContent,
            animeType: "slideToggle",
          });
          if (item.closest(".bls-toggle").classList.contains("active")) {
            item.closest(".bls-toggle").classList.remove("active");
          } else {
            item.closest(".bls-toggle").classList.add("active");
          }
        });
      });
    },
    backToTop: function () {
      const b = document.querySelector(".back-top");
      document.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
          b.classList.add("show");
        } else {
          b.classList.remove("show");
        }
      });
      b.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    },
    initToggleLookbook: function () {
      document.body.addEventListener("click", (evt) => {
        const target = evt.target;
        if (
          !target.closest(".bls__product-item") &&
          target !=
            document.querySelector(
              ".bls__product-item.active .lookbook__popup-items"
            )
        ) {
          const lookbook_items =
            document.querySelectorAll(".bls__product-item");
          lookbook_items.forEach((items) => {
            items.classList.remove(
              "active",
              "top",
              "bottom",
              "left",
              "right",
              "center"
            );
          });
        }
      });
      document.body.addEventListener("click", this.onBodyClick);
      const lookbook = document.querySelectorAll(".lookbook-action");
      lookbook.forEach((action) => {
        action.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const item = target.closest(".bls__product-item");
          const lookbook_item = item.querySelector(".lookbook__popup-items");
          const rect = item.getBoundingClientRect();
          const rect_item = lookbook_item.getBoundingClientRect();
          const item_right = rect_item.right;
          const item_left = rect_item.left;
          let height = window.innerHeight;
          let width = window.innerWidth;
          let pos_l = "center";
          const top = rect.top;
          const lookbook_items =
            document.querySelectorAll(".bls__product-item");
          if (!item.classList.contains("active")) {
            lookbook_items.forEach((items) => {
              items.classList.remove(
                "active",
                "top",
                "bottom",
                "left",
                "right",
                "center"
              );
            });
            item.classList.add("active");
            if (width > 767) {
              if (item_right > width) {
                pos_l = "left";
              } else if (item_left < 0) {
                pos_l = "right";
              }
              if (top > height / 2) {
                item.classList.add("top", pos_l);
              } else {
                item.classList.add("bottom", pos_l);
              }
            } else {
              if (top > height / 2) {
                item.classList.add("top");
              } else {
                item.classList.add("bottom");
              }
              let left = 0;
              if (item_right > width) {
                left = -50 - (item_right - width);
                lookbook_item.style.left = left + "px";
              } else if (item_left < 0) {
                left = -item_left;
                lookbook_item.style.left = left + "px";
              }
            }
          } else {
            item.classList.remove(
              "active",
              "top",
              "bottom",
              "left",
              "right",
              "center"
            );
          }
        });
      });
    },
  };
})();
BlsToggle.init();

var BlsPopup = (function () {
  return {
    init: function () {
      this.fetchDataNewletter(), this.fetchDataPromotion(),this.checkFormInfo();
    },
    setCookie: function (cname, exdays, cvalue) {
      const date = new Date();
      date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + date.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function (cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    deleteCookie: function (cname) {
      document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
    fetchDataNewletter: function () {
      const url = `${window.location.pathname}?section_id=newsletter-popup`;
      const _this = this;
      if (popup.newsletterPopup !== false) {
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => {
            const html = newParser.parseFromString(responseText, "text/html");
            const n = html.querySelector("#bls__newsletter-popup");
            const c = n?.dataset.show;
            if (c === "show-on-all-pages" || c === "show-on-homepage") {
              if (_this.getCookie("bls-newsletter-popup") === "") {
                var newsletter = EasyDialogBox.create(
                  "newsletterp",
                  "dlg dlg-disable-footer	dlg-disable-drag",
                  "",
                  n.innerHTML
                );
                newsletter.onClose = newsletter.destroy;
                newsletter.show(1000);
                newsletter.onShow = function () {
                  _this.checkNotShowNewletter();
                };
              }
            }
          })
          .catch((e) => {
            throw e;
          });
      }
    },
    checkNotShowNewletter: function () {
      const _this = this;
      const check = document.getElementById("doNotShow");
      check.addEventListener("change", (e) => {
        if (e.currentTarget.checked) {
          _this.setCookie("bls-newsletter-popup", 99999, "bls");
        } else {
          _this.deleteCookie("bls-newsletter-popup");
        }
      });
    },
    fetchDataPromotion: function () {
      const url = "?section_id=promotion-popup";
      const _this = this;
      if (popup.promotionPopup !== false) {
        fetch(`${window.Shopify.routes.root}${url}`)
          .then((response) => response.text())
          .then((responseText) => {
            const html = newParser.parseFromString(responseText, "text/html");
            const p = html.querySelector("#bls__promotion-popup");
            const s = p?.dataset.show === "true";
            const m = p?.dataset.showMb === "true";
            if (s === true) {
              if (_this.getCookie("bls-promotion-popup") === "") {
                var promotion = EasyDialogBox.create(
                  "promotionp",
                  `dlg dlg-disable-footer ${
                    m ? "" : "dlg-disable-mobile"
                  } dlg-disable-drag`,
                  "",
                  p.innerHTML
                );
                promotion.onClose = promotion.destroy;
                promotion.show(6000);
                promotion.onShow = function () {
                  _this.copyPromotion();
                  _this.checkNotShowPromotion();
                };
              }
            }
          })
          .catch((e) => {
            throw e;
          });
      }
    },
    checkNotShowPromotion: function () {
      const _this = this;
      const check = document.querySelector("#doNotShowPromotion");
      check.addEventListener("change", (e) => {
        if (e.currentTarget.checked) {
          _this.setCookie("bls-promotion-popup", 99999, "bls");
        } else {
          _this.deleteCookie("bls-promotion-popup");
        }
      });
    },
    copyPromotion: function () {
      const cp = document.querySelectorAll(".discount");
      if (cp !== null) {
        cp.forEach((e) => {
          e.addEventListener("click", (el) => {
            el.preventDefault();
            navigator.clipboard.writeText(e?.dataset.code);
            e.classList.add("action-copy");
            setTimeout(() => {
              e.classList.remove("action-copy");
            }, 1500);
          });
        });
      }
    },
    checkFormInfo: function(){
      const _this = this;
      const urlInfo = window.location.href;
      const formInfo = document.querySelector('.form-infor');
      const formErr = document.querySelector('.form-infor-body.noti-error');
      const formSuccess = document.querySelector('.form-infor-body.noti-success');
      document.querySelector('.form-infor,.close-form-info').addEventListener('click', (e) => {
        const target = e.currentTarget;
        const closet = target.closest('.form-infor');
        e.preventDefault();
        if (closet.classList.contains('show-noti-form')) {
          closet.classList.remove('show-noti-form')
        };
      });
      if (urlInfo.indexOf('customer_posted=true') >= 1) {
        formInfo.classList.add('show-noti-form');
        formErr.style.display = "none";
        _this.setCookie("bls-newsletter-popup", 99999, "bls");
        const newURL = location.href.split("?")[0];
        window.history.pushState('object', document.title, newURL);
      };
      if (urlInfo.indexOf('contact%5Btags%5D=newsletter&form_type=customer') >= 1) {
        formInfo.classList.add('show-noti-form');
        formSuccess.style.display = "none";
        const newURL = location.href.split("?")[0];
        window.history.pushState('object', document.title, newURL);
      }
    }
  };
})();
BlsPopup.init();

var BlsLoginPopup = (function () {
  return {
    init: function () {
      this.showLogin();
    },
    clickTab: function () {
      const hidden = document.querySelectorAll("[data-login-hidden]");
      const show = document.querySelectorAll("[data-login-show]");
      const iTitle = document.querySelector(
        "#loginp_0 .dlg-heading .popup-title"
      );
      show.forEach((e) => {
        var s = e?.dataset.loginShow;
        e.addEventListener("click", function (el) {
          el.preventDefault();
          hidden.forEach((eh) => {
            var h = eh?.dataset.loginHidden;
            if (eh.getAttribute("aria-hidden") === "true" && s === h) {
              eh.setAttribute("aria-hidden", "false");
              iTitle.innerText = s;
            } else {
              eh.setAttribute("aria-hidden", "true");
            }
          });
        });
      });
    },
    showLogin: function () {
      const action = document.querySelector(".action-login");
      const _this = this;
      if (action !== null) {
        action.addEventListener("click", (e) => {
          e.preventDefault();
          _this.fetchDataLogin();
          document.body.classList.add("login-popup-show");
        });
      }
    },
    fetchDataLogin: function () {
      const url = "/?section_id=login-popup";
      const _this = this;
      fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
          const html = newParser.parseFromString(responseText, "text/html");
          const l = html.querySelector("#login-popup");
          var login = EasyDialogBox.create(
            "loginp",
            "dlg dlg-disable-footer dlg-disable-drag",
            "Login",
            l.innerHTML
          );
          login.onClose = login.destroy;
          login.show();
          _this.clickTab();
        })
        .catch((e) => {
          throw e;
        });
    },
  };
})();
BlsLoginPopup.init();

var BlsFakeOrder = (function () {
  return {
    init: function () {
      this.showFakeOrder();
    },
    showFakeOrder: function (e) {
      const prd = document.querySelector("#bls__fake-order");
      const delayTime = prd?.dataset.timeDelay;
      const displayTime = prd?.dataset.timeDisplay;

      var randomNumber = 0;
      var randomImg = 0;
      var lastRandomNumber = 0;

      if (prd != null) {
        const u = document.querySelector("#bls__data-url").innerHTML;
        const t = document.querySelector("#bls__data-title").innerHTML;
        const i = document.querySelector("#bls__data-img").innerHTML;
        const c = document.querySelector("#bls__data-user").innerHTML;

        const title = document.querySelector("[data-title-fake]");
        const url = document.querySelectorAll("[data-url]");
        const image = document.querySelector("[data-img]");
        const user = document.querySelector("[data-user]");
        const time = document.querySelector("[data-time]");
        const prog = document.querySelector("[data-progressbar]");

        const j = JSON.parse(u);
        const k = JSON.parse(t);
        const l = JSON.parse(i);
        const m = JSON.parse(c);

        const close = document.querySelector(".fake-order-close");
        const invail_fake_data = setInterval(randomData, delayTime);
        close.addEventListener("click", () => {
          clearInterval(invail_fake_data);
          prd.classList.remove("animate__fadeInUp");
          prd.classList.add("animate__fadeInDown");
          prog.style.animationDuration = "";
          prog.style.animationName = "";
          prog.style.animationFillMode = "";
          prog.style.background = "";
          prog.style.animationTimingFunction = "";
        });
        function randomData() {
          if (!prd.classList.contains("animate__fadeInUp")) {
            if (j.length > 0) {
              prd.style.removeProperty("display");
              prd.classList.add("animate__fadeInUp");
              prd.classList.remove("animate__fadeInDown");
              do {
                randomNumber = Math.floor(Math.random() * (m.length - 1) + 0);
                randomImg = Math.floor(Math.random() * (l.length - 1) + 0);
              } while (
                randomNumber == lastRandomNumber &&
                randomImg == lastRandomNumber
              );
              title.innerText = k[randomImg];
              user.innerText = m[randomNumber];
              if (image) {
                image.src = l[randomImg];
                image.alt = k[randomImg];
              }
              url.forEach((e) => {
                e.href = j[randomImg];
              });
              var fakeTimeOrder = Math.floor(Math.random() * 60 + randomNumber);
              time.innerText = fakeTimeOrder;
              prog.style.animationDuration = `${displayTime}ms`;
              prog.style.animationName = "bls-progressbar";
              prog.style.animationFillMode = "forwards";
              prog.style.animationTimingFunction = "linear";
              prog.style.background = "#111111";

              setTimeout(function () {
                prd.classList.remove("animate__fadeInUp");
                prd.classList.add("animate__fadeInDown");
                prog.style.animationDuration = "";
                prog.style.animationName = "";
                prog.style.animationFillMode = "";
                prog.style.animationTimingFunction = "";
                prog.style.background = "";
              }, displayTime);
            }
          }
        }
      }
    },
  };
})();
BlsFakeOrder.init();

var BlsBeforeYouLeave = (function () {
  return {
    init: function () {
      this.showPopup();
    },
    showPopup: function () {
      const id = document.querySelector("#BlsBefore");
      const delay = id?.dataset.timeDelay;
      var action = 0;

      if (id !== null) {
        var getPopup = setTimeout(() => {
          getTimeOut();
        }, delay * 1000);

        const addMultipleListeners = (
          el,
          types,
          listener,
          options,
          useCapture
        ) => {
          types.forEach((type) =>
            el.addEventListener(type, listener, options, useCapture)
          );
        };

        addMultipleListeners(
          document.querySelector("body"),
          ["scroll", "click", "mousemove", "keydown"],
          () => {
            setAction();
          }
        );
        const closeBefore = document.querySelector(".close-before");
        closeBefore.addEventListener("click", () => {
          clearTimeout(getPopup);
          document
            .querySelector(".bls__overlay")
            .classList.add("d-none-overlay");
          document.documentElement.classList.remove("hside_opened");
          id.classList.remove("bls__opend-popup");
        });

        function getTimeOut() {
          action = action + 1;
          if (action >= 1) {
            document
              .querySelector(".bls__overlay")
              .classList.remove("d-none-overlay");
            document.documentElement.classList.add("hside_opened");
            id.classList.add("bls__opend-popup");
            BlsPopup.copyPromotion();
          }
        }
        function setAction() {
          action = action - 1;
        }
      }
    },
  };
})();
BlsBeforeYouLeave.init();

var BlsLazyloadImg = (function () {
  return {
    init: function () {
      this.lazyReady();
    },
    lazyReady: function () {
      if (!!window.IntersectionObserver) {
        let observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.width = entry.boundingClientRect.width;
                entry.target.height = entry.boundingClientRect.height;
                entry.target.sizes = `${entry.boundingClientRect.width}px`;
                entry.target.classList.add("bls-loaded-image");
                entry.target
                  .closest(".bls-image-js")
                  .classList.remove("bls-loading-image");
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "10px" }
        );
        document.querySelectorAll(".bls-image-js img").forEach((img) => {
          observer.observe(img);
        });
      }
    },
  };
})();
BlsLazyloadImg.init();

const rdc = {
  mode: "same-origin",
  credentials: "same-origin",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
};
let parser = new DOMParser();
const c = new Map();
const productRecommendationsSection = document.querySelector(
  ".product-recommendations"
);

var BlsReloadEvents = (function () {
  return {
    init: function () {
      this.setupEventListeners();
    },

    setupEventListeners: function () {
      document.addEventListener("shopify:section:load", function (event) {
        var id = event.detail.sectionId;

        var section = event.target.querySelector(
          "[" + "data-id" + '="' + id + '"]'
        );

        if (section != undefined) {
          const { type } = section?.dataset;
          switch (type) {
            case "instagram":
              BlsInstagramShopify.init();
              break;
            case "product_grid":
              BlsProductGridEvents.init();
              BlsProductTabEvents.init();
              BlsColorSwatchesShopify.init();
              break;
            case "product_carousel":
              BlsProductGridEvents.init();
              BlsProductTabEvents.init();
              BlsColorSwatchesShopify.init();
              break;
            case "recently_viewed_products":
              BlsRVProductsShopify.init();
              break;
            case "product_recommendations":
              BlsProductRecommendsEvents.init();
              break;
            case "product_single":
              BlsColorSwatchesShopify.init();
              break;
            case "product_deal":
              BlsColorSwatchesShopify.init();
              BlsCountdownTimer.init();
              break;
            default:
              break;
          }
        }
      });
    },
  };
})();
BlsReloadEvents.init();

var BlsInstagramShopify = (function () {
  return {
    init: function () {
      this.loadInstagram();
    },

    loadInstagram: function () {
      const ig_class = document.querySelectorAll(".bls__instagram-api");
      ig_class.forEach((e) => {
        if (e != undefined) {
          const { accessToken, images, igType } = e?.dataset;
          if (accessToken) {
            this.initInstagram(e, accessToken, images, igType);
          } else {
            console.warn("Access Token is invalid!");
          }
        }
      });
    },

    initInstagram: async function (nodeElement, at, num_img, igType) {
      const _this = this;
      let i = num_img !== undefined ? num_img : 4;
      const resp = await this.fetchCache(
        `https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${at}`,
        {
          cache: "force-cache",
        }
      );
      if (!resp) return;

      if (resp.error) {
        return console.error("Instagram error: ", resp.error?.message);
      }
      if (igType === "carousel") {
        _this.initCarousel(resp.data, nodeElement, i);
      } else {
        _this.initGrid(resp.data, nodeElement, i);
      }
    },

    fetchCache: function (u, fetchOption) {
      let cf = fetchOption !== undefined ? fetchOption : rdc;
      return new Promise((resolve, reject) => {
        if (c.get(u)) {
          return resolve(c.get(u));
        }
        fetch(u, cf)
          .then((res) => {
            if (res.ok) {
              const j = res.json();
              resolve(j);
              c.set(u, j);
              return j;
            } else {
              reject(res);
            }
          })
          .catch(reject);
      });
    },

    initCarousel: function (images, nodeElement, i) {
      images
        .filter(
          (d) => d.media_type === "IMAGE" || d.media_type === "CAROUSEL_ALBUM"
        )
        .slice(0, i)
        .forEach((image) => {
          var node = document.createElement("div");
          node.classList.add("swiper-slide");
          var responsiveImageNode = document.createElement("div");
          var node_ig_item = document.createElement("div");
          node_ig_item.classList.add("bls__instagram-item");
          var imgUrl = document.createElement("a");
          var ig_logo = document.createElement("span");
          ig_logo.classList.add("bls__instagram-icon");
          responsiveImageNode.classList.add("bls__responsive-image");
          responsiveImageNode.classList.add("bls_instagram-image");
          responsiveImageNode.classList.add("bls-image-js");
          responsiveImageNode.setAttribute("style", "--aspect-ratio:1/1");
          responsiveImageNode.innerHTML += `<img src="${image.media_url}" srcset="${image.media_url}&width=165 165w,${image.media_url}&width=330 330w,${image.media_url}&width=535 535w,${image.media_url}&width=750 750w,${image.media_url}&width=1000 1000w,${image.media_url}&width=1500 1500w,${image.media_url}&width=3000 3000w" sizes="(min-width: 1260px) 282px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" loading="lazy" alt="instagram">`;
          imgUrl.setAttribute("href", image.permalink);
          imgUrl.appendChild(responsiveImageNode);
          imgUrl.appendChild(ig_logo);
          node_ig_item.appendChild(imgUrl);
          node.appendChild(node_ig_item);
          nodeElement.querySelector(".swiper-wrapper").appendChild(node);
        });
      BlsLazyloadImg.init();
    },

    initGrid: function (images, nodeElement, limits) {
      const _this = this;
      const gridNode = nodeElement.querySelector(".bls__instagram-grid");
      if (gridNode) {
        const { spacing } = gridNode?.dataset;
        nodeElement.setAttribute("style", "--bs-gutter-x:" + spacing + "px");
        var items = Number(limits);
        images
          .filter(
            (d) => d.media_type === "IMAGE" || d.media_type === "CAROUSEL_ALBUM"
          )
          .slice(0, items)
          .forEach((image) => {
            var node = document.createElement("div");
            node.classList.add("bls__instagram-item");
            var imgUrl = document.createElement("a");
            var ig_logo = document.createElement("span");
            ig_logo.classList.add("bls__instagram-icon");
            var nodeChild = document.createElement("div");
            nodeChild.classList.add("bls__responsive-image");
            nodeChild.classList.add("bls-image-js");
            nodeChild.setAttribute("style", "--aspect-ratio: 1/1");
            nodeChild.classList.add("bls_instagram-image");
            nodeChild.innerHTML += `<img src="${image.media_url}" srcset="${image.media_url}&width=165 165w,${image.media_url}&width=330 330w,${image.media_url}&width=535 535w,${image.media_url}&width=750 750w,${image.media_url}&width=1000 1000w,${image.media_url}&width=1500 1500w,${image.media_url}&width=3000 3000w" sizes="(min-width: 1260px) 282px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" loading="lazy" alt="instagram">`;
            imgUrl.setAttribute("href", image.permalink);
            imgUrl.appendChild(nodeChild);
            imgUrl.appendChild(ig_logo);
            node.appendChild(imgUrl);
            gridNode.querySelector(".row").appendChild(node);
            BlsLazyloadImg.init();
          });
      }
    },
  };
})();
BlsInstagramShopify.init();

var BlsProductGridEvents = (function () {
  return {
    init: function () {
      this.setupEventListeners();
    },

    setupEventListeners: function () {
      const _this = this;
      document.querySelectorAll(".bls__btn-load-more").forEach((el) => {
        el.addEventListener("click", function () {
          const sectionId = this.closest(".bls__grid").dataset.id;
          _this.loadButtonLoadMore(sectionId);
        });
      });
    },

    loadButtonLoadMore: function (sectionId) {
      const defClass = document.querySelector(
        ".bls__load-more_wrap-" + sectionId
      );
      if (defClass != undefined) {
        const { nextUrl, currentPage, totalPages } = defClass?.dataset;
        this.loadMore(defClass, sectionId, nextUrl, currentPage, totalPages);
      }
    },

    loadMore: function (defClass, sectionId, nextUrl, currentPage, totalPages) {
      const grid = document.querySelector("#bls__product-grid-" + sectionId);
      if (grid != undefined) {
        const { id, r, d, to } = grid?.dataset;
        const loadMoreBtn = defClass.querySelector('[type="button"]');
        loadMoreBtn.classList.add("btn-loading");
        let nextPage = parseInt(currentPage) + 1;
        fetch(`${nextUrl}?page=${nextPage}&section_id=${id}`)
          .then((response) => response.text())
          .then((responseText) => {
            const productNodes = parser.parseFromString(
              responseText,
              "text/html"
            );
            const productNodesHtml = productNodes.querySelectorAll(
              `#bls__product-grid-${sectionId} .bls__product-load`
            );
            productNodesHtml.forEach((prodNode) =>
              document
                .getElementById(`bls__product-grid-${sectionId}`)
                .appendChild(prodNode)
            );
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            loadMoreBtn.classList.remove("btn-loading");
            if (nextPage == totalPages) {
              defClass.remove();
            } else {
              defClass.setAttribute("data-current-page", nextPage);
            }
            BlsColorSwatchesShopify.init();
            BlsSectionProductAddCart.updateBtnAdd();
            BlsSubActionProduct.init();
            BlsReloadSpr.init();
            BlsLazyloadImg.init();
          });
      }
    },
  };
})();
BlsProductGridEvents.init();

var BlsProductTabEvents = (function () {
  return {
    init: function () {
      this.setupEventListeners();
      this.setupDropdownStyle();
      document.addEventListener("click", this.closeAllSelect);
    },

    setupEventListeners: function (value) {
      document.querySelectorAll(".bls__collection-tab").forEach((el) => {
        const tab_item = el.querySelectorAll(".bls__collection-tab-item");
        if (tab_item.length != 0) {
          tab_item.forEach((e) => {
            e.addEventListener("click", function () {
              if (!this.classList.contains("active")) {
                el.querySelectorAll(".bls__collection-tab-item").forEach(
                  (element) => {
                    element.classList.remove("active");
                  }
                );
                this.classList.add("active");
                const tabId = this.dataset.id;
                el.querySelectorAll(".bls__cls-tab").forEach((element) => {
                  if (element.id === tabId) {
                    if (!element.classList.contains("active")) {
                      el.querySelectorAll(".bls__cls-tab").forEach((elm) => {
                        elm.classList.remove("active");
                      });
                      element.classList.add("active");
                    }
                  }
                });
              }
            });
          });
        } else {
          const tabId = value;
          el.querySelectorAll(".bls__cls-tab").forEach((element) => {
            if (element.id === tabId) {
              if (!element.classList.contains("active")) {
                el.querySelectorAll(".bls__cls-tab").forEach((elm) => {
                  elm.classList.remove("active");
                });
                element.classList.add("active");
              }
            }
          });
        }
      });
    },

    setupDropdownStyle: function () {
      const _this = this;
      var x, i, j, l, ll, selElmnt, a, b, z, p, o;
      x = document.getElementsByClassName("custom-select");
      l = x.length;
      if (l > 0) {
        for (i = 0; i < l; i++) {
          selElmnt = x[i].getElementsByTagName("select")[0];
          x[i].innerHTML = "";
          x[i].appendChild(selElmnt);
          ll = selElmnt.length;
          a = document.createElement("div");
          a.setAttribute(
            "class",
            "select-selected flex justify-content-between w-full"
          );
          p = document.createElement("span");
          p.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
          a.appendChild(p);
          o = document.createElement("span");
          o.setAttribute("class", "select-arrow");
          o.innerHTML = `<svg fill="currentColor" width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"></path></svg>`;
          a.appendChild(o);
          x[i].appendChild(a);
          b = document.createElement("div");
          b.setAttribute("class", "select-items select-hide");
          for (j = 0; j < ll; j++) {
            z = document.createElement("div");
            z.innerHTML = selElmnt.options[j].innerHTML;
            if (selElmnt.options[j].getAttribute("selected")) {
              z.setAttribute("class", "same-as-selected");
            }
            z.addEventListener("click", function (e) {
              var y, i, k, s, h, sl, yl;
              s = this.parentNode.parentNode.getElementsByTagName("select")[0];
              sl = s.length;
              h = this.parentNode.previousSibling;
              for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                  s.selectedIndex = i;
                  h.childNodes[0].innerHTML = this.innerHTML;
                  y =
                    this.parentNode.getElementsByClassName("same-as-selected");
                  yl = y.length;
                  for (k = 0; k < yl; k++) {
                    y[k].removeAttribute("class");
                  }
                  this.setAttribute("class", "same-as-selected");
                  break;
                }
              }
              s.dispatchEvent(new Event("change"));
              s.dispatchEvent(new Event("click"));
              h.click();
            });
            b.appendChild(z);
          }
          x[i].appendChild(b);
          a.addEventListener("click", function (e) {
            e.stopPropagation();
            _this.closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
            _this.setupEventListeners(
              this.closest(".custom-select").querySelector(".select-data").value
            );
          });
        }
      }
    },
    closeAllSelect: function (elmnt) {
      var x,
        y,
        i,
        xl,
        yl,
        arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName(
        "select-selected flex justify-content-between w-full"
      );
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i);
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    },
  };
})();
BlsProductTabEvents.init();

var BlsColorSwatchesShopify = (function () {
  return {
    init: function () {
      this.initSwatches();
    },

    initSwatches: function () {
      const _this = this;
      const actionSwatchColor = document.querySelectorAll(
        ".bls__product-color-swatches"
      );
      actionSwatchColor.forEach((e) => {
        _this.checkSwatches(e);
      });
      const actionSwatch = document.querySelectorAll(".bls__option-swatch-js");
      actionSwatch.forEach((e) => {
        const productTarget = e.closest(".bls__product-item");
        if (productTarget) {
          e.addEventListener("mouseover", () => {
            _this.listenerColor(e, productTarget);
          });
        }
      });
    },

    listenerColor: function (e, productTarget) {
      const _this = this;
      setTimeout(() => {
        if (!e.classList.contains("active")) {
          const activeSwatches = e
            .closest(".bls__product-option")
            .querySelectorAll(".bls__option-swatch-js");
          activeSwatches.forEach((el) => {
            el.classList.remove("active");
          });
          e.classList.toggle("active");
          _this.swapProduct(productTarget);
        }
      }, 0);
    },

    updateMasterId(options, variantData) {
      var result = variantData.find((variant) => {
        return !variant.options
          .map((option, index) => {
            return options[index] === option;
          })
          .includes(false);
      });
      return result;
    },

    updatePrice(currentVariant, productTarget) {
      if (!currentVariant) return;
      const compare_at_price = currentVariant.compare_at_price;
      const price = currentVariant.price;
      const unit_price = currentVariant.unit_price
      const unit_price_measurement = currentVariant.unit_price_measurement
      const price_format = Shopify.formatMoney(
        currentVariant.price,
        cartStrings.money_format
      );
      if (unit_price && unit_price_measurement) {
        const price_num = Shopify.formatMoney(unit_price, cartStrings.money_format)
        const price_unit = unit_price_measurement.reference_value != 1 ? unit_price_measurement.reference_value : unit_price_measurement.reference_unit
        productTarget.querySelector('.unit-price .number').innerHTML = price_num;
        productTarget.querySelector('.unit-price .unit').innerHTML = price_unit;
      }
      productTarget.querySelector(".price__regular .price").innerHTML =
        price_format;
      const bls__price = productTarget.querySelector(".bls__price");
      bls__price.classList.remove("price--sold-out", "price--on-sale");
      bls__price
        .querySelector(".price__regular .price")
        .classList.remove("special-price");
      if (compare_at_price && compare_at_price > price) {
        const compare_format = Shopify.formatMoney(
          compare_at_price,
          cartStrings.money_format
        );
        bls__price.querySelector(".compare-price").innerHTML = compare_format;
        bls__price.classList.add("price--on-sale");
        bls__price
          .querySelector(".price__regular .price")
          .classList.add("special-price");
      } else if (!currentVariant.available) {
        bls__price.classList.add("price--sold-out");
      }
    },

    updateMedia(currentVariant, productTarget) {
      if (!currentVariant) return;
      if (!currentVariant.featured_media) return;
      setTimeout(() => {
        productTarget
          .querySelector(".bls__product-main-img img")
          .removeAttribute("srcset");
        productTarget
          .querySelector(".bls__product-main-img img")
          .setAttribute("src", currentVariant.featured_media.preview_image.src);
      }, 200);
    },

    renderProductInfo(currentVariant, variantQtyData, productTarget, color) {
      let qty = 0;
      let percent = 0;
      let sale = false;
      let sold_out = false;
      let pre_order = false;
      const compare_at_price = currentVariant.compare_at_price;
      const price = currentVariant.price;
      variantQtyData.find((variantQty) => {
        if (variantQty.id === currentVariant.id) {
          qty = variantQty.qty;
        }
      });
      if (compare_at_price && compare_at_price > price) {
        sale = true;
        percent = ((compare_at_price - price) / compare_at_price) * 100;
      }
      if (currentVariant.available && qty < 1) {
        pre_order = true;
      } else if (!currentVariant.available) {
        sold_out = true;
      }
      const product_label = productTarget.querySelector(".bls__product-label");
      if (product_label) {
        product_label.remove();
      }
      if (sale || pre_order || sold_out) {
        var element = document.createElement("div");
        element.classList.add(
          "bls__product-label",
          "fs-12",
          "pointer-events-none",
          "absolute"
        );
        productTarget.querySelector(".bls__product-img").appendChild(element);
        const label = productTarget.querySelector(".bls__product-label");
        if (sold_out) {
          var element_sold_out = document.createElement("div");
          element_sold_out.classList.add("bls__sold-out-label");
          element_sold_out.innerText = window.variantStrings.soldOut;
          label.appendChild(element_sold_out);
        } else {
          if (sale) {
            var element_sale = document.createElement("div");
            element_sale.classList.add("bls__sale-label");
            element_sale.innerText = -percent.toFixed(0) + "%";
            label.appendChild(element_sale);
          }
          if (pre_order) {
            var element_pre_order = document.createElement("div");
            element_pre_order.classList.add("bls__pre-order-label");
            element_pre_order.innerText = window.variantStrings.preOrder;
            label.appendChild(element_pre_order);
          }
        }
      }

      const productAddCartDiv = productTarget.querySelector(
        ".bls__product-addtocart-js"
      );
      if (productAddCartDiv) {
        const currentVariantId = productAddCartDiv.dataset.productVariantId;
        if (Number(currentVariantId) !== currentVariant.id) {
          productAddCartDiv.dataset.productVariantId = currentVariant.id;
        }
      }
      this.toggleAddButton(
        !currentVariant.available,
        window.variantStrings.soldOut,
        productTarget,
        pre_order
      );
    },

    toggleAddButton(disable = true, text, productTarget, pre_order = false) {
      const productForm = productTarget;
      if (!productForm) return;
      const addButton = productForm.querySelector(".bls__js-addtocart");
      const addButtonText = productTarget.querySelector(
        ".bls__js-addtocart .bls__button-content"
      );
      const addButtonTooltipText = productTarget.querySelector(
        ".bls__js-addtocart .bls_tooltip-content"
      );
      if (!addButton) return;
      if (disable) {
        addButton.setAttribute("disabled", "disabled");
        if (text) {
          addButtonText.textContent = text;
          addButtonText.textContent = text;
        }
      } else {
        addButton.removeAttribute("disabled");
        if (pre_order) {
          addButtonText.textContent = window.variantStrings.preOrder;
          addButtonTooltipText.textContent = window.variantStrings.preOrder;
        } else {
          addButtonText.textContent = window.variantStrings.addToCart;
          addButtonTooltipText.textContent = window.variantStrings.addToCart;
        }
      }
    },

    setUnavailable(productTarget) {
      const addButton = productTarget.querySelector(".bls__js-addtocart");
      const addButtonText = productTarget.querySelector(
        ".bls__js-addtocart .bls__button-content"
      );
      const addButtonTooltipText = productTarget.querySelector(
        ".bls__js-addtocart .bls_tooltip-content"
      );
      if (!addButton) return;
      addButtonText.textContent = window.variantStrings.unavailable;
      addButtonTooltipText.textContent = window.variantStrings.unavailable;
    },

    swapProduct: function (productTarget) {
      const product_swatch_active = productTarget.querySelector(
        ".bls__option-swatch-js.active"
      );
      const position_swatch =
        product_swatch_active.getAttribute("data-position");
      const variantData = JSON.parse(
        productTarget.querySelector(".productinfo").textContent
      );
      const variantQtyData = JSON.parse(
        productTarget.querySelector(".productVariantsQty").textContent
      );
      let options = Array.from(
        productTarget.querySelectorAll(".bls__option-swatch-js.active"),
        (select) => select.getAttribute("data-value")
      );
      variantData.find((variant) => {
        if (options.length == 1) {
          const variantOptions = {
            1: variant.option1,
            2: variant.option2,
            3: variant.option3,
          };
          if (variantOptions[position_swatch] === options[0]) {
            options = variant.options;
          }
        }
      });
      const currentVariant = this.updateMasterId(options, variantData);
      this.toggleAddButton(true, "", productTarget);
      if (!currentVariant) {
        this.toggleAddButton(true, "", productTarget);
        this.setUnavailable(productTarget);
      } else {
        this.updatePrice(currentVariant, productTarget);
        this.updateMedia(currentVariant, productTarget);
        this.renderProductInfo(currentVariant, variantQtyData, productTarget, product_swatch_active.dataset.color);
      }
    },

    checkSwatches: function (e) {
      const { color, image } = e?.dataset;
      if (this.checkColor(color)) {
        e.style.backgroundColor = color;
      } else {
        if (image) {
          e.classList.add = "bls__" + color.replace(" ", "-");
          e.style.backgroundColor = null;
          e.style.backgroundImage = "url('" + image + "')";
          e.style.backgroundSize = "cover";
          e.style.backgroundRepeat = "no-repeat";
        }
      }
    },

    checkColor: function (strColor) {
      var s = new Option().style;
      s.color = strColor;
      return s.color == strColor;
    },
  };
})();
BlsColorSwatchesShopify.init();

var BlsRVProductsShopify = (function () {
  return {
    init: function () {
      this.initRVProducts();
    },

    initRVProducts: function () {
      const _this = this;
      var elem = document.querySelectorAll(
        ".bls__product-recently-viewed-section"
      );
      if (elem) {
        var savedProductsArr = JSON.parse(
          localStorage.getItem("bls__recently-viewed-products")
        );
        if (savedProductsArr === null) {
          elem.forEach((e) => {
            e.closest(".shopify-section").remove();
          });
        } else {
          _this.getStoredProducts(savedProductsArr.reverse());
        }
      }
    },

    getStoredProducts: function (product) {
      var query = "";
      product.forEach((e, key, product) => {
        if (!Object.is(product.length - 1, key)) {
          query += e.id + "%20OR%20id:";
        } else {
          query += e.id;
        }
      });

      var productAjaxURL =
        "?q=id:" +
        query +
        "&section_id=products-recently-viewed&sort_by=price-ascending";
      fetch(`${window.routes.search_url}${productAjaxURL}`)
        .then((response) => response.text())
        .then(async (responseText) => {
          document
            .querySelectorAll(".bls__product-recently-viewed")
            .forEach((ele) => {
              const html = parser.parseFromString(responseText, "text/html");
              let item_html = html.querySelectorAll(".bls__product-item");
              let arr = [];
              item_html.forEach((el) => {
                let obj = {
                  id: product.findIndex(
                    (x) => x.handle === el.dataset.productHandle
                  ),
                  node: el,
                };
                arr.push(obj);
              });
              arr.sort(function (a, b) {
                return a.id - b.id;
              });
              arr.forEach((n) => {
                var node = document.createElement("div");
                node.classList.add(
                  "swiper-slide",
                  "bls__product-preload-js",
                  "bls__rv-product-js",
                  "bls__grid"
                );
                node.appendChild(n.node);
                ele.querySelector(".swiper-wrapper").appendChild(node);
              });
            });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally((e) => {
          BlsColorSwatchesShopify.init();
          BlsSettingsSwiper.BlsSettingsCarousel();
          BlsSubActionProduct.init();
          BlsSectionProductAddCart.updateBtnAdd();
          BlsLazyloadImg.init();
        });
    },
  };
})();
BlsRVProductsShopify.init();

var BlsProductRecommendsEvents = (function () {
  return {
    init: function () {
      if (productRecommendationsSection) {
        const observer = new IntersectionObserver(this.handleIntersection, {
          rootMargin: "0px 0px 1200px 0px",
        });
        observer.observe(productRecommendationsSection);
      }
    },

    handleIntersection: function (entries, observer) {
      if (!entries[0].isIntersecting) return;

      observer.unobserve(productRecommendationsSection);

      const url = productRecommendationsSection.dataset.url;

      fetch(url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector(
            ".product-recommendations"
          );
          if (recommendations && recommendations.innerHTML.trim().length) {
            productRecommendationsSection.innerHTML = recommendations.innerHTML;
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally((e) => {
          BlsColorSwatchesShopify.init();
          BlsSettingsSwiper.BlsSettingsCarousel();
          BlsSubActionProduct.init();
          BlsSectionProductAddCart.updateBtnAdd();
          BlsLazyloadImg.init();
        });
    },
  };
})();
BlsProductRecommendsEvents.init();

var BlsCountdownTimer = (function () {
  return {
    init: function () {
      this.handleCountdown();
      this.eventCountDownTimer();
    },

    eventCountDownTimer: function () {
      const element = document.querySelectorAll(".bls__countdown-timer");

      if (element.length === 0) return;
      element.forEach((e) => {
        const day = e.getAttribute("data-days");
        const hrs = e.getAttribute("data-hrs");
        const secs = e.getAttribute("data-secs");
        const mins = e.getAttribute("data-mins");
        const time = e.getAttribute("data-time");
        var countDownDate = new Date(time).getTime();
        var timer = setInterval(function () {
          var now = new Date().getTime();
          var distance = countDownDate - now;
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          var html =
            '<span class="countdown-days"><span class="countdown_ti heading-weight">' +
            days +
            '</span> <span class="countdown_tx">' +
            day +
            "</span></span> " +
            '<span class="countdown-hours"><span class="countdown_ti heading-weight">' +
            hours +
            '</span> <span class="countdown_tx">' +
            hrs +
            "</span></span> " +
            '<span class="countdown-min"><span class="countdown_ti heading-weight">' +
            minutes +
            '</span> <span class="countdown_tx">' +
            mins +
            "</span></span> " +
            '<span class="countdown-sec"><span class="countdown_ti heading-weight">' +
            seconds +
            '</span> <span class="countdown_tx">' +
            secs +
            "</span></span>";
          e.querySelector(".bls__product-countdown").innerHTML = html;
          if (distance < 0) {
            clearInterval(timer);
          }
        }, 1000);
      });
    },

    handleCountdown: function () {
      var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
      const timer = document.querySelectorAll(".bls__timer");
      timer.forEach((e) => {
        const { timer } = e?.dataset;
        var countDown = new Date(timer).getTime();
        if (countDown) {
          setInterval(function () {
            var now = new Date().getTime(),
              distance = countDown - now;
            if (countDown >= now) {
              (e.querySelector(".js-timer-days").innerText =
                Math.floor(distance / day) < 10
                  ? ("0" + Math.floor(distance / day)).slice(-2)
                  : Math.floor(distance / day)),
                (e.querySelector(".js-timer-hours").innerText = (
                  "0" + Math.floor((distance % day) / hour)
                ).slice(-2)),
                (e.querySelector(".js-timer-minutes").innerText = (
                  "0" + Math.floor((distance % hour) / minute)
                ).slice(-2)),
                (e.querySelector(".js-timer-seconds").innerText = (
                  "0" + Math.floor((distance % minute) / second)
                ).slice(-2));
            }
          }, second);
        }
      });
    },
  };
})();
BlsCountdownTimer.init();

var BlsSectionProductAddCart = (function () {
  const miniCart =
    document.querySelector("cart-notification") ||
    document.querySelector("cart-drawer");
  return {
    init: function () {
      this.initBtnAdd();
    },

    updateBtnAdd: function () {
      const btnAdd = document.querySelectorAll(".bls__js-addtocart");
      btnAdd.forEach((event) => {
        event.removeEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            this.actionAddToCart(target);
          },
          false
        );
        event.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            this.actionAddToCart(target);
          },
          false
        );
      });
    },

    initBtnAdd: function () {
      const btnAdd = document.querySelectorAll(".bls__js-addtocart");
      btnAdd.forEach((event) => {
        event.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            this.actionAddToCart(target);
          },
          false
        );
      });
    },

    updateMasterId(options, variantData) {
      var result = variantData.find((variant) => {
        return !variant.options
          .map((option, index) => {
            return options[index] === option;
          })
          .includes(false);
      });
      return result;
    },

    actionAddToCart: function (e) {
      const _this = this;
      e.classList.add("btn-loading");
      const productTarget = e.closest(".bls__product-item");
      const exist_load = e.querySelectorAll("span.loader-icon");
      if (exist_load.length === 0) {
        const exist_loading = e.querySelectorAll("div.loader-icon");
        if (exist_loading.length === 0) {
          const spanLoading = document.createElement("div");
          spanLoading.classList.add("loader-icon");
          e.appendChild(spanLoading);
        }
      }
      const qty_input = productTarget.querySelector(".bls__product-qty-js");
      var qty = 1;
      if (qty_input && qty_input.value > 1) {
        qty = qty_input.value;
      }
      const p = productTarget.querySelector(".bls__product-addtocart-js");
      const prodVariantId = p.dataset.productVariantId;
      const sectionMiniCart = miniCart
        .getSectionsToRender()
        .map((section) => section.id);
      if (productTarget.querySelector(".productinfo")) {
        const variantData = JSON.parse(
          productTarget.querySelector(".productinfo").textContent
        );
        let options = Array.from(
          productTarget.querySelectorAll(".bls__option-swatch-js.active"),
          (select) => select.getAttribute("data-value")
        );
        const currentVariant = this.updateMasterId(options, variantData);
        if (!currentVariant) {
          _this.selectOption(productTarget, e);
          return;
        }
      }
      _this.fetchAddCart(prodVariantId, qty, sectionMiniCart, e);
    },

    selectOption: function (productTarget, e) {
      const productHandle = productTarget.dataset.productHandle;
      fetch(
        `${window.Shopify.routes.root}products/${productHandle}/?section_id=product-quickview`
      )
        .then((response) => response.text())
        .then((responseText) => {
          const html = parser.parseFromString(responseText, "text/html");
          html
            .querySelectorAll("#shopify-section-product-quickview")
            .forEach((el) => {
              var quickviewBox = EasyDialogBox.create(
                "dlg-product-quickview",
                "dlg dlg-disable-heading dlg-disable-footer dlg-disable-drag",
                "",
                el.innerHTML
              );
              quickviewBox.onClose = quickviewBox.destroy;
              quickviewBox.show();
            });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          e.classList.remove("btn-loading");
          e.querySelectorAll(".loader-icon").forEach((el) => {
            el.remove();
          });
          BlsColorSwatchesShopify.init();
          Shopify.swiperSlideQickview();
          Shopify.eventFlashSold("dlg");
          Shopify.eventCountDownTimer("dlg");
          Shopify.termsConditionsAction();
          BlsReloadSpr.init();
          Shopify.PaymentButton.init();
          BlsLazyloadImg.init();
        });
    },

    fetchAddCart: function (variantId, quantity, properties, e) {
      fetch(`${routes.cart_add_url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: Number(variantId),
          quantity: Number(quantity),
          sections: properties,
        }),
      })
        .then((response) => {
          return response.text();
        })
        .then((state) => {
          fetch("/cart.json")
            .then((res) => res.json())
            .then((cart) => {
              document.querySelectorAll(".cart-count").forEach((el) => {
                el.innerHTML = cart.item_count;
              });
            })
            .catch((error) => {
              throw error;
            });
          const parsedState = JSON.parse(state);
          miniCart.getSectionsToRender().forEach((section) => {
            const elementToReplace = document.getElementById(section.id);
            const html = new DOMParser().parseFromString(
              parsedState.sections[section.id],
              "text/html"
            );
            elementToReplace.innerHTML =
              html.querySelector("#form-mini-cart").innerHTML;
            const cart_threshold = document.querySelector(
              ".bls__cart-thres-js"
            );
            if (cart_threshold) {
              if (
                html
                  .querySelector(".bls__cart-thres-js")
                  .classList.contains("cart_shipping_free")
              ) {
                cart_threshold.classList.add("cart_shipping_free");
              } else {
                cart_threshold.classList.remove("cart_shipping_free");
              }
              cart_threshold.querySelector(".bls__cart-thres").innerHTML =
                html.querySelector(".bls__cart-thres").innerHTML;
              setTimeout(function () {
                cart_threshold
                  .querySelector(".percent_shipping_bar")
                  .setAttribute(
                    "style",
                    html
                      .querySelector(".percent_shipping_bar")
                      .getAttribute("style")
                  );
              }, 500);
            }
            const countdown = miniCart.querySelector(".cart-countdown-time");
            const html_countdown = html.querySelector(".cart-countdown-time");
            if (countdown && html_countdown) {
              countdown.innerHTML = html_countdown.innerHTML;
              miniCart.countdownTimer();
            }
          });
          miniCart.cartAction();
        })
        .catch((e) => {
          throw e;
        })
        .finally(() => {
          e.classList.remove("btn-loading");
          e.querySelectorAll(".loader-icon").forEach((el) => {
            el.remove();
          });
          if (miniCart && miniCart.classList.contains("is-empty"))
            miniCart.classList.remove("is-empty");
          miniCart.open();
          Shopify.termsConditionsAction();
          BlsLazyloadImg.init();
        });
    },
  };
})();
BlsSectionProductAddCart.init();

("use strict");

var BlsWishlistHeader = (function () {
  return {
    init: function () {
      this.handleCount();
    },
    handleCount: function () {
      const wishlist = document.querySelectorAll(".bls-header-wishlist");
      const items = JSON.parse(localStorage.getItem("bls__wishlist-items"));
      wishlist.forEach((item) => {
        const numb = item.querySelector(".wishlist-count");
        numb.innerText = items !== null && items.length != 0 ? items.length : 0;
      });
    },
  };
})();

var BlsWishlistLoad = (function () {
  return {
    init: function (productHandle, wishlist_items) {
      const is_page_wishlist = document.querySelector(
        ".bls__wishlist-page-section"
      );
      if (productHandle) {
        const arr_items = [];
        if (wishlist_items === null) {
          arr_items.push(productHandle);
          localStorage.setItem(
            "bls__wishlist-items",
            JSON.stringify(arr_items)
          );
        } else {
          let index = wishlist_items.indexOf(productHandle);
          arr_items.push(...wishlist_items);
          if (index === -1) {
            arr_items.push(productHandle);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
          } else if (index > -1) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
            if (is_page_wishlist) {
              const div_no_product = is_page_wishlist.querySelector(
                ".bls__wishlist-no-product-js"
              );
              const item_remove = document.querySelector(
                '.bls__wishlist-list[data-product-handle="' +
                  productHandle +
                  '"]'
              );
              if (item_remove) {
                item_remove.remove();
              }
              if (wishlist_items.length <= 1) {
                div_no_product.classList.remove("d-none");
              }
            }
          }
        }
        BlsSubActionProduct.handleInitWishlist();
      }
    },
  };
})();

var BlsCompareLoad = (function () {
  return {
    init: function (productTarget, compare_items) {
      const is_page_compare = document.querySelector(
        ".bls__compare-page-section"
      );
      if (productTarget) {
        const productHandle = productTarget.dataset.productHandle;
        const arr_items = [];
        if (compare_items === null) {
          arr_items.push(productHandle);
          localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
        } else {
          let index = compare_items.indexOf(productHandle);
          arr_items.push(...compare_items);
          if (index === -1) {
            arr_items.push(productHandle);
            localStorage.setItem(
              "bls__compare-items",
              JSON.stringify(arr_items)
            );
          } else if (index > -1) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__compare-items",
              JSON.stringify(arr_items)
            );
            if (is_page_compare) {
              const div_no_product = is_page_compare.querySelector(
                ".bls__compare-no-product-js"
              );
              const item_remove = document.querySelectorAll(
                '.bls__compare-value[data-product-handle="' +
                  productHandle +
                  '"]'
              );
              if (item_remove.length !== 0) {
                item_remove.forEach((i) => {
                  i.remove();
                });
              }

              if (compare_items.length <= 1) {
                div_no_product.classList.remove("d-none");
                const attr_remove = document.querySelector(
                  ".bls__compare-table"
                );
                if (attr_remove) {
                  attr_remove.classList.add("d-none");
                }
              }
            }
          }
        }
        BlsSubActionProduct.handleInitCompare();
      }
    },
  };
})();

var BlsSubActionProduct = (function () {
  return {
    init: function () {
      this.handleInitQuickviewAction();
      this.handleActionWishlist();
      this.handleInitWishlist();
      this.handleActionCompare();
      this.handleInitCompare();
    },

    handleInitQuickviewAction: function () {
      const _this = this;
      const qvbtn = document.querySelectorAll(".bls__product-quickview");
      if (qvbtn.length > 0) {
        qvbtn.forEach((e) => {
          e.addEventListener("click", () => {
            e.classList.add("btn-loading");
            const exist_load = e.querySelectorAll("span.loader-icon");
            if (exist_load.length === 0) {
              const exist_loading = e.querySelectorAll("div.loader-icon");
              if (exist_loading.length === 0) {
                const spanLoading = document.createElement("div");
                spanLoading.classList.add("loader-icon");
                e.appendChild(spanLoading);
              }
            }
            const productTarget = e.closest(".bls__product-item");
            _this.handleFetchDataQuickView(
              e,
              productTarget.dataset.productHandle
            );
          });
        });
      }
    },

    handleFetchDataQuickView: function (e, handle) {
      const _this = this;
      if (handle) {
        fetch(
          `${window.Shopify.routes.root}products/${handle}/?section_id=product-quickview`
        )
          .then((response) => response.text())
          .then((responseText) => {
            const html = parser.parseFromString(responseText, "text/html");
            html
              .querySelectorAll("#shopify-section-product-quickview")
              .forEach((el) => {
                var quickviewBox = EasyDialogBox.create(
                  "qvdialog",
                  "dlg dlg-disable-heading dlg-disable-footer dlg-disable-drag",
                  "",
                  el.innerHTML
                );
                quickviewBox.onClose = quickviewBox.destroy;
                quickviewBox.show();
                BlsColorSwatchesShopify.init();
                BlsReloadSpr.init();
                Shopify.eventFlashSold("dlg");
                Shopify.eventCountDownTimer("dlg");
                Shopify.swiperSlideQickview();
                BlsLazyloadImg.init();
                Shopify.PaymentButton.init();
              });
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            _this.handleActionWishlist();
            _this.handleInitWishlist();
            _this.handleActionCompare();
            _this.handleInitCompare();
            Shopify.termsConditionsAction();
            e.classList.remove("btn-loading");
            e.querySelectorAll(".loader-icon").forEach((el) => {
              el.remove();
            });
          });
      }
    },

    handleInitWishlist: function () {
      const wishlist_items = JSON.parse(
        localStorage.getItem("bls__wishlist-items")
      );
      const wishlist_icon = document.querySelectorAll(".bls__product-wishlist");
      wishlist_icon.forEach((e) => {
        const { proAddWishlist, proRemoveWishlist } = e?.dataset;
        const is_page_wishlist = document.querySelector(
          ".bls__wishlist-page-section"
        );
        const tooltip_wishlist = e.querySelector(".bls_tooltip-content");
        const productHandle = e.dataset.productHandle;
        if (wishlist_items !== null) {
          let index = wishlist_items.indexOf(productHandle);
          if (index !== -1) {
            e.querySelector(".bls__product-icon").classList.add("active");
            if (is_page_wishlist) {
              tooltip_wishlist.innerText =
                window.stringsTemplate.messageRemoveWishlist;
            } else {
              tooltip_wishlist.innerText = proRemoveWishlist;
            }
          } else {
            e.querySelector(".bls__product-icon").classList.remove("active");
            tooltip_wishlist.innerText = proAddWishlist;
          }
        }
        BlsWishlistHeader.init();
      });
    },

    handleActionWishlist: function () {
      const btnWishlist = document.querySelectorAll(
        ".bls__product-wishlist-js"
      );
      if (btnWishlist.length > 0) {
        btnWishlist.forEach((e) => {
          e.addEventListener("click", this.handleWishlistFunctionClick);
        });
      }
    },

    handleWishlistFunctionClick: function (evt) {
      const e = evt.currentTarget;
      const wishlist_items = JSON.parse(
        localStorage.getItem("bls__wishlist-items")
      );
      const productHandle = e.dataset.productHandle;
      const is_page_wishlist = document.querySelector(
        ".bls__wishlist-page-section"
      );
      if (is_page_wishlist) {
        BlsWishlistLoad.init(productHandle, wishlist_items);
      }
      const arr_items = [];
      if (wishlist_items === null) {
        arr_items.push(productHandle);
        localStorage.setItem("bls__wishlist-items", JSON.stringify(arr_items));
        BlsSubActionProduct.handleInitWishlist();
      } else {
        let index = wishlist_items.indexOf(productHandle);
        arr_items.push(...wishlist_items);
        if (index === -1) {
          arr_items.push(productHandle);
          localStorage.setItem(
            "bls__wishlist-items",
            JSON.stringify(arr_items)
          );
          BlsSubActionProduct.handleInitWishlist();
        } else if (index > -1) {
          if (is_page_wishlist) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
          } else {
            window.location.href = `${window.shopUrl}${window.Shopify.routes.root}pages/wishlist`;
          }
        }
      }
    },

    handleCompareFunctionClick: function (evt) {
      const e = evt.currentTarget;
      const compare_items = JSON.parse(
        localStorage.getItem("bls__compare-items")
      );
      const productHandle = e.dataset.productHandle;
      const arr_items = [];
      if (compare_items === null) {
        arr_items.push(productHandle);
        localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
        BlsSubActionProduct.handleInitCompare();
      } else {
        let index = compare_items.indexOf(productHandle);
        arr_items.push(...compare_items);
        if (index === -1) {
          arr_items.push(productHandle);
          localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
          BlsSubActionProduct.handleInitCompare();
        } else if (index > -1) {
          window.location.href = `${window.shopUrl}${window.Shopify.routes.root}pages/compare`;
        }
      }
    },

    handleInitCompare: function () {
      const compare_items = JSON.parse(
        localStorage.getItem("bls__compare-items")
      );
      const compare_icon = document.querySelectorAll(".bls__product-compare");
      const is_page_compare = document.querySelector(
        ".bls__compare-page-section"
      );
      compare_icon.forEach((e) => {
        const { proAddCompare, proRemoveCompare } = e?.dataset;
        const tooltip_compare = e.querySelector(".bls_tooltip-content");
        const productHandle = e.dataset.productHandle;
        if (compare_items !== null) {
          let index = compare_items.indexOf(productHandle);
          if (index !== -1) {
            e.querySelector(".bls__product-icon").classList.add("active");
            if (is_page_compare) {
              tooltip_compare.innerText =
                window.stringsTemplate.messageRemoveCompare;
            } else {
              tooltip_compare.innerText = proRemoveCompare;
            }
          } else {
            e.querySelector(".bls__product-icon").classList.remove("active");
            tooltip_compare.innerText = proAddCompare;
          }
        }
      });
    },

    handleActionCompare: function () {
      const btnCompare = document.querySelectorAll(".bls__product-compare-js");
      if (btnCompare.length > 0) {
        btnCompare.forEach((e) => {
          e.addEventListener("click", this.handleCompareFunctionClick);
        });
      }
    },
  };
})();
BlsSubActionProduct.init();

var BlsSubActionProductPreLoad = (function () {
  return {
    handleActionPg: function () {
      const btnRemoveCompare = document.querySelectorAll(
        ".bls__compare-remove-js"
      );
      if (btnRemoveCompare.length > 0) {
        btnRemoveCompare.forEach((e) => {
          e.addEventListener("click", function () {
            const compare_items = JSON.parse(
              localStorage.getItem("bls__compare-items")
            );
            const productTarget = e.closest(".bls__product-item");
            if (productTarget) {
              BlsCompareLoad.init(productTarget, compare_items);
            }
          });
        });
      }
    },
  };
})();

var BlsReloadSpr = (function () {
  return {
    init: function () {
      if (window.SPR) {
        window.SPR.registerCallbacks();
        window.SPR.initRatingHandler();
        window.SPR.initDomEls();
        window.SPR.loadProducts();
        window.SPR.loadBadges();
      }
    },
  };
})();

var BlsMainMenuShopify = (function () {
  return {
    init: function () {
      this.initMainMenu();
      this.initVerticalMenu();
    },
    initMainMenu: function () {
      var _this = this;
      const header = document.querySelector(global.header);
      const sticky = header.getAttribute("data-sticky");
      const sticky_mobile = header.getAttribute("data-sticky-mobile");
      const verticalmenu = document.querySelector(".verticalmenu-list");
      const bls_main_menu = document.querySelector(".bls_main_menu");
      _this.onMenuMobileItem();

      document.querySelectorAll(".nav-toggle").forEach((navToggle) => {
        navToggle.addEventListener("click", (e) => {
          if (document.documentElement.classList.contains("nav-open")) {
            document.documentElement.classList.remove("nav-open");
            if (!bls_main_menu) {
              document.documentElement.classList.remove("nav-verticalmenu");
            }
          } else {
            document.documentElement.classList.add("nav-open");
            if (!bls_main_menu) {
              document.documentElement.classList.add("nav-verticalmenu");
            }
          }
        });
      });

      document.querySelectorAll(".close-menu").forEach((closeToggle) => {
        closeToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            document.documentElement.classList.remove("nav-open");
          },
          false
        );
      });

      if (verticalmenu && bls_main_menu) {
        const html_title =
          '<a data-menu="verticalmenu-list" href="#">' +
          window.menuStrings.verticalTitle +
          "</a>";
        const verticalmenu_html =
          document.querySelector(".verticalmenu-list").innerHTML;
        const el = document.createElement("ul");
        el.classList.add("verticalmenu-list");
        el.style.display = "none";
        el.innerHTML = verticalmenu_html;
        document
          .querySelector(".bls_main_menu .mobile-menu-content")
          .appendChild(el);
        document
          .querySelector(".bls_main_menu .menu-mobile-title")
          .insertAdjacentHTML("beforeend", html_title);
        _this.onMenuMobileItem("verticalmenu");
      }

      document
        .querySelectorAll(".bls_main_menu .menu-mobile-title a")
        .forEach((navToggle) => {
          navToggle.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              const target = e.currentTarget;
              const data = target.getAttribute("data-menu");
              for (var item_title of document.querySelectorAll(
                ".bls_main_menu .menu-mobile-title a"
              )) {
                item_title.classList.remove("active");
              }
              target.classList.add("active");
              for (var item_menu of document.querySelectorAll(
                ".bls_main_menu .mobile-menu-content > ul"
              )) {
                item_menu.style.display = "none";
              }
              document.querySelector(
                ".bls_main_menu ." + data + ""
              ).style.display = "block";
            },
            false
          );
        });

      document
        .querySelectorAll("li.bls__menu-parent")
        .forEach((menuItem, index) => {
          menuItem.addEventListener("mouseenter", (e) =>
            _this.onMenuItemEnter(menuItem, index)
          );
          menuItem.addEventListener("mouseleave", (e) =>
            _this.onMenuItemLeave(menuItem, index)
          );
        });

      document
        .querySelectorAll(".bls-menu-item.type_banner")
        .forEach((menuItem, index) => {
          if (menuItem.classList.contains("space-banner")) {
            menuItem.closest(".submenu").classList.add("submenu-space-banner");
          }
        });

      document.querySelectorAll("li.advanced-main a").forEach((item) => {
        item.addEventListener(
          "mouseenter",
          (e) => {
            const target = e.currentTarget;
            const data = target.getAttribute("data-link");
            if (data) {
              for (var item_content of document.querySelectorAll(
                "li.advanced-content > .sub"
              )) {
                item_content.classList.remove("active");
              }
              for (var item of document.querySelectorAll(
                "li.advanced-main a"
              )) {
                item.classList.remove("active");
              }
              target.classList.add("active");
              document.querySelector(data).classList.add("active");
            }
          },
          false
        );
      });
      let headerbar = 0;
      if (document.getElementById("announcement-bar")) {
        headerbar = document.getElementById("announcement-bar").clientHeight;
      }
      let headertopbar = 0;
      if (document.getElementById("shopify-section-top-bar")) {
        headertopbar = document.getElementById(
          "shopify-section-top-bar"
        ).clientHeight;
      }
      let headerpage = document.getElementById("page-header").clientHeight;
      document
        .querySelector("body")
        .setAttribute(
          "style",
          "--height-bar: " +
            headerbar +
            "px;--height-header: " +
            headerpage +
            "px "
        );
      if (sticky == "true") {
        if (sticky_mobile == "false" && window.innerWidth < 1025) {
            return;
        }
        let headerSpaceH =
          document.getElementById("sticky-header").offsetHeight;
        let newdiv = document.createElement("div");
        let headerh = headerbar + headertopbar + headerSpaceH;
        newdiv.style.height = headerSpaceH + "px";
        newdiv.classList.add("headerSpace", "unvisible");
        document.querySelector("#sticky-header").after(newdiv);
        window.addEventListener("scroll", () => {
          const currentScroll = window.pageYOffset;
          if (
            currentScroll <= header.querySelector(".header-middle").offsetTop
          ) {
            if (header.classList.contains("transparent")) {
              header.classList.add("transparent");
            }
            return;
          }
          if (header.classList.contains("transparent")) {
            header.classList.remove("transparent");
          }
          if (currentScroll > headerh) {
            header.classList.add("header_scroll_down");
            header.classList.add("header_scroll_up");
            header.querySelector(".headerSpace").classList.remove("unvisible");
          } else {
            header.classList.remove("header_scroll_down");
            header.querySelector(".headerSpace").classList.add("unvisible");
          }
        });
      }

      if (bls_main_menu) {
        _this.addCssSubMenu();
        window.addEventListener(
          "resize",
          function (event) {
            _this.addCssSubMenu();
          },
          true
        );
      }
    },
    initVerticalMenu: function () {
      let width = screen.width;
      const article = document.querySelector(".verticalmenu-html");
      if (article === null) return;
      const limitItemShow = article.dataset.limitshowitem;
      const limitScreen = article.dataset.limitscreen;
      const lenghtLi = document.querySelectorAll(
        ".verticalmenu-html .level0"
      ).length;
      if (width > 1199) {
        if (lenghtLi > limitItemShow) {
          var lineItem = Array.from(
            document.querySelectorAll(".verticalmenu-html .level0")
          );
          lineItem.forEach((element, index) => {
            if (index > limitItemShow - 1) {
              const item = lineItem[index];
              if (item.classList.contains("expand-menu-link")) {
                return;
              }
              item.classList.add("orther-link");
              item.style.display = "none";
            }
          });
          document.querySelector(
            ".verticalmenu-html .expand-menu-link"
          ).style.display = "block";
          document
            .querySelector(".verticalmenu-html .expand-menu-link a")
            .addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                const parent = target.parentElement;
                if (!parent.classList.contains("expanding")) {
                  parent.classList.add("expanding");
                  parent.querySelector("a").innerHTML =
                    window.menuStrings.hideMenus;
                  for (var item of document.querySelectorAll(
                    ".verticalmenu-html .level0.orther-link"
                  )) {
                    item.classList.add("show");
                    item.style.display = "block";
                  }
                } else {
                  parent.classList.remove("expanding");
                  parent.querySelector("a").innerHTML =
                    window.menuStrings.moreMenus;
                  for (var item of document.querySelectorAll(
                    ".verticalmenu-html .level0.orther-link"
                  )) {
                    item.classList.remove("show");
                    item.style.display = "none";
                  }
                }
              },
              false
            );
        } else {
          document.querySelector(".expand-menu-link").style.display = "none";
        }
      }
      document
        .querySelector(".bls_vertical_menu .title-menu-dropdown")
        .addEventListener("click", (event) => {
          event.preventDefault();
          const target = event.currentTarget;
          const closest = target.closest(".vertical-menu");
          if (closest.classList.contains("open")) {
            closest.classList.remove("open");
          } else {
            closest.classList.add("open");
          }
        });
    },
    onMenuItemEnter: function (evt, index) {
      const target = evt;
      target.classList.add("bls-item-active");
    },
    onMenuItemLeave: function (evt, index) {
      const target = evt;
      target.classList.remove("bls-item-active");
    },
    onMenuMobileItem: function (evt) {
      var menu_parent = "li.bls__menu-parent > .open-children-toggle";
      var menu_submenu = "li.bls__menu-parent .submenu .open-children-toggle";
      if (evt) {
        menu_parent =
          ".verticalmenu-list li.bls__menu-parent > .open-children-toggle";
        menu_submenu =
          ".verticalmenu-list li.bls__menu-parent .submenu .open-children-toggle";
      }
      document.querySelectorAll(menu_parent).forEach((childrenToggle) => {
        childrenToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const parent = target.parentElement;
            const submenu = parent.querySelector(".submenu");
            slideAnime({
              target: submenu,
              animeType: "slideToggle",
            });
            if (!parent.querySelector("a").classList.contains("active")) {
              parent.querySelector("a").classList.add("active");
            } else {
              parent.querySelector("a").classList.remove("active");
            }
          },
          false
        );
      });

      document.querySelectorAll(menu_submenu).forEach((childrenToggle) => {
        childrenToggle.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          const submenu = parent.querySelector(".subchildmenu");
          slideAnime({
            target: submenu,
            animeType: "slideToggle",
          });
          if (!parent.querySelector("a").classList.contains("active")) {
            parent.querySelector("a").classList.add("active");
          } else {
            parent.querySelector("a").classList.remove("active");
          }
        });
      });
    },
    addCssSubMenu: function () {
      const bodyWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      const header = document.querySelector("header");
      const submenu_center = document.querySelector(".bls_submenu-center");
      const width_sub_center = document
        .querySelector("[data-width-sub-center]")
        .getAttribute("data-width-sub-center");
      if (!header || bodyWidth < 1024) return;
      var padding = 30;
      if (bodyWidth < 1200) {
        padding = 15;
      }
      document
        .querySelectorAll(".horizontal-list .menu-width-custom > .submenu")
        .forEach((submenu) => {
          if (submenu_center) {
            var submenu_data = submenu.getBoundingClientRect();
            var width = submenu_data.width;
            var left = submenu_data.left;
            var right = submenu_data.right;
            if (width_sub_center <= width) {
              var left_style = (left - (right - bodyWidth)) / 2;
              submenu.style.left = left_style + "px";
            }
          } else {
            const elementWidth = submenu.clientWidth;
            const elementLeft = submenu.offsetLeft;
            if (bodyWidth - (elementWidth + elementLeft) < 0) {
              var left = bodyWidth - (elementWidth + elementLeft);
              left = left + elementLeft - padding;
              if (elementLeft < 0) {
                left = 0;
              }
              submenu.style.left = left + "px";
            }
          }
        });
    },
  };
})();
BlsMainMenuShopify.init();

var BlsSearchShopify = (function () {
  return {
    init: function () {
      var predictive = document.querySelector("#predictive-search");
      if (predictive) {
        this.setupEventListeners();
      }
      const form = document.querySelector("#search-form");
      document.querySelectorAll(".top-search-toggle").forEach((navToggle) => {
        navToggle.addEventListener("click", () => {
          if (!form.classList.contains("bls__opend-popup-header")) {
            form.classList.add("bls__opend-popup-header");
            document.documentElement.classList.add("hside_opened");
            document.documentElement.classList.add("open-search");
            setTimeout(function () {
              form.querySelector('input[type="search"]').focus();
            }, 100);
          } else {
            form.classList.remove("bls__opend-popup-header");
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("open-search");
          }
        });
      });
      document
        .querySelectorAll(".mini_search_header .button-close")
        .forEach((navToggle) => {
          navToggle.addEventListener("click", () => {
            form.classList.remove("bls__opend-popup-header");
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("open-search");
          });
        });
    },
    setupEventListeners: function () {
      const input = document.querySelector('input[type="search"]');
      const form = document.querySelector("form.search");
      form.addEventListener("submit", this.onFormSubmit.bind(this));
      input.addEventListener(
        "input",
        this.debounce((event) => {
          this.onChange(event);
        }, 300).bind(this)
      );
      input.addEventListener("focus", this.onFocus.bind(this));
      document.addEventListener("focusout", this.onFocusOut.bind(this));
      document.addEventListener("keyup", this.onKeyup.bind(this));
      document.addEventListener("keydown", this.onKeydown.bind(this));
      document
        .querySelectorAll('.select_cat [data-name="product_type"] li')
        .forEach((product_type) => {
          product_type.addEventListener("click", (e) => {
            const target = e.currentTarget;
            if (target.classList.contains("active")) {
              return;
            } else {
              for (var item of document.querySelectorAll(
                '.select_cat [data-name="product_type"] li'
              )) {
                item.classList.remove("active");
              }
              target.classList.add("active");
              document
                .querySelector("#search_mini_form")
                .querySelector('[name="category"]').value =
                target.getAttribute("data-value");
              this.onChange();
            }
          });
        });
    },

    debounce: function (fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    getQuery: function () {
      return document.querySelector('input[type="search"]').value.trim();
    },

    onChange: function () {
      const searchTerm = this.getQuery();
      if (!searchTerm.length) {
        this.close(true);
        return;
      }
      this.getSearchResults(searchTerm);
    },

    onFormSubmit: function (event) {
      if (
        !this.getQuery().length ||
        this.querySelector('[aria-selected="true"] a')
      )
        event.preventDefault();
    },

    onFocus: function () {
      const searchTerm = this.getQuery();
      if (!searchTerm.length) return;
      if (
        document
          .querySelector("#predictive-search")
          .classList.contains("results")
      ) {
        this.open();
      } else {
        this.getSearchResults(searchTerm);
      }
    },

    onFocusOut: function () {
      setTimeout(() => {
        if (!document.contains(document.activeElement)) this.close();
      });
    },

    onKeyup: function (event) {
      if (!this.getQuery().length) this.close(true);
      event.preventDefault();

      switch (event.code) {
        case "ArrowUp":
          this.switchOption("up");
          break;
        case "ArrowDown":
          this.switchOption("down");
          break;
        case "Enter":
          this.selectOption();
          break;
      }
    },

    onKeydown: function (event) {
      if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        event.preventDefault();
      }
    },

    switchOption: function (direction) {
      if (!this.getAttribute("open")) return;
      const moveUp = direction === "up";
      const selectedElement = document.querySelector('[aria-selected="true"]');
      const allElements = document.querySelectorAll("li");
      let activeElement = document.querySelector("li");

      if (moveUp && !selectedElement) return;

      this.statusElement.textContent = "";

      if (!moveUp && selectedElement) {
        activeElement = selectedElement.nextElementSibling || allElements[0];
      } else if (moveUp) {
        activeElement =
          selectedElement.previousElementSibling ||
          allElements[allElements.length - 1];
      }

      if (activeElement === selectedElement) return;

      activeElement.setAttribute("aria-selected", true);
      if (selectedElement) selectedElement.setAttribute("aria-selected", false);
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-activedescendant", activeElement.id);
    },

    selectOption: function () {
      const selectedProduct = document.querySelector(
        '[aria-selected="true"] a, [aria-selected="true"] button'
      );

      if (selectedProduct) selectedProduct.click();
    },

    getSearchResults: function (searchTerm) {
      const cachedResults = {};
      const queryKey = searchTerm.replace(" ", "-").toLowerCase();
      this.setLiveRegionLoadingState();
      if (cachedResults[queryKey]) {
        this.renderSearchResults(cachedResults[queryKey]);
        return;
      }
      if (document.querySelector(".search_type_popup")) {
        var section_id = "search-predictive-grid";
      } else {
        var section_id = "search-predictive-list";
      }
      fetch(
        `${routes.predictive_search_url}?q=${encodeURIComponent(
          searchTerm
        )}&resources[options][fields]=title,tag,vendor,product_type,variants.title,variants.sku&resources[options][prefix]=last&resources[options][unavailable_products]=last&resources[type]=product&resources[limit]=6&section_id=${section_id}`
      )
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser()
            .parseFromString(text, "text/html")
            .querySelector("#shopify-section-" + section_id + "").innerHTML;
          cachedResults[queryKey] = resultsMarkup;
          this.renderSearchResults(resultsMarkup);
          BlsColorSwatchesShopify.init();
          BlsLazyloadImg.init();
        })
        .catch((error) => {
          this.close();
          throw error;
        });
    },

    setLiveRegionLoadingState: function () {
      document.querySelector("#search_mini_form").classList.add("loading");
      document.querySelector("#predictive-search").classList.add("loading");
    },

    setLiveRegionResults: function () {
      document.querySelector("#search_mini_form").classList.remove("loading");
      document.querySelector("#predictive-search").classList.remove("loading");
    },

    renderSearchResults: function (resultsMarkup) {
      document.querySelector("[data-predictive-search]").innerHTML =
        resultsMarkup;
      document.querySelector("#predictive-search").classList.add("results");
      const quick_search = document.querySelector("#quick-search");
      if (quick_search) {
        quick_search.classList.add("d-none");
      }
      this.setLiveRegionResults();
      this.open();
    },

    open: function () {
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-expanded", true);
      this.isOpen = true;
    },

    close: function (clearSearchTerm = false) {
      if (clearSearchTerm) {
        document.querySelector('input[type="search"]').value = "";
        document
          .querySelector("#predictive-search")
          .classList.remove("results");
        const quick_search = document.querySelector("#quick-search");
        if (quick_search) {
          quick_search.classList.remove("d-none");
        }
      }
      const selected = document.querySelector('[aria-selected="true"]');
      if (selected) selected.setAttribute("aria-selected", false);
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-activedescendant", "");
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-expanded", false);
      this.resultsMaxHeight = false;
      document
        .querySelector("[data-predictive-search]")
        .removeAttribute("style");
      this.isOpen = false;
    },
  };
})();
BlsSearchShopify.init();

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

if (!customElements.get("product-form")) {
  customElements.define(
    "product-form",
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector("form");
        this.form.querySelector("[name=id]").disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.cart =
          document.querySelector("cart-notification") ||
          document.querySelector("cart-drawer");
        this.submitButton = this.querySelector('[type="submit"]');
        if (document.querySelector("cart-drawer"))
          this.submitButton.setAttribute("aria-haspopup", "dialog");
      }

      onSubmitHandler(evt) {
        evt.preventDefault();

        this.handleErrorMessage();

        this.submitButton.setAttribute("disabled", true);
        this.submitButton.classList.add("btn-loading");

        const config = fetchConfig("json");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            "sections",
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append("sections_url", window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => {
            return response.text();
          })
          .then((state) => {
            this.submitButton.setAttribute("disabled", true);
            this.submitButton.querySelector("span").classList.add("hidden");
            fetch("/cart.json")
              .then((res) => res.json())
              .then((cart) => {
                document.querySelectorAll(".cart-count").forEach((el) => {
                  el.innerHTML = cart.item_count;
                });
              })
              .catch((error) => {
                throw error;
              });
            const parsedState = JSON.parse(state);
            this.cart.getSectionsToRender().forEach((section) => {
              const elementToReplace = document.getElementById(section.id);
              const html = new DOMParser().parseFromString(
                parsedState.sections[section.id],
                "text/html"
              );
              elementToReplace.innerHTML =
                html.querySelector("#form-mini-cart").innerHTML;
              const cart_threshold = document.querySelector(
                ".bls__cart-thres-js"
              );
              if (cart_threshold) {
                if (
                  html
                    .querySelector(".bls__cart-thres-js")
                    .classList.contains("cart_shipping_free")
                ) {
                  cart_threshold.classList.add("cart_shipping_free");
                } else {
                  cart_threshold.classList.remove("cart_shipping_free");
                }
                cart_threshold.querySelector(".bls__cart-thres").innerHTML =
                  html.querySelector(".bls__cart-thres").innerHTML;
                setTimeout(function () {
                  cart_threshold
                    .querySelector(".percent_shipping_bar")
                    .setAttribute(
                      "style",
                      html
                        .querySelector(".percent_shipping_bar")
                        .getAttribute("style")
                    );
                }, 500);
              }
              const countdown = this.cart.querySelector(".cart-countdown-time");
              const html_countdown = html.querySelector(".cart-countdown-time");
              if (countdown && html_countdown) {
                countdown.innerHTML = html_countdown.innerHTML;
                this.cart.countdownTimer();
              }
            });
            if (this.closest(".dlg")) {
              document.querySelector(".dlg-close-x").click();
            }
            this.cart.cartAction();
          })
          .catch((e) => {
            throw e;
          })
          .finally(() => {
            this.submitButton.classList.remove("btn-loading");
            if (this.cart && this.cart.classList.contains("is-empty"))
              this.cart.classList.remove("is-empty");
            if (!this.error) this.submitButton.removeAttribute("disabled");
            this.submitButton.querySelector("span").classList.remove("hidden");
            Shopify.termsConditionsAction();
            this.cart.open();
            BlsLazyloadImg.init();
          });
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        if (!this.errorMessageWrapper) return;
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;
    event.currentTarget.name === "plus"
      ? this.input.stepUp()
      : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
}
customElements.define("quantity-input", QuantityInput);

class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      input: this.querySelector(
        'input[name="language_code"], input[name="country_code"]'
      ),
      button: this.querySelector(".button-localization"),
      panel: this.querySelector("ul"),
    };
    this.elements.button.addEventListener(
      "click",
      this.openSelector.bind(this)
    );
    this.elements.button.addEventListener(
      "focusout",
      this.closeSelector.bind(this)
    );
    this.addEventListener("keyup", this.onContainerKeyUp.bind(this));
    this.querySelectorAll("a").forEach((item) =>
      item.addEventListener("click", this.onItemClick.bind(this))
    );
    this.onBodyClick = this.handleBodyClick.bind(this);
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target != this && !target.closest("localization-form")) {
      this.hidePanel();
    }
  }

  hidePanel() {
    document.body.removeEventListener("click", this.onBodyClick);
    this.elements.button.classList.remove("opend");
    this.elements.panel.classList.add("hidden");
  }

  onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;
    this.hidePanel();
    this.elements.button.focus();
  }

  onItemClick(event) {
    event.preventDefault();
    const form = this.querySelector("form");
    this.elements.input.value = event.currentTarget.dataset.value;
    if (form) form.submit();
  }

  openSelector() {
    if (this.elements.button.classList.contains("opend")) {
      this.hidePanel();
    } else {
      document.body.addEventListener("click", this.onBodyClick);
      this.elements.button.focus();
      for (var item of document.querySelectorAll(".button-localization")) {
        item.classList.remove("opend");
      }
      for (var item of document.querySelectorAll(".disclosure__list")) {
        item.classList.add("hidden");
      }
      this.elements.button.classList.add("opend");
      this.elements.panel.classList.remove("hidden");
    }
  }

  closeSelector(event) {
    const shouldClose =
      event.relatedTarget && event.relatedTarget.nodeName === "BUTTON";
    if (event.relatedTarget === null || shouldClose) {
      this.hidePanel();
    }
  }
}
customElements.define("localization-form", LocalizationForm);

class CartNotification extends HTMLElement {
  constructor() {
    super();
    this.notification = document.getElementById("bls-header_minicart");
    this.giftwrap = document.querySelector(".bls__add-giftwrap");
    this.cartCountDown = document.querySelector(".cart-countdown-time");
    this.startTime = Date.now();
    this.querySelectorAll(".bls-minicart-wrapper .close-button").forEach(
      (closeButton) =>
        closeButton.addEventListener("click", this.close.bind(this))
    );
    const __this = this
    document
    .querySelectorAll(".bls-minicart-action")
    .forEach((navToggle) => {
      navToggle.addEventListener(
        "click",
        (e) => {
          __this.returnToShop(e)
        },
        false
      );
    });
    this.currentItemCount = Array.from(
      this.querySelectorAll('[name="updates[]"]')
    ).reduce(
      (total, quantityInput) => total + parseInt(quantityInput.value),
      0
    );

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);
    this.addEventListener("change", this.debouncedOnChange.bind(this));
    this.cartAction();
    this.countdownTimer();
    this.addonsUpdate();
  }
  
  returnToShop(e) {
    e.preventDefault();
    if (
      this.notification.classList.contains("bls__opend-popup-header")
    ) {
      this.close();
    } else {
      this.open();
    }
  }

  cartAction() {
    document
      .querySelectorAll(".close-cart")
      .forEach((navToggle) => {
        navToggle.removeEventListener("click", this.returnToShop.bind(this), false);
        navToggle.addEventListener("click", this.returnToShop.bind(this), false);
      });

    document.querySelectorAll(".bls__cart-addons button").forEach((button) => {
      button.removeEventListener("click", this.cartAddons.bind(this), false);
      button.addEventListener("click", this.cartAddons.bind(this), false);
    });

    document
      .querySelectorAll(".bls__addon-actions .btn-save")
      .forEach((button) => {
        button.removeEventListener(
          "click",
          this.cartAddonsSave.bind(this),
          false
        );
        button.addEventListener("click", this.cartAddonsSave.bind(this), false);
      });

    document.querySelectorAll(".bls__add-giftwrap").forEach((giftwrap) => {
      giftwrap.removeEventListener(
        "click",
        this.addGiftwrapClick.bind(this),
        false
      );
      giftwrap.addEventListener(
        "click",
        this.addGiftwrapClick.bind(this),
        false
      );
    });

    document.querySelectorAll(".bls-minicart-item-edit").forEach((edit) => {
      edit.removeEventListener("click", this.cartEditItem.bind(this), false);
      edit.addEventListener("click", this.cartEditItem.bind(this), false);
    });

    const conditions = document.getElementById("conditions_form_minicart");
    if (conditions) {
      conditions.addEventListener("change", (event) => {
        if (event.currentTarget.checked) {
          document
            .querySelector(".bls-btn-checkout")
            .removeAttribute("disabled");
        } else {
          document
            .querySelector(".bls-btn-checkout")
            .setAttribute("disabled", "disabled");
        }
      });
    }

    document
      .querySelectorAll(".bls__addon-actions .btn-cancel")
      .forEach((addonCancel) => {
        addonCancel.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            target.closest(".bls__addon").classList.remove("is-open");
            target
              .closest(".bls-minicart-wrapper")
              .classList.remove("addons-open");
          },
          false
        );
      });

    document
      .querySelectorAll(".bls__addon-actions .btn-cancel")
      .forEach((addonCancel) => {
        addonCancel.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            target.closest(".bls__addon").classList.remove("is-open");
            target
              .closest(".bls-minicart-wrapper")
              .classList.remove("addons-open");
          },
          false
        );
      });
  }

  addonsUpdate() {
    const address_country = document.getElementById("address_country");
    const address_province = document.getElementById("address_province");
    if (address_country && address_province) {
      new Shopify.CountryProvinceSelector(
        "address_country",
        "address_province",
        { hideElement: "address_province_container" }
      );
    }

    const bls__discount_code = document.querySelector(".bls__discount_code");
    const code = localStorage.getItem("discount_code");
    if (code && bls__discount_code) {
      document.querySelector(".bls__discount_code").value = code;
    }
  }

  cartAddons(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const open = target.getAttribute("data-open");
    if (
      !document.getElementById("bls__" + open).classList.contains("is-open")
    ) {
      document.getElementById("bls__" + open).classList.add("is-open");
      target.closest(".bls-minicart-wrapper").classList.add("addons-open");
      if (open == "shipping") {
        const address_country = document.getElementById("address_country");
        const address_province = document.getElementById("address_province");
        if (address_country && address_province) {
          new Shopify.CountryProvinceSelector(
            "address_country",
            "address_province",
            { hideElement: "address_province_container" }
          );
        }
      }
    } else {
      document.getElementById("bls__" + open).classList.remove("is-open");
      target.closest(".bls-minicart-wrapper").classList.remove("addons-open");
    }
  }

  cartEditItem(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const key = target.getAttribute("data-key");
    const quantity = target.getAttribute("data-quantity");
    const href = target.getAttribute("href");
    const variant =
      href.indexOf("?") > -1 ||
      href.indexOf("?variant=") > -1 ||
      href.indexOf("&variant=") > -1
        ? "&"
        : "/?";
    target.closest(".cart-item").classList.add("loadding");
    fetch(`${window.shopUrl}${href}${variant}section_id=cart-quick-edit`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          throw error;
        }
        return response.text();
      })
      .then((response) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(response, "text/html")
          .getElementById("shopify-section-cart-quick-edit");
        var quick_edit = EasyDialogBox.create(
          "cart-edit-item",
          "dlg dlg-disable-footer dlg-disable-drag",
          cartStrings.quick_edit,
          resultsMarkup.innerHTML
        );
        quick_edit.onClose = quick_edit.destroy;
        quick_edit.show();
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        document
          .querySelector("[data-template-quick-cart-edit]")
          .setAttribute("data-line", key);
        document.querySelector(
          ".product-form-quick-edit quantity-input input"
        ).value = quantity;
        target.closest(".cart-item").classList.remove("loadding");
        BlsColorSwatchesShopify.init();
        BlsLazyloadImg.init();
      });
  }

  cartAddonsSave(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const action = target.getAttribute("data-action");
    if (action == "coupon") {
      const value = document.querySelector(".bls__discount_code").value;
      localStorage.setItem("discount_code", value);
      document.getElementById("bls__" + action).classList.remove("is-open");
      document
        .querySelector(".bls-minicart-wrapper")
        .closest(".bls-minicart-wrapper")
        .classList.remove("addons-open");
    } else if (action == "note") {
      const body = JSON.stringify({
        note: document.querySelector(".bls__cart-note").value,
      });
      fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
      document.getElementById("bls__" + action).classList.remove("is-open");
      document
        .querySelector(".bls-minicart-wrapper")
        .closest(".bls-minicart-wrapper")
        .classList.remove("addons-open");
    } else if (action == "shipping") {
      var e = {};
      (e.zip = document.querySelector("#AddressZip").value || ""),
        (e.country = document.querySelector("#address_country").value || ""),
        (e.province = document.querySelector("#address_province").value || ""),
        this._getCartShippingRatesForDestination(e);
    }
  }

  _getCartShippingRatesForDestination(event) {
    fetch(
      `${window.Shopify.routes.root}cart/shipping_rates.json?shipping_address%5Bzip%5D=${event.zip}&shipping_address%5Bcountry%5D=${event.country}&shipping_address%5Bprovince%5D=${event.province}`
    )
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const message = document.querySelector(".bls__addon-message");
        for (var item of document.querySelectorAll(".bls__addon-message p")) {
          item.remove();
        }
        const parsedState = JSON.parse(state);
        if (parsedState && parsedState.shipping_rates) {
          if (parsedState.shipping_rates.length > 0) {
            message.classList.remove("error", "warning");
            message.classList.add("success");
            const p = document.createElement("p");
            p.innerText = cartStrings.shipping_rate.replace(
              "{{address}}",
              event.zip + ", " + event.country + " " + event.province
            );
            message.appendChild(p);
            parsedState.shipping_rates.map((rate) => {
              const rateNode = document.createElement("p");
              rateNode.innerHTML =
                rate.name +
                ": " +
                Shopify.formatMoney(rate.price, cartStrings.money_format);
              message.appendChild(rateNode);
            });
          } else {
            message.classList.remove("error", "success");
            message.classList.add("warning");
            const p = document.createElement("p");
            p.innerText = cartStrings.no_shipping;
            message.appendChild(p);
          }
        } else {
          message.classList.remove("success", "warning");
          message.classList.add("error");
          Object.entries(parsedState).map((error) => {
            const message_error = `${error[1][0]}`;
            const p = document.createElement("p");
            p.innerText = message_error;
            message.appendChild(p);
          });
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  addGiftwrapClick(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const variant_id = target.getAttribute("data-variant-id");
    const config = fetchConfig("json");
    config.body = JSON.stringify({
      id: Number(variant_id),
      quantity: 1,
      sections: this.getSectionsToRender().map((section) => section.id),
      sections_url: window.location.pathname,
    });
    target.classList.add("loading");
    fetch(`${routes.cart_add_url}`, config)
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        fetch("/cart.json")
          .then((res) => res.json())
          .then((cart) => {
            document.querySelectorAll(".cart-count").forEach((el) => {
              el.innerHTML = cart.item_count;
            });
          })
          .catch((error) => {
            throw error;
          });
        this.getSectionsToRender().forEach((section) => {
          const elementToReplace = document.getElementById(section.id);
          const html = new DOMParser().parseFromString(
            parsedState.sections[section.id],
            "text/html"
          );
          elementToReplace.innerHTML =
            html.querySelector("#form-mini-cart").innerHTML;
          const cart_threshold = document.querySelector(".bls__cart-thres-js");
          if (cart_threshold) {
            if (
              html
                .querySelector(".bls__cart-thres-js")
                .classList.contains("cart_shipping_free")
            ) {
              cart_threshold.classList.add("cart_shipping_free");
            } else {
              cart_threshold.classList.remove("cart_shipping_free");
            }
            cart_threshold.querySelector(".bls__cart-thres").innerHTML =
              html.querySelector(".bls__cart-thres").innerHTML;
            setTimeout(function () {
              cart_threshold
                .querySelector(".percent_shipping_bar")
                .setAttribute(
                  "style",
                  html
                    .querySelector(".percent_shipping_bar")
                    .getAttribute("style")
                );
            }, 500);
          }
        });
        this.cartAction();
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        document
          .querySelector(".bls__add-giftwrap")
          .classList.remove("loading");
        document.getElementById("bls__gift").classList.remove("is-open");
        document
          .querySelector(".bls-minicart-wrapper")
          .classList.remove("addons-open");
        Shopify.termsConditionsAction();
        BlsLazyloadImg.init();
      });
  }

  onChange(event) {
    if (event.target.getAttribute("name") == "updates[]")
      this.updateQuantity(
        event.target.dataset.id,
        event.target.value,
        document.activeElement.getAttribute("name")
      );
  }

  updateQuantity(id, quantity, name) {
    quantity = quantity ? quantity : 0;
    const body = JSON.stringify({
      id,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.id),
      sections_url: window.location.pathname,
    });
    this.notification.classList.add("start", "loading");
    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        document.querySelectorAll(".cart-count").forEach((el) => {
          el.innerHTML = parsedState.item_count;
        });
        if (parsedState.item_count == 0 && this.cartCountDown) {
          this.cartCountDown.querySelector(".countdown-message").remove();
        }
        this.getSectionsToRender().forEach((section) => {
          const elementToReplace = document.getElementById(section.id);
          const html = new DOMParser().parseFromString(
            parsedState.sections[section.id],
            "text/html"
          );
          elementToReplace.innerHTML =
            html.querySelector("#form-mini-cart").innerHTML;
          const cart_threshold = document.querySelector(".bls__cart-thres-js");
          if (cart_threshold) {
            if (
              html
                .querySelector(".bls__cart-thres-js")
                .classList.contains("cart_shipping_free")
            ) {
              cart_threshold.classList.add("cart_shipping_free");
            } else {
              cart_threshold.classList.remove("cart_shipping_free");
            }
            cart_threshold.querySelector(".bls__cart-thres").innerHTML =
              html.querySelector(".bls__cart-thres").innerHTML;
            setTimeout(function () {
              cart_threshold
                .querySelector(".percent_shipping_bar")
                .setAttribute(
                  "style",
                  html
                    .querySelector(".percent_shipping_bar")
                    .getAttribute("style")
                );
            }, 500);
          }
        });
        this.cartAction();
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        Shopify.termsConditionsAction();
        this.notification.classList.add("finish");
        setTimeout(function () {
          this.cart = document.querySelector("cart-notification");
          this.cart
            .querySelector(".header_minicart")
            .classList.remove("start", "loading", "finish");
        }, 500);
        BlsLazyloadImg.init();
      });
  }

  countdownTimer() {
    if (!this.cartCountDown) return;
    const duration = Number(this.cartCountDown.dataset.countdownTime) || 5;
    const message = this.cartCountDown.dataset.timeoutMessage;
    const endTime = this.startTime + duration * 60 * 1000;
    const countdown_timer = setInterval(() => {
      if (!document.querySelector(".cart-countdown-time .countdown-message")) {
        clearInterval(countdown_timer);
      } else {
        if (this.startTime > endTime) {
          this.cartCountDown.querySelector(".countdown-message").innerHTML =
            message;
          clearInterval(countdown_timer);
        } else {
          var distance = endTime - this.startTime;
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          document.querySelector(".countdown-timer-minute").innerHTML = minutes;
          document.querySelector(".countdown-timer-sec").innerHTML = seconds;
        }
        this.startTime += 1000;
      }
    }, 1000);
  }

  open() {
    this.notification.classList.add("bls__opend-popup-header");
    document.documentElement.classList.add("hside_opened");
    this.notification.addEventListener(
      "transitionend",
      () => {
        this.notification.focus();
      },
      { once: true }
    );
    document.body.addEventListener("click", this.onBodyClick);
  }

  close() {
    this.notification.classList.remove("bls__opend-popup-header");
    document.documentElement.classList.remove("hside_opened");
    document.body.removeEventListener("click", this.onBodyClick);
    for (var item of document.querySelectorAll(".bls__addon")) {
      item.classList.remove("is-open");
    }
    for (var item of document.querySelectorAll(".bls-minicart-wrapper")) {
      item.classList.remove("addons-open");
    }
  }

  getSectionsToRender() {
    return [
      {
        id: "form-mini-cart",
      },
    ];
  }

  getSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}
customElements.define("cart-notification", CartNotification);

class MiniCartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      event.preventDefault();
      const cartItems = this.closest("cart-notification");
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}
customElements.define("mini-cart-remove-button", MiniCartRemoveButton);

class VariantSelectsQuickEdit extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll(".bls__option-swatch").forEach((button) =>
      button.addEventListener("click", this.onVariantChange.bind(this), false)
    );
  }

  onVariantChange(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const value = target.getAttribute("data-value");
    for (var item of target
      .closest("fieldset")
      .querySelectorAll(".bls__option-swatch")) {
      item.classList.remove("active");
    }
    target.classList.toggle("active");
    target
      .closest("fieldset")
      .querySelector(".swatch-selected-value").textContent = value;
    this.options = Array.from(
      this.querySelectorAll(".bls__option-swatch.active"),
      (select) => select.getAttribute("data-value")
    );
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;
    const form = document.getElementById(
      `product-form-quick-edit-${this.dataset.section}`
    );
    form.querySelector(".product__media img").removeAttribute("srcset");
    form
      .querySelector(".product__media img")
      .setAttribute(
        "src",
        this.currentVariant.featured_media.preview_image.src
      );
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-quick-edit-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  renderProductInfo() {
    if (!this.currentVariant) return;
    const compare_at_price = this.currentVariant.compare_at_price;
    const price = this.currentVariant.price;
    const price_format = Shopify.formatMoney(
      this.currentVariant.price,
      cartStrings.money_format
    );
    const form = document.getElementById(
      `product-form-quick-edit-${this.dataset.section}`
    );
    form.querySelector(".price__regular .price").innerHTML = price_format;
    const bls__price = form.querySelector(".bls__price");
    bls__price.classList.remove("price--sold-out", "price--on-sale");
    bls__price
      .querySelector(".price__regular .price")
      .classList.remove("special-price");
    if (compare_at_price && compare_at_price > price) {
      const compare_format = Shopify.formatMoney(
        compare_at_price,
        cartStrings.money_format
      );
      bls__price.querySelector(".compare-price").innerHTML = compare_format;
      bls__price.classList.add("price--on-sale");
      bls__price
        .querySelector(".price__regular .price")
        .classList.add("special-price");
    } else if (!this.currentVariant.available) {
      bls__price.classList.add("price--sold-out");
    }
    this.toggleAddButton(
      !this.currentVariant.available,
      window.variantStrings.soldOut
    );
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-quick-edit-${this.dataset.section}`
    );
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-quick-edit-${this.dataset.section}`
    );
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}
customElements.define("variant-radios-quick-edit", VariantSelectsQuickEdit);

if (!customElements.get("product-form-quick-edit")) {
  customElements.define(
    "product-form-quick-edit",
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector("form");
        this.form.querySelector("[name=id]").disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.cart =
          document.querySelector("cart-notification") ||
          document.querySelector("cart-drawer");
        this.submitButton = this.querySelector('[type="submit"]');
        if (document.querySelector("cart-drawer"))
          this.submitButton.setAttribute("aria-haspopup", "dialog");
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        this.handleErrorMessage();
        this.submitButton.setAttribute("disabled", true);
        this.submitButton.classList.add("btn-loading");
        const quick = document.getElementById("product-form-quick-edit");
        const id = quick.getAttribute("data-line");
        const quantity = 0;
        const config_change = fetchConfig("json");
        config_change.body = JSON.stringify({
          id,
          quantity,
        });
        fetch(`${routes.cart_change_url}`, config_change)
          .then((response) => {
            return response.text();
          })
          .catch((e) => {
            throw e;
          })
          .finally(() => {
            this.addCartAdd();
          });
      }

      addCartAdd() {
        const config = fetchConfig("json");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];
        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            "sections",
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append("sections_url", window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => {
            return response.text();
          })
          .then((state) => {
            this.submitButton.setAttribute("disabled", true);
            this.submitButton.querySelector("span").classList.add("hidden");
            fetch("/cart.json")
              .then((res) => res.json())
              .then((cart) => {
                document.querySelectorAll(".cart-count").forEach((el) => {
                  el.innerHTML = cart.item_count;
                });
              })
              .catch((error) => {
                throw error;
              });
            const parsedState = JSON.parse(state);
            this.cart.getSectionsToRender().forEach((section) => {
              const elementToReplace = document.getElementById(section.id);
              const html = new DOMParser().parseFromString(
                parsedState.sections[section.id],
                "text/html"
              );
              elementToReplace.innerHTML =
                html.querySelector("#form-mini-cart").innerHTML;
              const cart_threshold = document.querySelector(
                ".bls__cart-thres-js"
              );
              if (cart_threshold) {
                if (
                  html
                    .querySelector(".bls__cart-thres-js")
                    .classList.contains("cart_shipping_free")
                ) {
                  cart_threshold.classList.add("cart_shipping_free");
                } else {
                  cart_threshold.classList.remove("cart_shipping_free");
                }
                cart_threshold.querySelector(".bls__cart-thres").innerHTML =
                  html.querySelector(".bls__cart-thres").innerHTML;
                setTimeout(function () {
                  cart_threshold
                    .querySelector(".percent_shipping_bar")
                    .setAttribute(
                      "style",
                      html
                        .querySelector(".percent_shipping_bar")
                        .getAttribute("style")
                    );
                }, 500);
              }
              const countdown = this.cart.querySelector(".cart-countdown-time");
              const html_countdown = html.querySelector(".cart-countdown-time");
              if (countdown && html_countdown) {
                countdown.innerHTML = html_countdown.innerHTML;
                this.cart.countdownTimer();
              }
            });
            this.cart.cartAction();
          })
          .catch((e) => {
            throw e;
          })
          .finally(() => {
            this.submitButton.classList.remove("btn-loading");
            if (this.cart && this.cart.classList.contains("is-empty"))
              this.cart.classList.remove("is-empty");
            if (!this.error) this.submitButton.removeAttribute("disabled");
            this.submitButton.querySelector("span").classList.remove("hidden");
            document.querySelector(".dlg-close-x").click();
            Shopify.termsConditionsAction();
            BlsLazyloadImg.init();
          });
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        if (!this.errorMessageWrapper) return;
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}

class VariantRadiosQuickview extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll(".bls__option-swatch").forEach((button) =>
      button.addEventListener("click", this.onVariantChange.bind(this), false)
    );
  }

  onVariantChange(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const value = target.getAttribute("data-value");
    for (var item of target
      .closest("fieldset")
      .querySelectorAll(".bls__option-swatch")) {
      item.classList.remove("active");
    }
    target.classList.toggle("active");
    target
      .closest("fieldset")
      .querySelector(".swatch-selected-value").textContent = value;
    this.options = Array.from(
      this.querySelectorAll(".bls__option-swatch.active"),
      (select) => select.getAttribute("data-value")
    );
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  renderProductInfo() {
    if (!this.currentVariant) return;
    let qty = 0;
    let percent = 0;
    let sale = false;
    let availability = window.variantStrings.inStock;
    let variantStrings = window.variantStrings.soldOut;
    const compare_at_price = this.currentVariant.compare_at_price;
    const price = this.currentVariant.price;
    const unit_price = this.currentVariant.unit_price
    const unit_price_measurement = this.currentVariant.unit_price_measurement
    const form = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const quickview = form.closest(".bls__product-quickview");
    this.getVariantQtyData().find((variantQty) => {
      if (variantQty.id === this.currentVariant.id) {
        qty = variantQty.qty;
      }
    });
    if (compare_at_price && compare_at_price > price) {
      sale = true;
      percent = ((compare_at_price - price) / compare_at_price) * 100;
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
    if (quickview.querySelector(".bls__availability-value")) {
      quickview.querySelector(".bls__availability-value").textContent =
        availability;
    }
    const product_label = quickview.querySelector(".bls__product-label");
    if (product_label) {
      product_label.remove();
    }
    if (sale) {
      var element = document.createElement("div");
      element.classList.add(
        "bls__product-label",
        "mb-5",
        "fs-12",
        "pointer-events-none",
        "inline-block",
        "static"
      );
      quickview
        .querySelector(".bls__quickview-content")
        .insertBefore(
          element,
          quickview.querySelector(".bls__quickview-content").children[0]
        );
      const label = quickview.querySelector(".bls__product-label");
      var element_sale = document.createElement("div");
      element_sale.classList.add("bls__sale-label");
      element_sale.innerText = -percent.toFixed(0) + "%";
      label.appendChild(element_sale);
    }

    if (quickview.querySelector(".bls__product-sku-value")) {
      quickview.querySelector(".bls__product-sku-value").textContent =
        this.currentVariant.sku;
    }

    const price_format = Shopify.formatMoney(
      this.currentVariant.price,
      cartStrings.money_format
    );
    if (unit_price && unit_price_measurement) {
      const price_num = Shopify.formatMoney(unit_price, cartStrings.money_format)
      const price_unit = unit_price_measurement.reference_value != 1 ? unit_price_measurement.reference_value : unit_price_measurement.reference_unit
      quickview.querySelector('.unit-price .number').innerHTML = price_num;
      quickview.querySelector('.unit-price .unit').innerHTML = price_unit;
    }
    quickview.querySelector(".price__regular .price").innerHTML = price_format;
    const bls__price = quickview.querySelector(".bls__price");
    bls__price.classList.remove("price--sold-out", "price--on-sale");
    bls__price
      .querySelector(".price__regular .price")
      .classList.remove("special-price");
    if (compare_at_price && compare_at_price > price) {
      const compare_format = Shopify.formatMoney(
        compare_at_price,
        cartStrings.money_format
      );
      bls__price.querySelector(".compare-price").innerHTML = compare_format;
      bls__price.classList.add("price--on-sale");
      bls__price
        .querySelector(".price__regular .price")
        .classList.add("special-price");
    } else if (!this.currentVariant.available) {
      bls__price.classList.add("price--sold-out");
    }
    this.toggleAddButton(!this.currentVariant.available, variantStrings);
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;
    if (disable) {
      addButton.setAttribute("disabled", "disabled");
    } else {
      addButton.removeAttribute("disabled");
    }
    if (text) addButtonText.textContent = text;

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  getVariantQtyData() {
    this.variantQtyData = JSON.parse(
      this.querySelector(".productVariantsQty").textContent
    );
    return this.variantQtyData;
  }
}
customElements.define("variant-radios-quickview", VariantRadiosQuickview);

var BlsUminoAdminLi = (function () {
  return {
    init: function () {
      this.BlsCheckLi();
      },
    BlsCheckLi: function () {
      const _this = this;
      if (typeof umino_app === "object") {
       if (umino_app.mode === "admin" ) {
        if (umino_app.action === "active") {
          if (_this.checkCookie(umino_app.lic) === false) {
            _this.BlsActive();
          }
        } else {
          const url = "https://shopifyapi.blueskytechco.com/api/remove-license/?code="+umino_app.lic+"&domain="+umino_app.shop;
          fetch(url)
            .then((response) => response.json())
            .then((responseText) => {
              if (responseText) {
                const d = new Date(new Date().getTime() - 36e6);
                _this.setCookie(umino_app.lic, d);
              }
              _this.BlsRenderHtml(0);
            })
            .catch((e) => {
              console.log(e);
            });
        }
       }
      }else{
        _this.BlsRenderHtml(0);
      }
    },
    BlsRenderHtml: function (cs) {
      const shop = window.location.hostname.replace(/\./g,'-');
        if (!document.querySelector('#'+"bls__"+shop)) {
          const a = document.createElement("DIV");
          const n = document.createElement("DIV");
          const b = document.createElement("h3");
          const c = document.createElement("p");
          const step2p = document.createElement("p");
          const step3p = document.createElement("p");
          const d = document.createElement("h5");
          const e = document.createElement("h5");
          const f = document.createElement("h5");
          const pca = document.createElement("a");
          var text = ""
          switch (cs) {
            case 1:
              text = "This purchase was activated for another domain!!!";
              break;
            case 2:
              text = "This purchase is invalid!!!";
              break;
            default:
              text = "Welcome to Umino latest version 1.0.2 🎉 ";
              break;
          }
          const t = document.createTextNode(text);
          const s = document.createTextNode("Follow these simple steps to use Umino theme:");
          const q = document.createTextNode("Step 1: Add Umino theme file to your 'Online store' > 'Theme'.");
          const p = document.createTextNode("Step 2: Insert purchase code");
          const k = document.createTextNode("Step 3: Activate purchase code");
          const w = document.createTextNode("Go to 'Theme setting' > 'Purchase code' to insert your purchase code.");
          const x = document.createTextNode("Go to 'Theme setting' > 'Purchase code action' and select 'Active purchase code'.");
          const m = document.createTextNode("👉 Get Umino purchase code");
          const step1 = document.createElement("DIV");
          const step2 = document.createElement("DIV");
          const step3 = document.createElement("DIV");
          pca.setAttribute("target", "_blank");
          pca.setAttribute("href", "https://themeforest.net/item/umino-multipurpose-shopify-themes-os-20/42969030");
          step1.setAttribute("class", "step-1");
          step2.setAttribute("class", "step-2");
          step3.setAttribute("class", "step-3");
          pca.appendChild(m);
          step2p.appendChild(w);
          step3p.appendChild(x);
          b.appendChild(t);
          c.appendChild(s);
          d.appendChild(q);
          e.appendChild(p);
          f.appendChild(k);
          step1.appendChild(d);
          step2.appendChild(e);
          step2.appendChild(step2p);
          step2.appendChild(pca);
          step3.appendChild(f);
          step3.appendChild(step3p);
          a.setAttribute("id", "bls__not-active");
          n.appendChild(b);
          n.appendChild(c);
          n.appendChild(step1);
          n.appendChild(step2);
          n.appendChild(step3);
          a.appendChild(n);
          document.querySelector('body').appendChild(a);
        }else{
          document.querySelector('#'+"bls__"+shop).remove();
      };
    },
    BlsActive: function () {
      const _this = this
      const url = "https://shopifyapi.blueskytechco.com/api/check-license/?code="+umino_app.lic+"&domain="+umino_app.shop
      fetch(url)
        .then((response) => response.json())
        .then((responseText) => {
          if (responseText.d === false) {
            _this.BlsRenderHtml(responseText.s);
          }else if (responseText.d === true){
            const d = new Date(new Date().getTime() + 36e6);
            _this.setCookie(umino_app.lic, d);
          }else if (responseText.d === "err"){
            console.log(responseText.err?responseText.err.message:"Please contact to server's adminstrator!!!");
          }
        })
        .catch((e) => {
          console.log(e);
        });        
    },
    setCookie: function (cvalue, d) {
      const v = btoa(cvalue);
      document.cookie = "UHVyY2hhc2VDb2Rl" + "=" + v + ";expires=" + d + ";path=/";
    },
    checkCookie: function (val) {
      const v = atob(getCookie("UHVyY2hhc2VDb2Rl"));
      if ( val.length !== 0 && v == val) {
        return true;
      } else {
        return false;
      }
    },
  };
})();
BlsUminoAdminLi.init();