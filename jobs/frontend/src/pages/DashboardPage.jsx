import React, { useState, useEffect } from 'react';
import { useAuth } from '../api/UserPofrilePage';
import { usePipelines } from '../api/pipelines';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  User, 
  Briefcase, 
  TrendingUp, 
  Clock,
  Plus,
  Settings,
  LogOut,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { pipelines, loading: pipelinesLoading } = usePipelines();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activePipelines: 0,
    pendingApplications: 0,
    completedApplications: 0
  });

  // Mock job data - replace with real API call
  const [recentJobs] = useState([
    { id: 1, title: 'Frontend Developer', company: 'TechCorp', status: 'Interview', date: '2024-06-10' },
    { id: 2, title: 'Backend Engineer', company: 'StartupXYZ', status: 'Applied', date: '2024-06-12' },
    { id: 3, title: 'Full Stack Dev', company: 'BigTech', status: 'Offer', date: '2024-06-14' }
  ]);

  // Chart data
  const applicationData = [
    { name: 'Applied', value: 15, color: '#3B82F6' },
    { name: 'Interview', value: 8, color: '#F59E0B' },
    { name: 'Offer', value: 3, color: '#10B981' },
    { name: 'Rejected', value: 5, color: '#EF4444' }
  ];

  const weeklyData = [
    { day: 'Mon', applications: 2 },
    { day: 'Tue', applications: 5 },
    { day: 'Wed', applications: 3 },
    { day: 'Thu', applications: 8 },
    { day: 'Fri', applications: 4 },
    { day: 'Sat', applications: 1 },
    { day: 'Sun', applications: 2 }
  ];

  useEffect(() => {
    // Calculate stats from pipelines data
    if (pipelines.length > 0) {
      setStats({
        totalJobs: recentJobs.length,
        activePipelines: pipelines.length,
        pendingApplications: recentJobs.filter(job => job.status === 'Applied' || job.status === 'Interview').length,
        completedApplications: recentJobs.filter(job => job.status === 'Offer' || job.status === 'Rejected').length
      });
    }
  }, [pipelines, recentJobs]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h2>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Job Tracker Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Pipelines</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePipelines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Application Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {applicationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center mt-4 space-x-4">
              {applicationData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Applications Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Applications</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Jobs and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Job Applications</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentJobs.map((job) => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <p className="text-xs text-gray-500">Applied: {job.date}</p>
                    </div>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        job.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'Offer' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all applications →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add New Job</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span>View Pipelines</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>

            {/* Pipeline Status */}
            {!pipelinesLoading && (
              <div className="px-6 py-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Your Pipelines</h4>
                <div className="space-y-2">
                  {pipelines.slice(0, 3).map((pipeline) => (
                    <div key={pipeline._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{pipeline.name}</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  ))}
                </div>
                {pipelines.length > 3 && (
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                    View all ({pipelines.length}) →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;