import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          {/* 404 raqami */}
          <h1 className="text-9xl font-extrabold tracking-widest bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-transparent bg-clip-text">
            404
          </h1>
          
          {/* Xato haqida ma'lumot */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Sahifa topilmadi
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
            </p>
          </div>

          {/* Bosh sahifaga qaytish tugmasi */}
          <div className="mt-12">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transform transition hover:-translate-y-0.5"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Bosh sahifaga qaytish
            </Link>
          </div>

          {/* Qo'shimcha ma'lumot */}
          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Agar bu xatolik takrorlansa, iltimos administrator bilan bog'laning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
