import React, { useState } from 'react';
import { Camera, QrCode, MapPin, CheckCircle2, ArrowLeft, Upload } from 'lucide-react';
import type { User, Pickup } from '../App';

interface PickupVerificationProps {
  user: User;
  pickups: Pickup[];
  onUpdatePickup: (pickupId: string, updates: Partial<Pickup>) => void;
  onBack: () => void;
}

export function PickupVerification({ user, pickups, onUpdatePickup, onBack }: PickupVerificationProps) {
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [verificationStep, setVerificationStep] = useState<'scan' | 'photo' | 'complete'>('scan');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [segregationScore, setSegregationScore] = useState<number>(0);

  const handleQRScan = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setVerificationStep('scan');
  };

  const handleScanComplete = () => {
    if (selectedPickup) {
      setVerificationStep('photo');
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        // Simulate ML scoring
        const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100%
        setSegregationScore(randomScore);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerificationComplete = () => {
    if (selectedPickup) {
      onUpdatePickup(selectedPickup.id, {
        status: 'collected',
        proofPhoto: photoPreview || undefined,
        segregationScore,
        timestamp: new Date().toISOString()
      });
      setVerificationStep('complete');
    }
  };

  const resetVerification = () => {
    setSelectedPickup(null);
    setVerificationStep('scan');
    setPhotoPreview(null);
    setSegregationScore(0);
  };

  const pendingPickups = pickups.filter(p => p.status === 'pending');

  if (verificationStep === 'complete') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pickup Verified!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Successfully verified pickup at {selectedPickup?.address}
          </p>
          
          <div className="bg-blue-50 p-6 rounded-xl mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Segregation Score</h3>
            <p className="text-3xl font-bold text-blue-600">{segregationScore}%</p>
          </div>
          
          <div className="space-x-4">
            <button
              onClick={resetVerification}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Verify Next Pickup
            </button>
            <button
              onClick={onBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPickup) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedPickup(null)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Pickup Verification</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${verificationStep === 'scan' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                verificationStep === 'scan' ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">QR Scan</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 mx-4">
              <div className={`h-1 ${verificationStep !== 'scan' ? 'bg-green-500' : 'bg-gray-200'} transition-all`} />
            </div>
            <div className={`flex items-center ${
              verificationStep === 'photo' ? 'text-blue-600' : 
              verificationStep === 'complete' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                verificationStep === 'photo' ? 'bg-blue-500' :
                verificationStep === 'complete' ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Photo Proof</span>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Pickup Details</h3>
            <p className="text-gray-700">{selectedPickup.address}</p>
            <p className="text-sm text-gray-600">Household: {selectedPickup.householdId}</p>
          </div>

          {verificationStep === 'scan' && (
            <div className="text-center">
              <div className="bg-gray-100 w-64 h-64 rounded-lg flex items-center justify-center mx-auto mb-6">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">QR Scanner Placeholder</p>
                  <p className="text-sm text-gray-500">Scan household QR code</p>
                </div>
              </div>
              <button
                onClick={handleScanComplete}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                QR Code Scanned
              </button>
            </div>
          )}

          {verificationStep === 'photo' && (
            <div className="text-center">
              {photoPreview ? (
                <div className="mb-6">
                  <img
                    src={photoPreview}
                    alt="Waste verification"
                    className="w-64 h-64 object-cover rounded-lg mx-auto mb-4"
                  />
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">AI Analysis Complete</h4>
                    <p className="text-blue-700">Segregation Score: {segregationScore}%</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 w-64 h-64 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Capture Proof Photo</p>
                    <p className="text-sm text-gray-500">Take photo of segregated waste</p>
                  </div>
                </div>
              )}
              
              <div className="space-x-4">
                <label className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer inline-flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  {photoPreview ? 'Retake Photo' : 'Take Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                </label>
                
                {photoPreview && (
                  <button
                    onClick={handleVerificationComplete}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Complete Verification
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Pickup Verification</h1>
        </div>

        {pendingPickups.length > 0 ? (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Select a pickup to verify. Scan the QR code and capture proof photo.
            </p>
            {pendingPickups.map((pickup) => (
              <div key={pickup.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pickup.address}</h3>
                    <p className="text-sm text-gray-600">
                      Household: {pickup.householdId}
                    </p>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">
                        {pickup.location.lat.toFixed(4)}, {pickup.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQRScan(pickup)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">All Pickups Completed</h3>
            <p className="text-gray-600">
              Great work! You've verified all scheduled pickups for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}