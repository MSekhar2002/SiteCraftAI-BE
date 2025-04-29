//routes/design.js
const express = require('express');
const Design = require('../models/Design');
const { protect } = require('../middleware/auth');
const AzureOpenAIService = require('../config/azure-openai');

const router = express.Router();

// Generate Website Design
function parseGeneratedCode(generatedCode) {
  try {
    // Basic parsing - you might want to improve this logic
    const htmlMatch = generatedCode.match(/<html>[\s\S]*<\/html>/i);
    const cssMatch = generatedCode.match(/<style>[\s\S]*<\/style>/i);

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

router.post('/generate', async (req, res) => {
  try {
    const { prompt, deviceMode = 'desktop' } = req.body;

    // Validate input
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required'
      });
    }

    // Generate website code using Azure OpenAI
    let generatedCode;
    try {
      generatedCode = await AzureOpenAIService.generateWebsiteCode(prompt);
    } catch (aiError) {
      console.error('Azure OpenAI Generation Error:', aiError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to generate website code',
        details: aiError.message
      });
    }

    // Parse generated code
    const { html, css } = parseGeneratedCode(generatedCode);

    // Create design record
    const design = new Design({
      user: req.user && req.user._id ? req.user._id : "anonymous",
      prompt,
      generatedHTML: html,
      generatedCSS: css,
      deviceMode,
      status: 'generated'
    });

    // Save design
    try {
      await design.save();
    } catch (saveError) {
      console.error('Design Save Error:', saveError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to save design',
        details: saveError.message
      });
    }

    // Update user's designs
    if (req?.user) {
      try {
        req.user.designs.push(design._id);
        await req.user.save();
      } catch (userUpdateError) {
        console.error("User Update Error:", userUpdateError);
      }
    }

    res.status(201).json({
      status: 'success',
      data: {
        design: {
          id: design._id,
          html,
          css,
          deviceMode,
          prompt
        }
      }
    });
  } catch (error) {
    console.error('Unexpected Error in Design Generation:', error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
      details: error.message
    });
  }
});


// Get User Designs
router.get('/', protect, async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: designs.length,
      data: { designs }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Helper function to parse generated code
function parseGeneratedCode(generatedCode) {
  // Basic parsing - you might want to improve this
  const htmlMatch = generatedCode.match(/<html>.*<\/html>/s);
  const cssMatch = generatedCode.match(/<style>.*<\/style>/s);

  return {
    html: htmlMatch ? htmlMatch[0] : generatedCode,
    css: cssMatch ? cssMatch[0] : ''
  };
}

module.exports = router;