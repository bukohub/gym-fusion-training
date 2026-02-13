import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { reportsApi } from '../../services/reports';
import PaymentStatusReport from '../../components/reports/PaymentStatusReport';

interface DashboardStats {
  totalUsers: number;
  activeMembers: number;
  monthlyRevenue: number;
  classesThisWeek: number;
  expiringMemberships: number;
  lowStockProducts: number;
}

const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'revenue' | 'memberships' | 'classes' | 'users' | 'payment-status'>('dashboard');
  
  // Date filters
  const [dateFilters, setDateFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Report data
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardStats();
    } else if (activeTab === 'payment-status') {
      // PaymentStatusReport component handles its own data loading
      return;
    } else {
      loadReportData();
    }
  }, [activeTab, dateFilters]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadReportData = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (activeTab) {
        case 'revenue':
          response = await reportsApi.getRevenueReport(dateFilters.startDate, dateFilters.endDate);
          break;
        case 'memberships':
          response = await reportsApi.getMembershipReport();
          break;
        case 'classes':
          response = await reportsApi.getClassReport(dateFilters.startDate, dateFilters.endDate);
          break;
        case 'users':
          response = await reportsApi.getUserReport();
          break;
        default:
          return;
      }
      
      setReportData(response.data);
    } catch (error) {
      toast.error(`Failed to load ${activeTab} report`);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color = 'indigo' }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-8 h-8 rounded-md bg-${color}-500 flex items-center justify-center`}>
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {subtitle && <dd className="text-sm text-gray-500">{subtitle}</dd>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle="All registered users"
          color="blue"
        />
        <StatCard
          title="Active Members"
          value={stats?.activeMembers || 0}
          subtitle="With valid memberships"
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats?.monthlyRevenue || 0}`}
          subtitle="This month's earnings"
          color="purple"
        />
        <StatCard
          title="Classes This Week"
          value={stats?.classesThisWeek || 0}
          subtitle="Scheduled classes"
          color="indigo"
        />
        <StatCard
          title="Expiring Soon"
          value={stats?.expiringMemberships || 0}
          subtitle="Memberships in 30 days"
          color="yellow"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockProducts || 0}
          subtitle="Products need restocking"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('revenue')}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              📊 View Revenue Report
            </button>
            <button
              onClick={() => setActiveTab('memberships')}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              👥 Membership Analytics
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              🏃‍♂️ Class Attendance Report
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              📈 User Growth Report
            </button>
            <button
              onClick={() => setActiveTab('payment-status')}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              💳 Payment Status Report
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              New member registered 2 minutes ago
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Payment processed 5 minutes ago
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Class booking made 10 minutes ago
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              Product sold 15 minutes ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportView = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={dateFilters.startDate}
              onChange={(e) => setDateFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={dateFilters.endDate}
              onChange={(e) => setDateFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report
        </h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : reportData ? (
          <div className="space-y-4">
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No data available for the selected period.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <button
          onClick={() => window.print()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Print Report
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'revenue', label: 'Revenue', icon: '💰' },
            { key: 'memberships', label: 'Memberships', icon: '👥' },
            { key: 'classes', label: 'Classes', icon: '🏃‍♂️' },
            { key: 'users', label: 'Users', icon: '📈' },
            { key: 'payment-status', label: 'Estado de Pagos', icon: '💳' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' ? (
        <DashboardView />
      ) : activeTab === 'payment-status' ? (
        <PaymentStatusReport />
      ) : (
        <ReportView />
      )}
    </div>
  );
};

export default ReportsPage;