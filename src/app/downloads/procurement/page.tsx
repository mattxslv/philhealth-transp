'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface ProcurementFile {
  name: string;
  size_bytes: number;
  updated_time: string;
  download_url: string;
  fileName: string;
  sizeMB: string;
  year: string;
  category: string;
}

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
};

// Helper to extract filename from path
const getFileName = (path: string): string => {
  const parts = path.split("/");
  return parts[parts.length - 1];
};

// Helper to extract year and category from path
const extractMetadata = (path: string) => {
  const parts = path.split("/");
  // Path format: Procurement/Head Office/Amendment/2024/filename.pdf
  const year = parts.length >= 4 ? parts[3] : "Unknown";
  const category = parts.length >= 3 ? parts[2] : "General";
  return { year, category };
};

export default function ProcurementPage() {
  const [files, setFiles] = useState<ProcurementFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  useEffect(() => {
    async function loadProcurementFiles() {
      try {
        const response = await fetch('/data/procurement_backend-2024.json');
        const data = await response.json();
        
        // Parse and format the files
        const formattedFiles = data.files
          .filter((file: any) => file.name.endsWith('.pdf'))
          .map((file: any) => {
            const fileName = getFileName(file.name);
            const { year, category } = extractMetadata(file.name);
            return {
              ...file,
              fileName,
              sizeMB: formatFileSize(file.size_bytes),
              year,
              category
            };
          })
          .sort((a: ProcurementFile, b: ProcurementFile) => {
            // Sort by year (descending) then by filename
            if (a.year !== b.year) {
              return b.year.localeCompare(a.year);
            }
            return a.fileName.localeCompare(b.fileName);
          });

        setFiles(formattedFiles);
      } catch (error) {
        console.error('Error loading procurement files:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProcurementFiles();
  }, []);

  const openPdfModal = (url: string, title: string) => {
    setSelectedPdf(url);
    setSelectedTitle(title);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
    setSelectedTitle('');
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>Home</span>
        <span>/</span>
        <span>Downloads</span>
        <span>/</span>
        <span className="text-foreground font-medium">Procurement Documents</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{files.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Files Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#009a3d] border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading procurement documents...</p>
        </div>
      ) : (
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
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  files.map((file: ProcurementFile, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.fileName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {file.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {file.sizeMB}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={file.download_url}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#009a3d] hover:bg-[#007a30] text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                          <button
                            onClick={() => openPdfModal(file.download_url, file.fileName)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-2">About Procurement Documents</p>
            <p className="text-blue-800 dark:text-blue-200">
              All procurement documents are official files from PhilHealth&apos;s Procurement Department. 
              These include Annual Procurement Plans (APP), amendments, bid invitations, and contract awards. 
              All documents are maintained in compliance with transparency and accountability requirements 
              as mandated by the Government Procurement Reform Act.
            </p>
          </div>
        </div>
      </div>

      {/* Data Attribution */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Data Source: PhilHealth Procurement Department</p>
        <p>Storage: Google Cloud Storage (philhealth_transparency)</p>
        <p className="mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                src={selectedPdf}
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
