import React, { useState } from 'react';
import { FiUsers, FiUserCheck, FiUserPlus, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '../../layout';
import { getStudentStats } from '../../data/analytics';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, description }) => (
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
    <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
    {description && (
      <p className="text-sm text-slate-500">{description}</p>
    )}
  </div>
);

const StudentAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const stats = getStudentStats();

  const ProgramDistribution = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Students by Program</h3>
      <div className="space-y-4">
        {stats.studentsByProgram.map((program) => (
          <div key={program.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{program.name}</span>
              <span className="text-slate-600">{program.count} students</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2"
                style={{ width: `${program.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ActivityChart = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Activity</h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {stats.studentActivity.map((day) => (
          <div key={day.date} className="flex-1">
            <div className="relative h-full flex flex-col justify-end">
              <div
                className="w-full bg-primary/20 rounded-t"
                style={{
                  height: `${(day.active / stats.totalStudents) * 100}%`,
                }}
              />
              <div
                className="w-full bg-primary rounded-t absolute bottom-0"
                style={{
                  height: `${(day.new / stats.totalStudents) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1 text-center">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/20 rounded" />
          <span className="text-sm text-slate-600">Active Students</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded" />
          <span className="text-sm text-slate-600">New Students</span>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Student Analytics" showAddButton={false}>
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Student Overview</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<FiUsers className="w-6 h-6 text-primary" />}
            trend={stats.studentGrowth}
            description="All registered students"
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon={<FiUserCheck className="w-6 h-6 text-primary" />}
            trend={stats.enrollmentRate}
            description="Students active this week"
          />
          <StatCard
            title="New Students"
            value={stats.newStudents}
            icon={<FiUserPlus className="w-6 h-6 text-primary" />}
            description="Joined this week"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<FiTrendingUp className="w-6 h-6 text-primary" />}
            trend={stats.completionRate}
            description="Course completion rate"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgramDistribution />
          <ActivityChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAnalytics; 