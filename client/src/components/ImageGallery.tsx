import { ReactNode, useState, useEffect } from "react";

interface ImageGalleryProps {
  images: ReactNode[];
  second: number;
}

export default function ImageGallery(props: ImageGalleryProps) {
  const { images, second } = props;
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    let intervel = setInterval(() => {
      setActive((prev) => {
        if (prev === images.length - 1) return 0;
        return prev + 1;
      });
    }, second * 1000);
    return () => {
      clearInterval(intervel);
    };
  }, [images, second]);

  return <div>{images[active]}</div>;
}
