import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@mui/material";
import { ArrowForward, LocalOffer, NewReleases, Category } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import sliderBanner1 from '../../assets/images/sliderBanner.png';
import sliderBanner1Webp from '../../assets/images/sliderBanner.webp';
import sliderBanner2 from '../../assets/images/sliderBanner2.png';
import sliderBanner2Webp from '../../assets/images/sliderBanner2.webp';
import sliderBanner3 from '../../assets/images/sliderBanner3.jpg';
import sliderBanner3Webp from '../../assets/images/sliderBanner3.webp';

const customArrowStyles = `
  .slick-prev,
  .slick-next {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b35, #ff8c42);
    border: 3px solid rgba(255, 255, 255, 0.9);
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }

  .slick-prev:hover,
  .slick-next:hover {
    background: linear-gradient(135deg, #ff8c42, #ff6b35);
    transform: scale(1.15);
    box-shadow: 0 6px 25px rgba(255, 107, 53, 0.5);
  }

  .slick-prev { 
    left: 30px; 
    top: 50%;
    transform: translateY(-50%);
  }
  
  .slick-next { 
    right: 30px; 
    top: 50%;
    transform: translateY(-50%);
  }

  .slick-prev:before,
  .slick-next:before {
    color: white;
    font-size: 20px;
    font-weight: bold;
  }

  .slick-dots {
    bottom: 30px;
    display: flex !important;
    justify-content: center;
    gap: 10px;
  }

  .slick-dots li {
    width: auto;
    height: auto;
    margin: 0;
  }

  .slick-dots li button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }

  .slick-dots li button:before {
    display: none;
  }

  .slick-dots li.slick-active button {
    background: #ff6b35;
    border-color: white;
    transform: scale(1.2);
  }

  .slick-dots li:hover button {
    background: rgba(255, 107, 53, 0.8);
    transform: scale(1.1);
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(60px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-slideInUp {
    animation: slideInUp 0.8s ease-out;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.8s ease-out;
  }

  .animate-fadeInScale {
    animation: fadeInScale 0.6s ease-out;
  }

  .hero-slider .slick-slide {
    position: relative;
  }

  .hero-slider .slick-slide > div {
    height: 100%;
  }
`;

const slides = [
  {
    id: 1,
    title: "Mega Sale!",
    subtitle: "Up to 70% Off",
    description: "Don't miss out on our exclusive offers. Shop now and save big on your favorite items!",
    buttonText: "Shop Now",
    route: "/shop",
    icon: LocalOffer,
    jpg: sliderBanner1,
    webp: sliderBanner1Webp,
    gradientOverlay: "from-orange-900/80 via-red-900/60 to-transparent"
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Summer Collection 2025",
    description: "Explore our latest collection of trendy clothing and premium accessories.",
    buttonText: "Discover More",
    route: "/shopping",
    icon: NewReleases,
    jpg: sliderBanner2,
    webp: sliderBanner2Webp,
    gradientOverlay: "from-blue-900/80 via-purple-900/60 to-transparent"
  },
  {
    id: 3,
    title: "Shop By Category",
    subtitle: "Find Your Style",
    description: "Find exactly what you're looking for. Browse our carefully curated categories.",
    buttonText: "Browse All",
    route: "/shopping",
    icon: Category,
    jpg: sliderBanner3,
    webp: sliderBanner3Webp,
    gradientOverlay: "from-green-900/80 via-teal-900/60 to-transparent"
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    fade: true,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    pauseOnHover: true,
    adaptiveHeight: false,
  };

  return (
    <>
      <style>{customArrowStyles}</style>
      <div className="hero-slider relative overflow-hidden bg-gray-900">
        <Slider {...settings}>
          {slides.map((slide, index) => {
            const IconComponent = slide.icon;
            return (
              <div key={slide.id} className="relative">
                <div className="relative h-[650px] w-full">
                  {/* Background Image with WebP + lazy loading */}
                  <div className="absolute inset-0">
                    {/* Dynamic Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradientOverlay} z-10`} />
                    
                    {/* Additional subtle pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-20" />

                    <picture>
                      <source srcSet={slide.webp} type="image/webp" />
                      <source srcSet={slide.jpg} type="image/jpeg" />
                      <img
                        src={slide.jpg}
                        loading={index === 0 ? "eager" : "lazy"}
                        alt={`${slide.title} - ${slide.subtitle}`}
                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-[10s]"
                      />
                    </picture>
                  </div>

                  {/* Content */}
                  <div className="relative z-30 h-full flex items-center">
                    <div className="container mx-auto px-6 md:px-12 lg:px-16">
                      <div className="max-w-3xl">
                        <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/20 shadow-2xl">
                          {/* Icon and Subtitle */}
                          <div className="flex items-center gap-3 mb-4 animate-slideInLeft">
                            <div className="p-2 bg-orange-500/20 rounded-full">
                              <IconComponent className="text-orange-400 text-xl" />
                            </div>
                            <span className="text-orange-300 text-sm md:text-base font-medium uppercase tracking-widest">
                              {slide.subtitle}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slideInUp">
                            <span className="bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
                              {slide.title}
                            </span>
                          </h2>

                          {/* Description */}
                          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed animate-slideInUp">
                            {slide.description}
                          </p>

                          {/* Button */}
                          <div className="animate-fadeInScale">
                            <Button
                              onClick={() => handleNavigation(slide.route)}
                              aria-label={`${slide.buttonText} - Navigate to ${slide.route}`}
                              variant="contained"
                              size="large"
                              endIcon={<ArrowForward />}
                              sx={{
                                background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                                borderRadius: '50px',
                                padding: { xs: '12px 24px', md: '16px 40px' },
                                fontSize: { xs: '0.95rem', md: '1.1rem' },
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #ff8c42, #ff6b35)',
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 12px 40px rgba(255, 107, 53, 0.6)',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                },
                                '&:active': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.1s ease',
                                },
                              }}
                            >
                              {slide.buttonText}
                            </Button>
                          </div>

                          {/* Decorative elements */}
                          <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
                          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400/5 rounded-full blur-2xl"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-25">
                    <div className="absolute top-8 right-8 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 left-8 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-1000"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
};

export default HeroSlider;