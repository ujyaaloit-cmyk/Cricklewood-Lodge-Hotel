const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const bookingForm = document.getElementById('bookingForm');
const checkIn = document.getElementById('checkIn');
const checkOut = document.getElementById('checkOut');

function localDate(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (checkIn && checkOut) {
  checkIn.min = localDate(0);
  checkOut.min = localDate(1);
  if (!checkIn.value) checkIn.value = localDate(14);
  if (!checkOut.value) checkOut.value = localDate(15);
  checkIn.addEventListener('change', () => {
    const next = new Date(`${checkIn.value}T00:00:00`);
    next.setDate(next.getDate() + 1);
    const nextValue = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
    checkOut.min = nextValue;
    if (!checkOut.value || checkOut.value <= checkIn.value) checkOut.value = nextValue;
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const guests = document.getElementById('guests').value;
    const rooms = document.getElementById('rooms').value;
    const url = new URL('https://www.booking.com/hotel/gb/cricklewood-lodge.en-gb.html');
    url.searchParams.set('checkin', checkIn.value);
    url.searchParams.set('checkout', checkOut.value);
    url.searchParams.set('group_adults', guests);
    url.searchParams.set('group_children', '0');
    url.searchParams.set('no_rooms', rooms);
    window.location.href = url.toString();
  });
}
