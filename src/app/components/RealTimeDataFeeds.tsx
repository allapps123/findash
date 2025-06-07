"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlobeAltIcon,
  BoltIcon,
  ChartBarIcon,
  ClockIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlayIcon,
  PauseIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  RadioIcon,
  WifiIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface DataFeed {
  id: string;
  name: string;
  type: 'market' | 'news' | 'economic' | 'custom';
  source: string;
  status: 'active' | 'paused' | 'error' | 'connecting';
  lastUpdate: Date;
  updateFrequency: string;
  dataPoints: number;
  subscribed: boolean;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  alerts: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

interface Alert {
  id: string;
  feedId: string;
  type: 'price' | 'volume' | 'news' | 'threshold';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
}

export default function RealTimeDataFeeds() {
  const [feeds, setFeeds] = useState<DataFeed[]>([
    {
      id: 'market-sp500',
      name: 'S&P 500 Index',
      type: 'market',
      source: 'Bloomberg API',
      status: 'active',
      lastUpdate: new Date(),
      updateFrequency: '1 second',
      dataPoints: 15847,
      subscribed: true,
      description: 'Real-time S&P 500 index data with tick-by-tick updates',
      icon: ChartBarIcon,
      color: 'text-green-600',
      alerts: 2
    },
    {
      id: 'forex-rates',
      name: 'Currency Exchange Rates',
      type: 'market',
      source: 'Reuters FX',
      status: 'active',
      lastUpdate: new Date(Date.now() - 15000),
      updateFrequency: '5 seconds',
      dataPoints: 8921,
      subscribed: true,
      description: 'Major currency pairs including USD, EUR, GBP, JPY',
      icon: CurrencyDollarIcon,
      color: 'text-blue-600',
      alerts: 0
    },
    {
      id: 'economic-indicators',
      name: 'Economic Indicators',
      type: 'economic',
      source: 'Federal Reserve API',
      status: 'active',
      lastUpdate: new Date(Date.now() - 3600000),
      updateFrequency: '1 hour',
      dataPoints: 423,
      subscribed: true,
      description: 'GDP, inflation, unemployment, and other key indicators',
      icon: BuildingOfficeIcon,
      color: 'text-purple-600',
      alerts: 1
    },
    {
      id: 'market-news',
      name: 'Financial News Feed',
      type: 'news',
      source: 'NewsAPI Financial',
      status: 'active',
      lastUpdate: new Date(Date.now() - 300000),
      updateFrequency: '30 seconds',
      dataPoints: 2156,
      subscribed: true,
      description: 'Breaking financial news and market-moving events',
      icon: NewspaperIcon,
      color: 'text-orange-600',
      alerts: 3
    },
    {
      id: 'crypto-data',
      name: 'Cryptocurrency Data',
      type: 'market',
      source: 'CoinGecko API',
      status: 'paused',
      lastUpdate: new Date(Date.now() - 1800000),
      updateFrequency: '10 seconds',
      dataPoints: 6734,
      subscribed: false,
      description: 'Top 100 cryptocurrencies with real-time pricing',
      icon: RadioIcon,
      color: 'text-yellow-600',
      alerts: 0
    },
    {
      id: 'company-earnings',
      name: 'Earnings Announcements',
      type: 'news',
      source: 'Alpha Vantage',
      status: 'error',
      lastUpdate: new Date(Date.now() - 7200000),
      updateFrequency: '1 minute',
      dataPoints: 189,
      subscribed: true,
      description: 'Real-time earnings announcements and guidance updates',
      icon: DocumentChartBarIcon,
      color: 'text-red-600',
      alerts: 1
    }
  ]);

  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: 'SPY', price: 428.65, change: 2.34, changePercent: 0.55, volume: 45000000, timestamp: new Date() },
    { symbol: 'QQQ', price: 367.89, change: -1.23, changePercent: -0.33, volume: 28000000, timestamp: new Date() },
    { symbol: 'EUR/USD', price: 1.0845, change: 0.0012, changePercent: 0.11, volume: 0, timestamp: new Date() },
    { symbol: 'BTC/USD', price: 43250.00, change: -850.00, changePercent: -1.93, volume: 2340000, timestamp: new Date() }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert-1',
      feedId: 'market-sp500',
      type: 'threshold',
      message: 'S&P 500 crossed above 4,280 resistance level',
      severity: 'high',
      timestamp: new Date(Date.now() - 600000),
      acknowledged: false
    },
    {
      id: 'alert-2',
      feedId: 'market-news',
      type: 'news',
      message: 'Federal Reserve announces emergency rate decision',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1200000),
      acknowledged: false
    },
    {
      id: 'alert-3',
      feedId: 'economic-indicators',
      type: 'threshold',
      message: 'Unemployment rate dropped below 3.5%',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1800000),
      acknowledged: true
    }
  ]);

  const [selectedFeed, setSelectedFeed] = useState<DataFeed | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update market data
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * 0.5,
        change: item.change + (Math.random() - 0.5) * 0.1,
        changePercent: item.changePercent + (Math.random() - 0.5) * 0.05,
        timestamp: new Date()
      })));

      // Update feed data points
      setFeeds(prev => prev.map(feed => 
        feed.status === 'active' 
          ? { 
              ...feed, 
              dataPoints: feed.dataPoints + Math.floor(Math.random() * 5),
              lastUpdate: new Date()
            }
          : feed
      ));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleFeedStatus = useCallback((feedId: string) => {
    setFeeds(prev => prev.map(feed => 
      feed.id === feedId 
        ? { 
            ...feed, 
            status: feed.status === 'active' ? 'paused' : 'active',
            lastUpdate: new Date()
          }
        : feed
    ));
  }, []);

  const toggleSubscription = useCallback((feedId: string) => {
    setFeeds(prev => prev.map(feed => 
      feed.id === feedId 
        ? { ...feed, subscribed: !feed.subscribed }
        : feed
    ));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  }, []);

  const getStatusIcon = (status: DataFeed['status']) => {
    switch (status) {
      case 'active':
        return <SignalIcon className="h-5 w-5 text-green-500" />;
      case 'paused':
        return <PauseIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'connecting':
        return <WifiIcon className="h-5 w-5 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: DataFeed['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'connecting': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Feeds',
            value: feeds.filter(f => f.status === 'active').length,
            icon: RadioIcon,
            color: 'text-green-600'
          },
          {
            label: 'Data Points/Min',
            value: feeds.filter(f => f.status === 'active').reduce((sum, f) => sum + Math.floor(f.dataPoints / 60), 0),
            icon: BoltIcon,
            color: 'text-blue-600'
          },
          {
            label: 'Unread Alerts',
            value: unacknowledgedAlerts.length,
            icon: BellIcon,
            color: 'text-red-600'
          },
          {
            label: 'Latency',
            value: '< 50ms',
            icon: ClockIcon,
            color: 'text-purple-600'
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

      {/* Live Market Data */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Live Market Data
            </h3>
          </div>
          <motion.button
            onClick={() => setShowAlerts(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium shadow-md"
          >
            <BellIcon className="h-5 w-5" />
            Alerts
            {unacknowledgedAlerts.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-bold px-2 py-1 rounded-full">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((item) => (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.symbol}
                </h4>
                <div className={`flex items-center gap-1 ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${item.price.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                </div>
                {item.volume > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Vol: {(item.volume / 1000000).toFixed(1)}M
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  {formatLastUpdate(item.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Feeds Management */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Data Feed Sources
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {feeds.map((feed) => (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              onClick={() => setSelectedFeed(feed)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                    <feed.icon className={`h-6 w-6 ${feed.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {feed.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feed.source}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {feed.alerts > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                      <BellIcon className="h-3 w-3" />
                      {feed.alerts}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(feed.status)}`}>
                    {getStatusIcon(feed.status)}
                    <span className="ml-2 capitalize">{feed.status}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {feed.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Updates: {feed.updateFrequency}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last: {formatLastUpdate(feed.lastUpdate)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Points: {feed.dataPoints.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subscribe</span>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubscription(feed.id);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        feed.subscribed ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <motion.span
                        animate={{ x: feed.subscribed ? 20 : 4 }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                      />
                    </motion.button>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeedStatus(feed.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-colors ${
                      feed.status === 'active' 
                        ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    {feed.status === 'active' ? (
                      <PauseIcon className="h-5 w-5" />
                    ) : (
                      <PlayIcon className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alerts Dialog */}
      <AnimatePresence>
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAlerts(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Real-Time Alerts
                </h3>
                <motion.button
                  onClick={() => setShowAlerts(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <BellIcon className="h-12 w-12 mx-auto mb-3" />
                    <p>No alerts</p>
                    <p className="text-sm">Real-time alerts will appear here</p>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const feed = feeds.find(f => f.id === alert.feedId);
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border ${
                          alert.acknowledged 
                            ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {feed?.name || 'Unknown Feed'}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatLastUpdate(alert.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {alert.message}
                              </p>
                            </div>
                          </div>

                          {!alert.acknowledged && (
                            <motion.button
                              onClick={() => acknowledgeAlert(alert.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                            >
                              Acknowledge
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Detail Dialog */}
      <AnimatePresence>
        {selectedFeed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFeed(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <selectedFeed.icon className={`h-8 w-8 ${selectedFeed.color}`} />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedFeed.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedFeed.source}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setSelectedFeed(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedFeed.description}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedFeed.status)}`}>
                      {getStatusIcon(selectedFeed.status)}
                      <span className="ml-2 capitalize">{selectedFeed.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Update Frequency</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedFeed.updateFrequency}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Points</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedFeed.dataPoints.toLocaleString()}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Last Update</h4>
                    <p className="text-gray-600 dark:text-gray-400">{formatLastUpdate(selectedFeed.lastUpdate)}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    onClick={() => toggleFeedStatus(selectedFeed.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                      selectedFeed.status === 'active'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {selectedFeed.status === 'active' ? 'Pause Feed' : 'Resume Feed'}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => toggleSubscription(selectedFeed.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                      selectedFeed.subscribed
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {selectedFeed.subscribed ? 'Unsubscribe' : 'Subscribe'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 