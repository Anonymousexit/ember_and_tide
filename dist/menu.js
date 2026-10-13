const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

// Illustrative dishes. Restaurant-approved availability, allergens and prices can be added here.
const selections = {
  food: [
    { id: 'starters', title: 'Small beginnings.', note: 'A first bite. A good start.', items: [
      ['Warm sourdough', 'Cultured butter, smoked sea salt.', 'For the table'],
      ['Burrata & heirloom tomatoes', 'Peach, basil oil, toasted sourdough.'],
      ['Beef tartare', 'Caper, shallot, cured egg yolk, crisp potato.'],
      ['Roasted beetroot', 'Whipped goat’s cheese, walnut, blackberry.'],
      ['Crispy artichokes', 'Lemon aioli, parsley, aged Parmesan.'],
      ['Wild mushroom croquettes', 'Truffle cream, chives, a little sea salt.'],
      ['Chicken liver parfait', 'Cherry preserve, warm brioche, pickled shallot.'],
      ['Baked oysters', 'Herb butter, breadcrumbs, fresh lemon.']
    ]},
    { id: 'mains', title: 'From the land.', note: 'A little fire. A lot of flavour.', items: [
      ['Roast duck', 'Young carrots, sweet onion, garden greens, glossy jus.', 'House favourite'],
      ['Dry-aged ribeye', 'Charred shallot, peppercorn butter, rosemary fries.'],
      ['Slow-braised short rib', 'Silky potato purée, red wine jus, crispy leeks.'],
      ['Herb-crusted lamb', 'Pea purée, spring vegetables, mint jus.'],
      ['Roast corn-fed chicken', 'Wild mushrooms, fondant potato, thyme sauce.'],
      ['Wild mushroom risotto', 'Aged Parmesan, fresh thyme, truffle oil.'],
      ['Brown butter gnocchi', 'Roasted squash, sage, hazelnut, shaved Parmesan.'],
      ['Charred aubergine', 'Tahini, pomegranate, spiced chickpeas, flatbread.'],
      ['Roasted cauliflower', 'Brown butter, almond, caper, golden raisin.']
    ]},
    { id: 'seafood', title: 'A taste of the tide.', note: 'Fresh, bright, beautifully simple.', image: 'seafood', items: [
      ['Scallop & lobster', 'Sea herbs, charred fennel, shellfish foam.', 'Our signature'],
      ['Pan-roasted sea bass', 'Saffron potatoes, fennel, lemon beurre blanc.'],
      ['Grilled king prawns', 'Garlic butter, chilli, parsley, grilled lemon.'],
      ['Miso-glazed salmon', 'Sesame greens, pickled cucumber, ginger broth.'],
      ['Mussels in white wine', 'Cream, shallot, parsley, crusty bread.'],
      ['Crab linguine', 'Cherry tomato, chilli, lemon, fresh herbs.']
    ]},
    { id: 'sides', title: 'Better together.', note: 'A little something on the side.', items: [
      ['Rosemary fries', 'Crisp, golden, sea-salted.'],
      ['Truffle & Parmesan fries', 'Freshly grated Parmesan, chives.'],
      ['Garden greens', 'Tender leaves, lemon vinaigrette.'],
      ['Charred broccolini', 'Toasted almonds, chilli, garlic.'],
      ['Buttery potato purée', 'Smooth, rich, wonderfully simple.'],
      ['Roasted seasonal vegetables', 'Herb oil, flaky salt.']
    ]},
    { id: 'desserts', title: 'The happy ending.', note: 'Stay for one more spoonful.', image: 'dessert', items: [
      ['Chocolate & wild berries', 'Dark chocolate, berry sorbet, pistachio crumble.', 'Worth staying for'],
      ['Vanilla bean crème brûlée', 'A crisp caramel top, buttery shortbread.'],
      ['Warm apple tarte tatin', 'Caramelised apple, vanilla ice cream.'],
      ['Lemon & elderflower posset', 'Seasonal berries, almond tuile.'],
      ['Burnt Basque cheesecake', 'Soft centre, roasted strawberry compote.'],
      ['Sticky toffee pudding', 'Warm date sponge, salted toffee, vanilla ice cream.'],
      ['Seasonal sorbet trio', 'Three fresh flavours, chosen with the season.']
    ]}
  ],
  drinks: [
    { id: 'cocktails', title: 'In good spirits.', note: 'A well-made drink changes the evening.', items: [
      ['Ember Old Fashioned', 'Bourbon, smoked maple, aromatic bitters.', 'House pour'],
      ['Tide Martini', 'Gin, dry vermouth, a whisper of olive brine.'],
      ['Blood Orange Negroni', 'Gin, bitter orange, sweet vermouth.'],
      ['Garden Gimlet', 'Gin, cucumber, basil, fresh lime.'],
      ['Passionfruit Margarita', 'Tequila, passionfruit, lime, chilli salt.'],
      ['Pear & Ginger Mule', 'Vodka, pear, fresh lime, ginger beer.'],
      ['Espresso Martini', 'Vodka, coffee liqueur, freshly pulled espresso.'],
      ['Sunset Spritz', 'Bitter orange aperitif, prosecco, soda.']
    ]},
    { id: 'wine', title: 'By the glass.', note: 'Thoughtful pours for every plate.', image: 'wine', items: [
      ['Sauvignon Blanc', 'Crisp citrus, gooseberry, a bright mineral finish.'],
      ['Chardonnay', 'Ripe orchard fruit, a little oak, a generous finish.'],
      ['Pinot Grigio', 'Light, fresh, with pear and lemon blossom.'],
      ['Dry Rosé', 'Summer berries, delicate florals, beautifully dry.'],
      ['Pinot Noir', 'Red cherry, gentle spice, silky tannins.'],
      ['Malbec', 'Dark plum, violet, a warm and generous finish.'],
      ['Cabernet Sauvignon', 'Blackcurrant, cedar, deep structure.'],
      ['Prosecco', 'Fine bubbles, green apple, fresh pear.'],
      ['Champagne Brut', 'Citrus, brioche, a little celebration.']
    ]},
    { id: 'zero-proof', title: 'All the spirit.', note: 'Beautiful drinks, without the alcohol.', items: [
      ['Garden Fizz', 'Cucumber, elderflower, lime, sparkling water.'],
      ['Hibiscus & Berry Cooler', 'Hibiscus tea, mixed berries, a squeeze of lemon.'],
      ['Pineapple & Ginger', 'Fresh pineapple, fiery ginger, mint.'],
      ['Citrus Grove', 'Orange, grapefruit, rosemary, soda.'],
      ['Peach Iced Tea', 'Black tea, peach, lemon, fresh mint.'],
      ['Still or sparkling water', 'The essential accompaniment.']
    ]},
    { id: 'coffee', title: 'One for the road.', note: 'Or an excuse to stay a little longer.', items: [
      ['Espresso', 'Short, rich, freshly pulled.'],
      ['Flat white', 'Double espresso, silky steamed milk.'],
      ['Cappuccino', 'Espresso, steamed milk, a soft crown of foam.'],
      ['Loose-leaf tea', 'English breakfast, Earl Grey, mint or chamomile.'],
      ['Hot chocolate', 'Dark chocolate, warm milk, a little indulgence.']
    ]}
  ]
};

const page = $('#menu-page');
const home = $('#main');
const header = $('#header');
const curtain = $('.page-curtain');
const content = $('#menu-content');
const allCategories = Object.values(selections).flat();
let activeCollection = '';
let homeScroll = 0;
let homeHash = '#food';
let homeTrigger;
let openedFromHome = false;
let transitioning = false;
let renderedRoute = '';
let categoryObserver;

function route() {
  const match = location.hash.match(/^#menu(?:\/([a-z-]+))?$/);
  if (!match) return null;
  const key = match[1] || 'food';
  const collection = key === 'drinks' || selections.drinks.some(c => c.id === key) ? 'drinks' : 'food';
  return { collection, category: allCategories.some(c => c.id === key) ? key : null };
}

function renderMenu(collection) {
  if (activeCollection === collection) return;
  activeCollection = collection;
  const sections = selections[collection];
  const count = sections.reduce((sum, section) => sum + section.items.length, 0);
  $('.menu-total').textContent = `${String(count).padStart(2, '0')} things to fall for`;
  $$('.menu-collections button').forEach(button => {
    const selected = button.dataset.collection === collection;
    button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
  });
  content.setAttribute('aria-labelledby', `collection-${collection}`);
  $('#menu-cover-image').src = `assets/${collection === 'drinks' ? 'wine' : 'seafood'}.webp`;
  $('#menu-cover-image').alt = collection === 'drinks' ? 'A chilled selection of wine and champagne' : 'Seared scallop and lobster, finished with herbs';
  $('#menu-category-nav').innerHTML = sections.map((section, index) => `<a href="#menu-section-${section.id}" data-menu-anchor="${section.id}"><span>${String(index + 1).padStart(2, '0')}</span>${section.title}<span>↘</span></a>`).join('');
  content.innerHTML = sections.map((section, index) => `<section class="menu-chapter" id="menu-section-${section.id}" aria-labelledby="chapter-${section.id}"><div class="chapter-heading"><span class="chapter-number">${String(index + 1).padStart(2, '0')}</span><div><h2 id="chapter-${section.id}">${section.title}</h2><p>${section.note}</p></div><span class="chapter-count">${section.items.length} selections</span></div>${section.image ? `<div class="chapter-photo"><img src="assets/${section.image}.webp" alt="${section.image === 'wine' ? 'Wines served chilled' : section.image === 'dessert' ? 'Chocolate and berry dessert' : 'Scallop and lobster plate'}" loading="lazy"></div>` : ''}<div class="menu-dishes">${section.items.map(([name, description, tag], i) => `<article class="menu-dish" style="--dish-order:${i % 4}"><div class="menu-dish-top"><h3>${name}</h3>${tag ? `<span class="dish-tag">${tag}</span>` : ''}</div><p>${description}</p></article>`).join('')}</div></section>`).join('');
  categoryObserver?.disconnect();
  categoryObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('chapter-visible');
        $$('#menu-category-nav a').forEach(link => {
          const active = link.dataset.menuAnchor === entry.target.id.replace('menu-section-', '');
          if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        });
      }
    });
  }, { threshold: .08, rootMargin: '-100px 0px -15% 0px' });
  $$('.menu-chapter').forEach(section => categoryObserver.observe(section));
}

function instantScroll(y) { window.scrollTo({ top: y, behavior: 'instant' }); }
function positionMenu(target) {
  if (target.category) instantScroll(Math.max(0, $(`#menu-section-${target.category}`).getBoundingClientRect().top + scrollY - 110));
  else instantScroll(0);
}

async function curtainStep(from, to, duration) {
  if (reduced.matches) return;
  const animation = curtain.animate([{ transform: `translateY(${from}%)` }, { transform: `translateY(${to}%)` }], { duration, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
  await animation.finished;
  curtain.style.transform = `translateY(${to}%)`;
  animation.cancel();
}

async function syncRoute() {
  if (transitioning) return;
  const target = route();
  const menuWasOpen = !page.hidden;
  if (!target && !menuWasOpen) return;
  if (target && menuWasOpen) {
    renderMenu(target.collection);
    if (target.category) positionMenu(target);
    else instantScroll($('.menu-collection-bar').getBoundingClientRect().top + scrollY - $('.menu-page-header').offsetHeight);
    renderedRoute = location.hash;
    if (!reduced.matches) content.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
    return;
  }
  transitioning = true;
  if (!menuWasOpen) homeScroll = scrollY;
  document.body.classList.add('page-changing');
  document.body.style.overflow = 'hidden';
  curtain.hidden = false; curtain.style.transform = 'translateY(100%)';
  home.inert = true; page.inert = true; header.inert = true;
  try {
    await curtainStep(100, 0, 590);
    // Read the latest destination so rapid Back/Forward navigation cannot show a stale page.
    const destination = route();
    renderedRoute = location.hash;
    const showMenu = !!destination;
    home.hidden = showMenu; header.hidden = showMenu; page.hidden = !showMenu;
    document.body.classList.toggle('on-menu-page', showMenu);
    $('.skip').href = showMenu ? '#menu-title' : '#main';
    document.title = showMenu ? 'The Menu — Ember & Tide' : 'Ember & Tide — A little wild. A lot of soul.';
    if (showMenu) { renderMenu(destination.collection); positionMenu(destination); }
    else instantScroll(homeScroll);
    await curtainStep(0, -100, 690);
    home.inert = showMenu; header.inert = showMenu; page.inert = !showMenu;
    if (showMenu) $('#menu-title').focus({ preventScroll: true });
    else homeTrigger?.focus({ preventScroll: true });
  } finally {
    curtain.hidden = true;
    document.body.classList.remove('page-changing');
    document.body.style.overflow = '';
    transitioning = false;
  }
  if (renderedRoute !== location.hash) syncRoute();
}

function openMenu(key, trigger) {
  if (page.hidden) { homeHash = location.hash || '#food'; homeTrigger = trigger; openedFromHome = true; }
  location.hash = `menu/${key}`;
}
$$('[data-menu]').forEach(button => button.addEventListener('click', () => openMenu(button.dataset.menu === 'drinks' ? 'drinks' : 'food', button)));
$$('[data-dish]').forEach(button => button.addEventListener('click', () => openMenu(({ seafood: 'seafood', duck: 'mains', dessert: 'desserts' })[button.dataset.dish], button)));
$$('[data-return-home]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); location.hash = openedFromHome ? homeHash : '#home'; }));
$$('[data-collection]').forEach(button => {
  button.addEventListener('click', () => { if (activeCollection !== button.dataset.collection) location.hash = `menu/${button.dataset.collection}`; });
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'food' : event.key === 'End' ? 'drinks' : activeCollection === 'food' ? 'drinks' : 'food';
    location.hash = `menu/${next}`; $(`#collection-${next}`).focus();
  });
});
$('#menu-category-nav').addEventListener('click', event => {
  const link = event.target.closest('[data-menu-anchor]'); if (!link) return;
  event.preventDefault(); const section = $(`#menu-section-${link.dataset.menuAnchor}`);
  section.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
});
// The skip link changes focus without leaving the menu route.
$('.skip').addEventListener('click', event => { if (!page.hidden) { event.preventDefault(); $('#menu-title').focus(); $('#menu-title').scrollIntoView(); } });
addEventListener('hashchange', syncRoute);
curtain.hidden = true;
page.inert = true;
if (route()) syncRoute();
