(() => {
  'use strict';
  const english = new Map(Object.entries({
    'SET 设施 · 共同打造一个理想社会': 'SET Facility · Building an ideal society',
    'SET 设施 — 共同打造一个理想社会': 'SET Facility — Building an ideal society',
    'SET 设施。探索，建立，超越。共同打造一个理想社会。': 'SET Facility. Seek. Establish. Transcend. Building an ideal society.',
    '从心灵到现实，万有的可能与无限之美。': 'From mind to reality. Every possibility, and boundless beauty.',
    '跳到正文': 'Skip to content',
    '共同打造一个理想社会。': 'Building an ideal society.',
    '跳过开场 ↗': 'Skip intro ↗',
    '首页': 'Home',
    '设施': 'Facility',
    '主导航': 'Navigation',
    '共同理想': 'Shared vision',
    '理解世界': 'Understanding reality',
    '向未知': 'Into the unknown',
    '物质与心灵': 'Matter & mind',
    '星域导览': 'Worlds',
    '语言': 'Language',
    '暂停动效': 'Pause motion',
    '开启动效': 'Enable motion',
    '导航': 'Menu',
    '共同打造': 'Building',
    '一个': 'an ',
    '理想社会': 'ideal society',
    '。': '.',
    '从心灵到现实，': 'From mind to reality,',
    '无不实现人之美好。': 'realizing the best of humanity.',
    '理解、认知宇宙时空的无限信息。': 'To understand and comprehend the infinite information of cosmic spacetime.',
    '和干涉、改变实体世界的无穷能力。': 'And the boundless power to intervene in and reshape the physical world.',
    '我们的理想': 'Our vision',
    '引力视界': 'Gravitational horizon',
    '黑洞与公式': 'Black hole and equations',
    '移动黑洞': 'Move black hole',
    '探索 · 建立 · 超越': 'Seek · Establish · Transcend',
    '万有的可能，': 'Every possibility,',
    '与': 'and ',
    '无限之美。': 'boundless beauty.',
    '“我们正塑造的完美不是脆弱的永恒之美，': '“The perfection we shape is not the fragile beauty of eternity,',
    '而是万有的可能与无限之美。”': 'but every possibility and boundless beauty.”',
    '阅读原文': 'Read the excerpt',
    '探索': 'Seek',
    '越过我们的无知。': 'Beyond our ignorance.',
    '建立': 'Establish',
    '从心灵到现实。': 'From mind to reality.',
    '超越': 'Transcend',
    '直至超越黑暗。': 'Until we transcend the darkness.',
    '人类的荒诞和庄重并不矛盾。': 'Human absurdity and solemnity do not contradict each other.',
    '恰恰相反，这构成了人之生命力的根本。': 'On the contrary, together they form the foundation of human vitality.',
    '我们将、曾、正在': 'We will, have, and are',
    '定义现实。': 'defining reality.',
    '叙事与叙事者皆从属于现实。': 'Narrative and narrator both belong to reality.',
    '上如同下，下如同上。': 'As above, so below; as below, so above.',
    '空间结构': 'Spatial structure',
    '虚实之间。': 'Between real and unreal.',
    '我们将、曾、正在定义现实。': 'We will, have, and are defining reality.',
    '技术思想': 'Technical perspectives',
    '虚实之间': 'Real and unreal',
    '叙事与观测': 'Narrative & observation',
    '万物相通': 'All things connected',
    '物质、意识与信息': 'Matter, mind & information',
    '永恒的现在': 'The eternal present',
    '观测反涉与数维科技': 'Observation feedback & dimensional technology',
    '叙事与叙事者皆从属于现实，上如同下下如同上的道理正是如此，吾汝之间二者无分。': 'Narrative and narrator both belong to reality. As above, so below; as below, so above. There is no division between you and me.',
    '展开阅读': 'Read more',
    '攀登。攀登。': 'Climb. Climb.',
    '不断地向上。': 'Ever upward.',
    '我们的意志，我们的渴求，': 'Our will, our longing,',
    '会亿万次于尘埃中崛起。': 'will rise from the dust, a billion times over.',
    '越过我们的无知': 'Beyond our ignorance',
    '从宇宙的尽头，': 'From the end of the cosmos,',
    '到': 'to ',
    '人的灵魂。': 'the human soul.',
    '现实与观测': 'Reality & observation',
    '能量波形': 'Energy waveform',
    '万物的本源': 'The source of all things',
    '虚实便是波在不同频率下表现出来的波形。': 'Real and unreal are waveforms expressed at different frequencies.',
    '人类意识': 'Human consciousness',
    '荒诞与庄重': 'Absurdity & solemnity',
    '人类的灵魂自有其荒诞的一面。': 'The human soul has an absurd side of its own.',
    '铁与星辰': 'Iron and stars',
    '时间的尽头': 'At the end of time',
    '铁、黑洞，与光子的海洋。': 'Iron, black holes, and an ocean of photons.',
    '星海之中，': 'Among the stars,',
    '不止一个世界。': 'more than one world.',
    '轨道之间': 'Between orbits',
    '上一景': 'Previous scene',
    '下一景': 'Next scene',
    '一片不断移动的星域': 'A stellar domain in motion',
    '永恒视界': 'Aeternizon',
    '光辉从核心星体流动的表面喷薄而出，又不断坍缩。它驱动整片星域，以难以想象的方式持续变更绝对位置。': 'Radiance erupts from the flowing surface of the core star, only to collapse again. It drives the entire stellar domain, continually shifting its absolute position in ways beyond imagination.',
    '新地球': 'New Earth',
    '地表城市': 'Surface city',
    'SURFACE / 地表城市': 'SURFACE / CITY',
    '温室中的花园行星': 'A garden world within a greenhouse',
    '又名蓝星，依照人类古老家园的形态建造。近千亿人口生活于此：约十分之一居于地表，另外九成居于占据地幔的巨大居住壳中。': 'Also known as the Blue Planet, it was built in the image of humanity’s ancient home. Nearly a hundred billion people live here: one tenth on the surface, the other nine tenths within vast habitat shells occupying the mantle.',
    '城市灯火': 'City lights',
    '在空间之外，延续空间': 'Extending space beyond space',
    '超维天穹': 'Celestial Dome',
    '利用永恒视界的散逸能量构筑维度夹缝，通过集体潜意识海洋维持时空连续性。多层空间中，生态系统与居住行星沿非欧结构展开。': 'Energy escaping from Aeternizon is used to construct interdimensional spaces, their spacetime continuity sustained by an ocean of collective subconsciousness. Ecosystems and inhabited planets unfold across non-Euclidean structures in layered space.',
    '空间意象 / LAYERED WORLDS': 'SPATIAL IMPRESSION / LAYERED WORLDS',
    '丰碑': 'Monument',
    '无尽与永恒的纪念': 'A memorial to infinity and eternity',
    '一座呈现 1 : 4 : 9 比例的黑色长方体，静静漂浮于虚空，伴随奇异的跳跃点风暴移动。': 'A black rectangular monolith with proportions of 1 : 4 : 9 floats silently in the void, moving with a strange storm of jump points.',
    '星域': 'Worlds',
    'ORBITAL / 轨道之间': 'ORBITAL / BETWEEN ORBITS',
    '行星之外，': 'Beyond the planet,',
    '另一种尺度的建设。': 'construction on another scale.',
    '轨道结构': 'Orbital structure',
    '沿行星延展': 'Extending around a world',
    '环绕行星的结构，将建设的尺度从地表延伸至轨道。': 'Structures encircling the planet extend the scale of construction from the surface into orbit.',
    '外贸轨道船坞': 'Orbital trade shipyard',
    '星际往来的门廊': 'A gateway to the stars',
    '外贸轨道船坞矗立于永恒视界的跳跃点近旁。自动化生产线组装舰船，港口迎接穿梭星海的来客。': 'The orbital trade shipyard stands near Aeternizon’s jump points. Automated production lines assemble ships; the port welcomes visitors crossing the stars.',
    '重播开场': 'Replay intro',
    '返回顶部': 'Back to top',
    'SET 世界观 · 概念展示': 'SET universe · Concept showcase',
    '关闭': 'Close',
    '返回浏览': 'Back to browsing',
    '与无限之美。': 'and boundless beauty.',
    '我们正建立的乐土不是浮于表面的假面社会。我们要建立起的是一个从心灵到现实无不实现人之美好的理想社会。我们正塑造的完美不是脆弱的永恒之美，而是万有的可能与无限之美。我们正消除的不是狭隘的不和之恶，而是一切不公不正不向往美好之物。': 'The haven we are building is not a society of superficial masks. We seek an ideal society that realizes the best of humanity, from mind to reality. The perfection we shape is not the fragile beauty of eternity, but every possibility and boundless beauty. What we seek to eliminate is not merely the narrow evil of discord, but all that is unjust, unfair, or opposed to the pursuit of a better world.',
    'SET · 设定摘录': 'SET · Setting excerpt',
    '完成了。关于一直以来对虚实边界的无尽的担忧和恐惧与喋喋不休的对叙事与观测逻辑的争执，将在过去和未来不复存在了，我们将、曾、正在定义现实。': 'It is done. The endless anxiety and fear surrounding the boundary between real and unreal, and the ceaseless disputes over the logic of narrative and observation, shall cease to exist in past and future. We will, have, and are defining reality.',
    '叙事层理论是一个本体空悬——概念无限延伸——自我指涉的观念。带有严重的范畴错误，语言和叙事是先语言产生的系统，所谓的超形而上学错误地将认识论当做本体论使用了。': 'Narrative-layer theory is an idea built on suspended ontology, endlessly extended concepts, and self-reference. It contains a serious category error: language and narrative arise from a prelinguistic system. The so-called trans-metaphysical approach mistakes epistemology for ontology.',
    '万物相通。': 'All things are connected.',
    '物质、空间、意识与信息。': 'Matter, space, consciousness, and information.',
    '宇宙中所有的一切都是能量的显化，物质是凝固的低频能量，空间是升华的高频能量，意识是不稳定的变频能量，信息是能量的双向载体，因此一切物质、空间、意识和信息均能还原为本源的能量。': 'Everything in the universe is a manifestation of energy. Matter is solidified low-frequency energy; space is sublimated high-frequency energy; consciousness is unstable, variable-frequency energy; information is energy’s bidirectional carrier. All matter, space, consciousness, and information can therefore be reduced to energy at their source.',
    '世间万物皆相通。意识和物质之间本来无分界，虚实便是波在不同频率下表现出来的波形。': 'All things are connected. There is no inherent boundary between consciousness and matter. Real and unreal are waveforms expressed at different frequencies.',
    '永恒的现在。': 'The eternal present.',
    '观测反涉 · 数维科技 · 集体潜意识海洋': 'Observation feedback · Dimensional technology · Ocean of collective subconsciousness',
    '时间切片': 'Slices of time',
    '超越时间和空间界限的数学维度数据库建筑。一个边缘空间，现实的结构在这里交织于光谱平面。': 'A mathematical-dimensional database structure beyond the limits of time and space. A liminal space where the fabric of reality interweaves across spectral planes.',
    '过去、现在和未来的一切都在此处揭示。': 'All of the past, present, and future is revealed here.',
    '对于 SET 设施来说，过去和未来是不存在的，唯有永恒的现在。观测反涉、数维科技与集体潜意识海洋的最终运用，在此交汇。': 'For SET Facility, neither past nor future exists; there is only the eternal present. The ultimate applications of observation feedback, dimensional technology, and the ocean of collective subconsciousness converge here.',
    'SET · 据设定节选整理': 'SET · Adapted from setting excerpts',
    '荒诞与庄重。': 'Absurdity and solemnity.',
    '人类的灵魂自有其荒诞的一面，人类的荒诞和庄重并不矛盾，恰恰相反，这构成了人之生命力的根本。': 'The human soul has an absurd side of its own. Human absurdity and solemnity do not contradict each other. On the contrary, together they form the foundation of human vitality.',
    '设定笔记 · 思想摘录': 'Setting notes · Reflections',
    '时间的尽头。': 'At the end of time.',
    '在经历极其漫长的时间后，宇宙中所有的重子物质都会变成铁-56，一种紧密结合的铁的同位素。': 'After an unimaginably long time, all baryonic matter in the universe will become iron-56, a tightly bound isotope of iron.',
    '在经历极其漫长的时间后，宇宙会进入黑洞纪，宇宙中只剩下无数的黑洞，而直到最后一个黑洞也蒸发，宇宙中将只剩下光子，变成光子的海洋。随着宇宙膨胀，光子也将向绝对零度冷却，最终一切归于沉寂。': 'After an unimaginably long time, the universe will enter the black-hole era, with nothing but countless black holes remaining. When the last one evaporates, only photons will remain: an ocean of light. As the universe expands, those photons will cool toward absolute zero, until everything falls silent.',
    '设定笔记 · 宇宙终局片段': 'Setting notes · The fate of the universe',
    '地球边缘': 'Earth’s limb',
    '我们的意志，我们的渴求，会亿万次于尘埃中崛起。攀登。攀登。不断地向上，越过我们的无知。直至超越黑暗。': 'Our will, our longing, will rise from the dust a billion times over. Climb. Climb. Ever upward, beyond our ignorance. Until we transcend the darkness.',
    '意识和物质之间本来无分界。': 'There is no inherent boundary between consciousness and matter.',
    '物质是凝固的低频能量，空间是升华的高频能量，意识是不稳定的变频能量，信息是能量的双向载体。': 'Matter is solidified low-frequency energy; space is sublimated high-frequency energy; consciousness is unstable, variable-frequency energy; information is energy’s bidirectional carrier.',
    '超越时间和空间界限，现实的结构交织于光谱平面。观测反涉、数维科技与集体潜意识海洋的最终运用。': 'Beyond the limits of time and space, the fabric of reality interweaves across spectral planes. The ultimate application of observation feedback, dimensional technology, and the ocean of collective subconsciousness.',
    '启用 JavaScript 可查看交互场景与完整摘录。': 'Enable JavaScript for interactive scenes and complete excerpts.'
  }));
  const sources = new Map([...english].map(([zh, en]) => [en.trim(), zh]));
  const textPairs = new WeakMap();
  const attributes = ['alt', 'aria-label', 'title', 'content', 'data-alt', 'data-name', 'data-description'];
  const attributePairs = new WeakMap();
  const root = document.documentElement;
  const controls = [...document.querySelectorAll('[data-language]')];
  let language = 'zh-CN';
  try { if (localStorage.getItem('set-facility-language') === 'en') language = 'en'; } catch { /* Storage is optional. */ }

  function pair(value) {
    const key = value.trim();
    const source = english.has(key) ? key : sources.get(key);
    if (!source) return null;
    const prefix = value.match(/^\s*/)[0];
    const suffix = value.match(/\s*$/)[0];
    return { 'zh-CN': prefix + source + suffix, en: prefix + english.get(source) + suffix };
  }
  function t(value) { return pair(value)?.[language] ?? value; }
  function apply(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script,style,svg,noscript,.language,.brand-dot,.opening-dot')) continue;
      let values = textPairs.get(node);
      if (!values || !Object.values(values).includes(node.nodeValue)) {
        values = pair(node.nodeValue);
        if (!values) continue;
        textPairs.set(node, values);
      }
      node.nodeValue = values[language];
    }
    const elements = [...container.querySelectorAll('*')];
    if (container instanceof Element) elements.unshift(container);
    elements.forEach(element => {
      if (element.closest('svg')) return;
      let cached = attributePairs.get(element);
      for (const name of attributes) {
        if (!element.hasAttribute(name)) continue;
        const current = element.getAttribute(name);
        let values = cached?.get(name);
        if (!values || !Object.values(values).includes(current)) {
          values = pair(current);
          if (!values) continue;
          if (!cached) { cached = new Map();attributePairs.set(element, cached); }
          cached.set(name, values);
        }
        element.setAttribute(name, values[language]);
      }
      if (element instanceof HTMLTemplateElement) apply(element.content);
    });
  }
  function setLanguage(next, persist = true) {
    language = next === 'en' ? 'en' : 'zh-CN';
    root.lang = language;
    apply(document);
    controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    if (persist) {
      try { localStorage.setItem('set-facility-language', language); } catch { /* Storage is optional. */ }
    }
    document.dispatchEvent(new CustomEvent('facility:languagechange', { detail: { language } }));
  }
  controls.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  const gravity = document.querySelector('#gravity-viewport');
  gravity?.addEventListener('setgravitystate', () => apply(gravity));
  window.FacilityI18n = { t, apply, get language() { return language; } };
  setLanguage(language, false);
})();
