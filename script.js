'use strict';

// Sidebar toggle (mobile)
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// Page navigation
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.textContent.trim().toLowerCase();

    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    pages.forEach(page => {
      if (page.dataset.page === target) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Portfolio filter
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.textContent.trim().toLowerCase();

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    filterItems.forEach(item => {
      if (filter === 'all' || item.dataset.category.includes(filter)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
});
