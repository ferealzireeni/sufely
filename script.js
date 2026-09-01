const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwR7mjre98jZzJdMtrxgJiK6qALP42ayl-PfcwNvmDDVsXws0FctNlpOuGLUKK_SRgIVA/exec";

const form = document.querySelector("#early-access-form");
const statusEl = document.querySelector("#form-status");
const submitButton = form.querySelector("button[type='submit']");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` is-${type}` : ""}`;
}

function serializeForm(targetForm) {
  return Object.fromEntries(new FormData(targetForm).entries());
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!GOOGLE_SCRIPT_URL) {
    setStatus("Add your Google Apps Script web app URL in script.js to enable submissions.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  setStatus("Sending your request...");

  try {
    const payload = {
      ...serializeForm(form),
      submittedAt: new Date().toISOString(),
    };

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    form.reset();
    setStatus("Request received. We will be in touch soon.", "success");
  } catch (error) {
    setStatus("Submission failed. Please try again in a moment.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Request";
  }
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
