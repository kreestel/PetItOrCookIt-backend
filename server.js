import express from 'express';
import multer from 'multer';
import snoowrap from 'snoowrap';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Use cors middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// Reddit credentials from environment variables
const reddit = new snoowrap({
  userAgent: 'PetItOrCookIt/1.0 by ' + process.env.REDDIT_USERNAME,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

app.post('/api/reddit-post', upload.single('image'), async (req, res) => {
  try {
    console.log('Received Reddit post request');
    console.log('Environment variables check:', {
      hasClientId: !!process.env.REDDIT_CLIENT_ID,
      hasClientSecret: !!process.env.REDDIT_CLIENT_SECRET,
      hasUsername: !!process.env.REDDIT_USERNAME,
      hasPassword: !!process.env.REDDIT_PASSWORD
    });

    const { caption } = req.body;
    const imagePath = req.file.path;
    const subreddit = 'PetItOrCookIt';

    console.log('Posting to subreddit:', subreddit);
    console.log('Caption:', caption);
    console.log('Image path:', imagePath);

    // Upload image to Cloudinary
    console.log('Uploading image to Cloudinary...');
    const cloudinaryResponse = await cloudinary.uploader.upload(imagePath);
    console.log('Cloudinary upload successful:', cloudinaryResponse.secure_url);

    // Now post the Cloudinary URL to Reddit
    const submission = await reddit.getSubreddit(subreddit).submitLink({
      title: caption,
      url: cloudinaryResponse.secure_url
    });

    console.log('Reddit submission successful:', submission.permalink);

    // Clean up uploaded file
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete image:', err);
    });

    res.json({ url: `https://reddit.com${submission.permalink}` });
  } catch (err) {
    console.error('Reddit post error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`)); 