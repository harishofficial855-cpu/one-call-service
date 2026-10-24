const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;
const MAX_TRACKED_IPS = 10000;
const requestsByIp = new Map();

export const trackingRateLimit = (req, res, next) => {
  const now = Date.now();
  const ip = req.ip;
  const entry = requestsByIp.get(ip);

  if (!entry || now - entry.windowStartedAt >= WINDOW_MS) {
    if (!entry && requestsByIp.size >= MAX_TRACKED_IPS) {
      for (const [key, value] of requestsByIp) {
        if (now - value.windowStartedAt >= WINDOW_MS) requestsByIp.delete(key);
      }
      if (requestsByIp.size >= MAX_TRACKED_IPS) {
        res.setHeader('Retry-After', '60');
        return res.status(429).json({
          success: false,
          message: 'Tracking is temporarily busy. Try again shortly.',
        });
      }
    }
    requestsByIp.set(ip, { windowStartedAt: now, count: 1 });
  } else if (entry.count >= MAX_REQUESTS) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({
      success: false,
      message: 'Too many tracking events. Try again shortly.',
    });
  } else {
    entry.count += 1;
  }

  return next();
};
