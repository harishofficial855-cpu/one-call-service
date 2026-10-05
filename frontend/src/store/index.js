import { create } from 'zustand';

const storage = {
  getItem(key) {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  },
  removeItem(key) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  },
};

const readStoredUser = () => {
  const storedUser = storage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    storage.removeItem('user');
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  token: storage.getItem('token') || null,

  login: (user, token) => {
    storage.setItem('user', JSON.stringify(user));
    storage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    storage.removeItem('user');
    storage.removeItem('token');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    const currentUser = readStoredUser() || {};
    const updatedUser = { ...currentUser, ...userData };
    storage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,

  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
}));
