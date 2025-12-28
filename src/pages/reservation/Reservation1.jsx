import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

const ReservationPage = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [contact, setContact] = useState('');

  return (
    <Box
      sx={{
        backgroundImage: `url('src/assets/background-image.png')`, // Path to the background image in the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent white background for the form
          borderRadius: '8px',
          padding: '20px',
          width: '350px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px' }}>
          Make a Reservation
        </Typography>

        {/* Date Input */}
        <TextField
          label="Select Date DD/MM/YYYY"
          variant="outlined"
          fullWidth
          type="date"
          sx={{ marginBottom: '20px' }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Time Input */}
        <TextField
          label="Select Time"
          variant="outlined"
          fullWidth
          type="time"
          sx={{ marginBottom: '20px' }}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        {/* Contact Number Input */}
        <TextField
          label="Contact Number"
          variant="outlined"
          fullWidth
          type="tel"
          sx={{ marginBottom: '20px' }}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        {/* Confirm Reservation Button */}
        <Button variant="contained" color="primary" fullWidth>
          Confirm Reservation
        </Button>
      </Box>
    </Box>
  );
};

export default ReservationPage;
