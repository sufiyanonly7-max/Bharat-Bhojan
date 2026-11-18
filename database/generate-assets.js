/**
 * Bharat Bhojan - Asset Generator
 * Generates lightweight, beautiful, local SVG illustrations for traditional Indian dishes.
 * Ensures zero broken images and complete offline reliability.
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Color palettes inspired by traditional Indian spices and cooking vessels
const palettes = {
    warmEarthy: { bg: '#F5ECE3', border: '#D9C7B6', accent: '#A8422B', icon: '#8C321E', text: '#3E342B' },
    turmericGold: { bg: '#FDF6E2', border: '#EBD89F', accent: '#D48817', icon: '#B36B09', text: '#423315' },
    corianderGreen: { bg: '#EEF5ED', border: '#C7DEC4', accent: '#2E6B4E', icon: '#1D4E37', text: '#21382A' },
    clayTerracotta: { bg: '#F7EDE7', border: '#E4C9BD', accent: '#BA4E33', icon: '#93351E', text: '#452A22' },
    saffronWarm: { bg: '#FAF0E6', border: '#E6D0BE', accent: '#C85A17', icon: '#A23F06', text: '#402919' },
    indigoHeritage: { bg: '#EDF1F7', border: '#CBD5E4', accent: '#375A7F', icon: '#233E5C', text: '#1E2C3D' }
};

// Dish design specifications
const dishSvgs = [
    { file: 'placeholder.svg', title: 'Traditional Indian Dish', region: 'Heritage Recipe', palette: 'warmEarthy', symbol: 'thali' },
    { file: 'litti-chokha.svg', title: 'Litti Chokha', region: 'Bihar • East India', palette: 'clayTerracotta', symbol: 'litti' },
    { file: 'thekua.svg', title: 'Thekua', region: 'Bihar • Festival Prasad', palette: 'turmericGold', symbol: 'sweet' },
    { file: 'sattu-ghol.svg', title: 'Sattu Ghol', region: 'Bihar • Cooling Drink', palette: 'turmericGold', symbol: 'drink' },
    { file: 'silao-khaja.svg', title: 'Silao Khaja', region: 'Bihar • GI Heritage', palette: 'turmericGold', symbol: 'pastry' },
    { file: 'mithila-makhana-kheer.svg', title: 'Mithila Makhana Kheer', region: 'Bihar • GI Heritage', palette: 'turmericGold', symbol: 'kheer' },
    { file: 'bihari-malpua.svg', title: 'Bihari Malpua', region: 'Bihar • Festive Sweet', palette: 'saffronWarm', symbol: 'sweet' },
    { file: 'dal-pittha.svg', title: 'Dal Pittha', region: 'Bihar • Steamed Bagiya', palette: 'warmEarthy', symbol: 'dumpling' },
    { file: 'gaya-tilkut.svg', title: 'Gaya Tilkut', region: 'Bihar • Artisanal Sweet', palette: 'warmEarthy', symbol: 'sesame' },
    { file: 'mishti-doi.svg', title: 'Mishti Doi', region: 'West Bengal • Clay Handi', palette: 'clayTerracotta', symbol: 'handi' },
    { file: 'machher-jhol.svg', title: 'Machher Jhol', region: 'West Bengal • River Carp', palette: 'saffronWarm', symbol: 'fish' },
    { file: 'chhena-poda.svg', title: 'Chhena Poda', region: 'Odisha • Burnt Confection', palette: 'saffronWarm', symbol: 'cake' },
    { file: 'dalma.svg', title: 'Dalma', region: 'Odisha • Temple Lentils', palette: 'turmericGold', symbol: 'bowl' },
    { file: 'sarson-saag.svg', title: 'Sarson Ka Saag', region: 'Punjab • Makki Roti', palette: 'corianderGreen', symbol: 'saag' },
    { file: 'rogan-josh.svg', title: 'Kashmiri Rogan Josh', region: 'Kashmir • Wazwan', palette: 'clayTerracotta', symbol: 'curry' },
    { file: 'himachali-siddu.svg', title: 'Himachali Siddu', region: 'Himachal • Mountain Bread', palette: 'warmEarthy', symbol: 'bread' },
    { file: 'garhwal-fannah.svg', title: 'Garhwal Ka Fannah', region: 'Uttarakhand • Gahat Dal', palette: 'clayTerracotta', symbol: 'ironpot' },
    { file: 'kadhi-pakora.svg', title: 'Kadhi Pakora', region: 'Uttar Pradesh • Tangy Kadhi', palette: 'turmericGold', symbol: 'bowl' },
    { file: 'dal-baati.svg', title: 'Dal Baati Churma', region: 'Rajasthan • Mewar Heritage', palette: 'saffronWarm', symbol: 'baati' },
    { file: 'gatte-sabzi.svg', title: 'Gatte Ki Sabzi', region: 'Rajasthan • Desert Cuisine', palette: 'turmericGold', symbol: 'bowl' },
    { file: 'gujarati-dhokla.svg', title: 'Gujarati Dhokla', region: 'Gujarat • Fermented Farsan', palette: 'turmericGold', symbol: 'dhokla' },
    { file: 'puran-poli.svg', title: 'Puran Poli', region: 'Maharashtra • Festive Bread', palette: 'turmericGold', symbol: 'flatbread' },
    { file: 'misal-pav.svg', title: 'Maharashtrian Misal', region: 'Maharashtra • Sprouted Matki', palette: 'clayTerracotta', symbol: 'curry' },
    { file: 'goan-fish-curry.svg', title: 'Goan Fish Curry', region: 'Goa • Kokum & Coconut', palette: 'saffronWarm', symbol: 'fish' },
    { file: 'goan-bebinca.svg', title: 'Goan Bebinca', region: 'Goa • GI Layered Dessert', palette: 'saffronWarm', symbol: 'cake' },
    { file: 'masala-dosa.svg', title: 'Masala Dosa', region: 'Karnataka • Crisp Crepe', palette: 'turmericGold', symbol: 'dosa' },
    { file: 'ven-pongal.svg', title: 'Ven Pongal', region: 'Tamil Nadu • Harvest Feast', palette: 'warmEarthy', symbol: 'bowl' },
    { file: 'kerala-appam.svg', title: 'Kerala Palappam', region: 'Kerala • Lacy Fermented Bowl', palette: 'warmEarthy', symbol: 'appam' },
    { file: 'kerala-avial.svg', title: 'Kerala Avial', region: 'Kerala • Coconut Sadya', palette: 'corianderGreen', symbol: 'bowl' },
    { file: 'bisi-bele-bath.svg', title: 'Bisi Bele Bath', region: 'Karnataka • Mysore Palace', palette: 'saffronWarm', symbol: 'bowl' },
    { file: 'hyderabadi-haleem.svg', title: 'Hyderabadi Haleem', region: 'Telangana • GI Pounded Stew', palette: 'clayTerracotta', symbol: 'handi' },
    { file: 'indori-poha.svg', title: 'Indori Poha', region: 'Madhya Pradesh • Malwa Street', palette: 'turmericGold', symbol: 'poha' },
    { file: 'bhutte-ka-kees.svg', title: 'Bhutte Ka Kees', region: 'Madhya Pradesh • Grated Corn', palette: 'turmericGold', symbol: 'corn' },
    { file: 'omita-khaar.svg', title: 'Omita Khaar', region: 'Assam • Banana Kolakhar', palette: 'corianderGreen', symbol: 'bowl' },
    { file: 'masor-tenga.svg', title: 'Masor Tenga', region: 'Assam • Ou Tenga Broth', palette: 'turmericGold', symbol: 'fish' },
    { file: 'naga-pork.svg', title: 'Naga Pork & Bamboo', region: 'Nagaland • Fermented Shoot', palette: 'clayTerracotta', symbol: 'meat' },
    { file: 'manipuri-kangshoi.svg', title: 'Manipuri Kangshoi', region: 'Manipur • Ngari Broth', palette: 'corianderGreen', symbol: 'bowl' },
    { file: 'himalayan-thukpa.svg', title: 'Himalayan Thukpa', region: 'Sikkim • Mountain Soup', palette: 'saffronWarm', symbol: 'noodles' }
];

function generateSvgContent(item) {
    const p = palettes[item.palette] || palettes.warmEarthy;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
    <radialGradient id="plateShine" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${p.border}" stop-opacity="0.4"/>
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="400" fill="url(#bgGrad)"/>
  <rect x="15" y="15" width="570" height="370" rx="16" fill="none" stroke="${p.border}" stroke-width="2" stroke-dasharray="8 6"/>

  <!-- Indian Decorative Mandala Watermark -->
  <g opacity="0.08" transform="translate(300, 180) scale(1.4)">
    <circle r="90" fill="none" stroke="${p.icon}" stroke-width="3"/>
    <circle r="70" fill="none" stroke="${p.icon}" stroke-width="2"/>
    <circle r="50" fill="none" stroke="${p.icon}" stroke-width="1.5"/>
    <path d="M0 -90 L15 -70 L0 -50 L-15 -70 Z M90 0 L70 15 L50 0 L70 -15 Z M0 90 L15 70 L0 50 L-15 70 Z M-90 0 L-70 15 L-50 0 L-70 -15 Z" fill="${p.icon}"/>
    <path d="M64 -64 L50 -40 L35 -50 L40 -35 Z M64 64 L50 40 L35 50 L40 35 Z M-64 64 L-50 40 L-35 50 L-40 35 Z M-64 -64 L-50 -40 L-35 -50 L-40 -35 Z" fill="${p.icon}"/>
  </g>

  <!-- Central Earthen Cooking Vessel / Platter -->
  <g transform="translate(300, 175)">
    <!-- Base Plate Shadow -->
    <ellipse cx="0" cy="55" rx="140" ry="24" fill="#000000" opacity="0.08"/>

    <!-- Plate / Thali Rim -->
    <ellipse cx="0" cy="40" rx="130" ry="45" fill="${p.border}"/>
    <ellipse cx="0" cy="38" rx="122" ry="40" fill="url(#plateShine)"/>
    <ellipse cx="0" cy="36" rx="108" ry="32" fill="${p.bg}"/>

    <!-- Inner Earthen / Brass Handi Bowl -->
    <path d="M-80 15 C-85 60, 85 60, 80 15 C75 3, -75 3, -80 15 Z" fill="${p.accent}" opacity="0.95"/>
    <ellipse cx="0" cy="15" rx="78" ry="22" fill="${p.icon}"/>
    <ellipse cx="0" cy="15" rx="68" ry="18" fill="#FDFBF7" opacity="0.9"/>

    <!-- Dish Graphic Rendering -->
    <g transform="translate(0, 10)">
      <circle cx="-25" cy="-2" r="16" fill="${p.accent}" opacity="0.9"/>
      <circle cx="22" cy="-4" r="18" fill="${p.accent}"/>
      <circle cx="0" cy="6" r="15" fill="${p.border}"/>
      <circle cx="-8" cy="-8" r="14" fill="${p.icon}" opacity="0.85"/>
      <!-- Garnish Leaves / Cumin Seeds -->
      <path d="M-6 -2 C-12 -12, -2 -14, 2 -8 C4 -2, 0 4, -6 -2 Z" fill="#2E6B4E"/>
      <path d="M8 2 C14 -8, 20 -4, 16 4 C12 8, 4 6, 8 2 Z" fill="#3E835F"/>
      <circle cx="-14" cy="4" r="2.5" fill="#D48817"/>
      <circle cx="12" cy="-2" r="2.5" fill="#D48817"/>
      <circle cx="0" cy="-14" r="2" fill="#D48817"/>
    </g>

    <!-- Rising Steam Swirls -->
    <path d="M-28 -20 C-36 -45, -20 -60, -28 -80" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
    <path d="M0 -25 C8 -50, -8 -65, 0 -90" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M28 -20 C20 -45, 36 -60, 28 -80" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
  </g>

  <!-- Cultural Region Badge -->
  <g transform="translate(300, 285)">
    <rect x="-140" y="0" width="280" height="26" rx="13" fill="${p.accent}" opacity="0.12"/>
    <text x="0" y="17" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="${p.icon}" text-anchor="middle" letter-spacing="1">
      ${item.region.toUpperCase()}
    </text>
  </g>

  <!-- Dish Title Header Banner -->
  <g transform="translate(300, 335)">
    <text x="0" y="0" font-family="'Georgia', 'Times New Roman', serif" font-size="24" font-weight="bold" fill="${p.text}" text-anchor="middle">
      ${item.title}
    </text>
    <text x="0" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="${p.icon}" text-anchor="middle" letter-spacing="0.5">
      Traditional Indian Culinary Knowledge Archive
    </text>
  </g>
</svg>`;
}

dishSvgs.forEach(item => {
    const filePath = path.join(imagesDir, item.file);
    fs.writeFileSync(filePath, generateSvgContent(item), 'utf8');
});

console.log(`✓ Generated ${dishSvgs.length} high-fidelity SVG assets in public/assets/images/`);
