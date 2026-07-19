import "server-only";

import { validateContactEnvironment } from "./config-core";

export function getContactConfig() {
  return validateContactEnvironment({
    CONTACT_DELIVERY_MODE: process.env.CONTACT_DELIVERY_MODE,
    CONTACT_RATE_LIMIT_MODE: process.env.CONTACT_RATE_LIMIT_MODE,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FORM_RECIPIENT: process.env.CONTACT_FORM_RECIPIENT,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_REPLY_TO_MODE: process.env.CONTACT_REPLY_TO_MODE,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    CONTACT_RATE_LIMIT_SALT: process.env.CONTACT_RATE_LIMIT_SALT,
  });
}
