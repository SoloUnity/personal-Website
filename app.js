// Horizontal Scrolling
const scrollContainer = document.querySelector(".scrollport");
scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();

    // Check if it's a horizontal scroll event
    if (evt.deltaX !== 0) {
        scrollContainer.scrollLeft += evt.deltaX;
    } else {
        scrollContainer.scrollLeft += evt.deltaY;
    }
});

// Scroll Animations
//SlideY
const observerSlideY = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("showSlideY");
        }
    });
});
const hiddenElementsSlideY = document.querySelectorAll(".hiddenSlideY");

// Blur
const observerBlur = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("showBlur");
        }
    });
});

// SlideX
const observerSlideX = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("showSlideX");
        }
    });
});

// Observe
hiddenElementsSlideY.forEach((element) => {
    observerSlideY.observe(element);
});
const hiddenElementsBlur = document.querySelectorAll(".hiddenBlur");
hiddenElementsBlur.forEach((element) => {
    observerBlur.observe(element);
});
const hiddenElementsSlideX = document.querySelectorAll(".hiddenSlideX");
hiddenElementsSlideX.forEach((element) => {
    observerSlideX.observe(element);
});


