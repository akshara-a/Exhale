export interface CulturalTradition {
  id: string;
  name: string;
  nativeScript: string;
  region: string;
  historicalPeriod: string;
  philosophicalCore: string;
  clinicalEvidence: string;
  sensoryFocus: string;
  ancestralQuote: string;
}

export const CULTURAL_TAXONOMY: CulturalTradition[] = [
  {
    id: 'Japanese Shinrin-yoku (森林浴 - Forest Bathing & Komorebi)',
    name: 'Shinrin-yoku & Komorebi',
    nativeScript: '森林浴 // 木漏れ日',
    region: 'Japan',
    historicalPeriod: 'Edo-period Shinto roots; formalized 1982 by Nippon Forestry Agency',
    philosophicalCore: 'Immersing all five senses in the living forest atmosphere; observing Komorebi (the interplay of light and leaves) and impermanence (Wabi-sabi).',
    clinicalEvidence: 'Nippon Medical School trials (Dr. Qing Li) showed a 50% increase in Natural Killer (NK) immune cells and 16% drop in salivary cortisol from inhaling tree phytoncides (alpha-pinene).',
    sensoryFocus: 'Pine & cedar phytoncides, dappled canopy sunlight, rough evergreen bark.',
    ancestralQuote: '"In the woods, we return to reason and faith. The forest breathes out what we breathe in."'
  },
  {
    id: 'Indian Pancha Mahabhuta (पञ्चमहाभूत - Five Elemental Earth Calibration)',
    name: 'Pancha Mahabhuta',
    nativeScript: 'पञ्चमहाभूत // पृथिवी आपस् तेजस् वायुः आकाश',
    region: 'India (Vedic)',
    historicalPeriod: 'Rigveda & Ayurveda (c. 1500 BCE – Classical Charaka Samhita)',
    philosophicalCore: 'Harmonizing the micro-cosmos (human physiology) with the macro-cosmos through the 5 primal elements: Prithvi (Earth), Jala (Water), Agni (Solar Fire), Vayu (Air), and Akasha (Ether/Space).',
    clinicalEvidence: 'Peer-reviewed studies on Ayurvedic grounding demonstrate autonomic parasympathetic shifts, reduction in blood viscosity, and vagal tone enhancement through direct Prithvi earth contact.',
    sensoryFocus: 'Direct soil contact (Gandha smell), solar eyelids (Agni vision), wind touch (Vayu).',
    ancestralQuote: '"Mātā bhūmiḥ putro aham pṛthivyāḥ — The Earth is my mother, and I am her child." (Atharva Veda 12.1.12)'
  },
  {
    id: 'Tamil Ainthinai & Siddha (ஐந்திணை - Sangam Eco-Landscape Alchemy)',
    name: 'Ainthinai & Siddha Maruthuvam',
    nativeScript: 'ஐந்திணை // குறிஞ்சி முல்லை மருதம் நெய்தல் பாலை',
    region: 'Tamil Nadu (Classical Sangam)',
    historicalPeriod: 'Tolkappiyam & Sangam Poetry (c. 300 BCE – 300 CE)',
    philosophicalCore: 'The 2000-year-old Tamil Sangam eco-psychology correlating human inner emotional landscapes (Akam) with five outer bio-regions (Kurinji mountains, Mullai forest, Marutham plains, Neithal coast, Palai desert).',
    clinicalEvidence: 'Siddha medicine principles document that absorbing Manvaasanai (geosmin petrichor) and connecting barefoot with Semman (red earth) activates internal cooling humors (Pitta balance).',
    sensoryFocus: 'Red soil friction, petrichor (Manvaasanai), cooling outdoor breeze, leaf veins.',
    ancestralQuote: '"யாதும் ஊரே யாவரும் கேளிர் — To us every land is our home town, and all earth dwellers are our kin." (Kaniyan Poongunranar, Purananuru 192)'
  },
  {
    id: 'African Ubuntu & Khoisan Terra-Tracking (Ubuntu / Ilẹ̀ Earth Grounding)',
    name: 'Ubuntu & Khoisan Terra-Tracking',
    nativeScript: 'Ubuntu // Ilẹ̀ // ǃKung',
    region: 'Pan-African & Kalahari',
    historicalPeriod: 'Pre-historic Khoisan lineage (>40,000 BCE) & Bantu Ubuntu philosophy',
    philosophicalCore: '"Umuntu ngumuntu ngabantu" (A person is a person through other beings). Extends human kinship to the entire living biosphere; barefoot horizon tracking connects directly to the primal maternal pulse of earth (Ilẹ̀).',
    clinicalEvidence: 'Anthropological studies of San hunter-gatherers reveal superior peripheral sensory processing, low incidence of chronic anxiety, and balanced autonomic reactivity through continuous terrain contact.',
    sensoryFocus: 'Red dust/gravel underfoot, 180-degree horizon tracking, collective earth breathing.',
    ancestralQuote: '"The earth is not ours to own; it is the ground that holds our ancestors and our children."'
  },
  {
    id: 'Chinese Daoist Ziran & Wu Wei (自然 / 无为 - Spontaneous Nature Flow)',
    name: 'Daoist Ziran & Wu Wei',
    nativeScript: '道法自然 // 无为 // 八段锦',
    region: 'China (Daoist)',
    historicalPeriod: 'Laozi & Zhuangzi (c. 4th Century BCE)',
    philosophicalCore: 'Dao Fa Ziran: "The Dao models itself on Nature (Self-so-ness)." Dissolving forced mental striving (Wu Wei) by allowing artificial thoughts to drain into the Yin earth while drawing vitality from the Yang sky.',
    clinicalEvidence: 'Modern trials on outdoor Zhan Zhuang (tree standing) and Qi Gong show significant drops in prefrontal hyperactivity, regulation of the HPA stress axis, and enhanced alpha brainwave coherence.',
    sensoryFocus: 'Rooted tree stance, open palms facing earth, Yin/Yang atmospheric equilibrium.',
    ancestralQuote: '"Humanity follows the Earth, the Earth follows Heaven, Heaven follows the Dao, and the Dao follows what is natural." (Daodejing, Chapter 25)'
  },
  {
    id: 'Scientific Polyvagal & Attention Restoration (Kaplan ART & Biophilia)',
    name: 'Scientific Polyvagal & Kaplan ART',
    nativeScript: 'Neurobiology // ANS // Kaplan ART',
    region: 'Clinical Science',
    historicalPeriod: 'Porges Polyvagal (1994), Kaplan ART (1989), E.O. Wilson Biophilia (1984)',
    philosophicalCore: 'Neurobiological disengagement of the sympathetic fight-or-flight circuit via panoramic optic flow disengaging optical convergence, coupled with "Soft Fascination" to replenish depleted executive attention.',
    clinicalEvidence: 'Meta-analyses in environmental neuroscience confirm that 10 minutes of green outdoor exposure produces measurable vagal reactivation (increased HRV), lowered prefrontal perfusion, and reduced rumination.',
    sensoryFocus: 'Optic divergence (horizon scanning), acoustic birdsong disengaging amygdala, thermoreceptor vagal stimulus.',
    ancestralQuote: '"Nature holds the key to our aesthetic, intellectual, cognitive, and even spiritual satisfaction." (Edward O. Wilson)'
  },
  {
    id: 'Indigenous Lakota Hózhó & Mitákuye Oyásʼin (All My Relations)',
    name: 'Lakota & Diné Hózhó Reciprocity',
    nativeScript: 'Mitákuye Oyásʼin // Hózhó',
    region: 'North America (First Nations)',
    historicalPeriod: 'Immorial Indigenous oral tradition',
    philosophicalCore: 'Mitákuye Oyásʼin: Everything is connected in sacred kinship. Diné Hózhó: Walking in dynamic harmony, beauty, and equilibrium with the four cardinal directions and Mother Earth (Unci Maka).',
    clinicalEvidence: 'Indigenous psychology frameworks identify grounding ceremonies as restorative anchors for somatic trauma resolution, recalibrating proprioceptive balance through tactile earth contact.',
    sensoryFocus: 'Four directions orientation, cedar/sage aromatic grounding, bare hand on stone.',
    ancestralQuote: '"Mitákuye Oyásʼin — We are all related to the standing rock, the green grass, and the four winds."'
  },
  {
    id: 'Hawaiian Aloha ʻĀina & Hā Breath (Love for the Living Earth)',
    name: 'Aloha ʻĀina & Hā Breath',
    nativeScript: 'Aloha ʻĀina // Mālama Honua // Hā',
    region: 'Polynesia / Hawaii',
    historicalPeriod: 'Ancestral Polynesian Voyaging & Kanaka Maoli culture',
    philosophicalCore: 'Aloha ʻĀina: Deep reciprocal love, kinship, and stewardship for the living land. Sharing the divine breath (Hā) with ocean tradewinds (Makani) to wash away synthetic cognitive congestion.',
    clinicalEvidence: 'Marine & coastal environmental health trials demonstrate that inhaling negative oceanic aerosols and aerosolized salt air elevates pulmonary exchange and serotonin availability.',
    sensoryFocus: 'Basalt lava rock, ocean salt breeze, trade wind breath expansion (Hā).',
    ancestralQuote: '"He aliʻi ka ʻāina, he kauwā ke kanaka — The land is a chief; man is its servant." (ʻŌlelo Noʻeau 531)'
  },
  {
    id: 'Celtic Gaelic Dùthchas & Caim (Sacred Land Belonging)',
    name: 'Celtic Gaelic Dùthchas & Caim',
    nativeScript: 'Dùthchas // Caim // An Saoghal Nàdarrach',
    region: 'Ireland & Scottish Highlands',
    historicalPeriod: 'Early Medieval & Pre-Christian Celtic heritage',
    philosophicalCore: 'Dùthchas: Inherent hereditary belonging to the physical soil and landscape. Caim: Tracing a physical circle of sanctuary in nature to seal oneself from outer turmoil and mental fragmentation.',
    clinicalEvidence: 'Highland natural therapy data highlights the neurological benefits of navigating varied terrain (moss, heather, stone), stimulating sensory neuroplasticity and balance.',
    sensoryFocus: 'Peat moss touch, cool slate stone, heather aroma, tracing physical sanctuary circle.',
    ancestralQuote: '"Is treasa tuath na tighearna — The land and the people endure longer than the chieftains."'
  },
  {
    id: 'Islamic Sufi Tafakkur & Oasis Muraqabah (Contemplation of Signs)',
    name: 'Sufi Tafakkur & Muraqabah',
    nativeScript: 'تَفَكُّر // مُرَاقَبَة // آيَات',
    region: 'Middle East & Andalusia',
    historicalPeriod: 'Classical Islamic Philosophy & Sufism (Al-Ghazali, Rumi, Ibn Arabi)',
    philosophicalCore: 'Tafakkur: Deep intellectual and somatic contemplation of the cosmic signs (Ayat) in nature—clouds, palms, waterflow, and wind—shifting focus away from the ego-mind (Nafs) into transcendent presence.',
    clinicalEvidence: 'Clinical studies of Muraqabah (mindful contemplation) demonstrate elevated theta brainwave states and rapid down-regulation of sympathetic nervous tone.',
    sensoryFocus: 'Sun-warmed stone, date palm breeze, listening to moving water, quiet sand stillness.',
    ancestralQuote: '"Look at the trees, look at the grass, look at the clouds. They all speak without letters." (Jalal al-Din Rumi)'
  },
  {
    id: 'Māori Papatūānuku & Kaitiakitanga (Earth Mother Kinship)',
    name: 'Māori Papatūānuku & Kaitiakitanga',
    nativeScript: 'Papatūānuku // Kaitiakitanga // Whakapapa',
    region: 'Aotearoa / New Zealand',
    historicalPeriod: 'Ancestral Polynesian Māori whakapapa',
    philosophicalCore: 'Acknowledging Papatūānuku (the Earth Mother) as the physical origin and ancestor of all life. Standing with bare feet in soil to ground Mauri (the life spark) and dissipate psychic exhaustion.',
    clinicalEvidence: 'Māori public health models (Te Whare Tapa Whā) validate Taha Wairua (spiritual connection to land) as essential for preventing clinical burnout and restoring neurological resilience.',
    sensoryFocus: 'Silver fern texture, volcanic soil underfoot, forest sound of Tāne Mahuta.',
    ancestralQuote: '"Toitū te marae a Tāne, toitū te marae a Tangaroa, toitū te iwi — If the realm of the forest and sea is sustained, the people are sustained."'
  },
  {
    id: 'Korean Pungryu & Mountain Salim (Flowing with Nature Wind)',
    name: 'Korean Pungryu & Salim',
    nativeScript: '풍류 (風流) // 살림',
    region: 'Korea',
    historicalPeriod: 'Silla Hwarang lineage & Joseon Neo-Confucian/Daoist synthesis',
    philosophicalCore: 'Pungryu: "Flowing with the wind"—the cultivated art of living in natural spontaneity and harmony with mountains, pine mists, and granite ridges. Salim: "To give life and restore vitality."',
    clinicalEvidence: 'Korean Forest Welfare Institute clinical trials confirm significant reductions in oxidative stress markers and improvement in heart rate variability during mountain ridge walks.',
    sensoryFocus: 'Granite stone touch, cold mountain air, pine needle petrichor.',
    ancestralQuote: '"When the wind passes through the pines, the mind cleanses itself of ten thousand dusts."'
  },
  {
    id: 'Greco-Roman Stoic Cosmic Sympatheia (The View from Above)',
    name: 'Stoic Cosmic Sympatheia',
    nativeScript: 'Συμπάθεια // Marcus Aurelius // Epictetus',
    region: 'Ancient Greece & Rome',
    historicalPeriod: 'Hellenistic Stoicism (c. 300 BCE – 180 CE)',
    philosophicalCore: 'Sympatheia: The organic interconnectedness of the cosmos as a single living organism. Taking "The View from Above" by looking into the sky vault to recognize the triviality of acute digital deadlines.',
    clinicalEvidence: 'Modern Cognitive Behavioral Therapy (derived directly from Stoicism) uses optical zooming and cognitive decentering to systematically disrupt acute catastrophizing and amygdala hijacking.',
    sensoryFocus: 'High vantage point vision, celestial horizon expanse, thermal wind on forehead.',
    ancestralQuote: '"Constantly regard the universe as one living being, having one substance and one soul." (Marcus Aurelius, Meditations IV.40)'
  },
  {
    id: 'Nordic Friluftsliv (Open-Air Element Resilience)',
    name: 'Nordic Friluftsliv',
    nativeScript: 'Friluftsliv // Henrik Ibsen',
    region: 'Scandinavia (Norway / Sweden)',
    historicalPeriod: '19th-century philosophical movement formalized by Henrik Ibsen (1859)',
    philosophicalCore: '"Free-air-life": Cultivating intimate connection with untamed nature regardless of weather conditions. Embracing brisk wind, rain, and snow to build somatic fortitude.',
    clinicalEvidence: 'Scandinavian public health research demonstrates that regular all-weather outdoor exposure reduces seasonal affective distress, improves sleep architecture, and elevates mitochondrial vigor.',
    sensoryFocus: 'Cold wind on cheekbones, damp rainfall drops, raw boreal air inhalation.',
    ancestralQuote: '"Det finnes ikke dårlig vær, bare dårlige klær — There is no bad weather, only bad clothing."'
  },
  {
    id: 'German Waldeinsamkeit (Canopy Solitude & Social Detachment)',
    name: 'German Waldeinsamkeit',
    nativeScript: 'Waldeinsamkeit // Ludwig Tieck',
    region: 'Central Europe (German Romanticism)',
    historicalPeriod: '19th-century German Romanticism',
    philosophicalCore: 'The blissful, reflective solitude found deep in forest woodlands, allowing the nervous system to untangle itself from manufactured social scrutiny and mechanical clocks.',
    clinicalEvidence: 'Environmental psychology literature confirms that voluntary forest solitude disengages the default mode network (DMN), arresting negative self-referential rumination.',
    sensoryFocus: 'Moss carpet friction, quiet canopy whispering, tactile branch tracing.',
    ancestralQuote: '"Waldeinsamkeit, die mich erfreut — Forest solitude, which gladdens my soul." (Ludwig Tieck, 1798)'
  }
];
