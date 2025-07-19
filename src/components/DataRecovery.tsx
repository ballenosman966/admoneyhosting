import React, { useState } from 'react';
import { userStorage } from '../utils/userStorage';
import { User } from '../utils/userStorage';

interface DataRecoveryProps {
  onClose: () => void;
  onUserRestored: (user: User) => void;
}

export const DataRecovery: React.FC<DataRecoveryProps> = ({ onClose, onUserRestored }) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState('');

  const handleRestore = () => {
    setIsRestoring(true);
    setMessage('');

    try {
      if (userStorage.hasBackup()) {
        const success = userStorage.restoreFromBackup();
        if (success) {
          setMessage('✅ Data restored successfully! Your account should be back.');
          
          // Try to get the restored user
          const restoredUser = userStorage.getCurrentUser();
          if (restoredUser) {
            onUserRestored(restoredUser);
          }
          
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setMessage('❌ Failed to restore data from backup.');
        }
      } else {
        setMessage('❌ No backup found. Cannot restore data.');
      }
    } catch (error) {
      setMessage(`❌ Error during restore: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleCreateBackup = () => {
    try {
      const users = userStorage.getAllUsers();
      const currentUser = userStorage.getCurrentUser();
      const backup = {
        users,
        currentUser,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('adMoneyBackup', JSON.stringify(backup));
      setMessage('✅ Backup created successfully!');
    } catch (error) {
      setMessage(`❌ Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-white mb-4">Data Recovery</h2>
        
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Backup Status</h3>
            <p className="text-white/60 text-sm">
              {userStorage.hasBackup() 
                ? '✅ Backup found - you can restore your data' 
                : '❌ No backup found - create one to protect your data'
              }
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleRestore}
              disabled={isRestoring || !userStorage.hasBackup()}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRestoring ? 'Restoring...' : 'Restore Data'}
            </button>
            
            <button
              onClick={handleCreateBackup}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Create Backup
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 