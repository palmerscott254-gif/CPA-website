# Gunicorn configuration tuned for Render free tier
# (512 MB RAM, shared CPU, single web process)
#
# Worker count: keep at 2 so the service can handle burst requests while
# staying well within the 512 MB memory budget (~80-100 MB per Django worker).
workers = 2

# Worker class: gthread supports the `threads` parameter below and is more
# memory-efficient than spawning full extra processes.  Switch to "gevent"
# only if you introduce long-running async I/O tasks.
worker_class = "gthread"

# Threads per worker: 2 threads lets each worker serve an additional
# concurrent request without spawning a full extra process.
threads = 2

# Timeout: Render free-tier services have a 30 s boot + DB connection
# overhead on cold starts.  120 s gives slow upstream queries room to
# breathe without timing out legitimate requests.
timeout = 120

# Graceful timeout: allow in-flight requests this many seconds to finish
# before forcefully killing a worker during a rolling restart.
graceful_timeout = 30

# Keep-alive: reuse TCP connections from the Render load-balancer, reducing
# TLS handshake overhead on subsequent requests.
keepalive = 5

# Worker recycling: automatically restart each worker after handling
# max_requests requests (±jitter) to prevent slow memory leaks from
# accumulating over the lifetime of a long-lived free-tier instance.
max_requests = 1000
max_requests_jitter = 100

# Logging: emit access logs so Render's log tail shows live traffic.
accesslog = "-"
errorlog = "-"
loglevel = "info"
