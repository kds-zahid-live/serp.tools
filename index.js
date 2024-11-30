const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// API to fetch headings from links
app.post('/', async (req, res) => {
    const { links } = req.body; // Expecting { links: ["https://example.com", ...] }
    if (!Array.isArray(links)) {
        return res.status(400).json({ error: 'Links should be an array.' });
    }

    const results = [];

    for (const link of links) {
        try {
            const response = await axios.get(link);
            const $ = cheerio.load(response.data);

            const h1 = $('h1').map((_, el) => $(el).text().trim()).get();
            const h2 = $('h2').map((_, el) => $(el).text().trim()).get();
            const h3 = $('h3').map((_, el) => $(el).text().trim()).get();

            results.push({ link, h1, h2, h3 });
        } catch (error) {
            results.push({ link, error: error.message });
        }
    }

    res.json(results);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
