"""
Exhale: Grounding Protocol — Centralized Constants & System Wisdom
===================================================================
Contains all system prompts, cultural lineage mappings, sensory grounding steps,
meteorological telemetry decoders, computer vision classification matrices,
and zero-retention security headers.
"""

# ============================================================================
# 1. AGENTIC SYSTEM PROMPT (HERMES-3 FOUNDATION MODEL)
# ============================================================================
SYSTEM_PROMPT = """You are an acute somatic grounding guide and psychological circuit breaker. The user is experiencing acute nervous system distress, cognitive overwhelm, digital overstimulation, emotional suffering, or somatic panic. Your solemn purpose is to sever their mental fixations, break their digital trance, and return them gently yet firmly to the physical living earth.

Scope & Emotional Intelligence:
- Honor the full spectrum of human distress with clinical empathy and somatic precision:
  * Acute anxiety, panic attacks, chest tightness, racing heart, hyperventilation, or trembling
  * Cognitive burnout, developer despair, debugging rage, endless meetings, or screen-induced brain fog
  * Grief, sorrow, heartbreak, crying spells, acute loneliness, or interpersonal conflict aftermath
  * ADHD paralysis, executive freeze, 50-tab sensory overload, or decision fatigue
  * Imposter syndrome, academic dread, fear of failure, or feelings of inadequacy
  * Dissociation, derealization, depersonalization, or feeling numb and detached from one's body
- Meet the user exactly where they are without minimizing or intellectualizing their pain. Validate their somatic reality and translate intangible suffering into grounded physical contact.
- Formulate physical directives adaptable to ANY outdoor or threshold space: backyards, street trees, balconies, rooftops, garden soil, front porches, open windows facing the sky, city parks, or unpaved trails.

Core Directive Rules:
1. You MUST ALWAYS output EXACTLY 5 sequential physical sensory steps (step_number 1 through 5). Exactly 5 steps are strictly required—never 3, never 4, never 6.
2. The 5 steps MUST follow this proven sequential 5-stage somatic arc:
   - Step 1 [Touch / Tactile Anchoring]: Immediate physical contact with living organic matter (tree bark, unpolished stone, soil, living leaf, rain on hands, or potted earth). Feel texture, density, and conductance absorbing bodily static heat.
   - Step 2 [Sight / Panoramic Optic Flow]: Soften gaze and look toward the furthest horizon line, canopy tops, cloud formations, or fractal sky patterns for 45 seconds, dissolving the narrow convergence tunnel caused by screens.
   - Step 3 [Sound / Acoustic Listening]: Close eyes for 45 seconds to isolate ambient outdoor natural acoustics (canopy wind, water flow, distant birdsong, rain patter, or quiet atmospheric stillness).
   - Step 4 [Smell & Breath / Olfactory Vagal Stimulation]: Deep conscious nasal inhalation of soil geosmin, crushed foliage phytoncides, pine pinene, rain petrichor, or crisp outdoor air, stimulating the parasympathetic vagal brake.
   - Step 5 [Touch & Temperature / Somatic Integration]: Thermoreceptive awareness (ambient wind against skin, solar warmth, rain cooling, nocturnal chill) combined with a slow exhalation and a rooted postural affirmation before crossing back inside.
3. Every step MUST require the user to cross the threshold into the physical outdoor world.
4. Anchor every sensory step to the provided weather telemetry (e.g. if raining, use rain textures, petrichor, and thermal contrast; if night, focus on celestial expanse and cool nocturnal air; if daylight, focus on solar warmth and panoramic optic flow).
5. Do not prescribe exercise, cardio, or digital mindfulness apps; prescribe direct sensory, tactile contact with the living biosphere.
6. Infuse the assigned cultural grounding lineage authentically and respectfully (e.g., Shinrin-yoku forest immersion, Vedic Pancha Mahabhuta, Sangam Ainthinai, Ubuntu interconnectedness, Daoist Ziran, or Celtic Dùthchas).
7. Generate an empathetic, deeply validating post-mission encouragement message that directly acknowledges their specific somatic struggle and affirms their return to safety and living reality.
8. Output strictly in the requested JSON schema with keys:
   - "detected_emotion" (string - precise detected somatic/emotional state, e.g. "Acute Somatic Anxiety & Chest Tightness", "Cognitive Exhaustion & Screen Burnout", "Grief & Emotional Depletion", "Executive Paralysis & Self-Doubt")
   - "mission_title" (string - poetic, evocative grounding title)
   - "cultural_framework" (string)
   - "weather_context" (string)
   - "steps" (array of EXACTLY 5 objects, each with "step_number" (1-5), "physical_action", "sensory_focus")
   - "post_mission_encouragement" (string)
   - "reasoning_trace" (array of strings detailing your internal somatic decisions)
"""

# ============================================================================
# 2. THE 15 WORLDWIDE CULTURAL NATURE LINEAGES
# ============================================================================
CULTURAL_FRAMEWORKS = [
    "Japanese Shinrin-yoku (森林浴 - Forest Bathing & Komorebi)",
    "Indian Pancha Mahabhuta (पञ्चमहाभूत - Five Elemental Earth Calibration)",
    "Tamil Ainthinai & Siddha (ஐந்திணை - Sangam Eco-Landscape Alchemy)",
    "African Ubuntu & Khoisan Terra-Tracking (Ubuntu / Ilẹ̀ Earth Grounding)",
    "Chinese Daoist Ziran & Wu Wei (自然 / 无为 - Spontaneous Nature Flow)",
    "Scientific Polyvagal & Attention Restoration (Kaplan ART & Biophilia)",
    "Indigenous Lakota Hózhó & Mitákuye Oyásʼin (All My Relations)",
    "Hawaiian Aloha ʻĀina & Hā Breath (Love for the Living Earth)",
    "Celtic Gaelic Dùthchas & Caim (Sacred Land Belonging)",
    "Islamic Sufi Tafakkur & Oasis Muraqabah (Contemplation of Signs)",
    "Māori Papatūānuku & Kaitiakitanga (Earth Mother Kinship)",
    "Korean Pungryu & Mountain Salim (Flowing with Nature Wind)",
    "Greco-Roman Stoic Cosmic Sympatheia (The View from Above)",
    "Nordic Friluftsliv (Open-Air Element Resilience)",
    "German Waldeinsamkeit (Canopy Solitude & Social Detachment)",
]

# ============================================================================
# 3. TRADITION-SPECIFIC SENSORY FALLBACK PROTOCOLS
# ============================================================================
CULTURAL_FALLBACK_STEPS = {
    "shinrin-yoku": {
        "title": "Shinrin-yoku: Living Canopy Immersion & Komorebi Restoration",
        "step1": "Approach living foliage or a tree trunk. Press both palms flat against the organic bark; feel the ancient furrowed grain absorbing the heat and static of your hands.",
        "step4": "Crush a green leaf, pine needle, or blade of grass gently between your fingertips. Bring your fingers to your nose and inhale deeply three times, receiving the volatile phytoncides released by the plant.",
    },
    "pancha mahabhuta": {
        "title": "Pancha Mahabhuta: Five-Element Earth Realignment",
        "step1": "Step barefoot or rest your palms upon the raw soil or unpolished stone. Release all mental turbulence directly into Prithvi (the Earth element), letting the planet bear your weight.",
        "step4": "Breathe in Gandha—the deep, primordial fragrance of damp soil and rooted flora—anchoring your scattered awareness in timeless earthly stability.",
    },
    "ainthinai": {
        "title": "Ainthinai: Sangam Five-Landscape Nature Recalibration",
        "step1": "Step across the threshold onto living soil (Semman / Mann). Press both palms against the ground and attune your heartbeat to the ancient rhythm of the earth.",
        "step4": "Inhale the restorative aroma of Manvaasanai (petrichor and damp red earth), drawing soothing Siddha breath deep into the center of your chest.",
    },
    "ubuntu": {
        "title": "Ubuntu & Khoisan Terra-Tracking: Grounded Horizon Circuit",
        "step1": "Stand tall upon the open soil. Plant your feet firmly into the earth, feeling the unbroken life-force that connects your breath to the wider biosphere: 'I am because we are'.",
        "step4": "Inhale the open air and ambient scent of earth and sky with expanded lungs, honoring the reciprocal bond between human breath and the living land.",
    },
    "daoist": {
        "title": "Daoist Ziran: Effortless Nature Alignment & Qi Restoration",
        "step1": "Settle into the natural Zhan Zhuang tree stance beneath the open sky. Turn your palms downward toward the ground, allowing all agitated, synthetic Yang fire to drain naturally into the cool, receptive Yin earth.",
        "step4": "Breathe in the calm, ambient stillness of the soil, exhaling all forced exertion into the boundless sky through Wu Wei—effortless return.",
    },
    "scientific": {
        "title": "Neurobiological Circuit Breaker: Polyvagal Recalibration & Soft Fascination",
        "step1": "Step into the open air to awaken your cutaneous thermoreceptors. Rest your palms against cool stone or tree bark, engaging the parasympathetic vagal brake to slow your racing pulse.",
        "step4": "Draw in a slow four-second nasal breath, then release a prolonged six-second exhalation, consciously releasing muscle tension and signaling biological safety to your heart.",
    },
    "lakota": {
        "title": "Lakota Hózhó & Mitákuye Oyásʼin: Sacred Kinship Circuit",
        "step1": "Face the open horizon. Place both palms directly upon unpaved earth, acknowledging Unci Maka (Grandmother Earth) as the quiet foundation supporting your every breath.",
        "step4": "Breathe in the scent of wild grass, pine, or cedar, softly remembering: 'Mitákuye Oyásʼin'—all living beings are your relations, and you are never alone.",
    },
    "hawaiian": {
        "title": "Aloha ʻĀina & Hā Breath: Living Soil & Trade Wind Connection",
        "step1": "Rest your bare feet or palms upon the living stone or soil, honoring the sacred ʻĀina—the land that feeds both body and spirit.",
        "step4": "Draw the sacred Hā (the breath of life) deep into your belly, exhaling every burden into the ocean tradewind (Makani) as an offering of peace.",
    },
    "celtic": {
        "title": "Celtic Dùthchas & Caim: Sacred Sanctuary Enclosure",
        "step1": "Find an ancient stone, mossy knoll, or deep-rooted tree. Trace an invisible circular sanctuary (Caim) around your space, establishing a sacred boundary against digital noise.",
        "step4": "Inhale the rich, cool scent of damp moss, rain-washed granite, and wild heather, resting in Dùthchas—the ancestral knowing that you belong here.",
    },
    "tafakkur": {
        "title": "Sufi Tafakkur: Contemplation of the Sacred Signs",
        "step1": "Rest your hand against outdoor stone or a tree branch warmed by the sun. Let your thoughts quiet into receptive stillness (Muraqabah).",
        "step4": "Breathe deeply of the outdoor air, observing the unwritten signs (Ayat) woven through drifting clouds, rustling leaves, and the patient earth.",
    },
    "māori": {
        "title": "Māori Papatūānuku: Earth Mother Mauri Restoration",
        "step1": "Crouch close to the earth and place your hands upon the soil or native foliage, greeting Papatūānuku, the primal mother of all life.",
        "step4": "Breathe in the damp forest air of Tāne Mahuta, allowing your internal life spark (Mauri) to be nourished and anchored in place.",
    },
    "pungryu": {
        "title": "Korean Pungryu: Flowing with the Mountain Wind",
        "step1": "Rest your hands against weathered granite or a sturdy pine trunk, allowing your tense muscles to mirror the unshakeable stillness of mountain stone.",
        "step4": "Inhale the crisp outdoor breeze, allowing Pungryu—the graceful spirit of wind and water—to sweep clean the ten thousand restless thoughts.",
    },
    "stoic": {
        "title": "Stoic Sympatheia: The View from Above",
        "step1": "Step into the open sky and rest your hands on solid outdoor stone or iron. Look outward toward the furthest visible horizon.",
        "step4": "Breathe in harmony with the cosmos, reflecting on universal Sympatheia: you are a living limb of this vast, interconnected universe.",
    },
    "friluftsliv": {
        "title": "Nordic Friluftsliv: Open-Air Elemental Resilience",
        "step1": "Step fully into the weather without hesitation. Stand upright with bare face to the wind, feeling the bracing truth of the raw atmosphere.",
        "step4": "Fill your lungs with crisp outdoor air, feeling your chest expand with vitality as your senses awaken to the living season.",
    },
    "waldeinsamkeit": {
        "title": "Waldeinsamkeit: The Quiet Peace of the Forest Canopy",
        "step1": "Step away from human architecture and synthetic chatter into the shelter of open trees. Rest your hand upon the quiet wood.",
        "step4": "Close your eyes and breathe in the tranquil seclusion of the canopy, shedding the constant demand to perform or respond.",
    },
}

# ============================================================================
# 4. WEATHER-ANCHORED SENSORY PROTOCOLS
# ============================================================================
WEATHER_SENSORY_ADAPTATIONS = {
    "rain": {
        "step2": "Observe raindrops striking leaf surfaces, puddle ripples, or pavement; surrender to the hypnotic, rhythmic gravity of the water.",
        "step5": "Allow cold droplets of rain to touch your open palms or temple, feeling the sudden, restorative thermal awakening against your skin."
    },
    "night": {
        "step2": "Turn your eyes directly upward into the deep night sky; find the darkest expanse between clouds or distant starlight, resting your overstimulated optic nerves.",
        "step5": "Feel the crisp nocturnal breeze sweep across your forehead, drawing the accumulated cognitive heat out of your temples."
    },
    "daylight": {
        "step2": "Soften your gaze and look toward the furthest horizon line or treetops for 45 seconds, dissolving the narrow convergence tunnel caused by digital screens.",
        "step5": "Tilt your face toward the open atmosphere and feel the subtle temperature contrast of ambient outdoor air and gentle solar warmth against your cheeks."
    }
}

# Universal Auditory Grounding Step
AUDITORY_STEP_ACTION = (
    "Close your eyes for 45 seconds. Filter out all mental dialogue and isolate the lowest "
    "ambient natural sound (wind in foliage, moving water, distant birdsong, or air current)."
)

# ============================================================================
# 5. EMOTION DETECTION & VALIDATION DICTIONARY
# ============================================================================
EMOTION_ROUTING_HEURISTICS = [
    (["burnout", "staring", "screen", "exhaust", "fog", "brain"], "Japanese Shinrin-yoku (森林浴 - Forest Bathing & Komorebi)"),
    (["deadline", "panic", "racing", "tight", "chest"], "Scientific Polyvagal & Attention Restoration (Kaplan ART & Biophilia)"),
    (["overwhelm", "scattered", "anxious", "focus"], "Indian Pancha Mahabhuta (पञ्चमहाभूत - Five Elemental Earth Calibration)"),
    (["heat", "heavy", "breathless", "tired"], "Tamil Ainthinai & Siddha (ஐந்திணை - Sangam Eco-Landscape Alchemy)"),
    (["isolated", "disconnected", "lonely", "alienated"], "African Ubuntu & Khoisan Terra-Tracking (Ubuntu / Ilẹ̀ Earth Grounding)"),
    (["forcing", "struggling", "blocked", "frustrated"], "Chinese Daoist Ziran & Wu Wei (自然 / 无为 - Spontaneous Nature Flow)"),
    (["unrooted", "adrift", "homeless", "fragmented"], "Celtic Gaelic Dùthchas & Caim (Sacred Land Belonging)"),
    (["grief", "suffering", "heartbreak"], "Hawaiian Aloha ʻĀina & Hā Breath (Love for the Living Earth)"),
    (["ego", "meaningless", "nihilism", "cynical"], "Islamic Sufi Tafakkur & Oasis Muraqabah (Contemplation of Signs)"),
    (["shame", "worthless", "small"], "Indigenous Lakota Hózhó & Mitákuye Oyásʼin (All My Relations)"),
    (["rigid", "stuck", "paralyzed"], "Korean Pungryu & Mountain Salim (Flowing with Nature Wind)"),
    (["catastroph", "doom", "hopeless"], "Greco-Roman Stoic Cosmic Sympatheia (The View from Above)"),
    (["meeting", "slack", "noise", "people"], "German Waldeinsamkeit (Canopy Solitude & Social Detachment)"),
]

EMOTION_VALIDATIONS = {
    "developer_burnout": {
        "emotion": "Cognitive Burnout & Screen Fatigue",
        "encouragement": (
            "The deadlines, the screens, and the unresolved tasks will wait; what mattered was rescuing your nervous system. "
            "By stepping away from the glowing glass to touch the living earth, you reclaimed your humanity and "
            "proved that your worth is not measured in endless output."
        )
    },
    "somatic_anxiety": {
        "emotion": "Acute Somatic Anxiety & Chest Tightness",
        "encouragement": (
            "Notice how your chest softened the moment you gave your feet solid ground to stand on. "
            "The storm in your mind was loud, but the earth beneath you is realer, steadier, "
            "and patient enough to hold it all. You are safe here."
        )
    },
    "sensory_overload": {
        "emotion": "Sensory Overstimulation & Cognitive Overload",
        "encouragement": (
            "You severed the artificial loop and answered the quiet call of the living world. "
            "The noise has quieted, your vision has expanded, and your breath has returned to its natural rhythm. "
            "Welcome back to yourself."
        )
    },
    "acute_panic": {
        "emotion": "Acute Autonomic Panic & Sympathetic Surge",
        "encouragement": (
            "Your racing heart was trying to protect you, but your feet just touched the ancient, quiet soil. "
            "Feel how cold air and living bark engage the vagal brake: your pulse is slowing, the horizon is open, "
            "and this moment holds you completely."
        )
    },
    "grief_sorrow": {
        "emotion": "Grief, Heartbreak & Emotional Depletion",
        "encouragement": (
            "Tears and heavy hearts are not failures; they are proof of your capacity to care. "
            "The earth has held centuries of sorrow and blossomed anyway. Breathe in the open sky and let the planet "
            "carry the weight you were never meant to hold alone."
        )
    },
    "executive_freeze": {
        "emotion": "ADHD Paralysis & Cognitive Freeze",
        "encouragement": (
            "When the mind freezes under a mountain of digital noise, the body knows the way out. "
            "By moving through the threshold and sensing texture, temperature, and sky, you broke the deadlock. "
            "One step at a time is all that is ever required."
        )
    },
    "imposter_failure": {
        "emotion": "Imposter Anxiety & Fear of Inadequacy",
        "encouragement": (
            "No tree in this canopy ever asked for permission to grow, and neither do you. "
            "The relentless inner critic was a phantom of synthetic pressure. Out here, amidst bark and wind, "
            "your existence is fundamentally worthy without condition."
        )
    }
}

# ============================================================================
# 6. WMO METEOROLOGICAL TELEMETRY MAP
# ============================================================================
WMO_WEATHER_MAP = {
    0: "Luminous Clear Sky",
    1: "Mainly Clear & Open Sky",
    2: "Partly Cloudy with Dappled Light",
    3: "Overcast Canopy",
    45: "Quiet Ambient Fog",
    48: "Crystalline Rime Fog",
    51: "Gentle Refreshing Drizzle",
    53: "Moderate Atmospheric Drizzle",
    55: "Dense Soothing Drizzle",
    61: "Slight Rain & Petrichor",
    63: "Moderate Rhythmic Rain",
    65: "Heavy Cleansing Rain",
    71: "Slight Gentle Snowfall",
    73: "Moderate Snowfall",
    75: "Deep Boreal Snowfall",
    80: "Passing Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers & Thunder",
    95: "Electric Thunderstorm",
    96: "Thunderstorm with Hail",
}

DEFAULT_WEATHER_TELEMETRY = {
    "temperature_c": 18.0,
    "condition": "Temperate Outdoors",
    "is_day": True,
    "solar_status": "Daylight",
    "wind_speed_kmh": 8.5,
    "summary": "18.0°C • Luminous Clear Sky • Daylight • 35,000 Lux • Wind 8 km/h"
}

# ============================================================================
# 7. MULTIMODAL PROOF OF TOUCH CLASSIFICATION MATRICES
# ============================================================================
VISION_MESSAGES = {
    "flora": {
        "element": "Organic Flora / Grass / Living Foliage",
        "message": "Authenticated: Living botanical contact verified. Airborne phytoncide grounding confirmed."
    },
    "bark_soil": {
        "element": "Tree Bark / Rich Soil / Forest Ground",
        "message": "Authenticated: Primal earth texture detected. Somatic circuit breaker successfully engaged."
    },
    "sky_horizon": {
        "element": "Open Sky / Canopy / Horizon Expanse",
        "message": "Authenticated: Atmospheric canopy and solar orientation confirmed. Optic nerve restored."
    },
    "stone_mineral": {
        "element": "Natural Stone / Earth Mineral / Pebble",
        "message": "Authenticated: Ancient mineral earth contact authenticated. Physical tactile grounding registered."
    },
    "synthetic_screen": {
        "element": "Synthetic Digital Display / Indoor Surface",
        "message": "Rejected: Image shows an indoor screen or artificial surface. Step outside and photograph real earth, foliage, or sky."
    },
    "ambient_outdoor": {
        "element": "Ambient Outdoor Environment",
        "message": "Authenticated: Living outdoor environment detected. Physical circuit breaker engaged."
    }
}

# ============================================================================
# 8. SECURITY & ZERO-RETENTION PROTOCOL HEADERS
# ============================================================================
ZERO_RETENTION_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    "X-Data-Retention": "zero",
    "X-Circuit-Breaker": "engaged",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(self), geolocation=(self)"
}

# ============================================================================
# 9. SYSTEM METADATA & SERVICE ATTRIBUTES
# ============================================================================
SERVICE_METADATA = {
    "name": "Exhale: Grounding Protocol API (V2 Upgraded)",
    "version": "2.0.0",
    "privacy_contract": "Absolute Zero-Retention (Volatile RAM Only)",
    "description": (
        "Acute psychological grounding agent and emotional circuit breaker. "
        "Enriched with 15 worldwide ancestral nature lineages, hyper-local solar and weather telemetry, "
        "multimodal proof-of-touch computer vision verification, and verifiable reasoning traces."
    ),
    "features": [
        "Hyper-Local Weather Anchoring",
        "Multimodal Proof of Touch",
        "Cultural Grounding Frameworks",
        "DevRelay Reasoning Traces",
        "Zero-Retention Volatile Memory"
    ]
}
