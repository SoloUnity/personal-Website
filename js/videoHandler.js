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
});
