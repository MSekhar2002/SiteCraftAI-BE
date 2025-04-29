const express = require('express');
const Design = require('../models/Design');
const { protect } = require('../middleware/auth');
const AzureOpenAIService = require('../config/azure-openai');

const router = express.Router();

// Advanced Design Generation with More Options
router.post('/generate-advanced', protect, async (req, res) => {
  try {
    const { 
      prompt, 
      deviceMode = 'desktop', 
      colorScheme, 
      designStyle, 
      industryType 
    } = req.body;

    // Enhance prompt with additional context
    const enhancedPrompt = `
      Create a website design for ${industryType || 'a general purpose'} website.
      Design Style: ${designStyle || 'Modern and clean'}
      Color Scheme: ${colorScheme || 'Professional blue and white'}
      Device Mode: ${deviceMode}
      Additional Context: ${prompt}
    `;

    // Generate website code using Azure OpenAI
    const generatedCode = await AzureOpenAIService.generateWebsiteCode(enhancedPrompt);

    // Parse generated code (improved parsing)
    const { html, css } = parseGeneratedCode(generatedCode);

    // Create design record with more metadata
    const design = new Design({
      user: req.user._id,
      prompt: enhancedPrompt,
      generatedHTML: html,
      generatedCSS: css,
      deviceMode,
      metadata: {
        colorScheme,
        designStyle,
        industryType
      },
      status: 'generated'
    });

    await design.save();

    // Update user's designs
    req.user.designs.push(design._id);
    await req.user.save();

    res.status(201).json({
      status: 'success',
      data: {
        design: {
          id: design._id,
          html,
          css,
          deviceMode,
          metadata: design.metadata
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Improved Code Parsing Function
function parseGeneratedCode(generatedCode) {
  try {
    // More robust parsing
    const htmlMatch = generatedCode.match(/<html[\s\S]*?<\/html>/i);
    const cssMatch = generatedCode.match(/<style[\s\S]*?<\/style>/i);
    
    return {
      html: htmlMatch ? htmlMatch[0] : generatedCode,
      css: cssMatch ? cssMatch[0] : ''
    };
  } catch (error) {
    console.error('Code parsing error:', error);
    return {
      html: generatedCode,
      css: ''
    };
  }
}

module.exports = router;