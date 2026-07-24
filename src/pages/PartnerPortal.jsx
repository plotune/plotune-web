import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { streamApi } from '../services/api';

// ======================
// MOCK DATA - Replace with API calls in the future
// ======================

// Partner overall stats
const PARTNER_STATS = {
  activeStreams: 0,//12,
  totalClients: 0,//8,
  storageUsed: '0 M',//'45.2 GB',
  complianceScore: '-'//92
};

// Data Streams Management
const DATA_STREAMS = [
 // { id: 1, name: 'IoT-Sensor-Network', client: 'TechCorp Inc.', status: 'online', rate: '2.4 MB/s', uptime: '99.8%' },
 // { id: 2, name: 'Manufacturing-Line', client: 'FactoryPro Ltd.', status: 'online', rate: '5.7 MB/s', uptime: '99.5%' },
 // { id: 3, name: 'Environmental-Monitor', client: 'GreenTech Solutions', status: 'warning', rate: '1.2 MB/s', uptime: '85.3%' },
 // { id: 4, name: 'Healthcare-Devices', client: 'MediHealth Systems', status: 'offline', rate: '0 MB/s', uptime: '0%' },
 // { id: 5, name: 'Retail-Analytics', client: 'SmartRetail Group', status: 'online', rate: '3.1 MB/s', uptime: '99.9%' },
];

// Alerts & Notifications
const ALERTS = [
 // { id: 1, type: 'warning', message: 'High latency detected on IoT-Sensor-Network', time: '2 hours ago', priority: 'medium' },
 // { id: 2, type: 'error', message: 'Healthcare-Devices stream disconnected', time: '5 hours ago', priority: 'high' },
 // { id: 3, type: 'info', message: 'Storage threshold (80%) reached for GreenTech', time: '1 day ago', priority: 'low' },
];

// User Access Control
const USERS = [
 // { id: 1, name: 'John Smith', email: 'john@partner.com', role: 'Admin', lastActive: 'Today' },
 // { id: 2, name: 'Sarah Chen', email: 'sarah@partner.com', role: 'Analyst', lastActive: '2 days ago' },
 // { id: 3, name: 'Mike Rodriguez', email: 'mike@partner.com', role: 'Viewer', lastActive: '1 week ago' },
];

// Plugin/Extension Marketplace
const EXTENSIONS = [
 // { id: 1, name: 'AI Anomaly Detection', category: 'Analytics', description: 'Machine learning for real-time anomaly detection', version: 'v2.1.0' },
 // { id: 2, name: 'Custom Dashboard Builder', category: 'Visualization', description: 'Build custom dashboards for clients', version: 'v1.5.2' },
 // { id: 3, name: 'GDPR Compliance Tool', category: 'Security', description: 'Automated GDPR compliance reporting', version: 'v1.2.0' },
];

// Compute/Processing Jobs
const COMPUTE_JOBS = [
 // { id: 1, name: 'Data Aggregation', type: 'Batch', status: 'completed', duration: '2h 15m', cpu: '45%', createdAt: '2024-01-15T10:30:00' },
 // { id: 2, name: 'ML Inference', type: 'Real-time', status: 'running', duration: '5h 30m', cpu: '78%', createdAt: '2024-01-15T08:15:00' },
 // { id: 3, name: 'Data Cleansing', type: 'Batch', status: 'pending', duration: '-', cpu: '-', createdAt: '2024-01-15T14:00:00' },
 // { id: 4, name: 'Report Generation', type: 'Scheduled', status: 'failed', duration: '1h 10m', cpu: '32%', createdAt: '2024-01-14T22:00:00' },
];

// API Keys & Integrations
const API_KEYS = [
 // { id: 1, name: 'Production API', key: 'pk_live_***789', lastUsed: 'Today', permissions: ['read', 'write'], createdAt: '2024-01-01' },
 // { id: 2, name: 'Development API', key: 'pk_test_***123', lastUsed: '3 days ago', permissions: ['read'], createdAt: '2024-01-10' },
 // { id: 3, name: 'Webhook API', key: 'pk_wh_***456', lastUsed: '1 week ago', permissions: ['read', 'write', 'webhook'], createdAt: '2024-01-05' },
];

const INTEGRATIONS = [
 // { id: 1, name: 'Slack', description: 'Real-time notifications', status: 'connected', icon: 'slack', webhookUrl: 'https://hooks.slack.com/...' },
 // { id: 2, name: 'Salesforce', description: 'CRM data sync', status: 'available', icon: 'salesforce', webhookUrl: null },
 // { id: 3, name: 'Tableau', description: 'Business intelligence', status: 'available', icon: 'tableau', webhookUrl: null },
 // { id: 4, name: 'Zapier', description: 'Automation workflows', status: 'connected', icon: 'zapier', webhookUrl: 'https://hooks.zapier.com/...' },
];

// Storage & Backup Data
const STORAGE_CLIENTS = [
 // { name: 'TechCorp Inc.', usage: '12.5 GB', total: '50 GB', percentage: 25 },
 // { name: 'FactoryPro Ltd.', usage: '8.2 GB', total: '30 GB', percentage: 27 },
 // { name: 'GreenTech Solutions', usage: '15.7 GB', total: '20 GB', percentage: 78 },
 // { name: 'MediHealth Systems', usage: '4.8 GB', total: '25 GB', percentage: 19 },
];

const BACKUP_STATUS = [
 // { type: 'daily', status: 'completed', lastRun: '2 hours ago', nextRun: 'Today 22:00', size: '4.2 GB' },
 // { type: 'incremental', status: 'running', lastRun: '30 minutes ago', nextRun: 'Continuous', size: '1.5 GB' },
 // { type: 'monthly', status: 'scheduled', lastRun: '30 days ago', nextRun: 'In 5 days', size: '28.7 GB' },
];

// Security & Compliance Events
const SECURITY_EVENTS = [
 // { id: 1, type: 'info', message: 'Regular security scan completed', time: '3 hours ago', severity: 'low' },
 // { id: 2, type: 'warning', message: 'Unusual login attempt detected', time: '1 day ago', severity: 'medium' },
 // { id: 3, type: 'success', message: 'Encryption keys rotated successfully', time: '2 days ago', severity: 'low' },
 // { id: 4, type: 'error', message: 'Failed login attempts threshold exceeded', time: '5 days ago', severity: 'high' },
];

// Navigation Tabs Configuration
const NAV_TABS = [
 { id: 'overview', label: 'Overview', icon: 'dashboard', component: 'OverviewTab' },
 { id: 'streams', label: 'Data Streams', icon: 'stream', component: 'StreamsTab' },
 { id: 'analytics', label: 'Real-Time Analytics', icon: 'analytics', component: 'AnalyticsTab' },
 { id: 'storage', label: 'Storage & Backup', icon: 'storage', component: 'StorageTab' },
 { id: 'compute', label: 'Compute Jobs', icon: 'compute', component: 'ComputeTab' },
 { id: 'security', label: 'Security & Compliance', icon: 'security', component: 'SecurityTab' },
 { id: 'api', label: 'API & Integrations', icon: 'api', component: 'ApiTab' },
];

// Usage Analytics Data (for charts)
const USAGE_DATA = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  dataVolume: [12, 19, 8, 15, 24, 18], // in GB
  apiCalls: [5, 8, 4, 10, 15, 12], // in thousands
  activeStreams: [8, 10, 6, 12, 14, 12],
  computeHours: [45, 68, 32, 78, 92, 85]
};

// Quick Actions for Overview
const QUICK_ACTIONS = [
  { id: 'streams', label: 'Data Streams', icon: 'stream', color: 'primary', tab: 'streams' },
  { id: 'analytics', label: 'Analytics', icon: 'chart-line', color: 'green-500', tab: 'analytics' },
  { id: 'storage', label: 'Storage', icon: 'database', color: 'blue-500', tab: 'storage' },
  { id: 'compute', label: 'Compute', icon: 'cogs', color: 'purple-500', tab: 'compute' },
  { id: 'security', label: 'Security', icon: 'shield-alt', color: 'red-500', tab: 'security' },
];

// ======================
// MAIN COMPONENT
// ======================

const PartnerPortal = () => {
  const [partnerData, setPartnerData] = useState(PARTNER_STATS);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for dynamic data (for future API integration)
  const [dataStreams, setDataStreams] = useState(DATA_STREAMS);
  const [alerts, setAlerts] = useState(ALERTS);
  const [users, setUsers] = useState(USERS);
  const [extensions, setExtensions] = useState(EXTENSIONS);
  const [computeJobs, setComputeJobs] = useState(COMPUTE_JOBS);
  const [apiKeys, setApiKeys] = useState(API_KEYS);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  // Simulate loading data (replace with useEffect for API calls)
  useEffect(() => {
    // TODO: Replace with actual API calls
    // Example:
    // fetchPartnerData();
    // fetchStreams();
    // etc.
  }, []);

  const handleComingSoon = (feature) => {
    toast.info(`${feature} will be available in the Enterprise Cloud Tier`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  // Tab Components (could be extracted to separate files later)
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          partnerData={partnerData}
          alerts={alerts}
          users={users}
          extensions={extensions}
          usageData={USAGE_DATA}
          quickActions={QUICK_ACTIONS}
          setActiveTab={setActiveTab}
        />;
      case 'streams':
        return <StreamsTab 
          streams={dataStreams}
          handleComingSoon={handleComingSoon}
        />;
      case 'analytics':
        return <AnalyticsTab 
          handleComingSoon={handleComingSoon}
          usageData={USAGE_DATA}
        />;
      case 'storage':
        return <StorageTab 
          storageClients={STORAGE_CLIENTS}
          backupStatus={BACKUP_STATUS}
          handleComingSoon={handleComingSoon}
        />;
      case 'compute':
        return <ComputeTab 
          jobs={computeJobs}
          handleComingSoon={handleComingSoon}
        />;
      case 'security':
        return <SecurityTab 
          securityEvents={SECURITY_EVENTS}
          handleComingSoon={handleComingSoon}
        />;
      case 'api':
        return <ApiTab 
          apiKeys={apiKeys}
          integrations={integrations}
          handleComingSoon={handleComingSoon}
        />;
      default:
        return <OverviewTab 
          partnerData={partnerData}
          alerts={alerts}
          users={users}
          extensions={extensions}
          usageData={USAGE_DATA}
          quickActions={QUICK_ACTIONS}
          setActiveTab={setActiveTab}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">

          {/* Stats Overview */}
          <StatsOverview partnerData={partnerData} />
        </div>

        {/* Main Content with Tabs */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Service Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <SidebarNav 
              tabs={NAV_TABS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleComingSoon={handleComingSoon}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderTabContent()}
            
            {/* Footer Note */}
            <div className="mt-8 p-6 bg-dark-surface backdrop-blur-xl rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-light-text font-semibold mb-2">Plotune Cloud - Enterprise Partner Tier</h4>
                  <p className="text-gray-text text-sm">
                    Full access to all cloud services. Some advanced features require activation.
                    Contact <a href="mailto:contact@plotune.net" className="text-primary hover:underline">contact@plotune.net</a> for custom solutions.
                  </p>
                </div>
                <div className="text-3xl opacity-20">
                  <i className="fas fa-cloud"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================
// SUB-COMPONENTS
// ======================

const StatsOverview = ({ partnerData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <StatCard 
      label="Active Streams" 
      value={partnerData.activeStreams} 
      icon="stream" 
      color="primary" 
    />
    <StatCard 
      label="Total Clients" 
      value={partnerData.totalClients} 
      icon="users" 
      color="green-500" 
    />
    <StatCard 
      label="Storage Used" 
      value={partnerData.storageUsed} 
      icon="database" 
      color="blue-500" 
    />
    <StatCard
      label="Compliance Score"
      value={`${partnerData.complianceScore}%`} 
      icon="shield-alt" 
      color="green-500" 
    />
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-dark-card rounded-xl p-4 border border-white/5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-text text-sm">{label}</p>
        <p className="text-2xl font-bold text-light-text">{value}</p>
      </div>
      <div className={`text-${color}/60`}>
        <i className={`fas fa-${icon} text-2xl`}></i>
      </div>
    </div>
  </div>
);

const SidebarNav = ({ tabs, activeTab, setActiveTab, handleComingSoon }) => (
  <div className="sticky top-24">
    <div className="bg-dark-card rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-light-text">Cloud Services</h3>
      </div>
      <nav className="p-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary/20 text-primary' 
                : 'text-gray-text hover:bg-white/5 hover:text-light-text'
            }`}
          >
            <i className={`fas fa-${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-gray-text mb-2">Quick Actions</div>
        <button 
          onClick={() => handleComingSoon('Support Ticket')}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-text hover:text-light-text hover:bg-white/5 rounded-lg transition-colors"
        >
          <i className="fas fa-plus"></i>
          New Support Ticket
        </button>
        <button 
          onClick={() => handleComingSoon('Client Onboarding')}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-text hover:text-light-text hover:bg-white/5 rounded-lg transition-colors"
        >
          <i className="fas fa-user-plus"></i>
          Add New Client
        </button>
      </div>
    </div>
  </div>
);

// ======================
// TAB COMPONENTS
// ======================

const OverviewTab = ({ partnerData, alerts, users, extensions, usageData, quickActions, setActiveTab }) => (
  <>
    {/* Quick Stats */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <OverviewCard 
        title="Active Alerts" 
        icon="bell" 
        color="red-500"
        items={alerts.slice(0, 3)}
        type="alerts"
      />
      <OverviewCard 
        title="User Access" 
        icon="users-cog" 
        color="blue-500"
        items={users}
        type="users"
      />
      <OverviewCard 
        title="Extensions" 
        icon="puzzle-piece" 
        color="purple-500"
        items={extensions}
        type="extensions"
      />
    </div>

    {/* Usage Chart */}
    <div className="bg-dark-card rounded-xl border border-white/10 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-light-text font-semibold text-xl">Usage Analytics</h3>
          <p className="text-gray-text">Monthly consumption across all clients</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled
            className="px-3 py-1 bg-gray-600 text-gray-400 rounded text-sm cursor-not-allowed"
          >
            Last 6 Months
          </button>
        </div>
      </div>
      
      {/* Simple chart visualization */}
      <div className="h-64 flex items-end gap-2 pt-8">
        {usageData.dataVolume.map((height, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t"
              style={{height: `${height * 2}%`}}
            ></div>
            <div className="text-gray-text text-xs mt-2">{usageData.months[index]}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {quickActions.map(action => (
        <button 
          key={action.id}
          onClick={() => setActiveTab(action.tab)}
          className="bg-dark-surface backdrop-blur-xl rounded-lg p-4 border border-white/5 hover:border-primary/30 transition-colors group"
        >
          <div className={`text-${action.color} mb-2`}>
            <i className={`fas fa-${action.icon} text-2xl`}></i>
          </div>
          <div className="text-light-text text-sm font-medium">{action.label}</div>
        </button>
      ))}
    </div>
  </>
);

const OverviewCard = ({ title, icon, color, items, type }) => (
  <div className="bg-dark-card rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-light-text font-semibold">{title}</h3>
      <span className={`text-${color}`}>
        <i className={`fas fa-${icon}`}></i>
      </span>
    </div>
    <div className="space-y-3">
      {items.map(item => (
        <OverviewItem key={item.id} item={item} type={type} />
      ))}
    </div>
  </div>
);

const OverviewItem = ({ item, type }) => {
  if (type === 'alerts') {
    return (
      <div className="flex items-center gap-3 p-3 bg-black/20 rounded">
        <div className={`w-2 h-2 rounded-full ${
          item.priority === 'high' ? 'bg-red-500' :
          item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
        }`}></div>
        <div className="flex-1">
          <div className="text-light-text text-sm">{item.message}</div>
          <div className="text-gray-text text-xs">{item.time}</div>
        </div>
      </div>
    );
  }

  if (type === 'users') {
    return (
      <div className="flex items-center justify-between p-3 bg-black/20 rounded">
        <div>
          <div className="text-light-text text-sm">{item.name}</div>
          <div className="text-gray-text text-xs">{item.role}</div>
        </div>
        <span className="text-gray-text text-xs">{item.lastActive}</span>
      </div>
    );
  }

  if (type === 'extensions') {
    return (
      <div className="p-3 bg-black/20 rounded">
        <div className="flex items-center justify-between mb-2">
          <div className="text-light-text text-sm font-medium">{item.name}</div>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
            {item.category}
          </span>
        </div>
        <div className="text-gray-text text-xs mb-2">{item.description}</div>
        <div className="flex items-center justify-between">
          <span className="text-gray-text text-xs">{item.version}</span>
          <button 
            disabled
            className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs cursor-not-allowed"
          >
            Install
          </button>
        </div>
      </div>
    );
  }

  return null;
};

const StreamsTab = ({ streams, handleComingSoon }) => (
  <div className="bg-dark-card rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-light-text mb-2">Data Stream Management</h2>
        <p className="text-gray-text">Monitor and manage all active data streams from your clients' devices</p>
      </div>
      <button 
        onClick={() => handleComingSoon('Stream Management')}
        disabled
        className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
        title="Coming Soon in Cloud Tier"
      >
        <i className="fas fa-sliders-h"></i>
        Manage Streams
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-text font-medium">Stream Name</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Client</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Status</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Data Rate</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Uptime</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {streams.map(stream => (
            <tr key={stream.id} className="border-b border-white/5 hover:bg-white/2">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    stream.status === 'online' ? 'bg-green-500' :
                    stream.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-light-text">{stream.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-text">{stream.client}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stream.status === 'online' ? 'bg-green-500/20 text-green-400' :
                  stream.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {stream.status}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-text">{stream.rate}</td>
              <td className="py-3 px-4 text-gray-text">{stream.uptime}</td>
              <td className="py-3 px-4">
                <button 
                  onClick={() => handleComingSoon('Stream Control')}
                  disabled
                  className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-sm cursor-not-allowed"
                >
                  <i className="fas fa-pause mr-1"></i>
                  Control
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AnalyticsTab = ({ handleComingSoon, usageData }) => (
  <div className="bg-dark-card rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-light-text mb-2">Real-Time Analytics</h2>
        <p className="text-gray-text">Live data visualization and performance metrics across all streams</p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleComingSoon('Analytics Filters')}
          disabled
          className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
        >
          <i className="fas fa-filter"></i>
          Filter
        </button>
        <button 
          onClick={() => handleComingSoon('Export Analytics')}
          disabled
          className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
        >
          <i className="fas fa-download"></i>
          Export
        </button>
      </div>
    </div>

    {/* Live Chart Placeholder */}
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-4xl mb-4 opacity-20">
            <i className="fas fa-chart-line"></i>
          </div>
          <p className="text-gray-text text-lg">Live Analytics Dashboard</p>
          <p className="text-gray-text text-sm mt-2">Coming Soon in Cloud Tier</p>
        </div>
      </div>
      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6 h-96 opacity-30">
        {/* Chart grid lines */}
        <div className="h-full border-l border-b border-white/20 relative">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-full h-px bg-white/10 top-1/6" style={{top: `${i * 20}%`}}></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StorageTab = ({ storageClients, backupStatus, handleComingSoon }) => (
  <div className="bg-dark-card rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-light-text mb-2">Storage & Backup</h2>
        <p className="text-gray-text">Cloud storage, backup management, and data retention policies</p>
      </div>
      <button 
        onClick={() => handleComingSoon('Storage Settings')}
        disabled
        className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
      >
        <i className="fas fa-cog"></i>
        Manage Storage
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6">
        <h3 className="text-light-text font-semibold mb-4">Storage Usage</h3>
        <div className="space-y-4">
          {storageClients.map((client, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm text-gray-text mb-1">
                <span>{client.name}</span>
                <span>{client.usage}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{width: `${client.percentage}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6">
        <h3 className="text-light-text font-semibold mb-4">Backup Status</h3>
        <div className="space-y-3">
          {backupStatus.map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded">
              <div className="flex items-center gap-3">
                <i className={`fas fa-${
                  backup.status === 'completed' ? 'check-circle text-green-500' :
                  backup.status === 'running' ? 'sync-alt text-blue-500' :
                  'archive text-purple-500'
                }`}></i>
                <span className="text-light-text capitalize">{backup.type} Backup</span>
              </div>
              <span className="text-gray-text">{backup.lastRun}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ComputeTab = ({ jobs, handleComingSoon }) => (
  <div className="bg-dark-card rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-light-text mb-2">Compute & Processing Jobs</h2>
        <p className="text-gray-text">Run batch processing, data transformation, and ML inference jobs</p>
      </div>
      <button 
        onClick={() => handleComingSoon('New Job')}
        disabled
        className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
      >
        <i className="fas fa-plus"></i>
        New Job
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-text font-medium">Job Name</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Type</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Status</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Duration</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">CPU Usage</th>
            <th className="text-left py-3 px-4 text-gray-text font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} className="border-b border-white/5 hover:bg-white/2">
              <td className="py-3 px-4 text-light-text">{job.name}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                  {job.type}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  job.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                  job.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {job.status}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-text">{job.duration}</td>
              <td className="py-3 px-4 text-gray-text">{job.cpu}</td>
              <td className="py-3 px-4">
                <button 
                  onClick={() => handleComingSoon('Job Control')}
                  disabled
                  className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-sm cursor-not-allowed"
                >
                  <i className="fas fa-play mr-1"></i>
                  Control
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SecurityTab = ({ securityEvents, handleComingSoon }) => (
  <div className="bg-dark-card rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-light-text mb-2">Security & Compliance Monitoring</h2>
        <p className="text-gray-text">Enterprise-grade security monitoring and compliance reporting</p>
      </div>
      <button 
        onClick={() => handleComingSoon('Security Report')}
        disabled
        className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
      >
        <i className="fas fa-file-pdf"></i>
        Generate Report
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6 text-center">
        <div className="text-4xl text-green-500 mb-4">
          <i className="fas fa-shield-check"></i>
        </div>
        <h3 className="text-light-text font-semibold mb-2">GDPR Compliant</h3>
        <p className="text-gray-text text-sm">Fully compliant with EU data protection</p>
      </div>
      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6 text-center">
        <div className="text-4xl text-blue-500 mb-4">
          <i className="fas fa-lock"></i>
        </div>
        <h3 className="text-light-text font-semibold mb-2">End-to-End Encryption</h3>
        <p className="text-gray-text text-sm">AES-256 encryption for all data</p>
      </div>
      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6 text-center">
        <div className="text-4xl text-purple-500 mb-4">
          <i className="fas fa-audit"></i>
        </div>
        <h3 className="text-light-text font-semibold mb-2">Audit Logging</h3>
        <p className="text-gray-text text-sm">Complete audit trail for all activities</p>
      </div>
    </div>

    <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6">
      <h3 className="text-light-text font-semibold mb-4">Recent Security Events</h3>
      <div className="space-y-3">
        {securityEvents.map(event => (
          <div key={event.id} className="flex items-center justify-between p-3 bg-black/20 rounded">
            <div className="flex items-center gap-3">
              <i className={`fas fa-${
                event.type === 'info' ? 'info-circle text-blue-500' :
                event.type === 'warning' ? 'exclamation-triangle text-yellow-500' :
                'check-circle text-green-500'
              }`}></i>
              <span className="text-light-text">{event.message}</span>
            </div>
            <span className="text-gray-text text-sm">{event.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ApiTab = ({ apiKeys, integrations, handleComingSoon }) => (
  <div className="bg-dark-card rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-light-text mb-2">API & Integration Hub</h2>
        <p className="text-gray-text">Manage API keys, webhooks, and third-party integrations</p>
      </div>
      <button 
        onClick={() => handleComingSoon('New API Key')}
        disabled
        className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
      >
        <i className="fas fa-key"></i>
        Generate API Key
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6">
        <h3 className="text-light-text font-semibold mb-4">API Keys</h3>
        <div className="space-y-3">
          {apiKeys.map(api => (
            <div key={api.id} className="p-3 bg-black/20 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-light-text font-medium">{api.name}</span>
                <span className="text-gray-text text-sm">{api.lastUsed}</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-gray-text text-sm bg-black/40 px-2 py-1 rounded">
                  {api.key}
                </code>
                <button 
                  onClick={() => handleComingSoon('Copy API Key')}
                  disabled
                  className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-sm cursor-not-allowed"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-6">
        <h3 className="text-light-text font-semibold mb-4">Available Integrations</h3>
        <div className="space-y-3">
          {integrations.map(integration => (
            <div key={integration.id} className="flex items-center justify-between p-3 bg-black/20 rounded">
              <div>
                <div className="text-light-text font-medium">{integration.name}</div>
                <div className="text-gray-text text-sm">{integration.description}</div>
              </div>
              <button 
                onClick={() => handleComingSoon(`Connect ${integration.name}`)}
                disabled={integration.status === 'connected'}
                className={`px-3 py-1 rounded text-sm ${
                  integration.status === 'connected' 
                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                    : 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                }`}
              >
                {integration.status === 'connected' ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PartnerPortal;