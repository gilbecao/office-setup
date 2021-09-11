;((window) => {
  const support = { animations: Modernizr.cssanimations }
  const animEndEventNames = {
    WebkitAnimation: 'webkitAnimationEnd',
    OAnimation: 'oAnimationEnd',
    msAnimation: 'MSAnimationEnd',
    animation: 'animationend',
  }
  const animEndEventName = animEndEventNames[Modernizr.prefixed('animation')]
  const onEndAnimation = function (el, callback) {
    var onEndCallbackFn = function (ev) {
      if (support.animations) {
        if (ev.target != this) return
        this.removeEventListener(animEndEventName, onEndCallbackFn)
      }
      if (callback && typeof callback === 'function') {
        callback.call()
      }
    }
    if (support.animations) {
      el.addEventListener(animEndEventName, onEndCallbackFn)
    } else {
      onEndCallbackFn()
    }
  }

  // from http://www.sberry.me/articles/javascript-event-throttling-debouncing
  function throttle(fn, delay) {
    let allowSample = true

    return function (e) {
      if (allowSample) {
        allowSample = false
        setTimeout(() => {
          allowSample = true
        }, delay)
        fn(e)
      }
    }
  }

  // sliders - flickity
  const sliders = [].slice.call(document.querySelectorAll('.slider'))
  // array where the flickity instances are going to be stored
  const flkties = []
  // grid element
  const grid = document.querySelector('.grid')
  // isotope instance
  let iso
  // filter ctrls
  const filterCtrls = [].slice.call(
    document.querySelectorAll('.filter > button')
  )

  function init() {
    // preload images
    imagesLoaded(grid, () => {
      initFlickity()
      initIsotope()
      initEvents()
      classie.remove(grid, 'grid--loading')
    })
  }

  function initFlickity() {
    sliders.forEach((slider) => {
      const flkty = new Flickity(slider, {
        prevNextButtons: false,
        wrapAround: true,
        cellAlign: 'left',
        contain: true,
        resize: false,
      })

      // store flickity instances
      flkties.push(flkty)
    })
  }

  function initIsotope() {
    iso = new Isotope(grid, {
      isResizeBound: false,
      itemSelector: '.grid__item',
      percentPosition: true,
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.grid__sizer',
      },
      transitionDuration: '0.6s',
    })
  }

  function initEvents() {
    filterCtrls.forEach((filterCtrl) => {
      filterCtrl.addEventListener('click', () => {
        classie.remove(
          filterCtrl.parentNode.querySelector('.filter__item--selected'),
          'filter__item--selected'
        )
        classie.add(filterCtrl, 'filter__item--selected')
        iso.arrange({
          filter: filterCtrl.getAttribute('data-filter'),
        })
        recalcFlickities()
        iso.layout()
      })
    })

    // window resize / recalculate sizes for both flickity and isotope/masonry layouts
    window.addEventListener(
      'resize',
      throttle((ev) => {
        recalcFlickities()
        iso.layout()
      }, 50)
    )
  }

  function recalcFlickities() {
    for (let i = 0, len = flkties.length; i < len; ++i) {
      flkties[i].resize()
    }
  }

  init()
})(window)
