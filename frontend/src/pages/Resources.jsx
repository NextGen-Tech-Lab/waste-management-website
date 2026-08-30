import { Box, Container, Typography, Card, CardContent, Grid, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Resources = () => {
  const navigate = useNavigate();

  const resourceCategories = [
    {
      title: 'Educational Materials',
      icon: '📚',
      route: '/resources/educational-materials',
      items: [
        { name: 'Waste Management Guide', description: 'Comprehensive guide on waste segregation, collection, and disposal' },
        { name: 'Recycling Handbook', description: 'Step-by-step instructions for recycling various materials' },
        { name: 'Video Tutorials', description: 'Learn proper waste management practices through videos' },
        { name: 'Infographics', description: 'Visual guides for waste separation and environmental impact' },
      ],
    },
    {
      title: 'Policy Documents',
      icon: '📋',
      route: '/resources/policy-documents',
      items: [
        { name: 'Solid Waste Management Rules 2016', description: 'Official government rules and regulations' },
        { name: 'Plastic Waste Management Guidelines', description: 'Guidelines for reducing plastic waste' },
        { name: 'E-Waste Disposal Procedures', description: 'Proper methods for electronic waste management' },
        { name: 'Biomedical Waste Standards', description: 'Health and safety standards for medical waste' },
      ],
    },
    {
      title: 'Tools & Calculators',
      icon: '🛠️',
      route: '/resources/tools-calculators',
      items: [
        { name: 'Carbon Footprint Calculator', description: 'Calculate your environmental impact' },
        { name: 'Waste Reduction Tracker', description: 'Monitor your waste reduction progress' },
        { name: 'Recycling Rate Calculator', description: 'Evaluate recycling efficiency' },
        { name: 'Composting Guide', description: 'Learn how to compost at home' },
      ],
    },
    {
      title: 'Community Resources',
      icon: '👥',
      route: '/resources/community-resources',
      items: [
        { name: 'Local Recycling Centers', description: 'Find nearest collection and recycling facilities' },
        { name: 'Volunteer Programs', description: 'Join community cleanup and awareness initiatives' },
        { name: 'NGO Partnerships', description: 'Connect with environmental organizations' },
        { name: 'Community Forums', description: 'Discuss and share best practices' },
      ],
    },
  ];

  const faqItems = [
    {
      question: 'How do I segregate waste at home?',
      answer: 'Waste should be segregated into four categories: Wet waste (organic matter), Dry waste (paper, plastic, glass, metal), Hazardous waste (batteries, chemicals), and Construction waste. Use separate bins for each category.',
    },
    {
      question: 'Where can I find the nearest waste collection center?',
      answer: 'You can use our Bins Near Me feature in the app or visit the Community Resources section to locate the nearest recycling centers and waste collection facilities in your area.',
    },
    {
      question: 'What items can be recycled?',
      answer: 'Most recyclable items include paper, cardboard, plastic bottles, glass, aluminum cans, and metals. However, contaminated or soiled items should not be recycled. Check with your local facility for specific guidelines.',
    },
    {
      question: 'How do I report waste management issues?',
      answer: 'You can submit complaints through our complaint management system in the app. Provide details about the issue, location, and attach photos. Our team will investigate and take appropriate action.',
    },
    {
      question: 'Is there a fee for using the platform?',
      answer: 'No, EcoManage is a free public service designed to help citizens and municipalities manage waste effectively and sustainably.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf8' }}>
      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Resources & Learning Hub
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, maxWidth: '600px' }}>
            Access comprehensive resources, educational materials, tools, and community support to improve your waste management practices.
          </Typography>
        </Container>
      </Box>

      {/* Resource Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {resourceCategories.map((category, idx) => (
            <Grid item xs={12} sm={6} md={6} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
                    py: 3,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Typography variant="h2">{category.icon}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                    {category.title}
                  </Typography>
                </Box>
                <CardContent>
                  {category.items.map((item, itemIdx) => (
                    <Box key={itemIdx} sx={{ mb: itemIdx < category.items.length - 1 ? 2 : 0, pb: 2, borderBottom: itemIdx < category.items.length - 1 ? '1px solid #eee' : 'none' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {item.description}
                      </Typography>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, bgcolor: '#2e7d32', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#1b5e20' } }}
                    onClick={() => navigate(category.route)}
                  >
                    Explore More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: '#1b5e20' }}>
            ❓ Frequently Asked Questions
          </Typography>
          <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {faqItems.map((faq, idx) => (
              <Accordion key={idx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: idx % 2 === 0 ? '#f8faf8' : 'white' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: '#1b5e20', display: 'flex', alignItems: 'center' }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'white', borderTop: '1px solid #e8f5e9' }}>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Call to Action */}
        <Card sx={{ background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)', p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="body1" sx={{ color: '#333', mb: 3 }}>
            Join thousands of citizens and organizations working towards a cleaner, more sustainable India.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: '#1b5e20', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#0d3817' } }}
            onClick={() => navigate('/login')}
          >
            Get Started Now
          </Button>
        </Card>
      </Container>

      {/* Footer */}
      <Box sx={{ background: '#f5f5f5', py: 4, mt: 6, borderTop: '2px solid #1b5e20' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ color: '#666' }}>
            © 2026 EcoManage India - Public Waste Management Portal. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Resources;
