/*
Morphing menu indicator v1.0
Author: https://github.com/TinBoyko
*/

class MorphingMenuIndicator {
    constructor(el, params = {}) {
        this.el = el
        this.params = params
        this.indicator = null
        this.path = null
        this.animate = null
        this.mobileSwitcher = null
        this.width = 0
        this.height = 0

        this.defaultParams = {
            activeMenuItemClass: 'active',
            color: '#e5242d', //indicator color
            menuItemClass: 'nav-link',
            extend: [1.2, 1], //size coefficients, first - by width, second - by height, depend on menu item size
            speed: 300 //animation speed
        }

        if (typeof el === 'string') {
            this.menu = document.getElementsByClassName(el)[0]
        }

        this.init()
    }

    init() {
        this.setParams()
        this.appendIndicator()
        this.setEvents()
        let activeMenuItem = this.getActiveMenuItem()
        this.setPosition(activeMenuItem)
        this.addClass(activeMenuItem, 'hovered')
    }

    setPosition(el) {
        this.width = el.offsetWidth
        this.height = el.offsetHeight

        this.setAttributes(this.indicator, {
            width: this.width * this.params.extend[1],
            height: this.height * this.params.extend[0]
        })

        this.setStyle(this.indicator, {
            left: el.offsetLeft - (this.indicator.getAttribute('width') - el.offsetWidth) / 2 + 'px',
            top: el.offsetTop - (this.indicator.getAttribute('height') - el.offsetHeight) / 2 + 5 + 'px'
        })

        this.setPath()
    }

    setEvents() {
        this.mobileSwitcherInit()
        let $this = this
        let animate = this.path.getElementsByTagName('animate')[0]
        let menuItems = this.menu.getElementsByClassName(this.params.menuItemClass)
        let activeMenuItem = this.getActiveMenuItem()

        for (let i = 0; i < menuItems.length; i++) {
            menuItems[i].addEventListener('mouseenter', function (e) {
                $this.removeClass(activeMenuItem, 'hovered')
                $this.updatePath()
                animate.beginElement()
                $this.setPosition(this)
                $this.addClass(this, 'hovered')

                function removeHoverClass() {
                    if (this === activeMenuItem) return

                    $this.removeClass(this, 'hovered')
                    removeEventListener('mouseleave', removeHoverClass)
                }
                this.addEventListener('mouseleave', removeHoverClass)
            })

            menuItems[i].addEventListener('mouseleave', function () {
                if (this === activeMenuItem) return
                $this.updatePath()
                animate.beginElement()
                $this.setPosition(activeMenuItem)
                $this.addClass(activeMenuItem, 'hovered')
            })
        }

        this.debounce(function () {
            return window.addEventListener('resize', function () {
                $this.setPosition(activeMenuItem)
            })
        }, 200)
    }

    mobileSwitcherInit() {
        let $this = this
        this.mobileSwitcher = this.menu.nextSibling.nextSibling
        this.mobileSwitcher.addEventListener('click', function (e) {
            e.preventDefault()
            e.stopPropagation()
            if ($this.hasClass(document.body, 'menu-active')) {
                $this.removeClass(document.body, 'menu-active')
            } else {
                $this.addClass(document.body, 'menu-active')
            }
        })
        window.addEventListener('click', function (e) {
            if (e.target === $this.menu || e.target === $this.mobileSwitcher) return
            $this.removeClass(document.body, 'menu-active')
        })
    }

    setParams() {
        this.params = Object.assign(this.defaultParams, this.params)
        this.pathAttrs = {
            d: this.getRandomPath(),
            'stroke-width': 0,
            stroke: this.params.color,
            'fill-opacity': 'null',
            fill: this.params.color,
        }
    }

    getRandomPath(width = this.width, height = this.height) {
        let coord_1 = this.getRandomCoordinate(-10, 10)
        let coord_2 = -coord_1
        let coord_3 = this.getRandomCoordinate(-10, 10)
        let coord_4 = -coord_3
        let coordsArray = [
            [0, width],
            [coord_1, coord_2],
            [height, -width],
            [coord_3, coord_4]
        ]
        let coordsAttr = 'm10, ';

        coordsArray.forEach(coords => {
            coordsAttr += coords.join('l') + ', '
        })
        coordsAttr += '-' + this.height + 10 + 'z'

        return coordsAttr
    }

    setPath() {
        this.path.setAttribute('d', this.getRandomPath())
    }

    updatePath() {
        this.setAttributes(this.animate, {
            from: this.animate.getAttribute('to'),
            to: this.getRandomPath()
        })
    }

    getRandomCoordinate(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    createSvg() {
        let xmlns = "http://www.w3.org/2000/svg"
        let indicator = document.createElementNS(xmlns, 'svg')
        let path = document.createElementNS(xmlns, 'path')
        let animate = document.createElementNS(xmlns, 'animate')
        this.setAttributes(animate, {
            attributeName: 'd',
            attributeType: 'XML',
            // from: this.getRandomPath(),
            to: this.getRandomPath(),
            dur: `${this.params.speed}ms`,
            fill: 'freeze',
            begin: 'indefinite'
        })
        this.setAttributes(indicator, {
            width: this.width,
            height: this.height
        })
        this.addClass(indicator, 'animated-indicator')
        this.setAttributes(path, this.pathAttrs)
        path = indicator.appendChild(path)
        this.animate = path.appendChild(animate)

        return indicator
    }

    appendIndicator() {
        // let body = document.getElementsByTagName('body')
        let indicator = this.createSvg()
        this.indicator = this.menu.appendChild(indicator)
        this.path = this.indicator.getElementsByTagName('path')[0]
        this.menu.style.position = 'relative'
        this.setStyle(this.indicator, {
            position: 'absolute',
            transition: `all ${this.params.speed}ms ease`,
            'z-index': -1
        })

        this.updatePath()
    }


    setAttributes(el, attrs = {}) {
        for (let i in attrs) {
            el.setAttribute(i, attrs[i])
        }
    }

    setStyle(el, style = {}) {
        for (let i in style) {
            el.style[i] = style[i]
        }
    }

    addClass(el, className) {
        let oldClass = el.getAttribute('class')
        if (oldClass === null) {
            oldClass = ''
        }
        let newClass = oldClass.concat(` ${className}`)
        el.setAttribute('class', newClass)
    }

    removeClass(el, className) {
        let oldClass = el.getAttribute('class')
        if (oldClass === null) {
            oldClass = ''
        }
        let newClass = oldClass.replace(className, '')
        el.setAttribute('class', newClass.trim())
    }

    hasClass(el, className) {
        return el.className.includes(className)
    }

    getActiveMenuItem() {
        let activeMenu = this.menu.getElementsByClassName(this.params.activeMenuItemClass)[0]

        return activeMenu
    }

    debounce(f, ms) {
        let isCooldown = false;

        return function () {
            if (isCooldown) return;

            f.apply(this, arguments);

            isCooldown = true;

            setTimeout(() => isCooldown = false, ms);
        };
    }

}