/**
 * CSS Organization Helper
 * 
 * This script helps organize CSS by:
 * 1. Creating a dump folder for old CSS files
 * 2. Creating a structured folder for new CSS
 * 3. Copying essential styles to appropriate new files
 */

const fs = require('fs');
const path = require('path');

// Define paths
const cssPath = path.join(__dirname, '..', 'css');
const dumpPath = path.join(cssPath, 'dump');
const newStructureFolders = [
    'base',
    'components',
    'layout',
    'pages',
    'utilities',
    'effects'
];

// Create folder structure
function createFolders() {
    console.log('Creating folder structure...');
    
    // Create dump folder if it doesn't exist
    if (!fs.existsSync(dumpPath)) {
        fs.mkdirSync(dumpPath);
        console.log(`Created dump folder: ${dumpPath}`);
    }
    
    // Create new structure folders
    newStructureFolders.forEach(folder => {
        const folderPath = path.join(cssPath, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(`Created folder: ${folderPath}`);
        }
    });
    
    console.log('Folder structure created successfully!');
}

// Move all existing CSS files to dump except main.css and a11y-helper.css
function moveFilesToDump() {
    console.log('Moving files to dump folder...');
    
    const filesToKeep = ['main.css', 'a11y-helper.css'];
    const files = fs.readdirSync(cssPath);
    
    files.forEach(file => {
        const filePath = path.join(cssPath, file);
        // Skip if it's a directory or a file to keep
        if (fs.statSync(filePath).isDirectory() || filesToKeep.includes(file)) {
            return;
        }
        
        // Move file to dump
        const newPath = path.join(dumpPath, file);
        fs.renameSync(filePath, newPath);
        console.log(`Moved ${file} to dump folder`);
    });
    
    console.log('Files moved successfully!');
}

// Create template files for the new structure
function createTemplateFiles() {
    console.log('Creating template files...');
    
    // Base directory
    fs.writeFileSync(
        path.join(cssPath, 'base', 'variables.css'),
        `/* Base Variables */
:root {
    /* Color palette */
    --primary-color: #00f3ff;
    --secondary-color: #ff00ff;
    --accent-color: #ffff00;
    --dark-bg: #0a0a12;
    --darker-bg: #050507;
    --text-light: #ffffff;
    --text-dim: #cccccc;
    
    /* Typography */
    --header-font: 'Orbitron', sans-serif;
    --body-font: 'Roboto', sans-serif;
    
    /* Spacing */
    --section-padding: 80px 0;
}`
    );
    
    fs.writeFileSync(
        path.join(cssPath, 'base', 'reset.css'),
        `/* Base Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: auto;
    overflow-x: hidden;
}

body {
    font-family: var(--body-font);
    background-color: var(--dark-bg);
    color: var(--text-light);
    line-height: 1.6;
}`
    );
    
    // Components directory example
    fs.writeFileSync(
        path.join(cssPath, 'components', 'buttons.css'),
        `/* Button Styles */
.btn {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    font-family: var(--header-font);
    transition: all 0.3s ease;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 5;
}

.btn-primary {
    background-color: var(--primary-color);
    color: var(--darker-bg);
    border: 1px solid var(--primary-color);
}

.btn-outline {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}`
    );
    
    // Add other template files as needed
    
    console.log('Template files created successfully!');
}

// Run the organization process
function organizeCSS() {
    createFolders();
    moveFilesToDump();
    createTemplateFiles();
    console.log('CSS organization complete!');
}

organizeCSS();
