import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#ECEFFF] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-none">
        <div className="p-8 flex flex-col items-center">
          {/* Christmas Scene Image */}
          <div className="w-64 h-64 mb-6 relative flex items-center justify-center">
            <img 
              src="Sleigh.png"
              alt="Christmas tree and sleigh with presents"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text Content */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Merry Christmas</h1>
          <p className="text-gray-600 text-center mb-8">
            Surprise your friends with christmas gifts and the extent of love between you
          </p>

          {/* Form */}
          <div className="w-full space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-full bg-transparent border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;