document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      menuButton.textContent = open ? '×' : '☰';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
        menuButton.textContent = '☰';
      });
    });
  }

  const form = document.getElementById('enquiryForm');
  if (!form) return;

  // The enquiry form intentionally remains an email hand-off until a server-side
  // mail service is configured. Keep validation and accessibility client-side.
  form.addEventListener('submit', (event) => {
    const email = form.querySelector('#email');
    if (email && !email.checkValidity()) {
      event.preventDefault();
      email.focus();
    }
  });
});
