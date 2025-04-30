(async function loadFragments() {
  const parts = [
    { targetId: "include-navbar", file: "navbar.html"},
    { targetId: "include-profile", file: "profile.html"},
    { targetId: "include-about", file: "about.html"},
    { targetId: "include-projects", file: "projects.html"},
    { targetId: "include-skills", file: "skills.html"},
    { targetId: "include-interests", file: "interests.html"},
    { targetId: "include-footer", file: "footer.html"},
  ];

  await Promise.all(
    parts.map(async ({ targetId, file }) => {
      const res  = await fetch(`./components/${file}`);
      const html = await res.text();
      document.getElementById(targetId).innerHTML = html;
    })
  );

  console.log("Fragments loaded, dispatching event...");
  document.dispatchEvent(new Event("fragmentsLoaded"));
})();