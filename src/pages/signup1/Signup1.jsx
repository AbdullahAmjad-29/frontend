import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import axios from '../../api/axios';

const SignUpPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const naviToLoginPage = () => {
        navigate('/');
    };

    const handleSignup = async () => {
        setError('');
        setSuccess('');

        // Basic frontend validation
        if (!username || !email || !password || !phone) {
            setError('All fields are required.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (!/^\d{11}$/.test(phone)) {
            setError('Phone number must be 11 digits.');
            return;
        }

        try {
            const response = await axios.post('/auth/register', {
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                phone: phone.trim(),
                role: 'user'
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            setSuccess(response.data.message);

            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        }
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
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '320px',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, color: 'black' }}>
                    Sign Up
                </Typography>

                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="success.main">{success}</Typography>}

                <TextField
                    label="Username"
                    fullWidth
                    sx={{ mb: 1 }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    label="Email"
                    fullWidth
                    sx={{ mb: 1 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Phone"
                    fullWidth
                    sx={{ mb: 1 }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSignup}
                >
                    Sign Up
                </Button>

                <Typography variant="body2" sx={{ mt: 1, color: 'black' }}>
                    Already have an account?{' '}
                    <Button onClick={naviToLoginPage} sx={{ p: 0, textTransform: 'none' }}>
                        Log In
                    </Button>
                </Typography>
            </Box>
        </Box>
    );
};

export default SignUpPage;
