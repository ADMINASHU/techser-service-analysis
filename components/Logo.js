import Image from 'next/image';

const Logo = () => {
  return (
    
      <Image
        src="/public/logo.jpg"  // Path to your image
        alt="Company image"     // Alt text for accessibility
        width={180}                    // Display width
        height={250}                   // Display height
      />

  );
};

export default Logo;
