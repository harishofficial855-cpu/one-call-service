import Service from '../models/Service.js';
import TrackingEvent from '../models/TrackingEvent.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
const PAGE_PATH_PATTERN = /^\/(?:[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*)?\/?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isCalendarDate = (value) => {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const createTrackingEvent = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ success: false, message: 'Invalid tracking event' });
  }

  const { eventId, eventType, action, providerId, pagePath } = req.body;
  const allowedKeys = new Set(['eventId', 'eventType', 'action', 'providerId', 'pagePath']);
  const hasUnexpectedKey = Object.keys(req.body || {}).some((key) => !allowedKeys.has(key));

  if (
    hasUnexpectedKey ||
    typeof eventId !== 'string' ||
    !UUID_PATTERN.test(eventId) ||
    typeof pagePath !== 'string' ||
    pagePath.length > 200 ||
    !PAGE_PATH_PATTERN.test(pagePath)
  ) {
    return res.status(400).json({ success: false, message: 'Invalid tracking event' });
  }

  const event = { eventId, eventType, pagePath, occurredAt: new Date() };

  if (eventType === 'page_view') {
    if (action !== undefined || providerId !== undefined) {
      return res.status(400).json({ success: false, message: 'Invalid page view event' });
    }
  } else if (eventType === 'provider_click') {
    if (
      !['call', 'whatsapp'].includes(action) ||
      typeof providerId !== 'string' ||
      !OBJECT_ID_PATTERN.test(providerId)
    ) {
      return res.status(400).json({ success: false, message: 'Invalid provider click event' });
    }
    event.action = action;
    event.providerId = providerId;
  } else {
    return res.status(400).json({ success: false, message: 'Unsupported tracking event' });
  }

  try {
    await TrackingEvent.create(event);
    return res.status(201).json({ success: true });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.eventId) {
      return res.status(200).json({ success: true, duplicate: true });
    }
    throw error;
  }
});

export const getAnalyticsReport = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const defaultStart = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const from = req.query.from || defaultStart;
  const to = req.query.to || today;

  if (!isCalendarDate(from) || !isCalendarDate(to) || from > to) {
    return res.status(400).json({ success: false, message: 'Provide a valid date range' });
  }

  const start = new Date(`${from}T00:00:00.000Z`);
  const endExclusive = new Date(`${to}T00:00:00.000Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

  if (endExclusive - start > 366 * 24 * 60 * 60 * 1000) {
    return res.status(400).json({ success: false, message: 'Date range cannot exceed 366 days' });
  }

  const dateFilter = { occurredAt: { $gte: start, $lt: endExclusive } };
  const [dailyTotals, providerCounts, pageCounts] = await Promise.all([
    TrackingEvent.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$occurredAt', timezone: 'UTC' } },
            eventType: '$eventType',
            action: '$action',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]),
    TrackingEvent.aggregate([
      { $match: { ...dateFilter, eventType: 'provider_click' } },
      {
        $group: {
          _id: { providerId: '$providerId', action: '$action' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
    TrackingEvent.aggregate([
      { $match: { ...dateFilter, eventType: 'page_view', pagePath: /^\/services\/[a-f\d]{24}\/?$/i } },
      { $group: { _id: '$pagePath', views: { $sum: 1 } } },
      { $sort: { views: -1, _id: 1 } },
      { $limit: 20 },
    ]),
  ]);

  const serviceIds = [
    ...pageCounts
      .map(({ _id }) => _id.split('/')[2].toLowerCase())
      .filter((id) => OBJECT_ID_PATTERN.test(id)),
    ...providerCounts
      .map(({ _id }) => _id.providerId?.toString())
      .filter((id) => OBJECT_ID_PATTERN.test(id)),
  ];
  const services = await Service.find({ _id: { $in: serviceIds } }).select('name providerName').lean();
  const serviceById = new Map(services.map((service) => [service._id.toString(), service]));

  const clicks = providerCounts.map(({ _id, count }) => ({
    providerId: _id.providerId?.toString() || null,
    action: _id.action,
    count,
    providerName: serviceById.get(_id.providerId?.toString())?.providerName || '',
    serviceName: serviceById.get(_id.providerId?.toString())?.name || 'Service no longer available',
  }));

  const mostViewedServices = pageCounts.map(({ _id, views }) => {
    const serviceId = _id.split('/')[2].toLowerCase();
    const service = serviceById.get(serviceId);
    return {
      providerId: serviceId,
      pagePath: _id,
      views,
      serviceName: service?.name || 'Service no longer available',
    };
  });

  res.status(200).json({
    success: true,
    range: { from, to },
    dailyTotals: dailyTotals.map(({ _id, count }) => ({
      date: _id.date,
      eventType: _id.eventType,
      action: _id.action || null,
      count,
    })),
    providerClicks: clicks,
    mostViewedServices,
  });
});
