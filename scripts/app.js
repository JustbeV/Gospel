/* ---------- DARK MODE ---------- */
function initDarkMode() {
  const toggle = document.getElementById("darkToggle");
  
  if (localStorage.getItem("darkmode") === "true") {
    document.body.classList.add("dark");
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkmode", document.body.classList.contains("dark"));
  });
}

/* ---------- AUTO-LINK BIBLE VERSES ---------- */
function autoLinkVerses(text) {
  const regex = /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation)\s\d+:\d+\b/g;

  return text.replace(regex, match =>
    `<a target="_blank" href="https://www.biblegateway.com/passage/?search=${match.replace(" ", "+")}">${match}</a>`
  );
}

/* ---------- HOMEPAGE ---------- */
if (location.pathname.endsWith("/") || location.pathname.includes("index.html")) {
  initDarkMode();
  loadCategories();
  displayTopics();

  document.getElementById("search").addEventListener("input", filterAll);
  document.getElementById("categoryFilter").addEventListener("change", filterAll);
}

function loadCategories() {
  const sel = document.getElementById("categoryFilter");
  const cats = [...new Set(topicsData.map(t => t.category))];

  cats.forEach(cat => {
    sel.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function filterAll() {
  displayTopics(
    document.getElementById("search").value,
    document.getElementById("categoryFilter").value
  );
}

function displayTopics(search = "", category = "all") {
  const container = document.getElementById("topics");
  container.innerHTML = "";

  let filtered = topicsData.filter(t =>
    (t.title.toLowerCase().includes(search.toLowerCase()) ||
     t.excerpt.toLowerCase().includes(search.toLowerCase())) &&
    (category === "all" || t.category === category)
  );

  filtered.forEach(t => {
    container.innerHTML += `
      <div class="topic-card">
        <h2>${t.title}</h2>
        <small>${t.category}</small>
        <p>${autoLinkVerses(t.excerpt)}</p>
        <a href="topic.html?id=${t.id}">Read More</a>
      </div>
    `;
  });
}

/* ---------- TOPIC PAGE ---------- */
if (location.pathname.includes("topic.html")) {
  initDarkMode();

  const id = new URLSearchParams(location.search).get("id");
  const topic = topicsData.find(t => t.id == id);

  const container = document.getElementById("topic-details");

  if (topic) {
  container.innerHTML = `
    <h1>${topic.title}</h1>
    <small>${topic.category}</small>
    ${topic.content.split("\n\n").map(p => `<p>${autoLinkVerses(p)}</p>`).join("")}
  `;


    // Update tab title dynamically
    document.title = topic.title + " — Gospel";
  } else {
    container.innerHTML = "<p>Topic not found.</p>";
    document.title = "Topic Not Found — Gospel";
  }
}

/* ---------- FONT SIZE ---------- */
function changeFontSize(change) {
  const container = document.getElementById("topic-details");
  const style = window.getComputedStyle(container, null).getPropertyValue('font-size');
  const currentSize = parseFloat(style);
  container.style.fontSize = (currentSize + change) + "px";
}
