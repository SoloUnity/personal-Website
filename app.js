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
const hiddenElementsSlideY = document.querySelectorAll(".hiddenSlideY");
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

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        pauseAllVideos();
    }
});

function pauseAllVideos() {
    var videos = document.querySelectorAll("video");
    videos.forEach(function(video) {
        if (!video.paused) {
            video.pause();
        }
    });
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        pauseVideo();
    }
});