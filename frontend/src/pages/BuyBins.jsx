import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  Rating,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const BuyBins = () => {
  const [selectedBinType, setSelectedBinType] = useState(null);

  const bins = [
    {
      id: 1,
      name: 'Wet Waste Bin',
      type: 'Wet Waste',
      color: '#8BC34A',
      icon: '🟢',
      description: 'For food scraps, kitchen waste, and organic material',
      features: ['Biodegradable', 'Composting ready', 'Strong handle'],
      price: '₹299 - ₹599',
      amazonLink: 'https://www.amazon.in/s?k=green+dustbin+wet+waste',
      rating: 4.5,
      reviews: 1250,
    },
    {
      id: 2,
      name: 'Dry Waste Bin',
      type: 'Dry Waste',
      color: '#FFB74D',
      icon: '🟡',
      description: 'For paper, cardboard, plastic, and recyclable materials',
      features: ['Large capacity', 'Easy to clean', 'Weather resistant'],
      price: '₹349 - ₹699',
      amazonLink: 'https://www.amazon.in/s?k=yellow+dustbin+dry+waste',
      rating: 4.6,
      reviews: 980,
    },
    {
      id: 3,
      name: 'Hazardous Waste Bin',
      type: 'Hazardous Waste',
      color: '#F44336',
      icon: '🔴',
      description: 'For medical waste, sharp objects, and chemical materials',
      features: ['Biohazard symbol', 'Leak-proof', 'Secure lid'],
      price: '₹499 - ₹899',
      amazonLink: 'https://www.amazon.in/s?k=red+hazardous+waste+bin',
      rating: 4.4,
      reviews: 650,
    },
    {
      id: 4,
      name: 'E-Waste Bin',
      type: 'E-Waste',
      color: '#9C27B0',
      icon: '🟣',
      description: 'Specially designed for electronic waste, batteries, and gadgets',
      features: ['Anti-static', 'Compartments', 'Recycling certified'],
      price: '₹599 - ₹1299',
      amazonLink: 'https://www.amazon.in/s?k=electronic+waste+bin+purple',
      rating: 4.3,
      reviews: 420,
    },
    {
      id: 5,
      name: 'Segregated Bins Set',
      type: 'Combo Pack',
      color: '#2196F3',
      icon: '🟦',
      description: 'Complete set with wet, dry, and hazardous waste bins',
      features: ['4-in-1 solution', 'Space saving', 'Color coded'],
      price: '₹1299 - ₹1999',
      amazonLink: 'https://www.amazon.in/s?k=segregated+dustbin+set+4+compartment',
      rating: 4.7,
      reviews: 2100,
    },
    {
      id: 6,
      name: 'Pedal Bin',
      type: 'Premium',
      color: '#00BCD4',
      icon: '🟦',
      description: 'Foot-operated bin for hands-free waste disposal',
      features: ['Foot pedal', 'Stainless steel', 'Hygienic'],
      price: '₹799 - ₹1499',
      amazonLink: 'https://www.amazon.in/s?k=pedal+dustbin+stainless+steel',
      rating: 4.5,
      reviews: 1540,
    },
    {
      id: 7,
      name: 'Biodegradable Bags',
      type: 'Accessories',
      color: '#4CAF50',
      icon: '📦',
      description: 'Eco-friendly biodegradable bags for waste segregation',
      features: ['100% biodegradable', 'Various sizes', 'Recycled material'],
      price: '₹199 - ₹399',
      amazonLink: 'https://www.amazon.in/s?k=biodegradable+dustbin+bags',
      rating: 4.6,
      reviews: 3200,
    },
    {
      id: 8,
      name: 'Wall-mounted Bin',
      type: 'Compact',
      color: '#FF5722',
      icon: '📍',
      description: 'Space-saving wall-mounted bin for small areas',
      features: ['Compact design', 'Easy installation', 'Modern look'],
      price: '₹249 - ₹499',
      amazonLink: 'https://www.amazon.in/s?k=wall+mounted+dustbin',
      rating: 4.4,
      reviews: 890,
    },
  ];

  const handleBuyNow = (amazonLink) => {
    window.open(amazonLink, '_blank');
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #0E7C3B 0%, #2E7D32 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🛒 Get Your Perfect Dustbin
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#666', mb: 2, fontSize: '1.1rem' }}
          >
            Quality bins for effective waste segregation and management
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Chip
              label="🟢 Wet Waste"
              sx={{ backgroundColor: '#8BC34A', color: 'white', fontWeight: 600 }}
            />
            <Chip
              label="🟡 Dry Waste"
              sx={{ backgroundColor: '#FFB74D', color: 'white', fontWeight: 600 }}
            />
            <Chip
              label="🔴 Hazardous"
              sx={{ backgroundColor: '#F44336', color: 'white', fontWeight: 600 }}
            />
            <Chip
              label="🟣 E-Waste"
              sx={{ backgroundColor: '#9C27B0', color: 'white', fontWeight: 600 }}
            />
          </Box>
        </Box>

        {/* Filter Section */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant={selectedBinType === null ? 'contained' : 'outlined'}
            onClick={() => setSelectedBinType(null)}
            sx={{
              backgroundColor: selectedBinType === null ? '#0E7C3B' : 'transparent',
              color: selectedBinType === null ? 'white' : '#0E7C3B',
              borderColor: '#0E7C3B',
              '&:hover': {
                backgroundColor: selectedBinType === null ? '#0E7C3B' : 'transparent',
              },
            }}
          >
            All Bins
          </Button>
          {['Wet Waste', 'Dry Waste', 'Hazardous Waste', 'E-Waste', 'Combo Pack', 'Premium', 'Accessories', 'Compact'].map(
            (type) => (
              <Button
                key={type}
                variant={selectedBinType === type ? 'contained' : 'outlined'}
                onClick={() => setSelectedBinType(type)}
                sx={{
                  backgroundColor: selectedBinType === type ? '#0E7C3B' : 'transparent',
                  color: selectedBinType === type ? 'white' : '#0E7C3B',
                  borderColor: '#0E7C3B',
                  '&:hover': {
                    backgroundColor: selectedBinType === type ? '#0E7C3B' : 'transparent',
                  },
                }}
              >
                {type}
              </Button>
            )
          )}
        </Box>

        {/* Bins Grid */}
        <Grid container spacing={3}>
          {bins
            .filter((bin) => selectedBinType === null || bin.type === selectedBinType)
            .map((bin) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={bin.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: `5px solid ${bin.color}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {/* Bin Icon/Image */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${bin.color}33 0%, ${bin.color}66 100%)`,
                      height: 150,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '64px',
                    }}
                  >
                    {bin.icon}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Bin Type Badge */}
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={bin.type}
                        size="small"
                        sx={{
                          backgroundColor: `${bin.color}33`,
                          color: bin.color,
                          fontWeight: 600,
                          border: `1px solid ${bin.color}`,
                        }}
                      />
                    </Box>

                    {/* Bin Name */}
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}
                    >
                      {bin.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{ color: '#666', mb: 2, lineHeight: 1.5 }}
                    >
                      {bin.description}
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={bin.rating} readOnly size="small" />
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        {bin.rating} ({bin.reviews.toLocaleString()})
                      </Typography>
                    </Box>

                    {/* Features */}
                    <Box sx={{ mb: 2 }}>
                      {bin.features.map((feature, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 0.5,
                            color: '#555',
                          }}
                        >
                          ✓ {feature}
                        </Typography>
                      ))}
                    </Box>

                    {/* Price */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#0E7C3B',
                        mb: 2,
                      }}
                    >
                      {bin.price}
                    </Typography>

                    {/* Buy Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleBuyNow(bin.amazonLink)}
                      sx={{
                        backgroundColor: bin.color,
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: bin.color,
                          opacity: 0.9,
                        },
                      }}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Benefits Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 4, textAlign: 'center', color: '#1a1a1a' }}
          >
            Why Choose Our Bins?
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '40px', mb: 1 }}>♻️</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Eco-Friendly
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Made from recycled and sustainable materials
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '40px', mb: 1 }}>🎯</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Color-Coded
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Easy waste segregation following standards
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '40px', mb: 1 }}>💪</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Durable
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  High-quality construction for long-lasting use
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '40px', mb: 1 }}>🚚</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Quick Amazon Prime delivery available
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0E7C3B 0%, #2E7D32 100%)',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Start Your Waste Segregation Journey Today! 🌍
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
            Invest in quality bins and make a difference in environmental management
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            startIcon={<LocalShippingIcon />}
            onClick={() => window.open('https://www.amazon.in/s?k=dustbin', '_blank')}
            sx={{
              backgroundColor: 'white',
              color: '#0E7C3B',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            View More on Amazon
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BuyBins;
