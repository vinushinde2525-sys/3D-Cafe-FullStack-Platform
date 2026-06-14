/**
 * foodImage.ts
 * Smart image resolver — maps food names to uploaded image assets.
 *
 * Resolution order:
 *  1. Exact slug match  (espresso-royale → espresso-royale.webp)
 *  2. Fuzzy token match (any filename containing all words of the food name)
 *  3. Category fallback (food-menu-N.png)
 *  4. Hard-coded aliases for known mismatches / typos in filenames
 */

const BASE = '/images/menu/';

// ── All uploaded image files (normalised slugs → actual filename) ─────────────
const UPLOADED: Record<string, string> = {
  'avocado-club-sandwich':   'avocado-club-sandwich.png',
  'bbq-chicken-pizza':       'bbq-chicken-pizza.png',
  'burnt-basque-cheesecake': 'burnt-basque-cheesecake.png',
  'caf-breakfast-platter':   'caf-breakfast-platter.png',
  'cappuccino-classico':     'cappuccino-classico.png',
  'caramel-cloud-latte':     'caramel-cloud-latte.webp',
  'cold-brew-float':         'cold-brew-float.jpg',
  'cold-brew-lemonade':      'cold-brew-lemonade.png',
  'crispy-chiken-burger':    'crispy-chiken-burger.png',
  'earl-grey-supreme':       'earl-grey-supreme.png',
  'eggs-benedict':           'eggs-benedict.png',
  'espresso-royale':         'espresso-royale.webp',
  'flat-white':              'flat-white.png',
  'food-menu-1':             'food-menu-1.png',
  'food-menu-2':             'food-menu-2.png',
  'food-menu-3':             'food-menu-3.png',
  'food-menu-4':             'food-menu-4.png',
  'food-menu-5':             'food-menu-5.png',
  'mango-sunrise-smoothie':  'mango-sunrise-smoothie.png',
  'masala-chai':             'masala-chai.png',          // new
  'matcha-ceremonial':       'matcha-ceremonial.png',
  'mushroom-swiss-burger':   'mushroom-swiss-burger.png',
  'penne-arrabbiata':        'penne-arrabbiata.png',
  'peri-peri-paneer-pizza':  'peri-peri-paneer-pizza.png',
  'tiramisu-classico':       'tiramisu-classico.webp',
  'truffle-mac-cheese':      'truffle-mac-cheese.png',
  'truffle-margherita':      'truffle-margherita.png',   // new clean version
  'truffle-margherita-image':'truffle-margherita-image.png',
  'wagyu-smash-burger':      'wagyu-smash-burger.png',   // new
};

// ── Manual aliases — food names that don't auto-resolve ──────────────────────
// Key = normalised food name slug, Value = UPLOADED key
const ALIASES: Record<string, string> = {
  // Iced Matcha → use Matcha Ceremonial image
  'iced-matcha-latte':       'matcha-ceremonial',
  // Wagyu now has its own file
  'wagyu-smash-burger':      'wagyu-smash-burger',
  // Crispy Chicken Burger → typo in uploaded file
  'crispy-chicken-burger':   'crispy-chiken-burger',
  // BLT Classic → food-menu-4
  'blt-classic':             'food-menu-4',
  // Mango Panna Cotta → food-menu-5
  'mango-panna-cotta':       'food-menu-5',
  // Masala Chai now has its own file
  'masala-chai':             'masala-chai',
  // Truffle Margherita — prefer clean version
  'truffle-margherita':      'truffle-margherita',
  'truffle-margherita-image':'truffle-margherita',
  // Truffle Mac & Cheese
  'truffle-mac--cheese':     'truffle-mac-cheese',
  'truffle-mac-cheese':      'truffle-mac-cheese',
  'truffle-mac-&-cheese':    'truffle-mac-cheese',
  // Café Breakfast Platter (various encodings)
  'cafe-breakfast-platter':  'caf-breakfast-platter',
  'caf-breakfast-platter':   'caf-breakfast-platter',
};

// ── Category fallbacks ────────────────────────────────────────────────────────
const CATEGORY_FALLBACKS: Record<string, string> = {
  Coffee:     'food-menu-1',
  Tea:        'food-menu-2',
  Burgers:    'food-menu-3',
  Pizza:      'food-menu-3',
  Sandwiches: 'food-menu-4',
  Desserts:   'food-menu-5',
  Beverages:  'food-menu-1',
  Breakfast:  'food-menu-4',
  Pasta:      'food-menu-3',
  Salads:     'food-menu-5',
};

/** Convert any food name string to a URL-safe slug */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&]/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Resolve a food item's image path.
 *
 * @param foodName  - e.g. "Crispy Chicken Burger"
 * @param category  - e.g. "Burgers" (used for fallback)
 * @returns full public path like "/images/menu/crispy-chiken-burger.png"
 */
export function getFoodImage(foodName: string, category = ''): string {
  const slug = toSlug(foodName);

  // 1. Direct slug match
  if (UPLOADED[slug]) return BASE + UPLOADED[slug];

  // 2. Alias match
  if (ALIASES[slug] && UPLOADED[ALIASES[slug]]) return BASE + UPLOADED[ALIASES[slug]];

  // 3. Fuzzy: every word in food name appears in some uploaded filename
  const words = slug.split('-').filter(w => w.length > 3);
  for (const [key, file] of Object.entries(UPLOADED)) {
    if (words.length > 0 && words.every(w => key.includes(w))) {
      return BASE + file;
    }
  }

  // 4. Category fallback
  const catKey = CATEGORY_FALLBACKS[category];
  if (catKey && UPLOADED[catKey]) return BASE + UPLOADED[catKey];

  // 5. Ultimate fallback
  return BASE + 'food-menu-1.png';
}

/**
 * Same as getFoodImage but takes the raw item.images[0].url first if it's
 * a valid /images/menu/ path (i.e. already resolved).
 */
export function resolveItemImage(
  itemImageUrl: string | undefined,
  foodName: string,
  category = '',
): string {
  if (itemImageUrl?.startsWith('/images/menu/')) return itemImageUrl;
  return getFoodImage(foodName, category);
}
