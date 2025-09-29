import React, { useState, useEffect } from 'react';
import { Recycle, Users, Shield, MapPin, Camera, Award, BarChart3, Bell, CheckCircle2 } from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { CitizenDashboard } from './components/CitizenDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TrainingModule } from './components/TrainingModule';
import { PickupVerification } from './components/PickupVerification';
import { BlackspotReporting } from './components/BlackspotReporting';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'worker' | 'admin';
  certified?: boolean;
  ward?: string;
}

export interface Pickup {
  id: string;
  householdId: string;
  address: string;
  timestamp: string;
  status: 'pending' | 'collected' | 'transported' | 'processed';
  workerId: string;
  proofPhoto?: string;
  location: { lat: number; lng: number };
  segregationScore: number;
}

export interface Blackspot {
  id: string;
  reporterId: string;
  location: { lat: number; lng: number };
  description: string;
  photo: string;
  timestamp: string;
  status: 'reported' | 'acknowledged' | 'resolved';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [blackspots, setBlackspots] = useState<Blackspot[]>([]);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('greenloop_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load demo data
    const savedPickups = localStorage.getItem('greenloop_pickups');
    if (savedPickups) {
      setPickups(JSON.parse(savedPickups));
    } else {
      // Initialize with demo data
      const demoPickups: Pickup[] = [
        {
          id: '1',
          householdId: 'HH001',
          address: '123 Green Street, Ward 5',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'collected',
          workerId: 'worker1',
          location: { lat: 19.0760, lng: 72.8777 },
          segregationScore: 95
        },
        {
          id: '2',
          householdId: 'HH002',
          address: '456 Eco Lane, Ward 5',
          timestamp: new Date().toISOString(),
          status: 'pending',
          workerId: 'worker1',
          location: { lat: 19.0760, lng: 72.8777 },
          segregationScore: 0
        }
      ];
      setPickups(demoPickups);
      localStorage.setItem('greenloop_pickups', JSON.stringify(demoPickups));
    }

    const savedBlackspots = localStorage.getItem('greenloop_blackspots');
    if (savedBlackspots) {
      setBlackspots(JSON.parse(savedBlackspots));
    }
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('greenloop_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('greenloop_user');
    setCurrentView('dashboard');
  };

  const updatePickup = (pickupId: string, updates: Partial<Pickup>) => {
    const updatedPickups = pickups.map(pickup => 
      pickup.id === pickupId ? { ...pickup, ...updates } : pickup
    );
    setPickups(updatedPickups);
    localStorage.setItem('greenloop_pickups', JSON.stringify(updatedPickups));
  };

  const addBlackspot = (blackspot: Omit<Blackspot, 'id'>) => {
    const newBlackspot = { ...blackspot, id: Date.now().toString() };
    const updatedBlackspots = [...blackspots, newBlackspot];
    setBlackspots(updatedBlackspots);
    localStorage.setItem('greenloop_blackspots', JSON.stringify(updatedBlackspots));
  };

  if (!currentUser) {
    return <LoginPage onLogin={login} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'training':
        return <TrainingModule user={currentUser} onComplete={() => setCurrentView('dashboard')} />;
      case 'pickup':
        return (
          <PickupVerification 
            user={currentUser}
            pickups={pickups.filter(p => p.workerId === currentUser.id)}
            onUpdatePickup={updatePickup}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'blackspot':
        return (
          <BlackspotReporting
            user={currentUser}
            onAddBlackspot={addBlackspot}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        switch (currentUser.role) {
          case 'citizen':
            return (
              <CitizenDashboard 
                user={currentUser} 
                onViewChange={setCurrentView}
                pickups={pickups.filter(p => p.householdId === `HH${currentUser.id.slice(-3)}`)}
              />
            );
          case 'worker':
            return (
              <WorkerDashboard 
                user={currentUser} 
                onViewChange={setCurrentView}
                pickups={pickups.filter(p => p.workerId === currentUser.id)}
              />
            );
          case 'admin':
            return (
              <AdminDashboard 
                user={currentUser}
                pickups={pickups}
                blackspots={blackspots}
                onViewChange={setCurrentView}
              />
            );
          default:
            return <div>Invalid role</div>;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GreenLoop</h1>
                <p className="text-sm text-gray-500">Smart Waste Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={logout}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;