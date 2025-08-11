document.addEventListener("fragmentsLoaded", () => {
  const openModalFromUrl = () => {
    const hash = window.location.hash;
    if (hash) {
      // We need to select the modal container, not the modal itself, which will be a child.
      const modalTargetId = hash.substring(1) + "-modal";
      const modalContainer = document.getElementById(modalTargetId);
      if (modalContainer) {
        const modalElement = modalContainer.querySelector('.modal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      }
    }
  };

  // Open modal on initial page load after fragments are ready
  openModalFromUrl();

  // Listen for hash changes to open modals without a page reload
  window.addEventListener('hashchange', openModalFromUrl, false);
});
