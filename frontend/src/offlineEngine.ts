import { GroundingMission, GroundingStep } from './types';

/**
 * Trail-Ready Offline Grounding Generator.
 * Executes on-device in zero-signal dead zones (mountain trails, remote woods).
 * Infuses authentic ancestral nature lineages with zero server dependencies.
 */
export function generateOfflineMission(
  brainDump: string,
  weatherSummary?: string,
  culturalFramework: string = 'Auto-Detect'
): GroundingMission {
  const dumpLower = brainDump.toLowerCase();
  const weather = weatherSummary || '18.0°C • Luminous Clear Sky • Daylight • 35,000 Lux';
  const isRain = weather.toLowerCase().includes('rain') || weather.toLowerCase().includes('drizzle');
  const isNight = weather.toLowerCase().includes('night') || weather.toLowerCase().includes('nocturnal');

  let resolvedFramework = culturalFramework;
  if (!resolvedFramework || resolvedFramework === 'Auto-Detect') {
    if (dumpLower.includes('code') || dumpLower.includes('bug') || dumpLower.includes('screen') || dumpLower.includes('staring')) {
      resolvedFramework = 'Japanese Shinrin-yoku (森林浴 - Forest Bathing & Komorebi)';
    } else if (dumpLower.includes('panic') || dumpLower.includes('chest') || dumpLower.includes('breath') || dumpLower.includes('tight')) {
      resolvedFramework = 'Scientific Polyvagal & Attention Restoration (Kaplan ART & Biophilia)';
    } else if (dumpLower.includes('overwhelm') || dumpLower.includes('scattered') || dumpLower.includes('focus')) {
      resolvedFramework = 'Indian Pancha Mahabhuta (पञ्चमहाभूत - Five Elemental Earth Calibration)';
    } else if (dumpLower.includes('heat') || dumpLower.includes('tired') || dumpLower.includes('heavy')) {
      resolvedFramework = 'Tamil Ainthinai & Siddha (ஐந்திணை - Sangam Eco-Landscape Alchemy)';
    } else if (dumpLower.includes('isolated') || dumpLower.includes('lonely') || dumpLower.includes('disconnected')) {
      resolvedFramework = 'African Ubuntu & Khoisan Terra-Tracking (Ubuntu / Ilẹ̀ Earth Grounding)';
    } else if (dumpLower.includes('forcing') || dumpLower.includes('blocked') || dumpLower.includes('frustrat')) {
      resolvedFramework = 'Chinese Daoist Ziran & Wu Wei (自然 / 无为 - Spontaneous Nature Flow)';
    } else if (dumpLower.includes('unrooted') || dumpLower.includes('adrift') || dumpLower.includes('fragmented')) {
      resolvedFramework = 'Celtic Gaelic Dùthchas & Caim (Sacred Land Belonging)';
    } else if (dumpLower.includes('grief') || dumpLower.includes('suffering') || dumpLower.includes('heartbreak')) {
      resolvedFramework = 'Hawaiian Aloha ʻĀina & Hā Breath (Love for the Living Earth)';
    } else if (dumpLower.includes('ego') || dumpLower.includes('meaningless') || dumpLower.includes('cynical')) {
      resolvedFramework = 'Islamic Sufi Tafakkur & Oasis Muraqabah (Contemplation of Signs)';
    } else if (dumpLower.includes('shame') || dumpLower.includes('worthless') || dumpLower.includes('small')) {
      resolvedFramework = 'Indigenous Lakota Hózhó & Mitákuye Oyásʼin (All My Relations)';
    } else if (dumpLower.includes('rigid') || dumpLower.includes('stuck') || dumpLower.includes('paralyzed')) {
      resolvedFramework = 'Korean Pungryu & Mountain Salim (Flowing with Nature Wind)';
    } else if (dumpLower.includes('catastroph') || dumpLower.includes('doom') || dumpLower.includes('hopeless')) {
      resolvedFramework = 'Greco-Roman Stoic Cosmic Sympatheia (The View from Above)';
    } else if (dumpLower.includes('meeting') || dumpLower.includes('slack') || dumpLower.includes('noise')) {
      resolvedFramework = 'German Waldeinsamkeit (Canopy Solitude & Social Detachment)';
    } else {
      resolvedFramework = 'Nordic Friluftsliv (Open-Air Element Resilience)';
    }
  }

  let title = 'Shinrin-yoku: Living Canopy Immersion & Komorebi Restoration';
  let step1 = 'Approach living foliage or a tree trunk. Press both palms flat against the organic bark; feel the ancient furrowed grain absorbing the heat and static of your hands.';
  let step4 = 'Crush a green leaf, pine needle, or blade of grass gently between your fingertips. Inhale deeply three times, receiving the volatile phytoncides released by the plant.';

  const fwLower = resolvedFramework.toLowerCase();
  if (fwLower.includes('shinrin-yoku') || fwLower.includes('komorebi')) {
    title = 'Shinrin-yoku: Living Canopy Immersion & Komorebi Restoration';
    step1 = 'Approach living foliage or a tree trunk. Press both palms flat against the organic bark; feel the ancient furrowed grain absorbing the heat and static of your hands.';
    step4 = 'Crush a green leaf, pine needle, or blade of grass gently between your fingertips. Inhale deeply three times, receiving the volatile phytoncides released by the plant.';
  } else if (fwLower.includes('pancha mahabhuta') || fwLower.includes('vedic')) {
    title = 'Pancha Mahabhuta: Five-Element Earth Realignment';
    step1 = 'Step barefoot or rest your palms upon the raw soil or unpolished stone. Release all mental turbulence directly into Prithvi (the Earth element), letting the planet bear your weight.';
    step4 = 'Breathe in Gandha—the deep, primordial fragrance of damp soil and rooted flora—anchoring your scattered awareness in timeless earthly stability.';
  } else if (fwLower.includes('ainthinai') || fwLower.includes('siddha') || fwLower.includes('tamil')) {
    title = 'Ainthinai: Sangam Five-Landscape Nature Recalibration';
    step1 = 'Step across the threshold onto living soil (Semman / Mann). Press both palms against the ground and attune your heartbeat to the ancient rhythm of the earth.';
    step4 = 'Inhale the restorative aroma of Manvaasanai (petrichor and damp red earth), drawing soothing Siddha breath deep into the center of your chest.';
  } else if (fwLower.includes('ubuntu') || fwLower.includes('khoisan') || fwLower.includes('african')) {
    title = 'Ubuntu & Khoisan Terra-Tracking: Grounded Horizon Circuit';
    step1 = 'Stand tall upon the open soil. Plant your feet firmly into the earth, feeling the unbroken life-force that connects your breath to the wider biosphere: "I am because we are".';
    step4 = 'Inhale the open air and ambient scent of earth and sky with expanded lungs, honoring the reciprocal bond between human breath and the living land.';
  } else if (fwLower.includes('daoist') || fwLower.includes('ziran') || fwLower.includes('wu wei') || fwLower.includes('chinese')) {
    title = 'Daoist Ziran: Effortless Nature Alignment & Qi Restoration';
    step1 = 'Settle into the natural Zhan Zhuang tree stance beneath the open sky. Turn your palms downward toward the ground, allowing all agitated, synthetic Yang fire to drain naturally into the cool, receptive Yin earth.';
    step4 = 'Breathe in the calm, ambient stillness of the soil, exhaling all forced exertion into the boundless sky through Wu Wei—effortless return.';
  } else if (fwLower.includes('scientific') || fwLower.includes('polyvagal') || fwLower.includes('kaplan')) {
    title = 'Neurobiological Circuit Breaker: Polyvagal Recalibration & Soft Fascination';
    step1 = 'Step into the open air to awaken your cutaneous thermoreceptors. Rest your palms against cool stone or tree bark, engaging the parasympathetic vagal brake to slow your racing pulse.';
    step4 = 'Draw in a slow four-second nasal breath, then release a prolonged six-second exhalation, consciously releasing muscle tension and signaling biological safety to your heart.';
  } else if (fwLower.includes('lakota') || fwLower.includes('mitákuye') || fwLower.includes('hózhó')) {
    title = 'Lakota Hózhó & Mitákuye Oyásʼin: Sacred Kinship Circuit';
    step1 = 'Face the open horizon. Place both palms directly upon unpaved earth, acknowledging Unci Maka (Grandmother Earth) as the quiet foundation supporting your every breath.';
    step4 = 'Breathe in the scent of wild grass, pine, or cedar, softly remembering: "Mitákuye Oyásʼin"—all living beings are your relations, and you are never alone.';
  } else if (fwLower.includes('hawaiian') || fwLower.includes('aloha') || fwLower.includes('hā')) {
    title = 'Aloha ʻĀina & Hā Breath: Living Soil & Trade Wind Connection';
    step1 = 'Rest your bare feet or palms upon the living stone or soil, honoring the sacred ʻĀina—the land that feeds both body and spirit.';
    step4 = 'Draw the sacred Hā (the breath of life) deep into your belly, exhaling every burden into the ocean tradewind (Makani) as an offering of peace.';
  } else if (fwLower.includes('celtic') || fwLower.includes('dùthchas') || fwLower.includes('caim')) {
    title = 'Celtic Dùthchas & Caim: Sacred Sanctuary Enclosure';
    step1 = 'Find an ancient stone, mossy knoll, or deep-rooted tree. Trace an invisible circular sanctuary (Caim) around your space, establishing a sacred boundary against digital noise.';
    step4 = 'Inhale the rich, cool scent of damp moss, rain-washed granite, and wild heather, resting in Dùthchas—the ancestral knowing that you belong here.';
  } else if (fwLower.includes('tafakkur') || fwLower.includes('sufi') || fwLower.includes('muraqabah')) {
    title = 'Sufi Tafakkur: Contemplation of the Sacred Signs';
    step1 = 'Rest your hand against outdoor stone or a tree branch warmed by the sun. Let your thoughts quiet into receptive stillness (Muraqabah).';
    step4 = 'Breathe deeply of the outdoor air, observing the unwritten signs (Ayat) woven through drifting clouds, rustling leaves, and the patient earth.';
  } else if (fwLower.includes('māori') || fwLower.includes('papatūānuku') || fwLower.includes('maori')) {
    title = 'Māori Papatūānuku: Earth Mother Mauri Restoration';
    step1 = 'Crouch close to the earth and place your hands upon the soil or native foliage, greeting Papatūānuku, the primal mother of all life.';
    step4 = 'Breathe in the damp forest air of Tāne Mahuta, allowing your internal life spark (Mauri) to be nourished and anchored in place.';
  } else if (fwLower.includes('pungryu') || fwLower.includes('salim') || fwLower.includes('korean')) {
    title = 'Korean Pungryu: Flowing with the Mountain Wind';
    step1 = 'Rest your hands against weathered granite or a sturdy pine trunk, allowing your tense muscles to mirror the unshakeable stillness of mountain stone.';
    step4 = 'Inhale the crisp outdoor breeze, allowing Pungryu—the graceful spirit of wind and water—to sweep clean the ten thousand restless thoughts.';
  } else if (fwLower.includes('stoic') || fwLower.includes('sympatheia')) {
    title = 'Stoic Sympatheia: The View from Above';
    step1 = 'Step into the open sky and rest your hands on solid outdoor stone or iron. Look outward toward the furthest visible horizon.';
    step4 = 'Breathe in harmony with the cosmos, reflecting on universal Sympatheia: you are a living limb of this vast, interconnected universe.';
  } else if (fwLower.includes('friluftsliv') || fwLower.includes('nordic')) {
    title = 'Nordic Friluftsliv: Open-Air Elemental Resilience';
    step1 = 'Step fully into the weather without hesitation. Stand upright with bare face to the wind, feeling the bracing truth of the raw atmosphere.';
    step4 = 'Fill your lungs with crisp outdoor air, feeling your chest expand with vitality as your senses awaken to the living season.';
  } else {
    title = 'Waldeinsamkeit: The Quiet Peace of the Forest Canopy';
    step1 = 'Step away from human architecture and synthetic chatter into the shelter of open trees. Rest your hand upon the quiet wood.';
    step4 = 'Close your eyes and breathe in the tranquil seclusion of the canopy, shedding the constant demand to perform or respond.';
  }

  let step2 = 'Soften your gaze and look toward the furthest horizon line or treetops for 45 seconds, dissolving the narrow convergence tunnel caused by digital screens.';
  let step5 = 'Tilt your face toward the open atmosphere and feel the subtle temperature contrast of ambient outdoor air and gentle solar warmth against your cheeks.';

  if (isRain) {
    step2 = 'Observe raindrops striking leaf surfaces, puddle ripples, or pavement; surrender to the hypnotic, rhythmic gravity of the water.';
    step5 = 'Allow cold droplets of rain to touch your open palms or temple, feeling the sudden, restorative thermal awakening against your skin.';
  } else if (isNight) {
    step2 = 'Turn your eyes directly upward into the deep night sky; find the darkest expanse between clouds or distant starlight, resting your overstimulated optic nerves.';
    step5 = 'Feel the crisp nocturnal breeze sweep across your forehead, drawing the accumulated cognitive heat out of your temples.';
  }

  const steps: GroundingStep[] = [
    { step_number: 1, physical_action: step1, sensory_focus: 'Touch' },
    { step_number: 2, physical_action: step2, sensory_focus: 'Sight' },
    { 
      step_number: 3, 
      physical_action: 'Close your eyes for 45 seconds. Filter out all mental dialogue and isolate the lowest ambient natural sound (wind in foliage, moving water, distant birdsong, or air current).', 
      sensory_focus: 'Sound' 
    },
    { step_number: 4, physical_action: step4, sensory_focus: 'Smell' },
    { step_number: 5, physical_action: step5, sensory_focus: 'Touch / Temperature' },
  ];

  let emotion = 'Sensory Overstimulation & Cognitive Overload';
  let encouragement = 'You severed the artificial loop and answered the quiet call of the living world. The noise has quieted, your vision has expanded, and your breath has returned to its natural rhythm. Welcome back to yourself.';

  if (dumpLower.includes('panic') || dumpLower.includes('hyperventilat') || dumpLower.includes('racing heart') || dumpLower.includes('terror') || dumpLower.includes('shaking')) {
    emotion = 'Acute Autonomic Panic & Sympathetic Surge';
    encouragement = 'Your racing heart was trying to protect you, but your feet just touched the ancient, quiet soil. Feel how cold air and living bark engage the vagal brake: your pulse is slowing, the horizon is open, and this moment holds you completely.';
  } else if (dumpLower.includes('grief') || dumpLower.includes('crying') || dumpLower.includes('tears') || dumpLower.includes('heartbreak') || dumpLower.includes('loss') || dumpLower.includes('sad')) {
    emotion = 'Grief, Heartbreak & Emotional Depletion';
    encouragement = 'Tears and heavy hearts are not failures; they are proof of your capacity to care. The earth has held centuries of sorrow and blossomed anyway. Breathe in the open sky and let the planet carry the weight you were never meant to hold alone.';
  } else if (dumpLower.includes('freeze') || dumpLower.includes('paralysis') || dumpLower.includes('stuck') || dumpLower.includes('adhd') || dumpLower.includes('overwhelm') || dumpLower.includes('procrastinat')) {
    emotion = 'ADHD Paralysis & Cognitive Freeze';
    encouragement = 'When the mind freezes under a mountain of digital noise, the body knows the way out. By moving through the threshold and sensing texture, temperature, and sky, you broke the deadlock. One step at a time is all that is ever required.';
  } else if (dumpLower.includes('imposter') || dumpLower.includes('failure') || dumpLower.includes('worthless') || dumpLower.includes('not good enough') || dumpLower.includes('fraud')) {
    emotion = 'Imposter Anxiety & Fear of Inadequacy';
    encouragement = 'No tree in this canopy ever asked for permission to grow, and neither do you. The relentless inner critic was a phantom of synthetic pressure. Out here, amidst bark and wind, your existence is fundamentally worthy without condition.';
  } else if (dumpLower.includes('bug') || dumpLower.includes('code') || dumpLower.includes('screen') || dumpLower.includes('staring') || dumpLower.includes('terminal')) {
    emotion = 'Cognitive Burnout & Screen Fatigue';
    encouragement = 'The deadlines, the screens, and the unresolved tasks will wait; what mattered was rescuing your nervous system. By stepping away from the glowing glass to touch the living earth, you reclaimed your humanity and proved that your worth is not measured in endless output.';
  } else if (dumpLower.includes('chest') || dumpLower.includes('anxi') || dumpLower.includes('heart') || dumpLower.includes('breath') || dumpLower.includes('tight') || dumpLower.includes('tension')) {
    emotion = 'Acute Somatic Anxiety & Chest Tightness';
    encouragement = 'Notice how your chest softened the moment you gave your feet solid ground to stand on. The storm in your mind was loud, but the earth beneath you is realer, steadier, and patient enough to hold it all. You are safe here.';
  }

  const trace = [
    `[1] Offline Client Synthesis: Processed zero-signal on-device protocol.`,
    `[2] Hyper-Local Anchoring: Calibrated to offline weather anchor [${weather}].`,
    `[3] Cultural Framework: Assigned ${resolvedFramework}.`,
    `[4] Sensory Synthesis: Compiled 5 acute physical outdoor milestones.`,
    `[5] Memory Contract: Session stored in volatile component memory only; 0 bytes persisted.`
  ];

  return {
    detected_emotion: emotion,
    mission_title: title,
    steps,
    post_mission_encouragement: encouragement,
    cultural_framework: resolvedFramework,
    weather_context: weather,
    reasoning_trace: trace
  };
}
