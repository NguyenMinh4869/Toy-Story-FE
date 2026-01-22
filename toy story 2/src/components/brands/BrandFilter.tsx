/**
 * BrandFilter Component
 * Sticky navigation bar with A-Z and 0-9 character filters
 * Smooth scrolls to the corresponding brand section when clicked
 */

import React, { useState, useEffect } from 'react'

interface BrandFilterProps {
  availableLetters: string[]
  className?: string
}

export const BrandFilter: React.FC<BrandFilterProps> = ({ 
  availableLetters, 
  className = '' 
}) => {
  const [activeSection, setActiveSection] = useState<string>('')

  // All possible letters A-Z and 0-9
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const numberGroup = '0-9'

  /**
   * Smooth scroll to section with offset for sticky header
   */
  const scrollToSection = (letter: string) => {
    const element = document.getElementById(`brand-section-${letter}`)
    if (element) {
      const offset = 120 // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  /**
   * Track active section on scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      const sections = availableLetters.map((letter) =>
        document.getElementById(`brand-section-${letter}`)
      )

      const scrollPosition = window.scrollY + 150 // Offset for detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(availableLetters[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [availableLetters])

  /**
   * Check if a letter is available (has brands)
   */
  const isLetterAvailable = (letter: string) => {
    return availableLetters.includes(letter)
  }

  return (
    <nav
      className={`sticky top-0 z-40 bg-white border-b-2 border-gray-200 shadow-md ${className}`}
      aria-label="Brand alphabetical navigation"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Letter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {/* A-Z Letters */}
          {allLetters.map((letter) => {
            const isAvailable = isLetterAvailable(letter)
            const isActive = activeSection === letter

            return (
              <button
                key={letter}
                onClick={() => isAvailable && scrollToSection(letter)}
                disabled={!isAvailable}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold text-sm sm:text-base
                  transition-all duration-200 flex items-center justify-center
                  ${
                    isActive
                      ? 'bg-red-600 text-white scale-110 shadow-lg'
                      : isAvailable
                      ? 'bg-gray-100 text-gray-800 hover:bg-red-100 hover:text-red-600 hover:scale-105'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  }
                `}
                aria-label={`Jump to brands starting with ${letter}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {letter}
              </button>
            )
          })}

          {/* 0-9 Group */}
          {isLetterAvailable(numberGroup) && (
            <>
              <div className="w-px h-8 bg-gray-300 mx-2" />
              <button
                onClick={() => scrollToSection(numberGroup)}
                className={`
                  px-3 h-8 sm:h-10 rounded-lg font-bold text-sm sm:text-base
                  transition-all duration-200 flex items-center justify-center
                  ${
                    activeSection === numberGroup
                      ? 'bg-red-600 text-white scale-110 shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-red-100 hover:text-red-600 hover:scale-105'
                  }
                `}
                aria-label="Jump to brands starting with numbers"
                aria-current={activeSection === numberGroup ? 'true' : undefined}
              >
                {numberGroup}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
