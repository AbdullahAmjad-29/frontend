import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Rating,
  Paper,
  Grid,
  IconButton,
  Divider,
  Avatar,
  Chip,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [foodQuality, setFoodQuality] = useState(0);
  const [serviceQuality, setServiceQuality] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emojiRating, setEmojiRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const emojiOptions = [
    { icon: <SentimentVeryDissatisfiedIcon fontSize="large" />, label: 'Very Bad', value: 1 },
    { icon: <SentimentDissatisfiedIcon fontSize="large" />, label: 'Bad', value: 2 },
    { icon: <SentimentNeutralIcon fontSize="large" />, label: 'Okay', value: 3 },
    { icon: <SentimentSatisfiedIcon fontSize="large" />, label: 'Good', value: 4 },
    { icon: <SentimentVerySatisfiedIcon fontSize="large" />, label: 'Excellent', value: 5 },
  ];

  const categories = [
    { label: 'Food Quality', value: foodQuality, setter: setFoodQuality, icon: <LocalDiningIcon />, color: '#FF6B6B' },
    { label: 'Service', value: serviceQuality, setter: setServiceQuality, icon: <EmojiFoodBeverageIcon />, color: '#45B7D1' },
    { label: 'Cleanliness', value: cleanliness, setter: setCleanliness, icon: <CleaningServicesIcon />, color: '#96CEB4' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log({
      rating,
      foodQuality,
      serviceQuality,
      cleanliness,
      feedback,
      name,
      email,
      emojiRating
    });
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      navigate('/customer');
    }, 3000);
  };

  const getEmojiLabel = (value) => {
    const emoji = emojiOptions.find(e => e.value === value);
    return emoji ? emoji.label : 'Select';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(to right, #FF6B6B, #FF8E53)',
              py: 3,
              px: 4,
              color: 'white',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={() => navigate('/customer')}
              sx={{
                position: 'absolute',
                left: 20,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Box sx={{ textAlign: 'center' }}>
              <RestaurantIcon sx={{ fontSize: 60, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Your Feedback Matters
              </Typography>
              <Typography variant="subtitle1">
                Help us improve your dining experience
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            {submitted ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SentimentVerySatisfiedIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 3 }} />
                <Typography variant="h4" sx={{ color: '#4CAF50', mb: 2, fontWeight: 'bold' }}>
                  Thank You!
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
                  Your feedback has been submitted successfully
                </Typography>
                <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="body2" sx={{ color: '#999', mt: 2 }}>
                  Redirecting you back to the menu...
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Overall Experience */}
                <Card sx={{ mb: 4, borderRadius: 3, borderLeft: '6px solid #FF6B6B' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                      How was your overall experience?
                    </Typography>
                    
                    {/* Emoji Rating */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                        {emojiOptions.map((emoji) => (
                          <IconButton
                            key={emoji.value}
                            onClick={() => setEmojiRating(emoji.value)}
                            sx={{
                              backgroundColor: emojiRating === emoji.value ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                              border: emojiRating === emoji.value ? '2px solid #FF6B6B' : '2px solid #ddd',
                              borderRadius: 3,
                              p: 2,
                              '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                              },
                            }}
                          >
                            <Box sx={{ color: emojiRating === emoji.value ? '#FF6B6B' : '#999' }}>
                              {emoji.icon}
                            </Box>
                          </IconButton>
                        ))}
                      </Box>
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        {getEmojiLabel(emojiRating)}
                      </Typography>
                    </Box>

                    {/* Star Rating */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Rating
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                        size="large"
                        icon={<StarIcon sx={{ fontSize: 40 }} />}
                        emptyIcon={<StarBorderIcon sx={{ fontSize: 40 }} />}
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#FFD700',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                        {rating > 0 ? `${rating} out of 5 stars` : 'Rate your experience'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Category Ratings */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {categories.map((category) => (
                    <Grid item xs={12} md={4} key={category.label}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          textAlign: 'center',
                          borderTop: `4px solid ${category.color}`,
                        }}
                      >
                        <Box sx={{ color: category.color, mb: 2 }}>
                          {category.icon}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                          {category.label}
                        </Typography>
                        <Rating
                          value={category.value}
                          onChange={(event, newValue) => category.setter(newValue)}
                          size="medium"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: category.color,
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
                          {category.value > 0 ? `${category.value} stars` : 'Not rated'}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Feedback Form */}
                <Card sx={{ mb: 4, borderRadius: 3, borderLeft: '6px solid #45B7D1' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                      Tell us more
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          variant="outlined"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          variant="outlined"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Feedback"
                          variant="outlined"
                          multiline
                          rows={4}
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="What did you like? What can we improve?"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                          Your honest feedback helps us serve you better
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/customer')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: '#FF6B6B',
                      color: '#FF6B6B',
                      '&:hover': {
                        borderColor: '#FF5252',
                        backgroundColor: 'rgba(255, 107, 107, 0.05)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!emojiRating}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      background: 'linear-gradient(to right, #FF6B6B, #FF8E53)',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(to right, #FF5252, #FF7B3A)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
                      },
                    }}
                  >
                    Submit Feedback
                  </Button>
                </Box>
              </form>
            )}

            {/* Footer Note */}
            {!submitted && (
              <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: '1px solid #eee' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  <strong>Privacy Note:</strong> Your feedback is anonymous unless you choose to provide contact information.
                  We use your feedback solely to improve our services.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Stats Preview */}
        {!submitted && (
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="h6" sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                  

                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Average Rating
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="h6" sx={{ color: '#45B7D1', fontWeight: 'bold' }}>
                  2,340+
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Happy Customers
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="h6" sx={{ color: '#96CEB4', fontWeight: 'bold' }}>
                  98%
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Would Recommend
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="h6" sx={{ color: '#FF8E53', fontWeight: 'bold' }}>
                  4.9
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Food Quality
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FeedbackPage;