document.addEventListener('DOMContentLoaded', () => {
    let adminPin = sessionStorage.getItem('sju_admin_pin') || '';
    const pinGate = document.getElementById('pinGate');
    const adminDashboard = document.getElementById('adminDashboard');
    let latestJobsCache = [];

    async function loadStats() {
        try {
            const res = await fetch('/api/stats');
            const s = await res.json();
            document.getElementById('adminStats').innerHTML =
                `📊 Jobs: <strong>${s.totalJobs}</strong> | Admit Cards: <strong>${s.admitCount}</strong> | Results: <strong>${s.resultCount}</strong> | Mock Questions: <strong>${s.totalQuestions}</strong> | Papers: <strong>${s.totalPapers}</strong>`;
        } catch (e) {}
    }

    async function verifyAndUnlock(pin) {
        const res = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        
    document.getElementById('fileUploadForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('upFileInput');
        const file = fileInput.files[0];
        if (!file) return alert('Please choose a file.');
        if (file.size > 10 * 1024 * 1024) return alert('File size must be under 10 MB.');

        const reader = new FileReader();
        reader.onload = async () => {
            const res = await fetch('/api/upload-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
                body: JSON.stringify({
                    fileName: file.name,
                    base64Data: reader.result,
                    title: document.getElementById('upTitle').value,
                    exam: document.getElementById('upExam').value
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('✅ File uploaded and added to Model Papers!');
                e.target.reset();
                loadStats();
            } else {
                alert('❌ Upload failed: ' + (data.message || 'Error'));
            }
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('restoreJobsFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const parsed = JSON.parse(reader.result);
                if (!Array.isArray(parsed)) throw new Error('Invalid JSON');
                const res = await fetch('/api/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
                    body: JSON.stringify({ restoreJobs: parsed })
                });
                const data = await res.json();
                if (data.success) {
                    alert(`✅ Restored ${data.restoredCount} jobs from file!`);
                    loadManageJobs();
                    loadStats();
                }
            } catch (err) {
                alert('❌ Invalid JSON backup file.');
            }
        };
        reader.readAsText(file);
    });

});
        const data = await res.json();
        if (data.success) {
            adminPin = pin;
            sessionStorage.setItem('sju_admin_pin', pin);
            pinGate.style.display = 'none';
            adminDashboard.style.display = 'block';
            loadStats();
            loadManageJobs();
        } else {
            alert('❌ Invalid Admin PIN!');
        }
    }

    if (adminPin) {
        verifyAndUnlock(adminPin);
    }

    document.getElementById('unlockAdminBtn').addEventListener('click', () => {
        const pin = document.getElementById('adminPinInput').value.trim();
        verifyAndUnlock(pin);
    });

    document.getElementById('exportBackupBtn').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(latestJobsCache, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sarkari-jobs-backup-2026.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    async function loadManageJobs() {
        const res = await fetch('/api/jobs');
        const jobs = await res.json();
        latestJobsCache = jobs;
        const container = document.getElementById('manageJobsList');
        container.innerHTML = jobs.map(j => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.7rem; border-bottom:1px solid var(--border-color); gap:0.5rem;">
                <div>
                    <strong>${j.title}</strong>
                    <div style="font-size:0.8rem; color:var(--text-muted);">${j.section.toUpperCase()} • ${j.category} • Last Date: ${j.lastDate}</div>
                </div>
                <button class="btn btn-danger delete-job-btn" data-id="${j.id}">🗑️ Delete</button>
            </div>
        `).join('');

        document.querySelectorAll('.delete-job-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this notification?')) return;
                const id = btn.getAttribute('data-id');
                const delRes = await fetch(`/api/jobs/${id}`, {
                    method: 'DELETE',
                    headers: { 'x-admin-pin': adminPin }
                });
                const delData = await delRes.json();
                if (delData.success) {
                    loadManageJobs();
                    loadStats();
                }
            });
        });
    }

    document.getElementById('jobForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('jobTitle').value,
            department: document.getElementById('jobDept').value,
            section: document.getElementById('jobSection').value,
            category: document.getElementById('jobCategory').value,
            qualification: document.getElementById('jobQual').value,
            vacancies: document.getElementById('jobVac').value,
            lastDate: document.getElementById('jobLastDate').value,
            link: document.getElementById('jobLink').value
        };
        const res = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ Job published successfully!');
            e.target.reset();
            loadManageJobs();
            loadStats();
        }
    });

    document.getElementById('questionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            subject: document.getElementById('qSubject').value,
            question: document.getElementById('qText').value,
            options: [
                document.getElementById('opt0').value,
                document.getElementById('opt1').value,
                document.getElementById('opt2').value,
                document.getElementById('opt3').value
            ],
            correct: parseInt(document.getElementById('correctOpt').value, 10),
            explanation: document.getElementById('qExp').value
        };
        const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ Question added to CBT Question Bank!');
            e.target.reset();
            loadStats();
        }
    });

    document.getElementById('bulkImportBtn').addEventListener('click', async () => {
        const raw = document.getElementById('bulkJsonArea').value.trim();
        let parsed;
        try {
            parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) throw new Error('Must be a JSON array');
        } catch (err) {
            alert('❌ Invalid JSON array format! Check your syntax.');
            return;
        }
        const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
            body: JSON.stringify({ bulkQuestions: parsed })
        });
        const data = await res.json();
        if (data.success) {
            alert(`✅ Imported ${data.addedCount} questions!`);
            document.getElementById('bulkJsonArea').value = '';
            loadStats();
        }
    });

    document.getElementById('paperForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('pTitle').value,
            exam: document.getElementById('pExam').value,
            pages: document.getElementById('pPages').value,
            url: document.getElementById('pUrl').value
        };
        const res = await fetch('/api/papers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ Model paper added successfully!');
            e.target.reset();
            loadStats();
        }
    });
});
