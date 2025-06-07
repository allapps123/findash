"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BuildingStorefrontIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CogIcon,
  EyeIcon,
  DocumentTextIcon,
  PhotoIcon,
  SwatchIcon,
  LinkIcon,
  ShieldCheckIcon,
  ServerIcon,
  CloudIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
  KeyIcon,
  BoltIcon,
  StarIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface BrandingConfig {
  logoUrl: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  favicon: string;
  loginBackground: string;
  emailSignature: string;
}

interface ClientPortal {
  id: string;
  clientName: string;
  domain: string;
  customDomain?: string;
  status: 'active' | 'inactive' | 'pending' | 'setup';
  users: number;
  lastAccess: Date;
  features: string[];
  branding: BrandingConfig;
  tier: 'basic' | 'professional' | 'enterprise';
}

interface WhiteLabelSolutionProps {
  currentUser?: {
    id: string;
    name: string;
    role: 'admin' | 'analyst' | 'viewer';
    organization: string;
  };
}

export default function WhiteLabelSolution({ currentUser }: WhiteLabelSolutionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'portals' | 'branding' | 'domains' | 'analytics'>('overview');
  const [clientPortals, setClientPortals] = useState<ClientPortal[]>([
    {
      id: 'portal-acme',
      clientName: 'ACME Capital',
      domain: 'acme-capital.findash.app',
      customDomain: 'analytics.acmecapital.com',
      status: 'active',
      users: 12,
      lastAccess: new Date(Date.now() - 3600000),
      features: ['Advanced Analytics', 'Portfolio Management', 'API Integration', 'Custom Reports'],
      branding: {
        logoUrl: '/logos/acme-capital.png',
        companyName: 'ACME Capital Analytics',
        primaryColor: '#1E40AF',
        secondaryColor: '#3B82F6',
        accentColor: '#EF4444',
        fontFamily: 'Inter',
        favicon: '/favicons/acme.ico',
        loginBackground: '/backgrounds/acme-bg.jpg',
        emailSignature: 'ACME Capital - Investment Intelligence'
      },
      tier: 'enterprise'
    },
    {
      id: 'portal-vertex',
      clientName: 'Vertex Financial',
      domain: 'vertex-financial.findash.app',
      status: 'active',
      users: 8,
      lastAccess: new Date(Date.now() - 7200000),
      features: ['Portfolio Management', 'Basic Analytics', 'Report Generation'],
      branding: {
        logoUrl: '/logos/vertex.png',
        companyName: 'Vertex Financial Dashboard',
        primaryColor: '#059669',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
        fontFamily: 'Roboto',
        favicon: '/favicons/vertex.ico',
        loginBackground: '/backgrounds/vertex-bg.jpg',
        emailSignature: 'Vertex Financial - Smart Investing'
      },
      tier: 'professional'
    },
    {
      id: 'portal-summit',
      clientName: 'Summit Investments',
      domain: 'summit-investments.findash.app',
      status: 'setup',
      users: 0,
      lastAccess: new Date(Date.now() - 86400000),
      features: ['Basic Analytics', 'Report Generation'],
      branding: {
        logoUrl: '/logos/summit.png',
        companyName: 'Summit Investment Analytics',
        primaryColor: '#7C3AED',
        secondaryColor: '#8B5CF6',
        accentColor: '#EC4899',
        fontFamily: 'Poppins',
        favicon: '/favicons/summit.ico',
        loginBackground: '/backgrounds/summit-bg.jpg',
        emailSignature: 'Summit Investments - Reaching New Heights'
      },
      tier: 'basic'
    }
  ]);

  const [selectedPortal, setSelectedPortal] = useState<ClientPortal | null>(null);
  const [showCreatePortal, setShowCreatePortal] = useState(false);
  const [showBrandingEditor, setShowBrandingEditor] = useState(false);
  const [editingBranding, setEditingBranding] = useState<BrandingConfig | null>(null);

  const handleCreatePortal = useCallback((clientName: string, tier: ClientPortal['tier']) => {
    const newPortal: ClientPortal = {
      id: `portal-${Date.now()}`,
      clientName,
      domain: `${clientName.toLowerCase().replace(/\s+/g, '-')}.findash.app`,
      status: 'setup',
      users: 0,
      lastAccess: new Date(),
      features: tier === 'basic' ? ['Basic Analytics', 'Report Generation'] :
                tier === 'professional' ? ['Portfolio Management', 'Basic Analytics', 'Report Generation'] :
                ['Advanced Analytics', 'Portfolio Management', 'API Integration', 'Custom Reports'],
      branding: {
        logoUrl: '/logos/default.png',
        companyName: `${clientName} Analytics`,
        primaryColor: '#3B82F6',
        secondaryColor: '#60A5FA',
        accentColor: '#EF4444',
        fontFamily: 'Inter',
        favicon: '/favicons/default.ico',
        loginBackground: '/backgrounds/default-bg.jpg',
        emailSignature: `${clientName} - Financial Analytics`
      },
      tier
    };

    setClientPortals(prev => [...prev, newPortal]);
    setShowCreatePortal(false);
  }, []);

  const handleUpdateBranding = useCallback((portalId: string, branding: BrandingConfig) => {
    setClientPortals(prev => prev.map(portal => 
      portal.id === portalId 
        ? { ...portal, branding }
        : portal
    ));
    setShowBrandingEditor(false);
    setEditingBranding(null);
  }, []);

  const handleTogglePortalStatus = useCallback((portalId: string) => {
    setClientPortals(prev => prev.map(portal => 
      portal.id === portalId 
        ? { 
            ...portal, 
            status: portal.status === 'active' ? 'inactive' : 'active'
          }
        : portal
    ));
  }, []);

  const getStatusColor = (status: ClientPortal['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'setup': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTierColor = (tier: ClientPortal['tier']) => {
    switch (tier) {
      case 'basic': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'professional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  const formatLastAccess = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const tabConfig = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: BuildingStorefrontIcon,
      count: 0
    },
    {
      id: 'portals' as const,
      label: 'Client Portals',
      icon: GlobeAltIcon,
      count: clientPortals.length
    },
    {
      id: 'branding' as const,
      label: 'Branding',
      icon: PaintBrushIcon,
      count: 0
    },
    {
      id: 'domains' as const,
      label: 'Custom Domains',
      icon: LinkIcon,
      count: clientPortals.filter(p => p.customDomain).length
    },
    {
      id: 'analytics' as const,
      label: 'Usage Analytics',
      icon: ServerIcon,
      count: 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Portals',
            value: clientPortals.filter(p => p.status === 'active').length,
            icon: GlobeAltIcon,
            color: 'text-green-600'
          },
          {
            label: 'Total Users',
            value: clientPortals.reduce((sum, p) => sum + p.users, 0),
            icon: UserGroupIcon,
            color: 'text-blue-600'
          },
          {
            label: 'Custom Domains',
            value: clientPortals.filter(p => p.customDomain).length,
            icon: LinkIcon,
            color: 'text-purple-600'
          },
          {
            label: 'Enterprise Clients',
            value: clientPortals.filter(p => p.tier === 'enterprise').length,
            icon: StarIcon,
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

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4">
        {tabConfig.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  White-Label Solution Overview
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Transform FinDash into your own branded financial analysis platform. 
                  Create custom client portals with your branding, domain, and tailored features.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Custom Branding',
                    description: 'Complete visual customization with your logo, colors, and fonts',
                    features: ['Logo integration', 'Color schemes', 'Custom fonts', 'Login screens'],
                    icon: PaintBrushIcon,
                    color: 'from-pink-500 to-purple-500'
                  },
                  {
                    title: 'Client Portals',
                    description: 'Dedicated dashboards for each client with tailored features',
                    features: ['Multi-tenant architecture', 'User management', 'Feature control', 'Access permissions'],
                    icon: UserGroupIcon,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    title: 'Custom Domains',
                    description: 'Host on your own domain with SSL certificates included',
                    features: ['Custom domains', 'SSL certificates', 'DNS management', 'CDN integration'],
                    icon: GlobeAltIcon,
                    color: 'from-green-500 to-teal-500'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg mb-6`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h4>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {feature.description}
                    </p>

                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200/50 dark:border-purple-700/50">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Launch Your Branded Platform?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    Get started with your first client portal in minutes. Complete branding customization 
                    and enterprise-grade infrastructure included.
                  </p>
                  <motion.button
                    onClick={() => setShowCreatePortal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg"
                  >
                    Create Your First Portal
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Client Portals
                </h3>
                <motion.button
                  onClick={() => setShowCreatePortal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-md"
                >
                  <PlusIcon className="h-5 w-5" />
                  New Portal
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {clientPortals.map((portal) => (
                  <motion.div
                    key={portal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: portal.branding.primaryColor }}
                        >
                          {portal.clientName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {portal.clientName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {portal.domain}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTierColor(portal.tier)}`}>
                          {portal.tier}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(portal.status)}`}>
                          <span className="capitalize">{portal.status}</span>
                        </span>
                      </div>
                    </div>

                    {portal.customDomain && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Custom Domain: {portal.customDomain}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {portal.users}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Active Users
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatLastAccess(portal.lastAccess)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Last Access
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</h5>
                      <div className="flex flex-wrap gap-2">
                        {portal.features.map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setSelectedPortal(portal)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4 inline mr-1" />
                        View
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          setEditingBranding(portal.branding);
                          setShowBrandingEditor(true);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                      >
                        <PaintBrushIcon className="h-4 w-4 inline mr-1" />
                        Brand
                      </motion.button>

                      <motion.button
                        onClick={() => handleTogglePortalStatus(portal.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          portal.status === 'active'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {portal.status === 'active' ? 'Pause' : 'Activate'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Branding Management
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Brand Guidelines
                    </h4>

                    <div className="space-y-4">
                      {[
                        {
                          title: 'Logo Requirements',
                          items: ['SVG or PNG format', 'Transparent background', 'Min 200x60px', 'Max 2MB file size']
                        },
                        {
                          title: 'Color Specifications',
                          items: ['Primary brand color', 'Secondary accent color', 'Success/error states', 'Accessibility compliant']
                        },
                        {
                          title: 'Typography',
                          items: ['Web-safe fonts only', 'Google Fonts supported', 'Maximum 2 font families', 'Fallback fonts included']
                        }
                      ].map((section, index) => (
                        <div key={section.title} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">{section.title}</h5>
                          <ul className="space-y-1">
                            {section.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Brand Previews
                    </h4>

                    <div className="space-y-4">
                      {clientPortals.slice(0, 3).map((portal) => (
                        <div key={portal.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: portal.branding.primaryColor }}
                            >
                              {portal.clientName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {portal.branding.companyName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {portal.clientName}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mb-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: portal.branding.primaryColor }}
                              title="Primary Color"
                            ></div>
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: portal.branding.secondaryColor }}
                              title="Secondary Color"
                            ></div>
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: portal.branding.accentColor }}
                              title="Accent Color"
                            ></div>
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Font: {portal.branding.fontFamily}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Custom Domain Management
              </h3>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  {clientPortals.map((portal) => (
                    <div key={portal.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {portal.clientName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Default: {portal.domain}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          portal.customDomain ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {portal.customDomain ? 'Custom Domain Active' : 'Default Domain'}
                        </span>
                      </div>

                      {portal.customDomain ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium text-green-800 dark:text-green-200">
                                {portal.customDomain}
                              </div>
                              <div className="text-sm text-green-600 dark:text-green-300">
                                SSL Certificate: Valid • DNS: Configured
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="ml-auto p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg"
                            >
                              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                            </motion.button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">SSL Status</div>
                              <div className="text-green-600">Valid until 2025-12-31</div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">DNS Records</div>
                              <div className="text-green-600">All configured</div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300">CDN Status</div>
                              <div className="text-green-600">Active</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Ready to add a custom domain?
                              </div>
                              <div className="text-sm text-blue-600 dark:text-blue-300">
                                Point your domain to our servers and we'll handle the rest
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                              Add Domain
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Usage Analytics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Sessions', value: '1,247', change: '+12%', color: 'text-blue-600' },
                  { label: 'Active Users', value: '324', change: '+8%', color: 'text-green-600' },
                  { label: 'Page Views', value: '8,921', change: '+15%', color: 'text-purple-600' },
                  { label: 'Avg Session', value: '4m 32s', change: '+3%', color: 'text-orange-600' }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {metric.label}
                    </div>
                    <div className={`text-sm font-medium ${metric.color}`}>
                      {metric.change} from last month
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Portal Performance
                </h4>

                <div className="space-y-4">
                  {clientPortals.map((portal) => (
                    <div key={portal.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: portal.branding.primaryColor }}
                        >
                          {portal.clientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {portal.clientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {portal.users} users • {formatLastAccess(portal.lastAccess)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {Math.floor(Math.random() * 500) + 100}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {Math.floor(Math.random() * 60) + 20}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {Math.floor(Math.random() * 10) + 2}m
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Avg Time</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Create Portal Dialog */}
      <AnimatePresence>
        {showCreatePortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreatePortal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create New Portal
              </h3>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleCreatePortal(
                  formData.get('clientName') as string,
                  formData.get('tier') as ClientPortal['tier']
                );
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., ACME Capital"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plan Tier
                    </label>
                    <select
                      name="tier"
                      defaultValue="professional"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="basic">Basic</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => setShowCreatePortal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                  >
                    Create Portal
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 