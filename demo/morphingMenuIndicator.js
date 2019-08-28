"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MorphingMenuIndicator =
/*#__PURE__*/
function () {
  function MorphingMenuIndicator(el) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MorphingMenuIndicator);

    this.el = el;
    this.params = params;
    this.indicator = null;
    this.path = null;
    this.animate = null;
    this.mobileSwitcher = null;
    this.width = 0;
    this.height = 0;
    this.defaultParams = {
      activeMenuItemClass: 'active',
      color: '#e5242d',
      //indicator color
      menuItemClass: 'nav-link',
      extend: [1.2, 1],
      //size coefficients, first - by width, second - by height, depend on menu item size
      speed: 300 //animation speed

    };

    if (typeof el === 'string') {
      this.menu = document.getElementsByClassName(el)[0];
    }

    this.init();
  }

  _createClass(MorphingMenuIndicator, [{
    key: "init",
    value: function init() {
      this.setParams();
      this.appendIndicator();
      this.setEvents();
      var activeMenuItem = this.getActiveMenuItem();
      this.setPosition(activeMenuItem);
      this.addClass(activeMenuItem, 'hovered');
    }
  }, {
    key: "setPosition",
    value: function setPosition(el) {
      this.width = el.offsetWidth;
      this.height = el.offsetHeight;
      this.setAttributes(this.indicator, {
        width: this.width * this.params.extend[1],
        height: this.height * this.params.extend[0]
      });
      this.setStyle(this.indicator, {
        left: el.offsetLeft - (this.indicator.getAttribute('width') - el.offsetWidth) / 2 + 'px',
        top: el.offsetTop - (this.indicator.getAttribute('height') - el.offsetHeight) / 2 + 5 + 'px'
      });
      this.setPath();
    }
  }, {
    key: "setEvents",
    value: function setEvents() {
      this.mobileSwitcherInit();
      var $this = this;
      var animate = this.path.getElementsByTagName('animate')[0];
      var menuItems = this.menu.getElementsByClassName(this.params.menuItemClass);
      var activeMenuItem = this.getActiveMenuItem();

      for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('mouseenter', function (e) {
          $this.removeClass(activeMenuItem, 'hovered');
          $this.updatePath();
          animate.beginElement();
          $this.setPosition(this);
          $this.addClass(this, 'hovered');

          function removeHoverClass() {
            if (this === activeMenuItem) return;
            $this.removeClass(this, 'hovered');
            removeEventListener('mouseleave', removeHoverClass);
          }

          this.addEventListener('mouseleave', removeHoverClass);
        });
        menuItems[i].addEventListener('mouseleave', function () {
          if (this === activeMenuItem) return;
          $this.updatePath();
          animate.beginElement();
          $this.setPosition(activeMenuItem);
          $this.addClass(activeMenuItem, 'hovered');
        });
      }

      this.debounce(function () {
        return window.addEventListener('resize', function () {
          $this.setPosition(activeMenuItem);
        });
      }, 200);
    }
  }, {
    key: "mobileSwitcherInit",
    value: function mobileSwitcherInit() {
      var $this = this;
      this.mobileSwitcher = this.menu.nextSibling.nextSibling;
      this.mobileSwitcher.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($this.hasClass(document.body, 'menu-active')) {
          $this.removeClass(document.body, 'menu-active');
        } else {
          $this.addClass(document.body, 'menu-active');
        }
      });
      window.addEventListener('click', function (e) {
        if (e.target === $this.menu || e.target === $this.mobileSwitcher) return;
        $this.removeClass(document.body, 'menu-active');
      });
    }
  }, {
    key: "setParams",
    value: function setParams() {
      this.params = Object.assign(this.defaultParams, this.params);
      this.pathAttrs = {
        d: this.getRandomPath(),
        'stroke-width': 0,
        stroke: this.params.color,
        'fill-opacity': 'null',
        fill: this.params.color
      };
    }
  }, {
    key: "getRandomPath",
    value: function getRandomPath() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.height;
      var coord_1 = this.getRandomCoordinate(-10, 10);
      var coord_2 = -coord_1;
      var coord_3 = this.getRandomCoordinate(-10, 10);
      var coord_4 = -coord_3;
      var coordsArray = [[0, width], [coord_1, coord_2], [height, -width], [coord_3, coord_4]];
      var coordsAttr = 'm10, ';
      coordsArray.forEach(function (coords) {
        coordsAttr += coords.join('l') + ', ';
      });
      coordsAttr += '-' + this.height + 10 + 'z';
      return coordsAttr;
    }
  }, {
    key: "setPath",
    value: function setPath() {
      this.path.setAttribute('d', this.getRandomPath());
    }
  }, {
    key: "updatePath",
    value: function updatePath() {
      this.setAttributes(this.animate, {
        from: this.animate.getAttribute('to'),
        to: this.getRandomPath()
      });
    }
  }, {
    key: "getRandomCoordinate",
    value: function getRandomCoordinate(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }, {
    key: "createSvg",
    value: function createSvg() {
      var xmlns = "http://www.w3.org/2000/svg";
      var indicator = document.createElementNS(xmlns, 'svg');
      var path = document.createElementNS(xmlns, 'path');
      var animate = document.createElementNS(xmlns, 'animate');
      this.setAttributes(animate, {
        attributeName: 'd',
        attributeType: 'XML',
        // from: this.getRandomPath(),
        to: this.getRandomPath(),
        dur: "".concat(this.params.speed, "ms"),
        fill: 'freeze',
        begin: 'indefinite'
      });
      this.setAttributes(indicator, {
        width: this.width,
        height: this.height
      });
      this.addClass(indicator, 'animated-indicator');
      this.setAttributes(path, this.pathAttrs);
      path = indicator.appendChild(path);
      this.animate = path.appendChild(animate);
      return indicator;
    }
  }, {
    key: "appendIndicator",
    value: function appendIndicator() {
      // let body = document.getElementsByTagName('body')
      var indicator = this.createSvg();
      this.indicator = this.menu.appendChild(indicator);
      this.path = this.indicator.getElementsByTagName('path')[0];
      this.menu.style.position = 'relative';
      this.setStyle(this.indicator, {
        position: 'absolute',
        transition: "all ".concat(this.params.speed, "ms ease"),
        'z-index': -1
      });
      this.updatePath();
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(el) {
      var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      for (var i in attrs) {
        el.setAttribute(i, attrs[i]);
      }
    }
  }, {
    key: "setStyle",
    value: function setStyle(el) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      for (var i in style) {
        el.style[i] = style[i];
      }
    }
  }, {
    key: "addClass",
    value: function addClass(el, className) {
      var oldClass = el.getAttribute('class');

      if (oldClass === null) {
        oldClass = '';
      }

      var newClass = oldClass.concat(" ".concat(className));
      el.setAttribute('class', newClass);
    }
  }, {
    key: "removeClass",
    value: function removeClass(el, className) {
      var oldClass = el.getAttribute('class');

      if (oldClass === null) {
        oldClass = '';
      }

      var newClass = oldClass.replace(className, '');
      el.setAttribute('class', newClass.trim());
    }
  }, {
    key: "hasClass",
    value: function hasClass(el, className) {
      return el.className.includes(className);
    }
  }, {
    key: "getActiveMenuItem",
    value: function getActiveMenuItem() {
      var activeMenu = this.menu.getElementsByClassName(this.params.activeMenuItemClass)[0];
      return activeMenu;
    }
  }, {
    key: "debounce",
    value: function debounce(f, ms) {
      var isCooldown = false;
      return function () {
        if (isCooldown) return;
        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(function () {
          return isCooldown = false;
        }, ms);
      };
    }
  }]);

  return MorphingMenuIndicator;
}();