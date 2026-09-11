const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const bookingForm = document.getElementById('bookingForm');
const checkIn = document.getElementById('checkIn');
const checkOut = document.getElementById('checkOut');
const siteHeader = document.querySelector('.site-header');

const navMenus = {
  about: [
    ['About Hotel', 'about.html'],
    ['Amenities', 'amenities.html'],
    ['Policies', 'policies.html'],
    ['Contact', 'contact.html']
  ],
  rooms: [
    ['All Rooms', 'rooms.html'],
    ['Single Room', 'rooms.html#single-room'],
    ['Double Room', 'rooms.html#double-room'],
    ['Twin Room', 'rooms.html#twin-room'],
    ['Basic Triple Room', 'rooms.html#basic-triple-room'],
    ['Family Room', 'rooms.html#family-room']
  ],
  travel: [
    ['London Travel', 'travel.html'],
    ['Event Venues', 'travel.html#event-venues'],
    ['Famous Landmarks', 'travel.html#famous-landmarks'],
    ['Museums', 'travel.html#museums'],
    ['Airports & Rail', 'travel.html#airports-rail']
  ],
  'guest-services': [
    ['Guest Services', 'guest-services.html'],
    ['Reception Help', 'guest-services.html#reception-help'],
    ['Extra Towels', 'guest-services.html#reception-help'],
    ['Iron / Hairdryer', 'guest-services.html#reception-help']
  ],
  amenities: [
    ['Amenities', 'amenities.html'],
    ['Free WiFi', 'amenities.html#wifi'],
    ['Family Rooms', 'amenities.html#family-rooms'],
    ['Policies', 'policies.html']
  ],
  location: [
    ['Location', 'location.html'],
    ['Google Map', 'location.html#map'],
    ['Contact', 'contact.html'],
    ['Book', 'book.html']
  ]
};

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

if (siteHeader) {
  let lastScrollY = window.scrollY;
  const updateHeader = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const menuOpen = mobileMenu && mobileMenu.classList.contains('open');
    siteHeader.classList.toggle('scrolled', currentScrollY > 18);
    siteHeader.classList.toggle('nav-hidden', scrollingDown && currentScrollY > 120 && !menuOpen);
    lastScrollY = currentScrollY;
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

document.querySelectorAll('.nav-links').forEach((nav) => {
  Object.entries(navMenus).forEach(([key, links]) => {
    const trigger = [...nav.querySelectorAll('a')].find((link) => {
      const href = link.getAttribute('href') || '';
      return href.endsWith(`${key}.html`);
    });
    if (!trigger || trigger.dataset.hasMenu) return;

    const item = document.createElement('span');
    item.className = 'nav-menu-item';
    trigger.parentNode.insertBefore(item, trigger);
    item.appendChild(trigger);
    trigger.dataset.hasMenu = 'true';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const navPathPrefix = trigger.getAttribute('href').includes('/') ? 'pages/' : '';
    const navHref = (href) => href.startsWith('../') || href.startsWith('pages/') ? href : `${navPathPrefix}${href}`;
    const panel = document.createElement('span');
    panel.className = 'nav-dropdown';
    panel.innerHTML = links.map(([label, href]) => `<a href="${navHref(href)}">${label}</a>`).join('');
    item.appendChild(panel);

    trigger.addEventListener('focus', () => {
      trigger.setAttribute('aria-expanded', 'true');
    });
  });
});

document.addEventListener('click', (event) => {
  if (event.target.closest('.nav-menu-item')) return;
  document.querySelectorAll('.nav-menu-item.open').forEach((item) => {
    item.classList.remove('open');
    const trigger = item.querySelector('[aria-expanded]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
});

if (mobileMenu) {
  Object.entries(navMenus).forEach(([key, links]) => {
    const trigger = [...mobileMenu.querySelectorAll('a')].find((link) => {
      const href = link.getAttribute('href') || '';
      return href.endsWith(`${key}.html`);
    });
    if (!trigger || trigger.dataset.mobileMenuAdded) return;
    trigger.dataset.mobileMenuAdded = 'true';
    const navPathPrefix = trigger.getAttribute('href').includes('/') ? 'pages/' : '';
    const navHref = (href) => href.startsWith('../') || href.startsWith('pages/') ? href : `${navPathPrefix}${href}`;
    const sub = document.createElement('div');
    sub.className = 'mobile-sub-links';
    sub.innerHTML = links.slice(1).map(([label, href]) => `<a href="${navHref(href)}">${label}</a>`).join('');
    trigger.insertAdjacentElement('afterend', sub);
  });
  mobileMenu.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    mobileMenu.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
  const current = new URL(window.location.href);
  const target = new URL(link.getAttribute('href'), window.location.href);
  const currentPage = current.pathname.split('/').pop() || 'index.html';
  const targetPage = target.pathname.split('/').pop() || 'index.html';
  if (currentPage === targetPage && (!target.hash || current.hash === target.hash)) link.classList.add('active');
});

if (checkIn && checkOut) {
  const params = new URLSearchParams(window.location.search);
  checkIn.min = localDate(0);
  checkOut.min = localDate(1);
  if (!checkIn.value) checkIn.value = params.get('checkin') || localDate(14);
  if (!checkOut.value) checkOut.value = params.get('checkout') || localDate(15);
  checkIn.addEventListener('change', () => {
    const next = new Date(`${checkIn.value}T00:00:00`);
    next.setDate(next.getDate() + 1);
    const nextValue = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
    checkOut.min = nextValue;
    if (!checkOut.value || checkOut.value <= checkIn.value) checkOut.value = nextValue;
  });
}

if (bookingForm) {
  const params = new URLSearchParams(window.location.search);
  const guestsParam = params.get('guests');
  const roomsParam = params.get('rooms');
  const roomParam = params.get('room');
  const guestsSelect = document.getElementById('guests');
  const roomsSelect = document.getElementById('rooms');
  if (guestsParam && guestsSelect) guestsSelect.value = guestsParam;
  if (roomsParam && roomsSelect) roomsSelect.value = roomsParam;
  if (roomParam) {
    const label = roomParam.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    const cardTitle = bookingForm.closest('.booking-card')?.querySelector('h2');
    if (cardTitle) cardTitle.textContent = `${label} availability`;
  }
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

const hotelAssistant = {
  welcome: 'Hi, I can help with Cricklewood Lodge Hotel rooms, check-in, services, travel, Wembley routes and Google Maps directions.',
  quick: ['Rooms', 'Check-in', 'Wembley', 'Towels and iron', 'Google Maps'],
  answers: [
    {
      keys: ['room', 'single', 'double', 'twin', 'triple', 'family', 'bed'],
      text: 'The hotel has Single, Double, Twin, Basic Triple and Family room options. Rooms include ensuite bathroom, flat-screen TV and free WiFi. The Rooms page shows the photos by room type.'
    },
    {
      keys: ['check in', 'check-in', 'checkin', 'arrival', 'checkout', 'check out', 'leave'],
      text: 'Check-in starts from 14:00 and check-out is until 10:30. If you arrive early, ask reception about luggage or what may be possible on the day.'
    },
    {
      keys: ['address', 'map', 'google', 'location', 'directions', 'where'],
      text: 'The address is 1 Cricklewood Broadway, London NW2 3JX. Use the Location page or Google Maps for live walking, traffic and public transport directions.'
    },
    {
      keys: ['wembley', 'stadium', 'ovo', 'arena', 'event'],
      text: 'For Wembley Park, Wembley Stadium and OVO Arena Wembley, walk to Kilburn Underground and take the Jubilee line northbound to Wembley Park. The tube section is about 11 minutes, but allow extra time on event days.'
    },
    {
      keys: ['towel', 'iron', 'ironing', 'hairdryer', 'hair dryer', 'reception', 'staff', 'help'],
      text: 'Reception staff can help with extra towels, an iron and ironing board, a hairdryer, local directions and luggage questions. Ask the team during your stay.'
    },
    {
      keys: ['wifi', 'internet'],
      text: 'Free WiFi is available at Cricklewood Lodge Hotel.'
    },
    {
      keys: ['parking', 'car'],
      text: 'Parking can change by availability and local rules. Please contact the hotel before travelling if parking is important for your stay.'
    },
    {
      keys: ['children', 'family', 'kid'],
      text: 'Children of any age are welcome. Family room options are available for up to 4 guests.'
    },
    {
      keys: ['airport', 'heathrow', 'gatwick', 'luton', 'city airport'],
      text: 'Heathrow is about 46 minutes by car, depending on traffic. For all airports, check Google Maps or TfL before leaving because routes change with traffic and engineering works.'
    },
    {
      keys: ['kilburn', 'station', 'tube', 'train', 'transport', 'underground', 'rail'],
      text: 'Kilburn Underground on the Jubilee line and Cricklewood rail station are close to the hotel. Google Maps gives the best live route from the hotel.'
    },
    {
      keys: ['book', 'availability', 'price', 'date', 'reserve'],
      text: 'Use the Book Now or availability search on the website to check live dates and prices. For special requests, contact the hotel directly.'
    },
    {
      keys: ['phone', 'call', 'contact'],
      text: 'You can call the hotel on 020 8450 5546, or use the Contact page for the address and location details.'
    }
  ]
};

function assistantAnswer(question) {
  const clean = question.toLowerCase().replace(/[-_]/g, ' ');
  const match = hotelAssistant.answers.find((item) => item.keys.some((key) => clean.includes(key)));
  if (match) return match.text;
  return 'I can help with rooms, check-in times, WiFi, Wembley travel, Google Maps directions, family stays and guest services. For live prices or very specific requests, please use Book Now or call the hotel.';
}

function createHotelAssistant() {
  if (document.querySelector('[data-hotel-chat]')) return;

  const chat = document.createElement('section');
  chat.className = 'hotel-chat';
  chat.dataset.hotelChat = 'true';
  chat.innerHTML = `
    <button class="hotel-chat-toggle" type="button" aria-label="Open hotel assistant" aria-expanded="false"><span>AI</span></button>
    <div class="hotel-chat-panel" role="dialog" aria-label="Cricklewood Lodge Hotel assistant">
      <div class="hotel-chat-head">
        <div><strong>Hotel Assistant</strong><span>Ask about rooms, travel and services.</span></div>
        <button class="hotel-chat-close" type="button" aria-label="Close hotel assistant">x</button>
      </div>
      <div class="hotel-chat-messages" aria-live="polite"></div>
      <div class="hotel-chat-quick"></div>
      <form class="hotel-chat-form">
        <input type="text" aria-label="Ask the hotel assistant" placeholder="Ask a question..." autocomplete="off">
        <button type="submit">Ask</button>
      </form>
    </div>
  `;

  const toggle = chat.querySelector('.hotel-chat-toggle');
  const close = chat.querySelector('.hotel-chat-close');
  const messages = chat.querySelector('.hotel-chat-messages');
  const quick = chat.querySelector('.hotel-chat-quick');
  const form = chat.querySelector('.hotel-chat-form');
  const input = chat.querySelector('input');

  const addMessage = (text, type = 'bot') => {
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const ask = (text) => {
    const question = text.trim();
    if (!question) return;
    addMessage(question, 'user');
    window.setTimeout(() => addMessage(assistantAnswer(question)), 180);
  };

  hotelAssistant.quick.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => ask(label));
    quick.appendChild(button);
  });

  toggle.addEventListener('click', () => {
    const open = chat.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    if (open && !messages.children.length) addMessage(hotelAssistant.welcome);
    if (open) input.focus();
  });

  close.addEventListener('click', () => {
    chat.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
    input.value = '';
  });

  document.body.appendChild(chat);
}

createHotelAssistant();
