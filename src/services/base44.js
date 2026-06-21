const axios = require('axios');

class Base44Service {
  constructor() {
    this.apiKey = process.env.BASE44_API_KEY || '2015b471f7c44bd9934ed539a82b1030';
    this.baseUrl = 'https://api.base44.com/v1'; // Standard Base44 API endpoint
  }

  async callAI(prompt, model = 'gemini-3-flash-preview') {
    try {
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: model,
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Base44 API Error:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Add more methods for video/image if Base44 supports them via specific endpoints
}

module.exports = new Base44Service();
