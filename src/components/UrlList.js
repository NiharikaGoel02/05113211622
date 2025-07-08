import React from 'react';
import { Typography, List, ListItem, Link } from '@mui/material';

const UrlList = ({ urls }) => {
  return (
    <>
      <Typography variant="h5" sx={{mt:4}}>Shortened URLs</Typography>
      <List>
        {urls.map((url, index) => (
          <ListItem key={index}>
            <Link href={`/${url.shortcode}`} target="_blank" rel="noopener">
              {window.location.origin}/{url.shortcode}
            </Link>
            &nbsp;| Expires at: {new Date(url.expiryAt).toLocaleString()}
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default UrlList;
