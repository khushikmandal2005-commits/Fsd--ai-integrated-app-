// ResuCoach AI - User Custom Color Palette (Ivory, Sage, Dusty Rose, Sandstone, Dusty Blue)

const PALETTE_COLORS = {
  IVORY: '#F5F0E6',
  SAGE: '#A7B89C',
  DUSTY_ROSE: '#D9A7A7',
  SANDSTONE: '#D2B48C',
  DUSTY_BLUE: '#6D8CA6'
};

const THEME_PALETTES = {
  'user_palette': {
    name: '🌸 Aesthetic Ivory & Dusty Blue (Uploaded Palette)',
    bg: '#F5F0E6',
    text: '#2d3748',
    glass: 'rgba(255, 255, 255, 0.85)',
    border: '#D2B48C',
    accent: '#6D8CA6',
    secondary: '#A7B89C',
    cardGlow: '0 10px 30px -5px rgba(109, 140, 166, 0.25)',
    gradient: 'from-[#6D8CA6] via-[#A7B89C] to-[#D9A7A7]'
  },
  'aurora': {
    name: '💜 Cyber Aurora (Midnight Violet & Cyan)',
    bg: '#070a14',
    text: '#f8fafc',
    glass: 'rgba(15, 23, 42, 0.75)',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#a855f7',
    secondary: '#06b6d4',
    cardGlow: '0 0 45px -5px rgba(168, 85, 247, 0.35)',
    gradient: 'from-violet-500 via-fuchsia-500 to-cyan-400'
  }
};

const ResuCoachEngine = {
  activePalette: function() {
    return localStorage.getItem('resucoach_palette') || 'user_palette';
  },

  applyPalette: function(key) {
    const pal = THEME_PALETTES[key] || THEME_PALETTES['user_palette'];
    localStorage.setItem('resucoach_palette', key);
    
    document.body.style.backgroundColor = pal.bg;
    document.body.style.color = pal.text;
    
    const cursor = document.getElementById('customCursor');
    const follower = document.getElementById('cursorFollower');
    if (cursor) cursor.style.backgroundColor = pal.accent;
    if (follower) follower.style.borderColor = pal.accent;

    return pal;
  },

  getHistory: function() {
    const data = localStorage.getItem('resucoach_history');
    if (!data) {
      const defaultHistory = [
        {
          id: 'res_101',
          title: 'Khushi Mandal - Full Stack Resume',
          roleTitle: 'Full Stack Developer',
          score: 78,
          atsMatchPct: 72,
          impactScore: 68,
          formatScore: 88,
          scannedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ];
      localStorage.setItem('resucoach_history', JSON.stringify(defaultHistory));
      return defaultHistory;
    }
    return JSON.parse(data);
  },

  saveAnalysisToHistory: function(analysis) {
    const history = this.getHistory();
    const item = {
      id: 'res_' + Date.now(),
      scannedAt: new Date().toISOString(),
      ...analysis
    };
    history.unshift(item);
    localStorage.setItem('resucoach_history', JSON.stringify(history));
    return item;
  },

  analyzeResume: function(resumeText, targetRoleKey = 'fullstack') {
    const text = (resumeText || '').trim();
    const roleObj = JOB_ROLE_DATABASE[targetRoleKey] || JOB_ROLE_DATABASE['fullstack'];
    
    const lowerText = text.toLowerCase();
    const matchedKeywords = [];
    const missingKeywords = [];

    roleObj.keywords.forEach(kw => {
      if (lowerText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const atsMatchPct = Math.min(100, Math.round((matchedKeywords.length / roleObj.keywords.length) * 100));

    const impactVerbs = ['built', 'engineered', 'developed', 'optimized', 'implemented', 'scaled', 'increased', 'reduced', 'designed', 'architected'];
    let impactCount = 0;
    impactVerbs.forEach(v => {
      if (lowerText.includes(v)) impactCount++;
    });

    const hasMetrics = (text.match(/\d+%/g) || []).length + (text.match(/\d+x/g) || []).length + (text.match(/\$\d+/g) || []).length;
    const impactScore = Math.min(95, Math.max(45, Math.round(impactCount * 8 + hasMetrics * 10 + 35)));
    const formatScore = text.includes('Education') && text.includes('Skills') && text.includes('Projects') ? 90 : 65;

    const overallScore = Math.round((atsMatchPct * 0.45) + (impactScore * 0.35) + (formatScore * 0.20));

    const bulletRewrites = [
      {
        original: 'Worked on building UI components for customer portal',
        improved: 'Engineered 15+ responsive React UI components, improving page load speed by 25% and customer portal engagement.',
        reason: 'Adds strong action verb (Engineered) and quantitative impact metrics (+25%).'
      },
      {
        original: 'Built a full stack food menu scanning app',
        improved: 'Architected & deployed a full-stack AI vision app using Express REST APIs, Node.js, and Tailwind CSS serving 500+ student scans.',
        reason: 'Specifies tech stack architecture and deployment metrics.'
      },
      {
        original: 'Fixed bugs in existing frontend codebase',
        improved: 'Diagnosed and resolved 30+ critical frontend state management bugs in React/Redux, decreasing user-reported crashes by 40%.',
        reason: 'Highlights problem-solving capability and crash reduction impact.'
      }
    ];

    const mockInterviewQuestions = [
      {
        id: 'q1',
        type: 'Technical',
        question: `How do you optimize state management and re-rendering performance in a ${roleObj.title} application?`,
        hints: ['Mention React.memo, useMemo, useCallback, or Redux selector optimization.'],
        idealAnswer: `To optimize state management, I isolate local component state from global state, use React.memo for expensive child renders, memoize heavy computations using useMemo/useCallback, and normalize global store data.`
      },
      {
        id: 'q2',
        type: 'Architecture',
        question: `Walk me through how you design a RESTful API endpoint for handling file uploads securely and efficiently.`,
        hints: ['Mention multipart/form-data, Multer memory storage, Cloud S3/local validation, and file size limits.'],
        idealAnswer: `I implement stream-based multipart handling using Multer, validate MIME types and file signatures on the backend, set strict payload byte limits (e.g. 10MB), and stream files directly to cloud bucket storage with presigned URLs.`
      },
      {
        id: 'q3',
        type: 'Behavioral',
        question: `Describe a challenging bug you faced during project development. How did you diagnose and resolve it?`,
        hints: ['Use STAR method: Situation, Task, Action, Result.'],
        idealAnswer: `Using the STAR framework, I identified an asynchronous memory leak during video stream rendering by inspecting Chrome DevTools heap snapshots, isolated the uncleaned listener, and implemented explicit cleanup hooks.`
      }
    ];

    return {
      title: `${text.split('\n')[0] || 'Student'} - Resume Analysis`,
      roleTitle: roleObj.title,
      overallScore,
      atsMatchPct,
      impactScore,
      formatScore,
      matchedKeywords,
      missingKeywords,
      missingHardSkills: roleObj.hardSkills.filter(s => !lowerText.includes(s.toLowerCase().split(' ')[0])),
      missingSoftSkills: roleObj.softSkills,
      bulletRewrites,
      mockInterviewQuestions
    };
  },

  matchJobDescription: function(resumeText, jdText) {
    const resText = (resumeText || '').toLowerCase();
    const jd = (jdText || '').toLowerCase();

    const techKeywords = ['react', 'node', 'express', 'javascript', 'typescript', 'python', 'sql', 'mongodb', 'docker', 'aws', 'git', 'rest', 'graphql', 'html', 'css', 'tailwind', 'redux', 'testing', 'ci/cd', 'agile'];
    const matchedInJd = techKeywords.filter(k => jd.includes(k));
    const matchedInBoth = matchedInJd.filter(k => resText.includes(k));
    const missingFromResume = matchedInJd.filter(k => !resText.includes(k));

    const matchPct = matchedInJd.length > 0 ? Math.round((matchedInBoth.length / matchedInJd.length) * 100) : 75;

    return {
      matchPct: matchPct,
      requiredKeywords: matchedInJd,
      matchedKeywords: matchedInBoth,
      missingKeywords: missingFromResume,
      recommendation: matchPct >= 75 ? 'Great Match! You meet most technical requirements.' : 'Skill Gap Detected. Add missing keywords to boost shortlist chances.'
    };
  },

  evaluateInterviewAnswer: function(questionObj, userAnswerText) {
    const ans = (userAnswerText || '').trim();
    if (!ans) return null;

    const wordCount = ans.split(/\s+/).length;
    let score = 70;
    const Strengths = [];
    const Improvements = [];

    if (wordCount >= 30) {
      score += 15;
      Strengths.push('Detailed answer with good explanation depth.');
    } else {
      score -= 10;
      Improvements.push('Try expanding your answer with technical keywords and concrete project examples.');
    }

    if (ans.toLowerCase().includes('react') || ans.toLowerCase().includes('api') || ans.toLowerCase().includes('state') || ans.toLowerCase().includes('optimize') || ans.toLowerCase().includes('built')) {
      score += 10;
      Strengths.push('Great use of relevant technical vocabulary.');
    }

    const finalScore = Math.min(98, Math.max(40, score));

    return {
      score: finalScore,
      strengths: Strengths.length > 0 ? Strengths : ['Clear communication'],
      improvements: Improvements.length > 0 ? Improvements : ['Consider mentioning quantifiable metrics in your results'],
      idealAnswer: questionObj.idealAnswer
    };
  }
};

const JOB_ROLE_DATABASE = {
  'fullstack': {
    title: 'Full Stack Developer',
    keywords: ['React', 'Node.js', 'Express', 'MongoDB', 'REST API', 'JavaScript', 'TypeScript', 'SQL', 'Git', 'Docker', 'AWS', 'Tailwind CSS', 'CI/CD'],
    hardSkills: ['React.js', 'Node.js/Express', 'MongoDB/PostgreSQL', 'RESTful APIs', 'System Design'],
    softSkills: ['Problem Solving', 'Code Review', 'Agile/Scrum', 'Communication'],
    avgSalary: '₹8.5 - ₹16 LPA'
  },
  'frontend': {
    title: 'Frontend Web Developer',
    keywords: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Redux', 'Web Vitals', 'Responsive Design', 'Git', 'Webpack'],
    hardSkills: ['React/Next.js', 'TypeScript', 'CSS/Tailwind', 'State Management (Redux/Zustand)', 'UI/UX Accessibility'],
    softSkills: ['Attention to Detail', 'Cross-Team Collaboration', 'User Empathy'],
    avgSalary: '₹7.0 - ₹14 LPA'
  },
  'backend': {
    title: 'Backend Engineer',
    keywords: ['Node.js', 'Python', 'Java', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Microservices', 'System Design', 'REST API', 'GraphQL', 'Kafka'],
    hardSkills: ['Node.js/Python/Java', 'Database Optimization (SQL/NoSQL)', 'API Architecture', 'Distributed Systems'],
    softSkills: ['Scalability Thinking', 'Root Cause Analysis', 'Technical Documentation'],
    avgSalary: '₹9.0 - ₹18 LPA'
  },
  'datascientist': {
    title: 'Data Scientist / ML Engineer',
    keywords: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'SQL', 'Machine Learning', 'Data Analysis', 'Deep Learning', 'Statistics'],
    hardSkills: ['Python & Pandas', 'Machine Learning Algorithms', 'SQL Data Querying', 'Model Evaluation & Feature Engineering'],
    softSkills: ['Analytical Mindset', 'Data Storytelling', 'Research Skills'],
    avgSalary: '₹10.0 - ₹20 LPA'
  }
};

const PRESET_RESUMES = {
  cs_student: {
    title: 'Sample CS Student Resume',
    role: 'fullstack',
    text: `Khushi Mandal
College CS Student | Email: khushi@college.edu | Phone: +91 9876543210
Summary: Enthusiastic Computer Science student passionate about web development and building AI integrated applications.

Skills: JavaScript, HTML, CSS, React, Node.js, Express, Git, Python, C++.

Projects:
- FSD AI Integrated App: Built a full stack food menu scanning app using React and Express.
- E-Commerce Web Page: Designed responsive shopping cart frontend using HTML, CSS, and JS.
- Weather App: Created weather checking website using OpenWeather API.

Education: B.Tech Computer Science & Engineering (2022 - 2026), GPA: 8.5`
  },
  web_dev: {
    title: 'Sample Web Developer Resume',
    role: 'frontend',
    text: `Rahul Sharma
Frontend Developer | Email: rahul@dev.io

Skills: React, Next.js, JavaScript, Tailwind CSS, Redux, Git.

Experience:
- Frontend Intern at TechCorp: Worked on building UI components for customer portal using React and Tailwind CSS.
- Developed landing pages that improved user engagement.
- Fixed bugs in existing frontend codebase.`
  }
};

const INTERVIEW_QUESTION_BANK = [
  { id: 'q_fs1', role: 'fullstack', category: 'Technical', question: 'How do you optimize state management and re-rendering performance in React?', answer: 'Use React.memo, useCallback, useMemo, and split large context states into localized stores.' },
  { id: 'q_fs2', role: 'fullstack', category: 'Architecture', question: 'Explain how RESTful APIs differ from GraphQL APIs.', answer: 'REST uses fixed endpoints per resource (over-fetching/under-fetching), while GraphQL uses a single endpoint allowing clients to query exact fields.' },
  { id: 'q_fe1', role: 'frontend', category: 'Web Vitals', question: 'What is LCP (Largest Contentful Paint) and how do you optimize it?', answer: 'LCP measures main content render time. Optimize by using webp images, preloading hero assets, and deferring non-critical CSS/JS.' },
  { id: 'q_be1', role: 'backend', category: 'Database', question: 'How do database indexes speed up query performance and what is the trade-off?', answer: 'Indexes build B-Tree data structures for fast O(log N) lookup, but increase write latency and storage overhead during INSERT/UPDATE.' },
  { id: 'q_ds1', role: 'datascientist', category: 'Machine Learning', question: 'Explain the difference between Overfitting and Underfitting.', answer: 'Overfitting occurs when a model learns noise (high variance, low bias). Underfitting occurs when a model is too simple to capture patterns (high bias, low variance).' },
  { id: 'q_bh1', role: 'behavioral', category: 'Behavioral', question: 'Describe a situation where you had a conflict with a teammate on architecture design.', answer: 'Use the STAR method: Describe the conflicting technical trade-offs, how you evaluated benchmark metrics together, and reached an empirical decision.' }
];

window.ResuCoachEngine = ResuCoachEngine;
window.PALETTE_COLORS = PALETTE_COLORS;
window.THEME_PALETTES = THEME_PALETTES;
window.JOB_ROLE_DATABASE = JOB_ROLE_DATABASE;
window.PRESET_RESUMES = PRESET_RESUMES;
window.INTERVIEW_QUESTION_BANK = INTERVIEW_QUESTION_BANK;
