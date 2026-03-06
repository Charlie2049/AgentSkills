const skillGrid = document.getElementById('skillGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sourceSelect = document.getElementById('sourceSelect');
const skillCount = document.getElementById('skillCount');
const categoryCount = document.getElementById('categoryCount');

const submitDialog = document.getElementById('submitDialog');
const guideDialog = document.getElementById('guideDialog');

document.getElementById('openSubmit').addEventListener('click', () => submitDialog.showModal());
document.getElementById('closeSubmit').addEventListener('click', () => submitDialog.close());
document.getElementById('openGuide').addEventListener('click', () => guideDialog.showModal());
document.getElementById('closeGuide').addEventListener('click', () => guideDialog.close());

let skills = [];
let filtered = [];

async function loadSkills() {
  try {
    const res = await fetch('data/skills.json');
    skills = await res.json();
    filtered = skills;
    render();
    populateFilters();
  } catch (err) {
    skillGrid.innerHTML = `<p>加载数据失败：${err.message}</p>`;
  }
}

function populateFilters() {
  const categories = Array.from(new Set(skills.map((s) => s.category))).sort();
  const sources = Array.from(new Set(skills.map((s) => s.source))).sort();

  categoryCount.textContent = categories.length;

  categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  sources.forEach((src) => {
    const option = document.createElement('option');
    option.value = src;
    option.textContent = src;
    sourceSelect.appendChild(option);
  });
}

function render() {
  skillCount.textContent = filtered.length;
  if (!filtered.length) {
    skillGrid.innerHTML = '<p>暂无符合条件的 Skill。</p>';
    return;
  }

  skillGrid.innerHTML = filtered
    .map(
      (skill) => `
      <article class="card">
        <h3>${skill.name}</h3>
        <span class="badge">${skill.category}</span>
        <p>${skill.description}</p>
        <div class="tag-list">
          ${skill.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span>${skill.source}</span>
          <a href="${skill.link}" target="_blank" rel="noopener">查看</a>
        </div>
      </article>
    `
    )
    .join('');
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const source = sourceSelect.value;

  filtered = skills.filter((skill) => {
    const matchesTerm =
      !term ||
      skill.name.toLowerCase().includes(term) ||
      skill.description.toLowerCase().includes(term) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(term));

    const matchesCategory = category === 'all' || skill.category === category;
    const matchesSource = source === 'all' || skill.source === source;

    return matchesTerm && matchesCategory && matchesSource;
  });

  render();
}

searchInput.addEventListener('input', applyFilters);
categorySelect.addEventListener('change', applyFilters);
sourceSelect.addEventListener('change', applyFilters);

loadSkills();
