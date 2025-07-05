# 🧠 PetItOrCookIt - Backend

This is the API that powers the decisions behind [PetItOrCookIt](https://petitorcookit.netlify.app/)

It handles:
- Uploading the stamped verdict image to Cloudinary
- Classifying the uploaded photo (animal, human, selfie, or... other)
- Posting the result + caption to Reddit
- Returning the Reddit post URL for frontend display

## ⚙️ Tech Stack

- Node.js + Express
- Cloudinary SDK
- Google Cloud Vision API
- Reddit API via `snoowrap`
- Multer (for file upload handling)

##  Getting Started

```bash
git clone https://github.com/your-username/PetItOrCookIt-backend.git
cd PetItOrCookIt-backend
npm install
cp .env.example .env
npm run dev
