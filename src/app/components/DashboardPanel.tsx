"use client";
import React from "react";
import { motion } from "framer-motion";

// Demo: chỉ render placeholder, sẽ tích hợp biểu đồ thực tế sau
export default function DashboardPanel() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-10"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6"
        >
          Dashboard tài chính (Demo)
        </motion.h2>

        <div className="space-y-8">
          {/* Chart placeholder with gradient background */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="h-64 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center p-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-4"
              >
                📊
              </motion.div>
              <p className="text-gray-500 dark:text-gray-400">
                Biểu đồ doanh thu, lợi nhuận & dòng tiền
              </p>
            </div>
          </motion.div>

          {/* Analysis controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {[
              { label: "Base", color: "blue" },
              { label: "Optimistic", color: "green" },
              { label: "Pessimistic", color: "red" },
            ].map((scenario) => (
              <motion.button
                key={scenario.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all
                  ${scenario.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                  ${scenario.color === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${scenario.color === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : ''}
                `}
              >
                {scenario.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Quick stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            {[
              { label: "Doanh thu", value: "32.5M", trend: "+12.3%" },
              { label: "Lợi nhuận", value: "8.2M", trend: "+5.7%" },
              { label: "Chi phí", value: "24.3M", trend: "-2.1%" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <span className={`text-sm font-medium ${
                  stat.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.trend}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
