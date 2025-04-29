const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

class AzureOpenAIService {
  constructor() {
    this.endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://llm-for-numerapi.openai.azure.com/";
    this.apiKey = process.env["AZURE_OPENAI_KEY"] || "<REPLACE_WITH_YOUR_KEY>";
    this.apiVersion = "2024-05-01-preview"; // Latest API version for inference
    this.deployment = "gpt-4o-mini"; // Ensure this matches your Azure OpenAI deployment name
    this.client = new AzureOpenAI({
      endpoint: this.endpoint,
      apiKey: this.apiKey,
      apiVersion: this.apiVersion,
    });

    this.systemPrompt = `
      You are an expert web designer and frontend developer.
      Generate **clean, responsive, and professional HTML and CSS** based on the user’s description.

      ### **Design Principles:**
      1️⃣ **Modern HTML5** – Semantic elements, clean structure.
      2️⃣ **Responsive Design** – Mobile-first approach, Flexbox/Grid.
      3️⃣ **Accessibility** – ARIA attributes, readable contrast, proper tab index.
      4️⃣ **Performance Optimization** – Minimized CSS, optimized structure.
      5️⃣ **Premium Visual Design**  
         - Smooth gradients  
         - Glassmorphism effects  
         - Refined color palette  
         - Professional typography  
         - Gradient transitions for text  
      6️⃣ **Enhanced Interactions**  
         - Smooth hover states  
         - Active state indicators  
         - Improved animations & transitions  
      7️⃣ **Mobile Optimization**  
         - Adaptive layouts  
         - Optimized touch areas  
         - Clear navigation  
      8️⃣ **Professional Look**  
         - Well-aligned elements  
         - Improved spacing  
         - High-contrast, readable text  
         - Clean separators and icons  

      ### **Return ONLY HTML and CSS. No Explanations, No Markdown. use unique class names if used  **
    `;
  }

  async generateWebsiteCode(userPrompt) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 8000,
        temperature: 0.7,
        top_p: 0.95,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error(
        "Azure OpenAI Request Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}

module.exports = new AzureOpenAIService();
