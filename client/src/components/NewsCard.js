import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

function NewsCard({ title, description, url, image, publishedAt, source, content }) {
  const [summary, setSummary] = useState('');
  const [bullets, setBullets] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSummary(''); setBullets(''); setSentiment(''); setError('');
  }, [content, description]);

  const handleSummarize = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/ai/summarize', { content, description });
      setSummary(res.data.summary);
      setBullets(res.data.bulletPoints);
      setSentiment(res.data.sentiment);
    } catch {
      setError('Failed to summarize');
    }
    setLoading(false);
  };

  const badge = sentiment === 'Positive' ? (<Badge bg="success">👍 Positive</Badge>)
    : sentiment === 'Negative' ? (<Badge bg="danger">👎 Negative</Badge>)
    : (<Badge bg="secondary">😐 Neutral</Badge>);

  return (
    <Card className="h-100 shadow-sm mb-4">
      {image && <Card.Img variant="top" src={image} style={{ maxHeight:'180px', objectFit:'cover' }} />}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <div className="mt-auto mb-3">
          <a href={url} target="_blank" rel="noopener noreferrer"
             className="btn btn-sm btn-outline-primary me-2">Read More</a>
          <Button size="sm" variant="success" onClick={handleSummarize} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Summarize'}
          </Button>
        </div>

        {summary && (
          <div className="mt-2 p-3 bg-light rounded border">
            <h6>📝 Summary</h6>
            <p>{summary}</p>
            <h6>📌 Key Points</h6>
            <ul>{bullets.split('\n').map((b,i) => <li key={i}>{b.replace(/^•\s*/, '')}</li>)}</ul>
            <div className="mt-2">📊 Sentiment: {badge}</div>
          </div>
        )}

        {error && <p className="text-danger mt-2">{error}</p>}

        <p className="text-muted mt-3 mb-0" style={{ fontSize:'0.8rem' }}>
          Source: {source?.name}<br/>
          {new Date(publishedAt).toLocaleString()}
        </p>
      </Card.Body>
    </Card>
  );
}

export default NewsCard;
