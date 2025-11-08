export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import db module to trigger MongoDB connection and initialization on startup
    const { initializeDatabase } = await import('./lib/db')
    console.log('🚀 Triggering MongoDB initialization on server startup...')
    
    initializeDatabase()
      .then((result) => {
        if (result.success) {
          console.log('✅ MongoDB initialized successfully on startup')
        } else {
          console.error('❌ MongoDB initialization failed:', result.error)
        }
      })
      .catch((error) => {
        console.error('❌ MongoDB initialization error:', error)
      })
  }
}

