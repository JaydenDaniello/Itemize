export const DEMO_STORES = [
  {
    slug: "aldi",
    name: "Aldi",
    address: "2451 S Hiawassee Rd",
    city: "Orlando",
    state: "FL",
    zip: "32835",
  },
  {
    slug: "walmart",
    name: "Walmart",
    address: "8990 Turkey Lake Rd",
    city: "Orlando",
    state: "FL",
    zip: "32819",
  },
  {
    slug: "whole-foods",
    name: "Whole Foods",
    address: "8003 Turkey Lake Rd",
    city: "Orlando",
    state: "FL",
    zip: "32819",
  },
] as const;

export const DEMO_STORE_NAMES = DEMO_STORES.map((store) => store.name);

const DEMO_STORE_NAME_SET = new Set(
  DEMO_STORE_NAMES.map((name) => name.toLowerCase())
);

export function isDemoStoreName(name: string) {
  return DEMO_STORE_NAME_SET.has(name.trim().toLowerCase());
}
