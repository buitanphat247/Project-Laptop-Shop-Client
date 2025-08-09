import React, { useEffect } from 'react';

const ParticlesBackground = () => {
  useEffect(() => {
    // Load particles.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.particlesJS) {
        // Particles configuration
        const particlesConfig = {
          "particles": {
            "number": {
              "value": 150,
              "density": {
                "enable": true,
                "value_area": 1200
              }
            },
            "color": {
              "value": "#ffffff"
            },
            "shape": {
              "type": "circle",
              "stroke": {
                "width": 0,
                "color": "#000000"
              },
              "polygon": {
                "nb_sides": 5
              }
            },
            "opacity": {
              "value": 0.9,
              "random": true,
              "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.4,
                "sync": false
              }
            },
            "size": {
              "value": 1.2,
              "random": true,
              "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.3,
                "sync": false
              }
            },
            "line_linked": {
              "enable": true,
              "distance": 100,
              "color": "#ffffff",
              "opacity": 0.4,
              "width": 0.3
            },
            "move": {
              "enable": true,
              "speed": 1.5,
              "direction": "none",
              "random": true,
              "straight": false,
              "out_mode": "out",
              "bounce": false,
              "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "grab"
              },
              "onclick": {
                "enable": true,
                "mode": "push"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 150,
                "line_linked": {
                  "opacity": 0.9
                }
              },
              "bubble": {
                "distance": 300,
                "size": 30,
                "duration": 2,
                "opacity": 8,
                "speed": 3
              },
              "repulse": {
                "distance": 150,
                "duration": 0.4
              },
              "push": {
                "particles_nb": 1
              },
              "remove": {
                "particles_nb": 1
              }
            }
          },
          "retina_detect": true
        };

        window.particlesJS('particles-js', particlesConfig, function() {
          console.log('Particles.js loaded successfully');
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div 
      id="particles-js" 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent'
      }}
    />
  );
};

export default ParticlesBackground;
