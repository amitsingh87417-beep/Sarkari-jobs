const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'data');
const UPLOADS_DIR = process.env.UPLOAD_DIR ? path.resolve(process.env.UPLOAD_DIR) : path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'practice-question-bank.json');
const PAPERS_FILE = path.join(DATA_DIR, 'papers.json');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

function loadJson(file, defaultVal = []) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) {
        console.error('Error reading JSON:', file, e);
    }
    return defaultVal;
}

function saveJson(file, data) {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('Error saving JSON:', file, e);
        return false;
    }
}

function checkAdmin(req, res, next) {
    const pin = req.headers['x-admin-pin'] || req.body.pin;
    if (pin !== ADMIN_PIN) {
        return res.status(401).json({ success: false, message: 'Invalid Admin PIN!' });
    }
    next();
}

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '7.0.0' }));

app.post('/api/admin/verify', (req, res) => {
    const { pin } = req.body;
    if (pin === ADMIN_PIN) return res.json({ success: true });
    res.status(401).json({ success: false, message: 'Wrong PIN' });
});

app.get('/api/stats', (req, res) => {
    const jobs = loadJson(JOBS_FILE, []);
    const questions = loadJson(QUESTIONS_FILE, []);
    const papers = loadJson(PAPERS_FILE, []);
    res.json({
        totalJobs: jobs.length,
        latestCount: jobs.filter(j => j.section === 'latest').length,
        admitCount: jobs.filter(j => j.section === 'admitCard').length,
        resultCount: jobs.filter(j => j.section === 'result').length,
        totalQuestions: questions.length,
        totalPapers: papers.length
    });
});

// JOBS CRUD + RESTORE JSON
app.get('/api/jobs', (req, res) => {
    res.json(loadJson(JOBS_FILE, []));
});

app.post('/api/jobs', checkAdmin, (req, res) => {
    let jobs = loadJson(JOBS_FILE, []);
    if (Array.isArray(req.body.restoreJobs)) {
        saveJson(JOBS_FILE, req.body.restoreJobs);
        return res.json({ success: true, restoredCount: req.body.restoreJobs.length });
    }
    const newJob = {
        id: 'job_' + Date.now(),
        title: req.body.title || 'New Govt Vacancy',
        department: req.body.department || 'Govt of India / J&K',
        section: req.body.section || 'latest',
        category: req.body.category || 'Central Govt',
        qualification: req.body.qualification || '10th / 12th / Graduate',
        ageLimit: req.body.ageLimit || '18 - 35 Years',
        fee: req.body.fee || 'Check Notification',
        lastDate: req.body.lastDate || '2026-12-31',
        vacancies: req.body.vacancies || 'Multiple Posts',
        link: req.body.link || '#',
        description: req.body.description || 'Official recruitment notification.'
    };
    jobs.unshift(newJob);
    saveJson(JOBS_FILE, jobs);
    res.json({ success: true, job: newJob });
});

app.delete('/api/jobs/:id', checkAdmin, (req, res) => {
    let jobs = loadJson(JOBS_FILE, []);
    const initialLen = jobs.length;
    jobs = jobs.filter(j => j.id !== req.params.id);
    if (jobs.length === initialLen) return res.status(404).json({ success: false });
    saveJson(JOBS_FILE, jobs);
    res.json({ success: true });
});

// QUESTIONS CRUD + BULK JSON IMPORT
app.get('/api/questions', (req, res) => {
    const subject = req.query.subject;
    let qs = loadJson(QUESTIONS_FILE, []);
    if (subject && subject !== 'ALL') {
        qs = qs.filter(q => (q.subject || '').toLowerCase() === subject.toLowerCase());
    }
    res.json(qs);
});

app.post('/api/questions', checkAdmin, (req, res) => {
    let qs = loadJson(QUESTIONS_FILE, []);
    if (Array.isArray(req.body.bulkQuestions)) {
        const added = req.body.bulkQuestions.map((item, idx) => ({
            id: 'q_' + Date.now() + '_' + idx,
            subject: item.subject || 'General Awareness',
            question: item.question,
            options: item.options || [],
            correct: parseInt(item.correct, 10) || 0,
            explanation: item.explanation || 'Standard syllabus concept.'
        }));
        qs = qs.concat(added);
        saveJson(QUESTIONS_FILE, qs);
        return res.json({ success: true, addedCount: added.length });
    }

    const newQ = {
        id: 'q_' + Date.now(),
        subject: req.body.subject || 'General Awareness',
        question: req.body.question,
        options: req.body.options || [],
        correct: parseInt(req.body.correct, 10) || 0,
        explanation: req.body.explanation || 'Refer to standard NCERT / SSC syllabus notes.'
    };
    qs.push(newQ);
    saveJson(QUESTIONS_FILE, qs);
    res.json({ success: true, question: newQ });
});

// DIRECT FILE UPLOAD ENDPOINT (PDF / TXT / JSON / DOC)
app.post('/api/upload-file', checkAdmin, (req, res) => {
    try {
        const { fileName, base64Data, title, exam, pages } = req.body;
        if (!fileName || !base64Data) {
            return res.status(400).json({ success: false, message: 'File missing' });
        }
        const safeName = Date.now() + '_' + path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
        const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const buffer = Buffer.from(cleanBase64, 'base64');
        fs.writeFileSync(path.join(UPLOADS_DIR, safeName), buffer);

        const fileUrl = '/uploads/' + safeName;
        let papers = loadJson(PAPERS_FILE, []);
        const newPaper = {
            id: 'paper_' + Date.now(),
            title: title || fileName,
            exam: exam || 'Uploaded File',
            year: '2026',
            pages: pages || `${Math.max(1, Math.round(buffer.length / 1024))} KB File`,
            url: fileUrl
        };
        papers.unshift(newPaper);
        saveJson(PAPERS_FILE, papers);

        res.json({ success: true, url: fileUrl, paper: newPaper });
    } catch (e) {
        console.error('Upload error:', e);
        res.status(500).json({ success: false, message: 'Failed to save uploaded file' });
    }
});

// PAPERS CRUD
app.get('/api/papers', (req, res) => {
    res.json(loadJson(PAPERS_FILE, []));
});

app.post('/api/papers', checkAdmin, (req, res) => {
    let papers = loadJson(PAPERS_FILE, []);
    const newPaper = {
        id: 'paper_' + Date.now(),
        title: req.body.title || 'Model Practice Paper',
        exam: req.body.exam || 'General',
        year: req.body.year || '2026',
        pages: req.body.pages || 'Solved PDF',
        url: req.body.url || '#'
    };
    papers.unshift(newPaper);
    saveJson(PAPERS_FILE, papers);
    res.json({ success: true, paper: newPaper });
});

// LEADERBOARD API
app.get('/api/leaderboard', (req, res) => {
    res.json(loadJson(LEADERBOARD_FILE, []));
});

app.post('/api/leaderboard', (req, res) => {
    let board = loadJson(LEADERBOARD_FILE, []);
    const entry = {
        id: 'lb_' + Date.now(),
        name: (req.body.name || 'Aspirant').trim().slice(0, 30),
        exam: (req.body.exam || 'CBT Mock').trim().slice(0, 25),
        score: req.body.score || '0',
        accuracy: req.body.accuracy || '0%',
        date: new Date().toISOString().slice(0, 10)
    };
    board.unshift(entry);
    board = board.slice(0, 20);
    saveJson(LEADERBOARD_FILE, board);
    res.json({ success: true, entry });
});

app.listen(PORT, () => {
    console.log(`Sarkari Job Universe v7.0.0 running on http://localhost:${PORT}`);
});
