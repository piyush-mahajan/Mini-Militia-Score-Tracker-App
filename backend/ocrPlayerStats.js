const Tesseract = require('tesseract.js');
const fs = require('fs');
const readline = require('readline');
const sharp = require('sharp');

// Function to preprocess the image
async function preprocessImage(imagePath) {
    const outputImagePath = 'temp_image.png'; // Temporary file for processed image
    await sharp(imagePath)
        .resize(800) // Resize for better OCR performance
        .grayscale() // Convert to grayscale
        .toFile(outputImagePath);
    return outputImagePath;
}

// Function to perform OCR on the image
async function extractPlayerStats(imagePath) {
    try {
        const processedImagePath = await preprocessImage(imagePath);
        const { data: { text } } = await Tesseract.recognize(
            processedImagePath,
            'eng',
            {
                logger: info => console.log(info) // Log progress
            }
        );

        console.log('Extracted Text:', text);
        parsePlayerStats(text);
    } catch (error) {
        console.error('Error during OCR:', error);
    }
}

// Function to parse player stats from the extracted text
function parsePlayerStats(text) {
    const lines = text.split('\n');
    const playerStats = [];

    lines.forEach(line => {
        // Example line formats:
        // "PlayerName: 10 kills, 5 deaths, Rate: 2.0"
        // "PlayerName - Kills: 10, Deaths: 5, Rate: 2.0"
        const match = line.match(/(.+?)[\s:|-]+(\d+)[\s]*kills?[,\s]+(\d+)[\s]*deaths?[,\s]+Rate:[\s]*(\d+\.\d+)/i);
        if (match) {
            const playerName = match[1].trim();
            const kills = parseInt(match[2], 10);
            const deaths = parseInt(match[3], 10);
            const rate = parseFloat(match[4]);

            playerStats.push({ playerName, kills, deaths, rate });
        }
    });

    console.log('Player Stats:', playerStats);
}

// Prompt the user for the image path
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter the path to your image file: ', (imagePath) => {
    extractPlayerStats(imagePath);
    rl.close();
});