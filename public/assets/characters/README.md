# Licensed character asset integration

No character models are bundled. Obtain six licensed, commercially usable, realistically proportioned, fully rigged GLB/glTF models with real-time optimized textures. Confirm the licence allows web distribution. Place the files here and enable the corresponding entries in `app/npcs.ts`:

- `male-browser.glb`: Idle, Walk, Browse, Inspect, ReturnProduct clips.
- `female-browser.glb`: Idle, Walk, Browse, Inspect, Compare clips.
- `fragrance-expert.glb`: Idle, Walk, Talk, Point, PickBottle, SprayBlotter, OfferBlotter clips.
- `testing-customer.glb`: Idle, Walk, Talk, ReceiveBlotter, SmellBlotter, React clips.
- `billing-customer.glb`: Idle, Wait, PlaceItems, Pay, ReceiveBag clips.
- `cashier.glb`: Idle, Scan, UseMonitor, PackBag, GiveBag clips.

Each file should be Y-up, metres scale, with its origin at the feet, face +Z, have skinned meshes and embedded animation clips. The exact named clips above are integration targets, not supplied animations. For coordinated prop transfers the model must expose named hand bones (for example `RightHand` and `LeftHand`); use the `attach` method in `app/npcs.ts` with the asset's actual bone names. Animations need matching authored timing and prop offsets; these sequences and waypoint behaviours are not implemented yet. Do not enable unlicensed assets. The existing mannequin is a temporary functional placeholder, not a realistic person.
