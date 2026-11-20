
/**
 * One Frame Business Solutions
 * Optimised Bootslander main JavaScript
 */

(function () {
  "use strict";

  /* =========================================
     1. FAST PRELOADER
  ========================================= */

  function hidePreloader() {
    const preloader = document.querySelector("#preloader");

    if (preloader) {
      preloader.remove();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hidePreloader, {
      once: true
    });
  } else {
    hidePreloader();
  }

  // Safety fallback: never leave the loader stuck.
  window.setTimeout(hidePreloader, 2500);


  /* =========================================
     2. HEADER SCROLL EFFECT
  ========================================= */

  function toggleScrolled() {
    const body = document.body;
    const header = document.querySelector("#header");

    if (!header) return;

    if (
      !header.classList.contains("scroll-up-sticky") &&
      !header.classList.contains("sticky-top") &&
      !header.classList.contains("fixed-top")
    ) {
      return;
    }

    if (window.scrollY > 100) {
      body.classList.add("scrolled");
    } else {
      body.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", toggleScrolled, { passive: true });


  /* =========================================
     3. MOBILE NAVIGATION
  ========================================= */

  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToggle() {
    if (!mobileNavToggleBtn) return;

    document.body.classList.toggle("mobile-nav-active");

    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
  }

  document.querySelectorAll("#navmenu a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });


  /* =========================================
     4. MOBILE DROPDOWNS
  ========================================= */

  document.querySelectorAll(".navmenu .toggle-dropdown").forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();

      this.parentNode.classList.toggle("active");

      if (this.parentNode.nextElementSibling) {
        this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      }

      event.stopImmediatePropagation();
    });
  });


  /* =========================================
     5. SCROLL TO TOP
  ========================================= */

  const scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (!scrollTop) return;

    if (window.scrollY > 100) {
      scrollTop.classList.add("active");
    } else {
      scrollTop.classList.remove("active");
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", function (event) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  window.addEventListener("scroll", toggleScrollTop, { passive: true });


  /* =========================================
     6. AOS ANIMATIONS
  ========================================= */

  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false
      });
    }
  }


  /* =========================================
     7. GLIGHTBOX
  ========================================= */

  if (typeof GLightbox === "function") {
    GLightbox({
      selector: ".glightbox"
    });
  }


  /* =========================================
     8. PURE COUNTER
  ========================================= */

  if (typeof PureCounter === "function") {
    new PureCounter();
  }


  /* =========================================
     9. SWIPER SLIDERS
  ========================================= */

  function initSwiper() {
    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper").forEach(function (element) {
      const configElement = element.querySelector(".swiper-config");

      if (!configElement) return;

      try {
        const config = JSON.parse(configElement.textContent.trim());

        if (
          element.classList.contains("swiper-tab") &&
          typeof initSwiperWithCustomPagination === "function"
        ) {
          initSwiperWithCustomPagination(element, config);
        } else {
          new Swiper(element, config);
        }

      } catch (error) {
        console.error("Swiper initialization error:", error);
      }
    });
  }


  /* =========================================
     10. FAQ TOGGLE
  ========================================= */

  document.querySelectorAll(".faq-item h3, .faq-item .faq-toggle").forEach(function (item) {
    item.addEventListener("click", function () {
      const faqItem = item.parentNode;

      if (faqItem) {
        faqItem.classList.toggle("faq-active");
      }
    });
  });


  /* =========================================
     11. HASH LINK SCROLLING
  ========================================= */

  function handleHashScroll() {
    if (!window.location.hash) return;

    let section;

    try {
      section = document.querySelector(window.location.hash);
    } catch (error) {
      return;
    }

    if (!section) return;

    window.setTimeout(function () {
      const scrollMarginTop = parseInt(
        getComputedStyle(section).scrollMarginTop,
        10
      ) || 0;

      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - scrollMarginTop,
        behavior: "smooth"
      });
    }, 100);
  }


  /* =========================================
     12. NAVIGATION SCROLLSPY
  ========================================= */

  const navMenuLinks = document.querySelectorAll(".navmenu a");

  function navMenuScrollspy() {
    const position = window.scrollY + 200;

    navMenuLinks.forEach(function (link) {
      if (!link.hash || link.origin !== window.location.origin) return;

      let section;

      try {
        section = document.querySelector(link.hash);
      } catch (error) {
        return;
      }

      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (position >= sectionTop && position <= sectionBottom) {
        document.querySelectorAll(".navmenu a.active").forEach(function (activeLink) {
          activeLink.classList.remove("active");
        });

        link.classList.add("active");
      }
    });
  }


  /* =========================================
     13. INITIALISE PAGE FEATURES
  ========================================= */

  function initialisePage() {
    toggleScrolled();
    toggleScrollTop();
    aosInit();
    initSwiper();
    handleHashScroll();
    navMenuScrollspy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialisePage, {
      once: true
    });
  } else {
    initialisePage();
  }

  window.addEventListener("scroll", navMenuScrollspy, { passive: true });

})();
