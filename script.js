const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyHbn_cdu0KllVSfrCPO5U3d0tkNOEN9i0muXxbPydvPaRhtycgX4JdZPB0Rgx65sDsDA/exec";

const form = document.querySelector("#early-access-form");
const statusEl = document.querySelector("#form-status");
const submitButton = form.querySelector("button[type='submit']");
const submittedAtInput = document.querySelector("#submitted-at");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` is-${type}` : ""}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!GOOGLE_SCRIPT_URL) {
    setStatus("Add your Google Apps Script web app URL in script.js to enable submissions.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  setStatus("Sending your request...");
  submittedAtInput.value = new Date().toISOString();
  form.action = GOOGLE_SCRIPT_URL;

  window.setTimeout(() => {
    form.reset();
    setStatus("Request received. We will be in touch soon.", "success");
    submitButton.disabled = false;
    submitButton.textContent = "Submit Request";
  }, 900);

  HTMLFormElement.prototype.submit.call(form);
});

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
    revealObserver.observe(element);
  });

  document.querySelectorAll("[data-count]").forEach((element) => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const pad = Number(element.dataset.pad || 0);
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = `${String(value).padStart(pad, "0")}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
} else {
  document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
    element.classList.add("is-visible");
  });
}
