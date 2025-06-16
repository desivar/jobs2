// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Users, DollarSign, Briefcase } from 'lucide-react'; // Example icons

const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data for the dashboard
  const stats = [
    { name: 'Total Customers', value: '1,200', icon: Users, color: 'text-blue-500' },
    { name: 'Active Jobs', value: '75', icon: Briefcase, color: 'text-green-500' },
    { name: 'Revenue (MTD)', value: '$15,000', icon: DollarSign, color: 'text-purple-500' },
    { name: 'Pending Tasks', value: '12', icon: BarChart, color: 'text-red-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {user?.name || 'User'}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`h-10 w-10 ${stat.color}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {/* Placeholder for a list of recent activities */}
          <ul className="space-y-3">
            <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center text-sm">
              <span>New customer "Acme Corp" added.</span>
              <span className="text-gray-500 text-xs">2 hours ago</span>
            </li>
            <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center text-sm">
              <span>Job #1024 updated: "Pending Review".</span>
              <span className="text-gray-500 text-xs">Yesterday</span>
            </li>
            <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center text-sm">
              <span>Invoice #501 sent to "Example LLC".</span>
              <span className="text-gray-500 text-xs">3 days ago</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li><a href="/customers" className="text-blue-600 hover:underline">Manage Customers</a></li>
            <li><a href="/jobs" className="text-blue-600 hover:underline">View All Jobs</a></li>
            <li><a href="/reports" className="text-blue-600 hover:underline">Generate Reports</a></li>
            <li><a href="/settings" className="text-blue-600 hover:underline">App Settings</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;