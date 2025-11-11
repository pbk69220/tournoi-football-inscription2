const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Serve static files from public directory (images, etc)
app.use(express.static(path.join(__dirname, '../public')))

// Serve static files from dist directory (frontend)
app.use(express.static(path.join(__dirname, '../dist')))

// Database setup
const dbPath = path.join(__dirname, '../registrations.db')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err)
  } else {
    console.log('Connected to SQLite database at:', dbPath)
    // Enable WAL mode for better concurrent access
    db.run('PRAGMA journal_mode = WAL')
    // Set busy timeout to 5 seconds for concurrent writes
    db.run('PRAGMA busy_timeout = 5000')
    initializeDatabase()
  }
})

// Initialize database with tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      playerFirstName TEXT NOT NULL,
      category TEXT NOT NULL,
      accommodation2nights INTEGER DEFAULT 0,
      accommodation1night INTEGER DEFAULT 0,
      helpSaturdayMorning INTEGER DEFAULT 0,
      helpSaturdayAfternoon INTEGER DEFAULT 0,
      helpSundayMorning INTEGER DEFAULT 0,
      helpSundayAfternoon INTEGER DEFAULT 0,
      timestamp INTEGER NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating registrations table:', err)
    } else {
      console.log('Registrations table ready')
    }
  })
}

// Helper function to verify admin password
function verifyAdminPassword(password) {
  return password === 'bfb69#*'
}

// Helper function to transform flat fields into nested services object
function transformRegistrationData(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    playerFirstName: row.playerFirstName,
    category: row.category,
    services: {
      accommodation2nights: Boolean(row.accommodation2nights),
      accommodation1night: Boolean(row.accommodation1night),
      helpSaturdayMorning: Boolean(row.helpSaturdayMorning),
      helpSaturdayAfternoon: Boolean(row.helpSaturdayAfternoon),
      helpSundayMorning: Boolean(row.helpSundayMorning),
      helpSundayAfternoon: Boolean(row.helpSundayAfternoon)
    },
    timestamp: row.timestamp
  }
}

// API Routes

// GET all registrations (public, excludes email/phone)
app.get('/api/registrations', (req, res) => {
  db.all(`
    SELECT id, name, email, phone, playerFirstName, category,
           accommodation2nights, accommodation1night,
           helpSaturdayMorning, helpSaturdayAfternoon,
           helpSundayMorning, helpSundayAfternoon,
           timestamp
    FROM registrations
    ORDER BY timestamp DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      // Transform flat fields into nested services object
      const transformed = (rows || []).map(row => {
        const data = transformRegistrationData(row)
        // For public endpoint, exclude email and phone
        delete data.email
        delete data.phone
        return data
      })
      res.json(transformed)
    }
  })
})

// GET all registrations with contact info (admin only)
app.get('/api/registrations/admin/full', (req, res) => {
  const adminPassword = req.query.password

  if (!verifyAdminPassword(adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  db.all(`
    SELECT * FROM registrations
    ORDER BY timestamp DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      // Transform flat fields into nested services object
      const transformed = (rows || []).map(row => transformRegistrationData(row))
      res.json(transformed)
    }
  })
})

// POST new registration
app.post('/api/registrations', (req, res) => {
  const { name, email, phone, playerFirstName, category, services } = req.body

  if (!name || !email || !phone || !playerFirstName || !category) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const id = Date.now().toString()
  const timestamp = Date.now()

  const sql = `
    INSERT INTO registrations (
      id, name, email, phone, playerFirstName, category,
      accommodation2nights, accommodation1night,
      helpSaturdayMorning, helpSaturdayAfternoon,
      helpSundayMorning, helpSundayAfternoon,
      timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.run(
    sql,
    [
      id, name, email, phone, playerFirstName, category,
      services.accommodation2nights ? 1 : 0,
      services.accommodation1night ? 1 : 0,
      services.helpSaturdayMorning ? 1 : 0,
      services.helpSaturdayAfternoon ? 1 : 0,
      services.helpSundayMorning ? 1 : 0,
      services.helpSundayAfternoon ? 1 : 0,
      timestamp
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        // Return in correct format with nested services object
        res.json({
          id,
          name,
          email,
          phone,
          playerFirstName,
          category,
          services,
          timestamp
        })
      }
    }
  )
})

// DELETE registration (admin only)
app.delete('/api/registrations/:id', (req, res) => {
  const adminPassword = req.query.password

  if (!verifyAdminPassword(adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  db.run('DELETE FROM registrations WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json({ success: true })
    }
  })
})

// UPDATE registration (admin only)
app.put('/api/registrations/:id', (req, res) => {
  const adminPassword = req.query.password

  if (!verifyAdminPassword(adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { name, email, phone, playerFirstName, category, services } = req.body

  const sql = `
    UPDATE registrations
    SET name = ?, email = ?, phone = ?, playerFirstName = ?, category = ?,
        accommodation2nights = ?, accommodation1night = ?,
        helpSaturdayMorning = ?, helpSaturdayAfternoon = ?,
        helpSundayMorning = ?, helpSundayAfternoon = ?
    WHERE id = ?
  `

  db.run(
    sql,
    [
      name, email, phone, playerFirstName, category,
      services.accommodation2nights ? 1 : 0,
      services.accommodation1night ? 1 : 0,
      services.helpSaturdayMorning ? 1 : 0,
      services.helpSaturdayAfternoon ? 1 : 0,
      services.helpSundayMorning ? 1 : 0,
      services.helpSundayAfternoon ? 1 : 0,
      req.params.id
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.json({ success: true })
      }
    }
  )
})

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password required' })
  }

  if (verifyAdminPassword(password)) {
    res.json({ success: true, token: 'admin_session' })
  } else {
    res.status(401).json({ error: 'Invalid password' })
  }
})

// Get statistics (public)
app.get('/api/stats', (req, res) => {
  db.all('SELECT * FROM registrations', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      const registrations = rows || []
      const stats = {
        total: registrations.length,
        accommodation2nights: registrations.filter(r => r.accommodation2nights).length,
        accommodation1night: registrations.filter(r => r.accommodation1night).length,
        helpSaturdayMorning: registrations.filter(r => r.helpSaturdayMorning).length,
        helpSaturdayAfternoon: registrations.filter(r => r.helpSaturdayAfternoon).length,
        helpSundayMorning: registrations.filter(r => r.helpSundayMorning).length,
        helpSundayAfternoon: registrations.filter(r => r.helpSundayAfternoon).length
      }
      res.json(stats)
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Fallback route for SPA - serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Keep the server running
server.on('error', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err)
    } else {
      console.log('Database connection closed')
    }
    process.exit(0)
  })
})
