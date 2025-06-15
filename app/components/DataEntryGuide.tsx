'use client';

import { dataEntryGuide } from '../data/usersData';

export default function DataEntryGuide() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">{dataEntryGuide.title}</h3>
          <p className="text-blue-700 mb-4">{dataEntryGuide.description}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cấu trúc cột */}
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">Cấu trúc các cột:</h4>
              <div className="space-y-2">
                {dataEntryGuide.columns.map((col) => (
                  <div key={col.column} className="bg-white p-3 rounded border flex items-center space-x-3">
                    <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded text-sm">
                      {col.column}
                    </span>
                    <div>
                      <span className="font-medium text-gray-800">{col.field}</span>
                      <p className="text-sm text-gray-600">{col.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ví dụ nhập dữ liệu */}
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">Ví dụ nhập dữ liệu (hàng {dataEntryGuide.example.row}):</h4>
              <div className="bg-white p-4 rounded border">
                <div className="grid grid-cols-1 gap-2">
                  {dataEntryGuide.example.data.map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-blue-600 w-8">
                        {String.fromCharCode(65 + index)}2:
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded font-mono text-sm flex-1">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Lưu ý quan trọng:</strong>
                </p>
                <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                  <li>• Bắt đầu nhập dữ liệu từ hàng 2 (A2, B2, C2...)</li>
                  <li>• Hàng 1 là header (A1, B1, C1...)</li>
                  <li>• Tuân thủ đúng định dạng dữ liệu cho mỗi cột</li>
                  <li>• Status chỉ nhận: active, inactive, pending</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
