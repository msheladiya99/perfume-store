# Zevaro Perfumes development prototype

Run `npm install && npm run dev`. The prototype starts on the street, animates an entrance shutter, and provides first-person navigation, Zevaro bottle inspection, a React Three Fiber product viewer, and an in-memory trolley. Next.js/TypeScript wraps an existing imperative Three.js scene; the main showroom has not yet been converted to React Three Fiber.

This is not a production store: the six product names, images and ₹299 price were supplied by the owner, but no real inventory or account service is connected, and checkout is intentionally unavailable. It does not collect payment. Realistic human models, coordinated activities, usable navigation for NPCs, actual catalog, order storage, admin, and secure server-side Razorpay verification are still required. See `public/assets/characters/README.md` for the exact asset integration contract. Do not insert API keys into client code or the repository.
