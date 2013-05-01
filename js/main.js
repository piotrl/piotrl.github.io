var portfolio = {
    elements: {
        nav: document.querySelectorAll('.navigate nav a')
    },
    init: function() {
        Math.easeInOutQuad = function (t, b, c, d) {
            // https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
            // t: current time, b: begInnIng value, c: change In value, d: duration
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

        portfolio.bindUIActions();
    },
    events: {
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
            }

            animateScroll();
        },
    },
    bindUIActions: function(forEach) {
        [].forEach.call(portfolio.elements.nav, function(that) { // that: Node Element of actual iteration
            var direction = document.querySelector(that.hash);   // find element with specyfic #hash
                direction = direction.offsetTop;                 // and check his offset

            that.addEventListener('click', function(event) {
                [].forEach.call(portfolio.elements.nav, function(that) {
                    that.classList.remove("active");        // Remove '.active' from every nav position
                });

                that.classList.add("active");

                portfolio.events.scrollTo(direction, 1000);
                event.stopPropagation();
                event.preventDefault();     // preventing flickering after click
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', portfolio.init, false);