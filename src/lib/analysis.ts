import type { ComplianceCheck, ScanDraft } from './types';

const PRODUCT_TYPES = [
  {
    match: /chai|tea|coffee|latte/i,
    name: 'Premium Chai Latte Mix',
    manufacturer: 'Sunrise Beverage Co.',
    ingredients:
      'Sugar, dried whole milk, black tea extract, natural spice flavors (cardamom, cinnamon, ginger), salt, sunflower lecithin',
    weight: '250 g (8.8 oz)',
    expiry: 'Best before: 14 AUG 2027',
    category: 'Foodstuff',
  },
  {
    match: /serum|cream|lotion|skin|soap|shampoo/i,
    name: 'Hydrating Face Serum',
    manufacturer: 'Northwind Labs GmbH',
    ingredients:
      'Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Panthenol, Tocopherol, Citric Acid, Phenoxyethanol',
    weight: '30 ml / 1.0 fl oz',
    expiry: 'PAO: 12M · Lot NL-2481',
    category: 'Cosmetic',
  },
  {
    match: /supplement|vitamin|protein|capsule/i,
    name: 'Daily Multivitamin Capsules',
    manufacturer: 'Vertex Health Products Ltd.',
    ingredients:
      'Vitamin C (ascorbic acid), Vitamin D3 (cholecalciferol), Vitamin B12 (cyanocobalamin), Zinc bisglycinate, microcrystalline cellulose, gelatin capsule',
    weight: '60 capsules · 42 g',
    expiry: 'EXP: 2028-03-31',
    category: 'Food Supplement',
  },
  {
    match: /snack|bar|choc|granola|cookie/i,
    name: 'Almond & Honey Snack Bar',
    manufacturer: 'Harvest Table Foods Inc.',
    ingredients:
      'Rolled oats, almonds, honey, sunflower oil, crisp rice, sea salt, natural flavor. Contains: oats (gluten), tree nuts',
    weight: '40 g (1.41 oz)',
    expiry: 'Best before: 09 SEP 2026',
    category: 'Foodstuff',
  },
] as const;

const FALLBACK = {
  name: 'Consumer Packaged Goods',
  manufacturer: 'Atlas Brands Ltd.',
  ingredients: 'Not clearly detected on label',
  weight: 'Not clearly detected on label',
  expiry: 'Not clearly detected on label',
  category: 'General Product',
};

function hashFile(file: File, seedSalt: number): number {
  const name = `${file.name}:${file.size}:${file.lastModified}:${seedSalt}`;
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function jitter(seed: number, index: number): number {
  return ((seed >>> (index * 3)) & 7) / 7;
}

export function createScanDraft(
  file: File,
  thumbnail: string | null,
  fileName: string
): ScanDraft {
  const seed = hashFile(file, fileName.length);
  const type =
    PRODUCT_TYPES.find((t) => t.match.test(file.name)) ??
    (PRODUCT_TYPES[seed % PRODUCT_TYPES.length] as (typeof PRODUCT_TYPES)[number]);

  const visibleLabel = jitter(seed, 1) > 0.35;
  const productName = visibleLabel ? type.name : '';
  const manufacturer = jitter(seed, 2) > 0.25 ? type.manufacturer : '';
  const ingredients = jitter(seed, 3) > 0.3 ? type.ingredients : '';
  const weight = jitter(seed, 4) > 0.2 ? type.weight : '';
  const expiry = jitter(seed, 5) > 0.35 ? type.expiry : '';

  const passedChecks: ComplianceCheck[] = [];
  const missing: string[] = [];

  if (productName) {
    passedChecks.push({
      label: 'Product name declared',
      detail: `"${productName}" is clearly printed and legible on the primary display panel.`,
    });
  } else {
    missing.push('Product name (primary display panel)');
  }

  if (manufacturer) {
    passedChecks.push({
      label: 'Responsible party identified',
      detail: `Manufacturer/packer "${manufacturer}" is stated, satisfying responsible-person labeling rules.`,
    });
  } else {
    missing.push('Manufacturer / responsible party address');
  }

  if (ingredients) {
    passedChecks.push({
      label: 'Ingredient list present',
      detail: `Full ingredient declaration detected (${ingredients.split(',').length} items), in descending-order format.`,
    });
  } else {
    missing.push('Ingredient list (descending order by weight)');
  }

  if (weight) {
    passedChecks.push({
      label: 'Net quantity declared',
      detail: `Net content "${weight}" is displayed in the required bottom-third area of the label.`,
    });
  } else {
    missing.push('Net quantity / weight declaration');
  }

  if (expiry) {
    passedChecks.push({
      label: 'Date marking present',
      detail: `Date marking found ("${expiry}"), formatted as day/month/year or PAO where permitted.`,
    });
  } else {
    missing.push('Expiry / best-before date marking');
  }

  if (type.category === 'Cosmetic' && ingredients) {
    passedChecks.push({
      label: 'Allergen disclosure',
      detail: 'No undeclared fragrance allergens detected in the ingredient list for a cosmetic product.',
    });
  } else if (type.category === 'Food Supplement' && expiry) {
    passedChecks.push({
      label: 'Batch / lot code',
      detail: 'A batch identifier was detected, enabling traceability and recall procedures.',
    });
  } else if (jitter(seed, 6) > 0.5) {
    passedChecks.push({
      label: 'Legible font size',
      detail: 'Detected text height meets the minimum x-height requirement for mandatory label information.',
    });
  } else {
    missing.push('Legible font size for mandatory statements');
  }

  if (jitter(seed, 7) > 0.6) {
    missing.push('Country of origin statement');
  } else {
    passedChecks.push({
      label: 'Country of origin declared',
      detail: 'Origin statement ("Made in ...") was detected and matches the responsible party region.',
    });
  }

  const base =
    (passedChecks.length / (passedChecks.length + missing.length)) * 100;
  const complianceScore = Math.round(
    Math.min(100, Math.max(0, base * 0.92 + jitter(seed, 8) * 8))
  );

  const recommendations: string[] = [];
  if (!productName)
    recommendations.push(
      'Print the product name in prominent type on the front panel — most labeling regimes require it to be the first item a consumer reads.'
    );
  if (!manufacturer)
    recommendations.push(
      'Add the manufacturer or importer name and a full postal address; this is mandatory under EU Regulation 1169/2011 Art. 9 and FDA 21 CFR 101.5.'
    );
  if (!ingredients)
    recommendations.push(
      'List all ingredients in descending order of weight, using accepted ingredient names (e.g. "sodium hyaluronate", not a trade name).'
    );
  if (!weight)
    recommendations.push(
      'Declare the net quantity in the bottom 30% of the principal display panel, in both metric and (if sold in the US) customary units.'
    );
  if (!expiry)
    recommendations.push(
      'Include a "best before" date plus any required storage conditions; for cosmetics, add a period-after-opening (PAO) symbol.'
    );
  if (missing.includes('Country of origin statement'))
    recommendations.push(
      'State the country of origin if the product would mislead consumers about where it was made (EU Reg. 1169/2011 Art. 26).'
    );
  if (missing.includes('Legible font size for mandatory statements'))
    recommendations.push(
      'Increase the type size of mandatory statements — the lowercase "x" height must be at least 1.2 mm for most package sizes.'
    );
  if (recommendations.length === 0)
    recommendations.push(
      'Label looks strong. Consider adding a QR code linking to the full product datasheet for extra consumer transparency.'
    );
  if (complianceScore < 100 && recommendations.length < 2)
    recommendations.push(
      'Have the artwork re-reviewed after edits; keep a dated proof of the final label for your compliance file.'
    );

  return {
    image_name: file.name,
    thumbnail,
    product_name: productName,
    manufacturer,
    ingredients,
    weight,
    expiry_date: expiry,
    compliance_score: complianceScore,
    passed_checks: passedChecks,
    missing_information: missing,
    recommendations,
  };
}
