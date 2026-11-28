"use strict";

// ============================================================================
// SARKARI JOB UNIVERSE v1.0 — UNLIMITED PRACTICE QUESTIONS & SMART MOCK TEST ENGINE
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
  { category: "English", question: "Choose the antonym of 'EPHEMERAL'.", options: ["Transient", "Fleeting", "Perpetual", "Fragile"], answer: 2, explanation: "Ephemeral means short-lived; its antonym is Perpetual (everlasting)." },
  {"category": "Indian Polity", "question": "Which Constitutional Amendment Act reduced the voting age from 21 years to 18 years in India?", "options": ["42nd Amendment", "44th Amendment", "61st Amendment", "73rd Amendment"], "answer": 2, "explanation": "The 61st Constitutional Amendment Act (1988) amended Article 326 to lower the voting age from 21 to 18."},
  {"category": "Indian Polity", "question": "The Tenth Schedule of the Indian Constitution, dealing with Anti-Defection Law, was added by which Amendment?", "options": ["52nd Amendment (1985)", "42nd Amendment (1976)", "86th Amendment (2002)", "91st Amendment (2003)"], "answer": 0, "explanation": "The 52nd Amendment Act of 1985 inserted the Tenth Schedule containing provisions on disqualification for defection."},
  {"category": "Indian Polity", "question": "Under which Article can the President of India promulgate an Ordinance when Parliament is not in session?", "options": ["Article 72", "Article 110", "Article 123", "Article 213"], "answer": 2, "explanation": "Article 123 empowers the President to promulgate ordinances; Article 213 gives the same power to a State Governor."},
  {"category": "Indian Polity", "question": "Who presides over a Joint Sitting of both Houses of Parliament under Article 108?", "options": ["President of India", "Vice-President of India", "Speaker of Lok Sabha", "Prime Minister"], "answer": 2, "explanation": "The President summons a joint sitting under Article 108, and the Speaker of Lok Sabha presides over it (Article 118)."},
  {"category": "Indian Polity", "question": "Which Writ literally means 'to have the body of' and protects against illegal detention?", "options": ["Mandamus", "Habeas Corpus", "Certiorari", "Quo Warranto"], "answer": 1, "explanation": "Habeas Corpus is issued by courts to produce a detained person and test the legality of detention."},
  {"category": "Indian Polity", "question": "The concept of 'Directive Principles of State Policy' (DPSP) in the Indian Constitution was borrowed from:", "options": ["USA", "Ireland", "Canada", "Australia"], "answer": 1, "explanation": "Part IV (Articles 36-51) DPSPs were borrowed from the Irish Constitution."},
  {"category": "Indian Polity", "question": "Which Constitutional body is established under Article 280 of the Constitution of India?", "options": ["Election Commission", "Finance Commission", "UPSC", "Comptroller and Auditor General"], "answer": 1, "explanation": "Article 280 provides for the Finance Commission constituted by the President every five years."},
  {"category": "Indian Polity", "question": "Which Amendment Act gave constitutional status to Panchayati Raj Institutions by adding Part IX and the 11th Schedule?", "options": ["71st Amendment", "73rd Amendment", "74th Amendment", "84th Amendment"], "answer": 1, "explanation": "The 73rd Constitutional Amendment Act (1992) added Part IX and the 11th Schedule (29 functional items)."},
  {"category": "Indian Polity", "question": "Which Article guarantees the Right to Constitutional Remedies, called the 'Heart and Soul of the Constitution' by Dr. B. R. Ambedkar?", "options": ["Article 14", "Article 19", "Article 21A", "Article 32"], "answer": 3, "explanation": "Article 32 empowers citizens to move the Supreme Court directly for enforcement of Fundamental Rights."},
  {"category": "Indian Polity", "question": "The Money Bill is exclusively defined under which Article of the Indian Constitution?", "options": ["Article 108", "Article 110", "Article 112", "Article 117"], "answer": 1, "explanation": "Article 110 defines a Money Bill, and the Speaker of the Lok Sabha certifies whether a bill is a Money Bill."},
  {"category": "History", "question": "Who founded the 'Forward Bloc' in 1939 after resigning from the Presidentship of the Indian National Congress?", "options": ["Bhagat Singh", "Subhas Chandra Bose", "C. R. Das", "Lala Lajpat Rai"], "answer": 1, "explanation": "Netaji Subhas Chandra Bose formed the All India Forward Bloc in May 1939."},
  {"category": "History", "question": "The Permanent Settlement (Zamindari System) in Bengal, Bihar and Orissa was introduced in 1793 by:", "options": ["Lord Warren Hastings", "Lord Cornwallis", "Lord Wellesley", "Lord Dalhousie"], "answer": 1, "explanation": "Lord Cornwallis introduced the Permanent Settlement of Bengal in 1793."},
  {"category": "History", "question": "Which Governor-General introduced the 'Doctrine of Lapse'?", "options": ["Lord Canning", "Lord Curzon", "Lord Dalhousie", "Lord Ripon"], "answer": 2, "explanation": "Lord Dalhousie (1848-1856) used the Doctrine of Lapse to annex Satara, Jhansi, Nagpur, etc."},
  {"category": "History", "question": "In which session of the Indian National Congress was the resolution of 'Purna Swaraj' (Complete Independence) passed in December 1929?", "options": ["Calcutta Session", "Lahore Session", "Karachi Session", "Lucknow Session"], "answer": 1, "explanation": "The Lahore Session (1929), presided over by Jawaharlal Nehru, adopted Purna Swaraj."},
  {"category": "History", "question": "The Battle of Buxar (1764) was fought between the British East India Company (led by Hector Munro) and the combined forces of:", "options": ["Siraj-ud-Daulah, Mir Jafar & Shuja-ud-Daulah", "Mir Qasim, Shuja-ud-Daulah & Shah Alam II", "Tipu Sultan, Nizam & Marathas", "Hyder Ali, Mir Qasim & Bahadur Shah"], "answer": 1, "explanation": "Mir Qasim (Bengal), Shuja-ud-Daulah (Awadh) and Mughal Emperor Shah Alam II were defeated at Buxar in 1764."},
  {"category": "History", "question": "Who authored 'Gulamgiri' (1873) and founded the Satyashodhak Samaj in Maharashtra?", "options": ["B. R. Ambedkar", "Jyotirao Phule", "Gopal Hari Deshmukh", "E. V. Ramasamy"], "answer": 1, "explanation": "Mahatma Jyotirao Phule wrote Gulamgiri and established Satyashodhak Samaj in 1873."},
  {"category": "History", "question": "Which Indus Valley Civilization site is famous for its ancient tidal dockyard?", "options": ["Harappa", "Mohenjo-daro", "Lothal", "Kalibangan"], "answer": 2, "explanation": "Lothal in Gujarat had a well-engineered brick dockyard connected to the Sabarmati/Bhogavo river."},
  {"category": "History", "question": "The 'Poona Pact' of September 1932 was signed between Mahatma Gandhi and:", "options": ["Muhammad Ali Jinnah", "Dr. B. R. Ambedkar", "Lord Irwin", "Sardar Vallabhbhai Patel"], "answer": 1, "explanation": "The Poona Pact (1932) between Gandhi and Dr. B. R. Ambedkar replaced separate electorates with reserved seats for depressed classes."},
  {"category": "Jammu & Kashmir GK", "question": "Under which section of the Jammu & Kashmir Reorganisation Act, 2019 was the UT of Jammu & Kashmir constituted with a Legislature?", "options": ["Section 3", "Section 4", "Section 5", "Section 14"], "answer": 1, "explanation": "Section 3 formed the UT of Ladakh (without legislature) and Section 4 formed the UT of Jammu & Kashmir (with legislature)."},
  {"category": "Jammu & Kashmir GK", "question": "The world's highest railway arch bridge—the Chenab Rail Bridge—is located in which district of Jammu & Kashmir?", "options": ["Ramban", "Reasi", "Doda", "Kishtwar"], "answer": 1, "explanation": "The Chenab Rail Bridge (359 m above river bed) connects Bakkal and Kauri in Reasi district of J&K."},
  {"category": "Jammu & Kashmir GK", "question": "Who authored the famous Sanskrit chronicle of Kashmir's kings, 'Rajatarangini', in the 12th century?", "options": ["Bilhana", "Kalhana", "Jonaraja", "Abhinavagupta"], "answer": 1, "explanation": "Kalhana composed Rajatarangini around 1148-1150 CE during the reign of King Jayasimha."},
  {"category": "Jammu & Kashmir GK", "question": "Which Mughal Emperor built the famous Shalimar Bagh in Srinagar in 1619?", "options": ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"], "answer": 1, "explanation": "Emperor Jahangir built Shalimar Bagh on the banks of Dal Lake for his wife Nur Jahan in 1619."},
  {"category": "Jammu & Kashmir GK", "question": "The Treaty of Amritsar (16 March 1846), which established Dogra rule over Jammu & Kashmir, was signed between the British and:", "options": ["Maharaja Ranbir Singh", "Maharaja Gulab Singh", "Maharaja Pratap Singh", "Maharaja Hari Singh"], "answer": 1, "explanation": "Maharaja Gulab Singh signed the Treaty of Amritsar with the East India Company in 1846."},
  {"category": "Jammu & Kashmir GK", "question": "Which National Park in Jammu & Kashmir is the primary habitat of the critically endangered Hangul (Kashmir Stag)?", "options": ["Kishtwar National Park", "Dachigam National Park", "Salim Ali National Park", "Kazinag National Park"], "answer": 1, "explanation": "Dachigam National Park near Srinagar is famous for conserving the Hangul (Kashmir Stag)."},
  {"category": "Jammu & Kashmir GK", "question": "The Salal Hydroelectric Power Project and Dul Hasti Power Project are constructed on which river?", "options": ["Jhelum", "Chenab", "Ravi", "Tawi"], "answer": 1, "explanation": "Salal (Reasi), Baglihar (Ramban), and Dul Hasti (Kishtwar) are all major hydroelectric projects on the Chenab River."},
  {"category": "Jammu & Kashmir GK", "question": "Which pass connects the Kashmir Valley with the Jammu region via the Banihal-Qazigund road/rail corridor?", "options": ["Zoji La", "Banihal Pass (Pir Panjal Range)", "Khardung La", "Fotula Pass"], "answer": 1, "explanation": "Banihal Pass across the Pir Panjal Range connects Jammu with Srinagar (Jawahar Tunnel & Navyug Tunnel)."},
  {"category": "Jammu & Kashmir GK", "question": "Who built the historic Martand Sun Temple in Anantnag district of Kashmir during the 8th century CE?", "options": ["Avantivarman", "Lalitaditya Muktapida", "Zain-ul-Abidin", "Durlabhavardhana"], "answer": 1, "explanation": "King Lalitaditya Muktapida of the Karkota dynasty constructed the Martand Sun Temple."},
  {"category": "Jammu & Kashmir GK", "question": "Which ruler of Kashmir is popularly known as 'Budshah' (The Great King) for his religious tolerance and patronage of arts?", "options": ["Sultan Sikandar", "Sultan Zain-ul-Abidin", "Yusuf Shah Chak", "Shah Mir"], "answer": 1, "explanation": "Sultan Zain-ul-Abidin (1420-1470) is revered as Budshah and often called the 'Akbar of Kashmir'."},
  {"category": "Jammu & Kashmir GK", "question": "Wular Lake, one of Asia's largest freshwater lakes, is located in which district of Jammu & Kashmir?", "options": ["Baramulla", "Bandipora", "Pulwama", "Ganderbal"], "answer": 1, "explanation": "Wular Lake lies in Bandipora district and is fed by the Jhelum River."},
  {"category": "Jammu & Kashmir GK", "question": "In which district of Jammu division is the famous Shahdara Sharief shrine located?", "options": ["Poonch", "Rajouri", "Udhampur", "Kathua"], "answer": 1, "explanation": "The shrine of Baba Ghulam Shah Badshah at Shahdara Sharief is located in Rajouri district of J&K."},
  {"category": "Geography", "question": "Which river originates from the Amarkantak Plateau and flows westward into the Arabian Sea through a rift valley?", "options": ["Godavari", "Narmada", "Mahanadi", "Kaveri"], "answer": 1, "explanation": "The Narmada originates at Amarkantak (Madhya Pradesh) and flows west through a rift valley between Vindhya and Satpura ranges."},
  {"category": "Geography", "question": "Which mountain pass connects Srinagar with Leh (Ladakh)?", "options": ["Rohtang Pass", "Zoji La", "Nathu La", "Lipulekh Pass"], "answer": 1, "explanation": "Zoji La in the Himalayas connects the Kashmir Valley (Sonamarg) with Drass and Leh in Ladakh."},
  {"category": "Geography", "question": "The Tropic of Cancer (23.5 deg N) passes through how many Indian states?", "options": ["6 states", "7 states", "8 states", "9 states"], "answer": 2, "explanation": "Tropic of Cancer passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram."},
  {"category": "Geography", "question": "Which soil type in India is also known as 'Regur Soil' and is ideal for cotton cultivation?", "options": ["Alluvial Soil", "Black Soil", "Laterite Soil", "Red Soil"], "answer": 1, "explanation": "Black soil (Regur) retains moisture well and is widely found in the Deccan Trap for cotton farming."},
  {"category": "Economy", "question": "Which rate is the interest rate at which the Reserve Bank of India (RBI) lends short-term funds to commercial banks against government securities?", "options": ["Reverse Repo Rate", "Repo Rate", "Cash Reserve Ratio (CRR)", "Statutory Liquidity Ratio (SLR)"], "answer": 1, "explanation": "Repo Rate is the repurchase rate at which commercial banks borrow short-term liquidity from the RBI."},
  {"category": "Economy", "question": "Goods and Services Tax (GST) in India was implemented from 1 July 2017 via which Constitutional Amendment Act?", "options": ["99th Amendment", "100th Amendment", "101st Amendment", "102nd Amendment"], "answer": 2, "explanation": "The 101st Constitutional Amendment Act (2016) introduced GST and established the GST Council under Article 279A."},
  {"category": "Economy", "question": "The Monetary Policy Committee (MPC) of India has how many members in total?", "options": ["4 members", "5 members", "6 members", "8 members"], "answer": 2, "explanation": "MPC has 6 members—3 from RBI (including the Governor as Chairperson) and 3 appointed by the Central Government."},
  {"category": "Science", "question": "Which vitamin is water-soluble and its deficiency causes scurvy (bleeding gums)?", "options": ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], "answer": 1, "explanation": "Vitamin C (Ascorbic Acid) and Vitamin B-complex are water-soluble; deficiency of Vitamin C causes scurvy."},
  {"category": "Science", "question": "Which organelle is known as the 'Powerhouse of the Cell' because it synthesizes ATP?", "options": ["Ribosome", "Golgi Apparatus", "Mitochondria", "Lysosome"], "answer": 2, "explanation": "Mitochondria perform cellular respiration and generate energy in the form of ATP."},
  {"category": "Science", "question": "What is the chemical name and formula of Baking Soda?", "options": ["Sodium Carbonate (Na2CO3)", "Sodium Bicarbonate (NaHCO3)", "Calcium Hypochlorite (CaOCl2)", "Sodium Hydroxide (NaOH)"], "answer": 1, "explanation": "Baking soda is Sodium Hydrogen Carbonate / Sodium Bicarbonate (NaHCO3)."},
  {"category": "Science", "question": "The phenomenon responsible for the blue colour of the sky and reddish appearance of the sun at sunrise/sunset is:", "options": ["Total Internal Reflection", "Scattering of Light (Rayleigh Scattering)", "Dispersion", "Diffraction"], "answer": 1, "explanation": "Shorter blue wavelengths scatter more strongly in Earth's atmosphere (Rayleigh scattering)."},
  {"category": "Science", "question": "Which blood group is known as the 'Universal Donor' (RBCs) because it lacks A and B antigens?", "options": ["AB Positive", "O Negative", "O Positive", "A Negative"], "answer": 1, "explanation": "O Negative red blood cells lack A, B, and Rh antigens, making it the universal RBC donor."},
  {"category": "Science", "question": "Which acid is naturally present in ant stings and nettle leaves?", "options": ["Citric Acid", "Acetic Acid", "Methanoic (Formic) Acid", "Oxalic Acid"], "answer": 2, "explanation": "Methanoic acid (HCOOH), commonly called formic acid, causes the burning sensation in ant stings."},
  {"category": "Science", "question": "An object weighs 60 N on Earth. What will be its approximate weight on the Moon?", "options": ["60 N", "30 N", "10 N", "6 N"], "answer": 2, "explanation": "Moon's gravity is 1/6th of Earth's, so Weight on Moon = 60 / 6 = 10 N (while mass remains unchanged)."},
  {"category": "Science", "question": "Which gas is primarily responsible for the depletion of the stratospheric Ozone Layer?", "options": ["Carbon Monoxide", "Chlorofluorocarbons (CFCs)", "Methane", "Hydrogen Sulphide"], "answer": 1, "explanation": "CFCs release chlorine radicals in the stratosphere that break down ozone (O3) molecules."},
  {"category": "Science", "question": "What is the normal pH range of human arterial blood?", "options": ["6.2 to 6.5", "7.0 exactly", "7.35 to 7.45", "8.1 to 8.4"], "answer": 2, "explanation": "Human blood is slightly alkaline with a tightly regulated pH of 7.35 to 7.45."},
  {"category": "Computer", "question": "Which protocol is used for secure encrypted communication over the web (HTTPS) on default port 443?", "options": ["FTP", "TLS / SSL", "SMTP", "Telnet"], "answer": 1, "explanation": "HTTPS uses TLS (Transport Layer Security) / SSL encryption over TCP port 443."},
  {"category": "Computer", "question": "In the OSI model, which layer is responsible for logical addressing (IP addresses) and routing of packets?", "options": ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"], "answer": 1, "explanation": "Layer 3 (Network Layer) handles IP addressing and packet routing across networks."},
  {"category": "Computer", "question": "Which type of memory is fastest and sits directly between the CPU and main RAM?", "options": ["Hard Disk", "SRAM Cache Memory", "ROM", "Flash Memory"], "answer": 1, "explanation": "CPU Cache memory (L1/L2/L3 built with SRAM) is faster than main DRAM."},
  {"category": "Computer", "question": "In MS Excel, which function returns the current system date and time dynamically?", "options": ["=DATE()", "=TODAY()", "=NOW()", "=TIME()"], "answer": 2, "explanation": "=NOW() returns both current date and time, whereas =TODAY() returns only the current date."},
  {"category": "Computer", "question": "What is the full form of 'BIOS' in a computer system?", "options": ["Binary Integrated Operating System", "Basic Input Output System", "Base Internal OS Software", "Buffered Input Output Service"], "answer": 1, "explanation": "BIOS stands for Basic Input Output System, firmware that initializes hardware during booting."},
  {"category": "Computer", "question": "Which keyboard shortcut permanently deletes a selected file in Windows without sending it to the Recycle Bin?", "options": ["Ctrl + Delete", "Alt + Delete", "Shift + Delete", "Ctrl + Shift + D"], "answer": 2, "explanation": "Shift + Delete bypasses the Recycle Bin and permanently removes the file."},
  {"category": "Computer", "question": "1 Terabyte (TB) in binary system is equal to how many Gigabytes (GB)?", "options": ["100 GB", "512 GB", "1024 GB", "2048 GB"], "answer": 2, "explanation": "In binary storage hierarchy, 1 TB = 1024 GB (2^10 GB)."},
  {"category": "Computer", "question": "Which of the following is an example of Non-Volatile Memory?", "options": ["DRAM", "SRAM", "ROM / SSD", "CPU Register"], "answer": 2, "explanation": "ROM and SSD retain stored data even after power is turned off (non-volatile)."},
  {"category": "English", "question": "Choose the correct meaning of the idiom: 'To burn the midnight oil'.", "options": ["To waste fuel unnecessarily", "To work or study late into the night", "To start a quarrel", "To destroy old records"], "answer": 1, "explanation": "'Burn the midnight oil' means working or studying diligently late at night."},
  {"category": "English", "question": "Identify the segment with a grammatical error: 'Neither the manager nor the employees was present at the meeting.'", "options": ["Neither the manager", "nor the employees", "was present", "at the meeting"], "answer": 2, "explanation": "With 'neither...nor', the verb agrees with the nearer subject ('employees' is plural), so it should be 'were present'."},
  {"category": "English", "question": "Choose the synonym of 'UBIQUITOUS'.", "options": ["Rare", "Omnipresent", "Hidden", "Ancient"], "answer": 1, "explanation": "Ubiquitous means present or found everywhere (Omnipresent)."},
  {"category": "English", "question": "Choose the antonym of 'MITIGATE'.", "options": ["Alleviate", "Reduce", "Aggravate", "Soften"], "answer": 2, "explanation": "Mitigate means to make less severe; its antonym is Aggravate (make worse)."},
  {"category": "English", "question": "One-word substitution: 'A person who speaks many languages fluently'.", "options": ["Philanthropist", "Polyglot", "Bibliophile", "Stoic"], "answer": 1, "explanation": "A Polyglot is someone who knows and uses several languages."},
  {"category": "English", "question": "Fill in the blank: 'Scarcely had the train arrived at the station ____ the passengers rushed in.'", "options": ["than", "when", "then", "while"], "answer": 1, "explanation": "'Scarcely / Hardly' is always followed by 'when' (whereas 'No sooner' is followed by 'than')."},
  {"category": "English", "question": "Choose the correctly spelled word:", "options": ["Bureacracy", "Bureaucracy", "Bureucracy", "Bueraucracy"], "answer": 1, "explanation": "The correct spelling is 'Bureaucracy' (b-u-r-e-a-u-c-r-a-c-y)."},
  {"category": "English", "question": "Choose the correct passive voice: 'Who taught you French?'", "options": ["By whom were you taught French?", "By whom was you taught French?", "Who was taught French by you?", "By whom are you taught French?"], "answer": 0, "explanation": "Past simple active 'Who taught you...' converts to 'By whom were you taught...'."},
  {"category": "English", "question": "Choose the meaning of the idiom: 'A bolt from the blue'.", "options": ["A pleasant surprise", "A sudden and unexpected shock/event", "A bright sunny day", "A planned victory"], "answer": 1, "explanation": "'A bolt from the blue' refers to a completely unexpected, shocking event."},
  {"category": "English", "question": "Fill in the blank: 'He is senior ____ me by three years in the department.'", "options": ["than", "from", "to", "over"], "answer": 2, "explanation": "Latin comparatives like senior, junior, superior, inferior, prior always take the preposition 'to'."}
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
  const mathModes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 21, 22, 23];
  const reasonModes = [10, 11, 12, 13, 14, 15, 24, 25];
  const allModes = [...mathModes, ...reasonModes, 16, 17, 18];
  const mode = isReason
    ? reasonModes[randInt(rng, 0, reasonModes.length - 1)]
    : isMath
      ? mathModes[randInt(rng, 0, mathModes.length - 1)]
      : allModes[randInt(rng, 0, allModes.length - 1)];

  if (mode >= 16 && mode <= 18) return generateKnowledgeProcedural(rng, "");

  if (mode === 20) {
    // Boats & Streams (Downstream / Upstream)
    const boat = randInt(rng, 10, 24);
    const stream = randInt(rng, 2, 6);
    const hrs = randInt(rng, 2, 6);
    const isDown = rng() < 0.5;
    const effSpeed = isDown ? boat + stream : boat - stream;
    const dist = effSpeed * hrs;
    const dirLabel = isDown ? "downstream" : "upstream";
    const { options, answer } = shuffleWithAnswer(rng, `${dist} km`, [
      `${(isDown ? boat - stream : boat + stream) * hrs} km`,
      `${boat * hrs} km`,
      `${dist + hrs * 2} km`
    ]);
    return {
      category: "Mathematics",
      question: `A boat's speed in still water is ${boat} km/h and the speed of the stream is ${stream} km/h. What distance will it cover ${dirLabel} in ${hrs} hours?`,
      options,
      answer,
      explanation: `Effective ${dirLabel} speed = ${boat} ${isDown ? "+" : "-"} ${stream} = ${effSpeed} km/h. Distance = ${effSpeed} x ${hrs} = ${dist} km.`
    };
  }

  if (mode === 21) {
    // 2-Year Compound Interest
    const p = randInt(rng, 2, 25) * 1000;
    const r = [5, 10, 15, 20][randInt(rng, 0, 3)];
    const amount = Math.round(p * Math.pow(1 + r / 100, 2));
    const ci = amount - p;
    const si = Math.round((p * r * 2) / 100);
    const { options, answer } = shuffleWithAnswer(rng, `Rs. ${ci}`, [
      `Rs. ${si}`,
      `Rs. ${ci + Math.round(p * 0.01)}`,
      `Rs. ${Math.max(100, ci - Math.round(p * 0.02))}`
    ]);
    return {
      category: "Mathematics",
      question: `Find the Compound Interest on Rs. ${p} at ${r}% per annum for 2 years compounded annually.`,
      options,
      answer,
      explanation: `Amount = ${p} x (1 + ${r}/100)^2 = Rs. ${amount}. CI = ${amount} - ${p} = Rs. ${ci}.`
    };
  }

  if (mode === 22) {
    // Train Crossing a Platform
    const speedKmh = [36, 54, 72, 90, 108][randInt(rng, 0, 4)];
    const speedMs = speedKmh * 5 / 18;
    const trainLen = randInt(rng, 12, 30) * 10;
    const platLen = randInt(rng, 15, 35) * 10;
    const timeSec = Math.round(((trainLen + platLen) / speedMs) * 10) / 10;
    const { options, answer } = shuffleWithAnswer(rng, `${timeSec} sec`, [
      `${Math.round((trainLen / speedMs) * 10) / 10} sec`,
      `${Math.round((timeSec + 4) * 10) / 10} sec`,
      `${Math.max(2, Math.round((timeSec - 3) * 10) / 10)} sec`
    ]);
    return {
      category: "Mathematics",
      question: `A train of length ${trainLen} m is running at ${speedKmh} km/h. How much time will it take to cross a platform of length ${platLen} m?`,
      options,
      answer,
      explanation: `Speed = ${speedKmh} x 5/18 = ${speedMs} m/s. Total distance = ${trainLen} + ${platLen} = ${trainLen + platLen} m. Time = ${trainLen + platLen} / ${speedMs} = ${timeSec} sec.`
    };
  }

  if (mode === 23) {
    // Pipes & Cisterns (Two inlet pipes)
    const pairs = [[12, 24, 8], [15, 30, 10], [20, 30, 12], [10, 15, 6], [12, 36, 9], [18, 36, 12], [24, 48, 16], [30, 60, 20]];
    const [a, b, ans] = pairs[randInt(rng, 0, pairs.length - 1)];
    const { options, answer } = shuffleWithAnswer(rng, `${ans} hours`, [
      `${ans + 2} hours`,
      `${Math.max(2, ans - 2)} hours`,
      `${Math.round((a + b) / 2)} hours`
    ]);
    return {
      category: "Mathematics",
      question: `Pipe A can fill a tank in ${a} hours and Pipe B can fill it in ${b} hours. If both pipes are opened together, in how many hours will the tank be completely filled?`,
      options,
      answer,
      explanation: `Combined rate = 1/${a} + 1/${b} = (${a + b})/${a * b}. Time = (${a} x ${b}) / (${a} + ${b}) = ${ans} hours.`
    };
  }

  if (mode === 24) {
    // Direction Sense (Pythagorean Triples)
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]];
    const [x, y, hyp] = triples[randInt(rng, 0, triples.length - 1)];
    const { options, answer } = shuffleWithAnswer(rng, `${hyp} km`, [
      `${x + y} km`,
      `${Math.abs(y - x)} km`,
      `${hyp + 2} km`
    ]);
    return {
      category: "Reasoning",
      question: `Ravi walks ${x} km North, then turns right and walks ${y} km East. What is the shortest straight-line distance from his starting point?`,
      options,
      answer,
      explanation: `By Pythagoras theorem: Shortest distance = sqrt(${x}^2 + ${y}^2) = sqrt(${x * x + y * y}) = ${hyp} km.`
    };
  }

  if (mode === 25) {
    // Number Analogy (n : n^2 + n)
    const n1 = randInt(rng, 4, 14);
    let n2 = randInt(rng, 5, 18);
    if (n2 === n1) n2 += 2;
    const v1 = n1 * n1 + n1;
    const v2 = n2 * n2 + n2;
    const { options, answer } = shuffleWithAnswer(rng, `${v2}`, [
      `${n2 * n2}`,
      `${n2 * n2 - n2}`,
      `${v2 + n2}`
    ]);
    return {
      category: "Reasoning",
      question: `Find the missing number in the analogy: ${n1} : ${v1} :: ${n2} : ?`,
      options,
      answer,
      explanation: `Pattern is n : (n^2 + n). Here ${n1}^2 + ${n1} = ${v1}, so ${n2}^2 + ${n2} = ${v2}.`
    };
  }

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

  // Fallback fill: if subject-specific unique pool runs out (e.g. 500Q on GK/Science/English/Computer),
  // top up cleanly with unseen questions from full baseBank + mixed procedural questions so exact count is always met.
  if (out.length < safeCount) {
    const fallbackPool = [
      ...(Array.isArray(baseBank) ? baseBank : []),
      ...HARD_CURATED_BANK
    ];
    for (let i = fallbackPool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [fallbackPool[i], fallbackPool[j]] = [fallbackPool[j], fallbackPool[i]];
    }
    for (let i = 0; i < fallbackPool.length && out.length < safeCount; i++) {
      const q = fallbackPool[i];
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
    let mixGuard = 0;
    while (out.length < safeCount && mixGuard < safeCount * 6) {
      const qSeed = safeSeed * 199933 + mixGuard * 65537 + 97;
      const item = generateProceduralQuestion(qSeed, "Mixed", difficulty);
      mixGuard++;
      if (!seenQ.has(item.question)) {
        seenQ.add(item.question);
        out.push(item);
      }
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
