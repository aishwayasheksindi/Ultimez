import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './components/NewsCard';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [news, setNews] = useState([]);
  const [topic, setTopic] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState('');

  const fetchNews = async () => {
    setDateError('');
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setDateError('From Date cannot be after To Date.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('/api/news', {
        params: {
          topic,
          country,
          category,
          from: fromDate,
          to: toDate
        }
      });
      setNews(res.data.articles || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setTopic('');
    setCountry('');
    setCategory('');
    setFromDate('');
    setToDate('');
    setNews([]);
    setDateError('');
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div style={{ background: '#eef1f7', minHeight: '100vh' }}>
      <Container className="py-4">
        <h2 className="text-center" style={{ color: '#0d6efd' }}>
          📰 FlashRead – AI News Digest
        </h2>
        <p className="text-center text-muted fst-italic">Smart. Fast. Focused.</p>
        <div className="bg-white p-3 rounded shadow-sm mb-4">
          <p className="mb-0 text-dark">
            <strong>Welcome to FlashRead – Your AI‑Powered News Digest.</strong><br />
            FlashRead helps you stay informed with top headlines from selected countries. You can choose a country, category, or enter a custom topic (like “AI” or “Elections in India”) using the search bar. Optional From/To Date filters help narrow your news. Each article comes with an AI‑generated summary, 3 key points, and sentiment analysis (Positive, Neutral, or Negative) to help you absorb information quickly. Click Read More to view the full article. It's smart, fast, and focused — just like you!
          </p>
        </div>

        <Form.Group className="mb-3">
          <Form.Control
            placeholder="Search topic (e.g. AI, elections...)"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Select value={country} onChange={e => setCountry(e.target.value)}>
              <option value="">Select Country</option>
              <option value="us">United States</option>
              <option value="in">India</option>
              <option value="gb">United Kingdom</option>
              <option value="au">Australia</option>
              <option value="ca">Canada</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="general">General</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>From Date</Form.Label>
            <Form.Control type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </Col>
          <Col md={2}>
            <Form.Label>To Date</Form.Label>
            <Form.Control type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button variant="primary" onClick={fetchNews} disabled={loading} className="me-2">
              {loading ? 'Loading…' : 'Search'}
            </Button>
            <Button variant="secondary" onClick={clearAll} disabled={loading}>Clear</Button>
          </Col>
        </Row>

        {dateError && <Alert variant="danger">{dateError}</Alert>}

        {loading ? (
          <div className="text-center mt-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Fetching news, please wait...</p>
          </div>
        ) : (
          <Row className="gy-4">
            {news.length ? news.map((a, i) => (
              <Col key={i} md={6} lg={4}>
                <NewsCard {...a} />
              </Col>
            )) : (
              <p className="text-center mt-4">No news articles available.</p>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default App;

