import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawDataPath = path.join(__dirname, '../raw_data_auto.txt');
const outputPath = path.join(__dirname, '../lib/data.ts');

const rawData = fs.readFileSync(rawDataPath, 'utf8');
const lines = rawData.split('\n');

const products = [];
const brands = [
    'Runway', 'Kumho', 'Ilink', 'Powertrak', 'Delmax', 'Gallant', 'Goodyear', 'GoodYear', 'Westlake',
    'Nankang', 'Boto', 'Hifly', 'Triangle', 'Sportrak', 'Vikrant', 'Fuisaki', 'Michelin',
    'Royal Black', 'Dunlop', 'LingLong', 'Fortune', 'Compasal', 'Rockblade', 'Aosen',
    'Laufenn', 'Yokohama', 'Ecovision', 'Aptany', 'Fullrun', 'Rxquest', 'Bridgestone', 'Hankook', 'Continental', 'Pirelli'
];

// Helper to detect brand
function detectBrand(text) {
    const lowerText = text.toLowerCase();
    for (const brand of brands) {
        if (lowerText.includes(brand.toLowerCase())) {
            // Normalize brand name
            if (brand.toLowerCase() === 'goodyear') return 'Goodyear';
            return brand;
        }
    }
    return 'Generic';
}

// Helper to extract size
function extractSize(text) {
    // Regex for tire size: e.g., 155/R12, 165/65R13, 7.00R15LT, 31/10.5R15
    // Simple regex: number/numberRnumber or numberRnumber or number/number/number
    const sizeRegex = /\b\d{2,3}\/\d{0,2}\.?\d{0,2}R\d{2}\.?\d{0,1}[A-Z]*\b|\b\d{1,2}\.?\d{0,2}\/?R\d{2}\b|\b\d{2,3}\/\d{2,3}\s?R\d{2}\b|\b\d{2,3}R\d{2}C?\b|\bLT\d{3}\/\d{2}R\d{2}\b/i;

    // Let's try to just take the second token as size usually, but clean it.
    // Or use a regex on the whole line.
    return null;
}

let idCounter = 1;

for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('Referencia')) continue;

    const parts = trimmedLine.split(/\s+/);
    if (parts.length < 4) continue;

    const ref = parts[0];
    const qty = parseInt(parts[parts.length - 1]);
    const priceRaw = parseInt(parts[parts.length - 2]);

    // Price is likely in thousands, e.g. 190 -> 190000
    const price = priceRaw * 1000;

    // Name/Desc is everything between Ref and Price
    const nameParts = parts.slice(1, parts.length - 2);
    const fullName = nameParts.join(' ');

    // Size is usually the first part of the name
    const size = nameParts[0];

    // Brand detection
    const brand = detectBrand(fullName);

    // Category detection (simple heuristic)
    let category = 'all-season';
    const lowerName = fullName.toLowerCase();
    if (lowerName.includes('winter') || lowerName.includes('ice') || lowerName.includes('blizzak')) {
        category = 'winter';
    } else if (lowerName.includes('summer') || lowerName.includes('sport')) {
        category = 'summer';
    }

    if (isNaN(price) || isNaN(qty)) continue;

    products.push({
        id: ref,
        name: fullName.replace(size, '').trim() || fullName, // Remove size from name if possible
        brand: brand,
        size: size,
        price: price,
        image: '/images/tire-placeholder.png',
        category: category,
        vehicleType: 'auto',
        inStock: qty > 0
    });
}

// Add Truck tires manually (keeping the ones we added before)
const truckProducts = [
    {
        id: '7',
        name: 'X Multi Z',
        brand: 'Michelin',
        size: '295/80 R22.5',
        price: 1800000,
        image: '/images/tire-placeholder.png',
        category: 'all-season',
        vehicleType: 'truck',
        inStock: true,
    },
    {
        id: '8',
        name: 'R249',
        brand: 'Bridgestone',
        size: '11R22.5',
        price: 1650000,
        image: '/images/tire-placeholder.png',
        category: 'summer',
        vehicleType: 'truck',
        inStock: true,
    },
    {
        id: '9',
        name: 'EcoPlus HS3',
        brand: 'Continental',
        size: '315/80 R22.5',
        price: 1950000,
        image: '/images/tire-placeholder.png',
        category: 'all-season',
        vehicleType: 'truck',
        inStock: true,
    },
    {
        id: '10',
        name: 'AH35',
        brand: 'Hankook',
        size: '295/80 R22.5',
        price: 1550000,
        image: '/images/tire-placeholder.png',
        category: 'all-season',
        vehicleType: 'truck',
        inStock: true,
    },
];

// Combine
const allProducts = [...products, ...truckProducts];

// Generate TS file content
const fileContent = `export interface Product {
  id: string;
  name: string;
  brand: string;
  size: string; // e.g., "205/55 R16"
  price: number;
  image: string;
  category: 'summer' | 'winter' | 'all-season';
  vehicleType: 'auto' | 'truck';
  inStock: boolean;
}

export const products: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Generated ${allProducts.length} products.`);
