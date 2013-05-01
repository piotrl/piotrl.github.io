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

        var forEach = Array.prototype.forEach; // forEach for NodeLists

        portfolio.bindUIActions(forEach);
    },
    events: {
        scrollTo: function(to, duration) {
                // use document.body for Chrome, and document.documentElement for firefox
                // It depends on element.scrollTop value.
            var element = (document.body.scrollTop) ? document.body : document.documentElement;

            var start = element.scrollTop,
                difference = to - start,
                currentRotation = 0,
                increment = 20;

            var animateScroll = function() {
                currentRotation += increment;
                var val = Math.easeInOutQuad(currentRotation, start, difference, duration);
                element.scrollTop = val;

                // console.log("if: " + currentRotation + " < " + duration);
                console.log(element + ".scrollTop: " + val);
                if(currentRotation <= duration) {
                    setTimeout(animateScroll, increment);
                }
            }

            animateScroll();
        },
    },
    bindUIActions: function(forEach) {
        forEach.call(portfolio.elements.nav, function(that) { // that: Node Element of actual iteration
            var direction = document.querySelector(that.hash).offsetTop; // find element and check his offset
            console.log(that + ": " + direction);

            that.addEventListener('click', function(event) {
                that.classList.add("active");

                portfolio.events.scrollTo(direction, 1000);
                event.stopPropagation();
                event.preventDefault();     // preventing flicker after click
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', portfolio.init, false);