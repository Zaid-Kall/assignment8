const statusEl = document.querySelector("#status");
const outputEl = document.querySelector("#output");
const buttons = document.querySelectorAll("button[data-path]");

async function callApi(path, method) {
  statusEl.textContent = `Loading ${method} ${path} ...`;
  outputEl.textContent = "";

  try {
    const response = await fetch(path, { method });
    const text = await response.text();

    let body = text;
    try {
      // Pretty-print JSON with 2 spaces of indentation
      body = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // Not JSON, show the raw text
    }

    statusEl.textContent = `${method} ${path} -> ${response.status} ${response.statusText}`;
    outputEl.textContent = body;
  } catch (error) {
    // Network error: the server is down or unreachable
    statusEl.textContent = `${method} ${path} -> request failed`;
    outputEl.textContent = error.message;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const path = button.dataset.path;
    const method = button.dataset.method || "GET";
    callApi(path, method);
  });
});