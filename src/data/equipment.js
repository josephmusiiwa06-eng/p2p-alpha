export const equipmentCategories = {
  standard: [
    'Balls (various sizes)',
    'Hoops',
    'Cones/Markers',
    'Beanbags',
    'Skipping Ropes',
    'Parachute',
    'Balance Beams',
    'Gymnastic Mats'
  ],
  lowResource: [
    'Chalk',
    'Sticks/Twigs',
    'Old Tyres',
    'Cardboard boxes/pieces',
    'Plastic bottles (empty or sand-filled)',
    'Dried Beans/Seeds',
    'Rope/String',
    'Stones/Pebbles',
    'Tin cans (safe edges)',
    'Bottle caps',
    'Old fabric/clothing scraps',
    'Newspaper'
  ],
  natural: [
    'Open grass space',
    'Trees (for shade or touching)',
    'Sand pit or loose dirt',
    'Flat ground',
    'Gentle slopes/hills',
    'Logs',
    'Leaves'
  ],
  improvised: [
    {
      name: 'Newspaper balls',
      howToMake: 'Crumple pages of old newspaper tightly into a ball shape. Wrap tightly with string or tape to secure.'
    },
    {
      name: 'Sock balls',
      howToMake: 'Roll pairs of old, clean socks into tight balls.'
    },
    {
      name: 'Plastic bag balls',
      howToMake: 'Stuff a plastic bag with other plastic bags or soft waste, tie it tightly, and wrap with tape.'
    },
    {
      name: 'Bottle cap counters',
      howToMake: 'Collect and wash plastic bottle caps. Use them for sorting, counting, or as markers.'
    },
    {
      name: 'Sand-filled sock beanbags',
      howToMake: 'Fill an old sock halfway with dry sand or dried beans. Tie a tight knot at the top.'
    },
    {
      name: 'Cardboard targets',
      howToMake: 'Cut circles or squares out of old cardboard boxes. Draw rings on them with a marker or charcoal.'
    },
    {
      name: 'Stick balance beams',
      howToMake: 'Find two long, relatively straight sticks. Place them parallel on the ground slightly apart to walk between, or use one thick sturdy branch to walk on.'
    },
    {
      name: 'Rope ladders',
      howToMake: 'Lay a rope on the ground in a zig-zag pattern, or use chalk to draw a ladder on the concrete.'
    }
  ]
};

export const equipmentSubstitutions = {
  'Cones': ['Stones', 'Plastic bottles', 'Drawn chalk circles', 'Shoes'],
  'Hoops': ['Circles drawn in sand/dirt', 'Tyres', 'Chalk rings', 'Ropes tied in circles'],
  'Beanbags': ['Sand-filled socks', 'Folded cloths', 'Small stones', 'Leaves'],
  'Balls': ['Newspaper balls', 'Sock balls', 'Rolled up fabric', 'Large round fruit (e.g., green oranges)'],
  'Balance Beams': ['Drawn lines', 'Long sticks', 'Edge of a concrete slab', 'Planks of wood'],
  'Targets': ['Cardboard boxes', 'Buckets', 'Trees (gently)', 'Circles on a wall'],
  'Skipping Ropes': ['Long vines', 'Knotted fabric strips', 'Sisal rope'],
  'Mats': ['Soft grass', 'Cardboard laid flat', 'Old blankets'],
  'Parachute': ['Large old bedsheet', 'Tarp'],
  'Agility Ladders': ['Drawn chalk grids', 'Sticks laid parallel on the ground']
};

export const allEquipment = [
  ...equipmentCategories.standard,
  ...equipmentCategories.lowResource,
  ...equipmentCategories.natural,
  ...equipmentCategories.improvised.map(i => i.name)
];
