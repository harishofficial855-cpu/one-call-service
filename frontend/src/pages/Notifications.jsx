import React, { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, Clock3 } from 'lucide-react';
import api from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
    } catch {
      setError('We could not load your notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (notification) => {
    if (notification.isRead) return;
    setUpdating(true);
    try {
      const { data } = await api.put(`/notifications/${notification._id}/read`);
      setNotifications((current) => current.map((item) => item._id === notification._id ? data.notification : item));
    } catch {
      setError('This notification could not be marked as read. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const markAllAsRead = async () => {
    setUpdating(true);
    try {
      await api.put('/notifications/read-all');
      setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
    } catch {
      setError('Your notifications could not be marked as read. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <section className="container-custom min-h-[60vh] py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Your account</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Notifications</h1>
            <p className="mt-1 text-sm text-slate-500">{unreadCount ? `${unreadCount} unread` : 'You are all caught up'}</p>
          </div>
          {unreadCount > 0 && (
            <button type="button" onClick={markAllAsRead} disabled={updating} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50">
              <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark all read
            </button>
          )}
        </div>

        {error && notifications.length > 0 && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {error && notifications.length === 0 && !loading ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-800">
            <p>{error}</p>
            <button type="button" onClick={loadNotifications} className="mt-4 rounded-xl bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800">Try again</button>
          </div>
        ) : loading ? (
          <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-200" />)}</div>
        ) : notifications.length ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <article key={notification._id} className={`flex gap-4 rounded-2xl border p-5 ${notification.isRead ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50/70'}`}>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${notification.isRead ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold text-slate-900">{notification.title || notification.type}</h2>
                    {!notification.isRead && <span className="h-2 w-2 rounded-full bg-blue-600" aria-label="Unread" />}
                  </div>
                  {notification.message && <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>}
                  {notification.createdAt && <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{new Date(notification.createdAt).toLocaleString()}</p>}
                  {!notification.isRead && <button type="button" onClick={() => markAsRead(notification)} disabled={updating} className="mt-3 text-xs font-bold text-blue-700 hover:text-blue-900 disabled:opacity-50">Mark as read</button>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Bell className="h-7 w-7" aria-hidden="true" /></div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">No notifications yet</h2>
            <p className="mt-2 text-sm text-slate-600">Updates about your bookings will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
