declare namespace Cloudflare {
  interface Env {
    OPENAI_API_KEY?: string;
    OPENAI_MODEL?: string;
    DATA_GOV_API_KEY?: string;
    DATA_GOV_RESOURCE_ID?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
