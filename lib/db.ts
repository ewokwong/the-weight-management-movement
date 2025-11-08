import { MongoClient, Db } from "mongodb"

// Get MongoDB connection string from environment
const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MongoDB connection string. Please set MONGODB_URI in your .env.local file")
}

// Don't modify the connection string - use it as-is
// MongoDB Atlas connection strings should be used exactly as provided
const connectionUri = uri

const options = {
  serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  retryWrites: true,
  retryReads: true,
  // Ensure we're using the latest connection options
  maxPoolSize: 10,
  minPoolSize: 1,
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
  try {
    const client = await clientPromise
    // Extract database name from connection string if present, otherwise use default
    const dbNameFromUri = connectionUri.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1]
    return client.db(dbNameFromUri || dbName)
  } catch (error: any) {
    console.error("❌ Failed to get database instance:", error.message || error)
    // Check for specific SSL errors
    if (error.message?.includes("SSL") || error.message?.includes("TLS") || error.message?.includes("alert")) {
      console.error("💡 SSL/TLS Error detected. Common fixes:")
      console.error("   1. Check MongoDB Atlas IP whitelist - ensure 0.0.0.0/0 is allowed")
      console.error("   2. Verify your connection string format (should start with mongodb+srv://)")
      console.error("   3. Check MongoDB Atlas network access settings")
      console.error("   4. Ensure your MongoDB user has proper permissions")
    }
    throw error
  }
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
    const errorMessage = error.message || String(error)
    console.error("❌ MongoDB initialization error:", errorMessage)
    
    if (errorMessage.includes("authentication") || errorMessage.includes("auth")) {
      console.error("💡 Authentication error - Check your MongoDB username and password in the connection string")
    } else if (errorMessage.includes("timeout") || errorMessage.includes("ENOTFOUND")) {
      console.error("💡 Network error - Check your MongoDB Atlas IP whitelist")
      console.error("   Add 0.0.0.0/0 to allow all IPs (or add your specific IP)")
    } else if (errorMessage.includes("SSL") || errorMessage.includes("TLS") || errorMessage.includes("alert")) {
      console.error("💡 SSL/TLS Error - Common fixes:")
      console.error("   1. MongoDB Atlas → Network Access → Add IP Address → 0.0.0.0/0")
      console.error("   2. Verify connection string format: mongodb+srv://username:password@cluster.mongodb.net/")
      console.error("   3. Check MongoDB user permissions in Database Access")
      console.error("   4. Ensure connection string doesn't have conflicting SSL parameters")
    }
    
    return { success: false, error: errorMessage }
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
