const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables from .env file
require('dotenv').config();

// Initialize Express app and port
const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
app.use(express.json());

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Get the Generative Model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate contract based on templateName
async function generateContract(templateName) {
    try {
        const prompt = `Generate a solidity smart contract for ${templateName}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const contractText = await response.text();
        return contractText.trim();
    } catch (error) {
        console.error('Error generating contract:', error);
        throw new Error('Failed to generate contract');
    }
}

// Endpoint to generate contract
app.post('/generateContract', async (req, res) => {
    const { templateName } = req.body;
    try {
        if (!templateName) {
            return res.status(400).json({ error: 'templateName is required' });
        }
        const contract = await generateContract(templateName);
        res.status(200).json({ contract });
    } catch (error) {
        console.error('Error fetching contract:', error);
        res.status(500).json({ error: 'Failed to fetch contract. Please try again later.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});

