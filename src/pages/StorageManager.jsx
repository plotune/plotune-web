import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FaUpload, 
  FaDownload, 
  FaTrash, 
  FaFile, 
  FaFileImage, 
  FaFilePdf, 
  FaFileCode, 
  FaFileArchive,
  FaSpinner,
  FaCloudUploadAlt,
  FaChartPie,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
const StorageManager = () => {
  const { token, logout } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [totalUsage, setTotalUsage] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // File type icons mapping
  const fileTypeIcons = {
    'image/': <FaFileImage className="text-blue-400" />,
    'application/pdf': <FaFilePdf className="text-red-400" />,
    'application/zip': <FaFileArchive className="text-yellow-400" />,
    'application/x-rar-compressed': <FaFileArchive className="text-yellow-400" />,
    'text/': <FaFileCode className="text-green-400" />,
    'default': <FaFile className="text-gray-400" />
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/', 'jpeg': 'image/', 'png': 'image/', 'gif': 'image/', 'bmp': 'image/', 'webp': 'image/',
      'pdf': 'application/pdf',
      'zip': 'application/zip', 'rar': 'application/x-rar-compressed', '7z': 'application/x-7z-compressed',
      'txt': 'text/', 'js': 'text/', 'jsx': 'text/', 'ts': 'text/', 'tsx': 'text/', 'html': 'text/', 'css': 'text/', 'json': 'text/', 'xml': 'text/',
      'mp3': 'audio/', 'wav': 'audio/', 'mp4': 'video/', 'avi': 'video/', 'mov': 'video/'
    };

    const mimeType = mimeTypes[extension] || 'default';
    
    for (const [key, icon] of Object.entries(fileTypeIcons)) {
      if (mimeType.startsWith(key)) {
        return icon;
      }
    }
    
    return fileTypeIcons.default;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchData = async () => {
    setLoading(true);
    const cachebuster = uuidv4();
    try {
      // Fetch files list

      const filesResponse = await api.get(`/s3/user/files?cb=${cachebuster}`, {
        headers: { Authorization: token },
      });
      
      // Fetch total storage usage
      const usageResponse = await api.get(`/s3/user/total_usage?cb=${cachebuster}`, {
        headers: { Authorization: token },
      });
      
      setFiles(filesResponse.data.files || []);
      setTotalUsage(usageResponse.data.storage || 0);
    } catch (err) {
      if (err.response?.status === 401) logout();
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 50MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size exceeds 25MB limit');
      return;
    }
    
    setSelectedFile(file);
    handleUpload(file);
  };

const handleUpload = async (file) => {
  setUploading(true);
  setUploadProgress(0);
  
  try {
    const urlResponse = await api.get('/s3/user/upload_url', {
      params: { filename: file.name },
      headers: { Authorization: token },
    });
    
    if (!urlResponse.data.upload_url) {
      throw new Error('Failed to get upload URL');
    }
    
    // File'ı ArrayBuffer'a çevir ve headers objesini tamamen boş bırak
    const arrayBuffer = await file.arrayBuffer();
    
    const response = await fetch(urlResponse.data.upload_url, {
      method: 'PUT',
      body: arrayBuffer,
      headers: {} // Explicitly empty - tarayıcıya header ekletme
    });
    
    if (response.ok) {
      toast.success(`${file.name} uploaded successfully`);
      fetchData();
      setSelectedFile(null);
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }

  } catch (err) {
    toast.error(`Upload failed: ${err.message}`);
  } finally {
    setUploading(false);
    setUploadProgress(0);
  }
};
  const handleDownload = async (filePath) => {
    try {
      const response = await api.get('/s3/user/download_url', {
        params: { file: filePath },
        headers: { Authorization: token },
      });
      
      if (response.data.download_url) {
        // Direct download via browser
        window.open(response.data.download_url, '_blank');
      } else {
        toast.error('Failed to get download URL');
      }
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const handleDelete = async (filePath) => {
    if (!window.confirm(`Are you sure you want to delete ${filePath.split('/').pop()}?`)) {
      return;
    }
    
    try {
      await api.delete('/s3/user/file', {
        params: { file: filePath },
        headers: { Authorization: token },
      });
      
      toast.success('File deleted');
      fetchData(); // Refresh file list
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFiles = React.useMemo(() => {
    let sortableFiles = [...files];
    if (sortConfig.key) {
      sortableFiles.sort((a, b) => {
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'asc' 
            ? a.localeCompare(b)
            : b.localeCompare(a);
        }
        // Add more sort options if needed
        return 0;
      });
    }
    return sortableFiles;
  }, [files, sortConfig]);

  const filteredFiles = sortedFiles.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-light-text">Loading your files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Storage Stats */}
          <div className="lg:w-1/4">
            <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-light-text font-semibold text-lg">Storage Overview</h3>
                <FaChartPie className="text-primary text-xl" />
              </div>
              
              <div className="space-y-6">
                {/* Storage Usage */}
                <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-text">Used Space</span>
                    <span className="text-light-text font-semibold">{totalUsage.toFixed(2)} MB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(totalUsage / 1000 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-text text-sm mt-2">
                    {totalUsage < 500 ? 'Plenty of space available' : 'Consider cleaning up files'}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4">
                  <h4 className="text-light-text font-medium mb-3">Quick Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-text">Total Files</span>
                      <span className="text-light-text">{files.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-text">Filtered</span>
                      <span className="text-light-text">{filteredFiles.length}</span>
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                    uploading 
                      ? 'border-primary/50 bg-primary/10' 
                      : 'border-gray-600 hover:border-primary hover:bg-white/5 cursor-pointer'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                  
                  <FaCloudUploadAlt className={`mx-auto text-3xl mb-3 ${
                    uploading ? 'text-primary animate-pulse' : 'text-gray-400'
                  }`} />
                  
                  {uploading ? (
                    <div className="space-y-2">
                      <p className="text-light-text">Uploading {selectedFile?.name}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-text">{uploadProgress}%</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-light-text mb-2">Click or drag to upload</p>
                      <p className="text-gray-text text-sm">Max file size: 25MB</p>
                    </>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4">
                  <h4 className="text-light-text font-medium mb-2">Tips</h4>
                  <ul className="text-gray-text text-sm space-y-1">
                    <li>• Click on a file to download</li>
                    <li>• Drag & drop supported</li>
                    <li>• Files are private to your account</li>
                    <li>• Use search to find files quickly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - File List */}
          <div className="lg:w-3/4">
            <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-light-text">My Files</h2>
                  <p className="text-gray-text">Manage your uploaded files and documents</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </div>
                  </div>
                  
                  {/* Refresh Button */}
                  <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition flex items-center"
                  >
                    <FaSpinner className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* File List Table */}
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <FaFile className="text-5xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-light-text text-lg mb-2">No files found</h3>
                  <p className="text-gray-text">
                    {searchTerm ? 'Try a different search term' : 'Upload your first file to get started'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-white/10">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-dark-surface backdrop-blur-xl">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider cursor-pointer hover:text-light-text transition"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Name
                            {sortConfig.key === 'name' && (
                              sortConfig.direction === 'asc' ? 
                                <FaSortUp className="ml-1" /> : 
                                <FaSortDown className="ml-1" />
                            )}
                            {sortConfig.key !== 'name' && (
                              <FaSort className="ml-1 text-gray-500" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                          Path
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-text uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredFiles.map((filePath, index) => {
                        const fileName = filePath.split('/').pop();
                        const fileExtension = fileName.split('.').pop().toLowerCase();
                        
                        return (
                          <tr 
                            key={index} 
                            className="hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => handleDownload(filePath)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                                  {getFileIcon(fileName)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-light-text truncate max-w-xs">
                                    {fileName}
                                  </div>
                                  <div className="text-xs text-gray-text">
                                    {fileExtension.toUpperCase()} file
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-300">
                                {fileExtension}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-text truncate max-w-xs">
                              {filePath}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleDownload(filePath)}
                                  className="text-blue-400 hover:text-blue-300 transition p-2 hover:bg-white/10 rounded-lg"
                                  title="Download"
                                >
                                  <FaDownload />
                                </button>
                                <button
                                  onClick={() => handleDelete(filePath)}
                                  className="text-red-400 hover:text-red-300 transition p-2 hover:bg-white/10 rounded-lg"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination/Info */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-text">
                <div>
                  Showing <span className="text-light-text font-medium">{filteredFiles.length}</span> of{' '}
                  <span className="text-light-text font-medium">{files.length}</span> files
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 sm:mt-0 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* Upload Tips */}
              <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaUpload className="text-primary mt-1" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-light-text font-medium">Do you need more management ? </h4>
                    <p className="text-gray-text text-sm mt-1">
                      Consider using, {' '}
                      <a href="/extensions" className="text-primary hover:underline">Extensions</a> or{' '}
                      <a href="/extensions" className="text-primary hover:underline">Stream Nodes</a> for better performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageManager;