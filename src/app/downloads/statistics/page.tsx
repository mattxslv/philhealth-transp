'use client';

import { useEffect, useState } from 'react';
import { Download, BarChart3, Calendar, HardDrive, ExternalLink } from 'lucide-react';
import { PageHeading } from '@/components/ui/page-heading';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface StatisticsFile {
  name: string;
  size_bytes: number;
  updated_time: string;
  download_url: string;
  year: number;
  displayName: string;
  sizeMB: string;
}

export default function StatisticsChartsPage() {
  const [statistics, setStatistics] = useState<StatisticsFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatistics() {
      try {
        const response = await fetch('/data/Statistics and Charts.json');
        const data = await response.json();
        
        // Parse and format the statistics files
        const formattedStats = data.files
          .filter((file: any) => file.name.endsWith('.pdf'))
          .map((file: any) => {
            const yearMatch = file.name.match(/SNC_(\d{4})\.pdf/);
            const year = yearMatch ? parseInt(yearMatch[1]) : 0;
            return {
              ...file,
              year,
              displayName: `Statistics and Charts ${year}`,
              sizeMB: (file.size_bytes / (1024 * 1024)).toFixed(2)
            };
          })
          .sort((a: StatisticsFile, b: StatisticsFile) => b.year - a.year);

        setStatistics(formattedStats);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStatistics();
  }, []);

  return (
    <>
      <Breadcrumbs />
      
      <PageHeading
        title="Statistics and Charts"
        description="Download PhilHealth Statistics and Charts (SNC) reports from 2007 to 2024. These reports contain detailed statistical analysis, membership data, claims information, and comprehensive charts."
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date Range</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2007 - 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <HardDrive className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(statistics.reduce((sum, r) => sum + r.size_bytes, 0) / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading statistics reports...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    File Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {statistics.map((stat) => (
                  <tr key={stat.year} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {stat.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {stat.displayName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        PhilHealth SNC Report
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {stat.sizeMB} MB
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(stat.updated_time).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={stat.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                        <a
                          href={stat.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-2">About Statistics and Charts (SNC)</p>
            <p className="text-blue-800 dark:text-blue-200">
              The Statistics and Charts (SNC) reports provide comprehensive statistical analysis of PhilHealth operations, 
              including membership enrollment, claims data, benefit utilization, healthcare facility accreditation, 
              and financial performance. These reports feature detailed charts, graphs, and tables for data visualization.
            </p>
          </div>
        </div>
      </div>

      {/* Data Attribution */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Data Source: PhilHealth Corporation Official Records</p>
        <p>Storage: Google Cloud Storage (philhealth_transparency)</p>
        <p className="mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </>
  );
}
