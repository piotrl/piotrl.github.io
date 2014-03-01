(function() {
'use strict';

var s,
portfolio = {
	settings: {
		navList: document.querySelectorAll('.navigate nav a'),
		sectionList: document.querySelectorAll('section.content'),
		projectList: document.querySelectorAll('section.works a.thumb, section.works h2 a'),
		galleryEl: document.getElementById('portfolio'),
		scrollTime: 500,
		ignoreHashChange: false,
		fileNames: null,    // imported from index.html
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

		portfolio.bindUIActions();
		portfolio.createGalleryNav();
		portfolio.onLoad();
	},
	bindUIActions: function() {
		// SCROLL ACTIONS
		document.addEventListener('scroll', portfolio.setSection, false);

		// KEY ACTIONS
		document.addEventListener('keydown', portfolio.keyActions, false);

		// NAV MENU ACTIONS
		[].forEach.call(s.navList, function(that) {             // that: Node Element of actual iteration
			var direction = document.querySelector(that.hash);  // find element with specific #hash
				direction = direction.offsetTop;                // and check his offset

			that.addEventListener('click', function(event) {
				portfolio.removeGalleryLayer();
				portfolio.scrollTo(direction, s.scrollTime);

				s.ignoreHashChange = true;
				portfolio.setHash(that.hash);

				event.stopPropagation();
				event.preventDefault();     // preventing flickering after click
			});
		});

		// CLICKING ON IMAGE -> ENABLING GALLERY ACTION
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

		// change navigation element styles
		var navEl = document.querySelector("nav a[href*='#"+hash+"']");
		if(navEl) {
			navEl.classList.add("active");
		}

		// set hash in address
		if(history.pushState && location.hash !== '#!/' + hash ) {
			history.pushState(null, null, '#!/' + hash);
		}
	},
	setSection: function() {
		// check offsets of all sections

		if( s.currentGallery === null ) {
			[].forEach.call(s.sectionList, function(that) {
				var elOffsetTop = that.offsetTop,
					elOffsetBottom = parseInt(elOffsetTop + that.offsetHeight, 10);
					// console.info(window.scrollY + " | " + elOffsetTop + " || " + elOffsetBottom);
				if(window.scrollY >= elOffsetTop && window.scrollY <= elOffsetBottom) {
					if(s.ignoreHashChange === false) {
						portfolio.setHash(that.id);
					}
				}
			});
		}
	},
	createGalleryNav: function() {
		// create gallery nav elements
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
		nextGalleryEl.addEventListener('click', portfolio.slideTo, false);
		prevGalleryEl.addEventListener('click', portfolio.slideTo, false);
	},
	enableGalleryLayer: function(id) {
		s.ignoreHashChange = true;
		s.currentGallery = id;
		s.galleryEl.style.top = window.scrollY + 'px';

		var imageList = document.getElementById(id);

		if(!imageList) {
			portfolio.createGalleryLayer(id);
		}

		// check one more time
		imageList = document.getElementById(id);
		imageList.classList.remove('invisible');

		portfolio.checkNavDisplays();

		portfolio.setHash( 'works/' + id );
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

			if(i === 0) {
				slide.classList.add('current');
			}	else {
				slide.classList.add('next');
			}

			imgCaption.appendChild(slide);
		}

		galleryLayer.appendChild(imgCaption);
	},
	removeGalleryLayer: function() {
		document.documentElement.classList.remove("presentation"); // remove .presentation from <html>

		var imageList = document.querySelectorAll('section.slides .caption');

		[].forEach.call(imageList, function(that) {
			that.classList.add('invisible');
		});

		s.currentGallery = null;
		s.ignoreHashChange = false;
		portfolio.setSection();
	},
	checkNavDisplays: function() {
		// image elements
		var imgPath = '#' + s.currentGallery + ' img',
			next = document.querySelectorAll(imgPath + '.next'),
			prev = document.querySelectorAll(imgPath + '.prev');
		// control buttons elements
		var buttonNext = document.querySelector('a.next-button'),
			buttonPrev = document.querySelector('a.prev-button');

		if( next.length === 0 ) {
			buttonNext.classList.add('disabled');
		} else {
			buttonNext.classList.remove('disabled');
		}

		if( prev.length === 0 ) {
			buttonPrev.classList.add('disabled');
		} else {
			buttonPrev.classList.remove('disabled');
		}
	},
	slideTo: function(way) {

		// Always keep up with elements classes
		var current = document.querySelector('#' + s.currentGallery + ' img.current'),
			next = document.querySelectorAll('#' + s.currentGallery + ' img.next'),
			prev = document.querySelectorAll('#' + s.currentGallery + ' img.prev');

		// way.target is control button
		// which contain class 'next-button' or 'prev-button'
		// so I will use that to specify where slides should go
		var elements = ( way.target.classList.contains('next-button') ) ? next : prev;
			current.classList.remove('current');

			if(elements === next && next.length > 0) {
				current.classList.add('prev');
				elements[0].classList.remove('next');
				elements[0].classList.add('current');
			}
			else if(elements === prev && prev.length > 0) {
				var lastPrev = elements.length-1; // index of last previous image
				current.classList.add('next');
				elements[lastPrev].classList.remove('prev');
				elements[lastPrev].classList.add('current');
			}
			else {
				current.classList.add('current');
			}

			portfolio.checkNavDisplays(); // check if we can see specific control buttons
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

			// hard-fix for Chrome & Firefox
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
	keyActions: function(event) {
			if(s.currentGallery !== null) {
				var simulate = {};
				if( event.keyCode === 27 ) {
					portfolio.removeGalleryLayer();
				}

				if( event.keyCode === 39 ) {
					simulate.target = document.querySelector('.next-button');

					portfolio.slideTo(simulate);
					portfolio.checkNavDisplays();
				}

				if( event.keyCode === 37 ) {
					simulate.target = document.querySelector('.prev-button');

					portfolio.slideTo(simulate);
					portfolio.checkNavDisplays();
				}
			}
	},
	onLoad: function() {
		// recognize hash
		if(location.hash.indexOf('#!/') !== -1) {
			// interprets hash - which gallery will be displayed
			var hashAttrs = location.hash.replace('#!/', '').split('/');

			if(hashAttrs.length >= 2) {
				document.documentElement.classList.add('presentation');
				portfolio.enableGalleryLayer(hashAttrs[1]);
			} else {
				var direction = document.getElementById( hashAttrs[0] ).offsetTop;
				portfolio.scrollTo( direction, s.scrollTime );

				portfolio.setHash(hashAttrs[0]);
			}
		}
	}
};

// EVERYTHING BEGIN HERE
document.addEventListener('DOMContentLoaded', portfolio.init, false);
		
})();