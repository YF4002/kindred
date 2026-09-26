const causes = [
  { title: "Rebuild after the coastal floods", location: "Porto Alegre, Brazil", category: "emergency", tag: "Urgent relief", image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80", raised: "$84,290", goal: "$120,000", percent: 70, supporters: "1,248 supporters" },
  { title: "Warm meals for displaced families", location: "Marrakesh, Morocco", category: "community", tag: "Community care", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80", raised: "$31,840", goal: "$45,000", percent: 71, supporters: "682 supporters" },
  { title: "Protect the last forest corridor", location: "Borneo, Indonesia", category: "climate", tag: "Climate action", image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80", raised: "$19,430", goal: "$30,000", percent: 64, supporters: "409 supporters" },
  { title: "A safe roof for the neighborhood", location: "New Orleans, USA", category: "emergency", tag: "Housing", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80", raised: "$52,180", goal: "$75,000", percent: 69, supporters: "791 supporters" },
  { title: "Keep the clinic doors open", location: "Kampala, Uganda", category: "community", tag: "Healthcare", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80", raised: "$12,650", goal: "$20,000", percent: 63, supporters: "238 supporters" },
  { title: "Restore the river, restore a future", location: "Queensland, Australia", category: "climate", tag: "Climate action", image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80", raised: "$27,920", goal: "$40,000", percent: 70, supporters: "518 supporters" }
];

const grid = document.querySelector("#cause-grid");
const emptyState = document.querySelector("#empty-state");
let activeFilter = "all";
let visibleCount = 3;
let causeData = causes;

async function loadPublishedCauses() {
  try {
    const response = await fetch("/api/causes");
    if (!response.ok) throw new Error(`Cause API returned ${response.status}`);
    const payload = await response.json();
    if (Array.isArray(payload.causes) && payload.causes.length > 0) causeData = payload.causes;
  } catch (error) {
    console.info("Using preview causes until the API is available.", error);
  }
  renderCauses();
}

function renderCauses() {
  const query = document.querySelector("#search-input").value.toLowerCase().trim();
  const filtered = causeData.filter((cause) => {
    const matchesFilter = activeFilter === "all" || cause.category === activeFilter;
    const matchesSearch = !query || `${cause.title} ${cause.location} ${cause.tag}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
  const visible = filtered.slice(0, visibleCount);
  grid.innerHTML = visible.map((cause) => `
    <article class="cause-card">
      <div class="cause-visual">
        <img src="${cause.image}" alt="" loading="lazy" />
        <span class="cause-tag">${cause.tag}</span>
      </div>
      <h3>${cause.title}</h3>
      <p class="cause-location">⌖ ${cause.location}</p>
      <div class="progress" aria-label="${cause.percent}% funded"><i style="width: ${cause.percent}%"></i></div>
      <div class="cause-meta"><span><strong>${cause.raised}</strong> raised</span><span>of ${cause.goal}</span></div>
      <div class="card-footer"><span class="supporters">${cause.supporters}</span><button class="donate-button" type="button" data-cause="${cause.title}">Donate now</button></div>
    </article>
  `).join("");
  emptyState.hidden = filtered.length !== 0;
  document.querySelector("#load-more").hidden = visible.length >= filtered.length || filtered.length === 0;
  document.querySelectorAll(".donate-button").forEach((button) => button.addEventListener("click", () => showToast(`Thank you for choosing “${button.dataset.cause}”.`)));
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 3500);
}

document.querySelector("#search-input").addEventListener("input", () => { visibleCount = 3; renderCauses(); });
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
  document.querySelector(".filter.active").classList.remove("active");
  button.classList.add("active");
  activeFilter = button.dataset.filter;
  visibleCount = 3;
  loadPublishedCauses();
}));
document.querySelector("#load-more").addEventListener("click", () => { visibleCount += 3; renderCauses(); });
document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.toast)));
document.querySelector(".menu-button").addEventListener("click", () => showToast("Mobile navigation is coming soon."));
renderCauses();
