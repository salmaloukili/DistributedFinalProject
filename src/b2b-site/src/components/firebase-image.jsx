// ImageComponent.js
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from 'src/utils/firebase';
import PropTypes from 'prop-types';

const ImageComponent = ({ filePath, style }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storageRef = ref(storage, filePath);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [filePath]);

  return (
    <>{imageUrl ? <img src={imageUrl} alt={filePath} style={style} /> : <p>Loading image...</p>}</>
  );
};

ImageComponent.propTypes = {
  filePath: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default ImageComponent;
