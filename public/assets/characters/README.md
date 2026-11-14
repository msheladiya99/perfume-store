# Production character assets needed

No character models are bundled or enabled. Procure commercially licensed, distinctive realistic adult characters with web distribution rights, PBR skin/hair/clothing, anatomically correct hands, skinned humanoid rigs and web-compatible embedded glTF animations. Obtain or author corresponding motion-capture clips and confirm skeleton compatibility or retarget them offline. Do not assume an Unreal MetaHuman asset can be used directly in glTF or distributed on the web.

## Required files and activities

Five different, professionally dressed staff models:
- `fragrance-expert.glb` — men's perfume demonstration, talking and gestures.
- `floral-expert.glb` — assisting a customer with floral perfume.
- `oud-expert.glb` — oud demonstration.
- `gift-expert.glb` — showing gift sets.
- `testing-expert.glb` — tester-counter assistance.

One additional staff model: `cashier.glb` — waiting, scanning, using the monitor, packing and handing over a bag.

Eight distinct adult customer models: `male-browser.glb`, `female-browser.glb`, `testing-customer.glb`, `billing-customer.glb`, and `customer-5.glb` through `customer-8.glb`. Assets should include natural idle, browsing, talking, walking and the task-specific movements for their roles.

## Integration contract

Each GLB should use metres, Y-up, feet at origin, forward +Z, with `Idle` animation, skinned meshes, embedded textures and appropriately named bones. Specify exact hand bone names, facial morph names and animation clip names for each asset. Animations for passing bottles, caps, strips, products and bags must be authored or retargeted as synchronized pairs with compatible timing and attachment offsets. Include license/provenance and any attribution obligations with each asset. Web-ready mesh/texture LODs and mobile texture budgets are also needed.

Place approved files here, review positions/scales and enable individual entries in `app/npcs.ts`. The loader verifies that each file contains a skinned mesh and at least one animation, loads its idle clip, and exposes clip switching and attachment points. It does not create the requested retail sequences, inverse kinematics, facial animation, waypoint behaviours, animation/mesh LOD or lip sync: these must be implemented and tested against the selected rigs. A temporary service sign provides product advice without pretending to be a person.
