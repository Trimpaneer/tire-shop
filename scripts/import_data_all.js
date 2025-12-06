import fs from 'fs';
import path from 'path';

const rawDataTruckPath = path.join(__dirname, '../raw_data_truck.txt');
const rawDataAutoPath = path.join(__dirname, '../raw_data_auto.txt');
const outputPath = path.join(__dirname, '../lib/data.ts');

const brands = [
    'Runway', 'Kumho', 'Ilink', 'Powertrak', 'Delmax', 'Gallant', 'Goodyear', 'GoodYear', 'Westlake',
    'Nankang', 'Boto', 'Hifly', 'Triangle', 'Sportrak', 'Vikrant', 'Fuisaki', 'Michelin',
    'Royal Black', 'Dunlop', 'LingLong', 'Fortune', 'Compasal', 'Rockblade', 'Aosen',
    'Laufenn', 'Yokohama', 'Ecovision', 'Aptany', 'Fullrun', 'Rxquest', 'Bridgestone', 'Hankook', 'Continental', 'Pirelli',
    'Blackhawl', 'ZC Rubber', 'Golpartner'
];

function detectBrand(text) {
    const lowerText = text.toLowerCase();
    for (const brand of brands) {
        if (lowerText.includes(brand.toLowerCase())) {
            if (brand.toLowerCase() === 'goodyear') return 'Goodyear';
            return brand;
        }
    }
    return 'Generic';
}

function parseData(filePath, vehicleType) {
    if (!fs.existsSync(filePath)) return [];
    const rawData = fs.readFileSync(filePath, 'utf8');
    const lines = rawData.split('\n');
    const products = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('Referencia')) continue;

        const parts = trimmedLine.split(/\s+/);
        if (parts.length < 4) continue;

        const ref = parts[0];
        const qty = parseInt(parts[parts.length - 1]);
        const priceRaw = parseInt(parts[parts.length - 2]);

        // Price is likely in thousands, e.g. 1255 -> 1255000
        const price = priceRaw * 1000;

        const nameParts = parts.slice(1, parts.length - 2);
        const fullName = nameParts.join(' ');
        const size = nameParts[0];
        const brand = detectBrand(fullName);

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
            name: fullName.replace(size, '').trim() || fullName,
            brand: brand,
            size: size,
            price: price,
            image: '/images/tire-placeholder.png',
            category: category,
            vehicleType: vehicleType,
            inStock: qty > 0
        });
    }
    return products;
}

const autoProducts = parseData(rawDataAutoPath, 'auto');
const truckProducts = parseData(rawDataTruckPath, 'truck');

const allProducts = [...autoProducts, ...truckProducts];

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
console.log(`Generated ${allProducts.length} products (${autoProducts.length} auto, ${truckProducts.length} truck).`);
