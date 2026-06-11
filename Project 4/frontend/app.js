// ─── Config ──────────────────────────────────────────────────────────────────
// Change this to your backend URL if deploying
const API_BASE = 'http://localhost:5000/api';

// ─── State ───────────────────────────────────────────────────────────────────
let allInterns = [];   // in-memory cache for instant search filtering

// ─── DOM Helpers ─────────────────────────────────────────────────────────────
const $   = (id) => document.getElementById(id);
const show = (id) => $(id).style.display = '';
const hide = (id) => $(id).style.display = 'none';

function setMsg(elId, text, type = '') {
  const el = $(elId);
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

// ─── Health Check ─────────────────────────────────────────────────────────────
async function checkHealth() {
  const badge = $('dbStatus');
  try {
    const res  = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (data.status === 'ok') {
      badge.textContent = '✅ DB Connected';
      badge.className   = 'badge ok';
    } else {
      throw new Error('DB not connected');
    }
  } catch {
    badge.textContent = '❌ DB Offline';
    badge.className   = 'badge err';
  }
}

// ─── LOAD ALL INTERNS (READ) ──────────────────────────────────────────────────
async function loadInterns() {
  show('loadingState');
  hide('errorState');
  hide('emptyState');
  $('internGrid').innerHTML = '';

  try {
    const res = await fetch(`${API_BASE}/interns`);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `Server error ${res.status}`);
    }

    const data = await res.json();
    allInterns = data.data;
    renderInterns(allInterns);

  } catch (err) {
    hide('loadingState');
    show('errorState');
    $('errorText').textContent = err.message;
  } finally {
    hide('loadingState');
  }
}

// ─── RENDER INTERNS TO DOM ────────────────────────────────────────────────────
function renderInterns(interns) {
  const grid = $('internGrid');
  grid.innerHTML = '';

  if (interns.length === 0) {
    show('emptyState');
    return;
  }
  hide('emptyState');

  interns.forEach((intern) => {
    const card = document.createElement('div');
    card.className = 'intern-card';

    // Build skills tags
    const skillsHtml = intern.skills?.length
      ? intern.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')
      : '';

    // Use textContent for user-generated fields to prevent XSS
    card.innerHTML = `
      <div class="name"></div>
      <div class="role"></div>
      <div class="email"></div>
      <div class="skills-wrap">${skillsHtml}</div>
      <div class="card-actions">
        <button class="btn btn-ghost small" onclick="openEditModal(${intern.id})">✏️ Edit</button>
        <button class="btn btn-danger small" onclick="handleDelete(${intern.id})">🗑 Delete</button>
      </div>
    `;

    // Safely inject text (XSS protection)
    card.querySelector('.name').textContent  = intern.name;
    card.querySelector('.role').textContent  = intern.role;
    card.querySelector('.email').textContent = intern.email;

    grid.appendChild(card);
  });
}

// Escape helper for skill tags injected via innerHTML
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── SEARCH (client-side filter) ─────────────────────────────────────────────
function handleSearch() {
  const q = $('searchInput').value.toLowerCase().trim();
  if (!q) return renderInterns(allInterns);

  const filtered = allInterns.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.role.toLowerCase().includes(q) ||
    (i.skills || []).some(s => s.toLowerCase().includes(q))
  );
  renderInterns(filtered);
}

// ─── CREATE INTERN ────────────────────────────────────────────────────────────
async function handleSubmit() {
  setMsg('formMsg', '');

  const name   = $('fName').value.trim();
  const email  = $('fEmail').value.trim();
  const role   = $('fRole').value.trim();
  const skills = $('fSkills').value.trim().split(',').map(s => s.trim()).filter(Boolean);

  if (!name || !email) {
    return setMsg('formMsg', '⚠️ Name and email are required.', 'error');
  }

  try {
    const res = await fetch(`${API_BASE}/interns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, skills }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to create intern.');

    setMsg('formMsg', `✅ ${data.data.name} registered!`, 'success');
    clearForm();
    loadInterns();  // refresh list

  } catch (err) {
    setMsg('formMsg', `❌ ${err.message}`, 'error');
  }
}

function clearForm() {
  ['fName','fEmail','fRole','fSkills'].forEach(id => $(id).value = '');
  setMsg('formMsg', '');
}

// ─── DELETE INTERN ────────────────────────────────────────────────────────────
async function handleDelete(id) {
  if (!confirm('Delete this intern? This cannot be undone.')) return;

  try {
    const res = await fetch(`${API_BASE}/interns/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Delete failed.');

    loadInterns();

  } catch (err) {
    alert(`❌ ${err.message}`);
  }
}

// ─── EDIT MODAL ───────────────────────────────────────────────────────────────
async function openEditModal(id) {
  setMsg('editMsg', '');
  try {
    const res = await fetch(`${API_BASE}/interns/${id}`);
    if (!res.ok) throw new Error('Failed to load intern data.');

    const { data } = await res.json();

    $('editId').value     = data.id;
    $('editName').value   = data.name;
    $('editEmail').value  = data.email;
    $('editRole').value   = data.role;
    $('editSkills').value = (data.skills || []).join(', ');

    show('modal');

  } catch (err) {
    alert(`❌ ${err.message}`);
  }
}

async function handleUpdate() {
  setMsg('editMsg', '');

  const id     = parseInt($('editId').value);
  const name   = $('editName').value.trim();
  const email  = $('editEmail').value.trim();
  const role   = $('editRole').value.trim();
  const skills = $('editSkills').value.trim().split(',').map(s => s.trim()).filter(Boolean);

  if (!name || !email) return setMsg('editMsg', '⚠️ Name and email are required.', 'error');

  try {
    const res = await fetch(`${API_BASE}/interns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, skills }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed.');

    setMsg('editMsg', '✅ Updated!', 'success');
    setTimeout(() => { hideModal(); loadInterns(); }, 800);

  } catch (err) {
    setMsg('editMsg', `❌ ${err.message}`, 'error');
  }
}

function hideModal() { hide('modal'); }

function closeModal(e) {
  // Close when clicking backdrop (not modal box itself)
  if (e.target.id === 'modal') hideModal();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
checkHealth();
loadInterns();
