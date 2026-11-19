document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startTestBtn');
    const testSetup = document.getElementById('test-setup');
    const testContainer = document.getElementById('test-container');
    const resultContainer = document.getElementById('result-container');
    const questionText = document.getElementById('question-text');
    const optionsList = document.getElementById('options-list');
    const questionCounter = document.getElementById('question-counter');
    const paletteEl = document.getElementById('question-palette');
    const timerEl = document.getElementById('timer');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const clearBtn = document.getElementById('clearBtn');
    const submitEarlyBtn = document.getElementById('submitEarlyBtn');

    let questions = [];
    let currentIndex = 0;
    let userAnswers = {};
    let timerInterval = null;
    let secondsRemaining = 0;
    let negativePenalty = 0.25;
    let lastScoreStr = '';
    let lastAccuracyStr = '';
    let selectedSubjectLabel = 'ALL';

    async function loadLeaderboard() {
        const box = document.getElementById('leaderboardList');
        try {
            const res = await fetch('/api/leaderboard');
            const rows = await res.json();
            box.innerHTML = rows.map((r, i) => `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; padding:0.6rem; border-bottom:1px dashed var(--border-color); font-size:0.9rem;">
                    <span><strong>#${i + 1} ${r.name}</strong> <span class="badge badge-cat">${r.exam}</span></span>
                    <span>Score: <strong>${r.score}</strong> | Acc: <strong>${r.accuracy}</strong> <span style="color:var(--text-muted); font-size:0.78rem;">(${r.date})</span></span>
                </div>
            `).join('');
        } catch (e) {
            box.innerHTML = 'Unable to load leaderboard.';
        }
    }
    loadLeaderboard();

    function startTimer(totalSeconds) {
        secondsRemaining = totalSeconds;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsRemaining--;
            const mins = Math.floor(secondsRemaining / 60);
            const secs = secondsRemaining % 60;
            timerEl.innerText = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            if (secondsRemaining <= 0) {
                clearInterval(timerInterval);
                alert('Time is up! Submitting your CBT test automatically.');
                showResults();
            }
        }, 1000);
    }

    function renderPalette() {
        paletteEl.innerHTML = questions.map((_, idx) => {
            const isAnswered = userAnswers[idx] !== undefined;
            const isCurrent = idx === currentIndex;
            let bg = isAnswered ? '#28a745' : '#e5e7eb';
            let color = isAnswered ? 'white' : '#111';
            if (isCurrent) { bg = '#0056b3'; color = 'white'; }
            return `<button type="button" data-idx="${idx}" style="width:32px; height:32px; border:none; border-radius:4px; font-weight:bold; cursor:pointer; background:${bg}; color:${color};">${idx + 1}</button>`;
        }).join('');

        paletteEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentIndex = parseInt(btn.getAttribute('data-idx'), 10);
                renderQuestion();
            });
        });
    }

    function renderQuestion() {
        const q = questions[currentIndex];
        questionCounter.innerText = `Question ${currentIndex + 1} of ${questions.length} [${q.subject || 'General'}]`;
        questionText.innerText = q.question;

        optionsList.innerHTML = q.options.map((opt, idx) => `
            <label style="display: flex; align-items: center; gap: 0.8rem; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: ${userAnswers[currentIndex] === idx ? 'rgba(0, 86, 179, 0.12)' : 'transparent'};">
                <input type="radio" name="option" value="${idx}" ${userAnswers[currentIndex] === idx ? 'checked' : ''} style="width: 18px; height: 18px;">
                <span style="font-size: 0.98rem;"><strong>(${String.fromCharCode(65 + idx)})</strong> ${opt}</span>
            </label>
        `).join('');

        optionsList.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                userAnswers[currentIndex] = parseInt(e.target.value, 10);
                renderQuestion();
            });
        });

        prevBtn.disabled = currentIndex === 0;
        nextBtn.innerText = currentIndex === questions.length - 1 ? 'Save' : 'Save & Next ➡️';
        renderPalette();
    }

    function showResults() {
        clearInterval(timerInterval);
        testContainer.style.display = 'none';
        resultContainer.style.display = 'block';

        let correctCount = 0;
        let wrongCount = 0;
        let unattemptedCount = 0;

        questions.forEach((q, idx) => {
            if (userAnswers[idx] === undefined) {
                unattemptedCount++;
            } else if (userAnswers[idx] === q.correct) {
                correctCount++;
            } else {
                wrongCount++;
            }
        });

        const netScore = (correctCount * 1) - (wrongCount * negativePenalty);
        const accuracy = (correctCount + wrongCount) > 0
            ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
            : 0;

        lastScoreStr = `${netScore.toFixed(2)} / ${questions.length}`;
        lastAccuracyStr = `${accuracy}%`;

        document.getElementById('score-card').innerText = `Net Score: ${lastScoreStr}`;
        document.getElementById('stats-breakdown').innerHTML = `
            <span style="color:#28a745;">✅ Correct: ${correctCount}</span>
            <span style="color:#d9534f;">❌ Wrong: ${wrongCount}</span>
            <span style="color:#6b7280;">⚪ Skipped: ${unattemptedCount}</span>
            <span style="color:#0056b3;">🎯 Accuracy: ${lastAccuracyStr}</span>
        `;

        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = questions.map((q, idx) => {
            const userAns = userAnswers[idx];
            const isCorrect = userAns === q.correct;
            const statusBadge = userAns === undefined
                ? '<span style="color:#6b7280;">⚪ Not Attempted</span>'
                : (isCorrect ? '<span style="color:#28a745;">✅ Correct</span>' : '<span style="color:#d9534f;">❌ Incorrect</span>');

            return `
                <div style="padding:1rem; border:1px solid var(--border-color); border-radius:8px; border-left:4px solid ${userAns === undefined ? '#9ca3af' : (isCorrect ? '#28a745' : '#d9534f')};">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.4rem;">
                        <strong>Q${idx + 1}. (${q.subject || 'General'})</strong>
                        ${statusBadge}
                    </div>
                    <p style="font-weight:600; margin-bottom:0.5rem;">${q.question}</p>
                    <p style="font-size:0.9rem;">Your Answer: <strong>${userAns !== undefined ? q.options[userAns] : 'None'}</strong> | Correct Answer: <strong style="color:#28a745;">${q.options[q.correct]}</strong></p>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.4rem;">💡 <em>Explanation: ${q.explanation || 'Standard syllabus concept.'}</em></p>
                </div>
            `;
        }).join('');
    }

    document.getElementById('saveScoreBtn').addEventListener('click', async () => {
        const name = document.getElementById('aspirantName').value.trim();
        if (!name) {
            alert('Please enter your name first!');
            return;
        }
        const res = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                exam: selectedSubjectLabel === 'ALL' ? 'Full CBT' : selectedSubjectLabel,
                score: lastScoreStr,
                accuracy: lastAccuracyStr
            })
        });
        const data = await res.json();
        if (data.success) {
            alert('🏆 Score added to Leaderboard!');
            document.getElementById('saveScoreBtn').disabled = true;
            loadLeaderboard();
        }
    });

    startBtn.addEventListener('click', async () => {
        selectedSubjectLabel = document.getElementById('subjectSelect').value;
        negativePenalty = parseFloat(document.getElementById('negativeMarking').value);

        try {
            const res = await fetch(`/api/questions?subject=${encodeURIComponent(selectedSubjectLabel)}`);
            questions = await res.json();
        } catch (e) {
            questions = [];
        }

        if (!questions || questions.length === 0) {
            alert('No questions found for this subject yet! Loading All Subjects instead.');
            const resAll = await fetch('/api/questions');
            questions = await resAll.json();
        }

        currentIndex = 0;
        userAnswers = {};
        testSetup.style.display = 'none';
        testContainer.style.display = 'block';
        startTimer(questions.length * 60);
        renderQuestion();
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            renderQuestion();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderQuestion();
        }
    });

    clearBtn.addEventListener('click', () => {
        delete userAnswers[currentIndex];
        renderQuestion();
    });

    submitEarlyBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to submit the test now?')) {
            showResults();
        }
    });
});
