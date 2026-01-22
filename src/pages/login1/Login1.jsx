import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import axios from '../../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/auth/login', {
        username: username.trim(),
        password: password.trim()
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });

      // Assuming response.data contains user data with role
      const { role } = response.data;
      const custName = response.data.username;
      // localStorage.setItem("name",JSON.stringify(custName))
      localStorage.setItem("name",custName)


      

      
      // Navigate based on role
      switch(role) {
        case 'user':
          navigate('/customer');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'manager':
          navigate('/OrderDashboard');
          break;
        default:
          navigate('/customer');
      }

    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const naviToSinupPage = () => {
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('src/assets/login-background.png')`, 
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
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '8px',
          padding: '20px',
          width: '300px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px', color:"black" }}>
          Welcome Back
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ marginBottom: '10px' }}>
            {error}
          </Typography>
        )}
        
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '20px' }}
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ marginBottom: '10px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Typography sx={{ color:"black" }} variant="body2">
          Don't have an account?{' '}
          <Button onClick={naviToSinupPage} color="primary" sx={{ padding: '0' }}>
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
