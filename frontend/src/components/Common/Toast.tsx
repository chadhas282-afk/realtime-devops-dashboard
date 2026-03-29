import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeToast } from '../../store/slices/uiSlice';

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onDismiss={() => dispatch(removeToast(toast.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onDismiss: () => void;
}

const typeStyles = {
  success: 'bg-green-800 border-green-600 text-green-100',
  error: 'bg-red-800 border-red-600 text-red-100',
  info: 'bg-blue-800 border-blue-600 text-blue-100',
  warning: 'bg-yellow-800 border-yellow-600 text-yellow-100',
};

const ToastItem: React.FC<ToastItemProps> = ({ type, message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border text-sm max-w-sm shadow-lg ${typeStyles[type]}`}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </motion.div>
  );
};

export default Toast;
