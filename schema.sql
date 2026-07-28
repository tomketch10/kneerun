-- Waitlist signups for the KneeRun landing page.
-- Applied to the `kneerun-waitlist` D1 database.
CREATE TABLE IF NOT EXISTS signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT,
  user_agent TEXT
);
