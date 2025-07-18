import React, { useState, useEffect } from 'react';
import { userStorage } from '../utils/userStorage';

interface KYCVerificationProps {
  onClose: () => void;
}

type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

interface KYCData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  documentType: 'passport' | 'national_id' | 'drivers_license';
  documentNumber: string;
  documentFront: string;
  documentBack: string;
  selfie: string;
  status: KYCStatus;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ onClose }) => {
  const [kycData, setKycData] = useState<KYCData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    documentType: 'passport',
    documentNumber: '',
    documentFront: '',
    documentBack: '',
    selfie: '',
    status: 'not_submitted'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load KYC data from user storage
    console.log('KYCVerification useEffect - userStorage object:', userStorage);
    const user = userStorage.getCurrentUser();
    console.log('KYCVerification useEffect - Current user:', user);
    if (user && user.kycData) {
      setKycData(user.kycData);
    }
  }, []);

  const handleInputChange = (field: keyof KYCData, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'documentFront' | 'documentBack' | 'selfie', file: File) => {
    console.log(`File upload for ${field}:`, file);
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(`${field} file loaded successfully`);
      setKycData(prev => ({ ...prev, [field]: e.target?.result as string }));
    };
    reader.onerror = (e) => {
      console.error(`Error loading ${field} file:`, e);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    console.log('handleSubmit called');
    const user = userStorage.getCurrentUser();
    console.log('Current user:', user);
    if (!user) {
      alert('User not found. Please log in again.');
      return;
    }

    const updatedKycData = {
      ...kycData,
      status: 'pending' as KYCStatus,
      submittedAt: new Date().toISOString()
    };
    
    // Save to user's profile using userStorage
    const updatedUser = { ...user, kycData: updatedKycData };
    userStorage.updateUser(updatedUser);
    
    // Save to admin dashboard format
    const kycVerification = {
      id: `kyc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      fullName: `${kycData.firstName} ${kycData.lastName}`,
      dateOfBirth: kycData.dateOfBirth,
      nationality: kycData.nationality,
      documentType: kycData.documentType,
      documentNumber: kycData.documentNumber,
      documentFront: kycData.documentFront,
      documentBack: kycData.documentBack,
      selfieWithDocument: kycData.selfie,
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
      adminNotes: undefined,
      rejectionReason: undefined
    };
    
    // Get existing KYC verifications and add new one
    const existingKyc = localStorage.getItem('kycVerifications');
    console.log('Existing KYC data from localStorage:', existingKyc);
    const kycList = existingKyc ? JSON.parse(existingKyc) : [];
    console.log('Parsed existing KYC list:', kycList);
    kycList.push(kycVerification);
    console.log('Updated KYC list with new submission:', kycList);
    localStorage.setItem('kycVerifications', JSON.stringify(kycList));
    
    // Verify the data was saved
    const savedData = localStorage.getItem('kycVerifications');
    console.log('Verified saved data:', savedData);
    
    console.log('KYC submitted:', kycVerification);
    console.log('Updated KYC list:', kycList);
    
    setKycData(updatedKycData);
    setShowForm(false);
    console.log('KYC submission completed successfully');
    
    // Verify data was saved correctly
    setTimeout(() => {
      const savedData = localStorage.getItem('kycVerifications');
      console.log('Verification - Saved KYC data:', savedData);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('Verification - Number of KYC submissions:', parsed.length);
        alert(`KYC verification submitted successfully! Your submission is now under review. Total submissions: ${parsed.length}`);
      } else {
        console.error('Verification - No KYC data found after submission!');
        alert('KYC verification submitted, but there was an issue saving the data. Please contact support.');
      }
    }, 100);
  };

  const getStatusColor = (status: KYCStatus) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: KYCStatus) => {
    switch (status) {
      case 'approved': return 'Verified';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Under Review';
      default: return 'Not Submitted';
    }
  };

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">KYC Verification</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-6 sm:w-12 h-1 mx-1 sm:mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">First Name</label>
                    <input
                      type="text"
                      value={kycData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Last Name</label>
                    <input
                      type="text"
                      value={kycData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={kycData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Nationality</label>
                    <input
                      type="text"
                      value={kycData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      placeholder="United States"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!kycData.firstName || !kycData.lastName || !kycData.dateOfBirth || !kycData.nationality}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Next: Document Information
                </button>
              </div>
            )}

            {/* Step 2: Document Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Document Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Document Type</label>
                    <select
                      value={kycData.documentType}
                      onChange={(e) => handleInputChange('documentType', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID</option>
                      <option value="drivers_license">Driver's License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Document Number</label>
                    <input
                      type="text"
                      value={kycData.documentNumber}
                      onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      placeholder="123456789"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Document Front</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('documentFront', e.target.files[0])}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                    />
                    {kycData.documentFront && (
                      <div className="mt-2">
                        <img src={kycData.documentFront} alt="Document Front" className="w-full h-32 object-cover rounded" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Document Back</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('documentBack', e.target.files[0])}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                    />
                    {kycData.documentBack && (
                      <div className="mt-2">
                        <img src={kycData.documentBack} alt="Document Back" className="w-full h-32 object-cover rounded" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!kycData.documentNumber || !kycData.documentFront || !kycData.documentBack}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Next: Selfie
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Selfie */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Selfie Verification</h4>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Take a Selfie</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  />
                  {kycData.selfie && (
                    <div className="mt-2">
                      <img src={kycData.selfie} alt="Selfie" className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded mx-auto" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      console.log('Submit button clicked');
                      console.log('Current kycData:', kycData);
                      console.log('Selfie exists:', !!kycData.selfie);
                      if (kycData.selfie) {
                        handleSubmit();
                      } else {
                        alert('Please upload a selfie before submitting');
                      }
                    }}
                    disabled={!kycData.selfie}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {!kycData.selfie ? 'Upload Selfie First' : 'Submit for Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">KYC Verification</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${
              kycData.status === 'approved' ? 'bg-green-500' : 
              kycData.status === 'rejected' ? 'bg-red-500' : 
              kycData.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            <span className={`${getStatusColor(kycData.status)}`}>
              Status: {getStatusText(kycData.status)}
            </span>
          </div>

          <p className="text-gray-300 text-sm">
            Complete KYC verification to unlock higher withdrawal limits and access to premium features.
          </p>

          {kycData.status === 'rejected' && kycData.rejectionReason && (
            <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4">
              <p className="text-red-400 text-sm">
                <strong>Rejection Reason:</strong> {kycData.rejectionReason}
              </p>
            </div>
          )}

          {kycData.status === 'pending' && (
            <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                Your KYC submission is under review. This usually takes 1-3 business days.
              </p>
            </div>
          )}

          {kycData.status === 'approved' && (
            <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                Your identity has been verified. You now have access to higher withdrawal limits.
              </p>
            </div>
          )}

          {kycData.status === 'not_submitted' && (
            <div className="space-y-2">
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Start KYC Verification
              </button>
              <button
                onClick={() => {
                  console.log('Test KYC submission');
                  const testKycData = {
                    firstName: 'Test',
                    lastName: 'User',
                    dateOfBirth: '1990-01-01',
                    nationality: 'United States',
                    documentType: 'passport' as const,
                    documentNumber: '123456789',
                    documentFront: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                    documentBack: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                    selfie: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                    status: 'not_submitted' as KYCStatus
                  };
                  setKycData(testKycData);
                  setShowForm(true);
                  setCurrentStep(3);
                }}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Test: Fill Form with Sample Data
              </button>
              <button
                onClick={() => {
                  console.log('=== KYC Data Check ===');
                  const kycData = localStorage.getItem('kycVerifications');
                  console.log('KYC data in localStorage:', kycData);
                  if (kycData) {
                    const parsed = JSON.parse(kycData);
                    console.log('Parsed KYC data:', parsed);
                    console.log('Number of KYC submissions:', parsed.length);
                    alert(`Found ${parsed.length} KYC submissions in localStorage`);
                  } else {
                    console.log('No KYC data found in localStorage');
                    alert('No KYC data found in localStorage');
                  }
                }}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors text-sm"
              >
                Check KYC Data in localStorage
              </button>
            </div>
          )}

          {kycData.status === 'rejected' && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Resubmit KYC
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCVerification; 