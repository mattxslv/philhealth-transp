'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText, Search, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeading } from '@/components/ui/page-heading';
import { formatNumber } from '@/lib/utils';

interface ProcurementFile {
  name: string;
  size_bytes: number;
  updated_time: string;
  download_url: string;
}

interface ProcurementData {
  bucket: string;
  prefix: string;
  file_count: number;
  files: ProcurementFile[];
}

export default function ProcurementPage() {
  const [data, setData] = useState<ProcurementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/data/procurement_backend-2024.json');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load procurement data');
        console.error('Error loading procurement data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatFileName = (name: string) => {
    return name.replace(/^.*\//, '').replace('.pdf', '');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const openPdfModal = (url: string, title: string) => {
    setSelectedPdf(url);
    setSelectedTitle(title);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
    setSelectedTitle('');
  };

  const downloadPdf = async (url: string, filename: string) => {
    try {
      // Fetch the file as a blob
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename + '.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredFiles = data?.files.filter(file =>
    formatFileName(file.name).toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#009a3d] border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading procurement documents...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-red-600">{error || 'No data available'}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span>Home</span>
          <span>/</span>
          <span>Documents</span>
          <span>/</span>
          <span className="text-foreground font-medium">Procurement</span>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search procurement documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009a3d] dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    File Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFiles.map((file, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[#009a3d]/10 dark:bg-[#009a3d]/30 rounded-lg">
                          <FileText className="h-5 w-5 text-[#009a3d] dark:text-[#00c94d]" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatFileName(file.name)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Annual Procurement Plan Amendment
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        2024
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatFileSize(file.size_bytes)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => downloadPdf(file.download_url, formatFileName(file.name))}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#009a3d] hover:bg-[#007a30] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <button
                          onClick={() => openPdfModal(file.download_url, formatFileName(file.name))}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-[#009a3d]/5 dark:bg-[#009a3d]/20 border border-[#009a3d]/20 dark:border-[#009a3d]/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-[#009a3d] dark:text-[#00c94d] mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-900 dark:text-gray-100">
              <p className="font-semibold mb-2">About Procurement Documents</p>
              <p className="text-gray-800 dark:text-gray-200">
                These documents contain amendments to PhilHealth&apos;s Annual Procurement Plan for 2024. 
                All procurement activities are conducted in accordance with the Government Procurement Policy Board (GPPB) 
                rules and regulations, ensuring transparency and competitive bidding processes.
              </p>
            </div>
          </div>
        </div>

        {/* Data Attribution */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Data Source: PhilHealth Corporation Procurement Department</p>
          <p>Storage: Google Cloud Storage (philhealth_transparency)</p>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTitle}</h3>
              <button
                onClick={closePdfModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close PDF viewer"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf)}&embedded=true`}
                className="w-full h-full"
                title={selectedTitle}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

