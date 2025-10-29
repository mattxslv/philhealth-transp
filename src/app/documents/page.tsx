"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExportButton } from "@/components/ui/export-button";
import { FileText, Folder, Download, ChevronRight, Home, Calendar, FileIcon } from "lucide-react";

interface FileItem {
  name: string;
  size_bytes: number;
  updated_time: string;
  download_url: string;
  type: "file";
}

interface FolderItem {
  name: string;
  type: "folder";
  path: string;
}

interface DocumentData {
  bucket: string;
  prefix?: string;
  requested_prefix?: string;
  file_count: number;
  folder_count?: number;
  files?: FileItem[];
  subfolders?: FolderItem[];
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

export default function DocumentsPage() {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    axios.get("/data/procurement_backend-2024.json")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading documents:", err);
        setLoading(false);
      });
  }, []);

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath);
    // In production, this would fetch data from the API endpoint
    // axios.get(`/api/documents?prefix=${folderPath}`)
  };

  const handleBreadcrumbClick = (index: number) => {
    const pathParts = currentPath.split("/");
    const newPath = pathParts.slice(0, index + 1).join("/");
    setCurrentPath(newPath);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading documents...</div>
        </div>
      </DashboardLayout>
    );
  }

  const pathParts = data?.requested_prefix?.split("/").filter(Boolean) || [];
  const displayFiles = data?.files || [];
  const displayFolders = data?.subfolders || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PhilHealth Documents</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Browse and download official PhilHealth documents and files
            </p>
          </div>
          <ExportButton
            data={displayFiles}
            filename="philhealth-documents"
          />
        </div>

        {/* Breadcrumb Navigation */}
        {pathParts.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border">
            <Home className="w-4 h-4" />
            <button
              onClick={() => setCurrentPath("")}
              className="hover:text-[#009a3d] transition-colors"
            >
              Documents
            </button>
            {pathParts.map((part, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className="hover:text-[#009a3d] transition-colors"
                >
                  {part}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Folders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayFolders.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayFiles.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Download className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(displayFiles.reduce((sum, file) => sum + file.size_bytes, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Folders List */}
        {displayFolders.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-600" />
                Folders
              </h2>
            </div>
            <div className="divide-y">
              {displayFolders.map((folder, index) => (
                <button
                  key={index}
                  onClick={() => handleFolderClick(folder.path)}
                  className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-left"
                >
                  <Folder className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white font-medium">{folder.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Files List */}
        {displayFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Files ({displayFiles.length})
              </h2>
            </div>
            <div className="divide-y">
              {displayFiles.map((file, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-900 dark:text-white font-medium truncate">
                          {getFileName(file.name)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {formatFileSize(file.size_bytes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(file.updated_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={file.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#009a3d] text-white rounded-lg hover:bg-[#007a30] transition-colors flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {displayFiles.length === 0 && displayFolders.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Documents Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This folder is currently empty or no documents are available.
            </p>
          </div>
        )}

        {/* About Documents */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">About PhilHealth Documents</h3>
          <div className="prose prose-sm text-gray-600 dark:text-gray-400 space-y-3">
            <p>
              This portal provides access to official PhilHealth documents including procurement files, annual reports, 
              policies, circulars, and other important documents. All files are maintained in compliance with 
              transparency and accountability requirements.
            </p>
            <p>
              Documents are organized by category and year for easy browsing. You can download any file by clicking 
              the download button next to the file name.
            </p>
          </div>
        </div>

        {/* Data Source */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500 dark:border-emerald-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              <strong>Data Source:</strong> PhilHealth Document Repository | 
              <strong> Storage:</strong> Google Cloud Storage (philhealth_transparency)
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
