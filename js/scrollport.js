// Self-invoking function to encapsulate scrollport logic
(function() {
  document.addEventListener("fragmentsLoaded", () => {
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
        rightButton.disabled = Math.abs(currentScrollLeft - maxScroll) < 1; // Use Math.abs for floating point precision
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
      requestAnimationFrame(updateButtonState); // Initial check

      leftButton.addEventListener("click", () => scrollToNextItem("left"));
      rightButton.addEventListener("click", () => scrollToNextItem("right"));
      scrollport.addEventListener("scroll", updateButtonState);

      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          initialScrollWidth = null; // Recalculate on resize
          initializeScrollWidth();
          updateButtonState();
        }, 250);
      });
    };

    setupScrollport("projectsScrollport", "left1", "right1", ".projColSm", 40);
    setupScrollport("vscScrollport", "left2", "right2", ".vscImage", 10);
  });
})();