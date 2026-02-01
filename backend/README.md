---
title: RoomGi Backend API
emoji: 🏠
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
license: mit
---

# RoomGi Backend API

Backend API for the RoomGi Property Platform.

## Environment Variables

Set these in your Hugging Face Space settings:

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Set to `production`
- `FRONTEND_URL` - Your Vercel frontend URL
- `NEWSAPI_KEY` - NewsAPI key
- `GROQ_API_KEY` - Groq API key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
