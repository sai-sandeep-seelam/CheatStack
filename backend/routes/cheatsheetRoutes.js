const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Get all cheatsheets
router.get('/', async (req, res) => {
  try {
    const cheatsheets = [
      {
        id: 'javascript',
        title: 'JavaScript',
        description: 'Modern JavaScript language reference',
        category: 'Frontend',
        popularity: 95,
        lastUpdated: '2023-09-15'
      },
      {
        id: 'python',
        title: 'Python',
        description: 'Python language reference and common patterns',
        category: 'Backend',
        popularity: 92,
        lastUpdated: '2023-09-10'
      },
      {
        id: 'react',
        title: 'React',
        description: 'React library concepts and hooks',
        category: 'Frontend',
        popularity: 90,
        lastUpdated: '2023-09-12'
      },
      {
        id: 'nodejs',
        title: 'Node.js',
        description: 'Server-side JavaScript runtime',
        category: 'Backend',
        popularity: 88,
        lastUpdated: '2023-09-08'
      }
    ];
    
    res.json({
      status: 'success',
      results: cheatsheets.length,
      data: cheatsheets
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get cheatsheet by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, this would fetch from a database
    // For now, we'll return mock data
    const cheatsheetData = {
      id,
      title: id.charAt(0).toUpperCase() + id.slice(1),
      sections: [
        {
          title: 'Basics',
          items: [
            { name: 'Hello World', code: 'console.log("Hello World");' },
            { name: 'Variables', code: 'const x = 10;\nlet y = 20;' }
          ]
        },
        {
          title: 'Functions',
          items: [
            { name: 'Declaration', code: 'function add(a, b) {\n  return a + b;\n}' },
            { name: 'Arrow Function', code: 'const add = (a, b) => a + b;' }
          ]
        }
      ]
    };
    
    res.json({
      status: 'success',
      data: cheatsheetData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;