import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import errorOutlined from "../../public/images/svgIcons/errorOutlined.svg";
import successOutlined from "../../public/images/svgIcons/successOutlined.svg";
import infoOutlined from "../../public/images/svgIcons/infoOutlined.svg";
import warningOutlined from "../../public/images/svgIcons/warningOutlined.svg";

type ToastType = "success" | "info" | "error" | "warning";

interface IconType {
  icon: string;
  color?: string;
}

export const displayIcon = (type: ToastType): IconType => {
  switch (type) {
    case "success":
      return {
        icon: successOutlined,
        color: "#4CAF50",
      };
    case "info":
      return {
        icon: infoOutlined,
        color: "#2196F3",
      };
    case "error":
      return {
        icon: errorOutlined,
        color: "#F44336",
      };
    case "warning":
      return {
        icon: warningOutlined,
        color: "#FF9800",
      };
    default:
      return {
        icon: errorOutlined,
        color: "#F44336",
      };
  }
};

interface CustomToastProps {
  type: ToastType;
  message: string;
  autoClose?: any;
}

const customToast = ({ type, message, autoClose }: CustomToastProps) => {
  const toastId = `${type}-${message}`;

  toast[type](
    <div
      style={{
        color: displayIcon(type).color,
        flexGrow: 1,
        fontSize: 14,
        padding: "8px 12px",
        marginLeft: "12px",
      }}
    >
      {message}
    </div>,

    {
      icon: (
        <Image
          src={displayIcon(type).icon}
          alt="Icon"
          style={{
            height: "43px",
            width: "auto",
          }}
        />
      ),
      toastId: toastId,
      autoClose: autoClose ? (autoClose === "false" ? false : autoClose) : 3000,
    }
  );
};

customToast.dismiss = toast.dismiss;

export default customToast;
