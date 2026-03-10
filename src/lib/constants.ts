import type { AgeGroup, GalaxyInfo, Operation } from './types';

// ── Scoring ──
export const PASS_THRESHOLD = 0.8;
export const PROBLEMS_PER_LEVEL = 20;
export const HINTS_PER_LEVEL = 3;

export const STAR_THRESHOLDS = [0, 0.8, 0.9, 1.0] as const;
// index 1 = 1★, index 2 = 2★, index 3 = 3★, 4★ = 3★ + time bonus

export const TIME_BONUS_MS: Record<AgeGroup, number> = {
  young: 60000,    // 3s per problem
  medium: 40000,   // 2s per problem
  advanced: 30000, // 1.5s per problem
};

// ── Rank Thresholds (stars needed) ──
export const RANK_THRESHOLDS = {
  cadet: 0,
  junior_astronaut: 21,
  astronaut: 51,
  senior_astronaut: 101,
  commander: 161,
  captain: 241,
} as const;

// ── Operations in order ──
export const OPERATION_ORDER: Operation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
];

// ── Operation symbols (universal — no translation needed) ──
export const OPERATION_SYMBOLS: Record<Operation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

// ── Galaxy data ──
export const GALAXIES: GalaxyInfo[] = [
  {
    id: 1,
    operation: 'addition',
    name: { en: 'The Solar System', es: 'El Sistema Solar' },
    description: { en: 'Travel through our solar system!', es: '¡Viaja por nuestro sistema solar!' },
    theme: { primary: '#1E40AF', secondary: '#F59E0B', accent: '#06B6D4', bg: '#0F172A' },
    destinations: [
      { levelNumber: 1,  name: { en: 'Space Station', es: 'Estación Espacial' }, type: 'station', imageKey: 'iss',       color: '#94A3B8', funFact: { en: 'Astronauts have lived on the ISS continuously since the year 2000!', es: '¡Los astronautas han vivido en la ISS continuamente desde el año 2000!' } },
      { levelNumber: 2,  name: { en: 'The Moon',      es: 'La Luna'           }, type: 'moon',    imageKey: 'moon',      color: '#CBD5E1', funFact: { en: 'The Moon is the only place beyond Earth where humans have walked!', es: '¡La Luna es el único lugar más allá de la Tierra donde los humanos han caminado!' } },
      { levelNumber: 3,  name: { en: 'Lunar Base',    es: 'Base Lunar'        }, type: 'station', imageKey: 'lunarBase', color: '#94A3B8', funFact: { en: 'Scientists are planning to build a permanent base on the Moon!', es: '¡Los científicos planean construir una base permanente en la Luna!' } },
      { levelNumber: 4,  name: { en: 'Venus',         es: 'Venus'             }, type: 'planet',  imageKey: 'venus',     color: '#F59E0B', funFact: { en: 'Venus is the hottest planet — even hotter than Mercury, which is closer to the Sun!', es: '¡Venus es el planeta más caliente, ¡incluso más caliente que Mercurio, que está más cerca del Sol!' } },
      { levelNumber: 5,  name: { en: 'Mercury',       es: 'Mercurio'          }, type: 'planet',  imageKey: 'mercury',   color: '#9CA3AF', funFact: { en: 'Mercury has no atmosphere, so temperatures swing from -180°C at night to 430°C during the day!', es: '¡Mercurio no tiene atmósfera, así que las temperaturas oscilan de -180°C de noche a 430°C de día!' } },
      { levelNumber: 6,  name: { en: 'Mars',          es: 'Marte'             }, type: 'planet',  imageKey: 'mars',      color: '#EF4444', funFact: { en: 'Mars has the tallest volcano in the solar system — Olympus Mons, 3× taller than Everest!', es: '¡Marte tiene el volcán más alto del sistema solar: Olympus Mons, 3 veces más alto que el Everest!' } },
      { levelNumber: 7,  name: { en: 'Phobos',        es: 'Fobos'             }, type: 'moon',    imageKey: 'phobos',    color: '#78716C', funFact: { en: 'Phobos orbits Mars so close that it completes an orbit in just 7.6 hours!', es: '¡Fobos orbita Marte tan cerca que completa una órbita en solo 7.6 horas!' } },
      { levelNumber: 8,  name: { en: 'Asteroid Belt', es: 'Cinturón'          }, type: 'station', imageKey: 'asteroidBelt', color: '#A8A29E', funFact: { en: 'The asteroid belt contains millions of rocky objects — leftovers from when the solar system formed!', es: '¡El cinturón de asteroides contiene millones de objetos rocosos: restos de cuando se formó el sistema solar!' } },
      { levelNumber: 9,  name: { en: 'Ceres',         es: 'Ceres'             }, type: 'planet',  imageKey: 'ceres',     color: '#A8A29E', funFact: { en: 'Ceres is a dwarf planet in the asteroid belt — so big it contains 1/3 of all asteroid belt mass!', es: '¡Ceres es un planeta enano en el cinturón de asteroides, ¡tan grande que contiene 1/3 de toda la masa del cinturón!' } },
      { levelNumber: 10, name: { en: 'Jupiter',       es: 'Júpiter'           }, type: 'planet',  imageKey: 'jupiter',   color: '#B45309', funFact: { en: 'Jupiter is so big that 1,300 Earths could fit inside it!', es: '¡Júpiter es tan grande que 1,300 Tierras podrían caber dentro!' } },
      { levelNumber: 11, name: { en: 'Europa',        es: 'Europa'            }, type: 'moon',    imageKey: 'europa',    color: '#BAE6FD', funFact: { en: 'Europa has a liquid water ocean under its icy surface — it might have life!', es: '¡Europa tiene un océano de agua líquida bajo su superficie helada, ¡podría tener vida!' } },
      { levelNumber: 12, name: { en: 'Io',            es: 'Io'                }, type: 'moon',    imageKey: 'io',        color: '#FDE047', funFact: { en: 'Io is the most volcanically active body in the solar system — it has hundreds of active volcanoes!', es: '¡Io es el cuerpo más volcánicamente activo del sistema solar, ¡tiene cientos de volcanes activos!' } },
      { levelNumber: 13, name: { en: 'Saturn',        es: 'Saturno'           }, type: 'planet',  imageKey: 'saturn',    color: '#D97706', funFact: { en: "Saturn's rings are made of ice and rock, stretching wider than 20 Earths side by side!", es: '¡Los anillos de Saturno están hechos de hielo y roca, y se extienden más que 20 Tierras lado a lado!' } },
      { levelNumber: 14, name: { en: 'Titan',         es: 'Titán'             }, type: 'moon',    imageKey: 'titan',     color: '#F97316', funFact: { en: 'Titan has lakes of liquid methane — it rains methane there, not water!', es: '¡Titán tiene lagos de metano líquido, ¡allí llueve metano, no agua!' } },
      { levelNumber: 15, name: { en: 'Uranus',        es: 'Urano'             }, type: 'planet',  imageKey: 'uranus',    color: '#67E8F9', funFact: { en: 'Uranus rotates on its side — it spins like a rolling ball around the Sun!', es: '¡Urano gira de lado, ¡gira como una pelota rodando alrededor del Sol!' } },
      { levelNumber: 16, name: { en: 'Neptune',       es: 'Neptuno'           }, type: 'planet',  imageKey: 'neptune',   color: '#3B82F6', funFact: { en: 'Neptune has the strongest winds in the solar system — up to 2,100 km/h!', es: '¡Neptuno tiene los vientos más fuertes del sistema solar, ¡hasta 2,100 km/h!' } },
      { levelNumber: 17, name: { en: 'Triton',        es: 'Tritón'            }, type: 'moon',    imageKey: 'triton',    color: '#EC4899', funFact: { en: "Triton is the only large moon that orbits backward — it's slowly being pulled apart by Neptune!", es: '¡Tritón es la única luna grande que orbita al revés, ¡lentamente está siendo desgarrada por Neptuno!' } },
      { levelNumber: 18, name: { en: 'Pluto',         es: 'Plutón'            }, type: 'planet',  imageKey: 'pluto',     color: '#C4B5FD', funFact: { en: 'Pluto has a giant heart-shaped glacier on its surface called Tombaugh Regio!', es: '¡Plutón tiene un glaciar gigante en forma de corazón llamado Tombaugh Regio!' } },
      { levelNumber: 19, name: { en: 'Kuiper Belt',   es: 'Kuiper'            }, type: 'station', imageKey: 'kuiper',    color: '#94A3B8', funFact: { en: 'The Kuiper Belt is a ring of icy objects beyond Neptune — like a second, bigger asteroid belt!', es: '¡El Cinturón de Kuiper es un anillo de objetos helados más allá de Neptuno, ¡como un segundo cinturón de asteroides pero más grande!' } },
      { levelNumber: 20, name: { en: 'Voyager',       es: 'Voyager'           }, type: 'object',  imageKey: 'voyager',   color: '#F8FAFC', funFact: { en: "Voyager 1 is the farthest human-made object — it's now in interstellar space, over 23 billion km from Earth!", es: '¡La Voyager 1 es el objeto creado por humanos más lejano, ¡ahora está en el espacio interestelar, a más de 23 mil millones de km de la Tierra!' } },
    ],
  },
  {
    id: 2,
    operation: 'subtraction',
    name: { en: 'The Outer Reaches', es: 'Los Confines' },
    description: { en: 'Explore beyond the solar system!', es: '¡Explora más allá del sistema solar!' },
    theme: { primary: '#7C3AED', secondary: '#EC4899', accent: '#8B5CF6', bg: '#1E1B4B' },
    destinations: [
      { levelNumber: 1,  name: { en: 'Oort Cloud',        es: 'Nube de Oort'       }, type: 'station', imageKey: 'oortCloud',        color: '#94A3B8', funFact: { en: 'The Oort Cloud is a sphere of icy objects surrounding our solar system — it may contain trillions of comets!', es: '¡La Nube de Oort es una esfera de objetos helados que rodea nuestro sistema solar, ¡puede contener billones de cometas!' } },
      { levelNumber: 2,  name: { en: 'Alpha Centauri',    es: 'Alfa Centauri'      }, type: 'star',    imageKey: 'alphaCentauri',    color: '#FDE68A', funFact: { en: 'Alpha Centauri is the closest star system to Earth — it has 3 stars! Light takes 4.3 years to travel from there.', es: '¡Alfa Centauri es el sistema estelar más cercano a la Tierra, ¡tiene 3 estrellas! La luz tarda 4.3 años en viajar desde allí.' } },
      { levelNumber: 3,  name: { en: 'Proxima b',         es: 'Próxima b'          }, type: 'planet',  imageKey: 'proximaCentauriB', color: '#6EE7B7', funFact: { en: 'Proxima Centauri b orbits the closest star to our Sun and might have liquid water!', es: '¡Próxima Centauri b orbita la estrella más cercana a nuestro Sol y podría tener agua líquida!' } },
      { levelNumber: 4,  name: { en: "Barnard's Star",    es: 'Estrella Barnard'   }, type: 'star',    imageKey: 'barnardsstar',     color: '#FCA5A5', funFact: { en: "Barnard's Star moves faster across the sky than any other star — it's approaching our solar system!", es: '¡La Estrella de Barnard se mueve más rápido por el cielo que cualquier otra estrella, ¡se está acercando a nuestro sistema solar!' } },
      { levelNumber: 5,  name: { en: 'Wolf 359',          es: 'Wolf 359'           }, type: 'star',    imageKey: 'wolf359',          color: '#FCA5A5', funFact: { en: 'Wolf 359 is a red dwarf star so dim that you can\'t see it without a telescope!', es: '¡Wolf 359 es una estrella enana roja tan tenue que no puedes verla sin telescopio!' } },
      { levelNumber: 6,  name: { en: 'Sirius',            es: 'Sirio'              }, type: 'star',    imageKey: 'sirius',           color: '#E0F2FE', funFact: { en: 'Sirius is the brightest star in the night sky — it\'s actually a binary star system!', es: '¡Sirio es la estrella más brillante del cielo nocturno, ¡en realidad es un sistema de estrella binaria!' } },
      { levelNumber: 7,  name: { en: "Luyten's Colony",   es: 'Colonia Luyten'     }, type: 'station', imageKey: 'luytensstar',      color: '#C4B5FD', funFact: { en: "Luyten's Star is only 12.4 light-years away and has a planet in its habitable zone!", es: '¡La Estrella de Luyten está a solo 12.4 años luz de distancia y tiene un planeta en su zona habitable!' } },
      { levelNumber: 8,  name: { en: 'Ross 128 b',        es: 'Ross 128 b'         }, type: 'planet',  imageKey: 'ross128b',         color: '#86EFAC', funFact: { en: 'Ross 128 b is a temperate Earth-like planet and one of the best candidates for life outside our solar system!', es: '¡Ross 128 b es un planeta templado parecido a la Tierra y uno de los mejores candidatos para vida fuera de nuestro sistema solar!' } },
      { levelNumber: 9,  name: { en: 'Epsilon Eridani',   es: 'Épsilon Eridani'    }, type: 'star',    imageKey: 'epsiloneridani',   color: '#FCA5A5', funFact: { en: 'Epsilon Eridani is one of the youngest nearby stars — it has its own asteroid belt and possibly planets!', es: '¡Épsilon Eridani es una de las estrellas cercanas más jóvenes, ¡tiene su propio cinturón de asteroides y posiblemente planetas!' } },
      { levelNumber: 10, name: { en: 'Tau Ceti e',        es: 'Tau Ceti e'         }, type: 'planet',  imageKey: 'taucetie',         color: '#6EE7B7', funFact: { en: 'Tau Ceti has 5 known planets, and one of them — Tau Ceti e — might be in the habitable zone!', es: '¡Tau Ceti tiene 5 planetas conocidos, y uno de ellos, Tau Ceti e, podría estar en la zona habitable!' } },
      { levelNumber: 11, name: { en: 'Vega Starport',     es: 'Puerto Vega'        }, type: 'station', imageKey: 'vega',             color: '#BAE6FD', funFact: { en: 'Vega is one of the brightest stars and will actually be the Pole Star in 13,000 years!', es: '¡Vega es una de las estrellas más brillantes y en realidad será la Estrella Polar dentro de 13,000 años!' } },
      { levelNumber: 12, name: { en: 'Fomalhaut Ring',    es: 'Anillo Fomalhaut'   }, type: 'object',  imageKey: 'fomalhaut',        color: '#FDE68A', funFact: { en: 'Fomalhaut is surrounded by a massive, bright dust ring visible from Earth with a telescope!', es: '¡Fomalhaut está rodeada por un enorme y brillante anillo de polvo visible desde la Tierra con un telescopio!' } },
      { levelNumber: 13, name: { en: 'Altair System',     es: 'Sistema Altair'     }, type: 'star',    imageKey: 'altair',           color: '#FDE68A', funFact: { en: 'Altair spins so fast — once every 9 hours — that it bulges at the equator and is squished at the poles!', es: '¡Altair gira tan rápido, una vez cada 9 horas, que se abomba en el ecuador y se aplana en los polos!' } },
      { levelNumber: 14, name: { en: '61 Cygni Obs.',     es: 'Obs. 61 Cygni'      }, type: 'station', imageKey: '61cygni',          color: '#A5B4FC', funFact: { en: '61 Cygni was the first star to have its distance measured in 1838 — a huge breakthrough in astronomy!', es: '¡61 Cygni fue la primera estrella cuya distancia se midió en 1838, ¡un gran avance en astronomía!' } },
      { levelNumber: 15, name: { en: "Kapteyn b",         es: 'Kapteyn b'          }, type: 'planet',  imageKey: 'kapteynb',         color: '#86EFAC', funFact: { en: "Kapteyn b is one of the oldest exoplanets known — it's about 11 billion years old (the Earth is 4.5 billion)!", es: '¡Kapteyn b es uno de los exoplanetas más antiguos conocidos, ¡tiene unos 11 mil millones de años (la Tierra tiene 4.5 mil millones)!' } },
      { levelNumber: 16, name: { en: 'Gliese 667 Cc',     es: 'Gliese 667 Cc'      }, type: 'planet',  imageKey: 'gliese667cc',      color: '#6EE7B7', funFact: { en: 'Gliese 667 Cc is in the habitable zone of a triple star system — imagine three suns in the sky!', es: '¡Gliese 667 Cc está en la zona habitable de un sistema triple de estrellas, ¡imagina tres soles en el cielo!' } },
      { levelNumber: 17, name: { en: 'TRAPPIST-1',        es: 'TRAPPIST-1'         }, type: 'star',    imageKey: 'trappist1',        color: '#FCA5A5', funFact: { en: 'TRAPPIST-1 has 7 Earth-sized planets — 3 of them in the habitable zone!', es: '¡TRAPPIST-1 tiene 7 planetas del tamaño de la Tierra, ¡3 de ellos en la zona habitable!' } },
      { levelNumber: 18, name: { en: 'TRAPPIST-1 e',      es: 'TRAPPIST-1 e'       }, type: 'planet',  imageKey: 'trappist1e',       color: '#86EFAC', funFact: { en: 'TRAPPIST-1 e is one of the most promising planets for life — it receives similar energy from its star as Earth does from the Sun!', es: '¡TRAPPIST-1 e es uno de los planetas más prometedores para la vida, ¡recibe energía de su estrella similar a la que la Tierra recibe del Sol!' } },
      { levelNumber: 19, name: { en: 'Kepler Station',    es: 'Estación Kepler'    }, type: 'station', imageKey: 'keplerstation',    color: '#A5B4FC', funFact: { en: 'The Kepler Space Telescope discovered over 2,600 exoplanets — revolutionizing our understanding of the universe!', es: '¡El Telescopio Espacial Kepler descubrió más de 2,600 exoplanetas, ¡revolucionando nuestra comprensión del universo!' } },
      { levelNumber: 20, name: { en: 'Interstellar Gate', es: 'Puerta Interestelar' }, type: 'object',  imageKey: 'interstellargate', color: '#C4B5FD', funFact: { en: 'You have explored all nearby stars! The galaxy awaits beyond this gate...', es: '¡Has explorado todas las estrellas cercanas! La galaxia espera más allá de esta puerta...' } },
    ],
  },
  {
    id: 3,
    operation: 'multiplication',
    name: { en: 'The Stars', es: 'Las Estrellas' },
    description: { en: 'Journey through stellar nurseries!', es: '¡Viaja por las guarderías estelares!' },
    theme: { primary: '#F59E0B', secondary: '#EF4444', accent: '#10B981', bg: '#1C1917' },
    destinations: [
      { levelNumber: 1,  name: { en: 'Orion Nebula',     es: 'Nebulosa Orión'   }, type: 'nebula',   imageKey: 'orion',        color: '#F97316', funFact: { en: "The Orion Nebula is a stellar nursery — it's actively forming new stars right now!", es: '¡La Nebulosa de Orión es una guardería estelar, ¡está formando nuevas estrellas activamente ahora mismo!' } },
      { levelNumber: 2,  name: { en: 'Betelgeuse',       es: 'Betelgeuse'       }, type: 'star',     imageKey: 'betelgeuse',   color: '#DC2626', funFact: { en: 'Betelgeuse is so big that if it replaced our Sun, it would engulf all planets out to Jupiter!', es: '¡Betelgeuse es tan grande que si reemplazara a nuestro Sol, engulliría todos los planetas hasta Júpiter!' } },
      { levelNumber: 3,  name: { en: 'Rigel',            es: 'Rigel'            }, type: 'star',     imageKey: 'rigel',        color: '#BAE6FD', funFact: { en: 'Rigel is 120,000 times brighter than our Sun — it would make a fantastic flashlight!', es: '¡Rigel es 120,000 veces más brillante que nuestro Sol, ¡sería una linterna fantástica!' } },
      { levelNumber: 4,  name: { en: 'Pleiades',         es: 'Pléyades'         }, type: 'cluster',  imageKey: 'pleiades',     color: '#93C5FD', funFact: { en: 'The Pleiades are the Seven Sisters — a famous star cluster visible with the naked eye!', es: '¡Las Pléyades son las Siete Hermanas, ¡un famoso cúmulo estelar visible a simple vista!' } },
      { levelNumber: 5,  name: { en: 'Hyades Station',   es: 'Estación Hyades'  }, type: 'station',  imageKey: 'hyades',       color: '#A78BFA', funFact: { en: 'The Hyades are the closest star cluster to Earth — they were mentioned by Homer in the Iliad!', es: '¡Las Hyades son el cúmulo estelar más cercano a la Tierra, ¡fueron mencionadas por Homero en la Ilíada!' } },
      { levelNumber: 6,  name: { en: 'Crab Nebula',      es: 'Nebulosa Cangrejo' }, type: 'nebula',   imageKey: 'crab',         color: '#6EE7B7', funFact: { en: 'The Crab Nebula is the remains of a supernova explosion seen by Chinese astronomers in 1054!', es: '¡La Nebulosa del Cangrejo son los restos de una explosión de supernova vista por astrónomos chinos en 1054!' } },
      { levelNumber: 7,  name: { en: 'Polaris',          es: 'Polaris'          }, type: 'star',     imageKey: 'polaris',      color: '#FDE68A', funFact: { en: 'Polaris (the North Star) barely moves in the sky — sailors have used it to navigate for thousands of years!', es: '¡Polaris (la Estrella del Norte) apenas se mueve en el cielo, ¡los marineros la han usado para navegar durante miles de años!' } },
      { levelNumber: 8,  name: { en: 'Antares',          es: 'Antares'          }, type: 'star',     imageKey: 'antares',      color: '#DC2626', funFact: { en: 'Antares is the heart of Scorpius — it\'s about 700 times the size of our Sun!', es: '¡Antares es el corazón de Escorpio, ¡tiene unas 700 veces el tamaño de nuestro Sol!' } },
      { levelNumber: 9,  name: { en: 'Eagle Nebula',     es: 'Nebulosa Águila'  }, type: 'nebula',   imageKey: 'eagle',        color: '#86EFAC', funFact: { en: 'The Eagle Nebula contains the famous Pillars of Creation — giant columns of gas and dust making new stars!', es: '¡La Nebulosa del Águila contiene los famosos Pilares de la Creación, ¡gigantescas columnas de gas y polvo que crean nuevas estrellas!' } },
      { levelNumber: 10, name: { en: 'Canopus',          es: 'Canopus'          }, type: 'star',     imageKey: 'canopus',      color: '#FDE68A', funFact: { en: 'Canopus is the second brightest star in the sky and is used by spacecraft navigation systems!', es: '¡Canopus es la segunda estrella más brillante del cielo y es usada por los sistemas de navegación de naves espaciales!' } },
      { levelNumber: 11, name: { en: 'Ring Nebula',      es: 'Nebulosa Anillo'  }, type: 'nebula',   imageKey: 'ring',         color: '#A5B4FC', funFact: { en: 'The Ring Nebula is the shell of a dying star — our Sun will look like this in about 5 billion years!', es: '¡La Nebulosa del Anillo es la envoltura de una estrella moribunda, ¡nuestro Sol se verá así en unos 5 mil millones de años!' } },
      { levelNumber: 12, name: { en: 'Aldebaran',        es: 'Aldebarán'        }, type: 'star',     imageKey: 'aldebaran',    color: '#F97316', funFact: { en: "Aldebaran is the eye of Taurus the Bull — it's 44 times bigger than our Sun!", es: '¡Aldebarán es el ojo de Tauro el Toro, ¡es 44 veces más grande que nuestro Sol!' } },
      { levelNumber: 13, name: { en: "Cat's Eye Nebula", es: 'Nebulosa Ojo Gato' }, type: 'nebula',   imageKey: 'catseye',      color: '#22D3EE', funFact: { en: "The Cat's Eye Nebula is one of the most complex nebulae ever seen, with many concentric shells of gas!", es: '¡La Nebulosa del Ojo de Gato es una de las más complejas jamás vistas, con muchas conchas concéntricas de gas!' } },
      { levelNumber: 14, name: { en: 'Deneb',            es: 'Deneb'            }, type: 'star',     imageKey: 'deneb',        color: '#E0F2FE', funFact: { en: "Deneb is one of the most luminous stars we know — it shines with the power of 200,000 suns!", es: '¡Deneb es una de las estrellas más luminosas que conocemos, ¡brilla con la potencia de 200,000 soles!' } },
      { levelNumber: 15, name: { en: 'Helix Nebula',     es: 'Nebulosa Helix'   }, type: 'nebula',   imageKey: 'helix',        color: '#6EE7B7', funFact: { en: 'The Helix Nebula is sometimes called the Eye of God — it\'s one of the closest planetary nebulae to Earth!', es: '¡La Nebulosa Helix a veces se llama el Ojo de Dios, ¡es una de las nebulosas planetarias más cercanas a la Tierra!' } },
      { levelNumber: 16, name: { en: 'Spica',            es: 'Espiga'           }, type: 'star',     imageKey: 'spica',        color: '#BAE6FD', funFact: { en: 'Spica is actually two stars orbiting each other so closely that they appear as one bright point of light!', es: '¡Espiga es en realidad dos estrellas que orbitan tan cerca que parecen un único punto de luz brillante!' } },
      { levelNumber: 17, name: { en: 'Butterfly Nebula', es: 'Nebulosa Mariposa' }, type: 'nebula',   imageKey: 'butterfly',    color: '#F472B6', funFact: { en: 'The Butterfly Nebula has wings of gas spanning 3 light-years — one of the hottest dying star cores known!', es: '¡La Nebulosa Mariposa tiene alas de gas de 3 años luz de longitud, ¡uno de los núcleos de estrella moribunda más calientes conocidos!' } },
      { levelNumber: 18, name: { en: 'Arcturus',         es: 'Arturo'           }, type: 'star',     imageKey: 'arcturus',     color: '#F97316', funFact: { en: 'Arcturus is a red giant and the brightest star in the Northern Hemisphere sky!', es: '¡Arturo es una gigante roja y la estrella más brillante del cielo del hemisferio norte!' } },
      { levelNumber: 19, name: { en: 'Horsehead Nebula', es: 'Nebulosa Cabeza Caballo' }, type: 'nebula', imageKey: 'horsehead', color: '#F0ABFC', funFact: { en: "The Horsehead Nebula is a dark cloud of gas shaped like a horse's head silhouetted against a bright red background!", es: '¡La Nebulosa Cabeza de Caballo es una nube oscura de gas con forma de cabeza de caballo silueteada contra un fondo rojo brillante!' } },
      { levelNumber: 20, name: { en: 'Galactic Center',  es: 'Centro Galáctico' }, type: 'object',   imageKey: 'galacticcenter', color: '#FDE68A', funFact: { en: 'At the center of our Milky Way galaxy lurks a supermassive black hole 4 million times the mass of our Sun!', es: '¡En el centro de nuestra galaxia Vía Láctea acecha un agujero negro supermasivo con 4 millones de veces la masa de nuestro Sol!' } },
    ],
  },
  {
    id: 4,
    operation: 'division',
    name: { en: 'Deep Space', es: 'Espacio Profundo' },
    description: { en: 'Voyage to distant galaxies!', es: '¡Viaja a galaxias lejanas!' },
    theme: { primary: '#3B82F6', secondary: '#A855F7', accent: '#F472B6', bg: '#020617' },
    destinations: [
      { levelNumber: 1,  name: { en: 'Large Magellanic',  es: 'Nube Magallanes Grande' }, type: 'galaxy',  imageKey: 'lmc',        color: '#FDE68A', funFact: { en: 'The Large Magellanic Cloud is a galaxy orbiting ours — it looks like a bright cloud in the Southern sky!', es: '¡La Nube de Magallanes Grande es una galaxia que orbita la nuestra, ¡parece una nube brillante en el cielo del Sur!' } },
      { levelNumber: 2,  name: { en: 'Small Magellanic',  es: 'Nube Magallanes Pequeña' }, type: 'galaxy', imageKey: 'smc',        color: '#BAE6FD', funFact: { en: 'The Small Magellanic Cloud contains millions of stars and is about 200,000 light-years away!', es: '¡La Nube de Magallanes Pequeña contiene millones de estrellas y está a unos 200,000 años luz!' } },
      { levelNumber: 3,  name: { en: 'Canis Major Dwarf', es: 'Enana Can Mayor'        }, type: 'galaxy',  imageKey: 'canisminordwarf', color: '#F97316', funFact: { en: 'The Canis Major Dwarf Galaxy is actually the closest galaxy to Earth — even closer than the Magellanic Clouds!', es: '¡La Galaxia Enana Can Mayor es en realidad la galaxia más cercana a la Tierra, ¡incluso más cercana que las Nubes de Magallanes!' } },
      { levelNumber: 4,  name: { en: 'Sagittarius Dwarf', es: 'Enana Sagitario'        }, type: 'galaxy',  imageKey: 'sagdwarf',   color: '#F0ABFC', funFact: { en: 'The Sagittarius Dwarf Elliptical Galaxy is currently being absorbed by our Milky Way — it\'s passing right through our galaxy!', es: '¡La Galaxia Enana Elíptica de Sagitario está siendo absorbida por nuestra Vía Láctea, ¡está pasando justo a través de nuestra galaxia!' } },
      { levelNumber: 5,  name: { en: 'Andromeda',         es: 'Andrómeda'              }, type: 'galaxy',  imageKey: 'andromeda',  color: '#C4B5FD', funFact: { en: 'Andromeda is the closest large galaxy to us — and it\'s on a collision course with the Milky Way in 4.5 billion years!', es: '¡Andrómeda es la galaxia grande más cercana a nosotros, ¡y está en curso de colisión con la Vía Láctea en 4.5 mil millones de años!' } },
      { levelNumber: 6,  name: { en: 'Triangulum',        es: 'Triangulum'             }, type: 'galaxy',  imageKey: 'triangulum', color: '#86EFAC', funFact: { en: 'The Triangulum Galaxy (M33) is the third-largest in our Local Group and contains about 40 billion stars!', es: '¡La Galaxia del Triángulo (M33) es la tercera más grande de nuestro Grupo Local y contiene unos 40 mil millones de estrellas!' } },
      { levelNumber: 7,  name: { en: 'Local Group Hub',   es: 'Centro Grupo Local'     }, type: 'station', imageKey: 'localgroup', color: '#94A3B8', funFact: { en: 'Our Local Group contains more than 50 galaxies, all held together by gravity!', es: '¡Nuestro Grupo Local contiene más de 50 galaxias, ¡todas unidas por la gravedad!' } },
      { levelNumber: 8,  name: { en: 'Centaurus A',       es: 'Centauro A'             }, type: 'galaxy',  imageKey: 'centaurusa', color: '#A78BFA', funFact: { en: 'Centaurus A has a dramatic dark lane of dust crossing it — it\'s actually two galaxies that collided!', es: '¡Centauro A tiene una dramática franja oscura de polvo que la cruza, ¡en realidad son dos galaxias que colisionaron!' } },
      { levelNumber: 9,  name: { en: 'M87',               es: 'M87'                    }, type: 'galaxy',  imageKey: 'm87',        color: '#F9A8D4', funFact: { en: 'M87\'s black hole was the first ever photographed — in 2019! It\'s 6.5 billion times the mass of our Sun.', es: '¡El agujero negro de M87 fue el primero en fotografiarse, ¡en 2019! Tiene 6.5 mil millones de veces la masa de nuestro Sol.' } },
      { levelNumber: 10, name: { en: 'Sombrero Galaxy',   es: 'Galaxia Sombrero'       }, type: 'galaxy',  imageKey: 'sombrero',   color: '#FDE68A', funFact: { en: 'The Sombrero Galaxy looks like a giant hat in space — it has a massive black hole and over 2,000 globular clusters!', es: '¡La Galaxia Sombrero parece un enorme sombrero en el espacio, ¡tiene un agujero negro masivo y más de 2,000 cúmulos globulares!' } },
      { levelNumber: 11, name: { en: 'Whirlpool Galaxy',  es: 'Galaxia Remolino'       }, type: 'galaxy',  imageKey: 'whirlpool',  color: '#93C5FD', funFact: { en: 'The Whirlpool Galaxy is a perfect face-on spiral interacting with a smaller companion galaxy — a cosmic dance!', es: '¡La Galaxia del Remolino es una espiral perfecta interactuando con una galaxia compañera más pequeña, ¡una danza cósmica!' } },
      { levelNumber: 12, name: { en: 'Pinwheel Galaxy',   es: 'Galaxia Molinete'       }, type: 'galaxy',  imageKey: 'pinwheel',   color: '#F0ABFC', funFact: { en: 'The Pinwheel Galaxy is one of the most well-studied grand-design spirals — it contains about 1 trillion stars!', es: '¡La Galaxia Molinete es una de las espirales de gran diseño más estudiadas, ¡contiene unos 1 billón de estrellas!' } },
      { levelNumber: 13, name: { en: 'Cartwheel Galaxy',  es: 'Galaxia Rueda Carro'    }, type: 'galaxy',  imageKey: 'cartwheel',  color: '#6EE7B7', funFact: { en: 'The Cartwheel Galaxy was created when a smaller galaxy shot through its center at high speed — like a cosmic bull\'s-eye!', es: '¡La Galaxia Rueda de Carro fue creada cuando una galaxia más pequeña atravesó su centro a alta velocidad, ¡como una diana cósmica!' } },
      { levelNumber: 14, name: { en: 'Antennae Galaxies', es: 'Galaxias Antenas'       }, type: 'galaxy',  imageKey: 'antennae',   color: '#FCA5A5', funFact: { en: 'The Antennae Galaxies are two galaxies colliding — when galaxies collide, new stars form like crazy!', es: '¡Las Galaxias Antenas son dos galaxias colisionando, ¡cuando las galaxias chocan, se forman nuevas estrellas como locas!' } },
      { levelNumber: 15, name: { en: 'Cigar Galaxy',      es: 'Galaxia Cigarro'        }, type: 'galaxy',  imageKey: 'cigar',      color: '#F97316', funFact: { en: 'The Cigar Galaxy is a starburst galaxy — it forms stars 10 times faster than our Milky Way!', es: '¡La Galaxia Cigarro es una galaxia de explosión estelar, ¡forma estrellas 10 veces más rápido que nuestra Vía Láctea!' } },
      { levelNumber: 16, name: { en: 'Virgo Cluster',     es: 'Cúmulo Virgo'           }, type: 'cluster', imageKey: 'virgo',      color: '#C4B5FD', funFact: { en: 'The Virgo Cluster is a massive cluster of over 1,300 galaxies — it\'s the heart of our local supercluster!', es: '¡El Cúmulo de Virgo es un enorme cúmulo de más de 1,300 galaxias, ¡es el corazón de nuestro supercúmulo local!' } },
      { levelNumber: 17, name: { en: 'Laniakea',          es: 'Laniakea'               }, type: 'cluster', imageKey: 'laniakea',   color: '#A78BFA', funFact: { en: 'Laniakea is our home supercluster — it contains 100,000 galaxies and spans 520 million light-years!', es: '¡Laniakea es nuestro supercúmulo local, ¡contiene 100,000 galaxias y abarca 520 millones de años luz!' } },
      { levelNumber: 18, name: { en: "Boötes Void",       es: 'Vacío de Boötes'        }, type: 'object',  imageKey: 'bootesvoid', color: '#1E293B', funFact: { en: "The Boötes Void is a giant empty region of space — 250 million light-years across with almost no galaxies!", es: '¡El Vacío de Boötes es una enorme región vacía del espacio, ¡de 250 millones de años luz de diámetro con casi ninguna galaxia!' } },
      { levelNumber: 19, name: { en: 'Observable Edge',   es: 'Borde Observable'       }, type: 'object',  imageKey: 'cosmicweb',  color: '#E0F2FE', funFact: { en: 'The observable universe is 93 billion light-years across and contains about 2 trillion galaxies!', es: '¡El universo observable tiene 93 mil millones de años luz de diámetro y contiene unos 2 billones de galaxias!' } },
      { levelNumber: 20, name: { en: 'The Big Bang',      es: 'El Big Bang'            }, type: 'object',  imageKey: 'bigbang',    color: '#FDE68A', funFact: { en: 'You reached the beginning of everything! The universe is 13.8 billion years old. YOU are made of stardust — you ARE the universe exploring itself!', es: '¡Llegaste al principio de todo! El universo tiene 13,800 millones de años. ¡TÚ estás hecho de polvo de estrellas, ¡ERES el universo explorándose a sí mismo!' } },
    ],
  },
];

// ── Badge definitions ──
export const BADGE_KEYS = [
  'first_flight',
  'speed_demon',
  'perfect_launch',
  'addition_master',
  'subtraction_hero',
  'multiplication_wizard',
  'division_champion',
  'space_explorer',
  'math_legend',
  'streak_star',
  'persistent_pilot',
  'daily_explorer',
] as const;

export type BadgeKey = (typeof BADGE_KEYS)[number];
