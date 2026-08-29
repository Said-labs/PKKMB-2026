```javascript
/* ==================================================
   SA'ID AZIZ
   INTRODUCE MYSELF
   JAVASCRIPT
================================================== */


/* ==================================================
   SCROLL REVEAL
================================================== */

const revealElements = document.querySelectorAll(
    ".video-section, .about-video, .profile-strip, .final-section"
);


const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach((element) => {

    revealObserver.observe(element);

});



/* ==================================================
   SMOOTH SCROLL
================================================== */

const scrollIndicator =
    document.querySelector(".scroll-indicator");


if (scrollIndicator) {

    scrollIndicator.addEventListener("click", () => {

        const videoSection =
            document.querySelector(".video-section");


        if (videoSection) {

            videoSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}



/* ==================================================
   DOCUMENT CARD PARALLAX
================================================== */

const documentCard =
    document.querySelector(".document-card");


if (documentCard && window.innerWidth > 900) {

    document.addEventListener("mousemove", (event) => {

        const x =
            (window.innerWidth / 2 - event.clientX) / 70;

        const y =
            (window.innerHeight / 2 - event.clientY) / 70;


        documentCard.style.transform =
            `rotate(2deg) translate(${x}px, ${y}px)`;

    });

}



/* ==================================================
   VIDEO FRAME HOVER
================================================== */

const videoFrame =
    document.querySelector(".video-frame");


if (videoFrame) {

    videoFrame.addEventListener("mouseenter", () => {

        videoFrame.classList.add("video-hover");

    });


    videoFrame.addEventListener("mouseleave", () => {

        videoFrame.classList.remove("video-hover");

    });

}



/* ==================================================
   CURRENT YEAR
================================================== */

const footerYear =
    document.querySelector(".footer");


if (footerYear) {

    /*
     * Tidak mengubah isi footer secara otomatis.
     * Bagian tahun tetap mengikuti tahun website.
     */

}



/* ==================================================
   DISABLE RIGHT CLICK
   OPTIONAL
================================================== */

/*
document.addEventListener("contextmenu", (event) => {

    event.preventDefault();

});
*/


/* ==================================================
   CONSOLE MESSAGE
================================================== */

console.log(
    "%cSA'ID AZIZ — PERSONAL ARCHIVE",
    "font-size: 16px; font-weight: bold;"
);

console.log(
    "Introduce Myself · 2026"
);
```
