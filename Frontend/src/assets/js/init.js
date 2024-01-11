//=========================================//
/*/* 11) Typed Text animation (animation) */
//=========================================//

try {
  var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
  };

  TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";
    var that = this;
    var delta = 200 - Math.random() * 100;
    if (this.isDeleting) {
      delta /= 2;
    }
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
    setTimeout(function () {
      that.tick();
    }, delta);
  };

  function typewrite() {
    if (toRotate === "undefined") {
      changeText();
    } else var elements = document.getElementsByClassName("typewrite");
    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute("data-type");
      var period = elements[i].getAttribute("data-period");
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML =
      ".typewrite > .wrap { border-right: 0.08em solid transparent}";
    document.body.appendChild(css);
  }

  window.onload = function () {
    //Menu
    // Toggle menu
    function toggleMenu() {
      document.getElementById("isToggle").classList.toggle("open");
      var isOpen = document.getElementById("navigation");
      if (isOpen.style.display === "block") {
        isOpen.style.display = "none";
      } else {
        isOpen.style.display = "block";
      }
    }

    //Menu Active
    function getClosest(elem, selector) {
      // Element.matches() polyfill
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function (s) {
            var matches = (
                this.document || this.ownerDocument
              ).querySelectorAll(s),
              i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
          };
      }

      // Get the closest matching element
      for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
      }
      return null;
    }

    function activateMenu() {
      var menuItems = document.getElementsByClassName("sub-menu-item");
      if (menuItems) {
        var matchingMenuItem = null;
        for (var idx = 0; idx < menuItems.length; idx++) {
          if (menuItems[idx].href === window.location.href) {
            matchingMenuItem = menuItems[idx];
          }
        }

        if (matchingMenuItem) {
          matchingMenuItem.classList.add("active");
          var immediateParent = getClosest(matchingMenuItem, "li");
          if (immediateParent) {
            immediateParent.classList.add("active");
          }

          var parent = getClosest(matchingMenuItem, ".parent-menu-item");
          if (parent) {
            parent.classList.add("active");
            var parentMenuitem = parent.querySelector(".menu-item");
            if (parentMenuitem) {
              parentMenuitem.classList.add("active");
            }
            var parentOfParent = getClosest(parent, ".parent-parent-menu-item");
            if (parentOfParent) {
              parentOfParent.classList.add("active");
            }
          } else {
            var parentOfParent = getClosest(
              matchingMenuItem,
              ".parent-parent-menu-item"
            );
            if (parentOfParent) {
              parentOfParent.classList.add("active");
            }
          }
        }
      }
    }

    // Clickable Menu
    if (document.getElementById("navigation")) {
      var elements = document
        .getElementById("navigation")
        .getElementsByTagName("a");
      for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = function (elem) {
          if (elem.target.getAttribute("href") === "javascript:void(0)") {
            var submenu = elem.target.nextElementSibling.nextElementSibling;
            submenu.classList.toggle("open");
          }
        };
      }
    }
    
    typewrite();

    if (document.getElementsByClassName("tiny-single-item").length > 0) {
      var slider = tns({
        container: ".tiny-single-item",
        items: 1,
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: "bottom",
        speed: 400,
        gutter: 16,
      });
    }

    if (document.getElementsByClassName("tiny-two-item").length > 0) {
      var slider = tns({
        container: ".tiny-two-item",
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: "bottom",
        speed: 400,
        gutter: 12,
        responsive: {
          992: {
            items: 2,
          },

          767: {
            items: 2,
          },

          320: {
            items: 1,
          },
        },
      });
    }

    if (document.getElementsByClassName("tiny-three-item").length > 0) {
      var slider = tns({
        container: ".tiny-three-item",
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: "bottom",
        speed: 400,
        gutter: 12,
        responsive: {
          992: {
            items: 3,
          },

          767: {
            items: 2,
          },

          320: {
            items: 1,
          },
        },
      });
    }

    if (document.getElementsByClassName("tiny-four-item").length > 0) {
      var slider = tns({
        container: ".tiny-four-item",
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: "bottom",
        speed: 400,
        gutter: 12,
        responsive: {
          992: {
            items: 4,
          },

          767: {
            items: 2,
          },

          320: {
            items: 1,
          },
        },
      });
    }

    if (document.getElementsByClassName("roadmaps").length > 0) {
      var slider = tns({
        container: ".roadmaps",
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        nav: false,
        speed: 400,
        gutter: 12,
        responsive: {
          992: {
            items: 4,
          },

          767: {
            items: 2,
          },

          320: {
            items: 1,
          },
        },
      });
    }

    if (document.getElementsByClassName("tiny-six-item").length > 0) {
      var slider = tns({
        container: ".tiny-six-item",
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: "bottom",
        speed: 400,
        gutter: 12,
        responsive: {
          992: {
            items: 6,
          },

          767: {
            items: 3,
          },

          320: {
            items: 1,
          },
        },
      });
    }

    if (document.getElementsByClassName("tiny-twelve-item").length > 0) {
      var slider = tns({
        container: ".tiny-twelve-item",
        controls: true,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: "bottom",
        controlsText: [
          '<i class="mdi mdi-chevron-left "></i>',
          '<i class="mdi mdi-chevron-right"></i>',
        ],
        nav: false,
        speed: 400,
        gutter: 0,
        responsive: {
          1025: {
            items: 10,
          },

          992: {
            items: 8,
          },

          767: {
            items: 6,
          },

          320: {
            items: 2,
          },
        },
      });
    }
  };
} catch (err) {
  console.log(err);
}

//=========================================//
/*            01) Tiny slider              */
//=========================================//
