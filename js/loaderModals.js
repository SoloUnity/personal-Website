(async function loadFragments() {
  const parts = [
    { targetId: "vsc-modal", file: "vsc.html"},
    { targetId: "yapOS-modal", file: "yapOS.html"},
    { targetId: "aiAgent-modal", file: "aiAgent.html"},
    { targetId: "codeVault-modal", file: "codeVault.html"},
    { targetId: "marsRover-modal", file: "codeVault.html"},
    { targetId: "dance-modal", file: "dance.html"},
    { targetId: "bouldering-modal", file: "bouldering.html"},
  ];

  await Promise.all(
    parts.map(async ({ targetId, file }) => {
      const res  = await fetch(`./components/modals/${file}`);
      const html = await res.text();
      document.getElementById(targetId).innerHTML = html;
    })
  );

  console.log("Fragments loaded, dispatching event...");
  document.dispatchEvent(new Event("fragmentsLoaded"));
})();