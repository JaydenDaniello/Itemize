# William's additions 4/21/2026

This document summarizes the larger demo/MVP changes added for the current presentation build, why they were added, and how they fit into the project.

## What Changed

### Recipe Search And Detail Flow

- Added real recipe search behavior on `/recipes`.
- Kept default recipe suggestions when no search term is entered.
- Improved recipe detail rendering for ingredients and cheapest-store context.
- Strengthened ingredient matching for demo-supported meals.

Why: the project demo needs a smooth recipe discovery flow that leads directly into cart building and store comparison.

### Ingredient Normalization And Matching

- Expanded ingredient normalization and alias handling.
- Added canonical matching for demo ingredients such as:
  - `chopped tomatoes`
  - `fenugreek`
  - `green chilli`
  - `red chilli flakes`
  - `Parmigiano-Reggiano`
- Improved fallback behavior when ingredients are stored or returned under different names.

Why: recipe APIs describe ingredients inconsistently. Reliable normalization is required to connect recipe ingredients to internal grocery items and store prices.

### Cart Combination And Editing

- Duplicate ingredients are combined across recipes instead of scattered into separate lines.
- Original measurements are preserved until another recipe addition requires combining.
- Cart rows support edit mode for quantity and measure changes.
- Cart items are grouped into:
  - `Ready to price`
  - `Needs review`

Why: the cart needed to feel like a usable shopping list, not just a raw ingredient dump from multiple recipes.

### Recipe Source Context In Cart

- Combined cart rows preserve recipe source tags.
- Tags show which recipes contributed to the ingredient and the measures that were added.
- Hydration logic now preserves those tags when DB-backed cart data reloads.

Why: once ingredients are merged, users need to understand where totals came from. This also makes the demo easier to explain.

### DB-Backed Cart Compatibility

- Updated the recipe-to-cart flow to work with authenticated DB-backed cart routes.
- Preserved the client-side cart UX layer while hydrating from server cart data.
- Improved cart hydration so canonical ingredient matches survive DB reloads.

Why: Jayden's backend changes made the cart user-owned in the database, so the UI needed to work with that model without losing the UX polish already built.

### Shopping Preferences

- Added shopping preference controls to the cart experience:
  - `Lowest cost`
  - `Fewest stops`
  - trip budget
- Preferences are now part of the cart/store-comparison flow.

Why: the proposal includes budget and convenience tradeoffs, so the UI needed a place to express those decisions before full optimization logic is complete.

### Store Comparison For Demo Stores

- Added a cart comparison section focused on:
  - `Aldi`
  - `Walmart`
  - `Whole Foods`
- Comparison totals now use the seeded demo pricing catalog.
- Store cards use real store details from the stores API where available.
- Missing counts and partial totals are shown when ingredients are not fully covered.

Why: this is the MVP bridge from recipe/cart work into the project's core promise: comparing grocery costs across stores.

### Routing Handoff

- Added a routing section to the cart page.
- Users can choose a store and open that destination in Google Maps.
- The cart uses the selected store's real address when available.

Why: routing needed a working MVP path for the demo without waiting on full maps distance/time integration.

### Demo Stabilization And Runtime Fixes

- Fixed duplicate cart row key/runtime issues.
- Fixed problems where some ingredients lost recipe source tags after DB hydration.
- Improved cart comparison stability for the selected demo stores.
- Kept the stores page unchanged while sourcing cart store info from the same backend data.

Why: these fixes were needed to make the current build stable enough for a live presentation.