export function openSidebar() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1");
  }
}

export function closeSidebar() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleSidebar() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--SideNavigation-slideIn");
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export function openMessagesPane() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--MessagesPane-slideIn", "1");
  }
}

export function closeMessagesPane() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--MessagesPane-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleMessagesPane() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--MessagesPane-slideIn");
    if (slideIn) {
      closeMessagesPane();
    } else {
      openMessagesPane();
    }
  }
}

export const getGroupMessages = (messages = []) => {
  let messageMap = {};
  messages.map((m) => {
    const { createdAt } = m;
    const formattedDate = getFormattedDate(createdAt, dateFormats.date);
    if (!messageMap[formattedDate]) {
      messageMap[formattedDate] = [];
    }
    messageMap[formattedDate].push(m);
  });
  return messageMap;
};

export const isValidIsoString = (isoString) => {
  if (isoString) {
    const date = new Date(isoString);
    return date?.toISOString() === isoString;
  }
};

const dateFormats = {
  time: "HH:MM A",
  date: "dd/mm/yyy",
};

export const getFormattedDate = (isoString = "", format) => {
  let formattedStr = "Invalid Date";
  if (isValidIsoString(isoString)) {
    const date = new Date(isoString);
    formattedStr = date.toLocaleString();
    if (format === dateFormats.time) {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12;
      formattedStr = `${formattedHours || 12}:${minutes} ${ampm}`;
    }
    if (format === dateFormats.date) {
      formattedStr = date.toLocaleDateString();
    }
  }
  return formattedStr;
};

const oneKb = 1024;
const oneMb = 1024 * oneKb;

const oneSec = 1000;
const oneMinute = 60 * oneSec;
const oneHour = 60 * oneMinute;
const oneDay = 60 * oneHour;

export const sizeConversions = (size = 0) => {
  let parsedSize = "";
  if (typeof size === "number") {
    if (size >= oneMb) {
      parsedSize = `${(size / oneMb).toFixed(2)}Mb`;
    } else if (size >= oneKb) {
      parsedSize = `${(size / oneKb).toFixed(2)}Kb`;
    } else `${size}b`;
  }
  return parsedSize;
};

export const timeConversions = (time = 0) => {
  let parsedTime = "";

  const currentTime = Date.now();

  if (time > currentTime) return parsedTime;

  const diff = currentTime - time;

  if (typeof time === "number" && diff < oneDay) {
    if (diff >= oneHour) {
      const hours = Math.floor(diff / oneHour);
      parsedTime = `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    } else if (diff >= oneMinute) {
      const minutes = Math.floor(diff / oneMinute);
      parsedTime = `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
    } else {
      const seconds = Math.floor(diff / oneSec);
      parsedTime = `${seconds} ${seconds > 1 ? "seconds" : "second"}  ago`;
    }
  }

  return parsedTime;
};

export const checkFileType = (mimeType = "") => {
  if (mimeType.includes("image")) return "image";
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("video")) return "video";
  if (mimeType.includes("audio")) return "audio";
  return "other";
};

export const handleDownload = async (
  { originalFileName, url },
  cb = () => null
) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = originalFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
    cb();
  } catch (error) {
    console.error("Download failed:", error);
  }
};
