const customBlockIsVisibleEvent = "block";
const customBlockIsNotVisibleEvent = "show";

// Store reference to current top and bottom banners
let botBannElement;
let topBannElement;

// check if top banner is active
const topBannerExists = () => {
    if (document.querySelector('.top-banner')) {
        topBannElement = document.querySelector('.top-banner');
        return true;
    }
    return false
}
// check if bottom banner is active
const bottomBannerExists = () => {
    if (document.querySelector('.bottom-banner')) {
        botBannElement = document.querySelector('.bottom-banner');
        return true;
    }
    return false
}

/////////////////// class //////////////////
class StickyBanner {
    constructor(html, { position = 'top', hideEnabled = false }) {
        this.html = html;
        this.config = { position, hideEnabled };
        this.bannerHtmlElm;
        this.renderBanner();
        if (hideEnabled) {
            document.addEventListener(customBlockIsVisibleEvent, () => {
                this.showBanner("none");
            });
            document.addEventListener(customBlockIsNotVisibleEvent, () => {
                this.showBanner("inline-block");
            });
        };
    }

    // position check helper
    checkTopPosition() {
        return this.config.position === 'top';
    }


    /* Removed the element from the DOM. The class instance object itself will be deleted
     automatically by the Garbage Collector once not used anymore */
    destroy() {
        this.bannerHtmlElm.remove();
    }

    //render banner
    renderBanner() {
        let bannerElement = document.createElement("div");
        this.bannerHtmlElm = bannerElement;

        bannerElement.innerHTML = this.html;

        //for style => check position
        if (this.checkTopPosition()) {
            if (topBannerExists()) {
                topBannElement.remove();
            }

            let img = bannerElement.querySelector('img');

            // Normally we would want to randomize or make sure this doesn't overlap with an existing classname on the page
            // to prevent mis-querying and getting elements that aren't our elements.
            bannerElement.className = "top-banner";
            bannerElement.style.position = "fixed";
            bannerElement.style.width = "320px";
            bannerElement.style.height = "50px";
            bannerElement.style.right = "0";
            bannerElement.style.left = "0";
            bannerElement.style.top = "0";

            img.style.width = "320px"
            img.style.height = "50px"

        } else {

            if (bottomBannerExists()) {
                botBannElement.remove();
            }
            let main = document.querySelector('main');
            main.style.marginBottom = "55px"

            let img = bannerElement.querySelector('img');

            bannerElement.className = "bottom-banner";
            bannerElement.style.position = "fixed";
            bannerElement.style.width = "320px";
            bannerElement.style.height = "50px";
            bannerElement.style.right = "0";
            bannerElement.style.left = "0";
            bannerElement.style.bottom = "0";

            img.style.width = "320px"
            img.style.height = "50px"
        }
        document.body.appendChild(bannerElement);
    }

    // change display of banner
    showBanner(display) {
        this.bannerHtmlElm.style.display = display;
        /* notes: CSS display property removes the whole element.Unlike visibility 
        which keeps the space of the element on the document.*/
    }
}
//////////////////// end of class //////////////////////       

/* blocker visibility check: Using the Intersection Obeserver API helps solve
the performance issues that a traditional scroll event listener has */

/* Normally, Check for exsistence of IntersectionObserver (and other APIs) before we try 
and use them. It was mentioned in the instructions to assume we are using a modern browser. */

window.addEventListener('DOMContentLoaded', (event) => {
    const outOfViewEvent = new Event(customBlockIsNotVisibleEvent);
    const inViewEvent = new Event(customBlockIsVisibleEvent);

    let blockElements = document.querySelectorAll('.blocker');

    // Keep track of the visibility of each blocker individually, each blocker is kept track of by corresponding index in this array.
    // 1 - indicates that the blocker at that index is visible, 0 - indicates that that blocker is not visible
    let tracker = [];
    blockElements.forEach((blockElement, i) => {
        let observer = new IntersectionObserver(function (entries) {
            let entry = entries[0];
            if (entry.isIntersecting) {
                tracker[i] = 1;
            } else if (!entry.isIntersecting) {
                tracker[i] = 0;
            }
            if (tracker.every(e => e === 0)) {
                document.dispatchEvent(outOfViewEvent);
            } else {
                document.dispatchEvent(inViewEvent);
            }
        }, { threshold: [0] });
        observer.observe(blockElement);
    })
});
