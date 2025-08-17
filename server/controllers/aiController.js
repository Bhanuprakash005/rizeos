const { GoogleGenerativeAI } = require('@google/generative-ai');

const SKILLS = [
	"React","JavaScript","TypeScript","Node.js","Express","MongoDB","Mongoose","GraphQL","Redux","Next.js","Tailwind","Jest","Cypress","Python","Django","Flask","FastAPI","TensorFlow","PyTorch","Java","Spring","Kotlin","Swift","C","C++","C#",".NET","Go","Rust","Solidity","Web3","Ethers.js","Hardhat","Solana","Anchor","PostgreSQL","MySQL","SQLite","Redis","Kafka","Docker","Kubernetes","AWS","GCP","Azure","Terraform","GitHub Actions","Linux","Nginx","Figma","UI/UX","Agile","Scrum","Storybook","Turborepo","Microservices"
];

function buildGenAI() {
	if (!process.env.GEMINI_API_KEY) return null;
	try { return new GoogleGenerativeAI(process.env.GEMINI_API_KEY); } catch { return null }
}

// POST /api/ai/extract-skills
async function extractSkills(req, res) {
	try {
		const { text } = req.body || {};
		if (!text || typeof text !== 'string') {
			return res.status(400).json({ message: 'text is required' });
		}
		const genAI = buildGenAI();
		if (genAI) {
			try {
				const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
				const prompt = `Extract a list of common tech skills present in the following bio. Only return a JSON array of strings. If none, return []. Skills to consider include but are not limited to: ${SKILLS.join(', ')}. Bio: """${text}"""`;
				const result = await model.generateContent(prompt);
				const output = result.response.text();
				const json = JSON.parse(output.replace(/```json|```/g, ''));
				const normalized = Array.from(new Set(json.map((s) => String(s).trim())));
				return res.json({ skills: normalized });
			} catch (e) {
				// fallback to keyword scan
			}
		}
		const lower = text.toLowerCase();
		const found = Array.from(new Set(SKILLS.filter(s => lower.includes(s.toLowerCase()))));
		return res.json({ skills: found });
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

// POST /api/ai/normalize-location
async function normalizeLocation(req, res) {
	try {
		const { location } = req.body || {};
		if (!location) return res.status(400).json({ message: 'location is required' });
		const genAI = buildGenAI();
		if (!genAI) return res.json({ normalized: location });
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		const prompt = `Normalize this location to the format "City, Country" using common names only. Reply with raw text only: ${location}`;
		const result = await model.generateContent(prompt);
		const text = result.response.text().trim();
		return res.json({ normalized: text });
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

module.exports = { extractSkills, normalizeLocation };

// POST /api/ai/near
async function areLocationsNear(req, res) {
	try {
		const { a, b } = req.body || {};
		if (!a || !b) return res.status(400).json({ message: 'a and b are required' });
		const genAI = buildGenAI();
		if (genAI) {
			const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
			const prompt = `Do these two places refer to locations within the same metropolitan area (roughly within 50km)? Reply strictly with JSON {"near": true|false}. A: ${a} B: ${b}`;
			try {
				const result = await model.generateContent(prompt);
				const txt = result.response.text();
				const json = JSON.parse(txt.replace(/```json|```/g, ''));
				return res.json({ near: !!json.near });
			} catch {}
		}
		// Fallback: basic compare
		const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9, ]/g, '').trim();
		const A = norm(a), B = norm(b);
		return res.json({ near: A === B || A.includes(B) || B.includes(A) });
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

module.exports.areLocationsNear = areLocationsNear;


