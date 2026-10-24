const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_TRACKED_IPS = 10000;
const attemptsByIp = new Map();

export const adminLoginRateLimit = (req, res, next) => {
  const now = Date.now();
  const ip = req.ip;
  const entry = attemptsByIp.get(ip);

  if (!entry || now - entry.windowStartedAt >= WINDOW_MS) {
    if (!entry && attemptsByIp.size >= MAX_TRACKED_IPS) {
      for (const [key, value] of attemptsByIp) {
        if (now - value.windowStartedAt >= WINDOW_MS) attemptsByIp.delete(key);
      }
      if (attemptsByIp.size >= MAX_TRACKED_IPS) {
        res.setHeader('Retry-After', '900');
        return res.status(429).json({
          success: false,
          message: 'Login is temporarily busy. Try again later.',
        });
      }
    }
    attemptsByIp.set(ip, { windowStartedAt: now, count: 1 });
  } else if (entry.count >= MAX_ATTEMPTS) {
    res.setHeader('Retry-After', String(Math.ceil((WINDOW_MS - (now - entry.windowStartedAt)) / 1000)));
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Try again later.',
    });
  } else {
    entry.count += 1;
  }

  return next();
};
