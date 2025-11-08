import { MongoClient, Db } from "mongodb"

// Get MongoDB connection string from environment
const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MongoDB connection string. Please set MONGODB_URI in your .env.local file")
}

// Add database name to connection string if not present
let connectionUri = uri
// Check if database name is already in the connection string
const hasDatabase = /mongodb\+srv:\/\/[^/]+\/([^?]+)/.test(uri)
if (!hasDatabase) {
  // Add database name before query parameters
  if (uri.includes("?")) {
    connectionUri = uri.replace("?", "/blog_db?")
  } else {
    connectionUri = uri + "/blog_db"
  }
} else {
  connectionUri = uri
}

const options = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(connectionUri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch((error) => {
      console.error("❌ MongoDB connection error:", error)
      throw error
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(connectionUri, options)
  clientPromise = client.connect().catch((error) => {
    console.error("❌ MongoDB connection error:", error)
    throw error
  })
}

// Database name
const dbName = "blog_db"

// Helper function to get database instance
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

// Collections
export const collections = {
  blogs: "blogs",
}

// Initialize database indexes
export async function initializeDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...")
    
    // Test connection first
    const client = await clientPromise
    await client.db("admin").command({ ping: 1 })
    console.log("✅ MongoDB connection successful")
    
    const db = await getDatabase()
    
    // Create indexes for better query performance
    await db.collection(collections.blogs).createIndex({ slug: 1 }, { unique: true })
    await db.collection("emails").createIndex({ email: 1 }, { unique: true })
    await db.collection("emails").createIndex({ subscribed_at: -1 })
    
    console.log("✅ MongoDB indexes created successfully")
    return { success: true }
  } catch (error: any) {
    console.error("❌ MongoDB initialization error:", error.message || error)
    if (error.message?.includes("authentication")) {
      console.error("💡 Check your MongoDB username and password")
    }
    if (error.message?.includes("timeout") || error.message?.includes("ENOTFOUND")) {
      console.error("💡 Check your MongoDB Atlas IP whitelist - add 0.0.0.0/0 to allow all IPs for development")
    }
    return { success: false, error: error.message || error }
  }
}

// Auto-initialize on server startup
if (typeof window === "undefined") {
  // Use setImmediate to ensure this runs after module load
  setImmediate(() => {
    console.log("🚀 Starting MongoDB initialization...")
    initializeDatabase()
      .then((result) => {
        if (result.success) {
          console.log("✅ MongoDB setup complete")
        } else {
          console.error("❌ MongoDB setup failed:", result.error)
        }
      })
      .catch((error) => {
        console.error("❌ Failed to initialize MongoDB:", error)
      })
  })
}

export default clientPromise
