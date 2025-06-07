"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulated form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormStatus("sent");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-[#18181b] dark:via-black dark:to-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Địa chỉ</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tầng 20, Landmark 81<br />
                720A Điện Biên Phủ<br />
                TP. Hồ Chí Minh
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Điện thoại</h3>
              <p className="text-gray-600 dark:text-gray-300">+84 (28) 3822 9000</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4">✉️</div>
              <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">support@findash.vn</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tin nhắn
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus !== "idle"}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {formStatus === "idle" && "Gửi tin nhắn"}
                {formStatus === "sending" && "Đang gửi..."}
                {formStatus === "sent" && "✓ Đã gửi"}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
