// Mask application
function setupHorizontalScroll(elementId) {
    const scrollElement = document.querySelector(elementId);
    scrollElement.addEventListener("scroll", () => {
        const isAtEnd = scrollElement.scrollLeft >= scrollElement.scrollWidth - scrollElement.clientWidth;
        const isAtStart = scrollElement.scrollLeft === 0;

        scrollElement.classList.toggle('maskedStart', isAtEnd);
        scrollElement.classList.toggle('masked', !isAtEnd && !isAtStart);
    });
}

// Apply the setup to both elements
setupHorizontalScroll("#projectsScrollport");
setupHorizontalScroll("#vscScrollport");

// Button scrolling
document.addEventListener('DOMContentLoaded', () => {
    const setupScrollport = (scrollportId, leftButtonClass, rightButtonClass, itemSelector, leftPadding = 0) => {
      const scrollport = document.getElementById(scrollportId);
      const leftButton = document.querySelector(`.${leftButtonClass}`).closest('button');
      const rightButton = document.querySelector(`.${rightButtonClass}`).closest('button');
      const items = Array.from(scrollport.querySelectorAll(itemSelector));
      let currentIndex = 0;
  
      const updateButtonState = () => {
        const currentScrollLeft = scrollport.scrollLeft;
        const maxScroll = scrollport.scrollWidth - scrollport.clientWidth;
        
        // Determine current index based on scroll position
        currentIndex = items.findIndex(item => item.offsetLeft >= currentScrollLeft);
        if (currentIndex === -1) currentIndex = items.length - 1;
  
        leftButton.disabled = currentScrollLeft <= 0;
        rightButton.disabled = Math.abs(currentScrollLeft - maxScroll) < 1;
        leftButton.classList.toggle('disabled', leftButton.disabled);
        rightButton.classList.toggle('disabled', rightButton.disabled);
      };
  
      function scrollToNextItem(direction) {
        if (direction === 'right' && currentIndex < items.length - 1) {
          currentIndex++;
        } else if (direction === 'left' && currentIndex > 0) {
          currentIndex--;
        }
        
        let targetScroll;
        if (currentIndex === 0) {
          targetScroll = 0; // Scroll all the way to the start
        } else if (currentIndex === items.length - 1) {
          targetScroll = scrollport.scrollWidth - scrollport.clientWidth; // Scroll all the way to the end
        } else {
          targetScroll = Math.max(0, items[currentIndex].offsetLeft - leftPadding);
        }
        
        scrollport.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
  
      // Initial button state setup
      leftButton.disabled = true;
      leftButton.classList.add('disabled');
      rightButton.disabled = false;
      rightButton.classList.remove('disabled');
  
      leftButton.addEventListener('click', () => {
        scrollToNextItem('left');
        setTimeout(updateButtonState, 500); // Update after scroll animation
      });
  
      rightButton.addEventListener('click', () => {
        scrollToNextItem('right');
        setTimeout(updateButtonState, 500); // Update after scroll animation
      });
  
      scrollport.addEventListener('scroll', updateButtonState);
    };
  
    // Setup for projectsScrollport with 20px left padding
    setupScrollport('projectsScrollport', 'left1', 'right1', '.col-11', 0);
  
    // Setup for vscScrollport with 10px left padding
    setupScrollport('vscScrollport', 'left2', 'right2', '.vscImage', 10);
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