(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // --- Valid pure-JS multi-page JPEG-in-PDF builder ---
  function buildPdfFromJpegs(pages) {
    // pages: [{ widthPx, heightPx, jpegBytes: Uint8Array }]
    const encoder = new TextEncoder();
    const parts = [];
    let offset = 0;
    const offsets = [0]; // obj 0 placeholder

    function pushBytes(u8) {
      parts.push(u8);
      offset += u8.length;
    }
    function pushStr(s) {
      pushBytes(encoder.encode(s));
    }

    pushStr("%PDF-1.4\n");

    const numPages = pages.length;
    const catalogId = 1;
    const pagesId = 2;
    // Each page gets: pageObjId, contentObjId, imgObjId
    let nextId = 3;
    const pageRecords = pages.map(p => {
      const pageObjId = nextId++;
      const contentObjId = nextId++;
      const imgObjId = nextId++;
      return { ...p, pageObjId, contentObjId, imgObjId };
    });

    const totalObjs = nextId - 1;

    // 1: Catalog
    offsets[catalogId] = offset;
    pushStr(`${catalogId} 0 obj\n<< /Type /Catalog /Pages ${pagesId} 0 R >>\nendobj\n`);

    // 2: Pages
    offsets[pagesId] = offset;
    const kidsStr = pageRecords.map(r => `${r.pageObjId} 0 R`).join(" ");
    pushStr(`${pagesId} 0 obj\n<< /Type /Pages /Kids [ ${kidsStr} ] /Count ${numPages} >>\nendobj\n`);

    // A4 points: 595.28 x 841.89; fit image with margin
    const pageW = 595.28;
    const pageH = 841.89;
    const margin = 28;
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;

    for (const r of pageRecords) {
      const ratio = Math.min(maxW / r.widthPx, maxH / r.heightPx);
      const drawW = (r.widthPx * ratio).toFixed(2);
      const drawH = (r.heightPx * ratio).toFixed(2);
      const x = ((pageW - Number(drawW)) / 2).toFixed(2);
      const y = ((pageH - Number(drawH)) / 2).toFixed(2);

      // Page object
      offsets[r.pageObjId] = offset;
      pushStr(
        `${r.pageObjId} 0 obj\n` +
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(2)}] ` +
        `/Resources << /XObject << /Im${r.imgObjId} ${r.imgObjId} 0 R >> >> ` +
        `/Contents ${r.contentObjId} 0 R >>\nendobj\n`
      );

      // Content stream
      const streamCmd = `q ${drawW} 0 0 ${drawH} ${x} ${y} cm /Im${r.imgObjId} Do Q\n`;
      const streamBytes = encoder.encode(streamCmd);
      offsets[r.contentObjId] = offset;
      pushStr(`${r.contentObjId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`);
      pushBytes(streamBytes);
      pushStr(`endstream\nendobj\n`);

      // Image XObject (DCTDecode)
      offsets[r.imgObjId] = offset;
      pushStr(
        `${r.imgObjId} 0 obj\n` +
        `<< /Type /XObject /Subtype /Image /Width ${r.widthPx} /Height ${r.heightPx} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${r.jpegBytes.length} >>\nstream\n`
      );
      pushBytes(r.jpegBytes);
      pushStr(`\nendstream\nendobj\n`);
    }

    const xrefStart = offset;
    pushStr(`xref\n0 ${totalObjs + 1}\n`);
    pushStr(`0000000000 65535 f \n`);
    for (let i = 1; i <= totalObjs; i++) {
      pushStr(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
    }
    pushStr(`trailer\n<< /Size ${totalObjs + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

    return new Blob(parts, { type: "application/pdf" });
  }

  function dataUrlToUint8(dataUrl) {
    const base64 = dataUrl.split(",")[1] || "";
    const bin = atob(base64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.18 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.46);
      });
    } catch {}
  }

  const FAV_KEY = "sju_fav_papers_v1";

  function loadFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
  }
  function saveFavs(arr) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch {}
  }

  async function initStudentUtilitySuite() {
    const mount = document.getElementById("student-utility-suite");
    if (!mount) return;

    let manifest = [];
    try {
      const r = await fetch("/papers/manifest.json");
      if (r.ok) manifest = await r.json();
    } catch {}

    let favIds = loadFavs();

    mount.innerHTML = `
      <div style="max-width:1160px;margin:22px auto;padding:0 16px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;padding:22px;box-shadow:0 12px 32px rgba(15,41,87,0.06);">
          <div style="margin-bottom:14px;">
            <span style="background:#eef2ff;color:#4338ca;font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;letter-spacing:.5px;">🛠️ SMART STUDENT & FORM UTILITY SUITE</span>
            <h3 style="margin:6px 0 4px;font-size:20px;color:#0f172a;">Image to PDF, Study Timer, Marks/Age Calculator & Saved PDFs</h3>
            <p style="margin:0;font-size:13px;color:#64748b;">Rozmarra ki zaroorat ke 4 fast tools — marksheets/notes ka PDF banayein, timer se padhein, percentage/age nikaalein aur pasandida PDFs save karein.</p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
            <!-- 1. IMAGE TO PDF CONVERTER -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="font-size:11px;font-weight:800;color:#155eef;margin-bottom:4px;">📄 IMAGE TO PDF CONVERTER</div>
                <h4 style="margin:0 0 6px;font-size:16px;color:#0f172a;">Marksheet / Notes se Ek PDF Banayein</h4>
                <p style="margin:0 0 10px;font-size:12px;color:#64748b;">Ek ya zyada photos chunein — unhe ek single PDF file mein badal kar turant download karein.</p>
                <input id="i2pFiles" type="file" accept="image/jpeg,image/png,image/webp" multiple style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                <div id="i2pStatus" style="font-size:12px;color:#334155;margin-top:8px;min-height:18px;">Koi file chuni gayi nahi hai.</div>
              </div>
              <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                <button type="button" id="i2pConvertBtn" style="background:#155eef;color:#fff;border:0;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">📄 Create & Download PDF</button>
                <a id="i2pDownloadLink" style="display:none;background:#16a34a;color:#fff;text-decoration:none;padding:9px 12px;border-radius:9px;font-size:12px;font-weight:800;">⬇ Save PDF</a>
              </div>
            </div>

            <!-- 2. STUDY TIMER + BREAK BELL -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="font-size:11px;font-weight:800;color:#059669;margin-bottom:4px;">⏱️ STUDY FOCUS TIMER</div>
                <h4 style="margin:0 0 6px;font-size:16px;color:#0f172a;">Padhai Timer & Bell Alert</h4>
                <p style="margin:0 0 10px;font-size:12px;color:#64748b;">Time chunein aur bina distraction padhai karein; time khatam hone par bell bajegi.</p>
                <div style="display:flex;gap:6px;margin-bottom:10px;">
                  <button type="button" data-mins="25" class="st-preset" style="flex:1;padding:6px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;font-size:12px;font-weight:700;cursor:pointer;">25m</button>
                  <button type="button" data-mins="45" class="st-preset" style="flex:1;padding:6px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;font-size:12px;font-weight:700;cursor:pointer;">45m</button>
                  <button type="button" data-mins="60" class="st-preset" style="flex:1;padding:6px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;font-size:12px;font-weight:700;cursor:pointer;">60m</button>
                </div>
                <div id="stClock" style="font-size:30px;font-weight:800;color:#0f172a;text-align:center;padding:8px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;">25:00</div>
              </div>
              <div style="margin-top:10px;display:flex;gap:8px;">
                <button type="button" id="stStartBtn" style="flex:1;background:#059669;color:#fff;border:0;padding:9px 12px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">▶ Start</button>
                <button type="button" id="stResetBtn" style="background:#e2e8f0;color:#1e293b;border:0;padding:9px 12px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">Reset</button>
              </div>
            </div>

            <!-- 3. PERCENTAGE & AGE CUT-OFF CALCULATOR -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="font-size:11px;font-weight:800;color:#7c3aed;margin-bottom:4px;">🧮 MARKS % & AGE CALCULATOR</div>
                <h4 style="margin:0 0 6px;font-size:16px;color:#0f172a;">Percentage & Cut-Off Age Nikalein</h4>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
                  <div>
                    <label style="display:block;font-size:11px;font-weight:700;color:#475569;">Obtained Marks</label>
                    <input id="calcObt" type="number" placeholder="e.g. 297" style="width:100%;padding:7px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#fff;">
                  </div>
                  <div>
                    <label style="display:block;font-size:11px;font-weight:700;color:#475569;">Total Marks</label>
                    <input id="calcTot" type="number" placeholder="e.g. 500" style="width:100%;padding:7px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#fff;">
                  </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <div>
                    <label style="display:block;font-size:11px;font-weight:700;color:#475569;">Date of Birth</label>
                    <input id="calcDob" type="date" style="width:100%;padding:7px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#fff;">
                  </div>
                  <div>
                    <label style="display:block;font-size:11px;font-weight:700;color:#475569;">Cut-Off Date</label>
                    <input id="calcCutoff" type="date" value="2026-08-01" style="width:100%;padding:7px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#fff;">
                  </div>
                </div>
                <div id="calcOutput" style="margin-top:8px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:12px;color:#1e293b;min-height:34px;">Marks ya DOB bhar kar Calculate dabayein.</div>
              </div>
              <button type="button" id="calcRunBtn" style="margin-top:10px;background:#7c3aed;color:#fff;border:0;padding:9px 12px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">Calculate % & Age</button>
            </div>

            <!-- 4. FAVOURITE PDFS & QUICK BOOKMARK -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="font-size:11px;font-weight:800;color:#d97706;margin-bottom:4px;">⭐ SAVED PRACTICE PDFS</div>
                <h4 style="margin:0 0 6px;font-size:16px;color:#0f172a;">Pasandida PDF Papers Save Karein</h4>
                <p style="margin:0 0 8px;font-size:12px;color:#64748b;">100 practice PDFs mein se paper chunekar save karein taaki baad mein turant khul sake.</p>
                <div style="display:flex;gap:6px;">
                  <select id="favPaperSelect" style="flex:1;padding:7px 8px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#fff;">
                    ${(Array.isArray(manifest) ? manifest.slice(0, 100) : []).map(p => `<option value="${esc(p.id)}">${esc(p.title)}</option>`).join("")}
                  </select>
                  <button type="button" id="favAddBtn" style="background:#d97706;color:#fff;border:0;padding:7px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⭐ Save</button>
                </div>
                <div id="favPaperList" style="margin-top:8px;display:grid;gap:5px;max-height:110px;overflow-y:auto;"></div>
              </div>
              <a href="/papers.html" style="margin-top:8px;font-size:12px;font-weight:700;color:#155eef;text-decoration:none;">Sabhi 100 PDFs Dekhein →</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // 1. Image to PDF logic
    const i2pInput = document.getElementById("i2pFiles");
    const i2pBtn = document.getElementById("i2pConvertBtn");
    const i2pStatus = document.getElementById("i2pStatus");
    const i2pLink = document.getElementById("i2pDownloadLink");
    let lastPdfUrl = null;

    i2pInput.addEventListener("change", () => {
      const cnt = i2pInput.files ? i2pInput.files.length : 0;
      i2pStatus.textContent = cnt ? `${cnt} photo/image select hui hai.` : "Koi file chuni gayi nahi hai.";
      i2pLink.style.display = "none";
    });

    i2pBtn.addEventListener("click", async () => {
      const files = Array.from(i2pInput.files || []);
      if (!files.length) {
        i2pStatus.textContent = "⚠️ Pehle kam se kam 1 image chunein.";
        return;
      }
      i2pStatus.textContent = "PDF ban rahi hai…";
      try {
        const pages = [];
        for (const file of files) {
          const dataUrl = await new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(fr.result);
            fr.onerror = rej;
            fr.readAsDataURL(file);
          });
          const img = await new Promise((res, rej) => {
            const im = new Image();
            im.onload = () => res(im);
            im.onerror = rej;
            im.src = dataUrl;
          });
          const c = document.createElement("canvas");
          const maxSide = 1400;
          let w = img.width || 800, h = img.height || 1000;
          if (Math.max(w, h) > maxSide) {
            const sc = maxSide / Math.max(w, h);
            w = Math.round(w * sc);
            h = Math.round(h * sc);
          }
          c.width = w; c.height = h;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const jpgUrl = c.toDataURL("image/jpeg", 0.85);
          pages.push({ widthPx: w, heightPx: h, jpegBytes: dataUrlToUint8(jpgUrl) });
        }
        const blob = buildPdfFromJpegs(pages);
        if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
        lastPdfUrl = URL.createObjectURL(blob);
        i2pLink.href = lastPdfUrl;
        i2pLink.download = `sarkari-documents-${pages.length}-pages.pdf`;
        i2pLink.style.display = "inline-block";
        i2pStatus.innerHTML = `✅ <b>${pages.length}-page PDF taiyar!</b> (${Math.max(1, Math.round(blob.size / 1024))} KB)`;
      } catch {
        i2pStatus.textContent = "❌ PDF banane mein dikkat aayi, dobara try karein.";
      }
    });

    // 2. Study Timer logic
    let totalSecs = 25 * 60;
    let remainingSecs = totalSecs;
    let timerId = null;
    const clockEl = document.getElementById("stClock");
    const startBtn = document.getElementById("stStartBtn");
    const resetBtn = document.getElementById("stResetBtn");

    function renderClock() {
      const m = String(Math.floor(remainingSecs / 60)).padStart(2, "0");
      const s = String(remainingSecs % 60).padStart(2, "0");
      clockEl.textContent = `${m}:${s}`;
    }

    mount.querySelectorAll(".st-preset").forEach(b => {
      b.addEventListener("click", () => {
        clearInterval(timerId); timerId = null;
        startBtn.textContent = "▶ Start";
        totalSecs = Number(b.dataset.mins) * 60;
        remainingSecs = totalSecs;
        renderClock();
      });
    });

    startBtn.addEventListener("click", () => {
      if (timerId) {
        clearInterval(timerId); timerId = null;
        startBtn.textContent = "▶ Resume";
        return;
      }
      startBtn.textContent = "⏸ Pause";
      timerId = setInterval(() => {
        if (remainingSecs > 0) {
          remainingSecs--;
          renderClock();
        } else {
          clearInterval(timerId); timerId = null;
          startBtn.textContent = "▶ Start";
          playChime();
          clockEl.textContent = "DONE! 🔔";
        }
      }, 1000);
    });

    resetBtn.addEventListener("click", () => {
      clearInterval(timerId); timerId = null;
      startBtn.textContent = "▶ Start";
      remainingSecs = totalSecs;
      renderClock();
    });

    // 3. Marks % & Age Cut-Off Calculator
    document.getElementById("calcRunBtn").addEventListener("click", () => {
      const obt = Number(document.getElementById("calcObt").value);
      const tot = Number(document.getElementById("calcTot").value);
      const dobVal = document.getElementById("calcDob").value;
      const cutVal = document.getElementById("calcCutoff").value;
      const lines = [];

      if (!isNaN(obt) && !isNaN(tot) && tot > 0 && document.getElementById("calcTot").value !== "") {
        const pct = ((obt / tot) * 100).toFixed(2);
        lines.push(`📊 Percentage: <b>${pct}%</b> (${obt}/${tot})`);
      }
      if (dobVal && cutVal) {
        const d1 = new Date(dobVal + "T00:00:00");
        const d2 = new Date(cutVal + "T00:00:00");
        if (!isNaN(d1) && !isNaN(d2) && d2 >= d1) {
          let years = d2.getFullYear() - d1.getFullYear();
          let months = d2.getMonth() - d1.getMonth();
          let days = d2.getDate() - d1.getDate();
          if (days < 0) {
            months--;
            const prevMonthDays = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
            days += prevMonthDays;
          }
          if (months < 0) {
            years--;
            months += 12;
          }
          lines.push(`🎂 Cut-Off Age: <b>${years} Saal, ${months} Mahine, ${days} Din</b>`);
        }
      }
      document.getElementById("calcOutput").innerHTML = lines.length ? lines.join("<br>") : "Sahi marks ya DOB date bharein.";
    });

    // 4. Favourite PDFs logic
    function renderFavs() {
      const listEl = document.getElementById("favPaperList");
      const items = favIds.map(id => manifest.find(p => String(p.id) === String(id))).filter(Boolean);
      listEl.innerHTML = items.length ? items.map(p => `
        <div style="display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #e2e8f0;border-radius:7px;padding:6px 8px;font-size:11px;gap:6px;">
          <a href="${esc(p.file)}" target="_blank" rel="noopener" style="color:#0f172a;font-weight:700;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(p.title)} ↗</a>
          <button type="button" data-rm-fav="${esc(p.id)}" style="border:0;background:#fee2e2;color:#b91c1c;border-radius:5px;padding:2px 6px;font-size:10px;font-weight:800;cursor:pointer;">✕</button>
        </div>
      `).join("") : `<div style="font-size:11px;color:#64748b;">Abhi koi PDF save nahi hai.</div>`;

      listEl.querySelectorAll("[data-rm-fav]").forEach(btn => {
        btn.addEventListener("click", () => {
          favIds = favIds.filter(x => String(x) !== String(btn.dataset.rmFav));
          saveFavs(favIds);
          renderFavs();
        });
      });
    }

    document.getElementById("favAddBtn").addEventListener("click", () => {
      const sel = document.getElementById("favPaperSelect");
      if (!sel || !sel.value) return;
      if (!favIds.includes(sel.value)) {
        favIds.unshift(sel.value);
        favIds = favIds.slice(0, 20);
        saveFavs(favIds);
        renderFavs();
      }
    });

    renderFavs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStudentUtilitySuite);
  } else {
    initStudentUtilitySuite();
  }
})();
