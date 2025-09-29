import React, { useState } from 'react';
import { Recycle, Users, Truck, Settings } from 'lucide-react';
import type { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'worker' | 'admin' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login - in production, this would connect to Firebase Auth
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: selectedRole!,
      certified: selectedRole === 'citizen' ? Math.random() > 0.5 : true,
      ward: selectedRole === 'admin' ? 'Ward 5' : undefined
    };
    
    onLogin(user);
  };

  const roles = [
    {
      id: 'citizen',
      name: 'Citizen',
      description: 'Manage household waste and access training',
      icon: Users,
      color: 'bg-green-500',
      demo: { email: 'citizen@greenloop.com', password: 'demo123' }
    },
    {
      id: 'worker',
      name: 'Waste Worker',
      description: 'Verify pickups and manage collection routes',
      icon: Truck,
      color: 'bg-blue-500',
      demo: { email: 'worker@greenloop.com', password: 'demo123' }
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Monitor system and generate reports',
      icon: Settings,
      color: 'bg-orange-500',
      demo: { email: 'admin@greenloop.com', password: 'demo123' }
    }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Recycle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GreenLoop</h1>
              <p className="text-gray-600">Smart Waste Management System</p>
            </div>
          </div>
          <p className="text-lg text-gray-700">
            Train → Proof → Reward: Building a sustainable waste management ecosystem
          </p>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Select Your Role
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className="group p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-gray-200 text-left"
                  >
                    <div className={`${role.color} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.name}</h3>
                    <p className="text-gray-600">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className={`${roles.find(r => r.id === selectedRole)?.color} p-3 rounded-lg w-fit mx-auto mb-4`}>
                {React.createElement(roles.find(r => r.id === selectedRole)?.icon!, { className: "h-6 w-6 text-white" })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {roles.find(r => r.id === selectedRole)?.name} Login
              </h2>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                ← Change Role
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full ${roles.find(r => r.id === selectedRole)?.color} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-opacity`}
              >
                Sign In
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Demo Credentials:</h4>
              <p className="text-sm text-gray-600">
                Email: {roles.find(r => r.id === selectedRole)?.demo.email}<br />
                Password: {roles.find(r => r.id === selectedRole)?.demo.password}
              </p>
              <button
                onClick={() => {
                  const demoRole = roles.find(r => r.id === selectedRole)!;
                  setEmail(demoRole.demo.email);
                  setPassword(demoRole.demo.password);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                Use Demo Credentials
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}