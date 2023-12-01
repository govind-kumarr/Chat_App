import React, { useState } from "react";
import {
  MdSimCardDownload,
  MdDownloadDone,
  MdOutlineCancel,
} from "react-icons/md";
import { axios } from "./../config/axiosConfig.js";

const FileCard = ({ fileData, currentFile, setNewFile }) => {
  const [downloaded, setDownloaded] = useState(false);

  const downloadFile = async (fileName) => {
    const response = await axios({
      url: `/api/file/getFile/${fileName}`,
      method: "GET",
      responseType: "blob",
    });
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClick = async () => {
    try {
      await downloadFile(fileData.fileName);
      setDownloaded(true);
    } catch (error) {
      setDownloaded(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <p>{fileData.fileName}</p>
      <button className="cursor-pointer">
        {currentFile ? (
          <MdOutlineCancel
            className="text-2xl"
            onClick={() => setNewFile(null)}
          />
        ) : downloaded ? (
          <MdDownloadDone className="text-2xl" />
        ) : (
          <MdSimCardDownload className="text-2xl" onClick={handleClick} />
        )}
      </button>
    </div>
  );
};

export default FileCard;
