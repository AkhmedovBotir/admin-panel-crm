import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js ni ro'yxatdan o'tkazish
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Statik ma'lumotlar (keyinchalik API dan olinadi)
const staticApplications = [
  { id: 1, status: 'yangi' },
  { id: 2, status: 'jarayonda' },
  { id: 3, status: 'bajarilgan' },
  { id: 4, status: 'yangi' },
  { id: 5, status: 'bajarilgan' },
];

const staticSuggestions = [
  { id: 1, status: 'yangi' },
  { id: 2, status: 'jarayonda' },
  { id: 3, status: 'bajarilgan' },
  { id: 4, status: 'yangi' },
];

const staticReports = [
  { id: 1, createdDate: '2024-01-01' },
  { id: 2, createdDate: '2024-01-15' },
  { id: 3, createdDate: '2024-01-20' },
  { id: 4, createdDate: '2024-01-25' },
];

export default function Dashboard() {
  // Arizalar statistikasi
  const applicationStats = {
    total: staticApplications.length,
    new: staticApplications.filter(a => a.status === 'yangi').length,
    inProgress: staticApplications.filter(a => a.status === 'jarayonda').length,
    completed: staticApplications.filter(a => a.status === 'bajarilgan').length,
  };

  // Takliflar statistikasi
  const suggestionStats = {
    total: staticSuggestions.length,
    new: staticSuggestions.filter(s => s.status === 'yangi').length,
    inProgress: staticSuggestions.filter(s => s.status === 'jarayonda').length,
    completed: staticSuggestions.filter(s => s.status === 'bajarilgan').length,
  };

  // Arizalar uchun grafik ma'lumotlari
  const applicationChartData = {
    labels: ['Yangi', 'Jarayonda', 'Bajarilgan'],
    datasets: [
      {
        label: 'Arizalar holati',
        data: [applicationStats.new, applicationStats.inProgress, applicationStats.completed],
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
      },
    ],
  };

  // Hisobotlar uchun grafik ma'lumotlari
  const reportChartData = {
    labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel'],
    datasets: [
      {
        label: 'Hisobotlar soni',
        data: [4, 6, 8, 5],
        borderColor: '#3B82F6',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Statistika kartalari */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Jami arizalar */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-blue-600 text-lg font-semibold mb-2">Jami arizalar</h3>
            <p className="text-3xl font-bold text-blue-700">{applicationStats.total}</p>
            <div className="mt-2 text-sm text-blue-600">
              <span className="font-medium">Yangi: {applicationStats.new}</span>
            </div>
          </div>

          {/* Jarayondagi arizalar */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-yellow-600 text-lg font-semibold mb-2">Jarayonda</h3>
            <p className="text-3xl font-bold text-yellow-700">{applicationStats.inProgress}</p>
            <div className="mt-2 text-sm text-yellow-600">
              <span className="font-medium">{((applicationStats.inProgress / applicationStats.total) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Bajarilgan arizalar */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-green-600 text-lg font-semibold mb-2">Bajarilgan</h3>
            <p className="text-3xl font-bold text-green-700">{applicationStats.completed}</p>
            <div className="mt-2 text-sm text-green-600">
              <span className="font-medium">{((applicationStats.completed / applicationStats.total) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Takliflar */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-purple-600 text-lg font-semibold mb-2">Takliflar</h3>
            <p className="text-3xl font-bold text-purple-700">{suggestionStats.total}</p>
            <div className="mt-2 text-sm text-purple-600">
              <span className="font-medium">Yangi: {suggestionStats.new}</span>
            </div>
          </div>
        </div>

        {/* Grafiklar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Arizalar holati grafigi */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Arizalar holati</h3>
            <Bar 
              data={applicationChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>

          {/* Hisobotlar grafigi */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hisobotlar dinamikasi</h3>
            <Line
              data={reportChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
