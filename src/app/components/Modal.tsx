"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {

  // 🔒 ล็อกการ scroll เมื่อเปิด Modal
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden"); // หยุดเลื่อน
    } else {
      document.body.classList.remove("overflow-hidden"); // เปิดกลับ
    }

    // cleanup เมื่อ component ถูก unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* พื้นหลังมืด */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* กล่อง Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-11/12 md:w-1/2 p-6 relative">
              {/* ปุ่มปิด */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <X />
              </button>

              {/* หัวข้อ */}
              {title && (
                <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
                  {title}
                </h2>
              )}

              {/* เนื้อหา */}
              <div>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
