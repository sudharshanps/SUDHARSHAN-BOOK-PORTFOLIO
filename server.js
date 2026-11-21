/**
 * SUDHARSHAN P S - Interactive 3D Codex Portfolio
 * Full-Stack Node.js Server & Backend API Engine
 * Version 4.0
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory and inquiries storage file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// MIME types dictionary for static file serving
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // ==========================================
    // BACKEND REST API ROUTES
    // ==========================================

    // 1. Healthcheck & System Telemetry Endpoint
    if (pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            service: 'Sudharshan P S Portfolio Backend Engine',
            version: '4.0.0',
            uptime: Math.round(process.uptime()),
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            memory: process.memoryUsage()
        }, null, 2));
        return;
    }

    // 2. Contact Form Submission API
    if (pathname === '/api/contact' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            // 1MB safety limit
            if (body.length > 1e6) {
                req.destroy();
            }
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { name, email, subject, message } = data;

                if (!name || !email || !message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Name, email, and message are required fields.'
                    }));
                    return;
                }

                // Sanitize and construct new inquiry object
                const newInquiry = {
                    id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                    name: String(name).trim().slice(0, 100),
                    email: String(email).trim().slice(0, 150),
                    subject: String(subject || 'General Inquiry').trim().slice(0, 200),
                    message: String(message).trim().slice(0, 5000),
                    timestamp: new Date().toISOString(),
                    ip: req.socket.remoteAddress || '127.0.0.1'
                };

                // Persist inquiry to local JSON database
                let inquiries = [];
                try {
                    inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
                } catch (e) {
                    inquiries = [];
                }
                inquiries.unshift(newInquiry);
                fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');

                console.log(`[BACKEND] New inquiry received from: ${newInquiry.name} <${newInquiry.email}>`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: `Thank you, ${newInquiry.name}! Your message has been safely received by Sudharshan's local backend server.`,
                    inquiryId: newInquiry.id,
                    timestamp: newInquiry.timestamp
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload format.' }));
            }
        });
        return;
    }

    // 3. Inquiries Retrieval Endpoint
    if (pathname === '/api/inquiries' && req.method === 'GET') {
        try {
            const inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                count: inquiries.length,
                inquiries: inquiries
            }, null, 2));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Failed to read inquiries.' }));
        }
        return;
    }

    // 4. AI Assistant Chat Endpoint
    if (pathname === '/api/ai/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { prompt } = JSON.parse(body);
                const q = (prompt || '').toLowerCase();
                let reply = '';

                if (q.includes('who is') || q.includes('about') || q.includes('sudharshan')) {
                    reply = "Sudharshan P S is a Computer Science & Engineering student specializing in Cyber Security at Sri Krishna College of Engineering & Technology, Coimbatore (CGPA 8.5/10). He is an engineer and entrepreneur passionate about building secure, intelligent, and scalable software solutions.";
                } else if (q.includes('startup') || q.includes('sudharshantech') || q.includes('zentriq')) {
                    reply = "Sudharshan leads two technology ventures: 1. SUDHARSHANTECH (CODE. CREATE. ELEVATE.) - technology, cybersecurity and software engineering brand deployed at https://sudharshan-tech.onrender.com/. 2. ZENTRIQ - Tech Solutions Venture pioneering enterprise cloud architectures and secure microservices.";
                } else if (q.includes('project') || q.includes('built') || q.includes('credsense')) {
                    reply = "Key verified projects: CredSense AI (Git Secret Detection SAST live on Render), AI Cybersecurity Threat Detection (FastAPI & Scikit-learn), DRISHTI 360 (Farm-to-Market Agri Vision & QR passports), NidhiVizh (Financial Risk Investigation), Hackademia (AI Exam Invigilation - National AI Hackathon Top 50 Finalist), and TaskGuard (Enterprise Spring Boot task watchdog).";
                } else {
                    reply = `Inquiry received for: "${prompt}". Sudharshan specializes in AI/ML, defensive cybersecurity engineering, full-stack architectures (FastAPI, React, Spring Boot), and technology startups. Feel free to explore his projects in Spread 2 or contact him directly via email!`;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    reply: reply,
                    timestamp: new Date().toISOString()
                }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid payload.' }));
            }
        });
        return;
    }

    // ==========================================
    // FRONTEND STATIC ASSET SERVING
    // ==========================================
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    filePath = path.normalize(filePath);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback to index.html for SPA routes or 404
            if (pathname !== '/favicon.ico') {
                const indexPath = path.join(__dirname, 'index.html');
                fs.readFile(indexPath, (readErr, content) => {
                    if (readErr) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(content);
                    }
                });
            } else {
                res.writeHead(404);
                res.end();
            }
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Add Cache-Control headers
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`⚡ SUDHARSHAN P S PORTFOLIO SERVER IS RUNNING`);
    console.log(`🌐 Frontend URL: http://localhost:${PORT}/`);
    console.log(`🛠️ Backend API:  http://localhost:${PORT}/api/health`);
    console.log(`📬 Contact API:  http://localhost:${PORT}/api/contact`);
    console.log(`=======================================================`);
});
