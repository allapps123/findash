"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  BeakerIcon,
  CpuChipIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import PortfolioManager from "./PortfolioManager";
import AdvancedAnalytics from "./AdvancedAnalytics";

interface Company {
  id: string;
  name: string;
  data: Record<string, number[]>;
  metrics?: any;
  lastUpdated: Date;
  status: 'active' | 'analyzing' | 'error';
}

interface Phase3IntegrationProps {
  initialCompany?: {
    name: string;
    data: Record<string, number[]>;
  };
}

export default function Phase3Integration({ initialCompany }: Phase3IntegrationProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeFeature, setActiveFeature] = useState<'portfolio' | 'analytics' | 'overview'>('overview');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with any existing company data
  useEffect(() => {
    if (initialCompany && !isInitialized) {
      const company: Company = {
        id: 'initial-company',
        name: initialCompany.name,
        data: initialCompany.data,
        lastUpdated: new Date(),
        status: 'active'
      };
      setCompanies([company]);
      setSelectedCompany(company);
      setIsInitialized(true);
    }
  }, [initialCompany, isInitialized]);

  const handleCompanyAdd = (company: Omit<Company, 'id' | 'lastUpdated' | 'status'>) => {
    const newCompany: Company = {
      ...company,
      id: `company-${Date.now()}`,
      lastUpdated: new Date(),
      status: 'active'
    };
    setCompanies(prev => [...prev, newCompany]);
    setSelectedCompany(newCompany);
  };

  const handleCompanyUpdate = (companyId: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(company => 
      company.id === companyId 
        ? { ...company, ...updates, lastUpdated: new Date() }
        : company
    ));
    
    if (selectedCompany?.id === companyId) {
      setSelectedCompany(prev => prev ? { ...prev, ...updates, lastUpdated: new Date() } : null);
    }
  };

  const handleCompanyRemove = (companyId: string) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId));
    if (selectedCompany?.id === companyId) {
      setSelectedCompany(companies.length > 1 ? companies[0] : null);
    }
  };

  const features = [
    {
      id: 'portfolio' as const,
      title: 'Portfolio Management',
      description: 'Manage multiple companies, compare performance, and benchmark analysis',
      icon: BuildingOfficeIcon,
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'Multi-company analysis',
        'Peer benchmarking',
        'Risk assessment',
        'Performance ranking'
      ]
    },
    {
      id: 'analytics' as const,
      title: 'Advanced Analytics',
      description: 'Monte Carlo simulations, sensitivity analysis, and scenario modeling',
      icon: BeakerIcon,
      color: 'from-orange-500 to-orange-600',
      benefits: [
        'Monte Carlo simulations',
        'Sensitivity analysis',
        'Scenario planning',
        'AI-powered insights'
      ]
    }
  ];

  const stats = [
    {
      label: 'Companies Analyzed',
      value: companies.length,
      icon: BuildingOfficeIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Active Analyses',
      value: companies.filter(c => c.status === 'active').length,
      icon: ChartBarIcon,
      color: 'text-green-600'
    },
    {
      label: 'Data Quality Score',
      value: `${Math.round(companies.length > 0 ? 
        companies.reduce((sum, c) => sum + (Object.keys(c.data).length * 10), 0) / companies.length : 0)}%`,
      icon: CheckCircleIcon,
      color: 'text-purple-600'
    }
  ];

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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-orange-500 p-4 rounded-2xl">
              <CpuChipIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Phase 3: Advanced Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Portfolio Management & Advanced Analytics
            </p>
          </div>
        </motion.div>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Scale your financial analysis with multi-company portfolio management, 
          sophisticated modeling capabilities, and AI-powered insights.
        </p>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
      </motion.div>

      {/* Feature Selection */}
      {activeFeature === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Choose Your Advanced Analytics Feature
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300"
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
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

          {/* Quick Start Section */}
          {companies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    Ready to Analyze
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    You have {companies.length} company loaded and ready for advanced analysis
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setActiveFeature('portfolio')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                >
                  <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Portfolio Analysis</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Manage and compare companies</div>
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveFeature('analytics')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors"
                >
                  <BeakerIcon className="h-6 w-6 text-orange-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Advanced Modeling</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Run simulations and scenarios</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Feature Content */}
      <AnimatePresence mode="wait">
        {activeFeature === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Portfolio Management
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
            <PortfolioManager />
          </motion.div>
        )}

        {activeFeature === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Advanced Analytics
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
            <AdvancedAnalytics 
              financialData={selectedCompany?.data}
              companyName={selectedCompany?.name || "Select Company"}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 