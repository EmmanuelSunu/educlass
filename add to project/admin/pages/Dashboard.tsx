import AdminLayout from "../layout";
import {
  FiUsers,
  FiBook,
  FiClipboard,
  FiBarChart2,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { getGeneralStats } from "../data/analytics";

const Dashboard = () => {
  const stats = getGeneralStats();

  const getIcon = (type: 'warning' | 'success' | 'info') => {
    switch (type) {
      case 'warning':
        return FiAlertCircle;
      case 'success':
        return FiCheckCircle;
      case 'info':
        return FiClock;
      default:
        return FiAlertCircle;
    }
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalUsers}</h3>
              <p className="text-sm font-medium text-emerald-600">
                +{stats.userGrowth}%
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="text-xl text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Users</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.activeUsers}</h3>
              <p className="text-sm font-medium text-emerald-600">
                +{stats.userGrowth}%
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FiBook className="text-xl text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">New Users</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.newUsers}</h3>
              <p className="text-sm font-medium text-emerald-600">
                +{stats.userGrowth}%
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FiClipboard className="text-xl text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">System Health</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.systemHealth}%</h3>
              <p className="text-sm font-medium text-emerald-600">
                +{stats.userGrowth}%
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiBarChart2 className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activities</h2>
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {stats.recentActivities.map((activity, activityIdx) => {
              const Icon = getIcon(activity.type);
              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== stats.recentActivities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === "warning"
                              ? "bg-amber-100"
                              : activity.type === "success"
                              ? "bg-emerald-100"
                              : "bg-primary/10"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              activity.type === "warning"
                                ? "text-amber-600"
                                : activity.type === "success"
                                ? "text-emerald-600"
                                : "text-primary"
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-slate-600">{activity.message}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-slate-500">
                          <time dateTime={activity.time}>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 