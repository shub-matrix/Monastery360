
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ImageSlideshow.css';

const ImageSlideshow = ({ monasteryName, imageName, imageName2, imageName3 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const generateSlideImages = useCallback(() => {
        let baseName = '';
        
        const southSikkimNewMonasteries = [
            'Namtse Nga-dag Monastery',
            'Yangang Gonpa Tashi Palding Gon',
            'Mangbro Monastery',
            'Linge Phagyal Monastery',
            'Burmiok Wosel Choling Monastery',
            'Ben Karma Choling Monastery',
            'Namthang Norbu Tsho-ling Monastery',
            'Malli Tashi Chodarling Monastery',
            'Wok Pabong Monastery',
            'Sangmo Sharchog Bephug Monastery',
            'Parbing Samten Choling Monastery',
            'Tekling Dzokchen Monastery',
            'Namtse Ahaley Dechen Choling Monastery',
            'Sorok Tamang Monastery',
            'Suiram Risung Monastery',
            'Namthang Nyima Choling Monastery',
            'Gagyong Monastery',
            'Rabong Monastery',
            'Rabong Kunphenling Tsechu Monastery',
            'Yangang Changchub Tamu Monastery'
        ];
        if (southSikkimNewMonasteries.includes(monasteryName)) {
            return [
                {
                    src: '/images/slide/South Comman image.jpg',
                    srcset: '/images/slide/South Comman image.jpg 1x, /images/slide/South Comman image.jpg 2x',
                    alt: `${monasteryName} - Slide Image`,
                    fallback: '/images/slide/South Comman image.jpg'
                },
                {
                    src: '/images/slide/South Comman image.jpg',
                    srcset: '/images/slide/South Comman image.jpg 1x, /images/slide/South Comman image.jpg 2x',
                    alt: `${monasteryName} - Slide Image`,
                    fallback: '/images/slide/South Comman image.jpg'
                },
                {
                    src: '/images/slide/South Comman image.jpg',
                    srcset: '/images/slide/South Comman image.jpg 1x, /images/slide/South Comman image.jpg 2x',
                    alt: `${monasteryName} - Slide Image`,
                    fallback: '/images/slide/South Comman image.jpg'
                }
            ];
        }
        const nameMapping = {
            'Rumtek Monastery': 'Rumtek-Monastery-',
            'Pemayangtse Monastery': 'Pemangytse',
            'Tashiding Monastery': 'Tashiding-Monastery',
            'Enchey Monastery': 'Enchey-Monastery',
            'Dubdi Monastery': 'Dubdi Monastery',
            'Phodong Monastery': 'Phodong-Monastery',
            'Ralang Monastery': 'Ralang-Monastery',
            'Tsuklakhang Gonpa': 'Tsuklakhang-Gonpa',
            'Kathog Lake Monastery': 'Kathog',
            'Lingdum Zurmang Monastery': 'Lingdum-Zurmang',
            'Bumtar Namdroling Monastery': 'Bumtar Namdroling Monastery',
            'Doling Monastery': 'Doling-Monastery',
            'Karma Raptenling Monastery': 'Karma-Raptenling-Monastery',
            'Ngadag Monastery': 'Ngadag-Monastery',
            'Aden Wolung Monastery': 'ADEN WOLUNG',
            'Chakung Monastery': 'CHAKUNG',
            'Dodak Tamu Monastery': 'DODAK TAMU',
            'Druk Monastery': 'Druk',
            'Hungri Monastery': 'HUNGRI',
            'Khachoedpalri Monastery': 'KHACHOEDPALRI',
            'Lhuntse Monastery': 'LHUNTSE',
            'Melli-Atsing Monastery': 'MELLI-ATSING',
            'Nubling Monastery': 'NUBLING',
            'Okhery Monastery': 'OKHERY',
            'Pegmantysse Monastery': 'pegmantysse',
            'Rinchen Choling Monastery': 'RINCHEN CHOLING',
            'Rinchenpung Monastery': 'RINCHENPUNG',
            'Sinon Monastery': 'Sinon',
            'Sri Badam Monastery': 'SRI BADAM',
            'Tashi Samboling Monastery': 'TASHI SAMBOLING',
            'Kathog Dorjeden Monastery': 'Kathog-Dorjeden-Monastery',
            'Lingdok Tsangkhar Monastery': 'Lingdok-Tsangkhar-Monastery',
            'Linkoed Monastery': 'Linkoed-Monastery',
            'Old Rumtek Monastery': 'Old-Rumtek-Monastery',
            'Pabyuk Monastery': 'Pabyuk-Monastery',
            'Ray Mindu Katenling Monastery': 'Ray-Mindu-Katenling-Monastery',
            'Tsuklakhang Monastery': 'Tsuklakhang-Monastery',
            'Labrang Monastery': 'LABRANG MONASTEY',
            'Lachen Ngodub Choling Monastery': 'LACHEN NGODUB CHOLING MONASTERY',
            'Lachen Thangu Monastery': 'LACHEN THANGU MONASTERY',
            'Lingthem Gonpa Chophel Dargyeling': 'LINGTHEM GONPA CHOPHEL DARGYELING',
            'Phensang Monastery': 'Phensang Monastery',
            'Phodong Karma Tashi Chokhorling Monastery': 'PHODONG KARMA TASHI CHOKHORLING MONASTERY',
            'Silem Phagyal Tashi Dargyeling Monastery': 'SILEM PHAGYAL TASHI DARGYELING MONASTERY',
            'Singchit Ngadag Monastery': 'SINGCHIT NGADAG MONASTERY',
            'Tholung Monastery': 'THOLUNG MONASTERY',
            'Tingbung Monastery': 'TINGBUNG MONASTERY',
            'Lachung Samten Choling Monastery': 'LACHUNG SAMTEN CHOLING MONASTERY',
            'Ship Kunzang Choling Monastery': 'SHIP KUNZANG CHOLING MONASTERY',
            'Hee Gyathang Monastery': 'HEE GYATHANG MONASTERY',
            'Malam Monastery': 'MALAM MONASTERY',
            'Nage Ugen Sandolingling Monastery': 'NAGE UGEN SANDOLINGLING MONASTERY',
            'Choten Monastery': 'Choten-Monastery',
            'Kagon Tshechhogling Monastery': 'Kagon-Tshechhogling-Monastery',
            'Lingdum Zurmang Kharwang Gonpa Monastery': 'Lingdum-Zurmang-Kharwang-Gonpa-Monastery',
            'Raloong Monastery': 'Raloong-Monastery',
            'Rumtek Dharma Chakra Centre Monastery': 'Rumtek-Dharma-Chakra-Centre-Monastey',
            'Sang Ngor Monastery': 'Sang-Ngor-Monastery',
            'Sichey Dechen Choling Monastery': 'Sichey-Dechen-Choling-Monastery',
            'Tashi Palden Monastery': 'Tashi-Palden-Monastery',
            'Tinkye Gonjang Monastery': 'Tinkye-Gonjang-Monastery'
        };

        const southSikkimNew = [
            'Serdup Choling Monastery',
            'Kewzing Tashi Gyephelling Monastery',
            'Bon Monastery',
            'Burmiok Norbugang Monastery',
            'Ralong Palchen Choling Monastery'
        ];
        if (southSikkimNew.includes(monasteryName) || monasteryName === 'Linge Phagyal Monastery') {
            if (monasteryName === 'Linge Phagyal Monastery') {
                return [1,2,3].map(i => ({
                    src: `/images/slide/South Comman image.jpg`,
                    srcset: `/images/slide/South Comman image.jpg 1x, /images/slide/South Comman image.jpg 2x`,
                    alt: `${monasteryName} - Image ${i}`,
                    fallback: `/images/slide/South Comman image.jpg`
                }));
            }
            const images = [];
            if (imageName) images.push({
                src: `/images/${imageName}`,
                srcset: `/images/${imageName} 1x, /images/${imageName} 2x`,
                alt: `${monasteryName} - Image 1`,
                fallback: `/images/${imageName}`
            });
            if (imageName2) images.push({
                src: `/images/${imageName2}`,
                srcset: `/images/${imageName2} 1x, /images/${imageName2} 2x`,
                alt: `${monasteryName} - Image 2`,
                fallback: `/images/${imageName2}`
            });
            if (imageName3) images.push({
                src: `/images/${imageName3}`,
                srcset: `/images/${imageName3} 1x, /images/${imageName3} 2x`,
                alt: `${monasteryName} - Image 3`,
                fallback: `/images/${imageName3}`
            });
            if (images.length < 3) {
                for (let i = images.length + 1; i <= 3; i++) {
                    images.push({
                        src: `/images/${monasteryName.replace(/ /g, '-')}${i}.png`,
                        srcset: `/images/${monasteryName.replace(/ /g, '-')}${i}.png 1x, /images/${monasteryName.replace(/ /g, '-')}${i}.png 2x`,
                        alt: `${monasteryName} - Image ${i}`,
                        fallback: `/images/${imageName}`
                    });
                }
            }
            return images;
        }
        baseName = nameMapping[monasteryName] || monasteryName;
        if (monasteryName === 'Bumtar Namdroling Monastery') {
            return [1,2,3].map(i => ({
                src: `/images/Bumtar Namdroling Monastery${i}.jpg`,
                srcset: `/images/Bumtar Namdroling Monastery${i}.jpg 1x, /images/Bumtar Namdroling Monastery${i}.jpg 2x`,
                alt: `${monasteryName} - Image ${i}`,
                fallback: `/images/${imageName}`
            }));
        }
        if (["Doling Monastery", "Karma Raptenling Monastery", "Ngadag Monastery"].includes(monasteryName)) {
            const availableImages = [];
            for (let i = 1; i <= 3; i++) {
                availableImages.push({
                    src: `/images/${baseName}${i}.jpg`,
                    srcset: `/images/${baseName}${i}.jpg 1x, /images/${baseName}${i}.jpg 2x`,
                    alt: `${monasteryName} - Image ${i}`,
                    fallback: `/images/${imageName}`
                });
            }
            return availableImages;
        }

        const westRegionMonasteries = [
            'Aden Wolung Monastery', 'Dodak Tamu Monastery', 
            'Lhuntse Monastery', 'Rinchen Choling Monastery', 'Tashi Samboling Monastery'
        ];

        const northSikkimMonasteries = [
            'Ringyim Rigdzin Tharling Monastery', 'Gor Rinchen Khando Monastery', 
            'Barphog Chhodub Dargyeling Monastery', 'Shagyong Monastery', 
            'Tsawang Choling Monastery', 'Kabi Sanga Dargyeling Monastery', 
            'Sontam Tensung Monastery', 'Tsungthang Monastery', 
            'Tareng Gonpa Dargye Choling Monastery', 'Ship Kunzang Choling Monastery', 
            'Hee Gyathang Monastery', 'Malam Monastery', 'Nage Ugen Sandolingling Monastery'
        ];

        const eastSikkimMonasteries = [
            'Martam Namdzong Monastery', 'Amba Mamring Monastery', 'Radong Tensung Monastery',
            'Bakcham Monastery', 'Taktse Ani Gonpa Ugen Chokhorling Monastery', 'Khatek Pema Choling Monastery',
            'Taglung Domsumling Monastery', 'Dolepchen Boudha Sanskrit Monastery', 'Singtam Gonpa Karma Thuje Choling Monastery',
            'Burtuk Ugen Pema Choling Tamu Monastery', 'Duchi Gyalon Monastery', 'Bongyong Ani Gonpa Rinak Monastery',
            'Simig Monastery', 'Pathing Matsang Monastery', 'Tsangek Monastery', 'Sang Monastery',
            'Sumon Thubten Gatsalling Monastery', 'Martam Tsangkhar Monastery'
        ];
        
        const mixedExtensionMonasteries = [
            'Hungri Monastery', 'Khachoedpalri Monastery', 'Nubling Monastery',
            'Okhery Monastery', 'Pegmantysse Monastery', 'Rinchenpung Monastery',
            'Sri Badam Monastery', 'Chakung Monastery', 'Druk Monastery', 'Melli-Atsing Monastery',
            'Enchey Monastery', 'Kathog Dorjeden Monastery', 'Lingdok Tsangkhar Monastery',
            'Linkoed Monastery', 'Old Rumtek Monastery', 'Pabyuk Monastery',
            'Ray Mindu Katenling Monastery', 'Tsuklakhang Monastery',
            'Labrang Monastery', 'Lachen Ngodub Choling Monastery', 'Lachen Thangu Monastery',
            'Lingthem Gonpa Chophel Dargyeling', 'Phensang Monastery', 'Phodong Karma Tashi Chokhorling Monastery',
            'Silem Phagyal Tashi Dargyeling Monastery', 'Singchit Ngadag Monastery',
            'Tholung Monastery', 'Tingbung Monastery', 'Lachung Samten Choling Monastery', 
            'Choten Monastery', 'Kagon Tshechhogling Monastery',
            'Lingdum Zurmang Kharwang Gonpa Monastery', 'Raloong Monastery', 'Rumtek Dharma Chakra Centre Monastery',
            'Sang Ngor Monastery', 'Sichey Dechen Choling Monastery', 'Tashi Palden Monastery', 'Tinkye Gonjang Monastery'
        ];

        if (westRegionMonasteries.includes(monasteryName)) {
            return [
                {
                    src: `/images/${baseName}.jfif`,
                    srcset: `/images/${baseName}.jfif 1x, /images/${baseName}.jfif 2x`,
                    alt: `${monasteryName} - Image 1`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/${baseName}1.jfif`,
                    srcset: `/images/${baseName}1.jfif 1x, /images/${baseName}1.jfif 2x`,
                    alt: `${monasteryName} - Image 2`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/${baseName}2.jfif`,
                    srcset: `/images/${baseName}2.jfif 1x, /images/${baseName}2.jfif 2x`,
                    alt: `${monasteryName} - Image 3`,
                    fallback: `/images/${imageName}`
                }
            ];
        }

        if (northSikkimMonasteries.includes(monasteryName)) {
            return [
                {
                    src: `/images/slide/Comman image.jpg`,
                    srcset: `/images/slide/Comman image.jpg 1x, /images/slide/Comman image.jpg 2x`,
                    alt: `${monasteryName} - Image 1`,
                    fallback: `/images/Comman image.jpg`
                },
                {
                    src: `/images/slide/Comman image.jpg`,
                    srcset: `/images/slide/Comman image.jpg 1x, /images/slide/Comman image.jpg 2x`,
                    alt: `${monasteryName} - Image 2`,
                    fallback: `/images/Comman image.jpg`
                },
                {
                    src: `/images/slide/Comman image.jpg`,
                    srcset: `/images/slide/Comman image.jpg 1x, /images/slide/Comman image.jpg 2x`,
                    alt: `${monasteryName} - Image 3`,
                    fallback: `/images/Comman image.jpg`
                }
            ];
        }

        if (eastSikkimMonasteries.includes(monasteryName)) {
            return [
                {
                    src: `/images/slide/East Comman image.jpg`,
                    srcset: `/images/slide/East Comman image.jpg 1x, /images/slide/East Comman image.jpg 2x`,
                    alt: `${monasteryName} - Image 1`,
                    fallback: `/images/East Comman image.jpg`
                },
                {
                    src: `/images/slide/East Comman image.jpg`,
                    srcset: `/images/slide/East Comman image.jpg 1x, /images/slide/East Comman image.jpg 2x`,
                    alt: `${monasteryName} - Image 2`,
                    fallback: `/images/East Comman image.jpg`
                },
                {
                    src: `/images/slide/East Comman image.jpg`,
                    srcset: `/images/slide/East Comman image.jpg 1x, /images/slide/East Comman image.jpg 2x`,
                    alt: `${monasteryName} - Image 3`,
                    fallback: `/images/East Comman image.jpg`
                }
            ];
        }

        if (mixedExtensionMonasteries.includes(monasteryName)) {
            const extensions = {
                'Hungri Monastery': ['.jpg', '1.jpg', '2.jpg'],
                'Khachoedpalri Monastery': ['.jpg', '1.JPG', '2.jpg'],
                'Nubling Monastery': ['.jpg', '1.jfif', '2.jpg'],
                'Okhery Monastery': ['.jpg', '1.jfif', '2.jfif'],
                'Pegmantysse Monastery': ['.jpg', '1.jfif', '2.jpg'],
                'Rinchenpung Monastery': ['.jpg', '1.jfif', '2.jpg'],
                'Sri Badam Monastery': ['.jpg', '1.jpg', '2.png'],
                'Chakung Monastery': ['.jfif', ' 1.jfif', ' 2.jpg'],
                'Druk Monastery': ['.jfif', '1.jfif', '2.jpg'],
                'Melli-Atsing Monastery': ['.jfif', '1.jfif', '2.jpg'],
                'Enchey Monastery': ['1.png', '2.png', '3.png'],
                'Kathog Dorjeden Monastery': ['1.jpg', '2.jpg', '3.jpg'],
                'Lingdok Tsangkhar Monastery': ['1.jpg', '2.png', '3.jpg'],
                'Linkoed Monastery': ['1.png', '2.jpg', '3.jpg'],
                'Old Rumtek Monastery': ['1.png', '2.png', '3.png'],
                'Pabyuk Monastery': ['1.png', '2.png', '3.png'],
                'Ray Mindu Katenling Monastery': ['1.png', '2.png', '3.png'],
                'Tsuklakhang Monastery': ['1.png', '2.png', '3.png'],
                'Labrang Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Lachen Ngodub Choling Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Lachen Thangu Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Lingthem Gonpa Chophel Dargyeling': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Phensang Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Phodong Karma Tashi Chokhorling Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Silem Phagyal Tashi Dargyeling Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Singchit Ngadag Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Tholung Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Tingbung Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Lachung Samten Choling Monastery': [' 1.jpg', ' 2.jpg', ' 3.jpg'],
                'Choten Monastery': ['1.png', '2.png', '3.png'],
                'Kagon Tshechhogling Monastery': ['1.png', '2.png', '3.png'],
                'Lingdum Zurmang Kharwang Gonpa Monastery': ['1.png', '2.png', '3.png'],
                'Raloong Monastery': ['1.png', '2.png', '3.jpg'],
                'Rumtek Dharma Chakra Centre Monastery': ['1.png', '2.png', '3.png'],
                'Sang Ngor Monastery': ['1.png', '2.png', '3.png', '4.png'],
                'Sichey Dechen Choling Monastery': ['1.png', '2.png'],
                'Tashi Palden Monastery': ['1.png', '2.png', '3.png'],
                'Tinkye Gonjang Monastery': ['1.png', '2.png', '3.png']
            };
            
            const exts = extensions[monasteryName];
            return exts ? exts.map((ext, index) => ({
                src: `/images/${baseName}${ext}`,
                srcset: `/images/${baseName}${ext} 1x, /images/${baseName}${ext} 2x`,
                alt: `${monasteryName} - Image ${index + 1}`,
                fallback: `/images/${imageName}`
            })) : [];
        }

        if (monasteryName === 'Sinon Monastery') {
            return [
                {
                    src: `/images/Sinon.png`,
                    srcset: `/images/Sinon.png 1x, /images/Sinon.png 2x`,
                    alt: `${monasteryName} - Image 1`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/Sinon1.png`,
                    srcset: `/images/Sinon1.png 1x, /images/Sinon1.png 2x`,
                    alt: `${monasteryName} - Image 2`,
                    fallback: `/images/${imageName}`
                },
                {
                    src: `/images/Sinon2.png`,
                    srcset: `/images/Sinon2.png 1x, /images/Sinon2.png 2x`,
                    alt: `${monasteryName} - Image 3`,
                    fallback: `/images/${imageName}`
                }
            ];
        }
        
        return [1,2,3].map(i => ({
            src: monasteryName === 'Rumtek Monastery'
                ? `/images/slide/Rumtek-Monastery-${i}.jpg`
                : `/images/slide/${baseName}${i}.jpg`,
            srcset: monasteryName === 'Rumtek Monastery'
                ? `/images/slide/Rumtek-Monastery-${i}.jpg 1x, /images/slide/Rumtek-Monastery-${i}.jpg 2x`
                : `/images/slide/${baseName}${i}.jpg 1x, /images/slide/${baseName}${i}.jpg 2x`,
            alt: `${monasteryName} - Image ${i}`,
            fallback: `/images/${imageName}`
        }));
    }, [monasteryName, imageName]);

    const images = useMemo(() => generateSlideImages(), [generateSlideImages]);
    const [imageLoadError, setImageLoadError] = useState({});

    useEffect(() => {
        setCurrentSlide(0);
        setImageLoadError({});
    }, [monasteryName]);

    useEffect(() => {
        if (images.length > 0) {
            const validImageIndices = images
                .map((_, index) => index)
                .filter(index => !imageLoadError[index]);
            
            if (validImageIndices.length > 0 && imageLoadError[currentSlide]) {
                setCurrentSlide(validImageIndices[0]);
            }
        }
    }, [imageLoadError, currentSlide, images.length]);

    const goToSlide = (index) => {
        if (!imageLoadError[index] && index >= 0 && index < images.length) {
            setCurrentSlide(index);
        }
    };

    const goToPrevious = () => {
        const validIndices = images
            .map((_, index) => index)
            .filter(index => !imageLoadError[index]);
        
        if (validIndices.length === 0) return;
        
        const currentValidIndex = validIndices.indexOf(currentSlide);
        const nextValidIndex = currentValidIndex === 0 ? validIndices.length - 1 : currentValidIndex - 1;
        setCurrentSlide(validIndices[nextValidIndex]);
    };

    const goToNext = () => {
        const validIndices = images
            .map((_, index) => index)
            .filter(index => !imageLoadError[index]);
        
        if (validIndices.length === 0) return;
        
        const currentValidIndex = validIndices.indexOf(currentSlide);
        const nextValidIndex = currentValidIndex === validIndices.length - 1 ? 0 : currentValidIndex + 1;
        setCurrentSlide(validIndices[nextValidIndex]);
    };

    const handleImageError = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: true }));
    };

    const handleImageLoad = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: false }));
    };

    const validImages = images.filter((img, idx) => !imageLoadError[idx]);
    const hasAtLeastOneImage = validImages.length > 0;
    
    if (images.length === 0) {
        return (
            <div className="slideshow-loading">
                <div className="loading-spinner"></div>
                <p>Loading images...</p>
            </div>
        );
    }

    const allImagesFailed = images.length > 0 && images.every((_, idx) => imageLoadError[idx]);
    if (allImagesFailed) {
        console.error('All images failed to load for', monasteryName, images.map(img => img.src));
        return (
            <div className="slideshow-loading">
                <div className="loading-spinner"></div>
                <p style={{color:'red'}}>No images available for this monastery.</p>
            </div>
        );
    }

    return (
        <div className="image-slideshow">
            <div className="slideshow-container">
                <div className="slide-display">
                    {images.length > 0 && (
                        <div className={`slide active${images.length === 1 ? ' single' : ''}`}> 
                            <img
                                src={imageLoadError[currentSlide] ? images[currentSlide].fallback : images[currentSlide].src}
                                srcSet={!imageLoadError[currentSlide] && images[currentSlide].srcset ? images[currentSlide].srcset : undefined}
                                alt={images[currentSlide].alt}
                                loading="eager"
                                decoding="async"
                                onError={() => handleImageError(currentSlide)}
                                onLoad={() => handleImageLoad(currentSlide)}
                            />
                            {imageLoadError[currentSlide] && (
                                <div className="image-error-message">
                                    <span style={{color: 'red', fontWeight: 'bold'}}>Image not found:</span>
                                    <div>{images[currentSlide].src}</div>
                                    <div>Showing fallback image.</div>
                                </div>
                            )}
                            <div className="slide-overlay">
                                {currentSlide === 0 && (
                                    <h1 className="monastery-title">{monasteryName}</h1>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {validImages.length > 1 && (
                    <div className="slideshow-nav-btns">
                        <button className="nav-btn prev-btn" onClick={goToPrevious}>
                            <i className="nav-icon">❮</i>
                        </button>
                        <button className="nav-btn next-btn" onClick={goToNext}>
                            <i className="nav-icon">❯</i>
                        </button>
                    </div>
                )}
                {validImages.length > 1 && (
                    <div className="slide-indicators">
                        {images.map((_, index) => (
                            !imageLoadError[index] && (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                />
                            )
                        ))}
                    </div>
                )}
                {validImages.length > 1 && (
                    <div className="thumbnail-navigation">
                        {images.map((image, index) => (
                            !imageLoadError[index] && (
                                <div
                                    key={index}
                                    className={`thumbnail${index === currentSlide ? ' active' : ''}`}
                                    style={{ minWidth: '60px', minHeight: '40px' }}
                                    onClick={() => goToSlide(index)}
                                >
                                    <img
                                        src={imageLoadError[index] ? image.fallback : image.src}
                                        srcSet={!imageLoadError[index] && image.srcset ? image.srcset : undefined}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        loading="lazy"
                                        decoding="async"
                                        onError={() => handleImageError(index)}
                                        onLoad={() => handleImageLoad(index)}
                                    />
                                    <div className="thumbnail-overlay">
                                        <span>{index + 1}</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default ImageSlideshow;