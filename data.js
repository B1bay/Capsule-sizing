// ============================================================================
// CAPSULE SIZING & PACKAGING REFERENCE DATA
// Source: Capsule sizing.xlsx
// Easily update or add rows for Capsuline, Capsule Depot, or Pet Caps below.
// ============================================================================

const CAPSULE_DATA = {
  "capsuline": {
    id: "capsuline",
    name: "Capsuline",
    subtitle: "Standard & Separated Capsule Packaging Specifications",
    badge: "Primary Catalog",
    hasSeparated: true,
    note: null,
    sizes: [
      {
        size: "0",
        label: "Size 0",
        items: [
          { quantity: 100, weight: "0.8 oz", packaging: "Small Silver" },
          { quantity: 200, weight: "1.0 oz", packaging: "Medium Silver" },
          { quantity: 500, weight: "2.2 oz", packaging: "7x8 Blue" },
          { quantity: 1000, weight: "4.2 oz", packaging: "8x10 Blue" },
          { quantity: 5000, weight: "1.2 lb", packaging: "13x15" },
          { quantity: 10000, weight: "2.5 lb", packaging: "18x20" },
          { quantity: 25000, weight: "55 lb", packaging: "Large Bag" },
          { quantity: 50000, weight: "11 lb", packaging: "Large Bag" },
          { quantity: 100000, weight: "22 lb", packaging: "Large Bag" }
        ],
        separated: [
          { quantity: 1000, bodyWeight: "3 oz", bodyBag: "8x10", capWeight: "2.1 oz", capBag: "7x8" },
          { quantity: 5000, bodyWeight: "13 oz", bodyBag: "18x20", capWeight: "9 oz", capBag: "13x15" },
          { quantity: 10000, bodyWeight: "1.5 lb", bodyBag: "18x20", capWeight: "1 lb", capBag: "13x15" },
          { quantity: 50000, bodyWeight: "7 lb", bodyBag: "28x30", capWeight: "4.7 lb", capBag: "18x20" }
        ]
      },
      {
        size: "00",
        label: "Size 00",
        items: [
          { quantity: 100, weight: "0.9 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "2.9 oz", packaging: "8x10 Blue (7x8 Short)" },
          { quantity: 1000, weight: "5.2 oz", packaging: "10x12 Blue" },
          { quantity: 5000, weight: "1.5 lb", packaging: "18x20" },
          { quantity: 10000, weight: "3 lb", packaging: "18x20" },
          { quantity: 50000, weight: "15 lb", packaging: "Not Specified" },
          { quantity: 100000, weight: "30 lb", packaging: "Not Specified" }
        ],
        separated: [
          { quantity: 1000, bodyWeight: "3.6 oz", bodyBag: "8x10", capWeight: "2.7 oz", capBag: "8x10" },
          { quantity: 5000, bodyWeight: "14.5 oz", bodyBag: "18x20", capWeight: "9.5 oz", capBag: "13x15" },
          { quantity: 10000, bodyWeight: "2 lb", bodyBag: "18x20", capWeight: "1.4 lb", capBag: "13x15" }
        ]
      },
      {
        size: "00E",
        label: "Size 00E",
        items: [
          { quantity: 500, weight: "3.2 oz", packaging: "7x11" },
          { quantity: 5000, weight: "1.10 lb", packaging: "18x20" }
        ],
        separated: []
      },
      {
        size: "000",
        label: "Size 000",
        items: [
          { quantity: 100, weight: "1.2 oz", packaging: "6x9 Medium Silver" },
          { quantity: 500, weight: "3.6 oz", packaging: "8x10 Blue" },
          { quantity: 1000, weight: "6.5 oz", packaging: "10x12 Blue" },
          { quantity: 5000, weight: "1.9 lb", packaging: "18x20" },
          { quantity: 10000, weight: "3.9 lb", packaging: "20x24" }
        ],
        separated: []
      },
      {
        size: "1",
        label: "Size 1",
        items: [
          { quantity: 100, weight: "0.7 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "1.9 oz", packaging: "7x8 Blue" },
          { quantity: 1000, weight: "3.4 oz", packaging: "8x10 Blue" },
          { quantity: 5000, weight: "14 oz", packaging: "13x15" },
          { quantity: 10000, weight: "1.9 lb", packaging: "18x20" },
          { quantity: 50000, weight: "12.5 lb", packaging: "Not Specified" },
          { quantity: 50000, weight: "4.2 kg", packaging: "28x30", variantNote: "Metric / Bulk" }
        ],
        separated: []
      },
      {
        size: "2",
        label: "Size 2",
        items: [
          { quantity: 200, weight: "0.7 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "1.6 oz", packaging: "Not Specified" },
          { quantity: 1000, weight: "2.4 oz", packaging: "8x10 Blue" },
          { quantity: 5000, weight: "10 oz", packaging: "10x12 Blue" },
          { quantity: 10000, weight: "1.7 lb", packaging: "13x15" },
          { quantity: 50000, weight: "5.3 lb", packaging: "20x24" }
        ],
        separated: []
      },
      {
        size: "3",
        label: "Size 3",
        items: [
          { quantity: 100, weight: "0.5 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "1.5 oz", packaging: "7x8 Blue" },
          { quantity: 1000, weight: "2.2 oz", packaging: "7x8 Blue" },
          { quantity: 5000, weight: "9.5 oz", packaging: "10x12 Blue" },
          { quantity: 10000, weight: "1.2 lb", packaging: "13x15" },
          { quantity: 50000, weight: "5.3 lb", packaging: "20x24" }
        ],
        separated: []
      },
      {
        size: "4",
        label: "Size 4",
        items: [
          { quantity: 100, weight: "0.3 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "1.4 oz", packaging: "Small Silver" },
          { quantity: 1000, weight: "1.8 oz", packaging: "7x8 Blue" },
          { quantity: 5000, weight: "7.6 oz", packaging: "10x12 Blue" },
          { quantity: 10000, weight: "15 oz", packaging: "13x15" },
          { quantity: 50000, weight: "4.12 lb", packaging: "20x24" }
        ],
        separated: []
      },
      {
        size: "5",
        label: "Size 5",
        items: [
          { quantity: 100, weight: "0.5 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "0.9 oz", packaging: "Medium Silver" },
          { quantity: 1000, weight: "1.5 oz", packaging: "7x8 Blue" },
          { quantity: 5000, weight: "6.5 oz", packaging: "10x12 Blue" },
          { quantity: 10000, weight: "12.5 oz", packaging: "13x15" },
          { quantity: 50000, weight: "3.8 lb", packaging: "18x20" },
          { quantity: 200000, weight: "13.3 lb", packaging: "28x30" }
        ],
        separated: []
      }
    ]
  },

  "capsule-depot": {
    id: "capsule-depot",
    name: "Capsule Depot",
    subtitle: "Standard Capsule Packaging & Weight Specifications",
    badge: "Distribution Partner",
    hasSeparated: false,
    note: null,
    sizes: [
      {
        size: "0",
        label: "Size 0",
        items: [
          { quantity: 100, weight: "0.8 oz", packaging: "Small Silver" },
          { quantity: 200, weight: "1.0 oz", packaging: "Medium Silver" },
          { quantity: 500, weight: "2.2 oz", packaging: "6x11" },
          { quantity: 1000, weight: "4.2 oz", packaging: "7x11" },
          { quantity: 5000, weight: "1.2 lb", packaging: "13x15" },
          { quantity: 10000, weight: "2.5 lb", packaging: "18x20" }
        ],
        separated: []
      },
      {
        size: "00",
        label: "Size 00",
        items: [
          { quantity: 100, weight: "0.9 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "2.9 oz", packaging: "7x11" },
          { quantity: 1000, weight: "5.2 oz", packaging: "9x13" },
          { quantity: 5000, weight: "1.5 lb", packaging: "18x20" },
          { quantity: 10000, weight: "3 lb", packaging: "18x20" }
        ],
        separated: []
      },
      {
        size: "000",
        label: "Size 000",
        items: [
          { quantity: 100, weight: "1.2 oz", packaging: "Medium Silver" },
          { quantity: 500, weight: "3.6 oz", packaging: "7x11" },
          { quantity: 1000, weight: "6.5 oz", packaging: "9x13" },
          { quantity: 5000, weight: "1.9 lb", packaging: "18x20" },
          { quantity: 10000, weight: "3.9 lb", packaging: "20x24" }
        ],
        separated: []
      },
      {
        size: "1",
        label: "Size 1",
        items: [
          { quantity: 100, weight: "0.7 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "1.9 oz", packaging: "6x11" },
          { quantity: 1000, weight: "3.4 oz", packaging: "7x11" },
          { quantity: 5000, weight: "14 oz", packaging: "13x15" },
          { quantity: 10000, weight: "20 lb", packaging: "18x20" }
        ],
        separated: []
      },
      {
        size: "2",
        label: "Size 2",
        items: [
          { quantity: 100, weight: "0.9 oz", packaging: "Silver Bag" },
          { quantity: 200, weight: "0.7 oz", packaging: "Silver" },
          { quantity: 500, weight: "1.6 oz", packaging: "Not Specified" },
          { quantity: 1000, weight: "2.4 oz", packaging: "7x11" },
          { quantity: 5000, weight: "10 oz", packaging: "10x12" },
          { quantity: 10000, weight: "1.7 lb", packaging: "13x15" }
        ],
        separated: []
      },
      {
        size: "3",
        label: "Size 3",
        items: [
          { quantity: 100, weight: "0.5 oz", packaging: "Small Silver" },
          { quantity: 500, weight: "1.5 oz", packaging: "6x11" },
          { quantity: 1000, weight: "2.2 oz", packaging: "6x11" },
          { quantity: 5000, weight: "9.5 oz", packaging: "9x13" },
          { quantity: 10000, weight: "1.2 lb", packaging: "13x15" }
        ],
        separated: []
      },
      {
        size: "4",
        label: "Size 4",
        items: [
          { quantity: 500, weight: "1.4 oz", packaging: "6x11" },
          { quantity: 1000, weight: "1.8 oz", packaging: "6x11 Clear" },
          { quantity: 5000, weight: "7.6 oz", packaging: "9x13" },
          { quantity: 10000, weight: "15 oz", packaging: "13x15" }
        ],
        separated: []
      }
    ]
  },

  "pet-caps": {
    id: "pet-caps",
    name: "Pet Caps",
    subtitle: "Veterinary & Pet Capsule Packaging Specifications",
    badge: "Veterinary Line",
    hasSeparated: false,
    note: null,
    sizes: [
      {
        size: "3",
        label: "Size 3",
        items: [
          { quantity: 100, weight: "3 oz", packaging: "Pet Cap Bags" }
        ],
        separated: []
      }
    ]
  }
};
