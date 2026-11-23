(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const PRESETS = {
    ssc_photo: { label: "SSC Photo (20-50 KB • 3.5x4.5 cm)", minKb: 20, maxKb: 50, width: 350, height: 450, format: "image/jpeg" },
    ssc_sign: { label: "SSC Signature (10-20 KB • 4.0x2.0 cm)", minKb: 10, maxKb: 20, width: 400, height: 200, format: "image/jpeg" },
    jkssb_photo: { label: "JKSSB / Railway Photo (20-50 KB)", minKb: 20, maxKb: 50, width: 300, height: 375, format: "image/jpeg" },
    jkssb_sign: { label: "JKSSB / Railway Signature (10-30 KB)", minKb: 10, maxKb: 30, width: 320, height: 140, format: "image/jpeg" },
    army_photo: { label: "Army / Defence Photo (5-20 KB)", minKb: 5, maxKb: 20, width: 240, height: 300, format: "image/jpeg" },
    custom: { label: "Custom Target KB & Size", minKb: 10, maxKb: 100, width: 400, height: 400, format: "image/jpeg" }
  };

  function initPhotoSignSuite() {
    const mount = document.getElementById("photo-sign-resizer-suite");
    if (!mount) return;

    mount.innerHTML = `
      <div style="max-width:1160px;margin:22px auto;padding:0 16px;">
        <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;box-shadow:0 12px 32px rgba(15,41,87,0.07);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
            <div>
              <span style="background:#dbeafe;color:#155eef;font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;letter-spacing:.5px;">🖼️ REAL PHOTO &amp; SIGNATURE KB RESIZER</span>
              <h3 style="margin:6px 0 4px;font-size:20px;color:#0f172a;">Photo &amp; Signature Size (KB) Checker + Live Resizer</h3>
              <p style="margin:0;font-size:13px;color:#64748b;">Apni Photo ya Signature ki image chunein — exact <b>KB size</b>, <b>width &times; height</b> check karein aur exam ke hisaab se turant resize karke <b>JPG download</b> karein (100% browser mein kaam karta hai, koi file server par upload nahi hoti).</p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;align-items:start;">
            <!-- LEFT: CONTROLS -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;display:grid;gap:11px;">
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#334155;margin-bottom:4px;">1. Exam Preset Chunein</label>
                <select id="psPreset" style="width:100%;padding:9px 11px;border:1px solid #cbd5e1;border-radius:9px;font:inherit;font-size:13px;background:#fff;">
                  <option value="ssc_photo">SSC Photo (Target ~20–50 KB &bull; 350&times;450 px)</option>
                  <option value="ssc_sign">SSC Signature (Target ~10–20 KB &bull; 400&times;200 px)</option>
                  <option value="jkssb_photo">JKSSB / RRB Photo (Target ~20–50 KB &bull; 300&times;375 px)</option>
                  <option value="jkssb_sign">JKSSB / RRB Signature (Target ~10–30 KB &bull; 320&times;140 px)</option>
                  <option value="army_photo">Army / Defence Photo (Target ~5–20 KB &bull; 240&times;300 px)</option>
                  <option value="custom">Custom Width / Height / Target KB</option>
                </select>
              </div>

              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#334155;margin-bottom:4px;">2. Photo ya Signature Image Chunein (JPG / PNG / WEBP)</label>
                <input id="psFileInput" type="file" accept="image/jpeg,image/png,image/webp" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;font:inherit;font-size:12px;background:#fff;">
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#475569;margin-bottom:3px;">Width (px)</label>
                  <input id="psWidth" type="number" min="40" max="2000" value="350" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font:inherit;font-size:13px;">
                </div>
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#475569;margin-bottom:3px;">Height (px)</label>
                  <input id="psHeight" type="number" min="40" max="2000" value="450" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font:inherit;font-size:13px;">
                </div>
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#475569;margin-bottom:3px;">Target KB</label>
                  <input id="psTargetKb" type="number" min="3" max="500" value="35" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font:inherit;font-size:13px;">
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#475569;margin-bottom:3px;">Fit Mode</label>
                  <select id="psFitMode" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font:inherit;font-size:12px;background:#fff;">
                    <option value="contain" selected>Fit Inside (No Crop)</option>
                    <option value="cover">Smart Crop Fill</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#475569;margin-bottom:3px;">Rotate / Mirror</label>
                  <div style="display:flex;gap:6px;">
                    <button type="button" id="psRotateBtn" style="flex:1;padding:8px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;font-size:12px;font-weight:700;cursor:pointer;">&#8635; 90&deg;</button>
                    <button type="button" id="psResetBtn" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;font-size:12px;font-weight:700;cursor:pointer;">Reset</button>
                  </div>
                </div>
              </div>

              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
                <button type="button" id="psProcessBtn" style="background:#155eef;color:#fff;border:0;padding:10px 16px;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;">&#9889; Resize &amp; KB Check</button>
                <a id="psDownloadBtn" download="resized-exam-file.jpg" style="display:none;background:#16a34a;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:800;font-size:13px;">&#11015; Download JPG</a>
              </div>

              <div id="psInfoBox" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px;font-size:12px;color:#334155;line-height:1.55;">
                Koi bhi photo ya signature select karein — yahan <b>Original Size (KB)</b> aur <b>Resized Size (KB)</b> dono dikhenge.
              </div>
            </div>

            <!-- RIGHT: PREVIEW & FORM DOCUMENT CHECKLIST -->
            <div style="display:grid;gap:12px;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;text-align:center;">
                <div style="font-size:12px;font-weight:800;color:#0f172a;margin-bottom:8px;">Live Preview</div>
                <canvas id="psCanvas" width="350" height="450" style="max-width:100%;max-height:240px;border:1px dashed #94a3b8;border-radius:8px;background:#fff;"></canvas>
              </div>

              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:14px;">
                <div style="font-size:12px;font-weight:800;color:#92400e;margin-bottom:6px;">&#128203; Form Bharne Se Pehle Zaroori Checklist</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;color:#78350f;">
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox"> Photo clear &amp; white/light BG</label>
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox"> Signature black/blue ink par</label>
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox"> 10th / 12th / ITI Marksheet</label>
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox"> Domicile &amp; Category Certificate</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const presetSel = document.getElementById("psPreset");
    const fileInput = document.getElementById("psFileInput");
    const widthInp = document.getElementById("psWidth");
    const heightInp = document.getElementById("psHeight");
    const targetKbInp = document.getElementById("psTargetKb");
    const fitModeSel = document.getElementById("psFitMode");
    const rotateBtn = document.getElementById("psRotateBtn");
    const resetBtn = document.getElementById("psResetBtn");
    const processBtn = document.getElementById("psProcessBtn");
    const downloadBtn = document.getElementById("psDownloadBtn");
    const infoBox = document.getElementById("psInfoBox");
    const canvas = document.getElementById("psCanvas");
    const ctx = canvas.getContext("2d");

    let loadedImg = null;
    let originalKb = 0;
    let rotationDeg = 0;
    let lastBlobUrl = null;

    function applyPreset() {
      const p = PRESETS[presetSel.value] || PRESETS.ssc_photo;
      widthInp.value = p.width;
      heightInp.value = p.height;
      targetKbInp.value = Math.round((p.minKb + p.maxKb) / 2);
      if (loadedImg) runResize();
    }

    function dataUrlToBlob(dataUrl) {
      const parts = dataUrl.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8 = new Uint8Array(n);
      while (n--) u8[n] = bstr.charCodeAt(n);
      return new Blob([u8], { type: mime });
    }

    function drawRotatedSource(targetCtx, w, h, mode) {
      const isQuarter = rotationDeg % 180 !== 0;
      const srcW = isQuarter ? loadedImg.height : loadedImg.width;
      const srcH = isQuarter ? loadedImg.width : loadedImg.height;

      const scale = mode === "cover"
        ? Math.max(w / srcW, h / srcH)
        : Math.min(w / srcW, h / srcH);

      const dw = Math.round(srcW * scale);
      const dh = Math.round(srcH * scale);
      const dx = Math.round((w - dw) / 2);
      const dy = Math.round((h - dh) / 2);

      targetCtx.save();
      targetCtx.translate(dx + dw / 2, dy + dh / 2);
      targetCtx.rotate((rotationDeg * Math.PI) / 180);
      const drawW = isQuarter ? dh : dw;
      const drawH = isQuarter ? dw : dh;
      targetCtx.drawImage(loadedImg, -drawW / 2, -drawH / 2, drawW, drawH);
      targetCtx.restore();
    }

    function runResize() {
      if (!loadedImg) {
        infoBox.innerHTML = "&#9888;&#65039; Pehle koi <b>Photo ya Signature image</b> select karein.";
        return;
      }
      const w = Math.max(40, Math.min(2000, Number(widthInp.value) || 350));
      const h = Math.max(40, Math.min(2000, Number(heightInp.value) || 450));
      const targetKb = Math.max(3, Math.min(500, Number(targetKbInp.value) || 35));
      const mode = fitModeSel?.value || "contain";
      const preset = PRESETS[presetSel.value] || PRESETS.custom;

      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      drawRotatedSource(ctx, w, h, mode);

      let low = 0.12;
      let high = 0.95;
      let bestUrl = canvas.toDataURL("image/jpeg", 0.8);
      let bestKb = dataUrlToBlob(bestUrl).size / 1024;
      let bestDiff = Math.abs(bestKb - targetKb);

      for (let i = 0; i < 10; i++) {
        const mid = (low + high) / 2;
        const url = canvas.toDataURL("image/jpeg", mid);
        const kb = dataUrlToBlob(url).size / 1024;
        const diff = Math.abs(kb - targetKb);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestUrl = url;
          bestKb = kb;
        }
        if (kb > targetKb) high = mid;
        else low = mid;
      }

      const blob = dataUrlToBlob(bestUrl);
      if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
      lastBlobUrl = URL.createObjectURL(blob);

      downloadBtn.href = lastBlobUrl;
      downloadBtn.download = `${presetSel.value}-${w}x${h}-${Math.round(bestKb)}kb.jpg`;
      downloadBtn.style.display = "inline-block";

      const withinRange =
        presetSel.value === "custom"
          ? Math.abs(bestKb - targetKb) <= Math.max(3, targetKb * 0.15)
          : bestKb >= preset.minKb && bestKb <= preset.maxKb;

      infoBox.innerHTML = `
        &#9989; <b>Resize Taiyar!</b><br>
        &bull; Original Size: <b>${originalKb.toFixed(1)} KB</b> (${esc(loadedImg.width)}&times;${esc(loadedImg.height)} px)<br>
        &bull; New Resized Size: <b style="color:${withinRange ? "#16a34a" : "#d97706"};">${bestKb.toFixed(1)} KB</b> (${w}&times;${h} px) &bull; Target: ~${targetKb} KB<br>
        &bull; Preset Range Status: <b>${withinRange ? "Exam KB Range ke andar hai" : "Target KB ke kareeb tune kiya gaya hai"}</b>
      `;
    }

    presetSel.addEventListener("change", applyPreset);
    processBtn.addEventListener("click", runResize);
    widthInp.addEventListener("change", () => { if (loadedImg) runResize(); });
    heightInp.addEventListener("change", () => { if (loadedImg) runResize(); });
    targetKbInp.addEventListener("change", () => { if (loadedImg) runResize(); });
    fitModeSel?.addEventListener("change", () => { if (loadedImg) runResize(); });

    rotateBtn?.addEventListener("click", () => {
      rotationDeg = (rotationDeg + 90) % 360;
      if (loadedImg) runResize();
    });

    resetBtn?.addEventListener("click", () => {
      rotationDeg = 0;
      if (fitModeSel) fitModeSel.value = "contain";
      applyPreset();
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      originalKb = file.size / 1024;
      rotationDeg = 0;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          loadedImg = img;
          runResize();
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPhotoSignSuite);
  } else {
    initPhotoSignSuite();
  }
})();
