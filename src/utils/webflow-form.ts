/**
 * Submit a form to the Webflow form endpoint it was built against, swapping
 * in the success card (or the error note) exactly like the original site.
 *
 * Wire-up is idempotent per wrapper: `data-state` on the wrapper drives which
 * of form / success / error blocks is visible (see site.css).
 */
export function wireWebflowForm(wrapper: HTMLElement): void {
  const form = wrapper.querySelector<HTMLFormElement>("form");
  if (!form || form.dataset.wired) return;
  form.dataset.wired = "true";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    /* Honeypot: a filled hidden field means a bot — pretend success. */
    const honeypot = form.querySelector<HTMLInputElement>(
      ".u-form-honeypot input",
    );
    if (honeypot && honeypot.value.length > 0) {
      wrapper.dataset.state = "success";
      return;
    }

    const submit = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    const label = submit?.textContent ?? "";
    if (submit) {
      submit.disabled = true;
      submit.textContent = submit.dataset.wait ?? "Please wait...";
    }

    const data = new FormData(form);
    data.append("name", form.dataset.formName ?? form.name);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new URLSearchParams(data as unknown as Record<string, string>),
        headers: { Accept: "application/json" },
      });
      wrapper.dataset.state = response.ok ? "success" : "error";
      if (response.ok) {
        wrapper
          .querySelector(".form-success")
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    } catch {
      wrapper.dataset.state = "error";
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = label;
      }
    }
  });
}
