import React from 'react';
import { FiUsers, FiUserCheck, FiTrendingUp, FiAward } from 'react-icons/fi';
import { getAnalyticsPageData } from '../../data/analyticsPage';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

interface ActivityItemProps {
  type: 'warning' | 'success' | 'info';
  user: string;
  course: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, user, course, timestamp }) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FiTrendingUp className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <FiAward className="w-5 h-5 text-emerald-600" />;
      case 'info':
        return <FiUserCheck className="w-5 h-5 text-primary" />;
      default:
        return <FiUserCheck className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <div className={`p-2 rounded-full ${
        type === 'warning' ? 'bg-amber-100' :
        type === 'success' ? 'bg-emerald-100' :
        'bg-primary/10'
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">
          {user} enrolled in {course}
        </p>
        <p className="text-sm text-slate-500">{timestamp}</p>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const data = getAnalyticsPageData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Enrollments"
          value={data.totalEnrollments}
          icon={<FiUsers className="w-6 h-6 text-primary" />}
          trend={12.5}
        />
        <StatCard
          title="Active Enrollments"
          value={data.activeEnrollments}
          icon={<FiUserCheck className="w-6 h-6 text-primary" />}
          trend={8.7}
        />
        <StatCard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          icon={<FiTrendingUp className="w-6 h-6 text-primary" />}
          trend={2.4}
        />
        <StatCard
          title="Average Grade"
          value={data.averageGrade}
          icon={<FiAward className="w-6 h-6 text-primary" />}
          trend={1.2}
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {data.recentActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              type={activity.type}
              user={activity.user}
              course={activity.course}
              timestamp={activity.timestamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 