/* Wildfall Salvagers page: the crew, critter, guardian, weapon and biome pickers. Every number comes from the game:
   weapons are their level-one base stats, critters their base health, speed and attack, biomes their biomes.csv row. */
(() => {
  'use strict';

  const CREW = [
    { id: 'rook', name: 'Rook', group: 'Crew', img: 'img/ch-rook.webp', thumb: 'img/t-rook.webp',
      tag: 'Pilot-salvager', meta: ['Crew', '1.7 m tall'],
      text: "When the Wayward goes down, Rook grabs a blaster, a thin toolkit and Pip, and heads out to salvage everything that isn't nailed down. One thumb runs, the other aims.",
      facts: ['Runs, strafes and aims at the same time', 'Gear for suit, visor, boots and core', 'Levels up mid-run and picks perk cards'] },
    { id: 'pip', name: 'Pip', group: 'Crew', img: 'img/ch-pip.webp', thumb: 'img/t-pip.webp',
      tag: 'Ship AI companion', meta: ['Crew', '0.55 m wide'],
      text: "The Wayward's ship AI, riding along in a friendly little drone. Pip guides Rook across the planet, has plenty to say about the threat level and helps out after a tumble.",
      facts: ['Your guide on every expedition', 'Waiting back at the Wayward', 'Very partial to a snack'] },
  ];

  // name, role, size, faction, base health, speed (m/s), base attack, what it does, its tell and how to answer it
  const CRITTERS = [
    ['EN01', 'Nibblebot', 'Swarmer', '0.8 m', 'Overtime Machines', 45, 3.7, 8, 'Fast, small and spring-legged. Nibblebots gather in loose packs.', 'Its head pulls back just before a bite. Keep moving and sweep the pack.'],
    ['EN02', 'Shellback', 'Armoured flanker', '1.0 m', 'Tanglelife', 160, 2.4, 14, 'A slow frontal shell with a quicker side scuttle.', 'The shell braces before it rolls forward. Sidestep and hit it from behind.'],
    ['EN03', 'Spitpod', 'Ranged spitter', '1.3 m', 'Tanglelife', 80, 1.9, 10, 'Lobs a seed pod you can see coming from medium range.', 'Its petal collar puffs up and a landing disc locks on. Move once it locks.'],
    ['EN04', 'Rivet Raider', 'Mobile shooter', '1.7 m', 'Scrapjack Raiders', 100, 2.5, 9, 'A robot raider with a Kickstart pistol that flanks and fires short, aimed bursts.', 'Watch for the orange muzzle cue as it raises the pistol, then get behind cover.'],
    ['EN05', 'Ramjet', 'Charger', '1.9 m', 'Overtime Machines', 180, 2.3, 18, 'Commits to a straight, sweeping charge, and crashes into solid cover.', 'Its chest fan spins up and an arrow locks on the floor. Dodge sideways.'],
    ['EN06', 'Hosehead', 'Suppressor', '2.0 m', 'Overtime Machines', 130, 1.7, 7, 'An arm nozzle that paints a short fan of slow bolts.', 'It plants its feet and the nozzle opens. Cross before it fires, or flank it.'],
    ['EN07', 'Patchwitch', 'Support', '1.8 m', 'Scrapjack Raiders', 100, 2.0, 6, 'Repairs an ally you can see, or gives it a short, breakable shield.', 'A lime repair link gives it away. Take the support out first.'],
    ['EN08', 'Broodbox', 'Spawner', '1.4 m wide', 'Overtime Machines', 130, 1.6, 8, 'Deploys a few Nibblebots, then fires a fallback bolt.', 'Its belly hatch opens over a striped circle. Clear the parent to stop the brood.'],
    ['EN09', 'Skitterjack', 'Assassin', '1.8 m', 'Scrapjack Raiders', 90, 3.0, 14, 'Comes in from the side and makes one committed lunge.', 'It crouches and its forearm fins light up. Sidestep, then punish the recovery.'],
    ['EN10', 'Burrowbun', 'Burrow ambusher', '0.9 m', 'Tanglelife', 70, 2.8, 12, 'Travels as a dirt mound you can see, and pops up somewhere it has locked on to.', 'The mound circles before it emerges, and it can\'t hurt you while hidden. Move away.'],
    ['EN11', 'Kite Raider', 'Aerial harasser', '1.7 m', 'Scrapjack Raiders', 90, 2.6, 7, 'A hovering robot raider with a Buzzburst. It flies low, never out of reach.', 'A jet flare and a lane marker come before each burst. Track it, or use seeking shots.'],
    ['EN12', 'Boulderbelly', 'Heavy bruiser', '2.3 m', 'Tanglelife', 280, 1.4, 22, 'A slow, big rock creature that shoves its way in and slams the ground.', 'It raises its fists over a ring with a safe outer edge. Get out of the ring.'],
  ].map(([id, name, tag, size, faction, hp, speed, attack, text, tip]) => ({
    id, name, group: 'Critters', img: `img/${id}.webp`, thumb: `img/t-${id}.webp`, tag,
    meta: [faction, size.includes('wide') ? size : `${size} tall`], text, tip,
    stats: [['Health', hp, 280, `${hp}`], ['Speed', speed, 3.7, `${speed} m/s`], ['Attack', attack, 22, `${attack}`]],
  }));

  const GUARDIANS = [
    ['BO01', 'Captain Clank', 'Crashmeadow', 'Pursuing captain', '3.1 m tall', 'Captain of the malfunctioning salvage crew.', 'Shock-ring slams and a wide fan of shots from the chest core.', 'Watch for the fist wind-up, step beyond the ring, then slip through the gaps in the fan.'],
    ['BO02', 'Mama Mulch', 'Bubblefen', 'Growing area controller', '3.4 m tall', 'An enormous native plant protecting a flooded seed nursery.', 'Seed bombardments in locked patches, and slow root strips.', 'Her petals open before each attack. Keep a route open between the roots.'],
    ['BO03', 'Volt Vulture', 'Cloudstep Bluffs', 'Aerial electrical hunter', '4.8 m wingspan', 'A weather-survey bird drone gone wrong.', 'Ring-shaped electric bursts and crossed wing-to-ground tethers.', 'When the wings spread, step into the safe eye of the ring, then sidestep the tethers.'],
    ['BO04', 'Duke Dune', 'Rust Mesa', 'Charging duellist', '3.0 m tall', 'The raiders\' chief, powered by salvaged propulsion.', 'Parallel drill-beam lanes and a long, committed charge.', 'His chest spins up first. Use the gaps between lanes and dodge sideways.'],
    ['BO05', 'Kilncrab', 'Cinder Orchard', 'Hazard keeper', '4.6 m wide', 'An old thermal harvester rebuilt into a crab-shaped kiln.', 'Hot seed mines flung from its pincers, and lobbed furnace bursts.', 'Its shell vents before it throws. Keep a clear path round the cooling mines.'],
    ['BO06', 'Prism Paladin', 'Prism Grove', 'Pattern-reading sentinel', '3.2 m tall', 'An ancient survey robot guarding a fractured observatory.', 'Alternating lattice cells and diagonal prism tethers.', 'Safe cells have calm, unstriped ground. Move deliberately.'],
    ['BO07', 'Admiral Anvil', 'Sunken Campus', 'Gravity construction titan', '3.7 m tall', 'A campus maintenance robot still enforcing long-abandoned safety rules.', 'Gravity rings, magnet mines and a shoulder charge.', 'Read the safe ring before you move: inside it or outside it, never on it.'],
    ['BO08', 'Stormbloom', 'Stormgarden', 'Storm-network guardian', '4.0 m tall', 'A native flower colony fused with the planet\'s weather relay.', 'Staggered spokes, seed bombardments and short energy lanes.', 'The petals glow before each pattern. Step through the open gaps.'],
  ].map(([id, name, biome, tag, size, text, attacks, tip]) => ({
    id, name, group: 'Guardians', img: `img/${id}.webp`, thumb: `img/t-${id}.webp`, tag,
    meta: [`Guardian of ${biome}`, size], text, attacks, tip,
  }));

  // level-one base stats from the game; damage is per shot (the Thumpkin fires six pellets)
  const WEAPONS = [
    ['WP01', 'Kickstart', 'Pistol', 24, 1, 3.5, 12, 1.2, 13, 'A single, punchy bolt. Reliable backup at close and medium range.'],
    ['WP02', 'Buzzburst', 'SMG', 9, 1, 10, 30, 1.5, 10, 'Rapid, compact bursts at short range. Great with powers that trigger on hit.'],
    ['WP03', 'Trailblazer', 'Assault rifle', 18, 1, 6, 24, 1.7, 16, 'Accurate, steady, all-purpose fire. Every expedition starts with one.'],
    ['WP04', 'Thumpkin', 'Shotgun', 10, 6, 1.2, 6, 2.1, 8, 'Six pellets per shot across a wide cone, for when things get close.'],
    ['WP05', 'Chugger', 'Machine gun', 15, 1, 8, 60, 3.0, 15, 'A 60-round box and a long firing window. Slow to reload, but you can keep moving while it chugs.'],
    ['WP06', 'Needlefin', 'Sniper', 120, 1, 1.0, 5, 2.0, 24, 'Precise, heavy shots that pierce straight through a target.'],
    ['WP07', 'Boomerang', 'Rocket launcher', 110, 1, 1.2, 3, 2.4, 20, 'Rockets you can watch fly, with a splash at the end. They never hurt Rook.'],
    ['WP08', 'Pebblepop', 'Grenade launcher', 65, 1, 1.3, 6, 2.2, 14, 'Lobs bouncing capsules that pop a second later. Watch for the landing marker.'],
    ['WP09', 'Sunspitter', 'Energy rifle', 28, 1, 3.2, 18, 1.8, 15, 'Chunky plasma capsules with a soft, wide burst.'],
    ['WP10', 'Ribbonray', 'Beam projector', 8, 1, 10, 80, 2.0, 12, 'A continuous beam that ticks ten times a second.'],
  ].map(([id, name, family, dmg, pellets, rate, mag, reload, range, text]) => {
    const shot = dmg * pellets;
    const dps = (mag * shot) / (mag / rate + reload);              // sustained, reloads included
    return { id, name, family, shot, pellets, rate, mag, reload, range, dps, text,
             img: `img/${id}.webp`, thumb: `img/t-${id}.webp` };
  });

  // biomes.csv (the game adds the Nibblebot swarm to Rust Mesa and Bubblefen); map regions from the world layout
  const BIOMES = [
    ['BI01', 'Crashmeadow', 'Lime grass, apricot rock, turquoise water', 'The Wayward\'s hull and its broken navigation mast', 'Captain Clank', ['Nibblebot', 'Spitpod', 'Rivet Raider'], '#9cd05a'],
    ['BI02', 'Rust Mesa', 'Warm sand, orange cliffs, teal cactus', 'A half-buried ship engine', 'Duke Dune', ['Nibblebot', 'Shellback', 'Rivet Raider', 'Ramjet', 'Burrowbun'], '#f0a25e'],
    ['BI03', 'Bubblefen', 'Turquoise shallows, violet bulbs, lime reeds', 'An old pumping island', 'Mama Mulch', ['Nibblebot', 'Spitpod', 'Patchwitch', 'Broodbox', 'Burrowbun'], '#44c6c0'],
    ['BI04', 'Prism Grove', 'Cream trunks, violet leaves, cyan crystals', 'A fractured observatory', 'Prism Paladin', ['Spitpod', 'Patchwitch', 'Skitterjack', 'Boulderbelly'], '#a07ae6'],
    ['BI05', 'Sunken Campus', 'Cream architecture, teal panels, warm overgrowth', 'A broken research atrium', 'Admiral Anvil', ['Rivet Raider', 'Ramjet', 'Hosehead', 'Broodbox'], '#d8c7a0'],
    ['BI06', 'Cloudstep Bluffs', 'Teal grass, cream cliffs, yellow flowers', 'A wind-turbine bridge', 'Volt Vulture', ['Ramjet', 'Skitterjack', 'Kite Raider', 'Boulderbelly'], '#5fc49a'],
    ['BI07', 'Cinder Orchard', 'Purple basalt, peach earth, orange fruit', 'A thermal fruit harvester', 'Kilncrab', ['Shellback', 'Hosehead', 'Burrowbun', 'Boulderbelly'], '#e0784e'],
    ['BI08', 'Stormgarden', 'Violet petals, turquoise foliage, amber cores', 'The planetary weather relay', 'Stormbloom', ['Hosehead', 'Patchwitch', 'Broodbox', 'Kite Raider'], '#8b6fd8'],
  ].map(([id, name, palette, landmark, guardian, critters, tint], i) => ({ id, n: i + 1, name, palette, landmark, guardian, critters, tint }));

  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, props = {}, ...kids) => {
    const e = Object.assign(document.createElement(tag), props);
    for (const k of kids.flat()) if (k != null) e.append(k);
    return e;
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // a stat bar: fills to its share once it's on the page (so changing selection animates)
  function bar(label, share, value, tone = '') {
    const fill = el('span', { className: 'fill' });
    const row = el('div', { className: `stat ${tone}` },
      el('div', { className: 'stat-top' }, el('span', { textContent: label }), el('b', { textContent: value })),
      el('div', { className: 'track', role: 'img', ariaLabel: `${label}: ${value}` }, fill));
    const pct = Math.max(6, Math.min(100, share * 100));
    if (reduced) fill.style.width = pct + '%';
    else requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = pct + '%'; }));
    return row;
  }

  function plate(name) {
    return el('div', { className: 'plate' }, el('span', { textContent: name }));
  }

  // a row of picks driving one card; arrow keys move between picks
  function picker(root, items, render, { pickClass = 'pick', label = item => item.name } = {}) {
    const picks = $('.picks', root), card = $('.card', root);
    const buttons = [];
    let group = null;
    items.forEach((item, i) => {
      if (item.group && item.group !== group && root.dataset.groups) {
        group = item.group;
        picks.append(el('span', { className: 'pick-group', textContent: group }));
      }
      const b = el('button', { className: pickClass, type: 'button', role: 'tab', ariaLabel: label(item) },
        el('img', { src: item.thumb, alt: '', loading: 'lazy', decoding: 'async', width: 96, height: 96 }));
      b.setAttribute('aria-selected', 'false');
      b.addEventListener('click', () => select(i, true));
      b.addEventListener('keydown', e => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (step) { e.preventDefault(); select((i + step + items.length) % items.length, true, true); }
      });
      picks.append(b); buttons.push(b);
    });
    function select(i, user, focus) {
      buttons.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
      if (focus) buttons[i].focus();
      if (user) buttons[i].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
      card.replaceChildren(render(items[i]));
      card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
    }
    select(0, false);
  }

  function personCard(c) {
    const art = el('figure', { className: `portrait ${c.group === 'Crew' ? 'is-crew' : ''}` },
      el('img', { src: c.img, alt: `${c.name}${c.group === 'Crew' ? '' : `, ${c.tag.toLowerCase()}`}`, decoding: 'async' }), plate(c.name));
    const body = el('div', { className: 'card-body' },
      el('p', { className: 'tagline', textContent: c.tag }),
      el('h3', { textContent: c.name }),
      el('ul', { className: 'chips' }, c.meta.map(m => el('li', { textContent: m }))),
      c.stats ? el('div', { className: 'stats' }, c.stats.map(([l, v, max, shown], k) => bar(l, v / max, shown, ['tone-a', 'tone-b', 'tone-c'][k]))) : null,
      el('p', { className: 'desc', textContent: c.text }),
      c.facts ? el('ul', { className: 'facts-list' }, c.facts.map(f => el('li', { textContent: f }))) : null,
      c.attacks ? el('p', { className: 'attacks' }, el('b', { textContent: 'Attacks ' }), c.attacks) : null,
      c.tip ? el('p', { className: 'tip' }, el('b', { textContent: 'How to beat it ' }), c.tip) : null);
    return el('div', { className: 'card-inner' }, art, body);
  }

  const MAX = { shot: 120, rate: 10, range: 24, mag: 80, dps: Math.max(...WEAPONS.map(w => w.dps)) };
  function weaponCard(w) {
    const art = el('figure', { className: 'pedestal' },
      el('img', { src: w.img, alt: `${w.name}, ${w.family.toLowerCase()}`, decoding: 'async' }), plate(w.name));
    const body = el('div', { className: 'card-body' },
      el('p', { className: 'tagline', textContent: w.family }),
      el('h3', { textContent: w.name }),
      el('p', { className: 'desc', textContent: w.text }),
      el('div', { className: 'stats' },
        bar('Damage per shot', w.shot / MAX.shot, w.pellets > 1 ? `${w.shot} (6 × ${w.shot / 6})` : `${w.shot}`, 'tone-c'),
        bar('Fire rate', w.rate / MAX.rate, `${w.rate} / s`, 'tone-a'),
        bar('Range', w.range / MAX.range, `${w.range} m`, 'tone-b'),
        bar('Magazine', Math.sqrt(w.mag / MAX.mag), `${w.mag}`, 'tone-a'),
        bar('Reload', 1.2 / w.reload, `${w.reload.toFixed(1)} s`, 'tone-b'),
        bar('Damage per second', w.dps / MAX.dps, `${Math.round(w.dps)}`, 'tone-c')),
      el('p', { className: 'small', textContent: 'Level-one base stats. Every weapon you find rolls its own level, rarity and powers.' }));
    return el('div', { className: 'card-inner' }, art, body);
  }

  // the world: map regions, the biome card, the painting behind
  function world() {
    const root = $('#world');
    if (!root) return;
    const map = $('.map', root), card = $('.biome-card', root);
    const [imgA, imgB] = root.querySelectorAll('.world-bg img');
    let front = imgA, cur = -1;
    const regions = [...map.querySelectorAll('.region')];
    regions.forEach((r, i) => {
      r.addEventListener('click', () => show(i));
      r.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); } });
    });
    $('.prev', root).addEventListener('click', () => show((cur + 7) % 8));
    $('.next', root).addEventListener('click', () => show((cur + 1) % 8));
    function show(i) {
      if (i === cur) return;
      cur = i;
      const b = BIOMES[i];
      regions.forEach((r, j) => r.setAttribute('aria-pressed', String(i === j)));
      $('.biome-n', card).textContent = `Biome ${b.n} of 8`;
      $('.biome-name', card).textContent = b.name;
      $('[data-f=landmark]', card).textContent = b.landmark;
      $('[data-f=guardian]', card).textContent = b.guardian;
      $('[data-f=critters]', card).textContent = b.critters.join(', ');
      $('[data-f=palette]', card).textContent = b.palette;
      card.style.setProperty('--tint', b.tint);
      const back = front === imgA ? imgB : imgA;
      back.onload = () => { back.classList.add('on'); front.classList.remove('on'); front = back; };
      back.src = `img/${b.id}.webp`;
      back.alt = `${b.name} concept painting`;
    }
    regions.forEach((r, i) => r.style.setProperty('--tint', BIOMES[i].tint));
    show(0);
  }

  // the tabs follow the section crossing a line a third of the way down the screen ("How it plays" counts as the game);
  // on a phone, where the tabs scroll sideways, the lit one slides into view
  function navFollow() {
    const links = [...document.querySelectorAll('[data-nav]')];
    const bar = $('.tabs');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const key = e.target.dataset.navkey || e.target.id;
        links.forEach(a => {
          const on = a.dataset.nav === key;
          a.classList.toggle('is-active', on);
          if (on && bar.scrollWidth > bar.clientWidth)
            bar.scrollTo({ left: bar.scrollLeft + a.getBoundingClientRect().left - bar.getBoundingClientRect().left - (bar.clientWidth - a.offsetWidth) / 2,
                           behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-33% 0px -66% 0px' });
    document.querySelectorAll('main > section[id]').forEach(s => io.observe(s));
  }

  picker($('#crew .roster'), CREW.concat(CRITTERS), personCard);
  picker($('#guardians .roster'), GUARDIANS, personCard);
  picker($('#arsenal .roster'), WEAPONS, weaponCard, { pickClass: 'pick tile' });
  world();
  navFollow();
})();
