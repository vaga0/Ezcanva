const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

app.post('/save-drawing', express.json({ limit: '10mb' }), (req, res) => {
  const timestamp = Date.now();
  const imageDataUrl = req.body.image; // base64 DataURL，例如 "data:image/png;base64,iVBORw0KGgoAAAANS..."

  if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
    return res.status(400).json({ error: 'Invalid image data' });
  }

  const base64Data = imageDataUrl.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  const filePath = `drawings/drawing_${timestamp}.png`;

  fs.writeFile(filePath, buffer, err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save image' });
    }
    res.json({ message: 'Image saved', path: filePath });
  });
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));


