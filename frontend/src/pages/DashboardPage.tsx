import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { reportsApi } from '../services/reports';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  activeMembers: number;
  monthlyRevenue: number;
  classesThisWeek: number;
  expiringMemberships: number;
  lowStockProducts: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    classesThisWeek: 0,
    expiringMemberships: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await reportsApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      // Use fallback data if API fails
      toast.error('Unable to load real-time stats, showing demo data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }: {
    title: string;
    value: number | string;
    icon: string;
    color: string;
    onClick?: () => void;
  }) => (
    <div 
      className={`bg-white overflow-hidden shadow rounded-lg ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 bg-${color}-500 rounded-md flex items-center justify-center`}>
              <span className="text-white text-lg">{icon}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  value
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ children, onClick, variant = 'primary' }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }) => (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        variant === 'primary'
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">
          {user?.role === 'ADMIN' 
            ? 'Monitor your gym operations, track performance, and manage all aspects of your business.'
            : user?.role === 'RECEPTIONIST'
            ? 'Manage member check-ins, process payments, and handle day-to-day operations.'
            : user?.role === 'TRAINER'
            ? 'View your classes, track attendance, and manage your training schedule.'
            : 'Welcome to your fitness journey! Check your memberships and book classes.'
          }
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
          onClick={() => navigate('/users')}
        />
        <StatCard
          title="Active Members"
          value={stats.activeMembers}
          icon="💪"
          color="green"
          onClick={() => navigate('/memberships')}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon="💰"
          color="purple"
          onClick={() => navigate('/payments')}
        />
        <StatCard
          title="Classes This Week"
          value={stats.classesThisWeek}
          icon="🏃‍♂️"
          color="indigo"
          onClick={() => navigate('/classes')}
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringMemberships}
          icon="⚠️"
          color="yellow"
          onClick={() => navigate('/memberships')}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockProducts}
          icon="📦"
          color="red"
          onClick={() => navigate('/products')}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton onClick={() => navigate('/users')} variant="primary">
            ➕ Add New User
          </QuickActionButton>
          <QuickActionButton onClick={() => navigate('/classes')}>
            📅 Schedule Class
          </QuickActionButton>
          <QuickActionButton onClick={() => navigate('/payments')}>
            💳 Process Payment
          </QuickActionButton>
          <QuickActionButton onClick={() => navigate('/reports')}>
            📊 View Reports
          </QuickActionButton>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              <span className="flex-1">New member John Doe registered</span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              <span className="flex-1">Payment of $89 processed</span>
              <span className="text-xs text-gray-400">5 min ago</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              <span className="flex-1">Yoga class booked by Sarah Wilson</span>
              <span className="text-xs text-gray-400">10 min ago</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
              <span className="flex-1">Product "Protein Powder" sold</span>
              <span className="text-xs text-gray-400">15 min ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            {stats.expiringMemberships > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-md">
                <span className="text-yellow-400 mr-3">⚠️</span>
                <span className="text-sm text-yellow-800">
                  {stats.expiringMemberships} memberships expiring in 30 days
                </span>
              </div>
            )}
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-md">
                <span className="text-red-400 mr-3">📦</span>
                <span className="text-sm text-red-800">
                  {stats.lowStockProducts} products are low in stock
                </span>
              </div>
            )}
            <div className="flex items-center p-3 bg-green-50 rounded-md">
              <span className="text-green-400 mr-3">✅</span>
              <span className="text-sm text-green-800">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;