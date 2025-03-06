
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import slider from "../../assets/images/sliderBanner.png";
import slider2 from "../../assets/images/sliderBanner2.png";
import slider3 from "../../assets/images/sliderBanner3.jpg";

// Custom CSS for the slick slider arrows
const customArrowStyles = `
  .slick-prev,
  .slick-next {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 1;
    transition: all 0.3s ease;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: white;
    transform: scale(1.1);
  }

  .slick-prev {
    left: 20px;
  }

  .slick-next {
    right: 20px;
  }

  .slick-prev:before,
  .slick-next:before {
    color: #333;
    font-size: 24px;
  }

  .slick-dots {
    bottom: 25px;
  }

  .slick-dots li button:before {
    font-size: 12px;
    color: white;
    opacity: 0.5;
  }

  .slick-dots li.slick-active button:before {
    opacity: 1;
    color: white;
  }
`;

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
  };

  const slides = [
    {
      id: 1,
      image: slider,
      title: "Mega Sale!",
      subtitle: "Up to 70% Off",
      description: "Don't miss out on our exclusive offers. Shop now and save big!",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      image: slider2,
      title: "New Arrivals",
      subtitle: "Summer Collection 2025",
      description: "Explore our latest collection of clothing and accessories.",
      buttonText: "Discover More",
    },
    {
      id: 3,
      image: slider3,
      title: "Shop By Category",
      subtitle: "Find Your Style",
      description: "Find exactly what you're looking for. Browse our top categories.",
      buttonText: "Browse All",
    },
  ];

  return (
    <>
      <style>{customArrowStyles}</style>
      <div className="hero-slider relative overflow-hidden">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative h-[600px] w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {/* Content */}
              <div className="relative z-20 h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-2xl animate-fadeIn">
                    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                      <span className="inline-block text-white text-sm md:text-base uppercase tracking-wider mb-3">
                        {slide.subtitle}
                      </span>
                      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-lg">
                        {slide.description}
                      </p>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                          borderRadius: '28px',
                          padding: '12px 32px',
                          fontSize: '1rem',
                          textTransform: 'none',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            transition: 'transform 0.2s ease-in-out',
                          },
                        }}
                      >
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

// Add these animations to your global CSS or tailwind.config.js
const globalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
`;

export default HeroSlider;





