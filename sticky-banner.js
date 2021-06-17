const customBlockIsVisibleEvent = "block";
const customBlockIsNotVisibleEvent = "show";
let blockerCounter = 0;
/* blocker visibility check helper: Using the Intersection Obeserver API. Browsers came out with not a long time ago 
to solve the performance issues that a traditional scroll event listener has */
class StickyBanner {
    constructor(html, { position = 'top', hideEnabled = false }) {
        this.html = html;
        this.config = { position, hideEnabled };
        this.bannerHtmlElm;
        this.renderBanner();
        if (hideEnabled) {
            document.addEventListener(customBlockIsVisibleEvent, () => {
                this.hideBanner();
            });
            document.addEventListener(customBlockIsNotVisibleEvent, () => {
                this.showBanner();
            });
        };
    }

    // position check helper
    checkTopPosition() {
        if (this.config.position === 'top') {
            return true;
        }
        return false;
    }

    /* removed the element from the DOM. The instance object itself will be deleted
     automatically by the Garbage Collector once not used anymore */

    destroy() {
        this.bannerHtmlElm.remove();
    }

    //render banner
    renderBanner() {
        // check if there is a sticky banner of the same position and destroy
        let bannerElement = document.createElement("div");
        this.bannerHtmlElm = bannerElement;
        let main = document.querySelector('main');

        bannerElement.innerHTML = this.html;

        //for style => check position
        if (this.checkTopPosition()) {
            let img = bannerElement.querySelector('img');

            bannerElement.className = "top-banner";
            bannerElement.style.position = "fixed";
            bannerElement.style.display = "inline-block"
            bannerElement.style.width = "320px";
            bannerElement.style.height = "50px";
            bannerElement.style.right = "0";
            bannerElement.style.top = "0";
            bannerElement.style.left = "0";

            img.style.width = "320px"
            img.style.height = "50px"

        } else {
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
    // hide banner when block appears; 
    // css display property removes the whole element. Unlike visibility that keeps the space of the element on the document.
    hideBanner() {
        this.bannerHtmlElm.style.display = "none";
    }
    // show banner when block disappear
    showBanner() {
        this.bannerHtmlElm.style.display = "inline-block";
    }
}

// check if top banner is active
const topBannerExists = () => {
    if (document.querySelector('.top-banner')) {
        return true;
    }
    return false
}
// check if bottom banner is active
const bottomBannerExists = () => {
    if (document.querySelector('.bottom-banner')) {
        return true;
    }
    return false
}
window.addEventListener('DOMContentLoaded', (event) => {
    let blockElements = document.querySelectorAll('.blocker');
    // console.log(blockElements)
    let observer = new IntersectionObserver(function (entries) {
        // isIntersecting is true when element and viewport are overlapping
        // isIntersecting is false when element and viewport don't overlap
        if (entries[0].isIntersecting) {
            console.log('blocker is visible');
            blockerCounter++;
            console.log(blockerCounter)
            const inViewEvent = new Event(customBlockIsVisibleEvent);
            document.dispatchEvent(inViewEvent);
        } else if (!entries[0].isIntersecting) {
            console.log('blocker is not visible');
            decrement()
            // console.log('dec', blockerCounter)
            if (blockerCounter === 0) {
                const outOfViewEvent = new Event(customBlockIsNotVisibleEvent);
                document.dispatchEvent(outOfViewEvent);
            }

        }
    }, { threshold: [0] });

    blockElements.forEach(blockElement => {
        observer.observe(blockElement);
    })
});

//decrement function
function decrement() {
    if (blockerCounter > 0) {
        blockerCounter = blockerCounter - 1;
    }
}
