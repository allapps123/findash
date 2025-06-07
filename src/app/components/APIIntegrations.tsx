"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
  KeyIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalculatorIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

interface Connection {
  id: string;
  name: string;
  type: 'quickbooks' | 'xero' | 'sage' | 'freshbooks' | 'zoho' | 'wave' | 'custom';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync?: Date;
  dataPoints: number;
  autoSync: boolean;
  description: string;
  logo: string;
}

interface APIIntegrationsProps {
  onConnectionUpdate?: (connectionCount: number) => void;
}

const AVAILABLE_INTEGRATIONS = [
  {
    type: 'quickbooks' as const,
    name: 'QuickBooks Online',
    description: 'Connect to QuickBooks for real-time financial data sync',
    logo: '📊',
    features: ['Real-time sync', 'Auto reconciliation', 'Multi-company', 'Advanced permissions'],
    setupTime: '5 minutes',
    popularity: 95
  },
  {
    type: 'xero' as const,
    name: 'Xero',
    description: 'Integrate with Xero accounting platform',
    logo: '📈',
    features: ['Live bank feeds', 'Invoice sync', 'Expense tracking', 'Multi-currency'],
    setupTime: '3 minutes',
    popularity: 88
  },
  {
    type: 'sage' as const,
    name: 'Sage Business Cloud',
    description: 'Connect to Sage for comprehensive financial data',
    logo: '🏢',
    features: ['Enterprise features', 'Custom workflows', 'Advanced reporting', 'API flexibility'],
    setupTime: '10 minutes',
    popularity: 72
  },
  {
    type: 'freshbooks' as const,
    name: 'FreshBooks',
    description: 'Small business accounting integration',
    logo: '📋',
    features: ['Time tracking', 'Project management', 'Client invoicing', 'Expense management'],
    setupTime: '4 minutes',
    popularity: 68
  },
  {
    type: 'zoho' as const,
    name: 'Zoho Books',
    description: 'Complete business suite integration',
    logo: '📚',
    features: ['CRM integration', 'Inventory management', 'GST compliance', 'Multi-language'],
    setupTime: '6 minutes',
    popularity: 65
  },
  {
    type: 'wave' as const,
    name: 'Wave Accounting',
    description: 'Free accounting software integration',
    logo: '🌊',
    features: ['Free platform', 'Receipt scanning', 'Payment processing', 'Simple setup'],
    setupTime: '2 minutes',
    popularity: 58
  }
];

export default function APIIntegrations({ onConnectionUpdate }: APIIntegrationsProps) {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 'qb-demo',
      name: 'Demo QuickBooks Company',
      type: 'quickbooks',
      status: 'connected',
      lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      dataPoints: 2847,
      autoSync: true,
      description: 'Main company QuickBooks integration',
      logo: '📊'
    }
  ]);
  
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, boolean>>({});

  // Notify parent of connection count changes
  useEffect(() => {
    const connectedCount = connections.filter(c => c.status === 'connected').length;
    onConnectionUpdate?.(connectedCount);
  }, [connections, onConnectionUpdate]);

  // Simulate real-time sync status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnections(prev => prev.map(conn => {
        if (conn.status === 'connected' && Math.random() < 0.1) {
          return {
            ...conn,
            lastSync: new Date(),
            dataPoints: conn.dataPoints + Math.floor(Math.random() * 10)
          };
        }
        return conn;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = useCallback(async (integrationType: string) => {
    setIsConnecting(true);
    setSelectedIntegration(integrationType);

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const integration = AVAILABLE_INTEGRATIONS.find(i => i.type === integrationType);
    if (integration) {
      const newConnection: Connection = {
        id: `${integrationType}-${Date.now()}`,
        name: integration.name,
        type: integration.type,
        status: 'connected',
        lastSync: new Date(),
        dataPoints: Math.floor(Math.random() * 1000) + 100,
        autoSync: true,
        description: integration.description,
        logo: integration.logo
      };

      setConnections(prev => [...prev, newConnection]);
    }

    setIsConnecting(false);
    setShowSetupDialog(false);
    setSelectedIntegration(null);
  }, []);

  const handleDisconnect = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  }, []);

  const handleSync = useCallback(async (connectionId: string) => {
    setSyncStatus(prev => ({ ...prev, [connectionId]: true }));
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, lastSync: new Date(), status: 'connected' as const }
        : conn
    ));
    
    setSyncStatus(prev => ({ ...prev, [connectionId]: false }));
  }, []);

  const toggleAutoSync = useCallback((connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, autoSync: !conn.autoSync }
        : conn
    ));
  }, []);

  const getStatusIcon = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'syncing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'disconnected':
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Connection['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'syncing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'disconnected': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Connections',
            value: connections.filter(c => c.status === 'connected').length,
            icon: LinkIcon,
            color: 'text-blue-600'
          },
          {
            label: 'Data Points Synced',
            value: connections.reduce((sum, c) => sum + (c.status === 'connected' ? c.dataPoints : 0), 0).toLocaleString(),
            icon: ChartBarIcon,
            color: 'text-green-600'
          },
          {
            label: 'Auto-Sync Enabled',
            value: connections.filter(c => c.autoSync).length,
            icon: ArrowPathIcon,
            color: 'text-purple-600'
          },
          {
            label: 'Last Update',
            value: connections.length > 0 ? formatLastSync(Math.max(...connections.filter(c => c.lastSync).map(c => c.lastSync!.getTime()))) : 'Never',
            icon: ClockIcon,
            color: 'text-orange-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connected Integrations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Connected Integrations
          </h3>
          <motion.button
            onClick={() => setShowSetupDialog(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Add Integration
          </motion.button>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <CloudIcon className="h-12 w-12 mx-auto mb-3" />
            <p>No integrations connected yet</p>
            <p className="text-sm">Add your first integration to start syncing data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{connection.logo}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {connection.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {connection.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(connection.status)}`}>
                          {getStatusIcon(connection.status)}
                          <span className="ml-2 capitalize">{connection.status}</span>
                        </span>
                        {connection.lastSync && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Last sync: {formatLastSync(connection.lastSync)}
                          </span>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {connection.dataPoints.toLocaleString()} data points
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Auto-sync</span>
                      <motion.button
                        onClick={() => toggleAutoSync(connection.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          connection.autoSync ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <motion.span
                          animate={{ x: connection.autoSync ? 20 : 4 }}
                          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                        />
                      </motion.button>
                    </div>
                    
                    <motion.button
                      onClick={() => handleSync(connection.id)}
                      disabled={syncStatus[connection.id]}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg disabled:opacity-50"
                    >
                      <ArrowPathIcon className={`h-5 w-5 ${syncStatus[connection.id] ? 'animate-spin' : ''}`} />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleDisconnect(connection.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Setup Dialog */}
      <AnimatePresence>
        {showSetupDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSetupDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add New Integration
                </h3>
                <motion.button
                  onClick={() => setShowSetupDialog(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ✕
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {AVAILABLE_INTEGRATIONS.map((integration) => (
                  <motion.div
                    key={integration.type}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    onClick={() => handleConnect(integration.type)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{integration.logo}</div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {integration.setupTime} setup
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-sm font-medium text-green-600">
                            {integration.popularity}%
                          </span>
                          <span className="text-xs text-gray-400">popular</span>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {integration.description}
                    </p>

                    <div className="space-y-2">
                      {integration.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {isConnecting && selectedIntegration === integration.type && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Connecting...
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Security Notice */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Bank-Level Security
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      All connections use OAuth 2.0 authentication and 256-bit encryption. 
                      We never store your login credentials - only read-only access tokens.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 