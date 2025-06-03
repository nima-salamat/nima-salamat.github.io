const translations = {
  en: {
    title_home: "Home | Nima Salamat",
    title_about: "About | Nima Salamat",
    title_contact: "Contact | Nima Salamat",
    nav_home: "🏠 Home",
    nav_about: "ℹ️ About",
    nav_contact: "✉️ Contact",
    job_title: "💻 Computer Engineer",
    welcome: "Welcome to my website!",
    intro_paragraph: "Hi! I’m Nima Salamat, a computer engineer passionate about web and desktop development. Here are my projects.",
    my_projects: "My Projects",
    loading_projects: "Loading projects...",
    loading_error: "Error loading projects.",
    retry: "Retry",
    about_heading: "About Me 📖",
    about_casual: "Hello! I’m Nima. I’m a computer engineer currently studying at Amol University of Special Modern Technologies...",
    skills_heading: "Skills",
    skill_django: "Django",
    skill_channels: "Django Channels",
    skill_celery: "Celery",
    skill_pyside6: "PySide6 / PyQt",
    skill_opencv: "Python OpenCV",
    skill_rust: "Rust",
    skill_htmlcss: "HTML / CSS",
    skill_js: "JavaScript",
    skill_react: "React",
    skill_sql: "SQL / MySQL",
    skill_redis: "Redis",
    skill_docker: "Docker",
    contact_heading: "Contact Me 📬",
    input_name_label: "Your Name",
    input_email_label: "Your Email",
    input_message_label: "Your Message",
    placeholder_name: "Enter your name",
    placeholder_email: "Enter your email",
    placeholder_message: "Type your message here...",
    button_send: "Send 📤"
  },

  fa: {
    title_home: "خانه | Nima Salamat",
    title_about: "درباره من | Nima Salamat",
    title_contact: "تماس با من | Nima Salamat",
    nav_home: "🏠 خانه",
    nav_about: "ℹ️ درباره",
    nav_contact: "✉️ تماس",
    job_title: "💻 مهندس کامپیوتر",
    welcome: "به وب‌سایت من خوش آمدید!",
    intro_paragraph: "سلام! من نیما سلامات هستم...",
    my_projects: "پروژه‌های من",
    loading_projects: "در حال بارگذاری پروژه‌ها...",
    loading_error: "خطا در بارگذاری پروژه‌ها.",
    retry: "تلاش مجدد",
    about_heading: "درباره من 📖",
    about_casual: "سلام! من نیما هستم، دانشجوی مهندسی کامپیوتر...",
    skills_heading: "مهارت‌ها",
    skill_django: "جنگو",
    skill_channels: "جنگو چنلز",
    skill_celery: "سلری",
    skill_pyside6: "PySide6 / PyQt",
    skill_opencv: "پایتون OpenCV",
    skill_rust: "راست (Rust)",
    skill_htmlcss: "HTML / CSS",
    skill_js: "جاوااسکریپت",
    skill_react: "ری‌اکت",
    skill_sql: "SQL / MySQL",
    skill_redis: "ردیس",
    skill_docker: "داکر",
    contact_heading: "تماس با من 📬",
    input_name_label: "نام شما",
    input_email_label: "ایمیل شما",
    input_message_label: "پیام شما",
    placeholder_name: "نام خود را وارد کنید",
    placeholder_email: "ایمیل خود را وارد کنید",
    placeholder_message: "پیام خود را اینجا بنویسید...",
    button_send: "ارسال 📤"
  }
};

// Set default language and theme if not saved
if (!localStorage.getItem('site-language')) {
  localStorage.setItem('site-language', 'en');
}
if (!localStorage.getItem('site-theme')) {
  localStorage.setItem('site-theme', 'dark');
}

const savedLang = localStorage.getItem('site-language');
const currentTheme = localStorage.getItem('site-theme');

// Apply language
function applyTranslations(lang) {
  document.documentElement.lang = lang;

  const titleKey = document.querySelector('title').getAttribute('data-i18n');
  if (translations[lang][titleKey]) {
    document.title = translations[lang][titleKey];
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });
}

applyTranslations(savedLang);

// Apply theme
if (currentTheme === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
}

// Theme toggle
const themeToggleBtn = document.querySelector('.theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('site-theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('site-theme', 'dark');
    }
  });
}

// Language switch buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const newLang = btn.getAttribute('data-lang');
    localStorage.setItem('site-language', newLang);
    applyTranslations(newLang);
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      fetchAndRenderProjects();
    }
  });
});

// GitHub projects
async function fetchAndRenderProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;
  const lang = localStorage.getItem('site-language');
  container.innerHTML = `<p>${translations[lang].loading_projects}</p>`;

  try {
    const reposRes = await fetch('https://api.github.com/users/nima-salamat/repos');
    if (!reposRes.ok) throw new Error('GitHub API error');
    const repos = await reposRes.json();
    const publicRepos = repos.filter(r => !r.name.startsWith('.'));
    const cards = await Promise.all(publicRepos.map(async repo => {
      let description = repo.description || '';
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/nima-salamat/${repo.name}/readme`);
        if (readmeRes.ok) {
          const readmeJson = await readmeRes.json();
          const contentBase64 = readmeJson.content;
          const decoded = atob(contentBase64.replace(/\n/g, ''));
          description = decoded.slice(0, 200).replace(/[#=*`]/g, '').split('\n').slice(0, 3).join(' ');
        }
      } catch (_) {}
      return {
        name: repo.name,
        html_url: repo.html_url,
        desc: description || translations[lang].loading_projects
      };
    }));

    container.innerHTML = '';
    cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.classList.add('project-card');
      cardEl.innerHTML = `
        <h3>${card.name}</h3>
        <p>${card.desc}...</p>
        <a href="${card.html_url}" target="_blank" class="repo-link">GitHub ↗</a>
      `;
      container.appendChild(cardEl);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <p>${translations[savedLang].loading_error}</p>
      <button id="retry-btn">${translations[savedLang].retry}</button>
    `;
    document.getElementById('retry-btn').addEventListener('click', fetchAndRenderProjects);
  }
}

if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  fetchAndRenderProjects();
}

// Sidebar menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const sidebarEl = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
  const isOpen = sidebarEl.classList.contains('sidebar--open');
  sidebarEl.classList.toggle('sidebar--open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

sidebarEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebarEl.classList.remove('sidebar--open');
      document.body.classList.remove('menu-open');
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    sidebarEl.classList.remove('sidebar--open');
    document.body.classList.remove('menu-open');
  }
});

// Hide loader on load
window.addEventListener('load', () => {
  setTimeout(() => {
    const loaderEl = document.getElementById('loader');
    if (loaderEl) loaderEl.style.display = 'none';
  }, 500);
});
