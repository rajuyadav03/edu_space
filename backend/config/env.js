import { cleanEnv, str, port, url } from 'envalid';
import dotenv from 'dotenv';
import path from 'path';

// Load .env explicitly so this file can be imported absolutely anywhere
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
    PORT: port({ default: 5000 }),
    MONGODB_URI: url({ desc: 'MongoDB connection string' }),
    JWT_SECRET: str({ desc: 'Secret key for signing JSON Web Tokens' }),
    JWT_EXPIRE: str({ default: '30d', desc: 'Expiration time for JWTs' }),
    CLIENT_URL: url({ desc: 'URL of the frontend client application', default: 'http://localhost:5173' }),
    CLOUDINARY_CLOUD_NAME: str({ desc: 'Cloudinary Cloud Name' }),
    CLOUDINARY_API_KEY: str({ desc: 'Cloudinary API Key' }),
    CLOUDINARY_API_SECRET: str({ desc: 'Cloudinary API Secret' }),
    GOOGLE_CLIENT_ID: str({ desc: 'Google OAuth Client ID', default: '' }),
    GOOGLE_CLIENT_SECRET: str({ desc: 'Google OAuth Client Secret', default: '' }),
    GOOGLE_CALLBACK_URL: str({ desc: 'Google OAuth Callback URL', default: '' }),
});

export default env;
