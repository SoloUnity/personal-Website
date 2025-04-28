// Function to unload a video source
function unloadVideo(video) {
  if (!video) return;
  video.pause(); // Pause first
  video.removeAttribute('src'); // Remove the src attribute
  video.load(); // Ask the browser to load the (now non-existent) source
}

// Function to load a video source from its source tag
function loadVideo(video) {
  if (!video) return;
  const source = video.querySelector('source');
  if (source && source.getAttribute('src') && !video.getAttribute('src')) {
    video.setAttribute('src', source.getAttribute('src'));
    video.load(); // Ask the browser to load the new source
  }
}

document.addEventListener("fragmentsLoaded", () => {

  // Lazy loading for images and videos
  document.querySelectorAll("img").forEach(img => {
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
  });
  document.querySelectorAll("video").forEach(video => {
    video.setAttribute("preload", "none");
  });

  // Mask application
  function setupHorizontalScroll(elementId) {
    const scrollElement = document.querySelector(elementId);
    if (scrollElement) {
      scrollElement.addEventListener("scroll", () => {
        const isAtEnd = scrollElement.scrollLeft >= scrollElement.scrollWidth - scrollElement.clientWidth;
        const isAtStart = scrollElement.scrollLeft === 0;
        scrollElement.classList.toggle("maskedStart", isAtEnd);
        scrollElement.classList.toggle("masked", !isAtEnd && !isAtStart);
      });
    }
  }

  setupHorizontalScroll("#projectsScrollport");
  setupHorizontalScroll("#vscScrollport");

  // Button scrolling
  const setupScrollport = (scrollportId, leftButtonClass, rightButtonClass, itemSelector, leftPadding = 0) => {
    const scrollport = document.getElementById(scrollportId);
    const leftBtnElem = document.querySelector(`.${leftButtonClass}`);
    const rightBtnElem = document.querySelector(`.${rightButtonClass}`);

    if (!scrollport || !leftBtnElem || !rightBtnElem) return;

    const leftButton = leftBtnElem.closest("button");
    const rightButton = rightBtnElem.closest("button");
    const items = Array.from(scrollport.querySelectorAll(itemSelector));

    if (!leftButton || !rightButton || items.length === 0) return;

    let currentIndex = 0;
    let initialScrollWidth;

    const initializeScrollWidth = () => {
      if (!initialScrollWidth && scrollport.scrollWidth > 0) {
        initialScrollWidth = scrollport.scrollWidth;
      }
    };

    const updateButtonState = () => {
      initializeScrollWidth();
      if (!initialScrollWidth) return;

      const currentScrollLeft = scrollport.scrollLeft;
      const maxScroll = scrollport.scrollWidth - scrollport.clientWidth;

      if (initialScrollWidth > 0 && items.length > 0) {
        const itemWidth = initialScrollWidth / items.length;
        currentIndex = Math.round(currentScrollLeft / itemWidth);
      } else {
        currentIndex = 0;
      }

      leftButton.disabled = currentScrollLeft <= 0;
      rightButton.disabled = Math.abs(currentScrollLeft - maxScroll) < 1;
      leftButton.classList.toggle("disabled", leftButton.disabled);
      rightButton.classList.toggle("disabled", rightButton.disabled);
    };

    function scrollToNextItem(direction) {
      initializeScrollWidth();
      if (!initialScrollWidth || items.length === 0) return;

      if (direction === "right" && currentIndex < items.length - 1) {
        currentIndex++;
      } else if (direction === "left" && currentIndex > 0) {
        currentIndex--;
      }

      const itemWidth = initialScrollWidth / items.length;
      let targetScroll;

      if (currentIndex === 0) {
        targetScroll = 0;
      } else if (currentIndex === items.length - 1) {
        targetScroll = scrollport.scrollWidth - scrollport.clientWidth;
      } else {
        targetScroll = itemWidth * currentIndex - leftPadding;
      }

      scrollport.scrollTo({ left: targetScroll, behavior: "smooth" });
    }

    leftButton.disabled = true;
    leftButton.classList.add("disabled");
    requestAnimationFrame(updateButtonState);

    leftButton.addEventListener("click", () => scrollToNextItem("left"));
    rightButton.addEventListener("click", () => scrollToNextItem("right"));
    scrollport.addEventListener("scroll", updateButtonState);

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initialScrollWidth = null;
        initializeScrollWidth();
        updateButtonState();
      }, 250);
    });
  };

  setupScrollport("projectsScrollport", "left1", "right1", ".projColSm", 40);
  setupScrollport("vscScrollport", "left2", "right2", ".vscImage", 10);

  // Moal video handling
  const videoModals = document.querySelectorAll('.modal'); 

  videoModals.forEach(modal => {
    const video = modal.querySelector('video');
    if (video) { // Only add listeners if the modal contains a video
      // Ensure the video doesn't have a src initially if preload="none"
      if (video.getAttribute('preload') === 'none') {
         const sourceTag = video.querySelector('source');
         if (sourceTag && sourceTag.getAttribute('src')) {
             video.removeAttribute('src'); 
         }
      }

      modal.addEventListener('show.bs.modal', () => {
        loadVideo(video);
      });

      modal.addEventListener('hidden.bs.modal', () => {
        unloadVideo(video);
      });
    }
  });

  // Scroll animations
  requestAnimationFrame(() => {
    const observerSlideY = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("showSlideY");
          observerSlideY.unobserve(entry.target);
        }
      });
    });

    const observerBlur = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("showBlur");
          observerBlur.unobserve(entry.target);
        }
      });
    });

    const observerSlideX = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("showSlideX");

          if (entry.target.classList.contains("staggerProject")) {
            const childIndex = Array.from(entry.target.parentNode.children).indexOf(entry.target);
            const delays = [0, 1200, 2000, 2800];
            const delay = delays[childIndex] || 0;
            setTimeout(() => {
              entry.target.classList.remove("staggerProject");
              entry.target.classList.add("hoverable");
            }, delay);
          } else if (entry.target.classList.contains("staggerHobby")) {
            const childIndex = Array.from(entry.target.parentNode.children).indexOf(entry.target);
            if (childIndex === 0) {
              setTimeout(() => {
                entry.target.classList.remove("staggerHobby");
              }, 1200);
            }
          }

          observerSlideX.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01 });

    document.querySelectorAll(".hiddenSlideY").forEach(el => observerSlideY.observe(el));
    document.querySelectorAll(".hiddenBlur").forEach(el => observerBlur.observe(el));
    document.querySelectorAll(".hiddenSlideX").forEach(el => observerSlideX.observe(el));
  });
});