import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider from "../../assets/images/sliderBanner.png";
import slider2 from "../../assets/images/sliderBanner2.png";
import slider3 from "../../assets/images/sliderBanner3.jpg";

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  const slides = [
    {
      id: 1,
      image: slider,
      title: "Mega Sale!",
      description: "Don't miss out on our exclusive offers. Shop now and save big!",
    },
    {
      id: 2,
      image: slider2,
      title: "New Arrivals",
      description: "Explore our latest collection of clothing and accessories.",
    },
    {
      id: 3,
      image: slider3,
      title: "Shop By Category",
      description: "Find exactly what you're looking for. Browse our top categories.",
    },
  ];

  return (
    <div className="hero-slider bg-lightgray py-10">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="flex items-center justify-between h-[400px] px-8">
            {/* Left Side: Text */}
            <div className="flex-1 pr-8 text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-sm md:text-lg">{slide.description}</p>
            </div>
            {/* Right Side: Image */}
            <div className="flex-1">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;





