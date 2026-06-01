// Nespresso Vertuo catalog — US store (USD).
// Source: nespresso.com Vertuo coffee listing (captured 2026). Prices are per
// SLEEVE. Sleeves are 10 pods except the XL Coffees range, which are 7 pods.
// `pricePerPod` is derived (priceSleeve / podsPerSleeve).
//
// This is the app's offline price "database": pods in the collection are matched
// against it by name (see src/lib/matchPrice.js). A manual price always wins.

export const NESPRESSO_CATALOG = [
  // Nespresso | Blue Bottle
  { name: 'Bold Blend', description: 'Sweet Caramel & Biscuit', priceSleeve: 17.50, podsPerSleeve: 10 },
  { name: 'NOLA Style Blend', description: 'Coffee with Chicory flavor', priceSleeve: 15.50, podsPerSleeve: 10 },

  // Starbucks by Nespresso
  { name: 'Starbucks Veranda Blend', description: 'Toasted Malt & Baking Chocolate', priceSleeve: 16.20, podsPerSleeve: 10 },
  { name: 'Starbucks Pike Place Roast', description: 'Cocoa & Rich Praline', priceSleeve: 16.20, podsPerSleeve: 10 },
  { name: 'Starbucks Caffè Verona', description: 'Dark Cocoa & Caramelized', priceSleeve: 16.20, podsPerSleeve: 10 },
  { name: 'Starbucks Smooth Caramel', description: 'Buttery Caramel & Vanilla', priceSleeve: 16.20, podsPerSleeve: 10 },
  { name: 'Starbucks Creamy Vanilla', description: 'Sweet Vanilla & Shortbread Notes', priceSleeve: 16.20, podsPerSleeve: 10 },
  { name: 'Starbucks Single Origin Colombia', description: 'Toasted Walnut & Herbs', priceSleeve: 16.20, podsPerSleeve: 10 },
  { name: 'Starbucks Blonde Espresso Roast', description: 'Smooth & Sweet Notes', priceSleeve: 13.00, podsPerSleeve: 10 },
  { name: 'Starbucks Espresso Roast', description: 'Rich Molasses & Caramel', priceSleeve: 13.00, podsPerSleeve: 10 },

  // Nespresso | Samra Origins by The Weeknd
  { name: 'Tanzania', description: 'Citrus & Cereal', priceSleeve: 15.50, podsPerSleeve: 10 },
  { name: 'Togetherness Blend', description: 'Honey & Woody Notes', priceSleeve: 14.50, podsPerSleeve: 10 },

  // Nespresso Exclusives (Holiday Limited Edition)
  { name: 'Sweet Almond and Hibiscus', description: 'Roasted & Nutty', priceSleeve: 16.00, podsPerSleeve: 10 },
  { name: 'Cinnamon and Candied Tamarind', description: 'Spice & Caramel Notes', priceSleeve: 16.00, podsPerSleeve: 10 },

  // Barista Creations
  { name: 'Yuzu Vanilla Over Ice', description: 'Yuzu & Vanilla', priceSleeve: 15.50, podsPerSleeve: 10 },
  { name: 'Coconut Vanilla Flavor Over Ice', description: 'Coconut & Vanilla', priceSleeve: 16.00, podsPerSleeve: 10 },
  { name: 'French Lavender and Vanilla Decaffeinato', description: 'French Lavender & Vanilla', priceSleeve: 16.50, podsPerSleeve: 10 },
  { name: 'Pistachio Vanilla Flavor Over Ice', description: 'Pistachio & Vanilla', priceSleeve: 15.50, podsPerSleeve: 10 },
  { name: 'White Chocolate & Strawberry', description: 'White Chocolate & Strawberry', priceSleeve: 16.00, podsPerSleeve: 10 },
  { name: 'Peppermint Pinwheel', description: 'Candied & Sweet', priceSleeve: 16.00, podsPerSleeve: 10 },
  { name: 'Maple Pecan', description: 'Maple & Pecan Flavored', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Sweet Vanilla Decaffeinato', description: 'Creamy & Sweet', priceSleeve: 14.50, podsPerSleeve: 10 },
  { name: 'Sweet Vanilla', description: 'Creamy & Sweet', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Golden Caramel', description: 'Creamy & Biscuity', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Rich Chocolate', description: 'Creamy & Chocolatey', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Roasted Hazelnut', description: 'Rich & Nutty', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Ice Forte', description: 'Bold & Dark Roasted', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Ice Leggero', description: 'Fruity & Light', priceSleeve: 13.50, podsPerSleeve: 10 },
  { name: 'Bianco Forte', description: 'Dark Roasted & Balanced', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Bianco Piccolo', description: 'Nutty & Balanced', priceSleeve: 10.80, podsPerSleeve: 10 },
  { name: 'Bianco Doppio', description: 'Nutty & Balanced', priceSleeve: 13.50, podsPerSleeve: 10 },

  // Coffee (7.77 fl oz)
  { name: 'Café Joyeux', description: 'Sweet Caramel & Cereal', priceSleeve: 15.00, podsPerSleeve: 10 },
  { name: 'Intenso', description: 'Deep & Dense', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Stormio', description: 'Rich & Strong', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Odacio', description: 'Bold & Lively', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Melozio', description: 'Smooth & Balanced', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Melozio Decaffeinato', description: 'Smooth & Balanced', priceSleeve: 14.50, podsPerSleeve: 10 },
  { name: 'Solelio', description: 'Fruity & Light-Bodied', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Half Caffeinato', description: 'Sweet & Velvety', priceSleeve: 14.00, podsPerSleeve: 10 },

  // Double Espresso (2.7 fl oz)
  { name: 'Double Espresso Chiaro Decaffeinato', description: 'Woody & Toasted Cereal', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Double Espresso Dolce', description: 'Caramel & Malted Cereal', priceSleeve: 13.50, podsPerSleeve: 10 },
  { name: 'Double Espresso Scuro', description: 'Intensely Roasted & Cocoa', priceSleeve: 13.50, podsPerSleeve: 10 },
  { name: 'Double Espresso Chiaro', description: 'Woody & Toasted Cereal', priceSleeve: 13.50, podsPerSleeve: 10 },

  // Ristretto & Espresso (0.85–1.35 fl oz)
  { name: 'Ristretto Intenso', description: 'Spicy & Woody', priceSleeve: 10.80, podsPerSleeve: 10 },
  { name: 'Il Caffè', description: 'Intense & Velvety', priceSleeve: 10.80, podsPerSleeve: 10 },
  { name: 'Orafio', description: 'Caramel & Roasted', priceSleeve: 10.80, podsPerSleeve: 10 },
  { name: 'Diavolitto', description: 'Intense & Powerful', priceSleeve: 10.80, podsPerSleeve: 10 },
  { name: 'Altissio', description: 'Full-Bodied & Creamy', priceSleeve: 10.80, podsPerSleeve: 10 },
  { name: 'Altissio Decaffeinato', description: 'Full-Bodied & Creamy', priceSleeve: 11.50, podsPerSleeve: 10 },
  { name: 'Voltesso', description: 'Light & Sweet', priceSleeve: 10.80, podsPerSleeve: 10 },

  // Reviving Origins
  { name: 'Cafecito de Puerto Rico', description: 'Dark Cocoa', priceSleeve: 20.00, podsPerSleeve: 10 },

  // Master Crafted Single Origins
  { name: 'El Salvador', description: 'Sweet & Jam', priceSleeve: 15.00, podsPerSleeve: 10 },
  { name: 'Mexico', description: 'Intense & Spiced', priceSleeve: 15.00, podsPerSleeve: 10 },
  { name: 'Ethiopia', description: 'Floral & Complex', priceSleeve: 14.50, podsPerSleeve: 10 },
  { name: 'Costa Rica', description: 'Malty & Sweet', priceSleeve: 14.50, podsPerSleeve: 10 },
  { name: 'Colombia', description: 'Washed Arabica', priceSleeve: 15.00, podsPerSleeve: 10 },

  // Coffee +
  { name: 'Ginseng Delight', description: 'Soft Caramel & Delicate Ginseng', priceSleeve: 15.00, podsPerSleeve: 10 },
  { name: 'Active', description: 'Almond & Vanilla', priceSleeve: 15.00, podsPerSleeve: 10 },
  { name: 'Melozio Boost', description: 'Smooth & Balanced', priceSleeve: 15.50, podsPerSleeve: 10 },
  { name: 'Stormio Boost', description: 'Rich & Strong', priceSleeve: 15.50, podsPerSleeve: 10 },
  { name: 'Vivida', description: 'Cereal & Sweet', priceSleeve: 15.50, podsPerSleeve: 10 },

  // Gran Lungo (5 fl oz)
  { name: 'Inizio', description: 'Floral & Cereal', priceSleeve: 13.50, podsPerSleeve: 10 },
  { name: 'Fortado', description: 'Intense and Full-Bodied', priceSleeve: 13.50, podsPerSleeve: 10 },
  { name: 'Fortado Decaffeinato', description: 'Intense & Full-Bodied', priceSleeve: 14.00, podsPerSleeve: 10 },
  { name: 'Arondio', description: 'Cereal & Mild', priceSleeve: 13.50, podsPerSleeve: 10 },

  // XL Coffees (12–18 fl oz) — sleeves of 7
  { name: 'Cold Brew Style', description: 'Roasted & Caramel', priceSleeve: 11.55, podsPerSleeve: 7 },
  { name: 'Alto Ambrato', description: 'Honeyed & Delicate', priceSleeve: 11.20, podsPerSleeve: 7 },
  { name: 'Alto Onice', description: 'Roasted & Woody', priceSleeve: 11.20, podsPerSleeve: 7 },
  { name: 'Pour-Over Style', description: 'Roasted & Smoky', priceSleeve: 12.25, podsPerSleeve: 7 },
]
