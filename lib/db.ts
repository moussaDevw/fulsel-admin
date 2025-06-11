import { neon } from "@neondatabase/serverless"

// Créer une instance de client SQL réutilisable
const sql = neon(process.env.DATABASE_URL!)

export { sql }
