import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
    <h2 className="text-xl font-semibold text-gray-300 mb-2">Page not found</h2>
    <p className="text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
    <Link to="/" className="btn-primary">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
