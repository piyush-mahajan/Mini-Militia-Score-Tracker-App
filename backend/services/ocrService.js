const Tesseract = require('tesseract.js');
const sharp = require('sharp');

async function processScoreboardImage(imageBuffer) {
  try {
    // Enhance image for better OCR
    const processedBuffer = await sharp(imageBuffer)
      .resize(1200, null, { fit: 'inside' })
      // Increase contrast to make text more visible
      .modulate({ brightness: 1.2, contrast: 1.3 })
      // Convert to grayscale for better text detection
      .grayscale()
      .toBuffer();

    const result = await Tesseract.recognize(
      processedBuffer,
      'eng',
      {
        logger: m => console.log(m),
        // Configure Tesseract to look for specific patterns
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-',
        // Add custom patterns for Mini Militia scoreboard
        patterns: [
          // Pattern for player name followed by numbers
          /([A-Za-z\s]+)\s+(\d+)\s+(\d+)/
        ]
      }
    );

    // Parse the OCR result focusing on the specific format
    const lines = result.data.text.split('\n').filter(line => line.trim());
    
    const players = [];
    for (const line of lines) {
      // Match the Mini Militia scoreboard format
      // Looking for: Name Kills Deaths Score
      const match = line.match(/([A-Za-z\s]+)\s+(\d+)\s+(\d+)\s*([-+]\d+)?/);
      if (match) {
        const [_, name, kills, deaths, score] = match;
        players.push({
          name: name.trim(),
          kills: parseInt(kills),
          deaths: parseInt(deaths),
          score: score ? parseInt(score) : 0
        });
      }
    }

    return players;
  } catch (error) {
    console.error('OCR Processing Error:', error);
    throw new Error('Failed to process scoreboard image');
  }
}

module.exports = { processScoreboardImage }; 