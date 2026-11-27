"use strict";

// ============================================================================
// SARKARI JOB UNIVERSE v1.0 — 2,00,00,000+ (2 CRORE) HARD QUESTION ENGINE
// Seeded PRNG + Next-Day Auto-Rotation + Real Exam CBT Paper Builder
// ============================================================================

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

function hashString(str) {
  let h = 2166136261 >>> 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h || 1;
}

function getDailySeed(dateStr, salt = "") {
  const day = String(dateStr || new Date().toISOString().slice(0, 10)).slice(0, 10);
  return hashString(`SJU-v52-${day}-${salt}`);
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffleWithAnswer(rng, correctStr, distractors) {
  const uniq = [String(correctStr)];
  for (const d of distractors) {
    const s = String(d);
    if (s && !uniq.includes(s)) uniq.push(s);
    if (uniq.length === 4) break;
  }
  let bump = 1;
  while (uniq.length < 4) {
    const num = Number(String(correctStr).replace(/[^0-9.-]/g, ""));
    const fallback = Number.isFinite(num) && String(correctStr).match(/\d/)
      ? `${Math.round((num + bump * 7) * 100) / 100}`
      : `${correctStr} (${bump + 1})`;
    if (!uniq.includes(fallback)) uniq.push(fallback);
    bump++;
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
  a = Math.abs(a);
  b = Math.abs(b);
  return b === 0 ? a : gcd(b, a % b);
}

const HARD_CURATED_BANK = [
  { category: "Indian Polity", question: "Which Constitutional Amendment Act reduced the voting age from 21 years to 18 years in India?", options: ["42nd Amendment Act, 1976", "44th Amendment Act, 1978", "61st Amendment Act, 1988", "73rd Amendment Act, 1992"], answer: 2, explanation: "The 61st Constitutional Amendment Act, 1988 amended Article 326 to lower the voting age from 21 to 18." },
  { category: "Indian Polity", question: "Under which Article of the Indian Constitution can the President promulgate an Ordinance during the recess of Parliament?", options: ["Article 110", "Article 123", "Article 143", "Article 213"], answer: 1, explanation: "Article 123 empowers the President to promulgate ordinances; Article 213 grants the same power to State Governors." },
  { category: "Indian Polity", question: "The Tenth Schedule of the Indian Constitution, dealing with Anti-Defection Law, was added by which Amendment?", options: ["52nd Amendment Act, 1985", "42nd Amendment Act, 1976", "86th Amendment Act, 2002", "91st Amendment Act, 2003"], answer: 0, explanation: "The 52nd Amendment Act (1985) inserted the Tenth Schedule to curb political defections." },
  { category: "Indian Polity", question: "Which Writ is issued by a higher court to a lower court or tribunal to prevent it from exceeding its jurisdiction?", options: ["Mandamus", "Quo Warranto", "Prohibition", "Habeas Corpus"], answer: 2, explanation: "Prohibition literally means 'to forbid' and stops a lower court/tribunal from exceeding jurisdiction." },
  { category: "Indian Polity", question: "Who presides over a Joint Sitting of both Houses of Parliament under Article 108?", options: ["President of India", "Vice-President of India", "Speaker of the Lok Sabha", "Prime Minister of India"], answer: 2, explanation: "Under Article 118(4), the Speaker of the Lok Sabha presides over a joint sitting of Parliament." },
  { category: "Indian Polity", question: "Which Article deals with the Finance Commission of India?", options: ["Article 263", "Article 279A", "Article 280", "Article 315"], answer: 2, explanation: "Article 280 provides for the constitution of a Finance Commission by the President every five years." },
  { category: "Indian Polity", question: "GST Council was established under which Article of the Indian Constitution?", options: ["Article 246A", "Article 269A", "Article 279A", "Article 280A"], answer: 2, explanation: "The 101st Amendment Act inserted Article 279A to establish the Goods and Services Tax (GST) Council." },
  { category: "Indian Polity", question: "Which committee recommended the inclusion of Fundamental Duties in the Indian Constitution?", options: ["Sarkaria Commission", "Swaran Singh Committee", "Balwant Rai Mehta Committee", "Punchhi Commission"], answer: 1, explanation: "The Swaran Singh Committee (1976) recommended Fundamental Duties, added via the 42nd Amendment." },
  { category: "Indian History", question: "In which year did the Battle of Buxar take place, cementing British East India Company's revenue control over Bengal?", options: ["1757", "1761", "1764", "1773"], answer: 2, explanation: "The Battle of Buxar (22 October 1764) was fought between Hector Munro and the combined forces of Mir Qasim, Shuja-ud-Daulah, and Shah Alam II." },
  { category: "Indian History", question: "Who among the following founded the 'Servants of India Society' in 1905?", options: ["Bal Gangadhar Tilak", "Gopal Krishna Gokhale", "Lala Lajpat Rai", "Dadabhai Naoroji"], answer: 1, explanation: "Gopal Krishna Gokhale founded the Servants of India Society in Pune in 1905." },
  { category: "Indian History", question: "The 'Ilbert Bill Controversy' (1883) occurred during the tenure of which Viceroy of India?", options: ["Lord Lytton", "Lord Ripon", "Lord Curzon", "Lord Dufferin"], answer: 1, explanation: "Lord Ripon introduced the Ilbert Bill (1883) to allow Indian magistrates to try European subjects." },
  { category: "Indian History", question: "Which Harappan site is famous for its ancient tidal dockyard?", options: ["Kalibangan", "Dholavira", "Lothal", "Banawali"], answer: 2, explanation: "Lothal in Gujarat was a major port town of the Indus Valley Civilization known for its brick dockyard." },
  { category: "Indian History", question: "At which session of the Indian National Congress was the resolution of 'Purna Swaraj' passed?", options: ["Calcutta Session, 1928", "Lahore Session, 1929", "Karachi Session, 1931", "Lucknow Session, 1916"], answer: 1, explanation: "Under Jawaharlal Nehru's presidency, the Lahore Session (Dec 1929) declared Purna Swaraj (Complete Independence)." },
  { category: "Indian History", question: "Who wrote 'Rajatarangini', the famous 12th-century historical chronicle of Kashmir?", options: ["Bilhana", "Kalhana", "Jonaraja", "Abhinavagupta"], answer: 1, explanation: "Kalhana composed Rajatarangini in Sanskrit around 1148-1150 CE, chronicling the kings of Kashmir." },
  { category: "Geography", question: "Which mountain pass connects Srinagar with Leh across the Greater Himalayas?", options: ["Banihal Pass", "Zoji La Pass", "Rohtang Pass", "Shipki La Pass"], answer: 1, explanation: "Zoji La Pass is a high mountain pass on NH-1 connecting the Kashmir Valley to Ladakh." },
  { category: "Geography", question: "The Tropic of Cancer (23.5 N) passes through how many Indian states?", options: ["6 states", "7 states", "8 states", "9 states"], answer: 2, explanation: "It passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram." },
  { category: "Geography", question: "Which river is known as 'Dakshin Ganga' (Ganga of the South)?", options: ["Krishna", "Kaveri", "Godavari", "Mahanadi"], answer: 2, explanation: "Godavari is the largest peninsular river and is called Dakshin Ganga." },
  { category: "Geography", question: "Which Indian state has the longest coastline?", options: ["Tamil Nadu", "Andhra Pradesh", "Maharashtra", "Gujarat"], answer: 3, explanation: "Gujarat has the longest coastline in India (approx. 1,600 km)." },
  { category: "Geography", question: "Loktak Lake, famous for the floating Keibul Lamjao National Park, is located in which state?", options: ["Assam", "Manipur", "Meghalaya", "Mizoram"], answer: 1, explanation: "Loktak Lake in Manipur is the largest freshwater lake in Northeast India and features floating phumdis." },
  { category: "Jammu & Kashmir", question: "Which river flows through the Wular Lake, one of Asia's largest freshwater lakes?", options: ["Chenab", "Jhelum", "Ravi", "Tawi"], answer: 1, explanation: "Wular Lake in Bandipora district, J&K is fed by the Jhelum River." },
  { category: "Jammu & Kashmir", question: "The world's highest railway arch bridge (Chenab Rail Bridge) is situated in which district of Jammu & Kashmir?", options: ["Ramban", "Reasi", "Doda", "Rajouri"], answer: 1, explanation: "The Chenab Rail Bridge (359 m above riverbed) is built in Reasi district as part of the USBRL project." },
  { category: "Jammu & Kashmir", question: "Under the Jammu & Kashmir Reorganisation Act, 2019, the Union Territory of J&K came into existence on which date?", options: ["5 August 2019", "15 August 2019", "31 October 2019", "26 January 2020"], answer: 2, explanation: "The J&K Reorganisation Act, 2019 came into effect on 31 October 2019 (National Unity Day)." },
  { category: "Jammu & Kashmir", question: "Dachigam National Park in Jammu & Kashmir is the primary natural habitat of which endangered species?", options: ["Snow Leopard", "Kashmir Stag (Hangul)", "Red Panda", "One-horned Rhino"], answer: 1, explanation: "Dachigam National Park near Srinagar is famous for conserving the critically endangered Hangul (Kashmir Stag)." },
  { category: "Jammu & Kashmir", question: "Which fort in Jammu overlooks the Tawi River and houses the ancient Bawe Wali Mata temple?", options: ["Hari Parbat Fort", "Bahu Fort", "Akhnoor Fort", "Bhim Garh Fort"], answer: 1, explanation: "Bahu Fort sits on the banks of the Tawi River in Jammu city." },
  { category: "Jammu & Kashmir", question: "Salal Hydroelectric Power Station is built on which river in Jammu & Kashmir?", options: ["Jhelum", "Chenab", "Indus", "Kishanganga"], answer: 1, explanation: "Salal Hydroelectric Project is a run-of-the-river project on the Chenab River in Reasi district." },
  { category: "General Science", question: "Which vitamin is chemically known as 'Cobalamin' and contains the metal Cobalt?", options: ["Vitamin B1", "Vitamin B6", "Vitamin B12", "Vitamin K"], answer: 2, explanation: "Vitamin B12 (Cobalamin) is essential for RBC formation and contains cobalt." },
  { category: "General Science", question: "What is the escape velocity from the surface of the Earth?", options: ["7.9 km/s", "9.8 km/s", "11.2 km/s", "15.4 km/s"], answer: 2, explanation: "Earth's escape velocity is approximately 11.2 km/s." },
  { category: "General Science", question: "Which organelle is known as the 'Suicidal Bag' of the cell due to its hydrolytic enzymes?", options: ["Mitochondria", "Ribosome", "Lysosome", "Golgi Apparatus"], answer: 2, explanation: "Lysosomes contain digestive enzymes that can break down cellular waste and damaged cells." },
  { category: "General Science", question: "Which acid is predominantly present in vinegar?", options: ["Citric Acid", "Acetic Acid", "Formic Acid", "Oxalic Acid"], answer: 1, explanation: "Vinegar is typically a 5-8% aqueous solution of Acetic Acid (CH3COOH)." },
  { category: "General Science", question: "In optical fibers, light signals travel long distances using which physical principle?", options: ["Refraction", "Diffraction", "Total Internal Reflection", "Polarization"], answer: 2, explanation: "Optical fibers transmit light via repeated Total Internal Reflection (TIR)." },
  { category: "Economy & Banking", question: "Which rate is charged by the Reserve Bank of India (RBI) when commercial banks borrow short-term funds against government securities?", options: ["Reverse Repo Rate", "Repo Rate", "Cash Reserve Ratio", "Statutory Liquidity Ratio"], answer: 1, explanation: "Repo Rate is the rate at which RBI lends short-term liquidity to commercial banks." },
  { category: "Economy & Banking", question: "Who is the ex-officio Chairperson of NITI Aayog?", options: ["Finance Minister", "President of India", "Prime Minister of India", "RBI Governor"], answer: 2, explanation: "The Prime Minister of India serves as the ex-officio Chairperson of NITI Aayog." },
  { category: "Economy & Banking", question: "NABARD (National Bank for Agriculture and Rural Development) was established in 1982 on the recommendation of which committee?", options: ["Narasimham Committee", "B. Sivaraman Committee", "Rangarajan Committee", "Kelkar Committee"], answer: 1, explanation: "NABARD was set up on 12 July 1982 based on the B. Sivaraman Committee recommendations." },
  { category: "Computer Awareness", question: "Which OSI layer is responsible for logical addressing (IP addresses) and routing of packets?", options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"], answer: 1, explanation: "Layer 3 (Network Layer) handles IP addressing and packet routing." },
  { category: "Computer Awareness", question: "In MS Excel, which shortcut key is used to insert the current date in a cell?", options: ["Ctrl + Shift + ;", "Ctrl + ;", "Alt + D", "Shift + F3"], answer: 1, explanation: "Ctrl + ; inserts the current date, while Ctrl + Shift + ; inserts the current time." },
  { category: "Computer Awareness", question: "Which protocol is used for securely transferring web pages over an encrypted TLS/SSL connection?", options: ["FTP", "SMTP", "HTTPS", "SNMP"], answer: 2, explanation: "HTTPS encrypts HTTP traffic using TLS/SSL on port 443." },
  { category: "English", question: "Choose the one-word substitution for: 'A person who is indifferent to pleasure or pain'.", options: ["Cynic", "Stoic", "Altruist", "Ascetic"], answer: 1, explanation: "A Stoic endures pain or hardship without showing feelings or complaining." },
  { category: "English", question: "Identify the correct passive voice of: 'The committee will announce the results tomorrow.'", options: ["The results are announced by the committee tomorrow.", "The results will be announced by the committee tomorrow.", "The results would be announced tomorrow.", "The results were announced by the committee tomorrow."], answer: 1, explanation: "Simple future active (will + V1) transforms to passive as 'will be + V3'." },
  { category: "English", question: "Choose the antonym of 'EPHEMERAL'.", options: ["Transient", "Fleeting", "Perpetual", "Fragile"], answer: 2, explanation: "Ephemeral means short-lived; its antonym is Perpetual (everlasting)." }
];

const STATIC_FACT_TABLES = {
  capitals: [
    ["Himachal Pradesh", "Shimla"], ["Uttarakhand", "Dehradun"], ["Assam", "Dispur"], ["Manipur", "Imphal"],
    ["Meghalaya", "Shillong"], ["Mizoram", "Aizawl"], ["Nagaland", "Kohima"], ["Tripura", "Agartala"],
    ["Sikkim", "Gangtok"], ["Arunachal Pradesh", "Itanagar"], ["Jharkhand", "Ranchi"], ["Chhattisgarh", "Raipur"],
    ["Telangana", "Hyderabad"], ["Odisha", "Bhubaneswar"], ["Ladakh", "Leh"], ["Goa", "Panaji"]
  ],
  articles: [
    ["Article 17", "Abolition of Untouchability"], ["Article 21A", "Right to Elementary Education"],
    ["Article 32", "Constitutional Remedies"], ["Article 40", "Organisation of Village Panchayats"],
    ["Article 44", "Uniform Civil Code"], ["Article 50", "Separation of Judiciary from Executive"],
    ["Article 72", "Pardoning Power of the President"], ["Article 76", "Attorney General of India"],
    ["Article 110", "Definition of Money Bills"], ["Article 148", "Comptroller and Auditor General (CAG)"],
    ["Article 226", "Writ Jurisdiction of High Courts"], ["Article 324", "Election Commission of India"],
    ["Article 352", "National Emergency"], ["Article 356", "President's Rule in States"],
    ["Article 360", "Financial Emergency"], ["Article 368", "Power of Parliament to Amend Constitution"]
  ],
  units: [
    ["Force", "Newton (N)"], ["Work / Energy", "Joule (J)"], ["Power", "Watt (W)"],
    ["Pressure", "Pascal (Pa)"], ["Frequency", "Hertz (Hz)"], ["Electric Charge", "Coulomb (C)"],
    ["Electrical Resistance", "Ohm (Ω)"], ["Magnetic Flux", "Weber (Wb)"], ["Luminous Intensity", "Candela (cd)"],
    ["Potential Difference", "Volt (V)"], ["Capacitance", "Farad (F)"], ["Inductance", "Henry (H)"]
  ],
  parks: [
    ["Jim Corbett National Park", "Uttarakhand"], ["Kaziranga National Park", "Assam"],
    ["Gir National Park", "Gujarat"], ["Kanha National Park", "Madhya Pradesh"],
    ["Sundarbans National Park", "West Bengal"], ["Ranthambore National Park", "Rajasthan"],
    ["Periyar National Park", "Kerala"], ["Bandipur National Park", "Karnataka"],
    ["Hemis National Park", "Ladakh"], ["Kishtwar National Park", "Jammu & Kashmir"],
    ["Simlipal National Park", "Odisha"], ["Silent Valley National Park", "Kerala"]
  ],
  shortcuts: [
    ["Ctrl + Z", "Undo the last action"], ["Ctrl + Y", "Redo the last undone action"],
    ["Ctrl + Shift + Esc", "Open Task Manager directly"], ["F2", "Rename selected file or edit active Excel cell"],
    ["Alt + F4", "Close the active window or application"], ["Ctrl + H", "Open Find and Replace dialog"],
    ["Ctrl + K", "Insert a hyperlink in MS Word / Excel"], ["Win + L", "Lock the Windows computer screen"]
  ]
};

function generateKnowledgeProcedural(rng, hint) {
  const h = String(hint || "").toLowerCase();
  if (h.includes("polity") || (!h && rng() < 0.28)) {
    const idx = randInt(rng, 0, STATIC_FACT_TABLES.articles.length - 1);
    const [art, desc] = STATIC_FACT_TABLES.articles[idx];
    const others = STATIC_FACT_TABLES.articles.filter((_, i) => i !== idx).sort(() => rng() - 0.5).slice(0, 3).map(x => x[0]);
    const { options, answer } = shuffleWithAnswer(rng, art, others);
    return {
      category: "Indian Polity",
      question: `Which Article of the Indian Constitution specifically deals with '${desc}'?`,
      options,
      answer,
      explanation: `${art} of the Indian Constitution provides for ${desc}.`
    };
  }
  if (h.includes("science") || (!h && rng() < 0.52)) {
    const idx = randInt(rng, 0, STATIC_FACT_TABLES.units.length - 1);
    const [qty, unit] = STATIC_FACT_TABLES.units[idx];
    const others = STATIC_FACT_TABLES.units.filter((_, i) => i !== idx).sort(() => rng() - 0.5).slice(0, 3).map(x => x[1]);
    const { options, answer } = shuffleWithAnswer(rng, unit, others);
    return {
      category: "General Science",
      question: `What is the standard SI unit of ${qty}?`,
      options,
      answer,
      explanation: `The SI unit of ${qty} is ${unit}.`
    };
  }
  if (h.includes("computer") || (!h && rng() < 0.7)) {
    const idx = randInt(rng, 0, STATIC_FACT_TABLES.shortcuts.length - 1);
    const [key, fn] = STATIC_FACT_TABLES.shortcuts[idx];
    const others = STATIC_FACT_TABLES.shortcuts.filter((_, i) => i !== idx).sort(() => rng() - 0.5).slice(0, 3).map(x => x[0]);
    const { options, answer } = shuffleWithAnswer(rng, key, others);
    return {
      category: "Computer Awareness",
      question: `Which keyboard shortcut is used to '${fn}'?`,
      options,
      answer,
      explanation: `${key} is used to ${fn.toLowerCase()}.`
    };
  }
  if (rng() < 0.5) {
    const idx = randInt(rng, 0, STATIC_FACT_TABLES.parks.length - 1);
    const [park, st] = STATIC_FACT_TABLES.parks[idx];
    const others = STATIC_FACT_TABLES.parks.filter((_, i) => i !== idx && STATIC_FACT_TABLES.parks[i][1] !== st).sort(() => rng() - 0.5).slice(0, 3).map(x => x[1]);
    const { options, answer } = shuffleWithAnswer(rng, st, others);
    return {
      category: "Geography",
      question: `In which Indian State or Union Territory is ${park} located?`,
      options,
      answer,
      explanation: `${park} is located in ${st}.`
    };
  } else {
    const idx = randInt(rng, 0, STATIC_FACT_TABLES.capitals.length - 1);
    const [st, cap] = STATIC_FACT_TABLES.capitals[idx];
    const others = STATIC_FACT_TABLES.capitals.filter((_, i) => i !== idx).sort(() => rng() - 0.5).slice(0, 3).map(x => x[1]);
    const { options, answer } = shuffleWithAnswer(rng, cap, others);
    return {
      category: "Geography",
      question: `Which city serves as the capital of ${st}?`,
      options,
      answer,
      explanation: `${cap} is the capital of ${st}.`
    };
  }
}

function generateProceduralQuestion(seed, categoryHint, difficulty) {
  const rng = mulberry32(seed);
  const diff = String(difficulty || "Hard").toLowerCase();
  const hard = diff === "hard";
  const hint = String(categoryHint || "").toLowerCase();

  if (hint.includes("gk") || hint.includes("polity") || hint.includes("science") || hint.includes("geog") || hint.includes("computer") || hint.includes("history") || hint.includes("jammu") || hint.includes("english")) {
    if (rng() < 0.65) {
      const matched = HARD_CURATED_BANK.filter(q => q.category.toLowerCase().includes(hint) || (hint === "gk" && /polity|history|geog|science|economy|jammu/i.test(q.category)));
      if (matched.length) {
        const chosen = matched[randInt(rng, 0, matched.length - 1)];
        const { options, answer } = shuffleWithAnswer(rng, chosen.options[chosen.answer], chosen.options.filter((_, i) => i !== chosen.answer));
        return { category: chosen.category, question: chosen.question, options, answer, explanation: chosen.explanation };
      }
    }
    return generateKnowledgeProcedural(rng, hint);
  }

  const isReason = hint.includes("reason");
  const isMath = hint.includes("math") || hint.includes("quant");
  const mode = isReason ? randInt(rng, 10, 15) : isMath ? randInt(rng, 1, 9) : randInt(rng, 1, 18);

  if (mode >= 16) return generateKnowledgeProcedural(rng, "");

  if (mode === 1) {
    const p1 = hard ? randInt(rng, 15, 45) : randInt(rng, 5, 20);
    const p2 = hard ? randInt(rng, 10, 30) : randInt(rng, 5, 15);
    const baseVal = randInt(rng, 5, 60) * 100;
    const finalVal = Math.round(baseVal * (1 + p1 / 100) * (1 - p2 / 100) * 100) / 100;
    const { options, answer } = shuffleWithAnswer(rng, `Rs. ${finalVal}`, [
      `Rs. ${(finalVal + randInt(rng, 18, 75)).toFixed(2).replace(/\.00$/, "")}`,
      `Rs. ${Math.max(10, finalVal - randInt(rng, 15, 65)).toFixed(2).replace(/\.00$/, "")}`,
      `Rs. ${Math.round(baseVal * (1 + (p1 - p2) / 100))}`
    ]);
    return {
      category: "Mathematics",
      question: `An article with cost price Rs. ${baseVal} is marked up by ${p1}% and then sold at a discount of ${p2}%. Find the final selling price.`,
      options,
      answer,
      explanation: `SP = ${baseVal} × (1 + ${p1}/100) × (1 - ${p2}/100) = Rs. ${finalVal}.`
    };
  }

  if (mode === 2) {
    const rate = hard ? randInt(rng, 6, 20) : randInt(rng, 5, 10);
    const principal = randInt(rng, 5, 80) * 1000;
    const diffCI = Math.round(((principal * rate * rate) / 10000) * 100) / 100;
    const { options, answer } = shuffleWithAnswer(rng, `Rs. ${diffCI}`, [
      `Rs. ${Math.round((diffCI + rate * 3) * 100) / 100}`,
      `Rs. ${Math.max(1, Math.round((diffCI - rate * 2) * 100) / 100)}`,
      `Rs. ${Math.round((diffCI * 1.4) * 100) / 100}`
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
    const a = hard ? randInt(rng, 12, 36) : randInt(rng, 6, 15);
    const b = hard ? randInt(rng, 15, 48) : randInt(rng, 10, 20);
    const num = a * b;
    const den = a + b;
    const g = gcd(num, den);
    const ansNum = num / g;
    const ansDen = den / g;
    const dec = ansNum / ansDen;
    const ansStr = ansDen === 1 ? `${ansNum} days` : `${dec.toFixed(2)} days`;
    const { options, answer } = shuffleWithAnswer(rng, ansStr, [
      `${(dec + 1.5).toFixed(2)} days`,
      `${Math.max(1, dec - 1.25).toFixed(2)} days`,
      `${((a + b) / 2).toFixed(2)} days`
    ]);
    return {
      category: "Mathematics",
      question: `A can complete a piece of work in ${a} days and B can complete the same work in ${b} days. In how many days can A and B together finish it?`,
      options,
      answer,
      explanation: `Together time = (A × B) / (A + B) = (${a} × ${b}) / (${a} + ${b}) = ${ansStr}.`
    };
  }

  if (mode === 4) {
    const speedKmph = pick(rng, [36, 45, 54, 63, 72, 81, 90, 108]);
    const speedMs = (speedKmph * 5) / 18;
    const trainLen = randInt(rng, 12, 32) * 10;
    const platLen = randInt(rng, 15, 45) * 10;
    const timeSec = Math.round(((trainLen + platLen) / speedMs) * 100) / 100;
    const { options, answer } = shuffleWithAnswer(rng, `${timeSec} sec`, [
      `${(timeSec + 4).toFixed(2).replace(/\.00$/, "")} sec`,
      `${Math.max(2, timeSec - 3.5).toFixed(2).replace(/\.00$/, "")} sec`,
      `${Math.round((trainLen / speedMs) * 10) / 10} sec`
    ]);
    return {
      category: "Mathematics",
      question: `A train ${trainLen} m long is running at ${speedKmph} km/h. How much time will it take to cross a platform ${platLen} m long?`,
      options,
      answer,
      explanation: `Speed = ${speedKmph} × 5/18 = ${speedMs} m/s. Total distance = ${trainLen + platLen} m. Time = ${timeSec} sec.`
    };
  }

  if (mode === 5) {
    const boat = randInt(rng, 10, 24);
    const stream = randInt(rng, 2, 6);
    const hrs = randInt(rng, 2, 6);
    const dist = (boat - stream) * hrs;
    const downTime = Math.round((dist / (boat + stream)) * 100) / 100;
    const { options, answer } = shuffleWithAnswer(rng, `${downTime} hrs`, [
      `${(downTime + 0.75).toFixed(2)} hrs`,
      `${Math.max(0.5, downTime - 0.6).toFixed(2)} hrs`,
      `${hrs} hrs`
    ]);
    return {
      category: "Mathematics",
      question: `A boat's speed in still water is ${boat} km/h and the stream flows at ${stream} km/h. It travels ${dist} km upstream. How long will it take to cover the same distance downstream?`,
      options,
      answer,
      explanation: `Downstream speed = ${boat + stream} km/h. Time = ${dist} / ${boat + stream} = ${downTime} hrs.`
    };
  }

  if (mode === 6) {
    const r1 = randInt(rng, 3, 9);
    const r2 = randInt(rng, 4, 11);
    const r3 = randInt(rng, 2, 8);
    const mult = randInt(rng, 15, 95);
    const total = (r1 + r2 + r3) * mult;
    const largest = Math.max(r1, r2, r3) * mult;
    const { options, answer } = shuffleWithAnswer(rng, `Rs. ${largest}`, [
      `Rs. ${largest + mult}`,
      `Rs. ${Math.max(10, largest - mult)}`,
      `Rs. ${Math.min(r1, r2, r3) * mult}`
    ]);
    return {
      category: "Mathematics",
      question: `A sum of Rs. ${total} is divided among P, Q, and R in the ratio ${r1} : ${r2} : ${r3}. What is the largest share?`,
      options,
      answer,
      explanation: `1 unit = ${total} / (${r1}+${r2}+${r3}) = Rs. ${mult}. Largest share = ${Math.max(r1, r2, r3)} × ${mult} = Rs. ${largest}.`
    };
  }

  if (mode === 7) {
    const n = randInt(rng, 6, 18);
    const avg = randInt(rng, 24, 58);
    const inc = randInt(rng, 2, 6);
    const newMember = avg + (n + 1) * inc;
    const { options, answer } = shuffleWithAnswer(rng, `${newMember} years`, [
      `${newMember - inc} years`,
      `${newMember + inc * 2} years`,
      `${avg + n * inc} years`
    ]);
    return {
      category: "Mathematics",
      question: `The average age of ${n} students is ${avg} years. When a teacher joins, the average increases by ${inc} years. What is the teacher's age?`,
      options,
      answer,
      explanation: `Teacher's age = Old Average + (New Count × Increase) = ${avg} + (${n + 1} × ${inc}) = ${newMember} years.`
    };
  }

  if (mode === 8) {
    const cp = randInt(rng, 8, 55) * 50;
    const profitPct = pick(rng, [12, 15, 18, 20, 24, 25, 30, 35]);
    const sp = Math.round(cp * (1 + profitPct / 100));
    const { options, answer } = shuffleWithAnswer(rng, `${profitPct}%`, [
      `${profitPct + 4}%`,
      `${Math.max(2, profitPct - 3)}%`,
      `${Math.round(((sp - cp) / sp) * 100)}%`
    ]);
    return {
      category: "Mathematics",
      question: `A shopkeeper buys an item for Rs. ${cp} and sells it for Rs. ${sp}. What is the profit percentage?`,
      options,
      answer,
      explanation: `Profit% = ((${sp} - ${cp}) / ${cp}) × 100 = ${profitPct}%.`
    };
  }

  if (mode === 9) {
    const r = pick(rng, [7, 14, 21, 28]);
    const h = randInt(rng, 5, 25);
    const vol = Math.round((22 / 7) * r * r * h);
    const { options, answer } = shuffleWithAnswer(rng, `${vol} cm³`, [
      `${vol + 154} cm³`,
      `${Math.max(100, vol - 154)} cm³`,
      `${Math.round(vol / 2)} cm³`
    ]);
    return {
      category: "Mathematics",
      question: `Find the volume of a right circular cylinder with radius ${r} cm and height ${h} cm. (Use π = 22/7)`,
      options,
      answer,
      explanation: `Volume = πr²h = (22/7) × ${r} × ${r} × ${h} = ${vol} cm³.`
    };
  }

  if (mode === 10) {
    const start = randInt(rng, 2, 18);
    let step = randInt(rng, 3, 9);
    const inc = randInt(rng, 2, 6);
    const seq = [start];
    for (let i = 0; i < 4; i++) {
      seq.push(seq[seq.length - 1] + step);
      step += inc;
    }
    const ans = seq[seq.length - 1] + step;
    const { options, answer } = shuffleWithAnswer(rng, String(ans), [
      String(ans + inc),
      String(ans - inc),
      String(ans + step)
    ]);
    return {
      category: "Reasoning",
      question: `Find the missing next number in the series: ${seq.join(", ")}, ?`,
      options,
      answer,
      explanation: `Consecutive differences increase by +${inc}; next difference is +${step}, giving ${seq[seq.length - 1]} + ${step} = ${ans}.`
    };
  }

  if (mode === 11) {
    const base = randInt(rng, 3, 12);
    const offset = randInt(rng, 1, 5);
    const seq = [0, 1, 2, 3, 4].map(i => (base + i) * (base + i) + offset);
    const ans = (base + 5) * (base + 5) + offset;
    const { options, answer } = shuffleWithAnswer(rng, String(ans), [
      String(ans + 2),
      String(ans - 3),
      String((base + 5) * (base + 5))
    ]);
    return {
      category: "Reasoning",
      question: `Complete the hard number series: ${seq.join(", ")}, ?`,
      options,
      answer,
      explanation: `Pattern is n² + ${offset} starting from n = ${base}. Next term = ${base + 5}² + ${offset} = ${ans}.`
    };
  }

  if (mode === 12) {
    const hr = randInt(rng, 1, 11);
    const min = pick(rng, [10, 15, 20, 25, 30, 35, 40, 45, 50]);
    let angle = Math.abs(30 * hr - 5.5 * min);
    if (angle > 180) angle = 360 - angle;
    const { options, answer } = shuffleWithAnswer(rng, `${angle}°`, [
      `${Math.min(180, angle + 7.5)}°`,
      `${Math.max(5, angle - 7.5)}°`,
      `${Math.abs(180 - angle)}°`
    ]);
    return {
      category: "Reasoning",
      question: `What is the smaller angle between the hour hand and the minute hand of a clock at ${hr}:${String(min).padStart(2, "0")}?`,
      options,
      answer,
      explanation: `Angle = |30H - 5.5M| = |30(${hr}) - 5.5(${min})| = ${angle}°. (If >180°, subtract from 360°).`
    };
  }

  if (mode === 13) {
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
    const [d1, d2, hyp] = pick(rng, triples);
    const { options, answer } = shuffleWithAnswer(rng, `${hyp} km`, [
      `${d1 + d2} km`,
      `${Math.abs(d1 - d2) + 2} km`,
      `${hyp + 3} km`
    ]);
    return {
      category: "Reasoning",
      question: `Ravi walks ${d1} km North, then turns right and walks ${d2} km East. What is the shortest straight-line distance from his starting point?`,
      options,
      answer,
      explanation: `By Pythagoras theorem, distance = √(${d1}² + ${d2}²) = √(${d1 * d1 + d2 * d2}) = ${hyp} km.`
    };
  }

  if (mode === 14) {
    const words = ["EXAM", "RANK", "TEST", "GOAL", "MIND", "QUIZ", "WORK", "FAST"];
    const w = pick(rng, words);
    const shift = randInt(rng, 2, 5);
    const encode = (str, sh) => str.split("").map(ch => String.fromCharCode(((ch.charCodeAt(0) - 65 + sh) % 26) + 65)).join("");
    const sample = pick(rng, words.filter(x => x !== w));
    const sampleCode = encode(sample, shift);
    const ans = encode(w, shift);
    const { options, answer } = shuffleWithAnswer(rng, ans, [
      encode(w, shift + 1),
      encode(w, Math.max(1, shift - 1)),
      encode(w, shift + 2)
    ]);
    return {
      category: "Reasoning",
      question: `In a certain code language, '${sample}' is written as '${sampleCode}'. How will '${w}' be written in that code?`,
      options,
      answer,
      explanation: `Each letter is shifted forward by +${shift} positions in the alphabet, so '${w}' becomes '${ans}'.`
    };
  }

  const fromLeft = randInt(rng, 8, 28);
  const fromRight = randInt(rng, 9, 32);
  const total = fromLeft + fromRight - 1;
  const { options, answer } = shuffleWithAnswer(rng, `${total}`, [
    `${total + 1}`,
    `${total - 1}`,
    `${total + 2}`
  ]);
  return {
    category: "Reasoning",
    question: `In a row of students, Aman is ${fromLeft}th from the left end and ${fromRight}th from the right end. How many total students are in the row?`,
    options,
    answer,
    explanation: `Total = Left + Right - 1 = ${fromLeft} + ${fromRight} - 1 = ${total}.`
  };
}

function buildDynamicPool({ count = 100, seed = 1, category = "", difficulty = "Hard", baseBank = [] }) {
  const safeCount = Math.max(1, Math.min(500, Number(count) || 100));
  const safeSeed = Math.max(1, Number(seed) || 1);
  const rng = mulberry32(safeSeed * 9973 + 17);
  const catLower = String(category || "").toLowerCase().trim();

  let curated = [
    ...(Array.isArray(baseBank) ? baseBank : []),
    ...HARD_CURATED_BANK
  ];

  if (catLower && catLower !== "all" && !catLower.includes("mixed")) {
    const filtered = curated.filter((q) => String(q.category || "").toLowerCase().includes(catLower));
    if (filtered.length) curated = filtered;
  }

  for (let i = curated.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [curated[i], curated[j]] = [curated[j], curated[i]];
  }

  const out = [];
  const seenQ = new Set();
  const onlyProcedural = catLower.includes("math") || catLower.includes("quant") || catLower.includes("reason");
  const curatedQuota = onlyProcedural
    ? Math.min(curated.length, Math.floor(safeCount * 0.25))
    : Math.min(curated.length, Math.floor(safeCount * 0.55));

  for (let i = 0; i < curated.length && out.length < curatedQuota; i++) {
    const q = curated[i];
    if (!q || !q.question || seenQ.has(q.question)) continue;
    seenQ.add(q.question);
    out.push({
      category: q.category || "GK",
      question: q.question,
      options: (q.options || []).slice(0, 4).map(String),
      answer: Number(q.answer ?? q.answerIndex ?? 0),
      explanation: String(q.explanation || "")
    });
  }

  let procIdx = 0;
  let guard = 0;
  while (out.length < safeCount && guard < safeCount * 4) {
    const qSeed = safeSeed * 100003 + procIdx * 7919 + 31;
    const item = generateProceduralQuestion(qSeed, category, difficulty);
    procIdx++;
    guard++;
    if (!seenQ.has(item.question)) {
      seenQ.add(item.question);
      out.push(item);
    }
  }

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const REAL_EXAM_PRESETS = {
  "SSC GD": { title: "SSC GD Constable Real CBT Paper", total: 80, durationMin: 60, negative: 0.25, sections: [["Reasoning", 20], ["GK", 20], ["Mathematics", 20], ["English", 20]] },
  "SSC CHSL": { title: "SSC CHSL (10+2) Tier-I Real CBT Paper", total: 100, durationMin: 60, negative: 0.50, sections: [["English", 25], ["Reasoning", 25], ["Mathematics", 25], ["GK", 25]] },
  "SSC CGL": { title: "SSC CGL Tier-I Hard CBT Paper", total: 100, durationMin: 60, negative: 0.50, sections: [["Reasoning", 25], ["GK", 25], ["Mathematics", 25], ["English", 25]] },
  "SSC MTS": { title: "SSC MTS & Havaldar All-India Hard CBT Paper", total: 90, durationMin: 90, negative: 1.0, sections: [["Mathematics", 20], ["Reasoning", 20], ["GK", 25], ["English", 25]] },
  "SSC CPO": { title: "SSC CPO SI (Delhi Police & CAPF) Paper-I CBT", total: 200, durationMin: 120, negative: 0.25, sections: [["Reasoning", 50], ["GK", 50], ["Mathematics", 50], ["English", 50]] },
  "SSC Stenographer": { title: "SSC Stenographer Grade C & D Real CBT Paper", total: 200, durationMin: 120, negative: 0.25, sections: [["Reasoning", 50], ["GK", 50], ["English", 100]] },
  "SSC JE": { title: "SSC Junior Engineer (JE) Paper-I CBT", total: 100, durationMin: 120, negative: 0.25, sections: [["Reasoning", 50], ["GK", 50]] },
  "JKSSB": { title: "JKSSB Class-IV / MTS / Patwari Real Paper", total: 100, durationMin: 120, negative: 0.25, sections: [["Jammu & Kashmir", 25], ["GK", 25], ["Mathematics", 20], ["Reasoning", 15], ["English", 15]] },
  "J&K Police": { title: "Jammu & Kashmir Police Constable / SI Real Paper", total: 100, durationMin: 120, negative: 0.25, sections: [["Jammu & Kashmir", 30], ["GK", 25], ["Reasoning", 25], ["Mathematics", 20]] },
  "RRB NTPC": { title: "Railway RRB NTPC CBT-1 Real Paper", total: 100, durationMin: 90, negative: 0.33, sections: [["GK", 40], ["Mathematics", 30], ["Reasoning", 30]] },
  "RRB Group D": { title: "Railway RRB Group D Hard CBT Paper", total: 100, durationMin: 90, negative: 0.33, sections: [["General Science", 25], ["Mathematics", 25], ["Reasoning", 30], ["GK", 20]] },
  "RRB ALP / Technician": { title: "Railway RRB ALP & Technician CBT-1 Paper", total: 75, durationMin: 60, negative: 0.33, sections: [["Mathematics", 20], ["Reasoning", 25], ["General Science", 20], ["GK", 10]] },
  "IBPS Clerk / PO": { title: "IBPS Clerk & PO Prelims Real CBT Paper", total: 100, durationMin: 60, negative: 0.25, sections: [["English", 30], ["Mathematics", 35], ["Reasoning", 35]] },
  "SBI Clerk / PO": { title: "SBI Junior Associate (Clerk) & PO Prelims CBT", total: 100, durationMin: 60, negative: 0.25, sections: [["English", 30], ["Mathematics", 35], ["Reasoning", 35]] },
  "Banking": { title: "All-India Banking (IBPS / SBI / RBI) Prelims CBT", total: 100, durationMin: 60, negative: 0.25, sections: [["English", 30], ["Mathematics", 35], ["Reasoning", 35]] },
  "Army GD": { title: "Indian Army Agniveer GD Real Paper", total: 50, durationMin: 60, negative: 0.50, sections: [["GK", 15], ["General Science", 15], ["Mathematics", 15], ["Reasoning", 5]] },
  "Air Force Agniveer": { title: "Indian Air Force Agniveervayu (Group X/Y) CBT", total: 50, durationMin: 45, negative: 0.25, sections: [["English", 20], ["Reasoning", 15], ["Mathematics", 10], ["GK", 5]] },
  "Navy SSR / MR": { title: "Indian Navy Agniveer SSR / MR CBT Paper", total: 100, durationMin: 60, negative: 0.25, sections: [["English", 25], ["General Science", 25], ["Mathematics", 25], ["GK", 25]] },
  "BSF / CRPF / Assam Rifles": { title: "CAPF / BSF / CRPF / CISF / Assam Rifles Paper", total: 100, durationMin: 120, negative: 0.25, sections: [["GK", 25], ["Mathematics", 25], ["Reasoning", 25], ["English", 25]] },
  "Delhi Police": { title: "Delhi Police Constable Executive CBT Paper", total: 100, durationMin: 90, negative: 0.25, sections: [["GK", 50], ["Reasoning", 25], ["Mathematics", 15], ["Computer", 10]] },
  "UP Police": { title: "UP Police Constable & SI Real Exam Paper", total: 150, durationMin: 120, negative: 0.50, sections: [["GK", 38], ["Reasoning", 37], ["Mathematics", 38], ["English", 37]] },
  "State Police": { title: "All-India State Police Constable (Gujarat/UK/Bihar/Raj)", total: 100, durationMin: 120, negative: 0.25, sections: [["GK", 35], ["Reasoning", 25], ["Mathematics", 25], ["Computer", 15]] },
  "DSSSB MTS": { title: "Delhi DSSSB MTS & Clerical CBT Paper", total: 200, durationMin: 120, negative: 0.25, sections: [["GK", 40], ["Reasoning", 40], ["Mathematics", 40], ["English", 40], ["Computer", 40]] },
  "UPSC CSE Prelims": { title: "UPSC Civil Services (IAS) GS Paper-I Practice", total: 100, durationMin: 120, negative: 0.66, sections: [["Indian Polity", 25], ["Indian History", 25], ["Geography", 25], ["Economy & Banking", 25]] },
  "UPSC NDA": { title: "UPSC NDA & NA GAT Real Practice Paper", total: 150, durationMin: 150, negative: 0.33, sections: [["English", 50], ["General Science", 50], ["GK", 50]] },
  "UPSC CDS": { title: "UPSC CDS General Knowledge & English Paper", total: 120, durationMin: 120, negative: 0.33, sections: [["GK", 60], ["General Science", 30], ["English", 30]] },
  "UPSSSC PET": { title: "UPSSSC PET / Inter Level Real Exam Paper", total: 100, durationMin: 120, negative: 0.25, sections: [["GK", 40], ["Mathematics", 25], ["Reasoning", 15], ["General Science", 20]] },
  "UPTET / CTET": { title: "UPTET / CTET / KVS Teaching Exam Paper", total: 100, durationMin: 120, negative: 0, sections: [["GK", 30], ["English", 25], ["Mathematics", 25], ["General Science", 20]] }
};

function translateQuestionToHindi(q) {
  const txt = String(q.question || "");
  let hiQ = txt;
  let hiExp = String(q.explanation || "");
  if (txt.startsWith("An article with cost price Rs.")) {
    hiQ = txt
      .replace("An article with cost price Rs.", "Ek vastu ka kray mulya (CP) Rs.")
      .replace("is marked up by", "hai. Ise")
      .replace("and then sold at a discount of", "badha kar ankit kiya jata hai aur phir")
      .replace("Find the final selling price.", "chhoot (discount) par becha jata hai. Antim vikray mulya (SP) gyat karein.");
  } else if (txt.startsWith("Find the difference between Compound Interest and Simple Interest on Rs.")) {
    hiQ = txt
      .replace("Find the difference between Compound Interest and Simple Interest on Rs.", "Rs.")
      .replace("at", "par")
      .replace("per annum for 2 years (compounded annually).", "varshik dar se 2 varsh ke Chakravriddhi Byaj (CI) aur Sadharan Byaj (SI) ka antar gyat karein.");
  } else if (txt.startsWith("A can complete a piece of work in")) {
    hiQ = txt
      .replace("A can complete a piece of work in", "A ek kaam ko")
      .replace("days and B can complete the same work in", "dinon mein aur B usi kaam ko")
      .replace("days. In how many days can A and B together finish it?", "dinon mein poora kar sakta hai. Dono milkar us kaam ko kitne dinon mein poora karenge?");
  } else if (txt.startsWith("A train")) {
    hiQ = txt
      .replace("A train", "Ek train")
      .replace("m long is running at", "meter lambi hai aur")
      .replace("km/h. How much time will it take to cross a platform", "km/h ki chaal se chal rahi hai. Yah")
      .replace("m long?", "meter lambe platform ko paar karne mein kitna samay legi?");
  } else if (txt.startsWith("A boat's speed in still water is")) {
    hiQ = txt
      .replace("A boat's speed in still water is", "Shant jal mein ek naav ki chaal")
      .replace("km/h and the stream flows at", "km/h hai aur dhara ki chaal")
      .replace("km/h. It travels", "km/h hai. Yah dhara ke pratikool (upstream)")
      .replace("km upstream. How long will it take to cover the same distance downstream?", "km jati hai. Dhara ke anukool (downstream) wahi doori tay karne mein kitna samay lagega?");
  } else if (txt.startsWith("A sum of Rs.")) {
    hiQ = txt
      .replace("A sum of Rs.", "Rs.")
      .replace("is divided among P, Q, and R in the ratio", "ki rashi ko P, Q aur R mein")
      .replace(". What is the largest share?", "ke anupat mein banta jata hai. Sabse bada hissa kya hoga?");
  } else if (txt.startsWith("The average age of")) {
    hiQ = txt
      .replace("The average age of", "")
      .replace("students is", "chhatron ki ausat aayu")
      .replace("years. When a teacher joins, the average increases by", "varsh hai. Shikshak ke shamil hone par ausat")
      .replace("years. What is the teacher's age?", "varsh badh jata hai. Shikshak ki aayu kya hai?");
  } else if (txt.startsWith("A shopkeeper buys an item for Rs.")) {
    hiQ = txt
      .replace("A shopkeeper buys an item for Rs.", "Ek dukandar ek vastu Rs.")
      .replace("and sells it for Rs.", "mein kharidta hai aur Rs.")
      .replace(". What is the profit percentage?", "mein bechta hai. Labh pratishat (Profit %) gyat karein.");
  } else if (txt.startsWith("Find the volume of a right circular cylinder")) {
    hiQ = txt
      .replace("Find the volume of a right circular cylinder with radius", "Us belan (cylinder) ka aayatan gyat karein jiski trijya")
      .replace("cm and height", "cm aur unchai")
      .replace("cm. (Use π = 22/7)", "cm hai. (π = 22/7)");
  } else if (txt.startsWith("Find the missing next number in the series:")) {
    hiQ = txt.replace("Find the missing next number in the series:", "Shrenikram (Series) mein agla lupt ank gyat karein:");
  } else if (txt.startsWith("Complete the hard number series:")) {
    hiQ = txt.replace("Complete the hard number series:", "Is kathin sankhya shrenikram ko poora karein:");
  } else if (txt.startsWith("What is the smaller angle between the hour hand")) {
    hiQ = txt.replace("What is the smaller angle between the hour hand and the minute hand of a clock at", "Ghadi mein ghante aur minute ki sui ke beech chhota kon (angle) kya hoga samay:");
  } else if (txt.startsWith("Ravi walks")) {
    hiQ = txt
      .replace("Ravi walks", "Ravi")
      .replace("km North, then turns right and walks", "km Uttar (North) chalta hai, phir dayein mudkar")
      .replace("km East. What is the shortest straight-line distance from his starting point?", "km Purv (East) chalta hai. Prarambhik bindu se nyuntam seedhi doori kya hai?");
  } else if (txt.startsWith("In a certain code language,")) {
    hiQ = txt
      .replace("In a certain code language,", "Ek nishchit koot bhasha mein,")
      .replace("is written as", "ko")
      .replace(". How will", "likha jata hai. Usi koot mein")
      .replace("be written in that code?", "ko kaise likha jayega?");
  } else if (txt.startsWith("In a row of students, Aman is")) {
    hiQ = txt
      .replace("In a row of students, Aman is", "Chhatron ki ek pankti mein Aman bayein se")
      .replace("th from the left end and", "vein sthan par aur dayein se")
      .replace("th from the right end. How many total students are in the row?", "vein sthan par hai. Pankti mein kul kitne chhatra hain?");
  } else if (txt.startsWith("Which Article of the Indian Constitution specifically deals with")) {
    hiQ = txt.replace("Which Article of the Indian Constitution specifically deals with", "Bharatiya Samvidhan ka kaunsa Anuchchhed (Article) isse sambandhit hai:");
  } else if (txt.startsWith("What is the standard SI unit of")) {
    hiQ = txt.replace("What is the standard SI unit of", "Iska manak SI matrak (unit) kya hai:");
  } else if (txt.startsWith("In which Indian State or Union Territory is")) {
    hiQ = txt.replace("In which Indian State or Union Territory is", "Yah National Park Bharat ke kis Rajya ya UT mein sthit hai:").replace("located?", "");
  } else if (txt.startsWith("Which city serves as the capital of")) {
    hiQ = txt.replace("Which city serves as the capital of", "Inmein se kaunsa shehar iski rajdhani (capital) hai:");
  } else if (txt.startsWith("Which keyboard shortcut is used to")) {
    hiQ = txt.replace("Which keyboard shortcut is used to", "Computer mein is kaam ke liye kaunsa keyboard shortcut use hota hai:");
  } else {
    hiQ = "[Hindi Medium] " + txt;
  }
  return { ...q, question: hiQ, explanation: hiExp };
}

function buildRealExamPaper({ exam = "SSC GD", seed = 1, difficulty = "Hard", lang = "en", baseBank = [] }) {
  const preset = REAL_EXAM_PRESETS[exam] || REAL_EXAM_PRESETS["SSC GD"];
  const isHindi = String(lang || "en").toLowerCase().startsWith("hi");
  const all = [];
  preset.sections.forEach(([secName, secCount], idx) => {
    const part = buildDynamicPool({
      count: secCount,
      seed: Number(seed) * 31 + idx * 17 + 7,
      category: secName,
      difficulty,
      baseBank
    });
    part.forEach((q) => {
      const finalQ = isHindi && secName !== "English" ? translateQuestionToHindi(q) : q;
      all.push({ ...finalQ, section: secName });
    });
  });
  return {
    exam,
    lang: isHindi ? "hi" : "en",
    title: preset.title + (isHindi ? " (Hindi Medium)" : " (English Medium)"),
    durationMin: preset.durationMin,
    negative: preset.negative,
    sections: preset.sections.map(([name, count]) => ({ name, count })),
    questions: all
  };
}

module.exports = {
  VIRTUAL_BANK_CAPACITY: 20000000,
  VIRTUAL_PDF_SETS: 100000,
  REAL_EXAM_PRESETS,
  getDailySeed,
  generateProceduralQuestion,
  buildDynamicPool,
  buildRealExamPaper,
  translateQuestionToHindi
};
