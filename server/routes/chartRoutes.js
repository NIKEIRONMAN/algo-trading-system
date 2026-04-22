const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');
const PriceHistory = require('../models/PriceHistory');

const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/charts/:symbol
// @desc    Get last 30 days price history (OHLC) for charting
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:symbol', protect, async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase().trim();

    // Check if we have fresh data (today's data exists)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingData = await PriceHistory.find({
      symbol,
      date: { $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: 1 });

    // If we have data and it includes today or yesterday (market may be closed), return cached
    if (existingData.length >= 15) {
      const latestDate = new Date(existingData[existingData.length - 1].date);
      const ageHours = (Date.now() - latestDate.getTime()) / (1000 * 60 * 60);

      // If latest data is less than 24 hours old, use cache
      if (ageHours < 24) {
        console.log(`[Charts] Cache HIT → ${symbol} (${existingData.length} points)`);
        return res.json(
          existingData.map((d) => ({
            date: d.date.toISOString().split('T')[0],
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }))
        );
      }
    }

    // Fetch from Yahoo Finance
    console.log(`[Charts] Fetching from Yahoo → ${symbol}`);
    const url = `${YAHOO_BASE}/${symbol}?range=1mo&interval=1d`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
    });

    const result = data?.chart?.result?.[0];
    if (!result) {
      return res.status(404).json({ message: `No chart data found for ${symbol}` });
    }

    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    const currency = result.meta?.currency || 'INR';

    const chartData = [];

    for (let i = 0; i < timestamps.length; i++) {
      const open = quotes.open?.[i];
      const high = quotes.high?.[i];
      const low = quotes.low?.[i];
      const close = quotes.close?.[i];

      // Skip null/invalid entries (holidays, etc.)
      if (open == null || high == null || low == null || close == null) continue;

      const date = new Date(timestamps[i] * 1000);
      date.setHours(0, 0, 0, 0);

      chartData.push({
        date,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
      });
    }

    // Save to PriceHistory (upsert to avoid duplicates)
    for (const point of chartData) {
      await PriceHistory.findOneAndUpdate(
        { symbol, date: point.date },
        {
          symbol,
          date: point.date,
          open: point.open,
          high: point.high,
          low: point.low,
          close: point.close,
          currency,
        },
        { upsert: true }
      );
    }

    console.log(`[Charts] Saved ${chartData.length} data points for ${symbol}`);

    res.json(
      chartData.map((d) => ({
        date: d.date.toISOString().split('T')[0],
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );
  } catch (error) {
    console.error(`[Charts] Error for ${req.params.symbol}:`, error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
