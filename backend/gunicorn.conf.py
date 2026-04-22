# gunicorn.conf.py — tuned for Render free tier (0.1 vCPU, 512 MB RAM)
import os

# Render injects the PORT environment variable; bind to it so traffic is
# routed correctly.  Fall back to 8000 for local testing.
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"

# ---------------------------------------------------------------------------
# Worker model
# ---------------------------------------------------------------------------
# Use gthread (sync + threadpool) so a single OS process can handle multiple
# concurrent requests without the RAM overhead of additional worker processes.
worker_class = "gthread"

# One worker process keeps peak RSS well below 512 MB.
workers = 1

# Four threads per worker provides adequate concurrency for an I/O-bound
# Django app while staying within the free-tier memory budget.
threads = 4

# ---------------------------------------------------------------------------
# Timeouts
# ---------------------------------------------------------------------------
# Render free-tier cold-starts can take 20–30 s; allow workers extra time
# so the first real request is not killed before it can be served.
timeout = 120

# How long to wait for the next request on a keep-alive connection.
keepalive = 5

# ---------------------------------------------------------------------------
# Memory hygiene
# ---------------------------------------------------------------------------
# Recycle workers after this many requests to prevent slow memory leaks.
max_requests = 1000
# Add up to ±10 % jitter so all threads don't restart simultaneously.
max_requests_jitter = 100

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
accesslog = "-"   # stdout (captured by Render log aggregation)
errorlog  = "-"   # stderr
loglevel  = "info"
