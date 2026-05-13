// 圖片 Prompt 與圖片方向說明模板

const IMAGE_PROMPTS = {
  '專業': [
    [
      `Cinematic photo: tired person at 2am facing laptop, blue screen glow on face, half-finished coffee, scattered notes, single tear at eye corner, contemplating {ind}, 35mm film, shallow depth of field, melancholic but hopeful, Roger Deakins cinematography --ar 1:1`,
      `Wide angle behind silhouette of person at desk in dark room, only laptop screen lighting hunched shoulders, blurred city lights through window, {ind} books stacked, Edward Hopper energy --ar 1:1`
    ],
    [
      `Hands flipping pages of journal filled with {ind} notes, warm afternoon cafe light, blurred coffee, intimate close-up, kinfolk aesthetic --ar 1:1`,
      `Overhead workspace at golden hour: open notebook, fountain pen, dried flower, {ind} books, single sunbeam, warm grading, contemplative stillness --ar 1:1`
    ],
    [
      `Wide shot: silhouette at top of stairs looking up at sunlight, breakthrough moment, dust particles in light beam, Wong Kar-wai style --ar 1:1`,
      `Door opening with morning light flooding in, silhouette stepping through threshold, dust dancing in light, new chapter symbolism --ar 1:1`
    ]
  ],
  '活潑': [
    [
      `Candid: friends bursting into laughter looking at phone, Y2K aesthetic with grain, neon reflections, genuine messy joy, 2000s polaroid --ar 1:1`,
      `Selfie-style group crammed in frame, big smiles mid-laugh, motion blur, fluorescent indoor light, holding {prod}, raw vlog screenshot --ar 1:1`
    ],
    [
      `Top-down chaotic stylish desk with {prod}, scattered colorful items (donut, neon highlighter, polaroids, plant), bright daylight, retro pop --ar 1:1`,
      `Close-up face mid-realization, eyes wide excited, finger pointing off-camera, vibrant bokeh background, "wait what" expression --ar 1:1`
    ],
    [
      `Person jumping mid-air with excitement, motion blur, confetti, magic-hour pink/purple sky, cinematic playful --ar 1:1`,
      `Three split-screen polaroid showing transformation: tired → action → celebration, retro photo strip, color progression --ar 1:1`
    ]
  ],
  '溫馨': [
    [
      `Close-up two hands holding warm mug, steam rising, knitted sleeve, rain-streaked window blur, golden morning light, {ind} book nearby, Japanese cozy aesthetic, film grain --ar 1:1`,
      `Quiet morning: tea cup on wooden windowsill, dried orange slice, half-open {ind} book, soft curtains, dust motes, Studio Ghibli warmth --ar 1:1`
    ],
    [
      `Mother and daughter on wooden floor in afternoon light, talking quietly, {prod} between them, dust motes in sunbeam, documentary style --ar 1:1`,
      `Grandmother's wrinkled hand on younger hand on wooden table, soft window light, tea cup nearby, generational warmth, no faces shown --ar 1:1`
    ],
    [
      `Handwritten letter on worn wooden table, {ind} object nearby, dried flowers, soft light, sepia tones, Japanese cozy minimalism --ar 1:1`,
      `Open photo album with polaroids of {ind} journey, hands flipping pages, soft natural light, emotional and nostalgic --ar 1:1`
    ]
  ],
  '幽默': [
    [
      `Serious cat in tiny glasses staring at {ind} setup with judgment, film noir side-lighting, absurdly composed, hyperrealistic, meme-worthy --ar 1:1`,
      `Dog at desk wearing tie pretending to be {ind} professional, reading documents through glasses pushed down on snout, deadpan office background --ar 1:1`
    ],
    [
      `Person dramatically slow-motion reacting to {prod}, wind blowing hair (obvious fake fan), cinematic lighting on mundane kitchen, Wes Anderson --ar 1:1`,
      `Person investigating {prod} with magnifying glass, Sherlock Holmes lighting, completely over the top, comedic mystery --ar 1:1`
    ],
    [
      `Surreal: oversized {ind} item on tiny dining table, normal-sized person trying to eat, deadpan pastel walls, Roy Andersson --ar 1:1`,
      `Sticky notes covering entire wall with "USE {ind}" messages in different handwriting, person standing overwhelmed but smiling --ar 1:1`
    ]
  ],
  '高端': [
    [
      `Editorial: hand with delicate watch on dark velvet next to {prod}, single warm spotlight, gold accents, moody black, Tom Ford style --ar 1:1`,
      `Single object on black marble surface, beam of light from above, deep shadows, {prod} as subject, suspended in darkness, jewelry ad --ar 1:1`
    ],
    [
      `Empty luxurious room, morning light cutting diagonally across marble floor, single chair, {ind} on side table, architectural minimalism --ar 1:1`,
      `Door slightly ajar revealing elegant room with {ind} elements, dramatic side-light from inside, mysterious invitation, AD digest --ar 1:1`
    ],
    [
      `Close-up elegant person looking away, low-key lighting on textured skin, cashmere, half face shadowed, {ind} subtly present, Vogue Italia --ar 1:1`,
      `Back view of refined person at tall window overlooking city at dusk, soft warm interior light, contemplative pose, quiet achievement --ar 1:1`
    ]
  ],
  '熱血': [
    [
      `Wet pavement at night, lone figure running toward neon horizon in rain, motion mid-stride, breath in cold air, Blade Runner palette --ar 1:1`,
      `Boxer's POV from corner of empty stadium ring, mouthguard on bench, sweat, single overhead spotlight, dust, pre-fight metaphor --ar 1:1`
    ],
    [
      `Sweat dripping down forehead, eyes fierce focused, jaw clenched, dramatic side-light, dark background, Rocky style, red accent --ar 1:1`,
      `Close-up hands gripping steering wheel/weight tightly, white knuckles, action imminent, chiaroscuro lighting, intensity --ar 1:1`
    ],
    [
      `Hand pushing heavy door with light bursting through crack, dust in air, dramatic backlight silhouette, Christopher Nolan --ar 1:1`,
      `Mountain climber at summit looking at sunrise breaking through clouds, arms raised, golden hour light, vast landscape below --ar 1:1`
    ]
  ]
};

const IMAGE_DIRECTIONS = {
  '專業': [
    [
      '🎬 場景:深夜書桌前的孤獨剪影。藍色螢幕光打在臉上,「疲憊但還沒放棄」。\n\n為什麼這樣搭:故事開場就是「凌晨兩點」,圖必須讓讀者 0.3 秒內想到「這就是我」。',
      '🎬 場景:從背後拍坐在桌前的孤獨身影。構圖更廣,讓讀者看見「整個房間的孤獨」。\n\nB 版差異:不秀臉的剪影更有代入感,Edward Hopper 畫作的疏離感是參考。'
    ],
    [
      '📖 場景:陽光灑進咖啡廳的午後筆記。\n\n為什麼這樣搭:痛點剖析版需要「轉折感」— 從黑暗走向光亮。',
      '📖 場景:整個工作桌的金色時刻俯拍。\n\nB 版差異:用環境敘事,讓讀者把自己放進那個位置。'
    ],
    [
      '🌅 場景:站在階梯頂端仰望陽光的剪影。\n\n為什麼這樣搭:見證轉變版需要「成就感」,剪影讓那個人可以是你。',
      '🌅 場景:推開一扇門,光灌進來。\n\nB 版差異:從「向上看」變成「向前走」,動態感更強。'
    ]
  ],
  '活潑': [
    [
      '📸 場景:三五好友看手機爆笑的真實瞬間。\n\n為什麼這樣搭:故事開場提到「朋友傳給我」,圖要有「朋友互動的真實感」。',
      '📸 場景:vlog 式自拍特寫。\n\nB 版差異:從「旁觀者視角」變成「身在其中視角」,代入感更強。'
    ],
    [
      '🎨 場景:亂中有序的桌面 flat-lay。',
      '🎨 場景:臉部特寫的「等等什麼」瞬間。\n\nB 版差異:從物件講故事變成表情講故事。'
    ],
    [
      '🎉 場景:有人在空中跳起來的瞬間。',
      '🎉 場景:拍立得三連拍,呈現轉變過程。\n\nB 版差異:用「時間軸」呈現故事,更有見證感。'
    ]
  ],
  '溫馨': [
    [
      '☕ 場景:雙手捧著熱馬克杯的特寫。\n\n為什麼這樣搭:讓讀者「聞得到那杯茶」,觸感是這張圖的靈魂。',
      '☕ 場景:窗台上靜物。\n\nB 版差異:用「物件的詩」傳遞氛圍,吉卜力工作室的安靜感。'
    ],
    [
      '👵 場景:母女午後地板上靜靜聊天。',
      '👵 場景:奶奶的手放在年輕的手上。\n\nB 版差異:用「手的對話」代替「臉的對話」,情感更含蓄。'
    ],
    [
      '✉️ 場景:木桌上一封手寫信的特寫。\n\n為什麼這樣搭:手寫信比任何見證影片都有說服力。',
      '✉️ 場景:翻開的舊相簿。\n\nB 版差異:用「時光的物證」代替單一物件,故事感更厚。'
    ]
  ],
  '幽默': [
    [
      '😼 場景:戴眼鏡的貓在嚴肅審視{ind}。',
      '🐕 場景:打領帶的狗扮演專業人士。\n\nB 版差異:從貓換成狗,從審判感換成假裝專業的反差感。'
    ],
    [
      '🌬️ 場景:廚房裡誇張慢動作反應的人。',
      '🔍 場景:盯著{prod}像在解謎的人。\n\nB 版差異:從「反應」換成「調查」,荒謬升級。'
    ],
    [
      '🍽️ 場景:小餐桌上巨大的{ind}。',
      '📝 場景:整面牆貼滿便利貼。\n\nB 版差異:從尺寸荒謬變成資訊轟炸荒謬。'
    ]
  ],
  '高端': [
    [
      '💎 場景:深色絨布上戴錶的手與{prod}。',
      '💎 場景:黑色大理石上單一物件,頂光。\n\nB 版差異:從手部敘事換成純物件,更剋制。'
    ],
    [
      '🏛️ 場景:空蕩奢華房間的晨光。',
      '🏛️ 場景:門半開,露出一角優雅空間。\n\nB 版差異:從靜態空間換成「邀請進入」的瞬間。'
    ],
    [
      '🖤 場景:優雅人物側臉特寫,不看鏡頭。',
      '🖤 場景:背影站在窗邊俯瞰城市黃昏。\n\nB 版差異:從面孔換成背影,更內斂的高級感。'
    ]
  ],
  '熱血': [
    [
      '🌧️ 場景:夜雨中朝霓虹奔跑的孤獨身影。',
      '🥊 場景:拳擊手視角看著空蕩擂台。\n\nB 版差異:從動態奔跑換成靜態前奏,壓力反而更高。'
    ],
    [
      '💧 場景:額頭汗珠的特寫。',
      '✊ 場景:用力握緊方向盤/工具的手部特寫。\n\nB 版差異:從臉部換成手部,行動感更強烈。'
    ],
    [
      '🚪 場景:推開沉重門,光爆射出來。',
      '⛰️ 場景:登山者站在山頂俯瞰日出。\n\nB 版差異:從「突破門」換成「站在頂端」,從動作換成靜止的勝利。'
    ]
  ]
};

export const getImagePrompt = (ind, prod, tone, v, ab) =>
  IMAGE_PROMPTS[tone][v][ab].replace(/\{ind\}/g, ind).replace(/\{prod\}/g, prod);

export const getImageDirection = (ind, prod, tone, v, ab) =>
  IMAGE_DIRECTIONS[tone][v][ab].replace(/\{ind\}/g, ind).replace(/\{prod\}/g, prod);
