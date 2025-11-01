"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewsSlider = () => {
  const images = [
    "/news/1.png",
    "/news/2.jpg",
    "/news/3.jpg",
    "/news/4.jpg",
    "/news/5.jpg",
    "/news/6.jpg",
  ];

  // Custom Arrows
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
    >
      <ChevronRight size={24} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
    >
      <ChevronLeft size={24} />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-gray-400 rounded-full hover:bg-blue-500 transition"></div>
    ),
  };

  return (
    <section className="w-full">
      {/* Heading */}
      <div className="text-center py-6 bg-gradient-to-r from-blue-900 to-gray-900 text-white">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Latest <span className="text-lime-500">News</span>
        </h2>
        <p className="text-gray-300 mt-2 text-base md:text-lg">
          Stay updated with the latest happenings
        </p>
      </div>

      {/* Slider */}
      <div className="w-full relative">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index}>
              <div className="relative group overflow-hidden">
                {/* Image with hover zoom */}
                <img
                  src={src}
                  alt={`News ${index + 1}`}
                  className="w-full h-[320px] md:h-[600px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 md:p-10 text-white transition duration-500 group-hover:translate-y-[-5px]">
                    <h3 className="text-xl md:text-3xl font-bold group-hover:text-lime-500 transition-colors duration-300">
                      News {index + 1}
                    </h3>
                    <p className="text-sm md:text-base text-gray-200 mt-2 max-w-xl group-hover:text-gray-100">
                      A short description or headline goes here for this news.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default NewsSlider;
