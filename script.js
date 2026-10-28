
const svg = document.getElementById("diagram");
const form = document.getElementById("test-form");
const input = document.getElementById("user-input");
const result = document.getElementById("result");
const traceSection = document.getElementById("trace-section");
const trace = document.getElementById("trace");
const finalState = document.getElementById("final-state");
const tableBody = document.getElementById("transition-table");

// States represent the longest suffix matching a prefix of "aab".
const states = [
  { x: 70,  y: 145, name: "q0" },
  { x: 230, y: 145, name: "q1" },
  { x: 390, y: 145, name: "q2" },
  { x: 550, y: 145, name: "q3" }
];

// q0: no matched prefix
// q1: suffix "a"
// q2: suffix "aa"
// q3: suffix "aab" (accepting)
const transitions = [
  { a: 1, b: 0 },
  { a: 2, b: 0 },
  { a: 2, b: 3 },
  { a: 1, b: 0 }
];

function nextState(state, symbol) {
  return transitions[state][symbol];
}

function drawDFA(currentState = -1) {
  const parts = [
    `<defs>
      <marker id="arrow" markerWidth="8" markerHeight="8"
        refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#8995aa"/>
      </marker>
    </defs>`
  ];

  function path(d, label, x, y) {
    parts.push(`
      <path d="${d}" fill="none" stroke="#8995aa" stroke-width="2"
        marker-end="url(#arrow)"/>
      <text x="${x}" y="${y}" fill="#536178"
        text-anchor="middle" font-size="13">${label}</text>
    `);
  }

  // Initial arrow
  path("M 8 145 L 44 145", "", 0, 0);

  // q0 -> q0 on b
  path("M 55 123 C 22 58, 118 58, 85 123", "b", 70, 57);

  // q0 -> q1 on a
  path("M 94 145 L 204 145", "a", 149, 134);

  // q1 -> q0 on b
  path("M 215 123 C 195 20, 90 20, 70 123", "b", 140, 28);

  // q1 -> q2 on a
  path("M 254 145 L 364 145", "a", 309, 134);

  // q2 -> q2 on a
  path("M 375 123 C 342 58, 438 58, 405 123", "a", 390, 57);

  // q2 -> q3 on b
  path("M 414 145 L 524 145", "b", 469, 134);

  // q3 -> q1 on a
  path("M 550 122 C 550 5, 230 5, 230 122", "a", 390, 18);

  // q3 -> q0 on b
  path("M 530 167 C 450 270, 170 270, 70 167", "b", 300, 263);

  states.forEach((state, i) => {
    const active = i === currentState;
    const accepting = i === 3;

    const fill = active ? "#6558d3" :
      accepting ? "#e5f7ee" : "#ffffff";
    const stroke = active ? "#5143bf" :
      accepting ? "#15845d" : "#8995aa";
    const textColor = active ? "#ffffff" :
      accepting ? "#15845d" : "#26354b";

    parts.push(`
      <circle cx="${state.x}" cy="${state.y}" r="22"
        fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      ${accepting ? `
        <circle cx="${state.x}" cy="${state.y}" r="17"
          fill="none" stroke="${stroke}" stroke-width="1.5"/>
      ` : ""}
      <text x="${state.x}" y="${state.y + 5}"
        text-anchor="middle" font-size="13"
        font-weight="700" fill="${textColor}">${state.name}</text>
    `);
  });

  svg.innerHTML = parts.join("");
}

function renderTable() {
  tableBody.innerHTML = states.map((state, i) => `
    <tr>
      <td>${state.name}${i === 0 ? " (start)" : ""}</td>
      <td>q${nextState(i, "a")}</td>
      <td>q${nextState(i, "b")}</td>
      <td class="${i === 3 ? "accept-state" : ""}">
        ${i === 3 ? "Yes ✓" : "No"}
      </td>
    </tr>
  `).join("");
}

function simulate(value) {
  const word = value.trim().toLowerCase();

  if (!/^[ab]*$/.test(word)) {
    result.textContent = "Invalid input. Enter only a and b.";
    result.className = "result invalid";
    traceSection.hidden = true;
    drawDFA();
    return;
  }

  let state = 0;
  const visited = [state];

  for (const symbol of word) {
    state = nextState(state, symbol);
    visited.push(state);
  }

  const accepted = state === 3;

  result.textContent = accepted
    ? "✓ Accepted! The string ends with aab."
    : "✗ Rejected! The string does not end with aab.";

  result.className = "result " + (accepted ? "accepted" : "rejected");
  traceSection.hidden = false;

  trace.innerHTML = visited.map((s, i) => `
    ${i > 0 ? '<span class="trace-arrow">→</span>' : ""}
    <span class="trace-step ${i === visited.length - 1 ? "current" : ""}">
      ${i === 0 ? "Start: " : word[i - 1] + " → "}q${s}
    </span>
  `).join("");

  finalState.textContent = `Final state: q${state}. ${
    accepted ? "Accepting state." : "Non-accepting state."
  }`;

  drawDFA(state);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  simulate(input.value);
});

document.querySelectorAll(".sample").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.value;
    simulate(input.value);
  });
});

drawDFA();
renderTable();
