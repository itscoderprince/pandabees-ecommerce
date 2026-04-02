import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000).optional(),
  DATABASE_URL: z.string().url("Invalid DATABASE_URL").optional(),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters").optional(),
  
  // Nodemailer (SMTP)
  MAIL_HOST: z.string().min(1, "MAIL_HOST is required").optional(),
  MAIL_PORT: z.coerce.number().default(587).optional(),
  MAIL_USER: z.string().min(1, "MAIL_USER is required").optional(),
  MAIL_PASS: z.string().min(1, "MAIL_PASS is required").optional(),
  
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().min(1, "CLOUDINARY_UPLOAD_PRESET is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required").optional(),
});

// We wrap the schema with requirements based on the environment
const isServer = typeof window === 'undefined';

const env = isServer 
  ? envSchema.parse(process.env) 
  : envSchema.partial().parse({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    });

export default env;
