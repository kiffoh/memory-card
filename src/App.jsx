import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentCount, setCurrentCount] = useState(0);
  const [maxCount, setMaximumCount] = useState(0);
  
  const [images, setImages] = useState([]);

  const [displayedImages, setDisplayedImages] = useState([]);

  const [imageTracker, setImageTracker] = useState([]);

  useEffect(() => {
    const importImages = async () => {
      const images = import.meta.glob('./assets/images/*.{png,jpg,jpeg,svg,webp}');
      const imageArray = await Promise.all(
        Object.keys(images).map(async (key) => {
          const image = await images[key]();
          return image.default;
        })
      );
      setImages(imageArray);
    };

    importImages();
  }, []);

  useEffect(() => {
    const shuffleImages = () => {
      const imagesCopied = [...images];
      for (let i = imagesCopied.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imagesCopied[i], imagesCopied[j]] = [imagesCopied[j], imagesCopied[i]];
      }
      setDisplayedImages(imagesCopied.slice(0,10));
    };
  
    shuffleImages();
  }, [images, currentCount]);
  
  

  const updateImageTracker = (image) => {
    setImageTracker(imageTracker => [...imageTracker, image])
  }

  const checkImages = (image) => {
    if (imageTracker.includes(image)) {
      setImageTracker([])
      setCurrentCount(0);
    }
  }

  const handleIncrease = () => {
    setCurrentCount(count => count + 1);
    if (currentCount >= maxCount) {
      setMaximumCount(currentCount);
    }
  }

  useEffect(() => {
    if (currentCount >= maxCount) {
      setMaximumCount(currentCount);
    }
  }, [maxCount, currentCount])

  return (
    <>
      <h1>Memory Card Game</h1>
      <h3>Simpsons Verion!</h3>
      <div className='score-container'>
        <div className="max-score"> Maximum Score is {maxCount}</div>
        <div className="curr-score">Current Score is {currentCount}</div>
        <button onClick={() => {
          if (currentCount == 0) {
            setMaximumCount(0)
          }
        }}>Reset Max Count</button>
      </div>
      <div className='help'>You can only reset Maximum Score when Current Score is 0!</div>
      <div className='images-grid'>
        {displayedImages.map((image, index) => (
          <img key={index} src={image} alt={`image=${index}`} onClick={() => { 
            handleIncrease();
            updateImageTracker(image);
            checkImages(image);
          }} />
        ))}
      </div>
    </>
  )
}

export default App
