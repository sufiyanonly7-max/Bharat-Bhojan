/**
 * Bharat Bhojan - Database Seed Script
 * Populates 35 geographically diverse, authentic traditional Indian food records,
 * master tables (regions, states, categories, seasons, ingredients, references),
 * and initial administrator credentials.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getDb, execScript, execute, queryOne, transaction } = require('../config/database');

console.log('--- Initializing Bharat Bhojan Database ---');

// 1. Read and execute SQLite Schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
execScript(schemaSql);
console.log('✓ Database schema created successfully.');

// Clear existing data to allow safe, idempotent re-seeding
execScript(`
    PRAGMA foreign_keys = OFF;
    DELETE FROM food_references;
    DELETE FROM food_seasons;
    DELETE FROM food_ingredients;
    DELETE FROM foods;
    DELETE FROM ingredients;
    DELETE FROM references_tbl;
    DELETE FROM seasons;
    DELETE FROM categories;
    DELETE FROM states;
    DELETE FROM regions;
    DELETE FROM sqlite_sequence;
    PRAGMA foreign_keys = ON;
`);
console.log('✓ Cleared prior data for fresh seeding.');

// Wrap seeding in a transaction for atomicity and speed
transaction(() => {
    // 2. Insert Regions
    const regions = [
        { name: 'East India', description: 'Encompasses the fertile plains of the Ganges and Brahmaputra deltas, coastal Odisha and Bengal, and rich historical culinary traditions of Bihar, West Bengal, Odisha, and Jharkhand.' },
        { name: 'North India', description: 'Encompasses the Himalayan foothills, the fertile Indo-Gangetic plains, and northern valleys across Punjab, Kashmir, Himachal Pradesh, Uttar Pradesh, and Uttarakhand.' },
        { name: 'South India', description: 'Encompasses the Deccan plateau and coastal peninsular states with deep traditions of rice, lentils, coconut, tamarind, and ancient fermented batters.' },
        { name: 'West India', description: 'Spans the arid desert plains of Rajasthan, coastal Konkan and Goa, and the agro-rich belts of Gujarat and Maharashtra.' },
        { name: 'Central India', description: 'The cultural heartland of Madhya Pradesh and Chhattisgarh, marked by robust millets, tender corn, wild forest produce, and vibrant Malwa street foods.' },
        { name: 'North-East India', description: 'The lush biodiversity of the Seven Sisters and Sikkim, characterized by indigenous herbs, bamboo shoots, fermented treasures, and minimal reliance on heavy masalas.' }
    ];

    const insertRegion = getDb().prepare('INSERT OR IGNORE INTO regions (name, description) VALUES (?, ?)');
    regions.forEach(r => insertRegion.run(r.name, r.description));
    console.log(`✓ Regions seeded (${regions.length} entries).`);

    // Helper map for region IDs
    const regionRows = getDb().prepare('SELECT id, name FROM regions').all();
    const regionMap = {};
    regionRows.forEach(r => { regionMap[r.name] = r.id; });

    // 3. Insert States
    const states = [
        // East India
        { name: 'Bihar', region: 'East India' },
        { name: 'West Bengal', region: 'East India' },
        { name: 'Odisha', region: 'East India' },
        { name: 'Jharkhand', region: 'East India' },
        // North India
        { name: 'Punjab', region: 'North India' },
        { name: 'Uttar Pradesh', region: 'North India' },
        { name: 'Rajasthan', region: 'North India' },
        { name: 'Jammu & Kashmir', region: 'North India' },
        { name: 'Himachal Pradesh', region: 'North India' },
        { name: 'Uttarakhand', region: 'North India' },
        { name: 'Haryana', region: 'North India' },
        // South India
        { name: 'Tamil Nadu', region: 'South India' },
        { name: 'Kerala', region: 'South India' },
        { name: 'Karnataka', region: 'South India' },
        { name: 'Telangana', region: 'South India' },
        { name: 'Andhra Pradesh', region: 'South India' },
        // West India
        { name: 'Gujarat', region: 'West India' },
        { name: 'Maharashtra', region: 'West India' },
        { name: 'Goa', region: 'West India' },
        // Central India
        { name: 'Madhya Pradesh', region: 'Central India' },
        { name: 'Chhattisgarh', region: 'Central India' },
        // North-East India
        { name: 'Assam', region: 'North-East India' },
        { name: 'Nagaland', region: 'North-East India' },
        { name: 'Manipur', region: 'North-East India' },
        { name: 'Sikkim', region: 'North-East India' }
    ];

    const insertState = getDb().prepare('INSERT OR IGNORE INTO states (name, region_id) VALUES (?, ?)');
    states.forEach(s => insertState.run(s.name, regionMap[s.region]));
    console.log(`✓ States seeded (${states.length} entries).`);

    const stateRows = getDb().prepare('SELECT id, name FROM states').all();
    const stateMap = {};
    stateRows.forEach(s => { stateMap[s.name] = s.id; });

    // 4. Insert Categories
    const categories = [
        { name: 'Main Dish', description: 'Core meal preparations forming the centerpiece of a traditional thali or gathering.' },
        { name: 'Bread & Flatbread', description: 'Traditional wheat, maize, millet, or rice-based flatbreads and roasted breads.' },
        { name: 'Rice Preparation', description: 'Traditional aromatic rice dishes, one-pot seasoned grains, and festive rice bowls.' },
        { name: 'Snack & Savory', description: 'Light savory preparations, afternoon farsan, and street foods.' },
        { name: 'Sweet & Confectionery', description: 'Traditional festive sweets, mithais, puddings, and milk confections.' },
        { name: 'Beverage', description: 'Traditional indigenous drinks, cooling summer sherbets, and herbal decoctions.' },
        { name: 'Fermented Food', description: 'Dishes utilizing natural wild microbial fermentation for digestibility and texture.' },
        { name: 'Festival & Ceremonial Food', description: 'Sacred offerings, prasad, and ritual dishes dedicated to festivals and celebrations.' },
        { name: 'Preserved & Pickled Food', description: 'Traditional sun-dried, fermented, or cured ingredients with extended shelf life.' }
    ];

    const insertCategory = getDb().prepare('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)');
    categories.forEach(c => insertCategory.run(c.name, c.description));
    console.log(`✓ Categories seeded (${categories.length} entries).`);

    const catRows = getDb().prepare('SELECT id, name FROM categories').all();
    const catMap = {};
    catRows.forEach(c => { catMap[c.name] = c.id; });

    // 5. Insert Seasons (Aligned with traditional Indian Ritu associations)
    const seasons = [
        { name: 'Summer', description: 'Grishma Ritu (April - June): Characterized by rising temperatures. Traditional dietary practices emphasize light, hydrating preparations, roasted gram flour (sattu), and cooling regional drinks.' },
        { name: 'Monsoon', description: 'Varsha Ritu (July - August): Rainy season characterized by humid weather. Traditional diets emphasize digestive spices, warm roasted corn, and freshly prepared warm dishes.' },
        { name: 'Autumn', description: 'Sharad Ritu (September - October): Post-monsoon harvest period. Accompanied by major harvest celebrations like Chhath Puja and Durga Puja, featuring jaggery-based sweets and coconut preparations.' },
        { name: 'Winter', description: 'Shishir & Hemant Ritu (November - February): Cold agricultural season. Characterized by warming foods such as mustard greens (sarson), sesame seeds (til), pure ghee, and hearty mountain flatbreads.' },
        { name: 'Spring', description: 'Vasant Ritu (March - April): Spring transition celebrating harvest and Holi. Associated with fresh tender grains, floral notes, and festive preparations like Puran Poli and Malpua.' },
        { name: 'Year-round', description: 'Traditional staple preparations enjoyed across all seasons, utilizing perennial pantry staples such as rice, lentils, and basic regional spices.' }
    ];

    const insertSeason = getDb().prepare('INSERT OR IGNORE INTO seasons (name, description) VALUES (?, ?)');
    seasons.forEach(sn => insertSeason.run(sn.name, sn.description));
    console.log(`✓ Seasons seeded (${seasons.length} entries).`);

    const seasonRows = getDb().prepare('SELECT id, name FROM seasons').all();
    const seasonMap = {};
    seasonRows.forEach(sn => { seasonMap[sn.name] = sn.id; });

    // 6. Insert References (Reliable scholarly and institutional sources)
    const references = [
        {
            title: 'A Historical Dictionary of Indian Food',
            author: 'K. T. Achaya',
            publisher: 'Oxford University Press',
            publication_year: 1998,
            source_type: 'Academic Book',
            url: 'https://archive.org/details/historicaldictio0000acha',
            notes: 'Comprehensive scholarly compendium tracing the antiquity, Sanskrit roots, and historical evolution of Indian regional dishes.'
        },
        {
            title: 'Indian Food: A Historical Companion',
            author: 'K. T. Achaya',
            publisher: 'Oxford University Press',
            publication_year: 1994,
            source_type: 'Academic Book',
            url: 'https://global.oup.com/academic/product/indian-food-9780195644166',
            notes: 'Authoritative cultural history of culinary practices, regional cooking vessels, and agricultural history across ancient India.'
        },
        {
            title: 'Culinary Heritage of India - Incredible India',
            author: 'Ministry of Tourism',
            publisher: 'Government of India',
            publication_year: 2021,
            source_type: 'Government Source',
            url: 'https://www.incredibleindia.org',
            notes: 'Official documentation of traditional state culinary practices, regional festivals, and seasonal culinary specialties.'
        },
        {
            title: 'Traditional Food Systems of India',
            author: 'Anthropological Survey of India',
            publisher: 'Ministry of Culture, Government of India',
            publication_year: 2016,
            source_type: 'Cultural Institution',
            url: 'https://ansi.gov.in',
            notes: 'Field ethnographic records surveying indigenous food gathering, fermentation practices, and tribal food traditions.'
        },
        {
            title: 'Geographical Indications Registry of India (GI Journal)',
            author: 'Controller General of Patents, Designs and Trademarks',
            publisher: 'Ministry of Commerce and Industry, Government of India',
            publication_year: 2020,
            source_type: 'Government Source',
            url: 'https://ipindia.gov.in',
            notes: 'Official gazette certifying regional provenance, traditional manufacturing methods, and heritage status for items like Silao Khaja and Hyderabadi Haleem.'
        },
        {
            title: 'Fermented Foods and Beverages of India',
            author: 'Tamang, J. P. et al.',
            publisher: 'Journal of Ethnic Foods (Elsevier)',
            publication_year: 2016,
            source_type: 'Academic Paper',
            url: 'https://doi.org/10.1016/j.jef.2016.09.004',
            notes: 'Peer-reviewed scientific and ethnobotanical documentation of microbial diversity in indigenous fermented dishes of Eastern and North-Eastern India.'
        },
        {
            title: 'Feasts and Fasts: A History of Food in India',
            author: 'Colleen Taylor Sen',
            publisher: 'Reaktion Books',
            publication_year: 2015,
            source_type: 'Academic Book',
            url: 'http://www.reaktionbooks.co.uk/display.asp?ISB=9781780233529',
            notes: 'Chronological exploration of dietary philosophy, religious feasts, fasts (vrat), and culinary intersections across Indian historical eras.'
        },
        {
            title: 'Culinary Traditions of Bihar and Eastern India',
            author: 'Bihar State Tourism Development Corporation (BSTDC)',
            publisher: 'Department of Tourism, Government of Bihar',
            publication_year: 2020,
            source_type: 'Government Source',
            url: 'https://tourism.bihar.gov.in',
            notes: 'Official monograph detailing the regional culinary heritage of Magadh, Mithila, Bhojpur, and Anga regions.'
        },
        {
            title: 'Traditional Cuisines and Food Culture of North East India',
            author: 'North Eastern Council (NEC)',
            publisher: 'Ministry of Development of North Eastern Region, Government of India',
            publication_year: 2019,
            source_type: 'Government Source',
            url: 'https://necouncil.gov.in',
            notes: 'Documentation of indigenous cooking techniques, wild forest herbs, alkaline kolakhar, and fermented bamboo shoot traditions.'
        },
        {
            title: 'The Story of Our Food',
            author: 'K. T. Achaya',
            publisher: 'Universities Press',
            publication_year: 2000,
            source_type: 'Academic Book',
            url: 'https://www.orientblackswan.com/details?id=9788173712937',
            notes: 'Accessible student-friendly educational guide explaining where Indian ingredients originated and how traditional diets evolved.'
        },
        {
            title: 'Mithila Makhana - GI Registration Certificate (Application No. 696)',
            author: 'Geographical Indications Registry',
            publisher: 'Controller General of Patents, Designs and Trademarks, Government of India',
            publication_year: 2022,
            source_type: 'Government Source',
            url: 'https://ipindia.gov.in',
            notes: 'Official Geographical Indication certificate certifying Mithila Makhana of Bihar for its traditional aquatic harvesting methods and regional identity.'
        },
        {
            title: 'Culinary Traditions of India - National Cultural Archives',
            author: 'Ministry of Culture',
            publisher: 'Government of India',
            publication_year: 2018,
            source_type: 'Cultural Institution',
            url: 'https://indiaculture.gov.in',
            notes: 'National cultural archives documenting regional festival sweets including traditional Malpua and festive preparations.'
        }
    ];

    const insertRef = getDb().prepare(`
        INSERT OR IGNORE INTO references_tbl (title, author, publisher, publication_year, source_type, url, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    references.forEach(r => insertRef.run(r.title, r.author, r.publisher, r.publication_year, r.source_type, r.url, r.notes));
    console.log(`✓ References seeded (${references.length} entries).`);

    const refRows = getDb().prepare('SELECT id, title FROM references_tbl').all();
    const refMap = {};
    refRows.forEach(r => { refMap[r.title] = r.id; });

    // 7. Seed Foods Dataset (35 authentic dishes)
    const foodsData = [
        // --- BIHAR & EAST INDIA (Detailed Regional Focus) ---
        {
            name: 'Litti Chokha',
            local_name: 'लिट्टी चोखा',
            slug: 'litti-chokha',
            state: 'Bihar',
            region: 'East India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/litti-chokha.svg',
            featured: 1,
            short_description: 'Rustic roasted whole-wheat balls stuffed with spiced roasted gram flour (sattu), dipped in pure desi ghee, served with smoky mashed vegetables (chokha).',
            cultural_context: 'Litti Chokha is the quintessential culinary symbol of the Magadh and Bhojpur regions of Bihar. Historically documented as the sustenance food of farmers, wayfarers, and soldiers due to sattu\'s remarkable resistance to spoiling in hot climates. During the uprising of 1857, litti served as transportable rations. Community gatherings in rural Bihar traditionally center around the cow-dung cake campfire (upla/goitha) where littis are baked directly on embers. Note: Preparation details and accompaniment recipes vary across rural households and urban stovetop adaptations.',
            traditional_preparation: 'Whole wheat flour is kneaded into a pliable dough. The filling is crafted from chana sattu (roasted gram flour) seasoned with crushed ajwain (carom seeds), mangrail (kalonji), finely minced garlic, green chillies, fresh coriander, ginger, raw mustard oil, and tangy amchur or pickle masala. The stuffed balls are sealed and traditionally roasted slowly over glowing wood or dried cow-dung embers until charred and cracked, dusted clean with a cloth, and immersed generously in melted warm desi ghee. Accompanied by chokha prepared from fire-roasted eggplant, tomatoes, and boiled potatoes mashed with raw mustard oil and green chillies.',
            seasonality_notes: 'Relished year-round, but holds special reverence in the crisp winter months when community outdoor bonfires and harvest celebrations are prevalent.',
            festival_context: 'Prepared during regional festivities, family reunions, and winter community feasts (Litti Bhoj) across Bihar and eastern Uttar Pradesh.',
            serving_tradition: 'Served hot by crushing the litti slightly with fingers and soaking it in melted desi ghee, accompanied by bowlfuls of smoky chokha, raw onions, and fried green chillies.',
            ingredients: [
                { name: 'Sattu (Roasted Gram Flour)', quantity: '2 cups', is_primary: 1 },
                { name: 'Whole Wheat Flour', quantity: '3 cups', is_primary: 1 },
                { name: 'Mustard Oil', quantity: '3 tablespoons', is_primary: 1 },
                { name: 'Desi Ghee', quantity: '1/2 cup for dipping', is_primary: 1 },
                { name: 'Eggplant (Brinjal)', quantity: '1 large (for chokha)', is_primary: 0 },
                { name: 'Tomatoes', quantity: '3 ripe', is_primary: 0 },
                { name: 'Potatoes', quantity: '2 boiled', is_primary: 0 },
                { name: 'Ajwain (Carom Seeds)', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Kalonji (Nigella Seeds)', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Garlic', quantity: '8-10 cloves minced', is_primary: 0 }
            ],
            seasons: ['Winter', 'Year-round'],
            references: [
                'Culinary Traditions of Bihar and Eastern India',
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India'
            ]
        },
        {
            name: 'Thekua',
            local_name: 'ठेकुआ / खजूरिया (Khajuria)',
            slug: 'thekua',
            state: 'Bihar',
            region: 'East India',
            category: 'Festival & Ceremonial Food',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/thekua.svg',
            featured: 1,
            short_description: 'A venerable traditional sweet cookie of Bihar made of whole-wheat flour, jaggery, dried coconut, and fennel seeds, pressed on carved wooden moulds and fried in ghee.',
            cultural_context: 'Thekua is the revered Mahaprasad of Chhath Puja, the ancient solar festival of Bihar, Jharkhand, and eastern Uttar Pradesh. Prepared under strict conditions of ritual purity (Niyam) dedicated to Surya (the Sun God) and Usha/Chhathi Maiya. The wooden moulds (sancha) used to shape each piece are handcrafted heritage items in Bihari households, often carved with motifs of the sun, leaves, and sacred geometric designs. Note: While jaggery (gur) is traditional for Chhath prasad, household variations during other occasions may use sugar or include semolina (suji) for extra crispness.',
            traditional_preparation: 'Coarsely ground whole wheat flour is rubbed with warm melted ghee (moyen) until it holds a crumb structure. Melted jaggery syrup or warm raw sugar solution is introduced alongside crushed green cardamom, whole fennel seeds, and paper-thin slivers of dry coconut (gari). The stiff, crumbly dough is shaped into small oblong patties, pressed onto oiled wooden sanchas to imprint cultural engravings, and gently deep-fried on medium-low heat in pure desi ghee until a deep reddish-mahogany hue is achieved.',
            seasonality_notes: 'Celebrated predominantly during the post-monsoon autumn season (Kartik Chhath) and early summer (Chaiti Chhath). Highly stable and lasts for weeks without refrigeration.',
            festival_context: 'The primary sacred offering of Chhath Puja; also customary as travel provisions for auspicious journeys (Bidai and auspicious visits).',
            serving_tradition: 'Distributed as sacred prasad wrapped in leaves or cotton cloth after offering Arghya to the rising and setting Sun at river ghats.',
            ingredients: [
                { name: 'Whole Wheat Flour', quantity: '3 cups', is_primary: 1 },
                { name: 'Jaggery (Gur)', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Desi Ghee', quantity: '1 cup (for dough and frying)', is_primary: 1 },
                { name: 'Fennel Seeds (Saunf)', quantity: '1.5 tablespoons', is_primary: 0 },
                { name: 'Dry Coconut (Gari)', quantity: '1/2 cup thinly sliced', is_primary: 0 },
                { name: 'Green Cardamom', quantity: '1 teaspoon crushed', is_primary: 0 }
            ],
            seasons: ['Autumn', 'Winter'],
            references: [
                'Culinary Traditions of Bihar and Eastern India',
                'Feasts and Fasts: A History of Food in India',
                'Culinary Heritage of India - Incredible India'
            ]
        },
        {
            name: 'Sattu Ghol (Sharbat)',
            local_name: 'सत्तू का घोल / सत्तू शरबत',
            slug: 'sattu-ghol',
            state: 'Bihar',
            region: 'East India',
            category: 'Beverage',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/sattu-ghol.svg',
            featured: 1,
            short_description: 'An ancient cooling beverage of the Gangetic plains made by whisking roasted Bengal gram flour in chilled water with roasted cumin, black salt, and lemon.',
            cultural_context: 'Roasted gram flour (sattu) has been described in classical Sanskrit works as \'Saktu\', celebrated for its high nutritional density and cooling character. In Bihar, field workers and travelers have relied on sattu drink for generations to endure the scorching summer Loo winds without heat fatigue. The drink exists in two classic cultural variations: savory (namkeen) with black salt, cumin, and mint, and sweet (meetha) prepared with crushed jaggery. Note: Community preferences dictate the consistency from thin hydration drinks to thick porridge-like meals.',
            traditional_preparation: 'High-grade roasted chana sattu is spooned into an earthen pitcher of cool water. For the savory version, freshly pounded roasted cumin powder (bhuna jeera), rock salt (sendha namak), black salt (kala namak), and freshly squeezed lemon juice are whisked until smooth. Some households fold in finely diced green chillies, fresh mint, and chopped red onions for texture.',
            seasonality_notes: 'Indispensable during Grishma Ritu (summer months of April to June) as a natural hydration shield against dry heat.',
            festival_context: 'Consumed widely during Sattuwan (Sankranti in the month of Baisakh) across Bihar, marking the formal beginning of the hot season.',
            serving_tradition: 'Served freshly stirred in tall earthen glasses (kulhad) or brass tumblers, garnished with a sprinkle of roasted cumin powder.',
            ingredients: [
                { name: 'Chana Sattu (Roasted Gram Flour)', quantity: '4 tablespoons', is_primary: 1 },
                { name: 'Water', quantity: '1.5 cups chilled', is_primary: 1 },
                { name: 'Lemon Juice', quantity: '1 tablespoon', is_primary: 0 },
                { name: 'Roasted Cumin Powder', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Black Salt', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Fresh Mint Leaves', quantity: 'Handful chopped', is_primary: 0 }
            ],
            seasons: ['Summer'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Traditions of Bihar and Eastern India',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Silao Khaja',
            local_name: 'सिलाव का खाजा',
            slug: 'silao-khaja',
            state: 'Bihar',
            region: 'East India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/silao-khaja.svg',
            featured: 0,
            short_description: 'Multi-layered flaky sweet confectionery with up to 52 crisp paper-thin layers, holding a prestigious Geographical Indication (GI) tag from Silao, Nalanda.',
            cultural_context: 'Originating in Silao, situated between the ancient historic centers of Rajgir and Nalanda in Bihar. Local folklore traces the sweet back to antiquity, suggesting it was relished by travelers and monks on the ancient trade routes of Magadha. Awarded the Geographical Indication (GI) tag in 2018 in recognition of its unique regional artisan technique and local water quality. Note: Layer thickness and sugar-coating density vary between master confectioners of Nalanda.',
            traditional_preparation: 'Refined wheat flour dough is kneaded and rolled into paper-thin large sheets. A paste of pure ghee and flour is brushed across the surface before carefully folding and rolling the sheet upon itself repeatedly to generate 30 to 52 micro-layers. These cylindrical folds are sliced into bite-sized fingers, gently rolled, and fried in pure ghee until light golden and crispy. Once drained, they are briefly tossed in a mild warm sugar syrup that coats without softening the distinct crispy layers.',
            seasonality_notes: 'Available and prepared year-round; highly favored for winter travel and festive exchange due to prolonged shelf stability.',
            festival_context: 'Customarily included in traditional marriage gift hampers (bhaat) and ceremonial offerings across central Bihar.',
            serving_tradition: 'Served at room temperature alongside a glass of warm water or tea; celebrated for its delicate brittle crunch.',
            ingredients: [
                { name: 'Refined Wheat Flour (Maida)', quantity: '3 cups', is_primary: 1 },
                { name: 'Pure Desi Ghee', quantity: '1 cup', is_primary: 1 },
                { name: 'Sugar', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Cardamom Powder', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Water', quantity: 'As needed', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'Geographical Indications Registry of India (GI Journal)',
                'Culinary Traditions of Bihar and Eastern India',
                'Culinary Heritage of India - Incredible India'
            ]
        },
        {
            name: 'Mithila Makhana Kheer',
            local_name: 'मखाना खीर',
            slug: 'mithila-makhana-kheer',
            state: 'Bihar',
            region: 'East India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/mithila-makhana-kheer.svg',
            featured: 1,
            short_description: 'A traditional sweet pudding from the Mithila region of Bihar made by gently roasting native fox nuts (makhana) in desi ghee and simmering them in reduced cardamom milk.',
            cultural_context: 'Mithila in northern Bihar is historically the primary center of makhana (fox nut) cultivation in India. Harvested from local wetlands and ponds (pokhars) by the traditional Mallaha community, Mithila Makhana received a Geographical Indication (GI) tag in 2022. In Maithil cultural tradition, makhana forms part of the ceremonial trio "Paan, Maachh, aur Makhaan", representing auspicious hospitality at weddings and festivals. Note: In home preparations, the thickness of the milk and sweetness levels vary across families.',
            traditional_preparation: 'Whole makhana seeds are lightly roasted in pure desi ghee over low flame until crisp. A portion of the roasted seeds is coarsely crushed to give body to the kheer, while the remainder is kept whole. Full-cream cow milk is simmered in a heavy vessel until reduced. The roasted makhana is simmered in the hot milk until tender, then sweetened with sugar or jaggery and seasoned with crushed green cardamom, chopped almonds, and pistachios.',
            seasonality_notes: 'Prepared across the year, with particular cultural importance during the autumn festival of Kojagari Purnima.',
            festival_context: 'Celebrated during Kojagari Purnima in Mithila, as well as family ceremonies and auspicious fasting occasions.',
            serving_tradition: 'Served warm or chilled in small bowls, garnished with toasted nuts.',
            ingredients: [
                { name: 'Mithila Makhana (Fox Nuts)', quantity: '2 cups', is_primary: 1 },
                { name: 'Full Cream Milk', quantity: '1 liter', is_primary: 1 },
                { name: 'Sugar / Jaggery', quantity: '1/2 cup', is_primary: 1 },
                { name: 'Pure Desi Ghee', quantity: '1 tablespoon', is_primary: 0 },
                { name: 'Green Cardamom', quantity: '1/2 teaspoon crushed', is_primary: 0 },
                { name: 'Almonds & Pistachios', quantity: '2 tablespoons sliced', is_primary: 0 }
            ],
            seasons: ['Autumn', 'Year-round'],
            references: [
                'Mithila Makhana - GI Registration Certificate (Application No. 696)',
                'Culinary Traditions of Bihar and Eastern India',
                'A Historical Dictionary of Indian Food'
            ]
        },
        {
            name: 'Bihari Malpua',
            local_name: 'बिहारी मालपुआ / पुआ',
            slug: 'bihari-malpua',
            state: 'Bihar',
            region: 'East India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/bihari-malpua.svg',
            featured: 1,
            short_description: 'A traditional festive sweet pancake made from flour, milk, mashed bananas, and fennel seeds, fried gently in pure ghee and dipped in cardamom sugar syrup.',
            cultural_context: 'Malpua is widely considered one of the oldest recorded confections in Indian food history, with origins traced back to the ancient sweet cake known as Apupa in classical texts. In Bihar, Malpua (commonly called Pua) is the signature dessert of the spring festival of Holi and celebratory family gatherings. The use of ripe mashed banana and whole fennel seeds (saunf) provides its characteristic tender texture and fragrant aroma. Note: Rasedar Malpua is soaked in syrup, while dry Pua (Sookha Pua) is made for travel.',
            traditional_preparation: 'Refined flour and fine semolina are blended with warm milk and thoroughly mashed ripe bananas to form a smooth, pourable batter. Whole fennel seeds and crushed green cardamom are stirred into the batter, which is allowed to rest for several hours. Small rounds of batter are poured into shallow pans of hot desi ghee and fried slowly until the edges become golden and slightly crisp while the center remains tender. The fried puas are dipped briefly in warm cardamom syrup before serving.',
            seasonality_notes: 'Associated with spring (Vasanta Ritu) and the festival of Holi, but enjoyed year-round during family celebrations.',
            festival_context: 'Essential festive dish for Holi (Phagwa) celebrations across Bihar and eastern Uttar Pradesh.',
            serving_tradition: 'Served warm on festive thalis, traditionally accompanied in Bihari households by savoury aloo dum or mutton curry to balance sweetness.',
            ingredients: [
                { name: 'Refined Wheat Flour (Maida)', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Semolina (Suji)', quantity: '2 tablespoons', is_primary: 0 },
                { name: 'Ripe Banana', quantity: '1 large mashed', is_primary: 1 },
                { name: 'Full Cream Milk', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Fennel Seeds (Saunf)', quantity: '1 tablespoon', is_primary: 0 },
                { name: 'Sugar', quantity: '1 cup (for syrup)', is_primary: 1 },
                { name: 'Desi Ghee', quantity: '1 cup (for frying)', is_primary: 1 },
                { name: 'Green Cardamom', quantity: '1/2 teaspoon', is_primary: 0 }
            ],
            seasons: ['Spring', 'Year-round'],
            references: [
                'Culinary Traditions of India - National Cultural Archives',
                'Culinary Traditions of Bihar and Eastern India',
                'A Historical Dictionary of Indian Food'
            ]
        },
        {
            name: 'Dal Pittha (Bagiya)',
            local_name: 'दाल पिठ्ठा / बगिया (Bagiya)',
            slug: 'dal-pittha',
            state: 'Bihar',
            region: 'East India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/dal-pittha.svg',
            featured: 0,
            short_description: 'Traditional steamed rice dumplings stuffed with seasoned coarse Bengal gram (chana dal) paste, celebrating ancient zero-oil steaming traditions.',
            cultural_context: 'Dal Pittha (known as Bagiya in the Mithila region of north Bihar) represents the winter culinary heritage of agrarian eastern India. It marks the arrival of newly harvested winter rice (Aghan/Paush crop). Unlike the heavily spiced curries of the plains, pittha exemplifies an ancient technique of gentle steam cooking, retaining natural grain flavor and wholesome protein. Note: Shapes vary across Mithila (pointed boat shape) and Magadh (crescent dumpling shape).',
            traditional_preparation: 'Chana dal is soaked for 5 hours and coarsely stone-ground with garlic, green chillies, ginger, cumin seeds, turmeric, and fresh coriander leaves to maintain texture without turning watery. Rice flour is kneaded into a soft pliable dough using hot water. Dough balls are hollowed into cup shapes, generously packed with the spiced lentil mixture, sealed into crescent or tapered boat shapes, and steamed in perforated pots over boiling water until glossy and firm.',
            seasonality_notes: 'Prepared predominantly during Paush Sankranti (December - January) when newly harvested paddy is milled.',
            festival_context: 'Core festive meal on Paush Sankranti and rural winter family gatherings in Bihar and Jharkhand.',
            serving_tradition: 'Served steaming hot with fresh spicy coriander-mint chutney, roasted tomato salsa, or a dollop of fresh homemade butter or mustard oil.',
            ingredients: [
                { name: 'Rice Flour', quantity: '2.5 cups', is_primary: 1 },
                { name: 'Chana Dal (Bengal Gram)', quantity: '1.5 cups soaked', is_primary: 1 },
                { name: 'Green Chillies', quantity: '4 finely chopped', is_primary: 0 },
                { name: 'Garlic', quantity: '6 cloves crushed', is_primary: 0 },
                { name: 'Ginger', quantity: '1 inch minced', is_primary: 0 },
                { name: 'Cumin Seeds', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Fresh Coriander', quantity: '1/2 cup chopped', is_primary: 0 }
            ],
            seasons: ['Winter'],
            references: [
                'Culinary Traditions of Bihar and Eastern India',
                'Traditional Food Systems of India',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Gaya Tilkut',
            local_name: 'गया का तिलकुट',
            slug: 'gaya-tilkut',
            state: 'Bihar',
            region: 'East India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/gaya-tilkut.svg',
            featured: 0,
            short_description: 'Artisanal winter confectionery from Gaya, crafted by repeatedly hand-hammering roasted sesame seeds and boiling jaggery or sugar into crisp, wafer-light layers.',
            cultural_context: 'Gaya Tilkut is an artisanal heritage craft originating in the historic spiritual town of Gaya, Bihar. Mentioned in regional folklore for over two centuries, the production is centered in the lanes of Ramna and Tikari. The signature texture—soft yet crisp, dissolving on the tongue—is achieved solely through manual rhythmic hammering with heavy wooden mallets (mugdar) by skilled artisans while the mixture is hot. Note: Traditional winter batches use dark unrefined sugarcane jaggery (Gur Tilkut), though white sugar versions (Chini Tilkut) are also common.',
            traditional_preparation: 'White sesame seeds are thoroughly cleaned, sun-dried, and roasted to an ivory tint. Jaggery is boiled down in large iron cauldrons to a precise stringency stage, pulled repeatedly by hand until it becomes pale and aerated, then blended with the warm sesame seeds. The mass is transferred to stone pits and rhythmically hammered with wooden mallets by paired artisans, folded over repeatedly until thousands of micro-thin brittle layers form, then shaped into flat discs before cooling.',
            seasonality_notes: 'Strictly a winter specialty manufactured from late November through February to capitalize on the warming nature of sesame and jaggery.',
            festival_context: 'The premier delicacy consumed during Makar Sankranti (January 14) along with Dahi Chura (curd and flattened rice) across Bihar and Jharkhand.',
            serving_tradition: 'Broken by hand into shards and eaten as a sweet snack, often paired with hot winter tea or eaten after festive meals.',
            ingredients: [
                { name: 'White Sesame Seeds (Til)', quantity: '3 cups', is_primary: 1 },
                { name: 'Sugarcane Jaggery (Gur)', quantity: '2 cups', is_primary: 1 },
                { name: 'Green Cardamom', quantity: '1/2 teaspoon ground', is_primary: 0 }
            ],
            seasons: ['Winter'],
            references: [
                'Culinary Traditions of Bihar and Eastern India',
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India'
            ]
        },

        // --- EAST INDIA (Bengal & Odisha) ---
        {
            name: 'Mishti Doi',
            local_name: 'মিষ্টি দই',
            slug: 'mishti-doi',
            state: 'West Bengal',
            region: 'East India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/mishti-doi.svg',
            featured: 1,
            short_description: 'Classic Bengali fermented sweet yogurt prepared by slow-reducing milk with caramelized sugar or date palm jaggery, cultured inside porous earthen pots.',
            cultural_context: 'Mishti Doi is a widely recognized and cherished dessert in Bengali culinary tradition. Historical records trace sweetened fermented curds in eastern India across centuries. The porous unglazed earthenware pots (matka or handi) serve a practical function: they absorb excess water, helping the curd set to a thick, velvety texture without requiring commercial stabilizers. Note: During winter, traditional preparations commonly use date palm jaggery (Nolen Gur) instead of refined sugar.',
            traditional_preparation: 'Rich cow or buffalo milk is simmered and reduced over gentle fire to approximately two-thirds of its original volume. Sugar is gently caramelized in a separate pan to create a rich amber hue and complex flavor, then whisked into the warm reduced milk. Once cooled to lukewarm, an active heirloom yogurt starter (doi chanch) is whisked in. The mixture is poured into raw earthen pots, insulated with heavy cloth, and left undisturbed in a warm corner overnight to ferment.',
            seasonality_notes: 'Enjoyed year-round, with heightened cultural significance during Durga Puja (autumn) and the winter season when Nolen Gur is harvested.',
            festival_context: 'Essential sweet concluding celebratory feasts during Durga Puja, Poila Boishakh (Bengali New Year), weddings, and thread ceremonies.',
            serving_tradition: 'Served chilled straight from the earthen matka, offering a cool, creamy contrast to spicy meal courses.',
            ingredients: [
                { name: 'Full Cream Milk', quantity: '1 liter', is_primary: 1 },
                { name: 'Sugar / Nolen Gur (Date Palm Jaggery)', quantity: '3/4 cup', is_primary: 1 },
                { name: 'Yogurt Starter Culture', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Green Cardamom', quantity: '2 pods crushed', is_primary: 0 }
            ],
            seasons: ['Year-round', 'Autumn', 'Winter'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Feasts and Fasts: A History of Food in India',
                'Fermented Foods and Beverages of India'
            ]
        },
        {
            name: 'Machher Jhol',
            local_name: 'মাছের ঝোল',
            slug: 'machher-jhol',
            state: 'West Bengal',
            region: 'East India',
            category: 'Main Dish',
            veg_type: 'Non-Vegetarian',
            image_url: '/assets/images/machher-jhol.svg',
            featured: 0,
            short_description: 'Light, comforting homestyle Bengali freshwater fish stew simmered with seasonal vegetables, mustard oil, and fragrant panch phoron.',
            cultural_context: 'Machher Jhol is the cornerstone of everyday Bengali life, celebrated in literature, cinema, and song. The cuisine of the Bengal delta evolved around an abundance of freshwater rivers and ponds teeming with carps such as Rohu (Rui) and Katla. Unlike rich Mughlai meat curries, traditional jhol is light, water-based, and easy to digest, using seasonal vegetables like pointed gourd (potol), potatoes, and raw banana. Note: Every household preserves slight seasoning variations, balancing ginger paste and green chillies.',
            traditional_preparation: 'Fresh carp steaks are rubbed with turmeric powder and sea salt, then shallow-fried in smoking pungent mustard oil until light golden and set aside. In the remaining oil, whole panch phoron (equal parts cumin, nigella, fenugreek, fennel, and wild celery/radhuni) is spluttered with fresh green chillies. Large wedges of potato and pointed gourd are sautéed gently, followed by a mild slurry of turmeric, cumin paste, and ginger. Hot water is added to form a brothy gravy, into which the fried fish is returned to simmer gently until tender.',
            seasonality_notes: 'Eaten throughout the year for everyday lunch; winter variations frequently feature fresh cauliflower florets and tender green peas.',
            festival_context: 'Standard everyday comfort food, also featured in post-puja family luncheons across West Bengal and Tripura.',
            serving_tradition: 'Served piping hot over fluffy steamed parboiled rice (Siddha Chawal), eaten traditionally by hand.',
            ingredients: [
                { name: 'Freshwater Rohu / Katla Fish', quantity: '500 grams', is_primary: 1 },
                { name: 'Mustard Oil', quantity: '3 tablespoons', is_primary: 1 },
                { name: 'Panch Phoron (Bengali Five Spice)', quantity: '1 teaspoon', is_primary: 1 },
                { name: 'Potatoes', quantity: '2 cut into wedges', is_primary: 0 },
                { name: 'Pointed Gourd (Potol)', quantity: '4 halved', is_primary: 0 },
                { name: 'Green Chillies', quantity: '4 slit', is_primary: 0 },
                { name: 'Turmeric Powder', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Ginger Paste', quantity: '1 tablespoon', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Chhena Poda',
            local_name: 'ଛେନାପୋଡ଼',
            slug: 'chhena-poda',
            state: 'Odisha',
            region: 'East India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/chhena-poda.svg',
            featured: 1,
            short_description: 'Odisha\'s iconic baked confection, often heralded as the indigenous burnt cheesecake, made by slow-baking fresh cottage cheese, sugar, and cardamom wrapped in Sal leaves.',
            cultural_context: 'Chhena Poda (literally "burnt cheese") originated in the town of Nayagarh, Odisha, in the early 20th century, created by confectioner Sudarshana Sahoo who experimented by leaving sweetened curd in a dying hearth. The confection has since become synonymous with Odia culinary ingenuity. The slow caramelization of milk sugars produces a smoky, deeply browned, bittersweet crust protecting a moist, melt-in-mouth core. Note: Authentic preparations avoid ovens, relying on dying charcoal embers and sal leaf wrappings.',
            traditional_preparation: 'Fresh cow milk is curdled to produce soft, moist chhena (cottage cheese). The chhena is vigorously hand-kneaded with coarse sugar, a dash of semolina (suji) for structure, crushed cardamom seeds, ghee, and cashew nuts until light and emulsified. A heavy vessel is lined with fresh wild Sal (Shorea robusta) leaves greased with desi ghee. The sweet mixture is poured in, covered with another layer of sal leaves, and placed between live charcoal embers to bake slowly for three to four hours until deeply caramelized.',
            seasonality_notes: 'Relished throughout the year across Odisha, particularly during festive winter fairs and family celebrations.',
            festival_context: 'Associated with Raja Parba (the agrarian earth festival) and offered at local temples across Nayagarh, Puri, and Bhubaneswar.',
            serving_tradition: 'Cut into thick wedges once cooled completely, revealing the contrast between the dark mahogany crust and white interior.',
            ingredients: [
                { name: 'Fresh Chhena (Cottage Cheese)', quantity: '500 grams', is_primary: 1 },
                { name: 'Sugar', quantity: '1 cup', is_primary: 1 },
                { name: 'Semolina (Suji)', quantity: '2 tablespoons', is_primary: 0 },
                { name: 'Cardamom Powder', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Desi Ghee', quantity: '2 tablespoons', is_primary: 0 },
                { name: 'Cashews & Raisins', quantity: '2 tablespoons', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'Culinary Heritage of India - Incredible India',
                'A Historical Dictionary of Indian Food',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Dalma',
            local_name: 'ଡାଲମା',
            slug: 'dalma',
            state: 'Odisha',
            region: 'East India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/dalma.svg',
            featured: 0,
            short_description: 'Sattvic Odia lentil and indigenous vegetable preparation, simmered in an earthenware pot, tempered in ghee with panch phoron and roasted cumin-chilli powder.',
            cultural_context: 'Dalma is an ancient spiritual dish inextricably linked to the sacred culinary tradition of the Jagannath Temple in Puri, where it forms a key item in the Mahaprasad (Chhappan Bhog) cooked in towering earthen pots stacked over wood fire. Following traditional temple dietary codes, authentic dalma avoids foreign nightshades (potatoes, tomatoes) and pungent alliums (onion, garlic), instead relying on native Indian tubers and vegetables like raw plantain, yam, pumpkin, and raw papaya. Note: Domestic household versions may incorporate potatoes or varying lentil combinations.',
            traditional_preparation: 'Toor dal (or roasted moong dal) is brought to a boil in water with turmeric, ginger, and rock salt. Substantial chunks of native vegetables—raw banana, sweet pumpkin, raw papaya, colocasia (arbi), and eggplant—are added and simmered slowly until tender without disintegrating. In pure cow ghee, panch phoron and dry red chillies are tempered and poured over the simmering lentils. The dish is immediately finished with freshly ground roasted cumin and dry chilli powder (bhuna jeera-lanka gunda) and grated fresh coconut.',
            seasonality_notes: 'Cooked year-round as the foundation of Odia daily lunch; adjustments in vegetable choices reflect seasonal garden harvests.',
            festival_context: 'Offered during Kartika Masa, temple fasts, and religious feasts across Odisha.',
            serving_tradition: 'Served steaming hot with Odia Kanika (sweet fragrant rice) or plain steamed rice, accompanied by a lemon wedge.',
            ingredients: [
                { name: 'Toor Dal / Moong Dal', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Raw Banana (Plantain)', quantity: '1 medium diced', is_primary: 0 },
                { name: 'Sweet Pumpkin', quantity: '1 cup cubed', is_primary: 0 },
                { name: 'Raw Papaya', quantity: '1 cup cubed', is_primary: 0 },
                { name: 'Desi Ghee', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Panch Phoron', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Roasted Cumin & Chilli Powder', quantity: '1.5 teaspoons', is_primary: 1 },
                { name: 'Grated Fresh Coconut', quantity: '3 tablespoons', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Traditional Food Systems of India'
            ]
        },

        // --- NORTH INDIA (Punjab, Kashmir, Himachal, Uttarakhand, UP) ---
        {
            name: 'Sarson Ka Saag & Makki Di Roti',
            local_name: 'ਸਰ੍ਹੋਂ ਦਾ ਸਾਗ ਤੇ ਮੱਕੀ ਦੀ ਰੋਟੀ',
            slug: 'sarson-ka-saag-makki-di-roti',
            state: 'Punjab',
            region: 'North India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/sarson-saag.svg',
            featured: 1,
            short_description: 'The definitive agrarian winter feast of Punjab: slow-simmered mustard greens with bathua, churned with maize flour, served with rustic cornmeal flatbreads and fresh white butter.',
            cultural_context: 'This dish embodies the rich agrarian life of the fertile Punjab plains during the rabi harvest season. As mustard fields bloom golden across Punjab, young tender leaves of sarson are gathered alongside wild winter bathua (Chenopodium) and spinach. The traditional preparation is an unhurried, multi-hour community ritual where the greens are cooked down in heavy brass vessels (patila) and rhythmically mashed with a wooden churner (ghotna/madhani). Note: Proportions of mustard leaves to tempering greens vary by family to balance the natural bitterness of the mustard leaf.',
            traditional_preparation: 'Fresh mustard greens, bathua, and spinach are meticulously washed, chopped, and simmered for hours over gentle heat with ginger, garlic, green chillies, and salt until completely soft. Maize flour (makki da atta) is gradually added as a binding liaison (alan) while vigorously churning with a wooden madhani into a thick, coarse puree. A robust tempering of chopped onions, ginger, and garlic browned in pure desi ghee is stirred through. Maize flour is hand-patted into thick flatbreads on a hot tawa and roasted over direct embers.',
            seasonality_notes: 'Strictly a winter seasonal specialty (November through February) when wild bathua and tender mustard leaves are freshly harvested.',
            festival_context: 'Centerpiece of Lohri and Maghi harvest celebrations across Punjab and northern India.',
            serving_tradition: 'Served steaming hot crowned with a generous dollop of freshly churned homemade white butter (makhan), accompanied by cubes of raw jaggery (gur), whole green chillies, and radish slices.',
            ingredients: [
                { name: 'Mustard Greens (Sarson)', quantity: '500 grams', is_primary: 1 },
                { name: 'Bathua Greens (Chenopodium)', quantity: '250 grams', is_primary: 0 },
                { name: 'Spinach (Palak)', quantity: '250 grams', is_primary: 0 },
                { name: 'Maize Flour (Makki Ka Atta)', quantity: '3 cups (for roti & liaison)', is_primary: 1 },
                { name: 'Desi Ghee / Fresh White Butter', quantity: '1/2 cup', is_primary: 1 },
                { name: 'Ginger', quantity: '2 tablespoons minced', is_primary: 0 },
                { name: 'Garlic', quantity: '2 tablespoons minced', is_primary: 0 },
                { name: 'Green Chillies', quantity: '4 finely chopped', is_primary: 0 }
            ],
            seasons: ['Winter'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Kashmiri Rogan Josh',
            local_name: 'روغن جوش (Rogan Josh)',
            slug: 'kashmiri-rogan-josh',
            state: 'Jammu & Kashmir',
            region: 'North India',
            category: 'Main Dish',
            veg_type: 'Non-Vegetarian',
            image_url: '/assets/images/rogan-josh.svg',
            featured: 1,
            short_description: 'Aromatic Kashmiri lamb stew braised in mustard oil with mild Kashmiri chillies, dried cockscomb flower extract, and crushed fennel, without onions or garlic.',
            cultural_context: 'Rogan Josh (derived from Persian words referring to clarified butter/oil and passionate simmering) is an ancient pillar of Kashmiri culinary heritage. Present in both the elaborate 36-course royal court Wazwan tradition and the revered Kashmiri Pandit festive kitchen. In the traditional Pandit style, the preparation is distinctly marked by the exclusion of onions and garlic, relying instead on hing (asafoetida), dry ginger (sonth), and fennel (saunf) for aromatic depth, and natural extracts of dried cockscomb petals (maval/ratanjot) for its legendary crimson glow. Note: Wazwan Muslim preparations use shallots (pran) and garlic paste.',
            traditional_preparation: 'Bone-in lamb pieces are browned in smoking pure mustard oil with whole green and black cardamoms, cloves, and cinnamon. Asafoetida water is added, followed by whisked yogurt and a deep crimson paste of stemless Kashmiri red chillies. The stew is flavored with stone-ground fennel seed powder and dry ginger powder (sonth). The broth is tinted using an infusion of dried maval (cockscomb flower) simmered in warm water, then tightly sealed (dum) over embers until the meat is meltingly tender and the fragrant spiced oil separates.',
            seasonality_notes: 'Cherished in the frigid Kashmiri winters (Chillai Kalan) for the warming properties of ginger, fennel, and mustard oil.',
            festival_context: 'Served at Kashmiri weddings and festive family gatherings during Herath (Maha Shivaratri) and Eid.',
            serving_tradition: 'Served hot ladled over mounds of fragrant steamed Kashmiri white rice, paired with pickled knol-khol (monji aachhar).',
            ingredients: [
                { name: 'Bone-in Mutton / Lamb', quantity: '750 grams', is_primary: 1 },
                { name: 'Mustard Oil', quantity: '1/2 cup', is_primary: 1 },
                { name: 'Kashmiri Dried Red Chillies', quantity: '8 whole boiled & pasted', is_primary: 1 },
                { name: 'Fennel Seed Powder (Saunf)', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Dry Ginger Powder (Sonth)', quantity: '1 tablespoon', is_primary: 1 },
                { name: 'Asafoetida (Hing)', quantity: '1/2 teaspoon dissolved', is_primary: 0 },
                { name: 'Cockscomb Flower (Maval) / Ratanjot', quantity: '2 tablespoons steeped extract', is_primary: 0 },
                { name: 'Whisked Curd', quantity: '1/2 cup', is_primary: 0 }
            ],
            seasons: ['Winter', 'Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Himachali Siddu',
            local_name: 'सिड्डू (Siddu)',
            slug: 'himachali-siddu',
            state: 'Himachal Pradesh',
            region: 'North India',
            category: 'Bread & Flatbread',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/himachali-siddu.svg',
            featured: 0,
            short_description: 'Traditional fermented, steamed Himachali yeast bread stuffed with spiced walnuts, poppy seeds, or lentils, drenched in pure warm desi ghee.',
            cultural_context: 'Siddu is a traditional mountain comfort bread indigenous to the high-altitude valleys of Kullu, Mandi, Shimla, and Kangra in Himachal Pradesh. Developed by mountain communities to provide dense caloric sustenance and sustained bodily warmth during freezing Himalayan winters. Natural wild yeast fermentation gives the dough its distinct pillowy texture, while fillings of nutrient-dense opium poppy seeds (khus-khus) or wild walnuts provide rich mountain sustenance. Note: Fillings vary regionally from sweet poppy-seed paste to savory spiced urad dal.',
            traditional_preparation: 'Wheat flour is kneaded with warm water and local natural yeast into a soft dough, then left in a warm corner of the mountain hearth for 4 to 6 hours to ferment and double in size. The stuffing is prepared by grinding soaked poppy seeds or roasted walnuts with green chillies, garlic, coriander seeds, and mountain salt. The fermented dough is rolled into thick ovals, stuffed generously, folded into half-moon crescents with fluted edges, and steamed in tiered brass steamers (dalshik) over rolling water for 20 minutes.',
            seasonality_notes: 'Cooked primarily during autumn and winter (October to March) to withstand sub-zero Himalayan weather.',
            festival_context: 'Prepared during local Pahadi fairs, winter marriages, and the festival of Saza (Makar Sankranti) in Himachal.',
            serving_tradition: 'Cut open down the center and served completely submerged in melted hot desi ghee, alongside homemade green mint-coriander chutney or walnut chutney.',
            ingredients: [
                { name: 'Wheat Flour', quantity: '3 cups', is_primary: 1 },
                { name: 'Poppy Seeds (Khus-Khus) / Walnuts', quantity: '1 cup soaked', is_primary: 1 },
                { name: 'Desi Ghee', quantity: '1/2 cup for serving', is_primary: 1 },
                { name: 'Yeast', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Green Chillies', quantity: '2 chopped', is_primary: 0 },
                { name: 'Coriander Seeds', quantity: '1 teaspoon crushed', is_primary: 0 },
                { name: 'Garlic', quantity: '4 cloves minced', is_primary: 0 }
            ],
            seasons: ['Winter', 'Autumn'],
            references: [
                'Culinary Heritage of India - Incredible India',
                'Traditional Food Systems of India',
                'A Historical Dictionary of Indian Food'
            ]
        },
        {
            name: 'Garhwal Ka Fannah',
            local_name: 'गढ़वाल का फण्‍णा',
            slug: 'garhwal-ka-fannah',
            state: 'Uttarakhand',
            region: 'North India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/garhwal-fannah.svg',
            featured: 0,
            short_description: 'Nutritious Garhwali mountain preparation of slow-cooked coarse horse gram (Gahat) dal, tempered in an iron kadhai with aromatic wild Himalayan Jakhiya seeds.',
            cultural_context: 'Originating in the rugged Garhwal hills of Uttarakhand, Fannah represents the resilient mountain food culture that developed around native cold-tolerant hill pulses like Gahat (horse gram / Kulath) and Bhatt (black soybean). Cooking in heavy unlined cast iron cookware (lohe ki kadhai) is deliberate: it interacts with the lentils to produce a deep dusky green-black broth while imparting essential dietary iron. The signature aroma is crowned by Jakhiya (Cleome viscosa), a wild mountain seed that adds an earthy crunch. Note: Regional variations may substitute Gahat with local black soybeans.',
            traditional_preparation: 'Gahat dal is soaked overnight in mountain spring water, then coarsely ground on a stone silbatta with green chillies, garlic, and ginger into a thick paste. Half the paste is roasted in hot mustard oil inside an iron kadhai with coriander powder and turmeric until aromatic; mountain water is added to simmer it into a rich, velvety gravy. The remaining paste is spooned in as rustic dumplings that poach directly in the simmering broth. The dish is tempered with crunchy crackling jakhiya seeds and dried red chillies in ghee.',
            seasonality_notes: 'Favored in the cold autumn and winter months due to the recognized warming properties of horse gram in traditional Himalayan folk knowledge.',
            festival_context: 'Commonly prepared for winter community meals and traditional Garhwali harvest feasts.',
            serving_tradition: 'Served hot with steamed mountain red rice or Mandua (finger millet / ragi) rotis, paired with Pahadi cucumber raita seasoned with mustard.',
            ingredients: [
                { name: 'Gahat Dal (Horse Gram)', quantity: '2 cups soaked', is_primary: 1 },
                { name: 'Jakhiya Seeds (Cleome viscosa)', quantity: '1 teaspoon', is_primary: 1 },
                { name: 'Mustard Oil / Ghee', quantity: '3 tablespoons', is_primary: 1 },
                { name: 'Garlic', quantity: '6 cloves crushed', is_primary: 0 },
                { name: 'Ginger', quantity: '1 inch minced', is_primary: 0 },
                { name: 'Green Chillies', quantity: '3 whole', is_primary: 0 },
                { name: 'Turmeric Powder', quantity: '1/2 teaspoon', is_primary: 0 }
            ],
            seasons: ['Winter', 'Autumn'],
            references: [
                'Traditional Food Systems of India',
                'Culinary Heritage of India - Incredible India',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Kadhi Pakora',
            local_name: 'कढ़ी पकोड़ा',
            slug: 'kadhi-pakora',
            state: 'Uttar Pradesh',
            region: 'North India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/kadhi-pakora.svg',
            featured: 0,
            short_description: 'Tangy spiced sour curd and gram flour stew simmered slowly for hours, studded with soft gram flour fritters (pakoras), finished with a ghee and fenugreek tempering.',
            cultural_context: 'Kadhi is an ancient North Indian preparation referenced in early medieval texts as \'Karambha\' (a buttermilk-based gruel). In the fertile plains of Uttar Pradesh, Bihar, and Punjab, kadhi developed as a practical culinary method to utilize surplus churned buttermilk (chhaas/mattha). Slow simmering for over an hour (known as kadhna, meaning to reduce and concentrate) breaks down raw flour starch and develops a complex velvety sour profile. Note: While UP-style pakoras are typically soft plain besan dumplings, Punjabi versions frequently fold in sliced onions and potatoes.',
            traditional_preparation: 'Sour, naturally fermented curd or buttermilk is whisked with chickpea flour (besan), water, turmeric, and salt to form a thin slurry. The base is brought to a boil in a heavy pot and simmered gently on low heat for 45 to 60 minutes, stirring occasionally as it thickens. Fritters (pakoras) made of whipped besan seasoned with ajwain are deep-fried until crisp and folded into the hot kadhi to absorb the gravy. The dish is elevated with a double tadka of mustard seeds, fenugreek seeds (methi dana), cumin, hing, and dried whole red chillies crackled in pure ghee.',
            seasonality_notes: 'Popular year-round; especially comforting during monsoon rains and warm summer afternoons due to its gut-cooling fermented curd base.',
            festival_context: 'Associated with family comfort lunches and community bhandaras across northern India.',
            serving_tradition: 'Served piping hot over plain steamed Basmati rice (Kadhi Chawal), with a side of spicy mango pickle and roasted papad.',
            ingredients: [
                { name: 'Sour Curd / Buttermilk', quantity: '2 cups', is_primary: 1 },
                { name: 'Gram Flour (Besan)', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Fenugreek Seeds (Methi Dana)', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Mustard Seeds & Cumin', quantity: '1 teaspoon each', is_primary: 0 },
                { name: 'Asafoetida (Hing)', quantity: '1/4 teaspoon', is_primary: 0 },
                { name: 'Desi Ghee', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Turmeric Powder', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Dry Red Chillies', quantity: '3 whole', is_primary: 0 }
            ],
            seasons: ['Year-round', 'Monsoon', 'Summer'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },

        // --- WEST INDIA (Rajasthan, Gujarat, Maharashtra, Goa) ---
        {
            name: 'Dal Baati Churma',
            local_name: 'दाल बाटी चूरमा',
            slug: 'dal-baati-churma',
            state: 'Rajasthan',
            region: 'West India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/dal-baati.svg',
            featured: 1,
            short_description: 'The royal three-in-one culinary hallmark of Rajasthan: oven-baked whole wheat dumplings (baati) soaked in pure ghee, five-lentil stew (dal), and sweetened crushed baati (churma).',
            cultural_context: 'Originating during the reign of the Guhilot/Sisodia dynasty of Mewar in arid Rajasthan. The baati evolved as a pragmatic wartime survival food: Rajput warriors would bury hard dough balls beneath desert sands before marching to battle; by afternoon, the searing desert sun baked them thoroughly. Back home, it transformed into an opulent culinary trio comprising spiced panchmel dal, ghee-soaked baatis, and sweetened cardamom-scented churma. Note: Baatis may be plain, stuffed with spiced peas or sattu, or roasted over cow-dung embers or modern tandoors.',
            traditional_preparation: 'Coarsely milled whole-wheat flour is mixed with semolina, a pinch of baking soda, ajwain seeds, and ghee (moyen), then kneaded with warm milk into a stiff dough. Hand-rolled balls are baked slowly over charcoal embers, dung cakes, or in a baati oven until the exterior develops a hard, cracked golden crust. The hot baatis are gently cracked open by hand and submerged in melted desi ghee. The accompanying dal is made of five lentils (toor, moong, chana, masoor, urad) simmered with ginger, cloves, and a robust ghee-hing tempering. Extra baatis are crushed finely, roasted with ghee, and blended with boora sugar and cardamom to make churma.',
            seasonality_notes: 'Celebrated across the cooler autumn and winter months, though served year-round on festive occasions.',
            festival_context: 'The premier royal feast of Rajasthan served during weddings, Diwali, Makar Sankranti, and family celebrations.',
            serving_tradition: 'Presented on a grand thali: crushed baati drenched in warm ghee, flanked by a bowl of spicy panchmel dal, sweet churma, spicy garlic chutney (lahsun ki chutney), and buttermilk.',
            ingredients: [
                { name: 'Coarse Whole Wheat Flour', quantity: '3 cups', is_primary: 1 },
                { name: 'Panchmel Mixed Lentils', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Pure Desi Ghee', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Ajwain (Carom Seeds)', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Boora / Powdered Sugar', quantity: '1 cup (for churma)', is_primary: 0 },
                { name: 'Green Cardamom', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Asafoetida (Hing)', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Garlic', quantity: '8 cloves (for chutney)', is_primary: 0 }
            ],
            seasons: ['Winter', 'Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Gatte Ki Sabzi',
            local_name: 'गट्टे की सब्ज़ी',
            slug: 'gatte-ki-sabzi',
            state: 'Rajasthan',
            region: 'West India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/gatte-sabzi.svg',
            featured: 0,
            short_description: 'Arid-zone Rajasthani curry of poached gram flour dumplings simmered in a yogurt-based gravy fragrant with ajwain, fennel, and dried fenugreek.',
            cultural_context: 'Gatte Ki Sabzi exemplifies the inventive resourcefulness of traditional Rajasthani Marwari cooking. In the Thar Desert environment where fresh vegetables were virtually non-existent during long scorching summers, local cooks turned to drought-resilient legumes—principally chickpea flour (besan)—and cultured dairy. The dumplings are boiled directly in salted water before being folded into a spiced yogurt gravy. Note: Variations exist between rich festive preparations containing khoya/dry fruits and everyday rustic home gravies.',
            traditional_preparation: 'Bengal gram flour is seasoned with crushed carom seeds, crushed fennel, red chilli powder, turmeric, salt, and yogurt with a spoonful of oil. Kneaded into a smooth, pliable dough, it is rolled into thick cylindrical ropes and poached in boiling water until small bubbles appear on the surface (signifying thorough cooking). Once cooled, the cylinders are sliced into round nuggets (gatte). The gatte are then simmered in a whisked yogurt gravy tempered with mustard seeds, cumin, hing, and finished with crushed kasuri methi.',
            seasonality_notes: 'Historically significant during the summer months when fresh greens were unavailable; relished year-round today.',
            festival_context: 'Standard feature of Rajasthani festive thalis and Marwari wedding banquets.',
            serving_tradition: 'Served hot with whole-wheat rotis or bajra (pearl millet) rotis, accompanied by fresh onion salad and spicy ker-sangri pickle.',
            ingredients: [
                { name: 'Gram Flour (Besan)', quantity: '2 cups', is_primary: 1 },
                { name: 'Yogurt (Curd)', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Ajwain (Carom Seeds)', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Fennel Seeds', quantity: '1 teaspoon crushed', is_primary: 0 },
                { name: 'Kasuri Methi (Dried Fenugreek)', quantity: '1 tablespoon', is_primary: 0 },
                { name: 'Mustard Oil / Ghee', quantity: '2 tablespoons', is_primary: 0 },
                { name: 'Asafoetida (Hing)', quantity: '1/4 teaspoon', is_primary: 0 }
            ],
            seasons: ['Summer', 'Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Gujarati Dhokla (Khaman & Fermented)',
            local_name: 'ઢોકળા / ખમણ (Dhokla)',
            slug: 'gujarati-dhokla',
            state: 'Gujarat',
            region: 'West India',
            category: 'Fermented Food',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/gujarati-dhokla.svg',
            featured: 1,
            short_description: 'Steamed, savory fermented cake made from rice and chickpea flour, seasoned with ginger and green chillies, tempered with mustard seeds, sesame, and curry leaves.',
            cultural_context: 'Dhokla is a quintessential specialty of Gujarati farsan (savory snack) culture. Its antiquity is documented in the 11th-century Jain text \'Vaddaradhane\' and 16th-century Gujarati works (as \'Dukkia\'), showcasing India\'s ancient mastery of pulse fermentation and gentle steam cooking. The traditional variety uses soaked rice and chana dal fermented overnight, producing a spongy, digestible texture without modern chemical leaveners. Note: Traditional fermented white/yellow dhokla differs from rapid-rise gram flour Khaman.',
            traditional_preparation: 'Rice and split Bengal gram (chana dal) are soaked, stone-ground with sour curd into a medium-thick batter, and fermented in a warm place for 8 to 12 hours. The fermented batter is seasoned with crushed ginger, green chilli paste, turmeric, and a dash of hing. Poured onto greased shallow metal plates, it is steamed in a closed vessel for 15 minutes until light and spongy. Upon cooling slightly, a hot tempering of peanut oil, mustard seeds, white sesame seeds, asafoetida, green chillies, and curry leaves is poured evenly across the surface.',
            seasonality_notes: 'Prepared and enjoyed year-round for breakfast and afternoon snacks.',
            festival_context: 'Pivotal element of Gujarati wedding buffets, Diwali farsan platters, and family Sunday breakfasts.',
            serving_tradition: 'Cut into diamond or square pieces, served warm or at room temperature alongside spicy green coriander chutney and sweet tamarind-date chutney.',
            ingredients: [
                { name: 'Chana Dal (Bengal Gram)', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Rice', quantity: '1 cup', is_primary: 1 },
                { name: 'Sour Curd', quantity: '1/2 cup', is_primary: 0 },
                { name: 'Mustard Seeds', quantity: '1.5 teaspoons', is_primary: 0 },
                { name: 'White Sesame Seeds', quantity: '1 tablespoon', is_primary: 0 },
                { name: 'Green Chillies & Ginger Paste', quantity: '2 tablespoons', is_primary: 0 },
                { name: 'Curry Leaves', quantity: '1 sprig', is_primary: 0 },
                { name: 'Peanut Oil', quantity: '2 tablespoons', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Fermented Foods and Beverages of India',
                'Culinary Heritage of India - Incredible India'
            ]
        },
        {
            name: 'Puran Poli',
            local_name: 'पुरणपोळी (Puran Poli)',
            slug: 'puran-poli',
            state: 'Maharashtra',
            region: 'West India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/puran-poli.svg',
            featured: 1,
            short_description: 'Celebrated Maharashtrian festive flatbread stuffed with a fragrant, melt-in-mouth filling of chana dal, jaggery, nutmeg, and cardamom, roasted in desi ghee.',
            cultural_context: 'Puran Poli is the defining festive confection of Maharashtra, holding a central place in the celebrations of Holi, Gudi Padwa (New Year), and Ganesh Chaturthi. Historical antecedents appear in the 12th-century Sanskrit royal encyclopedia \'Manasollasa\' written by Western Chalukya King Someshvara III (termed \'Polika\'). The sweet stuffing (puran) made of chana dal and dark jaggery is seasoned with freshly grated nutmeg (jaiphal) and cardamom. Note: Versions across Karnataka (Obbattu/Holige) and Gujarat (Vedmi) employ subtle differences in flour blending and dal processing.',
            traditional_preparation: 'Chana dal is boiled until tender and thoroughly drained (the aromatic cooking water is preserved to make Katachi Amti). The cooked dal is mashed with dark jaggery and cooked down in a heavy vessel until thick; grated nutmeg and cardamom powder are folded in. The mixture is passed through a traditional brass sieve (puranyantra) to achieve a silky paste. A soft, elastic dough of wheat flour and maida is wrapped around equal portions of puran, rolled out wafer-thin on a floured board, and roasted on a hot iron tawa with liberal brushings of pure desi ghee.',
            seasonality_notes: 'Relished in all seasons, with festive peaks during spring (Holi/Gudi Padwa) and late monsoon (Ganesh Chaturthi).',
            festival_context: 'The mandatory festive food of Gudi Padwa, Holi, and Ganesh Festival across Maharashtra.',
            serving_tradition: 'Served steaming hot with a pool of melted desi ghee on top, accompanied by spicy Katachi Amti (tempered dal broth) and a bowl of warm milk.',
            ingredients: [
                { name: 'Chana Dal (Bengal Gram)', quantity: '2 cups', is_primary: 1 },
                { name: 'Jaggery (Gur)', quantity: '2 cups', is_primary: 1 },
                { name: 'Whole Wheat Flour', quantity: '2 cups', is_primary: 1 },
                { name: 'Nutmeg Powder (Jaiphal)', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Cardamom Powder', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Pure Desi Ghee', quantity: '1/2 cup for roasting', is_primary: 1 }
            ],
            seasons: ['Spring', 'Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Feasts and Fasts: A History of Food in India',
                'Culinary Heritage of India - Incredible India'
            ]
        },
        {
            name: 'Maharashtrian Misal Pav',
            local_name: 'मिसळ पाव (Misal Pav)',
            slug: 'maharashtrian-misal-pav',
            state: 'Maharashtra',
            region: 'West India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/misal-pav.svg',
            featured: 0,
            short_description: 'Fiery sprouted moth bean (matki) curry topped with crunchy farsan, diced onions, and a shimmering layer of spiced red oil (tarri), served with pav.',
            cultural_context: 'Misal Pav is an iconic culinary invention of Maharashtra, having evolved across distinct regional epicenters including Kolhapur, Pune, and Nashik. Sprouted moth beans (matki) reflect the traditional Maharashtrian wisdom of pulse sprouting, which enhances nutrient bioavailability and natural sweetness. The defining feature is the two-tiered gravy: the gentle sprout curry (usal) and the searing, aromatic red spiced oil broth (tarri or rassa) flavored with coconut and traditional goda masala. Note: Spiciness and coconut usage vary from the fiery Kolhapuri style to the milder, subtly sweet Puneri variation.',
            traditional_preparation: 'Moth beans are soaked, wrapped in a warm damp cloth for 24 hours until long sprouts appear, then lightly steamed with turmeric. In hot oil, an aromatic paste of roasted onions, dry coconut, ginger, garlic, and special Maharashtrian goda masala (stone flower, coriander, cinnamon, coconut) is fried until oil separates. Water is introduced to produce a light sprout curry along with the floating spiced red oil (kat). To assemble, a bowl is filled with sprouted usal, ladled with bubbling tarri, crowned with crunchy farsan (sev, fried chana), and minced raw onions with coriander.',
            seasonality_notes: 'Popular year-round; particularly relished during torrential monsoon rains and winter mornings for its invigorating warming spices.',
            festival_context: 'Beloved everyday breakfast, evening snack, and casual gathering food across urban and rural Maharashtra.',
            serving_tradition: 'Served with fresh butter-toasted pav (bread rolls), lemon wedges, and an extra small bowl of spicy tarri (rassa) for pouring.',
            ingredients: [
                { name: 'Sprouted Moth Beans (Matki)', quantity: '2 cups', is_primary: 1 },
                { name: 'Goda Masala (Maharashtrian Spice Blend)', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Dry Coconut (Copra)', quantity: '1/2 cup grated', is_primary: 0 },
                { name: 'Farsan / Sev Mix', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Onions', quantity: '3 finely chopped', is_primary: 0 },
                { name: 'Ginger & Garlic Paste', quantity: '2 tablespoons', is_primary: 0 },
                { name: 'Red Chilli Powder', quantity: '2 teaspoons', is_primary: 0 },
                { name: 'Pav (Bread Rolls)', quantity: '8 pieces', is_primary: 0 }
            ],
            seasons: ['Year-round', 'Monsoon', 'Winter'],
            references: [
                'Culinary Heritage of India - Incredible India',
                'A Historical Dictionary of Indian Food',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Goan Fish Curry (Xitt Codi)',
            local_name: 'कडी शिंत (Kodi Xitt / Fish Curry)',
            slug: 'goan-fish-curry',
            state: 'Goa',
            region: 'West India',
            category: 'Main Dish',
            veg_type: 'Non-Vegetarian',
            image_url: '/assets/images/goan-fish-curry.svg',
            featured: 1,
            short_description: 'Coastal Goan fish curry featuring fresh Kingfish or Mackerel simmered in a creamy, vibrant gravy of freshly ground coconut, Kashmiri chillies, and tangy dried kokum.',
            cultural_context: 'Xitt Codi (Rice and Fish Curry) is the defining daily sustenance of Goa, cherished equally across Hindu and Christian households. It reflects Goa\'s coastal ecology where abundant coconut palms, fresh Arabian Sea catches, and native sun-dried souring agents intersect. Unlike Western Indian curries that rely on tamarind or tomatoes, authentic Goan Saraswat and Catholic curries employ Kokum (Garcinia indica) or local Tirphal (teppal/Szechuan pepper relative), giving the gravy a gentle fruity tartness and complex digestive balance. Note: While Saraswat preparations may use tirphal, Catholic versions often feature coconut vinegar.',
            traditional_preparation: 'Freshly grated coconut is stone-ground with whole Kashmiri dried chillies, coriander seeds, cumin, garlic, and turmeric into a silky, sunset-orange paste. The ground spice paste is transferred to an earthenware pot (kunddi) and simmered with water, green chillies, and steeped dried kokum rinds. Fresh slices of Kingfish (Surmai) or Mackerel (Bangda) are gently introduced into the simmering gravy for five to seven minutes until tender, allowing the natural sea juices to infuse the coconut broth without breaking the fish.',
            seasonality_notes: 'Eaten daily throughout the year; during monsoon fishing bans, dried cured fish or local river prawns are used.',
            festival_context: 'Essential daily meal and Sunday feast centerpiece across Goan families.',
            serving_tradition: 'Served steaming hot with unpolished Goan red parboiled rice (Ukda rice), fried fish, and seasonal vegetable kismoor.',
            ingredients: [
                { name: 'Fresh Kingfish (Surmai) / Mackerel', quantity: '500 grams', is_primary: 1 },
                { name: 'Fresh Grated Coconut', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Kokum (Dried Garcinia Rinds)', quantity: '5-6 petals', is_primary: 1 },
                { name: 'Kashmiri Dried Red Chillies', quantity: '6 whole', is_primary: 0 },
                { name: 'Coriander Seeds', quantity: '1 tablespoon', is_primary: 0 },
                { name: 'Garlic', quantity: '5 cloves', is_primary: 0 },
                { name: 'Turmeric Powder', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Green Chillies', quantity: '2 slit', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Goan Bebinca',
            local_name: 'बेबिका (Bebinca)',
            slug: 'goan-bebinca',
            state: 'Goa',
            region: 'West India',
            category: 'Sweet & Confectionery',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/goan-bebinca.svg',
            featured: 0,
            short_description: 'Celebrated traditional multi-layered Indo-Portuguese pudding baked painstakingly layer upon layer from thick coconut milk, egg yolks, flour, ghee, and nutmeg.',
            cultural_context: 'Revered as the "Queen of Goan Desserts", Bebinca holds a certified Geographical Indication (GI) tag. Originating in the 17th century in the Santa Monica Convent of Old Goa, it was devised by nun Sister Bebiana to utilize surplus egg yolks left after egg whites were used for ironing colonial habits and clarifying wine. The recipe fused Portuguese layered pastry techniques with native Goan ingredients: rich coastal coconut milk, indigenous jaggery/sugar, and aromatic nutmeg. Note: Traditional master bakers construct between 7 and 16 distinct visible layers.',
            traditional_preparation: 'Thick, first-extract coconut milk is blended with egg yolks, refined flour, sugar, and ground nutmeg into a smooth, velvety batter. A heavy vessel is greased with desi ghee, and a layer of batter is poured and baked under overhead heat until set. A spoonful of melted ghee is brushed across the top, followed by the next layer of batter. This painstaking process of baking and basting each layer individually is repeated 7 to 12 times to form a gleaming, stratified cake with distinct contrasting horizontal bands.',
            seasonality_notes: 'Enjoyed primarily during the pleasant winter season and year-end celebrations.',
            festival_context: 'The premier centerpiece dessert of Goan Christmas feasts, Easter banquets, and milestone weddings.',
            serving_tradition: 'Cut into elegant multi-tiered slices, served warm or at room temperature, sometimes accompanied by a scoop of vanilla ice cream.',
            ingredients: [
                { name: 'Thick Coconut Milk', quantity: '2 cups', is_primary: 1 },
                { name: 'Egg Yolks', quantity: '8 large', is_primary: 1 },
                { name: 'Refined Wheat Flour (Maida)', quantity: '1 cup', is_primary: 0 },
                { name: 'Sugar', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Desi Ghee', quantity: '3/4 cup for layering', is_primary: 1 },
                { name: 'Nutmeg & Cardamom', quantity: '1/2 teaspoon ground', is_primary: 0 }
            ],
            seasons: ['Winter', 'Year-round'],
            references: [
                'Geographical Indications Registry of India (GI Journal)',
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India'
            ]
        },

        // --- SOUTH INDIA (Tamil Nadu, Kerala, Karnataka, Telangana, Andhra) ---
        {
            name: 'Traditional Masala Dosa',
            local_name: 'ಮಸಾಲೆ ದೋಸೆ / மசால் தோசை',
            slug: 'traditional-masala-dosa',
            state: 'Karnataka',
            region: 'South India',
            category: 'Fermented Food',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/masala-dosa.svg',
            featured: 1,
            short_description: 'Crisp golden fermented crepe of rice and black gram, roasted in ghee on an iron griddle, folded around spiced mashed potatoes and served with coconut chutney.',
            cultural_context: 'The antiquity of fermented rice crepes in South India is documented in Sangam Tamil poetry (around the 1st millennium CE) and the 12th-century Sanskrit manual \'Manasollasa\' (as \'Dosaka\'). The classic Masala Dosa variant is closely associated with Udupi restaurateurs and Mysuru culinary heritage. The natural overnight microbial fermentation of rice and black gram produces lactic acid and carbon dioxide, granting the crepe its characteristic light tang, crisp golden lacy exterior, and easy digestibility. Note: Mysore style incorporates a spicy red garlic-chilli chutney smeared on the inner surface.',
            traditional_preparation: 'Parboiled rice, raw rice, and whole dehusked black gram (urad dal) are soaked with a spoonful of fenugreek seeds (methi) and stone-ground to a fine batter. The batter is left to ferment naturally for 10 to 14 hours until aerated. Ladled onto a seasoned cast iron griddle (tawa), it is swirled thinly from the center outwards, basted with generous pure ghee, and roasted until deep golden and crackling. Spiced mashed potato filling (seasoned with mustard, curry leaves, onions, and turmeric) is placed in the center, folded, and served immediately.',
            seasonality_notes: 'Staple breakfast item relished year-round across every season.',
            festival_context: 'Universal celebratory breakfast, Sunday family tradition, and prominent restaurant classic worldwide.',
            serving_tradition: 'Served piping hot straight from the griddle with freshly ground white coconut chutney and a bowl of hot lentil sambar.',
            ingredients: [
                { name: 'Rice (Parboiled & Raw)', quantity: '3 cups', is_primary: 1 },
                { name: 'Urad Dal (Black Gram)', quantity: '1 cup', is_primary: 1 },
                { name: 'Fenugreek Seeds (Methi)', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Potatoes', quantity: '3 boiled & mashed', is_primary: 1 },
                { name: 'Onions', quantity: '2 sliced', is_primary: 0 },
                { name: 'Mustard Seeds & Curry Leaves', quantity: '1 teaspoon each', is_primary: 0 },
                { name: 'Pure Desi Ghee / Sesame Oil', quantity: '1/2 cup', is_primary: 1 }
            ],
            seasons: ['Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Fermented Foods and Beverages of India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Ven Pongal',
            local_name: 'வெண் பொங்கல் (Ven Pongal)',
            slug: 'ven-pongal',
            state: 'Tamil Nadu',
            region: 'South India',
            category: 'Festival & Ceremonial Food',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/ven-pongal.svg',
            featured: 1,
            short_description: 'Creamy, comforting South Indian dish of freshly harvested rice and roasted moong dal cooked until velvety, tempered in hot ghee with black pepper, cumin, ginger, and cashews.',
            cultural_context: 'Ven Pongal is intimately connected to Thai Pongal, the grand four-day Tamil harvest festival celebrating the winter solstice and honoring the Sun God (Surya). The word \'pongal\' originates from the Tamil verb \'pongu\', signifying \'to boil over\' or \'spill over\', symbolizing overflowing abundance and agricultural prosperity. The sacred preparation in temples (such as Madurai Meenakshi and Srirangam) represents an ancient heritage where whole black peppercorns, cumin, and fresh ginger balance the cooling nature of new rice. Note: Sweet Pongal (Sakkarai Pongal) made with jaggery is prepared alongside savory Ven Pongal.',
            traditional_preparation: 'Raw short-grain rice and lightly dry-roasted yellow split moong dal are simmered in water (or water-milk mixture) in a heavy pot until completely soft, creamy, and easily mashed with a ladle. In a separate pan, a lavish amount of pure desi ghee is heated; whole black peppercorns are gently crackled, followed by cumin seeds, finely minced ginger, fresh curry leaves, a pinch of asafoetida, and whole cashew nuts fried to a golden crunch. The sizzling tadka is folded into the hot mashed rice-lentil mixture.',
            seasonality_notes: 'Celebrated especially in the winter month of Margazhi and Thai (January), but enjoyed year-round for nourishing breakfasts.',
            festival_context: 'The defining dish of the Tamil harvest festival of Pongal; also served daily as temple prasad across Tamil Nadu.',
            serving_tradition: 'Served warm with a shiny sheen of ghee on fresh green banana leaves, accompanied by spicy coconut chutney and tangy vegetable sambar (Gothsu).',
            ingredients: [
                { name: 'Raw Short Grain Rice', quantity: '1 cup', is_primary: 1 },
                { name: 'Split Yellow Moong Dal', quantity: '1/2 cup roasted', is_primary: 1 },
                { name: 'Pure Desi Ghee', quantity: '1/2 cup', is_primary: 1 },
                { name: 'Whole Black Peppercorns', quantity: '1.5 teaspoons', is_primary: 1 },
                { name: 'Cumin Seeds', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Fresh Ginger', quantity: '1 tablespoon finely minced', is_primary: 0 },
                { name: 'Cashew Nuts', quantity: '15 whole', is_primary: 0 },
                { name: 'Curry Leaves', quantity: '2 sprigs', is_primary: 0 }
            ],
            seasons: ['Winter', 'Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Kerala Appam with Vegetable Stew',
            local_name: 'അപ്പം (Palappam with Ishtu)',
            slug: 'kerala-appam-with-stew',
            state: 'Kerala',
            region: 'South India',
            category: 'Fermented Food',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/kerala-appam.svg',
            featured: 1,
            short_description: 'Lacy, fermented rice crepes with a soft, pillowy coconut-rich center, served with a gentle stew of seasonal vegetables simmered in coconut milk and whole spices.',
            cultural_context: 'Appam represents the traditional coastal culinary heritage of Kerala, documented in early Tamil Sangam literature and prepared across diverse Kerala communities. The batter is prepared through traditional overnight fermentation using coconut water and fresh coconut milk. The pan used—a curved, concave wok called an appachatti—creates a distinct contrast: thin, lacy crisp borders surrounding a soft, spongy center. Note: Accompaniments vary from vegetable and meat stews to sweetened coconut milk.',
            traditional_preparation: 'Raw rice is soaked, ground with fresh grated coconut and cooked rice, sweetened lightly, and fermented overnight until bubbly. A ladle of batter is poured into a heated, greased appachatti; the pan is lifted and swirled in a circular motion so excess batter coats the sides thinly while the remainder settles in the base. It is covered and steamed for two minutes. The accompanying stew (Ishtu) features potatoes, carrots, and beans simmered with cinnamon, cloves, green chillies, and ginger in light thin coconut milk, finished with thick first-press coconut milk and curry leaves in coconut oil.',
            seasonality_notes: 'Prepared throughout the year across tropical Kerala.',
            festival_context: 'Traditional Easter and Christmas morning feast centerpiece among Syrian Christians; also a breakfast favorite during Onam festivities.',
            serving_tradition: 'Served fresh off the fire in pairs, accompanied by steaming bowls of fragrant coconut milk stew.',
            ingredients: [
                { name: 'Raw Rice', quantity: '2 cups', is_primary: 1 },
                { name: 'Fresh Grated Coconut', quantity: '1 cup', is_primary: 1 },
                { name: 'Coconut Milk (Thin & Thick)', quantity: '2 cups', is_primary: 1 },
                { name: 'Potatoes & Carrots', quantity: '2 each diced', is_primary: 0 },
                { name: 'Whole Spices (Cinnamon, Cloves, Cardamom)', quantity: '1 stick each', is_primary: 0 },
                { name: 'Green Chillies & Ginger', quantity: '2 tablespoons sliced', is_primary: 0 },
                { name: 'Virgin Coconut Oil', quantity: '2 tablespoons', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Fermented Foods and Beverages of India',
                'Culinary Heritage of India - Incredible India'
            ]
        },
        {
            name: 'Kerala Avial',
            local_name: 'അവിയൽ (Avial)',
            slug: 'kerala-avial',
            state: 'Kerala',
            region: 'South India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/kerala-avial.svg',
            featured: 0,
            short_description: 'An ancient medley of native indigenous vegetables steamed together, coated in a coarse paste of fresh coconut and cumin, folded in sour yogurt and raw virgin coconut oil.',
            cultural_context: 'Avial is a core component of the traditional Kerala Onam feast (Sadya). Regional folklore traces the dish to Bhima in the Mahabharata during his exile in the kingdom of Virata, who is said to have prepared it by gently cooking available surplus vegetables with fresh coconut. The preparation avoids heavy masalas, highlighting the fresh taste of native vegetables like yam (chena), raw plantain, and drumstick, finished with cold-pressed coconut oil and fresh curry leaves. Note: In southern parts of Kerala, raw mango is commonly used for sourness instead of curd.',
            traditional_preparation: 'Native vegetables (drumstick, elephant foot yam, raw banana, snake gourd, carrots, beans) are sliced into uniform 2-inch batons and steamed with turmeric, green chillies, and minimal water until tender but firm. A coarse paste of freshly grated coconut, cumin seeds, and green chillies is ground without adding excess water. The coconut paste is gently folded into the cooked vegetables. Once off the flame, beaten sour curd is stirred through. The preparation is immediately finished with a generous drizzle of raw coconut oil and bruised fresh curry leaves, covered tightly to trap the aromas.',
            seasonality_notes: 'Cooked year-round; prominent during the autumn harvest season of Onam.',
            festival_context: 'Pivotal dish among the 24+ items of the traditional Onam Sadya and Vishu feasts.',
            serving_tradition: 'Served on fresh banana leaves as part of the Sadya feast, paired with parboiled matta rice and sambar.',
            ingredients: [
                { name: 'Mixed Native Vegetables (Yam, Plantain, Drumstick, Gourd)', quantity: '4 cups batons', is_primary: 1 },
                { name: 'Fresh Grated Coconut', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Sour Curd (Yogurt)', quantity: '1/2 cup', is_primary: 0 },
                { name: 'Cumin Seeds', quantity: '1 teaspoon', is_primary: 0 },
                { name: 'Green Chillies', quantity: '4 whole', is_primary: 0 },
                { name: 'Cold Pressed Coconut Oil', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Curry Leaves', quantity: '2 fresh sprigs', is_primary: 0 }
            ],
            seasons: ['Autumn', 'Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'Feasts and Fasts: A History of Food in India'
            ]
        },
        {
            name: 'Bisi Bele Bath',
            local_name: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್ (Bisi Bele Bath)',
            slug: 'bisi-bele-bath',
            state: 'Karnataka',
            region: 'South India',
            category: 'Rice Preparation',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/bisi-bele-bath.svg',
            featured: 1,
            short_description: 'Rich, comforting one-pot meal of rice, pigeon pea lentils, and vegetables cooked with tamarind, jaggery, and an aromatic 14-spice freshly ground roasted masala.',
            cultural_context: 'Bisi Bele Bath (literally "hot lentil rice" in Kannada) originated in the royal kitchens of the Mysore Palace under the patronage of the Wadiyar dynasty. Conceived as an opulent, wholesome, complete meal balancing protein, grains, native vegetables, and restorative spices. What distinguishes Bisi Bele Bath from simple khichdi is the intricate spice mixture (Bisi Bele Bath powder) incorporating unique regional aromatics like Kapok buds (Maratha Moggu), cinnamon, dried coconut (copra), and byadgi chillies which lend vibrant red color without blistering heat. Note: Traditional versions avoid modern vegetables like cauliflower.',
            traditional_preparation: 'Short-grain rice and toor dal are cooked together with turmeric until soft and mushy. Seasonal native vegetables (shallots, carrots, beans, green peas) are simmered in tamarind extract seasoned with jaggery and salt. The unique spice blend is prepared by dry-roasting chana dal, urad dal, coriander seeds, cumin, fenugreek, cinnamon, cloves, Maratha moggu, poppy seeds, and byadgi chillies with dry coconut, ground to a fragrant powder. The vegetables, spice paste, and cooked rice-lentil base are combined and simmered until homogenous. Finished with a luxurious tempering of mustard seeds, curry leaves, and crunchy cashews in desi ghee.',
            seasonality_notes: 'Favored across autumn and winter months for its warming, hearty character, though prepared year-round.',
            festival_context: 'Associated with Karnataka Rajyotsava, festive family feasts, and traditional Mysore community banquets.',
            serving_tradition: 'Served steaming hot in bowls topped with a spoonful of hot ghee, accompanied by crunchy potato chips, khara boondi, and onion raita.',
            ingredients: [
                { name: 'Rice', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Toor Dal (Pigeon Pea)', quantity: '1 cup', is_primary: 1 },
                { name: 'Mixed Vegetables & Pearl Onions', quantity: '2 cups', is_primary: 0 },
                { name: 'Tamarind Pulp', quantity: '3 tablespoons', is_primary: 1 },
                { name: 'Bisi Bele Bath Spice Powder (with Maratha Moggu)', quantity: '3 tablespoons', is_primary: 1 },
                { name: 'Pure Desi Ghee', quantity: '1/3 cup', is_primary: 1 },
                { name: 'Cashew Nuts', quantity: '15 pieces', is_primary: 0 },
                { name: 'Jaggery', quantity: '1 tablespoon', is_primary: 0 }
            ],
            seasons: ['Winter', 'Autumn', 'Year-round'],
            references: [
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Hyderabadi Haleem',
            local_name: 'حلیم (Hyderabadi Haleem)',
            slug: 'hyderabadi-haleem',
            state: 'Telangana',
            region: 'South India',
            category: 'Festival & Ceremonial Food',
            veg_type: 'Non-Vegetarian',
            image_url: '/assets/images/hyderabadi-haleem.svg',
            featured: 1,
            short_description: 'Rich, restorative stew of pounded meat, broken wheat, lentils, and royal spices slow-cooked for 8 hours over wood fires, holding a certified Geographical Indication (GI) tag.',
            cultural_context: 'Hyderabadi Haleem was the first meat product in India to be granted Geographical Indication (GI) status (in 2010). Evolved from the traditional Arab dish \'Harees\', which was introduced to the Deccan plateau by the Chaush community (Yemeni guards in the Nizam\'s army) and refined in the royal kitchens of the 7th Nizam, Mir Osman Ali Khan. Its unique silky, fibrous, gelatinous texture is the result of slow-braising tender meat, broken wheat, and four distinct lentils in copper cauldrons (degh) over wood fires for 8 to 10 hours while rhythmically mashing with large wooden oars (ghota). Note: Genuine GI-standard haleem requires strictly defined ratios of meat to wheat and pure desi ghee.',
            traditional_preparation: 'Bone-in mutton or goat meat is marinated with ginger-garlic paste, yogurt, and garam masala. High-quality broken wheat (dalia) is soaked alongside four lentils (chana, urad, moong, masoor). In large cauldrons, the meat, wheat, and lentils are simmered together with cinnamon, cardamom, cloves, shahi jeera, and rose petals over low wood-fire heat. As the meat separates from the bone, bones are removed and cooks vigorously pound the mixture with heavy wooden ghota sticks until the meat fibers dissolve completely into the cracked wheat, creating a velvety stretchable paste. Finished with gallons of clarified desi ghee and fried onions.',
            seasonality_notes: 'Prepared almost exclusively during the holy Islamic month of Ramadan (which shifts through the seasons), celebrated for replenishing energy post-fast.',
            festival_context: 'The premier community dish of Ramadan in Hyderabad, shared across communities during Iftar.',
            serving_tradition: 'Served piping hot in bowls garnished with crisp golden fried onions (birista), fresh mint leaves, slivered ginger, roasted cashews, and a squeeze of fresh lime juice.',
            ingredients: [
                { name: 'Mutton / Lamb', quantity: '1 kg', is_primary: 1 },
                { name: 'Broken Wheat (Dalia)', quantity: '2 cups soaked', is_primary: 1 },
                { name: 'Mixed Lentils (Chana, Urad, Moong, Masoor)', quantity: '1 cup', is_primary: 0 },
                { name: 'Pure Desi Ghee', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Fried Onions (Birista)', quantity: '1 cup', is_primary: 0 },
                { name: 'Ginger-Garlic Paste', quantity: '3 tablespoons', is_primary: 0 },
                { name: 'Shahi Garam Masala & Rose Petals', quantity: '2 tablespoons', is_primary: 0 }
            ],
            seasons: ['Monsoon', 'Year-round'],
            references: [
                'Geographical Indications Registry of India (GI Journal)',
                'A Historical Dictionary of Indian Food',
                'Culinary Heritage of India - Incredible India'
            ]
        },

        // --- CENTRAL INDIA (Madhya Pradesh & Chhattisgarh) ---
        {
            name: 'Indori Poha',
            local_name: 'इंदौरी पोहा (Indori Poha)',
            slug: 'indori-poha',
            state: 'Madhya Pradesh',
            region: 'Central India',
            category: 'Snack & Savory',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/indori-poha.svg',
            featured: 1,
            short_description: 'Light, fluffy steamed flattened rice seasoned with fennel seeds, turmeric, and secret Jeeravan spice powder, topped with spicy Ratlami sev and pomegranate arils.',
            cultural_context: 'Indori Poha is an institution of Malwa street-food culture, synonymous with the early morning food bazaars of Chappan Dukan and Sarafa Bazaar in Indore. While flattened rice (chipitaka in Sanskrit) has ancient Indian roots, the Indori variation is distinct because it is never pan-fried aggressively; instead, it is gently cooked through continuous steam in large tiered brass steamers. The hallmark of the dish is the use of aromatic fennel seeds (saunf) in the tempering and a dusting of Jeeravan masala—a complex 20-spice blend unique to Malwa. Note: Traditional vendors always crown the dish with crunchy chickpea noodles (Ratlami Sev) and fresh pomegranate.',
            traditional_preparation: 'Thick flattened rice (mota poha) is gently washed in a colander, drained thoroughly, and tossed with turmeric powder, salt, and sugar. The soaked poha is transferred into a wide steamer pot over simmering water to warm and fluff up without turning mushy. A gentle tempering is made in oil with mustard seeds, whole fennel seeds (saunf), minced green chillies, and curry leaves, which is tossed gently through the steamed poha. Upon plating, it is showered with finely diced raw red onions, fresh coriander leaves, crimson pomegranate arils, a squeeze of fresh lemon juice, crispy Indori Ratlami sev, and a pinch of Jeeravan masala.',
            seasonality_notes: 'Enjoyed every morning year-round as the staple breakfast of central India.',
            festival_context: 'Ubiquitous everyday street breakfast; also served to welcome guests during family visits across Madhya Pradesh.',
            serving_tradition: 'Served warm on paper plates or brass bowls with hot, crispy, spiral jalebis (Poha-Jalebi pairing) and a glass of hot chai.',
            ingredients: [
                { name: 'Thick Flattened Rice (Poha)', quantity: '3 cups', is_primary: 1 },
                { name: 'Fennel Seeds (Saunf)', quantity: '1.5 tablespoons', is_primary: 1 },
                { name: 'Jeeravan Masala', quantity: '1 tablespoon', is_primary: 1 },
                { name: 'Ratlami Sev / Indori Sev', quantity: '1 cup', is_primary: 1 },
                { name: 'Pomegranate Arils', quantity: '1/2 cup', is_primary: 0 },
                { name: 'Mustard Seeds & Curry Leaves', quantity: '1 teaspoon each', is_primary: 0 },
                { name: 'Green Chillies & Lemon', quantity: '2 each', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'Culinary Heritage of India - Incredible India',
                'A Historical Dictionary of Indian Food',
                'The Story of Our Food'
            ]
        },
        {
            name: 'Bhutte Ka Kees',
            local_name: 'भुट्टे का कीस (Bhutte Ka Kees)',
            slug: 'bhutte-ka-kees',
            state: 'Madhya Pradesh',
            region: 'Central India',
            category: 'Snack & Savory',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/bhutte-ka-kees.svg',
            featured: 0,
            short_description: 'Beloved monsoon street specialty of Malwa made by grating fresh tender sweet corn, sautéing in ghee with mustard and hing, and simmering in milk until creamy.',
            cultural_context: 'Bhutte Ka Kees (from \'keesna\', meaning to grate) originated in the fertile agricultural belt of Indore, Ujjain, and the Malwa plateau of Madhya Pradesh. Corn has been cultivated extensively across central India since its introduction centuries ago, and during the monsoon harvest, tender milk-filled corn on the cob is grated by hand to create this savory, slightly sweet street-food delicacy. The slow simmering in cow milk softens the raw starch into a porridge-like delicacy with crackling mustard seeds and fragrant asafoetida. Note: Tender, juicy corn ears are essential; dried or canned sweet corn fails to yield the authentic texture.',
            traditional_preparation: 'Fresh ears of tender milk-corn are grated on a box grater to release the sweet milky pulp. Desi ghee is heated in a heavy kadhai, into which mustard seeds, cumin seeds, minced ginger, spicy green chillies, and a generous pinch of asafoetida are crackled. The grated corn pulp is introduced and sautéed gently on low heat until it stops sticking to the pan. Fresh milk is poured in gradually, and the mixture is simmered slowly until thick, glossy, and soft. Finished with fresh lemon juice, grated coconut, and chopped coriander.',
            seasonality_notes: 'Celebrated predominantly during the monsoon season (July through September) when fresh tender corn is freshly harvested.',
            festival_context: 'The premier culinary draw of the monsoon night markets at Sarafa Bazaar in Indore.',
            serving_tradition: 'Served steaming hot in small leaf cups (dona), garnished with freshly grated coconut, coriander leaves, and a sprinkle of masala.',
            ingredients: [
                { name: 'Fresh Tender Corn Ears', quantity: '4 grated', is_primary: 1 },
                { name: 'Cow Milk', quantity: '1.5 cups', is_primary: 1 },
                { name: 'Desi Ghee', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Mustard & Cumin Seeds', quantity: '1 teaspoon each', is_primary: 0 },
                { name: 'Ginger & Green Chillies', quantity: '1 tablespoon minced', is_primary: 0 },
                { name: 'Asafoetida (Hing)', quantity: '1/4 teaspoon', is_primary: 0 },
                { name: 'Fresh Grated Coconut', quantity: '3 tablespoons', is_primary: 0 },
                { name: 'Lemon Juice', quantity: '1 tablespoon', is_primary: 0 }
            ],
            seasons: ['Monsoon'],
            references: [
                'Culinary Heritage of India - Incredible India',
                'Traditional Food Systems of India',
                'A Historical Dictionary of Indian Food'
            ]
        },

        // --- NORTH-EAST INDIA (Assam, Nagaland, Manipur, Sikkim) ---
        {
            name: 'Omita Khaar',
            local_name: 'অমিতা খাৰ (Omita Khaar)',
            slug: 'omita-khaar',
            state: 'Assam',
            region: 'North-East India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/omita-khaar.svg',
            featured: 1,
            short_description: 'Unique Assamese signature preparation of raw papaya cooked with indigenous alkaline liquid (Kolakhar) filtered from burnt banana peel ash, seasoned in mustard oil.',
            cultural_context: 'Khaar is the defining foundation of Assamese culinary identity—so central that the indigenous Assamese people historically refer to themselves as \'Khowa Asomiya\' (Khaar-eating Assamese). It exemplifies indigenous food chemistry and resourcefulness: Kolakhar is an all-natural liquid alkali prepared by sun-drying the peels and stems of the indigenous Bhim Kol banana (Musa balbisiana), burning them to ashes, and filtering clean spring water through the charcoal ash. The natural alkaline profile softens the green papaya without oil-heavy spices and cleanses the digestive palate. Note: Under traditional culinary rules, Khaar is strictly consumed at the commencement of a lunch meal.',
            traditional_preparation: 'Fresh raw green papaya is peeled and diced into bite-sized cubes. In a pot, a spoonful of raw mustard oil is heated, and five-spice (panch phoron) is spluttered alongside bruised green chillies and crushed garlic cloves. The papaya cubes are added and sautéed for two minutes with salt. Clear kolakhar liquid is introduced along with a little water. The pot is covered and simmered gently until the papaya pieces become tender, translucent, and semi-mashed. No souring agents (lemon or tomatoes) are ever added, as acidity neutralizes the sacred alkaline khaar.',
            seasonality_notes: 'Cooked year-round across Assam, adjusting the base produce with seasonal gourds or pulses.',
            festival_context: 'Pivotal initial course of ceremonial festive meals during Rongali Bihu and Magh Bihu feasts.',
            serving_tradition: 'Served strictly as the opening course of an Assamese lunch over steaming hot aromatic Joha rice, accompanied by a dash of raw mustard oil and a green chilli.',
            ingredients: [
                { name: 'Raw Green Papaya', quantity: '1 medium diced', is_primary: 1 },
                { name: 'Kolakhar (Banana Peel Alkaline Filtrate)', quantity: '3 tablespoons', is_primary: 1 },
                { name: 'Mustard Oil', quantity: '1.5 tablespoons', is_primary: 1 },
                { name: 'Panch Phoron', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Garlic', quantity: '5 cloves crushed', is_primary: 0 },
                { name: 'Green Chillies', quantity: '2 whole bruised', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'Traditional Cuisines and Food Culture of North East India',
                'Fermented Foods and Beverages of India',
                'Traditional Food Systems of India'
            ]
        },
        {
            name: 'Masor Tenga',
            local_name: 'মাছৰ টেঙা (Masor Tenga)',
            slug: 'masor-tenga',
            state: 'Assam',
            region: 'North-East India',
            category: 'Main Dish',
            veg_type: 'Non-Vegetarian',
            image_url: '/assets/images/masor-tenga.svg',
            featured: 1,
            short_description: 'Refreshing, light, sour Assamese freshwater river fish broth flavored with native tart elephant apple (Ou Tenga) or juicy Kaji Nemu lemon and mustard oil.',
            cultural_context: 'Masor Tenga is the celebrated sour fish curry of the Brahmaputra River valley. In the humid subtropical climate of Assam, heavy masalas are eschewed in favor of clean, souring broths that cool the body and revive the appetite during oppressive summer months. The sourness (\'tenga\') is derived from native botanical treasures rather than artificial vinegars: primarily Ou Tenga (elephant apple / Dillenia indica), Thekera (dried mangosteen rinds), or the fragrant, GI-tagged Assam lemon (Kaji Nemu). Note: The recipe is intentionally delicate, avoiding onions, garlic, and powdered spices.',
            traditional_preparation: 'Fresh freshwater carp steaks (Rohu or Borali) are rubbed with turmeric and salt, then shallow-fried very lightly in smoking mustard oil until just set. In the remaining oil, fenugreek seeds (methi) are spluttered with green chillies. Sliced elephant apple (Ou Tenga) pieces, pounded gently to release juices, are added and sautéed with turmeric. Water is poured in to create a light, translucent broth. The fish steaks are returned to the boiling broth to simmer for five minutes, allowing the refreshing fruit tartness to permeate the tender fish.',
            seasonality_notes: 'Cherished especially in the scorching and humid summer months (April to August) for its hydrating and digestive qualities.',
            festival_context: 'A beloved family lunch staple and summer feast favorite across the Brahmaputra valley.',
            serving_tradition: 'Served warm or at room temperature alongside mounds of steaming white rice, especially on warm afternoons.',
            ingredients: [
                { name: 'Freshwater Rohu / Borali Fish', quantity: '500 grams', is_primary: 1 },
                { name: 'Elephant Apple (Ou Tenga) / Kaji Nemu Lemon', quantity: '1 medium', is_primary: 1 },
                { name: 'Mustard Oil', quantity: '2 tablespoons', is_primary: 1 },
                { name: 'Fenugreek Seeds', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Green Chillies', quantity: '3 slit', is_primary: 0 },
                { name: 'Turmeric Powder', quantity: '1/2 teaspoon', is_primary: 0 }
            ],
            seasons: ['Summer'],
            references: [
                'Traditional Cuisines and Food Culture of North East India',
                'Culinary Heritage of India - Incredible India',
                'Traditional Food Systems of India'
            ]
        },
        {
            name: 'Naga Pork with Fermented Bamboo Shoot',
            local_name: 'Naga Pork with Bas-Tenga & Raja Mircha',
            slug: 'naga-pork-bamboo-shoot',
            state: 'Nagaland',
            region: 'North-East India',
            category: 'Main Dish',
            veg_type: 'Non-Vegetarian',
            image_url: '/assets/images/naga-pork.svg',
            featured: 1,
            short_description: 'Authentic tribal Naga pork stew braised slowly in its own natural fats with pungent wet fermented bamboo shoot and the legendary fiery Naga King Chilli (Bhut Jolokia).',
            cultural_context: 'This dish represents the indigenous food preservation culture of the Naga tribes (including the Angami, Ao, Sema, and Lotha communities). In the high forested hills of Nagaland, traditional cuisine relies on two foundational elements: natural fermentation of seasonal bamboo shoots (known locally as bas-tenga) and indigenous chillies, most famously the GI-tagged Raja Mircha (Bhut Jolokia / King Chilli). No external cooking oils or powdered masalas are employed; the meat simmers gently in its own rendered fats, allowing the pungent sour aroma of the fermented shoot to balance the blistering heat of the chilli. Note: Fermented bamboo shoot imparts a distinct, pungent aroma that is deeply prized in the North-East.',
            traditional_preparation: 'Pork pieces with skin and fat intact are washed and placed in an iron pot over medium heat with salt, crushed native mountain garlic, and bruised ginger. As the fat renders out, wet fermented bamboo shoot is added along with half a pod of bruised fresh Naga King Chilli (handled with extreme care due to its extreme Scoville rating). Water is added sparingly, and the stew is covered tightly and simmered slowly for 45 minutes until the pork is meltingly tender and infused with the pungent tang and fiery heat.',
            seasonality_notes: 'Relished throughout the year, with special reverence during the chilly winter months when fireside family cooking is standard.',
            festival_context: 'Pivotal feast dish served during tribal festivals including the Hornbill Festival, Moatsu, and Sekrenyi in Nagaland.',
            serving_tradition: 'Served steaming hot with plain boiled sticky rice and boiled local leafy wild greens (like mustard leaves or wild mountain spinach).',
            ingredients: [
                { name: 'Pork Chunks (with fat and skin)', quantity: '750 grams', is_primary: 1 },
                { name: 'Fermented Bamboo Shoot (Bas-tenga)', quantity: '1/2 cup wet extract', is_primary: 1 },
                { name: 'Naga King Chilli (Bhut Jolokia / Raja Mircha)', quantity: '1 pod bruised', is_primary: 1 },
                { name: 'Ginger', quantity: '2 inches crushed', is_primary: 0 },
                { name: 'Garlic', quantity: '8 cloves crushed', is_primary: 0 },
                { name: 'Salt', quantity: 'To taste', is_primary: 0 }
            ],
            seasons: ['Year-round', 'Winter'],
            references: [
                'Geographical Indications Registry of India (GI Journal)',
                'Traditional Cuisines and Food Culture of North East India',
                'Traditional Food Systems of India'
            ]
        },
        {
            name: 'Manipuri Kangshoi',
            local_name: 'কাংশোই (Manipuri Kangshoi)',
            slug: 'manipuri-kangshoi',
            state: 'Manipur',
            region: 'North-East India',
            category: 'Main Dish',
            veg_type: 'Non-Vegetarian',
            image_url: '/assets/images/manipuri-kangshoi.svg',
            featured: 0,
            short_description: 'Nourishing oil-free Manipuri stew of fresh seasonal greens and garden tubers, simmered with traditional sun-dried fermented fish (Ngari), ginger, and fresh herbs.',
            cultural_context: 'Kangshoi is an essential everyday home stew of the Meitei community of the Imphal valley in Manipur. Traditional preparation relies on zero cooking oil: seasonal leafy greens, lotus roots, and tubers are gently simmered with Ngari—an artisanal sun-dried fermented freshwater fish cured inside earthen pots. The fermented fish provides savory depth and aroma to fresh garden greens. Note: In vegetarian households, Ngari is traditionally substituted with hawaijar (fermented soybeans).',
            traditional_preparation: 'Water is brought to a rolling boil in a pot. Cleaned Ngari (fermented fish) is roasted lightly over direct heat on a skewer to release aromas, then dissolved directly into the boiling water with sliced shallots, bruised ginger, crushed king chillies, and salt. Coarsely cut seasonal vegetables—such as mustard leaves, tender pumpkin shoots, fresh bamboo shoots, or potatoes—are added and simmered until cooked through while retaining their bright green vitality. The soup is taken off the heat and finished with chopped fresh culinary herbs (like coriander or culantro).',
            seasonality_notes: 'Cooked daily in every season; vegetable combinations shift seamlessly according to what is plucked from the kitchen garden (Leirak).',
            festival_context: 'The premier wholesome comfort meal in Manipuri households, eaten daily for lunch and dinner.',
            serving_tradition: 'Served piping hot in generous bowls alongside boiled aromatic rice and spicy Manipuri Morok Metpa (chilli chutney).',
            ingredients: [
                { name: 'Seasonal Greens & Vegetables (Mustard, Bamboo shoot, Lotus stem)', quantity: '4 cups', is_primary: 1 },
                { name: 'Ngari (Traditional Fermented Fish)', quantity: '4 pieces roasted & dissolved', is_primary: 1 },
                { name: 'Ginger', quantity: '2 inches sliced', is_primary: 0 },
                { name: 'Shallots / Spring Onions', quantity: '1/2 cup sliced', is_primary: 0 },
                { name: 'Fresh Green Chillies', quantity: '3 whole bruised', is_primary: 0 },
                { name: 'Fresh Culantro / Herbs', quantity: 'Handful', is_primary: 0 }
            ],
            seasons: ['Year-round'],
            references: [
                'Fermented Foods and Beverages of India',
                'Traditional Cuisines and Food Culture of North East India',
                'Traditional Food Systems of India'
            ]
        },
        {
            name: 'Himalayan Thukpa',
            local_name: 'ཐུག་པ (Thukpa)',
            slug: 'himalayan-thukpa',
            state: 'Sikkim',
            region: 'North-East India',
            category: 'Main Dish',
            veg_type: 'Vegetarian',
            image_url: '/assets/images/himalayan-thukpa.svg',
            featured: 1,
            short_description: 'Hearty Himalayan noodle soup made with hand-pulled noodles, winter mountain vegetables or meat, in a fragrant broth seasoned with ginger, garlic, and wild cumin.',
            cultural_context: 'Thukpa is an ancient, deeply comforting noodle soup indigenous to Tibetan and Himalayan communities across Sikkim, Ladakh, and Arunachal Pradesh. Developed to provide warmth and stamina against sub-zero mountain gales. In Sikkim, the preparation represents a harmonious cultural fusion of indigenous Lepcha, Bhutia, and Nepalese traditions. The noodles—traditionally hand-pulled from wheat flour—are bathed in a clear, steaming, peppery broth infused with mountain ginger, garlic, and wild Sichuan peppercorns (Timur). Note: Available in both wholesome vegetarian (vegetable broth) and hearty meat variations.',
            traditional_preparation: 'Fresh wheat noodles are boiled in salted water until al dente, drained, and tossed in a drop of mustard oil to prevent sticking. In a soup kettle, onions, ginger, garlic, and green chillies are sautéed until fragrant with cumin and a touch of wild mountain timur pepper. Finely shredded seasonal winter vegetables (cabbage, carrots, mushrooms, and local radish) are tossed in briefly. Rich vegetable or bone broth is poured in and simmered to meld the flavors. To serve, steaming noodles are placed in deep ceramic bowls and flooded with boiling fragrant broth and vegetables.',
            seasonality_notes: 'Particularly cherished throughout the freezing mountain winters (November to March), though eaten year-round.',
            festival_context: 'Integral to Losar (Tibetan/Sikkimese New Year) celebrations and daily mountain life across Himalayan passes.',
            serving_tradition: 'Served piping hot in large deep bowls with chopsticks and a porcelain spoon, accompanied by fiery Dalle Khursani (round cherry pepper) paste.',
            ingredients: [
                { name: 'Wheat Noodles', quantity: '300 grams fresh', is_primary: 1 },
                { name: 'Vegetable / Meat Broth', quantity: '4 cups', is_primary: 1 },
                { name: 'Shredded Cabbage, Carrots & Radish', quantity: '2 cups', is_primary: 0 },
                { name: 'Ginger & Garlic Paste', quantity: '2 tablespoons', is_primary: 0 },
                { name: 'Sichuan Pepper (Timur) / Cumin', quantity: '1/2 teaspoon', is_primary: 0 },
                { name: 'Spring Onions & Coriander', quantity: '1/2 cup chopped', is_primary: 0 }
            ],
            seasons: ['Winter', 'Year-round'],
            references: [
                'Traditional Food Systems of India',
                'Traditional Cuisines and Food Culture of North East India',
                'Culinary Heritage of India - Incredible India'
            ]
        }
    ];

    // Prepare insert statements
    const insertFood = getDb().prepare(`
        INSERT INTO foods (
            name, local_name, slug, state_id, region_id, category_id,
            short_description, cultural_context, traditional_preparation,
            seasonality_notes, festival_context, serving_tradition,
            veg_type, image_url, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertIngredient = getDb().prepare('INSERT OR IGNORE INTO ingredients (name) VALUES (?)');
    const getIngredientId = getDb().prepare('SELECT id FROM ingredients WHERE name = ?');
    const insertFoodIngredient = getDb().prepare(`
        INSERT OR IGNORE INTO food_ingredients (food_id, ingredient_id, quantity_or_note, is_primary)
        VALUES (?, ?, ?, ?)
    `);

    const insertFoodSeason = getDb().prepare(`
        INSERT OR IGNORE INTO food_seasons (food_id, season_id)
        VALUES (?, ?)
    `);

    const insertFoodRef = getDb().prepare(`
        INSERT OR IGNORE INTO food_references (food_id, reference_id)
        VALUES (?, ?)
    `);

    let foodCount = 0;

    foodsData.forEach(food => {
        const stateId = stateMap[food.state];
        const regionId = regionMap[food.region];
        const categoryId = catMap[food.category];

        if (!stateId || !regionId || !categoryId) {
            console.error(`Missing relation for ${food.name}: State ${food.state} (${stateId}), Region ${food.region} (${regionId}), Category ${food.category} (${categoryId})`);
            return;
        }

        const result = insertFood.run(
            food.name,
            food.local_name,
            food.slug,
            stateId,
            regionId,
            categoryId,
            food.short_description,
            food.cultural_context,
            food.traditional_preparation,
            food.seasonality_notes,
            food.festival_context,
            food.serving_tradition,
            food.veg_type,
            food.image_url,
            food.featured
        );

        const foodId = result.lastInsertRowid;
        foodCount++;

        // Insert ingredients
        if (food.ingredients && Array.isArray(food.ingredients)) {
            food.ingredients.forEach(ing => {
                insertIngredient.run(ing.name);
                const ingRow = getIngredientId.get(ing.name);
                if (ingRow) {
                    insertFoodIngredient.run(foodId, ingRow.id, ing.quantity, ing.is_primary ? 1 : 0);
                }
            });
        }

        // Insert seasons
        if (food.seasons && Array.isArray(food.seasons)) {
            food.seasons.forEach(snName => {
                const seasonId = seasonMap[snName];
                if (seasonId) {
                    insertFoodSeason.run(foodId, seasonId);
                }
            });
        }

        // Insert references
        if (food.references && Array.isArray(food.references)) {
            food.references.forEach(refTitle => {
                const refId = refMap[refTitle];
                if (refId) {
                    insertFoodRef.run(foodId, refId);
                }
            });
        }
    });

    console.log(`✓ Foods seeded (${foodCount} records).`);

    // 8. Seed Default Admin
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(defaultPassword, saltRounds);

    const insertAdmin = getDb().prepare(`
        INSERT OR REPLACE INTO admins (id, username, password_hash)
        VALUES (
            (SELECT id FROM admins WHERE username = ?),
            ?, ?
        )
    `);
    insertAdmin.run(defaultUsername, defaultUsername, passwordHash);
    console.log(`✓ Default administrator account verified (username: "${defaultUsername}").`);
});

console.log('--- Bharat Bhojan Database Seeding Completed Successfully ---');
