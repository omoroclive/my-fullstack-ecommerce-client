import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

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

  .slick-prev { left: 20px; }
  .slick-next { right: 20px; }

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

const slides = [
  {
    id: 1,
    title: "Mega Sale!",
    subtitle: "Up to 70% Off",
    description: "Don't miss out on our exclusive offers. Shop now and save big!",
    buttonText: "Shop Now",
    jpg: "/images/sliderBanner.jpg",
    webp: "/images/sliderBanner.webp",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Summer Collection 2025",
    description: "Explore our latest collection of clothing and accessories.",
    buttonText: "Discover More",
    jpg: "/images/sliderBanner2.jpg",
    webp: "/images/sliderBanner2.webp",
  },
  {
    id: 3,
    title: "Shop By Category",
    subtitle: "Find Your Style",
    description: "Find exactly what you're looking for. Browse our top categories.",
    buttonText: "Browse All",
    jpg: "/images/sliderBanner3.jpg",
    webp: "/images/sliderBanner3.webp",
  },
];

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

  return (
    <>
      <style>{customArrowStyles}</style>
      <div className="hero-slider relative overflow-hidden">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative h-[600px] w-full">
              {/* Background Image with WebP + lazy loading */}
              <div className="absolute inset-0">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />

                <picture>
                  <source srcSet={slide.webp} type="image/webp" />
                  <source srcSet={slide.jpg} type="image/jpeg" />
                  <img
                    src={slide.jpg}
                    loading="lazy"
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                </picture>
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
                        aria-label={slide.buttonText}
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                          borderRadius: '28px',
                          padding: { xs: '10px 20px', md: '12px 32px' },
                          fontSize: { xs: '0.875rem', md: '1rem' },
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

export default HeroSlider;
