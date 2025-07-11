import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { generateShortcode } from './utils/urlUtils';
import UrlList from './components/UrlList';
import StatisticsPage from './components/StatisticsPage';
import RedirectHandler from './components/RedirectHandler';
import { Log } from './utils/loggerMiddleware';

// 🔴 COPY your ShortenerForm component here:
const ShortenerForm = ({ onShorten, existingCodes }) => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const handleAdd = () => {
    if (urls.length < 5) setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validated = urls.map((url) => {
      if (!url.longUrl.startsWith('http')) {
        alert('Invalid URL format.');
        return null;
      }
      const validity = url.validity ? parseInt(url.validity) : 30;
      const shortcode = url.shortcode || generateShortcode([...existingCodes, ...urls.map(u => u.shortcode)]);
      return { ...url, validity, shortcode };
    }).filter(Boolean);

    try {
      await Log("frontend", "info", "api", `ShortenSubmit: ${JSON.stringify(validated)}`);
    } catch (logError) {
      console.error("Logging failed:", logError);
    }

    onShorten(validated);
    setUrls([{ longUrl: '', validity: '', shortcode: '' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      {urls.map((url, index) => (
        <Grid container spacing={2} key={index} alignItems="center" sx={{mb:2}}>
          <Grid item xs={12}><Typography variant="h6">URL {index + 1}</Typography></Grid>
          <Grid item xs={4}>
            <TextField
              label="Long URL"
              fullWidth
              required
              value={url.longUrl}
              onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Validity (min)"
              type="number"
              fullWidth
              value={url.validity}
              onChange={(e) => handleChange(index, 'validity', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Preferred Shortcode"
              fullWidth
              value={url.shortcode}
              onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
            />
          </Grid>
        </Grid>
      ))}
      <Button onClick={handleAdd} disabled={urls.length >= 5}>Add More</Button>
      <Button variant="contained" type="submit" sx={{ml:2}}>Shorten URLs</Button>
    </form>
  );
};

function App() {
  const [urlMappings, setUrlMappings] = useState([]);

  const handleShorten = (newUrls) => {
    const now = new Date();

    const added = newUrls.map(u => {
      const createdAt = now.toISOString();
      const expiryAt = new Date(now.getTime() + u.validity * 60000).toISOString();

      Log('frontend', 'info', 'api', `URLShortened: ${u.shortcode}`);

      return {
        ...u,
        createdAt,
        expiryAt,
        clicks: []
      };
    });

    setUrlMappings(prev => [...prev, ...added]);
  };

  const existingCodes = urlMappings.map(u => u.shortcode);

  return (
    <Router>
      <Container>
        <Typography variant="h3" sx={{my:4}}>React URL Shortener</Typography>
        <Routes>
          <Route path="/" element={
            <>
              <ShortenerForm onShorten={handleShorten} existingCodes={existingCodes} />
              <UrlList urls={urlMappings} />
            </>
          }/>
          <Route path="/stats" element={<StatisticsPage stats={urlMappings} />} />
          <Route path="/:shortcode" element={<RedirectHandler urlMappings={urlMappings} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
