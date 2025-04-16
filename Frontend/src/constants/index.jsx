import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export const fileTypeMap = {
  pdf: <PictureAsPdfIcon />,
  image: <ImageIcon />,
  audio: <AudiotrackIcon />,
  video: <SmartDisplayIcon />,
  other: <InsertDriveFileIcon />,
};

export const authCodeMessageMap = {
  email_already_registered: "This email is already registered!",
  server_error: "Server is unable to process this request!",
};
