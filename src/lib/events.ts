// Each year, bump the event key so a fresh, empty sign-up sheet starts.
// Old rows stay in the database under the previous key.

export type SignupCategory = {
  key: string;
  title: string;
  subtitle?: string;
  addText: string;
  editText: string;
  placeholder1: string;
  placeholder2: string;
  // Second column is a count rather than an item name
  numeric?: boolean;
};

export type EventConfig = {
  key: string;
  categories: SignupCategory[];
};

// Shown in the hero on desktop and under the RSVP key on phones
export const SOUP_AFTER = "Volleyball, and pickleball on courts 13A and 13B from 8 to 9 PM";

export const SOUP_EVENT: EventConfig = {
  key: "soup-2026",
  categories: [
    { key: "attendees", title: "Attendees", addText: "RSVP", editText: "Edit the list", placeholder1: "Family name", placeholder2: "How many", numeric: true },
    { key: "soups", title: "Soups", addText: "Add a soup", editText: "Edit the list", placeholder1: "Family name", placeholder2: "Soup" },
    { key: "bread", title: "Bread", addText: "Add bread", editText: "Edit the list", placeholder1: "Family name", placeholder2: "Bread" },
    { key: "beverages", title: "Beverages", addText: "Add a drink", editText: "Edit the list", placeholder1: "Family name", placeholder2: "Drink" },
    { key: "desserts", title: "Desserts", addText: "Add a dessert", editText: "Edit the list", placeholder1: "Family name", placeholder2: "Dessert" },
    { key: "misc", title: "Miscellaneous", addText: "Add something else", editText: "Edit the list", placeholder1: "Family name", placeholder2: "Item" },
    { key: "tables", title: "Tables", addText: "Add tables", editText: "Edit the list", placeholder1: "Family name", placeholder2: "How many", numeric: true },
    { key: "pickleballPlayers", title: "Pickleball players", addText: "Sign up to play", editText: "Edit the list", placeholder1: "Name", placeholder2: "How many", numeric: true },
  ],
};

export const CHRISTMAS_EVENT: EventConfig = {
  key: "christmas-2026",
  categories: [
    { key: "attendees", title: "Attendees", addText: "Add to Attendees", editText: "Make Change to Attendees", placeholder1: "Name of Family", placeholder2: "Number", numeric: true },
    { key: "main", title: "Main Dishes", subtitle: "Mexican dishes", addText: "Add to Main Dishes", editText: "Make Change to Main Dishes", placeholder1: "Name of Family", placeholder2: "Item Name" },
    { key: "side", title: "Side Dishes", subtitle: "Chips, Salsa, Tortillas, sour cream, cheese, guacamole, fruit, etc...", addText: "Add to Side Dishes", editText: "Make Change to Side Dishes", placeholder1: "Name of Family", placeholder2: "Item Name" },
    { key: "desserts", title: "Desserts", addText: "Add to Desserts", editText: "Make Change to Desserts", placeholder1: "Name of Family", placeholder2: "Item Name" },
  ],
};

export const EVENTS = [SOUP_EVENT, CHRISTMAS_EVENT];

export function getEvent(key: string) {
  return EVENTS.find((e) => e.key === key);
}
