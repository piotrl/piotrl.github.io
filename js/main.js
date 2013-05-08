var s,
portfolio = {
    settings: {
        navList: document.querySelectorAll('.navigate nav a'),
        sectionList: document.querySelectorAll('section.content'),
        projectList: document.querySelectorAll('section.works a.thumb'),
        galleryEl: document.getElementById('presentation'),
        scrollTime: 500,
        ignoreHashChange: false,
        fileNames: null,
        currentGallery: null
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

        portfolio.onLoad();
        portfolio.bindUIActions();
        portfolio.createGalleryNav();
    },
    bindUIActions: function() {
        document.addEventListener('scroll', portfolio.setSection, false);

        [].forEach.call(s.navList, function(that) {   // that: Node Element of actual iteration
            var direction = document.querySelector(that.hash);   // find element with specyfic #hash
                direction = direction.offsetTop;                 // and check his offset

            that.addEventListener('click', function(event) {
                portfolio.removeGalleryLayer();
                portfolio.scrollTo(direction, s.scrollTime);

                s.ignoreHashChange = true;
                portfolio.setHash(that.hash);

                event.stopPropagation();
                event.preventDefault();     // preventing flickering after click
            });
        });

        [].forEach.call(s.projectList, function(that) {
            that.addEventListener('click', function(event){
                var idGallery = that.hash.replace('#', '');

                portfolio.enableGalleryLayer(idGallery);
                document.documentElement.classList.add("presentation");

                event.preventDefault();
            }, false);
        });
    },
    // setters
    setHash: function(hash) {
        [].forEach.call(s.navList, function(that) {
            // Reset style of every nav element
            that.classList.remove("active");
        });

        hash = hash.replace('#', '');

        // change nav element styles
        var navEl = document.querySelector("nav a[href*='#"+hash+"']");
        if(navEl) {
            navEl.classList.add("active");
        }

        // set hash in adress
        if(history.pushState && location.hash !== '#!/' + hash ) {
            history.pushState(null, null, '#!/' + hash);
        }
    },
    setSection: function() {
        // check offsets of all sections

        for(var i = 0; i < s.sectionList.length; i++) {
            var elOffsetTop = s.sectionList[i].offsetTop,
                elOffsetBottom = parseInt(elOffsetTop + s.sectionList[i].offsetHeight, 10);
                // console.info(window.scrollY + " ↓ " + elOffsetTop + " ↓↓ " + elOffsetBottom);
            if(window.scrollY >= elOffsetTop && window.scrollY <= elOffsetBottom) {
                if(s.ignoreHashChange === false) {
                    portfolio.setHash(s.sectionList[i].id);
                }
            }
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
    enableGalleryLayer: function(id) {
        s.ignoreHashChange = true;
        s.currentGallery = id;

        var imageList = document.querySelector('section.slides #' + id);
        if(!imageList) {
            portfolio.createGalleryLayer(id);
        }

        // check one more time
        imageList = document.querySelector('section.slides #' + id);
        imageList.classList.remove('invisible');

        portfolio.checkNavDisplays();

        portfolio.setHash( 'presentation/' + id );
    },
    createGalleryLayer: function(id) {
        var galleryLayer = s.galleryEl;

        var imgCaption = document.createElement('div');
            imgCaption.classList.add('caption');
            imgCaption.classList.add('invisible');
            imgCaption.id = id;

        // s.fileNames imported from HTML file

        for(var i = 0; i < s.fileNames[id].length; i++) {
            var slide = document.createElement('img');
            slide.src = "./img/portfolio/" + id + '/' + s.fileNames[id][i]; // URL PATH

            if(i === 0) slide.classList.add('current');
            else slide.classList.add('next');

            imgCaption.appendChild(slide);
        }

        galleryLayer.appendChild(imgCaption);
    },
    removeGalleryLayer: function() {
        document.documentElement.classList.remove("presentation"); // remove .presentation from <html>

        var imageList = document.querySelectorAll('section.slides .caption');
        console.log(imageList);

        [].forEach.call(imageList, function(that) {
            that.classList.add('invisible');
        });

        s.ignoreHashChange = false;
        portfolio.setSection();
    },
    checkNavDisplays: function() {
        // img elements
        var imgPath = '#' + s.currentGallery + ' img',
            current = document.querySelector(imgPath + '.current'),
            next = document.querySelectorAll(imgPath + '.next'),
            prev = document.querySelectorAll(imgPath + '.prev');
            console.log(imgPath);
        // controll buttons elements
        var buttonNext = document.querySelector('a.next-button'),
            buttonPrev = document.querySelector('a.prev-button');

        var imgCount = 1 + next.length + prev.length; // 1 is for one current element

        console.log('ilosc obrazow w galerii: ' + imgCount);

        if( next.length === 0 ) {
            buttonNext.classList.add('invisible');
        } else {
            buttonNext.classList.remove('invisible');
        }

        if( prev.length === 0 ) {
            buttonPrev.classList.add('invisible');
        } else {
            buttonPrev.classList.remove('invisible');
        }
    },
    slideNext: function(button) {

        var current = document.querySelector('img.current'),
            next = document.querySelectorAll('img.next');

            if(next.length > 0) {
                current.classList.remove('current');
                current.classList.add('prev');

                next[0].classList.remove('next');
                next[0].classList.add('current');
                console.log(next.length);
            }

            portfolio.checkNavDisplays();
    },
    slidePrev: function(button) {
        var current = document.querySelector('img.current'),
            prev = document.querySelectorAll('img.prev');

            if(prev) {
                current.classList.remove('current');
                current.classList.add('next');

                prev[0].classList.remove('prev');
                prev[0].classList.add('current');
            }

            portfolio.checkNavDisplays();
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
            } else {
                    s.ignoreHashChange = false; // last scroll, you can change hash now!
            }
        };
        animateScroll();
    },
    onLoad: function() {
        // recognize hash
        if(location.hash.indexOf('#!/') !== -1) {
            // interprets hash - which gallery will be displayed
            var hashAttrs = location.hash.replace('#!/', '').split('/');

            if(hashAttrs >= 2) {
                document.documentElement.classList.add('presentation');
            }

        } else {
            portfolio.setSection();
        }
    }
};

document.addEventListener('DOMContentLoaded', portfolio.init, false);