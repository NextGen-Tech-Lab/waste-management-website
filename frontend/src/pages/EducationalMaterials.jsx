import { Box, Container, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const EducationalMaterials = () => {
  const navigate = useNavigate();

  const handleDownload = (material) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      doc.setFontSize(18);
      doc.setTextColor(27, 94, 32); // Dark green
      doc.text(material.title, 20, yPosition);
      yPosition += 15;

      // Add category and pages info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Category: ${material.category} | Pages: ${material.pages}`, 20, yPosition);
      yPosition += 10;

      // Add separator
      doc.setDrawColor(46, 125, 50);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Add description
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const splitDesc = doc.splitTextToSize(material.description, pageWidth - 40);
      doc.text(splitDesc, 20, yPosition);
      yPosition += splitDesc.length * 7 + 10;

      // Add content sections based on material type
      const contentSections = {
        'Waste Management Guide': [
          'Chapter 1: Understanding Waste',
          '• Types of waste: Wet, Dry, Hazardous, Construction',
          '• Impact of improper waste management',
          '• Waste segregation at source',
          '',
          'Chapter 2: Collection Methods',
          '• Door-to-door collection systems',
          '• Community collection centers',
          '• Scheduled pickup timings',
          '',
          'Chapter 3: Disposal Techniques',
          '• Landfill management',
          '• Composting processes',
          '• Recycling protocols',
        ],
        'Recycling Handbook': [
          'Getting Started with Recycling',
          '• Identify recyclable materials in your home',
          '• Learn proper preparation techniques',
          '• Find local recycling centers',
          '',
          'Material-Specific Guidelines',
          '• Paper and Cardboard: Clean and flatten',
          '• Plastics: Rinse and sort by type',
          '• Glass: Separate by color if possible',
          '• Metals: Crush cans for space efficiency',
          '',
          'Common Mistakes to Avoid',
          '• Mixing contaminated items with recyclables',
          '• Placing plastic bags in bins',
          '• Including food-soiled materials',
        ],
        'Video Tutorials': [
          'Available Video Modules',
          '• Module 1: Waste Segregation Basics (15 min)',
          '• Module 2: Composting at Home (20 min)',
          '• Module 3: Recycling Your Electronics (18 min)',
          '• Module 4: Community Cleanup Best Practices (22 min)',
          '',
          'How to Access Videos',
          '• Online platform: www.ecomanage.in/videos',
          '• YouTube channel: Subscribe for updates',
          '• Mobile app: Download for offline viewing',
          '',
          'Learning Outcomes',
          '• Understand proper waste management techniques',
          '• Implement sustainable practices at home',
          '• Participate in community initiatives',
        ],
        'Infographics Collection': [
          'Visual Guide to Waste Segregation',
          '• Color-coded bin system explanation',
          '• Daily waste reduction tips with illustrations',
          '• Environmental impact comparison charts',
          '',
          'Impact Visualization',
          '• Carbon footprint reduction infographics',
          '• Plastic waste journey: from source to solution',
          '• Recycling rate improvements over time',
          '',
          'Interactive Elements',
          '• QR codes linking to detailed content',
          '• Downloadable posters for community use',
          '• Shareable social media graphics',
        ],
        'Composting at Home': [
          'Getting Started',
          '• Choose your composting method: Bin, Pile, or Vermicomposting',
          '• Select appropriate location (sunny, accessible)',
          '• Gather necessary materials and tools',
          '',
          'Composting Process',
          '• Brown materials: Dry leaves, paper, cardboard',
          '• Green materials: Food scraps, grass clippings',
          '• Maintain moisture and oxygen balance',
          '• Duration: 2-6 months depending on method',
          '',
          'Using Your Compost',
          '• Garden enrichment for plants and flowers',
          '• Potting soil for containers',
          '• Community garden contributions',
        ],
        'Plastic Reduction Tips': [
          'Everyday Reduction Strategies',
          '• Say no to single-use plastics',
          '• Carry reusable bags, bottles, and containers',
          '• Choose products with minimal plastic packaging',
          '• Buy in bulk to reduce packaging waste',
          '',
          'Alternative Products',
          '• Biodegradable bags for waste',
          '• Stainless steel or glass containers',
          '• Bamboo or wooden alternatives',
          '• Package-free personal care options',
          '',
          'Community Impact',
          '• Organize neighborhood plastic drives',
          '• Support local plastic-free businesses',
          '• Advocate for policy changes',
          '• Educate friends and family',
        ],
      };

      const sections = contentSections[material.title] || [
        'Introduction',
        material.description,
        '',
        'Key Learning Points',
        '• Understand waste management principles',
        '• Apply sustainable practices',
        '• Contribute to environmental conservation',
      ];

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      sections.forEach((line) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }

        if (line.startsWith('Chapter') || line.startsWith('• ') || line === '') {
          doc.setFontSize(10);
        } else {
          doc.setFontSize(12);
          doc.setTextColor(27, 94, 32);
        }

        doc.text(line, 20, yPosition);
        yPosition += 7;
      });

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('© 2026 EcoManage India - Public Waste Management Portal', 20, pageHeight - 10);

      // Download the PDF
      doc.save(`${material.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const materials = [
    {
      id: 1,
      title: 'Waste Management Guide',
      description: 'Comprehensive guide on waste segregation, collection, and disposal methods.',
      category: 'PDF Guide',
      pages: 48,
      downloadUrl: '#',
    },
    {
      id: 2,
      title: 'Recycling Handbook',
      description: 'Step-by-step instructions for recycling various materials and reducing waste.',
      category: 'Interactive Guide',
      pages: 32,
      downloadUrl: '#',
    },
    {
      id: 3,
      title: 'Video Tutorials',
      description: 'Learn proper waste management practices through engaging video content.',
      category: 'Video Series',
      pages: 12,
      downloadUrl: '#',
    },
    {
      id: 4,
      title: 'Infographics Collection',
      description: 'Visual guides for waste separation, environmental impact, and best practices.',
      category: 'Visual Materials',
      pages: 20,
      downloadUrl: '#',
    },
    {
      id: 5,
      title: 'Composting at Home',
      description: 'Easy steps to start composting organic waste in your home or community.',
      category: 'Practical Guide',
      pages: 24,
      downloadUrl: '#',
    },
    {
      id: 6,
      title: 'Plastic Reduction Tips',
      description: 'Practical strategies to reduce single-use plastic in daily life.',
      category: 'Tips & Tricks',
      pages: 16,
      downloadUrl: '#',
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
            📚 Educational Materials
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Access comprehensive guides, tutorials, and learning resources to improve your waste management knowledge and practices.
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {materials.map((material) => (
            <Grid item xs={12} sm={6} md={4} key={material.id}>
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
                    📖
                  </Typography>
                  <Typography variant="caption" sx={{ bgcolor: 'white', px: 1.5, py: 0.5, borderRadius: 1, color: '#1b5e20', fontWeight: 'bold' }}>
                    {material.pages} pages
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5, fontWeight: 'bold' }}>
                    {material.category}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                    {material.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.6 }}>
                    {material.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: '#1b5e20', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#0d3817' } }}
                    onClick={() => handleDownload(material)}
                  >
                    Download Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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

export default EducationalMaterials;
