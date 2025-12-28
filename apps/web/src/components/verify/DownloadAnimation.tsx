import React, { useEffect, useState } from "react";
import { FilePdfOutlined, FileExcelOutlined, CheckCircleOutlined } from "@ant-design/icons";

interface DownloadAnimationProps {
  fileType: "pdf" | "excel";
  isVisible: boolean;
}

const DownloadAnimation: React.FC<DownloadAnimationProps> = ({
  fileType,
  isVisible,
}) => {
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      setShowSuccess(false);
      setIsAnimating(true);
      
      // Simulate download progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowSuccess(true);
            setTimeout(() => {
              setIsAnimating(false);
            }, 1500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setShowSuccess(false);
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible || !isAnimating) return null;

  const FileIcon = fileType === "pdf" ? FilePdfOutlined : FileExcelOutlined;
  const fileName = fileType === "pdf" ? "verification-report.pdf" : "financial-analysis.xlsx";
  const fileColor = fileType === "pdf" ? "#ff4d4f" : "#52c41a";

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.1) rotate(5deg);
          }
          50% {
            transform: scale(1.05) rotate(-5deg);
          }
          75% {
            transform: scale(1.1) rotate(3deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .download-animation-container {
          animation: slideUp 0.3s ease-out;
        }
        .file-icon-animate {
          animation: ${showSuccess ? "pulse 0.6s ease-in-out" : "bounce 1s ease-in-out infinite"};
        }
        .progress-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      
      <div
        className="download-animation-container"
        style={{
          position: "fixed",
          bottom: 100,
          right: 40,
          zIndex: 10000,
          background: "#fff",
          borderRadius: "12px",
          padding: "20px 24px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          minWidth: "280px",
          border: "1px solid #e8e8e8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="file-icon-animate">
            {showSuccess ? (
              <CheckCircleOutlined
                style={{
                  fontSize: "32px",
                  color: "#52c41a",
                }}
              />
            ) : (
              <FileIcon
                style={{
                  fontSize: "32px",
                  color: fileColor,
                }}
              />
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#262626",
                marginBottom: "4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {showSuccess ? "Download Complete!" : "Downloading..."}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#8c8c8c",
                marginBottom: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
            </div>
            
            {!showSuccess && (
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  background: "#f0f0f0",
                  borderRadius: "2px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${fileColor}, ${fileColor}dd)`,
                    borderRadius: "2px",
                    transition: "width 0.3s ease-out",
                  }}
                />
                <div
                  className="progress-shimmer"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadAnimation;

