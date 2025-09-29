import React, { useState } from 'react';
import { MapPin, Camera, Send, ArrowLeft, Upload } from 'lucide-react';
import type { User, Blackspot } from '../App';

interface BlackspotReportingProps {
  user: User;
  onAddBlackspot: (blackspot: Omit<Blackspot, 'id'>) => void;
  onBack: () => void;
}

export function BlackspotReporting({ user, onAddBlackspot, onBack }: BlackspotReportingProps) {
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.warn('Location access denied by user. Using default location (Mumbai).');
          } else {
            console.error('Error getting location:', error);
          }
          // Fallback to demo location
          setLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    } else {
      // Fallback to demo location
      setLocation({ lat: 19.0760, lng: 72.8777 });
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !photo || !location) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const blackspot: Omit<Blackspot, 'id'> = {
      reporterId: user.id,
      location,
      description,
      photo,
      timestamp: new Date().toISOString(),
      status: 'reported'
    };

    onAddBlackspot(blackspot);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Report Submitted Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for reporting this black spot. The authorities have been notified and will take action soon.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-xl mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your report is forwarded to local authorities</li>
              <li>• Cleanup crew will be dispatched within 24-48 hours</li>
              <li>• You'll receive updates on the cleanup progress</li>
            </ul>
          </div>
          
          <button
            onClick={onBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Report Black Spot</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Help us keep your community clean by reporting illegal dumping locations. 
          Your report will be sent directly to local authorities for immediate action.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
              {location ? (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  </span>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="ml-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Update Location
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Get Current Location
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the illegal dumping location, types of waste found, and any other relevant details..."
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Evidence *
            </label>
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Black spot evidence"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <label className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors shadow-sm">
                  <Upload className="h-4 w-4 inline mr-2" />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Take a photo of the illegal dumping site</p>
                <label className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg cursor-pointer transition-colors inline-flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!description || !photo || !location || isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                'Submitting Report...'
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Black Spot Report
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Important Information</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Reports are sent directly to local authorities</li>
            <li>• Include clear photos for faster response</li>
            <li>• Avoid direct contact with hazardous waste</li>
            <li>• Emergency situations: Call local emergency services</li>
          </ul>
        </div>
      </div>
    </div>
  );
}