document.addEventListener('DOMContentLoaded', async () => {
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('sju_theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerText = '☀️ Light';
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('sju_theme', isDark ? 'dark' : 'light');
            themeToggle.innerText = isDark ? '☀️ Light' : '🌙 Dark';
        });
    }

    let allJobs = [];
    let activeCategory = 'ALL';
    let activeQual = 'ALL';
    let searchQuery = '';
    let savedIds = JSON.parse(localStorage.getItem('sju_saved_jobs') || '[]');

    const latestList = document.getElementById('latest-jobs-list');
    const admitList = document.getElementById('admit-card-list');
    const resultsList = document.getElementById('results-list');
    const savedCountEl = document.getElementById('savedCount');

    function updateSavedCount() {
        if (savedCountEl) savedCountEl.innerText = savedIds.length;
    }
    updateSavedCount();

    try {
        const res = await fetch('/api/jobs');
        allJobs = await res.json();
    } catch (e) {
        console.error('Failed to load jobs:', e);
    }

    const ticker = document.getElementById('liveTicker');
    if (ticker && allJobs.length > 0) {
        const headlines = allJobs.slice(0, 3).map(j => j.title).join('  |  ');
        ticker.innerHTML = `🔴 LIVE UPDATES: ${headlines}`;
    }

    // Render Deadline Countdown Strip for Latest Jobs
    const cdStrip = document.getElementById('countdownStrip');
    if (cdStrip && allJobs.length > 0) {
        const now = new Date();
        const upcoming = allJobs.filter(j => j.section === 'latest' && j.lastDate).slice(0, 3);
        cdStrip.innerHTML = upcoming.map(j => {
            const diffDays = Math.ceil((new Date(j.lastDate) - now) / (1000 * 60 * 60 * 24));
            const label = diffDays > 0 ? `${diffDays} Days Left` : (diffDays === 0 ? 'Closes Today!' : 'Closed');
            return `
                <div class="cd-card">
                    <div>
                        <div style="font-size:0.86rem; font-weight:700;">${j.title.slice(0, 34)}...</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Last Date: ${j.lastDate}</div>
                    </div>
                    <span class="cd-days">${label}</span>
                </div>
            `;
        }).join('');
    }

    function renderLists() {
        const filtered = allJobs.filter(job => {
            const matchesSearch =
                (job.title || '').toLowerCase().includes(searchQuery) ||
                (job.department || '').toLowerCase().includes(searchQuery) ||
                (job.qualification || '').toLowerCase().includes(searchQuery);

            if (!matchesSearch) return false;
            if (activeQual !== 'ALL') {
                const qText = (job.qualification || '').toLowerCase();
                if (!qText.includes(activeQual.toLowerCase())) return false;
            }
            if (activeCategory === 'ALL') return true;
            if (activeCategory === 'SAVED') return savedIds.includes(job.id);
            return (job.category || '').toLowerCase() === activeCategory.toLowerCase();
        });

        const latest = filtered.filter(j => j.section === 'latest' || !j.section);
        const admit = filtered.filter(j => j.section === 'admitCard');
        const result = filtered.filter(j => j.section === 'result');

        document.getElementById('latestBadge').innerText = latest.length;
        document.getElementById('admitBadge').innerText = admit.length;
        document.getElementById('resultBadge').innerText = result.length;

        const renderItem = (j, icon) => {
            const isSaved = savedIds.includes(j.id);
            return `
                <li>
                    <a class="job-link-title" data-id="${j.id}">${icon} ${j.title} ${isSaved ? '⭐' : ''}</a>
                    <div class="job-meta">
                        <span class="badge badge-cat">${j.category || 'Govt'}</span>
                        <span>🎓 ${j.qualification || 'Any'}</span>
                        <span>📌 ${j.vacancies || 'Multiple'}</span>
                        <span class="badge badge-date">⏳ ${j.lastDate || 'Check Notice'}</span>
                    </div>
                </li>
            `;
        };

        latestList.innerHTML = latest.length
            ? latest.map(j => renderItem(j, '👉')).join('')
            : '<li style="color:#888;">No matching jobs found.</li>';

        admitList.innerHTML = admit.length
            ? admit.map(j => renderItem(j, '🎟️')).join('')
            : '<li style="color:#888;">No matching admit cards found.</li>';

        resultsList.innerHTML = result.length
            ? result.map(j => renderItem(j, '📊')).join('')
            : '<li style="color:#888;">No matching results found.</li>';

        document.querySelectorAll('.job-link-title').forEach(el => {
            el.addEventListener('click', () => openJobModal(el.getAttribute('data-id')));
        });
    }

    const modal = document.getElementById('jobModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalSaveBtn = document.getElementById('modalSaveBtn');

    function openJobModal(jobId) {
        const job = allJobs.find(j => j.id === jobId);
        if (!job) return;

        document.getElementById('modalTitle').innerText = job.title;
        document.getElementById('modalDept').innerText = job.department || 'Government Recruitment';
        document.getElementById('modalCategory').innerText = job.category || 'General';
        document.getElementById('modalVacancies').innerText = job.vacancies || 'See Notification';
        document.getElementById('modalQual').innerText = job.qualification || '10th / 12th / Graduate';
        document.getElementById('modalAge').innerText = job.ageLimit || '18 - 35 Years';
        document.getElementById('modalFee').innerText = job.fee || 'See Official Portal';
        document.getElementById('modalLastDate').innerText = job.lastDate || '2026-12-31';
        document.getElementById('modalDesc').innerText = job.description || '';
        document.getElementById('modalApplyLink').href = job.link || '#';

        const shareText = encodeURIComponent(`🔥 *${job.title}*\n📌 Vacancies: ${job.vacancies}\n🎓 Qualification: ${job.qualification}\n⏳ Last Date: ${job.lastDate}\n👉 Apply Here: ${job.link}`);
        document.getElementById('modalWhatsappBtn').href = `https://api.whatsapp.com/send?text=${shareText}`;

        const updateSaveButtonState = () => {
            const saved = savedIds.includes(job.id);
            modalSaveBtn.innerText = saved ? '✅ Saved in Bookmarks' : '⭐ Save Job';
        };
        updateSaveButtonState();

        modalSaveBtn.onclick = () => {
            if (savedIds.includes(job.id)) {
                savedIds = savedIds.filter(id => id !== job.id);
            } else {
                savedIds.push(job.id);
            }
            localStorage.setItem('sju_saved_jobs', JSON.stringify(savedIds));
            updateSavedCount();
            updateSaveButtonState();
            renderLists();
        };

        modal.style.display = 'flex';
    }

    closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    document.getElementById('jobSearchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderLists();
    });

    document.getElementById('qualFilter').addEventListener('change', (e) => {
        activeQual = e.target.value;
        renderLists();
    });

    document.querySelectorAll('#categoryPills .pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#categoryPills .pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-cat');
            renderLists();
        });
    });

    renderLists();
});
