"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudIcon,
  UserGroupIcon,
  CogIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  LinkIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  KeyIcon,
  RocketLaunchIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/outline";
import APIIntegrations from "./APIIntegrations";
import TeamCollaboration from "./TeamCollaboration";
import RealTimeDataFeeds from "./RealTimeDataFeeds";
import WhiteLabelSolution from "./WhiteLabelSolution";

interface Phase4IntegrationProps {
  currentUser?: {
    id: string;
    name: string;
    role: 'admin' | 'analyst' | 'viewer';
    organization: string;
  };
}

export default function Phase4Integration({ currentUser }: Phase4IntegrationProps) {
  const [activeFeature, setActiveFeature] = useState<'overview' | 'api' | 'collaboration' | 'realtime' | 'whitelabel'>('overview');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');
  const [teamMembers, setTeamMembers] = useState(0);
  const [dataConnections, setDataConnections] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(prev => {
        const statuses: typeof prev[] = ['connected', 'disconnected', 'syncing'];
        return statuses[Math.floor(Math.random() * statuses.length)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 'api' as const,
      title: 'API Integrations',
      description: 'Connect to QuickBooks, Xero, and other accounting platforms for real-time data sync',
      icon: CloudIcon,
      color: 'from-blue-500 to-blue-600',
      benefits: [
        'QuickBooks Online integration',
        'Xero accounting sync',
        'Real-time data updates',
        'Automated reconciliation'
      ],
      status: 'available'
    },
    {
      id: 'collaboration' as const,
      title: 'Team Collaboration',
      description: 'Shared workspaces, collaborative analysis, and team communication tools',
      icon: UserGroupIcon,
      color: 'from-green-500 to-green-600',
      benefits: [
        'Shared workspaces',
        'Real-time collaboration',
        'Comment & annotation system',
        'Role-based permissions'
      ],
      status: 'available'
    },
    {
      id: 'realtime' as const,
      title: 'Real-Time Data Feeds',
      description: 'Live financial data feeds and automatic updates from connected systems',
      icon: GlobeAltIcon,
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'Live data streaming',
        'Automatic updates',
        'Real-time alerts',
        'Market data integration'
      ],
      status: 'beta'
    },
    {
      id: 'whitelabel' as const,
      title: 'White-Label Solution',
      description: 'Customizable branding and deployment for consulting firms and enterprises',
      icon: BuildingStorefrontIcon,
      color: 'from-orange-500 to-orange-600',
      benefits: [
        'Custom branding',
        'Client portals',
        'Multi-tenant architecture',
        'Custom domains'
      ],
      status: 'enterprise'
    }
  ];

  const stats = [
    {
      label: 'Connected Systems',
      value: dataConnections,
      icon: LinkIcon,
      color: 'text-blue-600',
      status: connectionStatus
    },
    {
      label: 'Team Members',
      value: teamMembers || (currentUser ? 1 : 0),
      icon: UserGroupIcon,
      color: 'text-green-600'
    },
    {
      label: 'Real-Time Updates',
      value: connectionStatus === 'connected' ? 'Active' : 'Inactive',
      icon: BellIcon,
      color: connectionStatus === 'connected' ? 'text-green-600' : 'text-gray-400'
    },
    {
      label: 'Enterprise Features',
      value: currentUser?.role === 'admin' ? 'Enabled' : 'Available',
      icon: KeyIcon,
      color: 'text-purple-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Available
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Beta
          </span>
        );
      case 'enterprise':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <KeyIcon className="h-3 w-3 mr-1" />
            Enterprise
          </span>
        );
      default:
        return null;
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'syncing': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-orange-500 p-4 rounded-2xl">
              <RocketLaunchIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Phase 4: Enterprise Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Integration & Collaboration Suite
            </p>
          </div>
        </motion.div>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Transform FinDash into an enterprise-grade platform with API integrations, 
          team collaboration, real-time data feeds, and white-label solutions.
        </p>
      </div>

      {/* User Welcome */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome back, {currentUser.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUser.role} at {currentUser.organization} • Enterprise features enabled
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700`}>
                <stat.icon className={`h-6 w-6 ${stat.status ? getConnectionStatusColor(stat.status) : stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.status ? getConnectionStatusColor(stat.status) : 'text-gray-900 dark:text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature Selection */}
      {activeFeature === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Choose Your Enterprise Feature
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300"
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  {getStatusBadge(feature.status)}
                </div>
                
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h4>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all duration-200">
                  <span>Get Started</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enterprise Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-8 border border-orange-200/50 dark:border-orange-700/50"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  Enterprise-Grade Platform
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Scale your financial analysis across your organization
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Seamless Integration',
                  description: 'Connect to 20+ accounting platforms and data sources',
                  icon: CloudIcon
                },
                {
                  title: 'Team Collaboration',
                  description: 'Real-time collaboration with role-based access control',
                  icon: ChatBubbleLeftRightIcon
                },
                {
                  title: 'Custom Branding',
                  description: 'White-label solution with your company branding',
                  icon: DocumentDuplicateIcon
                }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <benefit.icon className="h-8 w-8 text-orange-600 mb-4" />
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Feature Content */}
      <AnimatePresence mode="wait">
        {activeFeature === 'api' && (
          <motion.div
            key="api"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                API Integrations
              </h3>
              <motion.button
                onClick={() => setActiveFeature('overview')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ← Back to Overview
              </motion.button>
            </div>
            <APIIntegrations onConnectionUpdate={(count) => setDataConnections(count)} />
          </motion.div>
        )}

        {activeFeature === 'collaboration' && (
          <motion.div
            key="collaboration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Team Collaboration
              </h3>
              <motion.button
                onClick={() => setActiveFeature('overview')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ← Back to Overview
              </motion.button>
            </div>
            <TeamCollaboration 
              currentUser={currentUser} 
              onTeamUpdate={(count) => setTeamMembers(count)} 
            />
          </motion.div>
        )}

        {activeFeature === 'realtime' && (
          <motion.div
            key="realtime"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Real-Time Data Feeds
              </h3>
              <motion.button
                onClick={() => setActiveFeature('overview')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ← Back to Overview
              </motion.button>
            </div>
            <RealTimeDataFeeds />
          </motion.div>
        )}

        {activeFeature === 'whitelabel' && (
          <motion.div
            key="whitelabel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                White-Label Solution
              </h3>
              <motion.button
                onClick={() => setActiveFeature('overview')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ← Back to Overview
              </motion.button>
            </div>
            <WhiteLabelSolution currentUser={currentUser} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 