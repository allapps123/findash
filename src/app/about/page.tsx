"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-[#18181b] dark:via-black dark:to-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Về FinDash
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Chúng tôi đơn giản hóa việc phân tích tài chính cho doanh nghiệp của bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Phân tích thông minh",
              description: "AI-powered phân tích báo cáo tài chính tự động",
              icon: "🤖",
            },
            {
              title: "Trực quan hóa dữ liệu",
              description: "Dashboard tương tác với biểu đồ chuyên nghiệp",
              icon: "📊",
            },
            {
              title: "Tiết kiệm thời gian",
              description: "Tự động hóa quy trình phân tích FP&A",
              icon: "⚡",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Bắt đầu ngay hôm nay</h2>
          <p className="text-lg mb-6">
            Trải nghiệm sức mạnh của phân tích tài chính tự động
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
            Dùng thử miễn phí
          </button>
        </motion.div>
      </main>
    </div>
  );
}
