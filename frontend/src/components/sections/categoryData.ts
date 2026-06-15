export type Category = { id: string; label: string; emoji: string; count?: number };

export const CATEGORIES: Category[] = [
  { id: 'all',         label: 'All Items',  emoji: '✦', count: 26 },
  { id: 'Coffee',      label: 'Coffee',     emoji: '☕', count: 6  },
  { id: 'Tea',         label: 'Tea',        emoji: '🍵', count: 3  },
  { id: 'Burgers',     label: 'Burgers',    emoji: '🍔', count: 3  },
  { id: 'Pizza',       label: 'Pizza',      emoji: '🍕', count: 3  },
  { id: 'Sandwiches',  label: 'Sandwiches', emoji: '🥪', count: 2  },
  { id: 'Desserts',    label: 'Desserts',   emoji: '🍰', count: 3  },
  { id: 'Beverages',   label: 'Beverages',  emoji: '🥤', count: 2  },
  { id: 'Breakfast',   label: 'Breakfast',  emoji: '🍳', count: 2  },
  { id: 'Pasta',       label: 'Pasta',      emoji: '🍝', count: 2  },
];
