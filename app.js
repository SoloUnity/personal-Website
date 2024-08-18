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
      let initialScrollWidth;
  
      const initializeScrollWidth = () => {
        if (!initialScrollWidth) {
          initialScrollWidth = scrollport.scrollWidth;
        //   console.log('Initial scroll width set:', initialScrollWidth);
        }
      };

      const updateButtonState = () => {
        initializeScrollWidth();
        const currentScrollLeft = scrollport.scrollLeft;
        const maxScroll = scrollport.scrollWidth - scrollport.clientWidth;
  
        // Update currentIndex based on scroll position
        currentIndex = Math.round(currentScrollLeft / (initialScrollWidth / items.length));
        // console.log('currentScrollLeft',currentScrollLeft)
        // console.log('(scrollport.scrollWidth / items.length)',(scrollport.scrollWidth / items.length))
        // console.log('scrollport.scrollWidth',scrollport.scrollWidth)
        // console.log('items.length',items.length)
        // console.log('currentIndex',currentIndex)

  
        leftButton.disabled = currentScrollLeft <= 0;
        rightButton.disabled = Math.abs(currentScrollLeft - maxScroll) < 1;
        leftButton.classList.toggle('disabled', leftButton.disabled);
        rightButton.classList.toggle('disabled', rightButton.disabled);
      };
  
      function scrollToNextItem(direction) {
        initializeScrollWidth();
        if (direction === 'right' && currentIndex < items.length - 1) {
          currentIndex++;
        } else if (direction === 'left' && currentIndex > 0) {
            currentIndex--;
        }
    
        let targetScroll;
        if (currentIndex === 0) {
            targetScroll = 0; // Scroll to the start
        } else if (currentIndex === items.length - 1) {
            targetScroll = scrollport.scrollWidth - scrollport.clientWidth; // Scroll to the end
        } else {
            targetScroll = (scrollport.scrollWidth / items.length) * currentIndex - leftPadding;
        }
  
        scrollport.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
  
      // Initial button state setup
      leftButton.disabled = true;
      leftButton.classList.add('disabled');
  
      leftButton.addEventListener('click', () => {
        scrollToNextItem('left');
      });
  
      rightButton.addEventListener('click', () => {
        scrollToNextItem('right');
      });
  
      scrollport.addEventListener('scroll', updateButtonState);
    };
  
    // Setup for projectsScrollport with 0px left padding
    setupScrollport('projectsScrollport', 'left1', 'right1', '.projColSm', 40);
  
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
        
        if (entry.target.classList.contains("staggerProject")) {
          const childNumber = Array.from(entry.target.parentNode.children).indexOf(entry.target);
          let delay;
          switch (childNumber) {
            case 1:
              delay = 1200; // Delay for the second staggerProject
              break;
            case 2:
              delay = 2000; // Delay for the third staggerProject
              break;
            case 3:
                delay = 2800; // Delay for the third staggerProject
                break;
            default:
              delay = 0; // No delay for other children
              break;
          }
          setTimeout(() => {
            entry.target.classList.remove("staggerProject");
            entry.target.classList.add("hoverable");
          }, delay);
        } 
        
        else if (entry.target.classList.contains("staggerHobby")) {
          const childNumber = Array.from(entry.target.parentNode.children).indexOf(entry.target);
          if (childNumber === 0) {
            setTimeout(() => {
              entry.target.classList.remove("staggerHobby");
            }, 1200);
          }
        }
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