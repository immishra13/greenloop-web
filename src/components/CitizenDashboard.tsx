import React from 'react';
import { BookOpen, Package, MapPin, Award, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import type { User, Pickup } from '../App';

interface CitizenDashboardProps {
  user: User;
  onViewChange: (view: string) => void;
  pickups: Pickup[];
}

export function CitizenDashboard({ user, onViewChange, pickups }: CitizenDashboardProps) {
  const completedPickups = pickups.filter(p => p.status === 'processed').length;
  const averageScore = pickups.length > 0 
    ? Math.round(pickups.reduce((sum, p) => sum + p.segregationScore, 0) / pickups.length)
    : 0;

  const quickActions = [
    {
      icon: BookOpen,
      title: 'Training & Certification',
      description: 'Complete your waste segregation training',
      action: () => onViewChange('training'),
      color: 'bg-blue-500',
      status: user.certified ? 'Certified' : 'Required'
    },
    {
      icon: Package,
      title: 'Order 3-Bin Kit',
      description: 'Get your home segregation setup',
      action: () => alert('Kit ordering feature coming soon!'),
      color: 'bg-green-500',
      status: 'Available'
    },
    {
      icon: MapPin,
      title: 'Report Black Spot',
      description: 'Report illegal dumping locations',
      action: () => onViewChange('blackspot'),
      color: 'bg-red-500',
      status: 'Report'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Track your waste management journey and earn rewards for proper segregation.
        </p>
      </div>

      {/* Certification Alert */}
      {!user.certified && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                Certification Required
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Complete your waste segregation training to unlock all features and start earning rewards.
              </p>
              <button
                onClick={() => onViewChange('training')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg mt-3 transition-colors"
              >
                Start Training
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{completedPickups}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Segregation Score</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rewards Earned</p>
              <p className="text-2xl font-bold text-gray-900">₹{completedPickups * 10}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Certification</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.certified ? '✓' : '✗'}
              </p>
            </div>
            <div className={`${user.certified ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-lg`}>
              <BookOpen className={`h-6 w-6 ${user.certified ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    action.status === 'Certified' ? 'bg-green-100 text-green-700' :
                    action.status === 'Required' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {action.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Pickups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Pickups</h2>
        </div>
        <div className="p-6">
          {pickups.length > 0 ? (
            <div className="space-y-4">
              {pickups.slice(0, 5).map((pickup) => (
                <div key={pickup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{pickup.address}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(pickup.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pickup.status === 'processed' ? 'bg-green-100 text-green-800' :
                      pickup.status === 'collected' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pickup.status}
                    </span>
                    {pickup.segregationScore > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        Score: {pickup.segregationScore}%
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pickups scheduled yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}