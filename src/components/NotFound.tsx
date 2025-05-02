import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
