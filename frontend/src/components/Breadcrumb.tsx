import React from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  title: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map path segments to friendly names
  const getFriendlyName = (path: string) => {
    const nameMap: Record<string, string> = {
      'exams': 'Exams',
      'create': 'Create',
      'edit': 'Edit',
      'profile': 'Profile',
      'settings': 'Settings'
    };
    const mappedName = nameMap[path];
    return mappedName || path.charAt(0).toUpperCase() + path.slice(1).toLowerCase();
  };

  // Filter out 'user' and first segment (l, s, t, etc.)
  const filteredPathnames = pathnames.filter((name, index) => name !== 'user' && index !== 1);

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-2">
      <ol className="flex items-center space-x-2 text-sm">
        {filteredPathnames.map((name, index) => {
          const isLast = index === filteredPathnames.length - 1;
          const friendlyName = getFriendlyName(name);

          return (
            <li key={name} className="flex items-center">
              {index > 0 && <span className="mx-2 text-slate-400">/</span>}
              {isLast ? (
                <span className="text-slate-900 font-medium">{friendlyName}</span>
              ) : (
                <span className="text-slate-900 font-medium">{friendlyName}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
