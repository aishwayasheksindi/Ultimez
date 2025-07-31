const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const categoryMap = {
  business: 'business',
  entertainment: 'entertainment',
  health: 'health',
  science: 'science',
  sports: 'sports',
  technology: 'technology',
  politics: 'politics',
   education: 'education',
};

router.get('/', async (req, res) => {
  try {
    const { country, topic, from, to } = req.query;

    const queryTopic = categoryMap[topic?.toLowerCase()] || topic || 'news';

    const params = {
      q: queryTopic,
      token: GNEWS_API_KEY,
      lang: 'en',
      max: 20,
      sortby: 'publishedAt',
    };
     if (country) {
      params.country = country;
    }

    // ✅ Fix date range to cover full 24-hour window
    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate)) {
        fromDate.setHours(0, 0, 0, 0); // 00:00:00.000
        params.from = fromDate.toISOString();
      }
    }

    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate)) {
        toDate.setHours(23, 59, 59, 999); // 23:59:59.999
        params.to = toDate.toISOString();
         }
    }

    const response = await axios.get('https://gnews.io/api/v4/search', { params });
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;