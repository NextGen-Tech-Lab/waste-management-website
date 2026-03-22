import { Box, Container, Typography, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const CommunityResources = () => {
  const navigate = useNavigate();

  const handleExplore = (resource) => {
    // Generate and download community resource guide
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(27, 94, 32);
      const titleSplit = doc.splitTextToSize(`${resource.title} - Community Guide`, pageWidth - 40);
      doc.text(titleSplit, 20, yPosition);
      yPosition += titleSplit.length * 7 + 10;

      // Add description
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Category: ${resource.category} | Active Members: ${resource.members}`, 20, yPosition);
      yPosition += 8;

      // Add separator
      doc.setDrawColor(46, 125, 50);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Add content
      const resourceGuides = {
        'Local Recycling Centers': [
          'Finding Local Recycling Facilities',
          '',
          `${resource.description}`,
          '',
          'Steps to Use Recycling Centers',
          '1. Identify accepted materials (check facility website)',
          '2. Segregate and prepare your waste',
          '3. Transport to nearest authorized center',
          '4. Follow facility-specific guidelines',
          '5. Obtain receipts if applicable',
          '',
          'What You Can Recycle',
          '• Plastic bottles and containers',
          '• Paper and cardboard',
          '• Glass and metals',
          '• Electronics (at e-waste centers)',
          '• Textiles and clothing',
          '',
          'Operating Hours',
          'Most centers operate 9 AM - 5 PM on weekdays.',
          'Call ahead to confirm availability.',
          '',
          'Benefits of Using Centers',
          '• Proper material segregation',
          '• Environmental responsibility',
          '• Community contribution',
          '• Supporting circular economy',
        ],
        'Volunteer Programs': [
          'How to Get Involved in Community Cleanup',
          '',
          `${resource.description}`,
          '',
          'Types of Volunteer Activities',
          '• Community cleanup drives',
          '• Awareness campaigns',
          '• School/college outreach programs',
          '• Park and public space maintenance',
          '• Waste segregation workshops',
          '• Environmental education initiatives',
          '',
          'Getting Started as a Volunteer',
          'Step 1: Register on our platform',
          'Step 2: Choose activities that interest you',
          'Step 3: Attend orientation/training',
          'Step 4: Participate in scheduled events',
          'Step 5: Earn recognition badges',
          '',
          'Volunteer Benefits',
          '• Certificate of participation',
          '• Community recognition',
          '• Environmental impact records',
          '• Networking opportunities',
          '• Skill development',
          '',
          'Upcoming Events',
          'Check our Events calendar monthly for new activities.',
        ],
        'NGO Partnerships': [
          'Connecting with Environmental Organizations',
          '',
          `${resource.description}`,
          '',
          'Types of NGOs',
          '• Environmental conservation organizations',
          '• Community development groups',
          '• Waste management specialists',
          '• Educational/awareness bodies',
          '• Research institutions',
          '',
          'How to Collaborate',
          '1. Browse partner organization profiles',
          '2. Contact organizations directly',
          '3. Discuss partnership opportunities',
          '4. Participate in joint initiatives',
          '5. Share outcomes and impact',
          '',
          'Partnership Benefits',
          '• Access to expertise',
          '• Funding and resources',
          '• Enhanced outreach',
          '• Shared learning',
          '• Amplified impact',
          '',
          'Featured NGOs',
          '• EcoCenter India',
          '• Green Warriors Trust',
          '• Waste Warriors Association',
          '• Clean City Initiative',
        ],
        'Community Discussion Forum': [
          'Participating in Online Discussions',
          '',
          `${resource.description}`,
          '',
          'Forum Features',
          '• Topic-based categories',
          '• User profiles and badges',
          '• Search functionality',
          '• Upvoting system',
          '• Direct messaging',
          '• Document sharing',
          '',
          'Discussion Topics',
          '• Waste management challenges',
          '• Best practices and solutions',
          '• Local initiatives',
          '• Success stories',
          '• Technology and innovations',
          '• Government updates',
          '',
          'Community Guidelines',
          '• Be respectful and constructive',
          '• Provide credible sources',
          '• Avoid spam and harassment',
          '• Report inappropriate content',
          '• Support new members',
          '',
          'How to Post',
          '1. Select relevant category',
          '2. Write descriptive title',
          '3. Provide detailed context',
          '4. Attach relevant images/documents',
          '5. Tag relevant topics',
        ],
        'Local Government Initiatives': [
          'Staying Updated on Municipal Programs',
          '',
          `${resource.description}`,
          '',
          'Government Initiatives',
          '• Swachh Bharat Mission programs',
          '• Waste segregation campaigns',
          '• Recycling facilities expansion',
          '• Educational workshops',
          '• Infrastructure development',
          '• Incentive schemes',
          '',
          'How to Participate',
          '1. Register for programs on municipal website',
          '2. Attend information sessions',
          '3. Follow guidelines and timelines',
          '4. Provide feedback and suggestions',
          '5. Share progress updates',
          '',
          'Citizen Responsibilities',
          '• Segregate waste at source',
          '• Use designated collection points',
          '• Attend awareness sessions',
          '• Report violations',
          '• Maintain hygiene standards',
          '',
          'Benefits',
          '• Better waste management services',
          '• Cleaner neighborhoods',
          '• Recognition and incentives',
          '• Improved public health',
        ],
        'Business & Enterprise Hub': [
          'Waste Management Business Opportunities',
          '',
          `${resource.description}`,
          '',
          'Types of Green Businesses',
          '• Recycling and processing units',
          '• Waste collection services',
          '• Compost production',
          '• Upcycling ventures',
          '• Educational services',
          '• Technology solutions',
          '',
          'Starting Your Green Business',
          '1. Identify market opportunity',
          '2. Research regulations and requirements',
          '3. Develop business plan',
          '4. Secure necessary licenses',
          '5. Network with existing businesses',
          '6. Seek funding and support',
          '',
          'Support Available',
          '• Mentorship programs',
          '• Training workshops',
          '• Funding information',
          '• Networking events',
          '• Technology resources',
          '• Market connections',
          '',
          'Success Stories',
          'Browse profiles of successful green entrepreneurs',
          'Learn from their experiences and strategies.',
        ],
      };

      const guide = resourceGuides[resource.title] || [
        'Community Resource Guide',
        resource.description,
        '',
        'Getting Involved',
        'Explore the opportunities available through this community resource.',
        '',
        'Benefits',
        '• Connect with like-minded individuals',
        '• Access expertise and resources',
        '• Contribute to environmental goals',
        '• Make a real impact',
        '',
        'Next Steps',
        'Visit the resource page for more information and to get started.',
      ];

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      guide.forEach((line) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }

        if (line.startsWith('• ') || /^\d\./.test(line) || line === '') {
          doc.setFontSize(9);
        } else if (line === line.toUpperCase() && line.length > 0) {
          doc.setFontSize(11);
          doc.setTextColor(27, 94, 32);
        } else {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
        }

        doc.text(line, 20, yPosition);
        yPosition += 7;
      });

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('© 2026 EcoManage India - Public Waste Management Portal', 20, pageHeight - 10);

      doc.save(`${resource.title.replace(/\s+/g, '_')}_Guide.pdf`);
    } catch (error) {
      console.error('Error generating guide:', error);
      alert('Failed to download guide. Please try again.');
    }
  };

  const resources = [
    {
      id: 1,
      title: 'Local Recycling Centers',
      description: 'Find the nearest authorized recycling centers in your area for proper waste disposal.',
      category: 'Location-Based',
      members: '2,450+',
      icon: '🏢',
    },
    {
      id: 2,
      title: 'Volunteer Programs',
      description: 'Join community cleanup drives and environmental awareness campaigns.',
      category: 'Volunteering',
      members: '3,800+',
      icon: '🤝',
    },
    {
      id: 3,
      title: 'NGO Partnerships',
      description: 'Connect with registered NGOs working on waste management and environmental conservation.',
      category: 'Organizations',
      members: '420+',
      icon: '🌐',
    },
    {
      id: 4,
      title: 'Community Discussion Forum',
      description: 'Share ideas, ask questions, and learn from other waste management enthusiasts.',
      category: 'Community',
      members: '12,500+',
      icon: '💬',
    },
    {
      id: 5,
      title: 'Local Government Initiatives',
      description: 'Updates on municipal waste management programs and citizen participation opportunities.',
      category: 'Government',
      members: '5,600+',
      icon: '📢',
    },
    {
      id: 6,
      title: 'Business & Enterprise Hub',
      description: 'Explore waste management startups and green business opportunities in your region.',
      category: 'Enterprise',
      members: '1,200+',
      icon: '💼',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf8' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white', py: 3, position: 'sticky', top: 0, zIndex: 100 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/resources')}
            >
              🌍 EcoManage India
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Button
                variant="text"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => navigate('/schemes')}
              >
                Schemes
              </Button>
              <Button
                variant="text"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => navigate('/impact')}
              >
                Impact
              </Button>
              <Button
                variant="text"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => navigate('/resources')}
              >
                Resources
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: 'white', color: '#1b5e20', fontWeight: 'bold' }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Button
            variant="text"
            sx={{ color: 'white', mb: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            onClick={() => navigate('/resources')}
          >
            ← Back to Resources
          </Button>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            👥 Community Resources
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Join thousands of community members, volunteers, and organizations working together for a cleaner, greener India.
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  borderLeft: '5px solid #2e7d32',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h2" sx={{ fontSize: '2.5rem' }}>
                      {resource.icon}
                    </Typography>
                    <Chip label={resource.category} size="small" sx={{ bgcolor: '#f1f8e9', color: '#1b5e20', fontWeight: 'bold' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.6 }}>
                    {resource.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      👥 {resource.members} Active Members
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#1b5e20' } }}
                    onClick={() => handleExplore(resource)}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Community Stats */}
        <Box sx={{ mt: 8, background: 'linear-gradient(135deg, #c8e6c9 0%, #e8f5e9 100%)', p: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3, textAlign: 'center' }}>
            Community at a Glance
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                  25,450+
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Active Community Members
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                  3,200+
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Volunteer Activities Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                  420+
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Partner Organizations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                  95 Cities
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Communities Represented
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Card sx={{ mt: 6, background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white', boxShadow: 'none', textAlign: 'center', p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Join the Movement! 🌱
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
            Create an account to connect with your local community and make a real impact.
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: 'white', color: '#1b5e20', fontWeight: 'bold', fontSize: '1rem', '&:hover': { bgcolor: '#f1f8e9' } }}
            onClick={() => navigate('/register')}
          >
            Get Started Today
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

export default CommunityResources;
