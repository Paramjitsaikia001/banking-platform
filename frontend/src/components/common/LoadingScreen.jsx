// src/components/common/LoadingScreen.jsx
import LoadingSpinner from './LoadingSpinner';

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" color="primary" />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;