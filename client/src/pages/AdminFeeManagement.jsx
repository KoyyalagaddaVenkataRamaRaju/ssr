import { useState } from 'react';
import FeeCreationForm from './AdminCreateFee';
import StudentFeeList from './StudentFeeList';
import { DollarSign, Users } from 'lucide-react';

export default function FeeManagement() {
  const [activeTab, setActiveTab] = useState('create');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeeCreated = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('manage');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fee Management System</h1>
          <p className="text-gray-600">Manage college fees for all students</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'create'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Create Fee
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              Manage Student Fees
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'create' ? (
            <FeeCreationForm onSuccess={handleFeeCreated} />
          ) : (
            <StudentFeeList key={refreshKey} />
          )}
        </div>
      </div>
    </div>
  );
}
