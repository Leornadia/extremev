/**
 * Environment variable configuration with type safety
 * This file validates and exports environment variables
 */

// Reserved for future use when required env vars are needed
function _getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnvVar(
  key: string,
  defaultValue?: string
): string | undefined {
  return process.env[key] || defaultValue;
}

export const env = {
  // Database
  databaseUrl: getOptionalEnvVar('DATABASE_URL'),

  // NextAuth
  nextAuthUrl: getOptionalEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  nextAuthSecret: getOptionalEnvVar('NEXTAUTH_SECRET'),

  // Email
  emailFrom: getOptionalEnvVar('EMAIL_FROM'),
  emailApiKey: getOptionalEnvVar('EMAIL_API_KEY'),

  // Media Storage
  mediaUrl: getOptionalEnvVar('NEXT_PUBLIC_MEDIA_URL'),
  awsAccessKeyId: getOptionalEnvVar('AWS_ACCESS_KEY_ID'),
  awsSecretAccessKey: getOptionalEnvVar('AWS_SECRET_ACCESS_KEY'),
  awsRegion: getOptionalEnvVar('AWS_REGION', 'us-east-1'),
  awsS3Bucket: getOptionalEnvVar('AWS_S3_BUCKET'),

  // CMS
  cmsUrl: getOptionalEnvVar('NEXT_PUBLIC_CMS_URL'),
  cmsApiToken: getOptionalEnvVar('CMS_API_TOKEN'),

  // Analytics
  gaId: getOptionalEnvVar('NEXT_PUBLIC_GA_ID'),

  // Environment
  nodeEnv: getOptionalEnvVar('NODE_ENV', 'development'),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
