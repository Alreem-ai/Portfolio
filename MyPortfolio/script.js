document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const grid = document.getElementById('project-grid');
const filterChips = document.querySelectorAll('[data-filter]');

let allProjects = [];

async function loadProjects(){
  try{
    const res = await fetch('projects.json');
    allProjects = await res.json();
    renderProjects('all');
  }catch(e){
    console.error('Failed to load projects', e);
    allProjects = [];
    renderProjects('all');
  }
}

function renderProjects(filter){
  grid.innerHTML = '';
  const list = allProjects.filter(p => filter==='all' ? true : p.type === filter);
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${p.img}" alt="Project ${p.title} preview" loading="lazy" />
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="actions">
        ${p.links?.demo ? `<a href="${p.links.demo}" target="_blank" rel="noopener">Live</a>`:''}
        ${p.links?.code ? `<a href="${p.links.code}" target="_blank" rel="noopener">Code</a>`:''}
      </div>
    `;
    grid.appendChild(card);
  });
}

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c=>c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const f = chip.getAttribute('data-filter');
    renderProjects(f);
  });
});

function sendMessage(e){
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('form-status');
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('New message:', data);
  status.textContent = 'Your message has been sent! I will get back to you soon.';
  form.reset();
  return false;
}

loadProjects();
