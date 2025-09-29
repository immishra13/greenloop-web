import React from 'react';
import { BarChart3, MapPin, Users, AlertTriangle, TrendingUp, Download, Eye } from 'lucide-react';
import type { User, Pickup, Blackspot } from '../App';

interface AdminDashboardProps {
  user: User;
  pickups: Pickup[];
  blackspots: Blackspot[];
  onViewChange: (view: string) => void;
}

export function AdminDashboard({ user, pickups, blackspots, onViewChange }: AdminDashboardProps) {
  const totalPickups = pickups.length;
  const completedPickups = pickups.filter(p => p.status === 'processed').length;
  const averageScore = pickups.length > 0 
    ? Math.round(pickups.reduce((sum, p) => sum + p.segregationScore, 0) / pickups.length)
    : 0;
  const activeBlackspots = blackspots.filter(b => b.status !== 'resolved').length;

  const generateReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      ward: user.ward,
      totalPickups,
      completedPickups,
      averageScore,
      blackspots: activeBlackspots,
      efficiency: Math.round((completedPickups / totalPickups) * 100)
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `greenloop-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {user.ward} Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor waste collection activities and system performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{totalPickups}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPickups > 0 ? Math.round((completedPickups / totalPickups) * 100) : 0}%
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Segregation</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Black Spots</p>
              <p className="text-2xl font-bold text-gray-900">{activeBlackspots}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Live Monitoring */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Live Monitoring
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive Map View</p>
                <p className="text-sm text-gray-500">Real-time collection routes</p>
              </div>
            </div>
            <button
              onClick={() => alert('Full map view coming soon!')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Full Map
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">System Controls</h2>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={generateReport}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Generate Ward Report
            </button>
            <button
              onClick={() => alert('Facility management coming soon!')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Manage Facilities
            </button>
            <button
              onClick={() => alert('Alert system coming soon!')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Send System Alert
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Pickups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Pickups</h2>
          </div>
          <div className="p-6">
            {pickups.length > 0 ? (
              <div className="space-y-4">
                {pickups.slice(0, 5).map((pickup) => (
                  <div key={pickup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{pickup.address}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(pickup.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        pickup.status === 'processed' ? 'bg-green-100 text-green-700' :
                        pickup.status === 'collected' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {pickup.status}
                      </span>
                      {pickup.segregationScore > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {pickup.segregationScore}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No recent pickups</p>
            )}
          </div>
        </div>

        {/* Black Spots */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Active Black Spots</h2>
          </div>
          <div className="p-6">
            {blackspots.length > 0 ? (
              <div className="space-y-4">
                {blackspots.slice(0, 5).map((blackspot) => (
                  <div key={blackspot.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Lat: {blackspot.location.lat.toFixed(4)}, 
                        Lng: {blackspot.location.lng.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-600">{blackspot.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      blackspot.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      blackspot.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {blackspot.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No active black spots</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}