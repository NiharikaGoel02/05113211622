import React from 'react';
import { Typography, List, ListItem } from '@mui/material';

const StatisticsPage = ({ stats }) => {
  return (
    <>
      <Typography variant="h4" sx={{mt:4}}>URL Statistics</Typography>
      <List>
        {stats.map((stat, index) => (
          <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="h6">
              Short URL: {window.location.origin}/{stat.shortcode}
            </Typography>
            <Typography variant="body2">
              Created At: {new Date(stat.createdAt).toLocaleString()} | Expires At: {new Date(stat.expiryAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              Total Clicks: {stat.clicks.length}
            </Typography>
            <List sx={{pl:4}}>
              {stat.clicks.map((click, idx) => (
                <ListItem key={idx} sx={{display:'list-item'}}>
                  {click.timestamp} | Source: {click.source} | Location: {click.location}
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default StatisticsPage;
