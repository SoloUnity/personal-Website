document.addEventListener('fragmentsLoaded', () => {
  console.log('fragmentsLoaded event received.'); // Check if listener runs

  // Mask application
  function setupHorizontalScroll(elementId) {
      const scrollElement = document.querySelector(elementId);
      // Ensure element exists before adding listener
      if (scrollElement) {
          scrollElement.addEventListener("scroll", () => {
              const isAtEnd = scrollElement.scrollLeft >= scrollElement.scrollWidth - scrollElement.clientWidth;
              const isAtStart = scrollElement.scrollLeft === 0;

              scrollElement.classList.toggle('maskedStart', isAtEnd);
              scrollElement.classList.toggle('masked', !isAtEnd && !isAtStart);
          });
      } else {
          console.error(`Element with ID ${elementId} not found for horizontal scroll setup.`);
      }
  }

  // Apply the setup to both elements
  setupHorizontalScroll("#projectsScrollport");
  setupHorizontalScroll("#vscScrollport");

  // Button scrolling
  const setupScrollport = (scrollportId, leftButtonClass, rightButtonClass, itemSelector, leftPadding = 0) => {
    const scrollport = document.getElementById(scrollportId);
    const leftButtonElement = document.querySelector(`.${leftButtonClass}`);
    const rightButtonElement = document.querySelector(`.${rightButtonClass}`);

    // Ensure elements exist before proceeding
    if (!scrollport || !leftButtonElement || !rightButtonElement) {
        console.error(`Required elements not found for scrollport setup: ${scrollportId}`);
        return;
    }

    const leftButton = leftButtonElement.closest('button');
    const rightButton = rightButtonElement.closest('button');
    const items = Array.from(scrollport.querySelectorAll(itemSelector));

    if (!leftButton || !rightButton || items.length === 0) {
        console.error(`Button or items missing for scrollport setup: ${scrollportId}`);
        return; // Exit if essential elements are missing
    }

    let currentIndex = 0;
    let initialScrollWidth;

    const initializeScrollWidth = () => {
      if (!initialScrollWidth && scrollport.scrollWidth > 0) { // Ensure scrollWidth is calculated
        initialScrollWidth = scrollport.scrollWidth;
      //   console.log('Initial scroll width set:', initialScrollWidth);
      }
    };

    const updateButtonState = () => {
      initializeScrollWidth();
      // Check if initialScrollWidth is valid before proceeding
      if (!initialScrollWidth) return;

      const currentScrollLeft = scrollport.scrollLeft;
      const maxScroll = scrollport.scrollWidth - scrollport.clientWidth;

      // Update currentIndex based on scroll position
      // Avoid division by zero if scrollWidth hasn't been properly calculated yet or if there are no items
       if (initialScrollWidth > 0 && items.length > 0) {
           const itemWidth = initialScrollWidth / items.length;
           currentIndex = Math.round(currentScrollLeft / itemWidth);
       } else {
           currentIndex = 0; // Default to 0 if calculation isn't possible
       }
      // console.log('currentScrollLeft',currentScrollLeft)
      // console.log('(scrollport.scrollWidth / items.length)',(scrollport.scrollWidth / items.length))
      // console.log('scrollport.scrollWidth',scrollport.scrollWidth)
      // console.log('items.length',items.length)
      // console.log('currentIndex',currentIndex)


      leftButton.disabled = currentScrollLeft <= 0;
      // Use a small tolerance for floating point comparison
      rightButton.disabled = Math.abs(currentScrollLeft - maxScroll) < 1;
      leftButton.classList.toggle('disabled', leftButton.disabled);
      rightButton.classList.toggle('disabled', rightButton.disabled);
    };

    function scrollToNextItem(direction) {
      initializeScrollWidth();
       // Check if initialScrollWidth is valid before proceeding
       if (!initialScrollWidth || items.length === 0) return;

      if (direction === 'right' && currentIndex < items.length - 1) {
        currentIndex++;
      } else if (direction === 'left' && currentIndex > 0) {
          currentIndex--;
      }

      let targetScroll;
      const itemWidth = initialScrollWidth / items.length; // Calculate item width based on initial width

      if (currentIndex === 0) {
          targetScroll = 0; // Scroll to the start
      } else if (currentIndex === items.length - 1) {
          targetScroll = scrollport.scrollWidth - scrollport.clientWidth; // Scroll to the end
      } else {
          // Calculate target based on item width and index, adjusting for padding
          targetScroll = itemWidth * currentIndex - leftPadding;
      }

      scrollport.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }

    // Initial button state setup
    leftButton.disabled = true;
    leftButton.classList.add('disabled');
    // Call updateButtonState initially in case content is already scrollable
    requestAnimationFrame(updateButtonState);


    leftButton.addEventListener('click', () => {
      scrollToNextItem('left');
    });

    rightButton.addEventListener('click', () => {
      scrollToNextItem('right');
    });

    scrollport.addEventListener('scroll', updateButtonState);

    // Re-calculate and update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initialScrollWidth = null; // Reset initial width to recalculate
            initializeScrollWidth();
            updateButtonState();
        }, 250); // Debounce resize event
    });
  };

  // Setup for projectsScrollport with 40px left padding
  setupScrollport('projectsScrollport', 'left1', 'right1', '.projColSm', 40);

  // Setup for vscScrollport with 10px left padding
  setupScrollport('vscScrollport', 'left2', 'right2', '.vscImage', 10);

  // Scroll Animations - Delay setup slightly
  requestAnimationFrame(() => {
    console.log('Setting up IntersectionObservers inside requestAnimationFrame...'); // Check if setup starts

    // *** START DEBUG LOGGING ***
    const aboutContainer = document.getElementById('include-about');
    if (aboutContainer) {
        // Find the specific column for "A Bit More"
        // Assuming it's the second .default-col within #include-about
        const aBitMoreCol = aboutContainer.querySelector('.row > .default-col:nth-child(2)'); 
        if (aBitMoreCol) {
            console.log('Checking "A Bit More" column before observing:', {
                element: aBitMoreCol,
                offsetHeight: aBitMoreCol.offsetHeight,
                offsetWidth: aBitMoreCol.offsetWidth,
                boundingClientRect: aBitMoreCol.getBoundingClientRect(),
                classList: aBitMoreCol.classList.toString()
            });
        } else {
            console.log('Could not find the "A Bit More" column element for debugging.');
        }
    } else {
        console.log('Could not find the #include-about container for debugging.');
    }
    // *** END DEBUG LOGGING ***

    // SlideY
    const observerSlideY = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            console.log('SlideY Intersection:', entry.isIntersecting, entry.target); // Check intersection callback
            if (entry.isIntersecting) {
                entry.target.classList.add("showSlideY");
                observerSlideY.unobserve(entry.target); // Optional: stop observing once shown
            }
        });
    });

    // Blur
    const observerBlur = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            console.log('Blur Intersection:', entry.isIntersecting, entry.target); // Check intersection callback
            if (entry.isIntersecting) {
                entry.target.classList.add("showBlur");
                observerBlur.unobserve(entry.target); // Optional: stop observing once shown
            }
        });
    });

    // SlideX
    const observerSlideX = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          console.log('SlideX Intersection:', entry.isIntersecting, entry.target); // Check intersection callback
          if (entry.isIntersecting) {
            entry.target.classList.add("showSlideX");

            // Staggered animation timing (revert to old behavior)
            if (entry.target.classList.contains("staggerProject")) {
                const childNumber = Array.from(entry.target.parentNode.children)
                                          .indexOf(entry.target);
                let delay;
                switch (childNumber) {
                    case 1:
                        delay = 1200; 
                        break;
                    case 2:
                        delay = 2000;  
                        break;
                    case 3:
                        delay = 2800; 
                        break;
                    default:
                        delay = 0;   
                }
                setTimeout(() => {
                    entry.target.classList.remove("staggerProject");
                    entry.target.classList.add("hoverable");
                }, delay);

            } else if (entry.target.classList.contains("staggerHobby")) {
                const childNumber = Array.from(entry.target.parentNode.children)
                                          .indexOf(entry.target);
                if (childNumber === 0) {
                    setTimeout(() => {
                        entry.target.classList.remove("staggerHobby");
                    }, 1200);
                }
            }

            observerSlideX.unobserve(entry.target); // Optional: stop observing once shown
          }
        });
      }, { threshold: 0.01 }); // Trigger when 1% is visible

    // Observe elements after fragments are loaded and layout is stable
    console.log('Querying for elements to observe...');
    const hiddenSlideY = document.querySelectorAll(".hiddenSlideY");
    const hiddenBlur = document.querySelectorAll(".hiddenBlur");
    const hiddenSlideX = document.querySelectorAll(".hiddenSlideX");

    console.log(`Found ${hiddenSlideY.length} hiddenSlideY elements.`);
    console.log(`Found ${hiddenBlur.length} hiddenBlur elements.`);
    console.log(`Found ${hiddenSlideX.length} hiddenSlideX elements.`);

    hiddenSlideY.forEach(el => {
        console.log('Observing SlideY:', el); // Check which elements are observed
        observerSlideY.observe(el);
    });
    hiddenBlur.forEach(el => {
        console.log('Observing Blur:', el); // Check which elements are observed
        observerBlur.observe(el);
    });
    hiddenSlideX.forEach(el => {
        console.log('Observing SlideX:', el); // Check which elements are observed
        observerSlideX.observe(el);
    });

    console.log('Observer setup complete.');
  }); // End of requestAnimationFrame

}); // End of fragmentsLoaded listener

// Keep video pausing logic outside the listener as it doesn't depend on fragments
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