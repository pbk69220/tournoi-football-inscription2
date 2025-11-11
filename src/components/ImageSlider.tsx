import React, { useState, useEffect } from 'react'
import './ImageSlider.css'

interface Slide {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  color: string
}

const slides: Slide[] = [

  {
    id: 1,
    title: 'Clubs Prestigieux',
    subtitle: 'Partenaires du Trophée',
    color: '#ff6b6b',
    imageUrl: '/Images/logos_clubs.jpg'
  },
  {
    id: 2,
    title: '24 Équipes Prestigieuses',
    subtitle: 'De toute la France',
    color: '#667eea',
    imageUrl: '/Images/image1.jpg'
  },
  {
    id: 3,
    title: '3 & 4 Janvier 2026',
    subtitle: 'Weekend du tournoi à Belleville',
    color: '#764ba2',
    imageUrl: '/Images/image2.jpg'
  },
  {
    id: 4,
    title: 'Jeunes Joueurs U13',
    subtitle: 'Futurs champions du football',
    color: '#00bcd4',
    imageUrl: '/Images/image3.jpg'
  }
]

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="image-slider">
      <div className="slider-container">
        <div className="slides-wrapper">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ '--slide-color': slide.color } as React.CSSProperties}
            >
              <div className="slide-image-wrapper">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="slide-image"
                />
              </div>
              <h3 className="slide-title">{slide.title}</h3>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
