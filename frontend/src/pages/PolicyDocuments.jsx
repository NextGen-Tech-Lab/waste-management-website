import { Box, Container, Typography, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const PolicyDocuments = () => {
  const navigate = useNavigate();

  const handleDownload = (document) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(27, 94, 32); // Dark green
      const titleSplit = doc.splitTextToSize(document.title, pageWidth - 40);
      doc.text(titleSplit, 20, yPosition);
      yPosition += titleSplit.length * 7 + 5;

      // Add metadata
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Category: ${document.category} | Year: ${document.year} | Status: ${document.status}`, 20, yPosition);
      yPosition += 10;

      // Add separator
      doc.setDrawColor(46, 125, 50);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Add description
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const splitDesc = doc.splitTextToSize(`Description: ${document.description}`, pageWidth - 40);
      doc.text(splitDesc, 20, yPosition);
      yPosition += splitDesc.length * 7 + 10;

      // Add content sections based on document
      const contentSections = {
        'Solid Waste Management Rules 2016': [
          'Overview',
          'The Solid Waste Management Rules 2016 form the framework for waste management in India. These rules establish segregation, collection, storage, and disposal procedures.',
          '',
          'Key Components',
          '• Waste segregation into four categories at source',
          '• Door-to-door collection systems',
          '• Waste processing and treatment standards',
          '• Dumping ground management requirements',
          '• User fees and levy mechanisms',
          '',
          'Roles and Responsibilities',
          '• Citizens: Segregate waste at source',
          '• Local authorities: Plan and implement waste management',
          '• Waste generators: Transport waste to designated sites',
          '• Processors: Ensure proper treatment and disposal',
          '',
          'Compliance',
          'Non-compliance with these rules can result in penalties and legal action. Regular monitoring and audits are conducted.',
        ],
        'Plastic Waste Management Rules 2018': [
          'Objective',
          'To address the menace of plastic waste and promote sustainable management of plastic waste in an environmentally sound manner.',
          '',
          'Extended Producer Responsibility (EPR)',
          '• Manufacturers and brand owners responsible for end-of-life management',
          '• Mandatory collection targets for used plastic',
          '• Financial accountability for plastic packaging',
          '',
          'Single-Use Plastic Ban',
          '• Prohibition of identified single-use plastics',
          '• Alternatives and substitutes encouraged',
          '• Phase-out timeline for implementation',
          '',
          'Collection and Processing',
          '• Formal systems for plastic waste collection',
          '• Processing through authorized facilities',
          '• Recycling targets and standards',
          '• Awareness campaigns mandatory',
        ],
        'E-Waste (Management) Rules 2016': [
          'Definition and Scope',
          'E-waste includes electrical and electronic equipment waste at end-of-life. This includes computers, phones, batteries, and appliances.',
          '',
          'Collection and Segregation',
          '• Authorized collection centers must be established',
          '• Segregation into recyclable and hazardous components',
          '• Transportation through certified channels',
          '• Tracking and documentation mandatory',
          '',
          'Processing Standards',
          '• Dismantling and recovery of valuable materials',
          '• Environmentally sound treatment of hazardous substances',
          '• Occupational health and safety standards',
          '• Waste minimization through recycling',
          '',
          'Producer Responsibilities',
          '• Collection target fulfillment',
          '• Financing of collection and processing',
          '• Data maintenance and reporting',
        ],
        'Biomedical Waste Management Rules 2016': [
          'Categories of Biomedical Waste',
          '• Human anatomical waste: Body parts, organs',
          '• Animal waste: Lab animal waste',
          '• Infectious waste: Contaminated materials',
          '• Pathological waste: Body fluids, tissues',
          '• Sharps waste: Needles, broken glass',
          '• Pharmaceutical waste: Expired medicines',
          '',
          'Segregation at Source',
          'Waste must be segregated into color-coded bins:',
          '• Yellow: Infectious waste',
          '• Red: Hazardous chemicals',
          '• Blue: Glassware',
          '• Black: General waste',
          '',
          'Treatment and Disposal',
          '• Incineration with air pollution control',
          '• Plasma pyrolysis for selected waste',
          '• Chemical treatment for liquid waste',
          '• Authorized facility requirement mandatory',
          '',
          'Health and Safety',
          'Occupational safety measures and personal protective equipment requirements for all workers.',
        ],
        'Construction and Demolition Waste Rules 2016': [
          'Definition',
          'C&D waste arises during construction, renovation, and demolition of structures and includes concrete, steel, bricks, wood, and other materials.',
          '',
          'Management Approach',
          '• Prevention through design and planning optimization',
          '• Minimization of waste generation',
          '• Reuse and recycling of materials',
          '• Proper segregation and sorting',
          '',
          'Recycling and Reuse',
          '• Construction materials can be recovered and reused',
          '• Recycled aggregates for road construction',
          '• Manufacturing of new construction materials',
          '• Incentives for recyclers and builders',
          '',
          'Implementation Responsibility',
          '• Project owners must implement waste management plans',
          '• Licensed waste handlers for processing',
          '• Monitoring and compliance verification',
          '• Financial provisions for waste management',
        ],
        'Hazardous and Other Wastes Rules 2016': [
          'Scope',
          'Covers hazardous wastes from industries and other sources including chemical, industrial, and metalworking operations.',
          '',
          'Classification',
          '• Hazardous waste: Toxic, corrosive, reactive, ignitable',
          '• Other prescribed waste: Discarded equipment and materials',
          '• Individual waste streams with specific requirements',
          '',
          'Handling and Management',
          '• Segregation and packaging requirements',
          '• Transportation through authorized carriers',
          '• Treatment in authorized facilities',
          '• Storage limitations and conditions',
          '',
          'Extended Producer Responsibility',
          '• Producer accountability for waste management',
          '• Financial responsibility for treatment',
          '• Registry and documentation requirements',
          '• Regular reporting and audit obligations',
        ],
      };

      const sections = contentSections[document.title] || [
        'Document Overview',
        document.description,
        '',
        'Key Provisions',
        '• Regulatory framework established',
        '• Compliance requirements outlined',
        '• Responsibilities defined for stakeholders',
        '• Implementation timelines provided',
      ];

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      sections.forEach((line) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }

        if (line.startsWith('• ') || line === '') {
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
        } else if (line.includes(':') && !line.startsWith('•')) {
          doc.setFontSize(10);
          doc.setTextColor(27, 94, 32);
        } else {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
        }

        doc.text(line, 20, yPosition);
        yPosition += 7;
      });

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('© 2026 EcoManage India - Public Waste Management Portal', 20, pageHeight - 10);

      // Download the PDF
      doc.save(`${document.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const documents = [
    {
      id: 1,
      title: 'Solid Waste Management Rules 2016',
      description: 'Official government rules and guidelines for solid waste management across India.',
      category: 'National Policy',
      year: 2016,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Plastic Waste Management Rules 2018',
      description: 'Guidelines for reducing and managing plastic waste in all forms.',
      category: 'Environmental Policy',
      year: 2018,
      status: 'Active',
    },
    {
      id: 3,
      title: 'E-Waste (Management) Rules 2016',
      description: 'Procedures for collection, segregation, and recycling of electronic waste.',
      category: 'Resource Recovery',
      year: 2016,
      status: 'Active',
    },
    {
      id: 4,
      title: 'Biomedical Waste Management Rules 2016',
      description: 'Health and safety standards for medical and hospital waste disposal.',
      category: 'Health & Safety',
      year: 2016,
      status: 'Active',
    },
    {
      id: 5,
      title: 'Construction and Demolition Waste Rules 2016',
      description: 'Management of waste from construction, renovation, and demolition activities.',
      category: 'Construction Waste',
      year: 2016,
      status: 'Active',
    },
    {
      id: 6,
      title: 'Hazardous and Other Wastes Rules 2016',
      description: 'Rules for handling, storage, and disposal of hazardous materials.',
      category: 'Safety Standards',
      year: 2016,
      status: 'Active',
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
            📋 Policy Documents
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Access official government policies, rules, and regulatory frameworks for waste management and environmental protection.
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {documents.map((document) => (
            <Grid item xs={12} md={6} key={document.id}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid #1b5e20',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateX(8px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={document.category}
                      size="small"
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#1b5e20',
                        fontWeight: 'bold',
                      }}
                    />
                    <Chip
                      label={`${document.year}`}
                      size="small"
                      sx={{
                        bgcolor: '#fff3e0',
                        color: '#e65100',
                        fontWeight: 'bold',
                      }}
                    />
                    <Chip
                      label={document.status}
                      size="small"
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                    {document.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                    {document.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: '#1b5e20', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#0d3817' } }}
                    onClick={() => handleDownload(document)}
                  >
                    Download Document
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

export default PolicyDocuments;
