import React from "react";
import { Link } from "react-router-dom";
import Image1 from "../../assets/hero/Image2.jpeg";
import Image2 from "../../assets/hero/Image3.jpeg";
import Slider from "react-slick";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Advanced Machine Learning for Farmers",
    description:
      "Leverage cutting-edge AI to predict yields, optimize soil health, and maximize profitability for your farm.",
    cta: "Explore Farmer AI",
    ctaLink: "/farmer-ai",
  },
  {
    id: 2,
    img: Image2,
    title: "Enterprise GIS & Biomass Analytics",
    description:
      "Powerful satellite NDVI tracking, isolation forest maintenance predictions, and dynamic market forecasting.",
    cta: "Command Center",
    ctaLink: "/command-center",
  },
];

const Hero = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      {/* Decorative background blob */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>

      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Text Side */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                    className="flex gap-3 justify-center sm:justify-start"
                  >
                    <Link
                      to={data.ctaLink}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {data.cta} →
                    </Link>
                    <Link
                      to="/enterprise-ml"
                      className="inline-block bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-semibold py-2.5 px-6 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                    >
                      Enterprise ML Hub
                    </Link>
                  </div>
                </div>

                {/* Image Side */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-[300px] h-[300px] sm:h-[420px] sm:w-[420px] object-cover rounded-2xl shadow-2xl mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
