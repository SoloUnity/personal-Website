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

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Apply the theme to the document root
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

if (currentTheme) {
  applyTheme(currentTheme);
} else {
  applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
}

// Listener for system preference changes (only if no theme is stored)
prefersDarkScheme.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
    // Also update the toggle if it exists
    const themeToggle = document.getElementById('darkModeSwitch');
    if (themeToggle) {
        themeToggle.checked = e.matches;
    }
  }
});

document.addEventListener("fragmentsLoaded", () => {
  // Select the theme toggle *after* fragments are loaded
  const themeToggleLoaded = document.getElementById('darkModeSwitch');

  // Apply theme state to the newly loaded toggle and add listener
  if (themeToggleLoaded) {
    // Set initial state based on the currently applied theme
    themeToggleLoaded.checked = document.documentElement.getAttribute('data-theme') === 'dark';

    // Add listener for user interaction
    themeToggleLoaded.addEventListener('change', function () {
      const newTheme = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

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

  // Modal video handling
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
          
          if (entry.target.classList.contains("staggerProject")) {
            const childIndex = Array.from(entry.target.parentNode.children).indexOf(entry.target);
            const delays = [0, 200, 400, 600];
            const animationDuration = 1000; // Base animation duration is 1s
            const totalTime = delays[childIndex] + animationDuration;
            
            setTimeout(() => {
              entry.target.classList.remove("staggerProject");
              entry.target.classList.add("hoverable");
            }, totalTime);
          }
          
          observerBlur.unobserve(entry.target);
        }
      });
    });

    // const observerSlideX = new IntersectionObserver(entries => {
    //   entries.forEach(entry => {
    //     if (entry.isIntersecting) {
    //       entry.target.classList.add("showSlideX");
          
    //       // Handle staggerProject cleanup after animations complete
    //       if (entry.target.classList.contains("staggerProject")) {
    //         const childIndex = Array.from(entry.target.parentNode.children).indexOf(entry.target);
    //         const delays = [0, 200, 400, 600]; // Match CSS transition delays in milliseconds
    //         const animationDuration = 1000; // Base animation duration is 1s
    //         const totalTime = delays[childIndex] + animationDuration;
            
    //         setTimeout(() => {
    //           entry.target.classList.remove("staggerProject");
    //           entry.target.classList.add("hoverable");
    //         }, totalTime);
    //       }
          
    //       observerSlideX.unobserve(entry.target);
    //     }
    //   });
    // }, { threshold: 0.01 });

    document.querySelectorAll(".hiddenSlideY").forEach(el => observerSlideY.observe(el));
    document.querySelectorAll(".hiddenBlur").forEach(el => observerBlur.observe(el));
    // document.querySelectorAll(".hiddenSlideX").forEach(el => observerSlideX.observe(el));
  });
});