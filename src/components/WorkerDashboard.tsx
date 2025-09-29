import React from 'react';
import { Shield, Camera, MapPin, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import type { User, Pickup } from '../App';

interface WorkerDashboardProps {
  user: User;
  onViewChange: (view: string) => void;
  pickups: Pickup[];
}

export function WorkerDashboard({ user, onViewChange, pickups }: WorkerDashboardProps) {
  const pendingPickups = pickups.filter(p => p.status === 'pending').length;
  const completedToday = pickups.filter(p => 
    p.status === 'collected' && 
    new Date(p.timestamp).toDateString() === new Date().toDateString()
  ).length;
  const averageScore = pickups.length > 0 
    ? Math.round(pickups.reduce((sum, p) => sum + p.segregationScore, 0) / pickups.length)
    : 0;

  const safetyItems = [
    { item: 'Safety Gloves', checked: true },
    { item: 'High-Vis Vest', checked: true },
    { item: 'Safety Boots', checked: false },
    { item: 'Face Mask', checked: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Good morning, {user.name}!
        </h1>
        <p className="text-gray-600">
          Complete your safety check and start your collection route.
        </p>
      </div>

      {/* Safety Check Alert */}
      {safetyItems.some(item => !item.checked) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Safety Check Required
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Complete your daily safety checklist before starting pickups.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPickups}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Segregation</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Safety Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {safetyItems.every(item => item.checked) ? '✓' : '!'}
              </p>
            </div>
            <div className={`${safetyItems.every(item => item.checked) ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-lg`}>
              <Shield className={`h-6 w-6 ${safetyItems.every(item => item.checked) ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Safety Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Daily Safety Check
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {safetyItems.map((item, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-900">{item.item}</span>
                </label>
              ))}
            </div>
            {safetyItems.every(item => item.checked) && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Safety check complete. You're ready to start!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={() => onViewChange('pickup')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Pickup Verification
            </button>
            <button
              onClick={() => alert('Route optimization feature coming soon!')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <MapPin className="h-5 w-5 mr-2" />
              View Route Map
            </button>
          </div>
        </div>
      </div>

      {/* Today's Pickups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
        </div>
        <div className="p-6">
          {pickups.length > 0 ? (
            <div className="space-y-4">
              {pickups.slice(0, 5).map((pickup) => (
                <div key={pickup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      pickup.status === 'collected' ? 'bg-green-500' :
                      pickup.status === 'pending' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{pickup.address}</p>
                      <p className="text-sm text-gray-600">
                        Household: {pickup.householdId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pickup.status === 'collected' ? 'bg-green-100 text-green-800' :
                      pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
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
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pickups scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}