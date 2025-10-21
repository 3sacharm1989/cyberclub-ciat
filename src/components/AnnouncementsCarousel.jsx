import React from "react";
import Slider from "react-slick";
import "./AnnouncementsCarousel.css";

const AnnouncementsCarousel = () => {
  const announcements = [
    "Cybersecurity Awareness Month — Attend workshops & earn certificates!",
    "Next Club Meeting: October 20th, 6PM in Room 204 / Teams Channel.",
    "Holiday Break: Campus closed from Dec 22 - Jan 3.",
    "Member Spotlight: Congrats to Sarah for earning her CompTIA Security+!",
    "Upcoming Capture the Flag (CTF) event — sign up on the Events page!",
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className="announcements-carousel">
      <h2 className="carousel-title">Club Announcements</h2>
      <Slider {...settings}>
        {announcements.map((text, index) => (
          <div key={index}>
            <h3>{text}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AnnouncementsCarousel;
