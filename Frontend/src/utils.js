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
  const date = new Date(isoString);
  return date.toISOString() === isoString;
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
