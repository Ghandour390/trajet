import { useState } from 'react';
import { ProfileImageUpload } from '../components/common';

function TestUpload() {
  const [result, setResult] = useState(null);
  const userId = localStorage.getItem('userId') || '123';

  const handleSuccess = (imageUrl) => {
    setResult({ success: true, url: imageUrl });
    console.log('✅ Image uploadée:', imageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Test Upload Image</h1>
        
        <ProfileImageUpload
          userId={userId}
          currentImage={result?.url}
          onSuccess={handleSuccess}
        />

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Succès!</h3>
            <p className="text-sm text-green-700 break-all">{result.url}</p>
            <img src={result.url} alt="Test" className="mt-4 w-32 h-32 rounded-lg object-cover" />
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Info</h3>
          <p className="text-sm text-blue-700">User ID: {userId}</p>
          <p className="text-sm text-blue-700">API: {import.meta.env.VITE_API_URL}</p>
        </div>
      </div>
    </div>
  );
}

export default TestUpload;
