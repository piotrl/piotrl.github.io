'use strict';
var s,
portfolio = {
    settings: {
        navList: document.querySelectorAll('.navigate nav a'),
        projectList: document.querySelectorAll('section.works a.thumb'),
        galleryEl: document.getElementById('presentation'),
        scrollTime: 500
    },
    init: function() {
        s = portfolio.settings;
        Math.easeInOutQuad = function (t, b, c, d) {
            // https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
            // t: current time, b: begInnIng value, c: change In value, d: duration
            t /= d/2;
            if (t < 1) {
                return c/2*t*t + b;
            }
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

        portfolio.bindUIActions();
        portfolio.createGalleryNav();
    },
    bindUIActions: function() {
        [].forEach.call(s.navList, function(that) {   // that: Node Element of actual iteration
            var direction = document.querySelector(that.hash);   // find element with specyfic #hash
                direction = direction.offsetTop;                 // and check his offset

            that.addEventListener('click', function(event) {
                portfolio.removeGalleryLayer();
                portfolio.setHash(that);
                portfolio.scrollTo(direction, s.scrollTime);

                event.stopPropagation();
                event.preventDefault();     // preventing flickering after click
            });
        });

        [].forEach.call(s.projectList, function(that) {
            that.addEventListener('click', function(event){
                document.documentElement.classList.add("presentation");

                event.preventDefault();
            }, false);
        });
    },
    // setters
    setHash: function(that) {
        [].forEach.call(s.navList, function(that) {
            that.classList.remove("active");        // Remove '.active' from every nav position
        });

        that.classList.add("active");
        if(history.pushState) {
            history.pushState(null, null, that.hash);
        } else { /* fallback */
            location.hash = that.hash;
        }
    },
    createGalleryNav: function() {
        // create 'close' element
        var closeGalleryEl = document.createElement('a'),
            nextGalleryEl = closeGalleryEl.cloneNode(),
            prevGalleryEl = closeGalleryEl.cloneNode();

        closeGalleryEl.classList.add('close-button');
        nextGalleryEl.classList.add('next-button');
        prevGalleryEl.classList.add('prev-button');


        s.galleryEl.appendChild(nextGalleryEl);
        s.galleryEl.appendChild(prevGalleryEl);
        s.galleryEl.appendChild(closeGalleryEl);

         // add new events
        closeGalleryEl.addEventListener('click', portfolio.removeGalleryLayer, false);
        nextGalleryEl.addEventListener('click', portfolio.slideNext, false);
        prevGalleryEl.addEventListener('click', portfolio.slidePrev, false);
    },
    removeGalleryLayer: function() {
        if( document.documentElement.classList.contains('presentation') ) {
            document.documentElement.classList.remove("presentation");
        }
        console.log('gallery layer');
    },
    slideNext: function() {
        var current = document.querySelector('img.current'),
            next = document.querySelector('img.next');

            if(next) {
                current.classList.remove('current');
                current.classList.add('prev');

                next.classList.remove('next');
                next.classList.add('current');
            }
    },
    slidePrev: function() {
        var current = document.querySelector('img.current'),
            prev = document.querySelector('img.prev');

            if(prev) {
                current.classList.remove('current');
                current.classList.add('next');

                prev.classList.remove('prev');
                prev.classList.add('current');
            }
    },
    scrollTo: function(to, duration) {
            // element = document.body for Chrome, and document.documentElement for firefox
            // if element.scrollTop = 0, chrome will use document.documentElement anyway :/
        var element = (document.body.scrollTop) ? document.body : document.documentElement;

        var start = element.scrollTop,
            difference = to - start,
            currentRotation = 0,
            increment = 10;

        var animateScroll = function() {
            currentRotation += increment;
            var val = Math.easeInOutQuad(currentRotation, start, difference, duration);

            // hardfix for chrome & firefox
            document.body.scrollTop = val;
            document.documentElement.scrollTop = val;

            if(currentRotation <= duration) {
                setTimeout(animateScroll, increment);
            }
        };

        animateScroll();
    }
};

document.addEventListener('DOMContentLoaded', portfolio.init, false);