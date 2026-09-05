document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const phone = data.get('phone');
    const message = data.get('message');
    const subject = encodeURIComponent(`Your AHC enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nEnquiry:\n${message}`);

    // Replace this address with the final Your AHC enquiry email before launch.
    window.location.href = `mailto:hello@yourahc.com.au?subject=${subject}&body=${body}`;
  });
});
