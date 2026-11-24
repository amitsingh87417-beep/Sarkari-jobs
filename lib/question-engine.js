"use strict";

// Seeded PRNG (Mulberry32) so any set #1..10000 or question #1..100000 is reproducible & fast
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffleWithAnswer(rng, correctStr, distractors) {
  const uniq = [String(correctStr)];
  for (const d of distractors) {
    const s = String(d);
    if (!uniq.includes(s)) uniq.push(s);
    if (uniq.length === 4) break;
  }
  while (uniq.length < 4) {
    uniq.push(String(Number(correctStr) + uniq.length * 3 || (correctStr + " " + uniq.length)));
  }
  const indexed = uniq.map((text, idx) => ({ text, isCorrect: idx === 0 }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    options: indexed.map((x) => x.text),
    answer: indexed.findIndex((x) => x.isCorrect)
  };
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function generateProceduralQuestion(seed, categoryHint, difficulty) {
  const rng = mulberry32(seed);
  const diff = String(difficulty || "Hard").toLowerCase();
  const hard = diff === "hard";
  const hint = String(categoryHint || "").toLowerCase();

  const isReason = hint.includes("reason");
  const isMath = hint.includes("math") || hint.includes("quant");
  const mode = isReason ? randInt(rng, 10, 14) : isMath ? randInt(rng, 1, 9) : randInt(rng, 1, 14);

  if (mode === 1) {
    // Hard Percentage + Successive Change
    const p1 = hard ? randInt(rng, 12, 35) : randInt(rng, 5, 20);
    const p2 = hard ? randInt(rng, 10, 30) : randInt(rng, 5, 15);
    const baseVal = randInt(rng, 4, 40) * 100;
    const finalVal = Math.round(baseVal * (1 + p1 / 100) * (1 - p2 / 100) * 100) / 100;
    const { options, answer } = shuffleWithAnswer(rng, `Rs. ${finalVal}`, [
      `Rs. ${(finalVal + randInt(rng, 15, 60)).toFixed(2).replace(/\.00$/, "")}`,
      `Rs. ${Math.max(10, finalVal - randInt(rng, 12, 55)).toFixed(2).replace(/\.00$/, "")}`,
      `Rs. ${Math.round(baseVal * (1 + (p1 - p2) / 100))}`
    ]);
    return {
      category: "Mathematics",
      question: `An article priced at Rs. ${baseVal} is first marked up by ${p1}% and then given a discount of ${p2}%. What is the final selling price?`,
      options,
      answer,
      explanation: `Final SP = ${baseVal} × (1 + ${p1}/100) × (1 - ${p2}/100) = Rs. ${finalVal}.`
    };
  }

  if (mode === 2) {
    // Compound Interest vs Simple Interest difference for 2 years
    const rate = hard ? randInt(rng, 6, 18) : randInt(rng, 5, 10);
    const principal = randInt(rng, 5, 50) * 1000;
    const diffCI = Math.round(((principal * rate * rate) / 10000) * 100) / 100;
    const { options, answer } = shuffleWithAnswer(rng, `Rs. ${diffCI}`, [
      `Rs. ${Math.round((diffCI + rate * 2) * 100) / 100}`,
      `Rs. ${Math.max(1, Math.round((diffCI - rate) * 100) / 100)}`,
      `Rs. ${Math.round((diffCI * 1.5) * 100) / 100}`
    ]);
    return {
      category: "Mathematics",
      question: `Find the difference between Compound Interest and Simple Interest on Rs. ${principal} at ${rate}% per annum for 2 years (compounded annually).`,
      options,
      answer,
      explanation: `For 2 years, CI - SI = P × (R/100)² = ${principal} × (${rate}/100)² = Rs. ${diffCI}.`
    };
  }

  if (mode === 3) {
    // Train crossing platform
    const speedKmh = randInt(rng, 9, 25) * 6; // divisible by 18/5 nicely
    const speedMs = (speedKmh * 5) / 18;
    const timeSec = randInt(rng, 12, 42);
    const trainLen = randInt(rng, 12, 32) * 10;
    const totalDist = Math.round(speedMs * timeSec);
    const platLen = Math.max(40, totalDist - trainLen);
    const exactTime = Math.round(((trainLen + platLen) / speedMs) * 10) / 10;
    const { options, answer } = shuffleWithAnswer(rng, `${platLen} m`, [
      `${platLen + 20} m`,
      `${Math.max(20, platLen - 25)} m`,
      `${platLen + 45} m`
    ]);
    return {
      category: "Mathematics",
      question: `A train ${trainLen} m long running at ${speedKmh} km/h crosses a railway platform in ${exactTime} seconds. What is the length of the platform?`,
      options,
      answer,
      explanation: `Speed = ${speedKmh} × (5/18) = ${speedMs.toFixed(2)} m/s. Total distance = ${trainLen + platLen} m. Platform = ${trainLen + platLen} - ${trainLen} = ${platLen} m.`
    };
  }

  if (mode === 4) {
    // Time & Work (A and B together)
    const a = randInt(rng, 10, 36);
    const b = randInt(rng, 12, 45);
    const days = Math.round(((a * b) / (a + b)) * 100) / 100;
    const { options, answer } = shuffleWithAnswer(rng, `${days} days`, [
      `${(days + 1.5).toFixed(2)} days`,
      `${Math.max(1, days - 1.25).toFixed(2)} days`,
      `${((a + b) / 2).toFixed(1)} days`
    ]);
    return {
      category: "Mathematics",
      question: `A can complete a project in ${a} days and B can complete the same project in ${b} days. Working together, in how many days will they finish it?`,
      options,
      answer,
      explanation: `Combined days = (A × B) / (A + B) = (${a} × ${b}) / (${a + b}) = ${days} days.`
    };
  }

  if (mode === 5) {
    // Ratio & Sum
    const r1 = randInt(rng, 3, 11);
    const r2 = randInt(rng, 4, 13);
    const mult = randInt(rng, 8, 45);
    const sum = (r1 + r2) * mult;
    const diffVal = Math.abs(r1 - r2) * mult;
    const { options, answer } = shuffleWithAnswer(rng, String(diffVal), [
      String(diffVal + mult),
      String(Math.max(1, diffVal - mult)),
      String(r1 * mult)
    ]);
    return {
      category: "Mathematics",
      question: `Two numbers are in the ratio ${r1} : ${r2} and their sum is ${sum}. What is the positive difference between the two numbers?`,
      options,
      answer,
      explanation: `1 part = ${sum} / ${r1 + r2} = ${mult}. Difference = |${r1} - ${r2}| × ${mult} = ${diffVal}.`
    };
  }

  if (mode === 6) {
    // Profit/Loss with SP given
    const cp = randInt(rng, 15, 95) * 20;
    const gainPct = randInt(rng, 10, 35);
    const sp = Math.round(cp * (1 + gainPct / 100));
    const { options, answer } = shuffleWithAnswer(rng, `Rs. ${cp}`, [
      `Rs. ${cp + 40}`,
      `Rs. ${Math.max(20, cp - 50)}`,
      `Rs. ${cp + 80}`
    ]);
    return {
      category: "Mathematics",
      question: `By selling an item for Rs. ${sp}, a trader earns a profit of ${gainPct}%. What was the cost price (CP) of the item?`,
      options,
      answer,
      explanation: `CP = (SP × 100) / (100 + ${gainPct}) = (${sp} × 100) / ${100 + gainPct} = Rs. ${cp}.`
    };
  }

  if (mode === 7) {
    // Boat & Stream
    const boat = randInt(rng, 10, 28);
    const stream = randInt(rng, 2, 7);
    const down = boat + stream;
    const up = boat - stream;
    const { options, answer } = shuffleWithAnswer(rng, `${boat} km/h`, [
      `${boat + 2} km/h`,
      `${Math.max(2, boat - 2)} km/h`,
      `${stream} km/h`
    ]);
    return {
      category: "Mathematics",
      question: `A boat travels downstream at ${down} km/h and upstream at ${up} km/h. What is the speed of the boat in still water?`,
      options,
      answer,
      explanation: `Speed in still water = (Downstream + Upstream) / 2 = (${down} + ${up}) / 2 = ${boat} km/h.`
    };
  }

  if (mode === 8) {
    // HCF & LCM relation
    const h = randInt(rng, 4, 18);
    const x = randInt(rng, 3, 9);
    let y = randInt(rng, 4, 11);
    while (gcd(x, y) !== 1) y++;
    const n1 = h * x;
    const n2 = h * y;
    const lcm = h * x * y;
    const { options, answer } = shuffleWithAnswer(rng, String(n2), [
      String(n2 + h),
      String(Math.max(h, n2 - h)),
      String(n1 + h)
    ]);
    return {
      category: "Mathematics",
      question: `The HCF and LCM of two numbers are ${h} and ${lcm} respectively. If one of the numbers is ${n1}, find the other number.`,
      options,
      answer,
      explanation: `Other number = (HCF × LCM) / First number = (${h} × ${lcm}) / ${n1} = ${n2}.`
    };
  }

  if (mode === 9) {
    // Mensuration: Rectangle diagonal / area
    const l = randInt(rng, 12, 48);
    const b = randInt(rng, 8, 36);
    const area = l * b;
    const perim = 2 * (l + b);
    const { options, answer } = shuffleWithAnswer(rng, `${area} sq cm`, [
      `${area + l} sq cm`,
      `${Math.max(10, area - b)} sq cm`,
      `${perim * 2} sq cm`
    ]);
    return {
      category: "Mathematics",
      question: `The length and breadth of a rectangle are ${l} cm and ${b} cm respectively (perimeter = ${perim} cm). What is its area?`,
      options,
      answer,
      explanation: `Area = Length × Breadth = ${l} × ${b} = ${area} sq cm.`
    };
  }

  if (mode === 10) {
    // Hard Number Series: n*2 + k
    const start = randInt(rng, 2, 11);
    const k = randInt(rng, 1, 7);
    const seq = [start];
    for (let i = 0; i < 4; i++) seq.push(seq[seq.length - 1] * 2 + k);
    const nextVal = seq[seq.length - 1] * 2 + k;
    const { options, answer } = shuffleWithAnswer(rng, String(nextVal), [
      String(nextVal + 2),
      String(nextVal - 2),
      String(nextVal + k + 1)
    ]);
    return {
      category: "Reasoning",
      question: `Find the next number in the series: ${seq.join(", ")}, ?`,
      options,
      answer,
      explanation: `Each term follows (previous × 2) + ${k}: ${seq[seq.length - 1]} × 2 + ${k} = ${nextVal}.`
    };
  }

  if (mode === 11) {
    // Ranking in a row
    const total = randInt(rng, 30, 120);
    const left = randInt(rng, 5, total - 5);
    const right = total - left + 1;
    const { options, answer } = shuffleWithAnswer(rng, `${right}th`, [
      `${right - 1}th`,
      `${right + 1}th`,
      `${right + 2}th`
    ]);
    return {
      category: "Reasoning",
      question: `In a row of ${total} candidates, Amit is ${left}th from the left end. What is his rank from the right end?`,
      options,
      answer,
      explanation: `Rank from right = Total - Left + 1 = ${total} - ${left} + 1 = ${right}th.`
    };
  }

  if (mode === 12) {
    // Direction Sense Pythagoras
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
    const [a, b, c] = triples[randInt(rng, 0, triples.length - 1)];
    const { options, answer } = shuffleWithAnswer(rng, `${c} km`, [
      `${a + b} km`,
      `${c + 2} km`,
      `${Math.max(1, c - 2)} km`
    ]);
    return {
      category: "Reasoning",
      question: `A candidate walks ${a} km North, then turns right and walks ${b} km East. What is the shortest (straight-line) distance from the starting point?`,
      options,
      answer,
      explanation: `By Pythagoras theorem, distance = √(${a}² + ${b}²) = √(${a * a + b * b}) = ${c} km.`
    };
  }

  if (mode === 13) {
    // Alphabetical Sum Coding
    const words = ["EXAM", "RANK", "TEST", "GOAL", "MIND", "QUIZ", "BOOK", "FAST", "STAR", "TEAM", "WORK", "PLAN"];
    const w = words[randInt(rng, 0, words.length - 1)];
    const shift = hard ? randInt(rng, 1, 3) : 0;
    const val = [...w].reduce((acc, ch) => acc + (ch.charCodeAt(0) - 64 + shift), 0);
    const { options, answer } = shuffleWithAnswer(rng, String(val), [
      String(val + 2),
      String(val - 2),
      String(val + 4)
    ]);
    return {
      category: "Reasoning",
      question: shift === 0
        ? `If A = 1, B = 2, ..., Z = 26, what is the numerical code for the word "${w}" (sum of letter values)?`
        : `If each letter value is (alphabet position + ${shift}), what is the sum code for the word "${w}"?`,
      options,
      answer,
      explanation: `Summing the letter positions of ${w}${shift ? ` with +${shift} per letter` : ""} gives ${val}.`
    };
  }

  // mode 14: Quadratic difference series
  const start = randInt(rng, 2, 15);
  const step0 = randInt(rng, 2, 6);
  const inc = randInt(rng, 2, 5);
  const seq = [start];
  let step = step0;
  for (let i = 0; i < 4; i++) {
    seq.push(seq[seq.length - 1] + step);
    step += inc;
  }
  const ans = seq[seq.length - 1] + step;
  const { options, answer } = shuffleWithAnswer(rng, String(ans), [
    String(ans + inc),
    String(ans - inc),
    String(ans + 2)
  ]);
  return {
    category: "Reasoning",
    question: `Complete the number series: ${seq.join(", ")}, ?`,
    options,
    answer,
    explanation: `Differences increase by +${inc} each step; next difference is +${step}, so ${seq[seq.length - 1]} + ${step} = ${ans}.`
  };
}

function buildDynamicPool({ count = 100, seed = 1, category = "", difficulty = "Hard", baseBank = [] }) {
  const safeCount = Math.max(1, Math.min(500, Number(count) || 100));
  const safeSeed = Math.max(1, Number(seed) || 1);
  const rng = mulberry32(safeSeed * 9973 + 17);
  const catLower = String(category || "").toLowerCase().trim();

  // Filter baseBank if category is specified
  let curated = Array.isArray(baseBank) ? baseBank.slice() : [];
  if (catLower && catLower !== "all" && !catLower.includes("mixed")) {
    const filtered = curated.filter((q) => String(q.category || "").toLowerCase().includes(catLower));
    if (filtered.length) curated = filtered;
  }

  // Deterministically shuffle curated bank
  for (let i = curated.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [curated[i], curated[j]] = [curated[j], curated[i]];
  }

  const out = [];
  const onlyProcedural = catLower.includes("math") || catLower.includes("quant") || catLower.includes("reason");
  const curatedQuota = onlyProcedural ? Math.min(curated.length, Math.floor(safeCount * 0.35)) : Math.min(curated.length, Math.floor(safeCount * 0.65));

  for (let i = 0; i < curatedQuota; i++) {
    const q = curated[i];
    out.push({
      category: q.category || "GK",
      question: q.question,
      options: (q.options || []).slice(0, 4).map(String),
      answer: Number(q.answer ?? q.answerIndex ?? 0),
      explanation: String(q.explanation || "")
    });
  }

  let procIdx = 0;
  while (out.length < safeCount) {
    const qSeed = safeSeed * 100003 + procIdx * 7919 + 31;
    out.push(generateProceduralQuestion(qSeed, category, difficulty));
    procIdx++;
  }

  // Final shuffle so curated & hard procedural questions are well mixed
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

module.exports = {
  VIRTUAL_BANK_CAPACITY: 100000,
  VIRTUAL_PDF_SETS: 10000,
  generateProceduralQuestion,
  buildDynamicPool
};
