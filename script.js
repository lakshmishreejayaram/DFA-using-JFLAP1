
const aabForm = document.getElementById("aab-form");

if (aabForm) {
  aabForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = document.getElementById("aab-input").value;
    const output = document.getElementById("aab-result");

    if (!/^[ab]*$/i.test(value)) {
      output.textContent = "Invalid input. Enter only a and b.";
      output.className = "result invalid";
      return;
    }

    const accepted = value.toLowerCase().endsWith("aab");

    output.textContent = accepted
      ? "Accepted! The string ends with aab."
      : "Rejected! The string does not end with aab.";

    output.className = accepted
      ? "result accepted"
      : "result rejected";
  });
}
