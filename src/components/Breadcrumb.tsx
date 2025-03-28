import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

interface BreadcrumbProps {
  title: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-2">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link to="/" className="text-slate-500 hover:text-slate-700">
            <FiHome className="w-4 h-4" />
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={name} className="flex items-center">
              <span className="mx-2 text-slate-400">/</span>
              {isLast ? (
                <span className="text-slate-900 font-medium">{title}</span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-slate-500 hover:text-slate-700 capitalize"
                >
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
