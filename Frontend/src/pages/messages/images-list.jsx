import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Stack, Typography } from "@mui/joy";

const ImagesList = ({ images }) => {
  return (
    <Stack direction={"column"} alignItems={"center"}>
      {images?.length > 0 ? (
        <ImageList sx={{ maxWidth: 500 }} cols={1} rowHeight={163}>
          {images.map((image) => {
            const {
              fileDetails: { url, originalFileName },
            } = image;
            return (
              <ImageListItem key={image?.id}>
                <img
                  srcSet={`${url}`}
                  src={`${url}`}
                  alt={originalFileName}
                  loading="lazy"
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      ) : (
        <Typography sx={{ textAlign: "center" }}>No Images</Typography>
      )}
    </Stack>
  );
};

export default ImagesList;
