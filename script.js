document.addEventListener('DOMContentLoaded', () => {
    // Ajouter une barre de chargement
    const loadingBar = document.createElement('div');
    loadingBar.classList.add('loading-bar');
    document.body.appendChild(loadingBar);

    // Supprimer la barre de chargement après l'animation
    setTimeout(() => {
        loadingBar.style.opacity = '0';
        setTimeout(() => {
            loadingBar.remove();
        }, 300);
    }, 2000);

    // Navigation mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
    
    // Fermer le menu mobile lorsqu'un lien est cliqué
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
    
    // Créer le graphique de trading avec des bougies japonaises
    createTradingChart();
    
    // Animation au défilement
    const scrollElements = document.querySelectorAll('.section');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Initialiser les éléments comme cachés
    scrollElements.forEach((el) => {
        hideScrollElement(el);
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Déclencher l'animation au chargement initial
    setTimeout(() => {
        handleScrollAnimation();
    }, 200);
    
    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation des icônes de construction
    const constructionIcons = document.querySelectorAll('.construction-icon');
    constructionIcons.forEach(icon => {
        icon.style.animation = 'pulse 2s infinite';
    });
    
    // Effet de particules sur les boutons
    const buttons = document.querySelectorAll('.cta-button, .telegram-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            createParticles(e.clientX, e.clientY);
        });
    });
    
    // Animation du header au défilement
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.8)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Défilement vers le bas
            header.style.transform = 'translateY(-100%)';
        } else {
            // Défilement vers le haut
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
});

// Fonction pour créer le graphique de trading avec des bougies japonaises
function createTradingChart() {
    const tradingChart = document.getElementById('trading-chart');
    if (!tradingChart) return;
    
    // Paramètres du graphique
    const chartWidth = window.innerWidth;
    const chartHeight = window.innerHeight;
    const candleWidth = 8;
    const candleGap = 12;
    const numCandles = Math.floor(chartWidth / (candleWidth + candleGap));
    
    // Générer des données aléatoires pour les bougies
    const data = generateCandleData(numCandles);
    
    // Trouver les valeurs min et max pour l'échelle
    const minPrice = Math.min(...data.map(d => Math.min(d.open, d.close, d.low)));
    const maxPrice = Math.max(...data.map(d => Math.max(d.open, d.close, d.high)));
    const priceRange = maxPrice - minPrice;
    
    // Fonction pour convertir le prix en position Y
    const priceToY = (price) => {
        return chartHeight - ((price - minPrice) / priceRange) * (chartHeight * 0.6) - chartHeight * 0.2;
    };
    
    // Créer les bougies
    data.forEach((candle, i) => {
        const candleElement = document.createElement('div');
        candleElement.classList.add('candle');
        
        // Déterminer si c'est une bougie haussière ou baissière
        const isUp = candle.close >= candle.open;
        candleElement.classList.add(isUp ? 'up' : 'down');
        
        // Positionner la bougie
        const x = i * (candleWidth + candleGap) + candleGap;
        const y = priceToY(Math.max(candle.open, candle.close));
        const height = Math.abs(priceToY(candle.open) - priceToY(candle.close));
        
        candleElement.style.left = `${x}px`;
        candleElement.style.top = `${y}px`;
        candleElement.style.height = `${Math.max(height, 1)}px`; // Au moins 1px de hauteur
        
        // Ajouter les mèches
        const topWick = document.createElement('div');
        topWick.classList.add('wick', 'top-wick');
        topWick.style.height = `${Math.abs(priceToY(candle.high) - y)}px`;
        
        const bottomWick = document.createElement('div');
        bottomWick.classList.add('wick', 'bottom-wick');
        bottomWick.style.height = `${Math.abs(priceToY(candle.low) - (y + height))}px`;
        
        // Ajouter les éléments au DOM
        candleElement.appendChild(topWick);
        candleElement.appendChild(bottomWick);
        tradingChart.appendChild(candleElement);
        
        // Animation d'apparition
        setTimeout(() => {
            candleElement.style.opacity = '1';
        }, i * 20);
    });
    
    // Ajouter une ligne de tendance
    const trendLine = document.createElement('div');
    trendLine.classList.add('trend-line');
    tradingChart.appendChild(trendLine);
    
    // Animation de la ligne de tendance
    animateTrendLine(trendLine, data, priceToY, candleWidth, candleGap);
    
    // Mettre à jour le graphique périodiquement
    setInterval(() => {
        updateChart(tradingChart, data, priceToY, candleWidth, candleGap);
    }, 5000);
}

// Générer des données aléatoires pour les bougies
function generateCandleData(numCandles) {
    const data = [];
    let price = 100 + Math.random() * 50; // Prix initial aléatoire
    
    for (let i = 0; i < numCandles; i++) {
        const volatility = 2 + Math.random() * 3; // Volatilité aléatoire
        const change = (Math.random() - 0.5) * volatility;
        
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * volatility;
        const low = Math.min(open, close) - Math.random() * volatility;
        
        data.push({ open, close, high, low });
        
        price = close; // Le prix de clôture devient le prix d'ouverture suivant
    }
    
    return data;
}

// Mettre à jour le graphique avec de nouvelles données
function updateChart(chartElement, data, priceToY, candleWidth, candleGap) {
    // Ajouter une nouvelle bougie
    const lastCandle = data[data.length - 1];
    const newPrice = lastCandle.close + (Math.random() - 0.5) * 3;
    const volatility = 2 + Math.random() * 3;
    
    const newCandle = {
        open: lastCandle.close,
        close: newPrice,
        high: Math.max(lastCandle.close, newPrice) + Math.random() * volatility,
        low: Math.min(lastCandle.close, newPrice) - Math.random() * volatility
    };
    
    data.push(newCandle);
    data.shift(); // Supprimer la première bougie
    
    // Mettre à jour les positions des bougies existantes
    const candles = chartElement.querySelectorAll('.candle');
    
    // Trouver les nouvelles valeurs min et max
    const minPrice = Math.min(...data.map(d => Math.min(d.open, d.close, d.low)));
    const maxPrice = Math.max(...data.map(d => Math.max(d.open, d.close, d.high)));
    const priceRange = maxPrice - minPrice;
    
    // Fonction mise à jour pour convertir le prix en position Y
    const updatedPriceToY = (price) => {
        return window.innerHeight - ((price - minPrice) / priceRange) * (window.innerHeight * 0.6) - window.innerHeight * 0.2;
    };
    
    // Animer les bougies existantes
    candles.forEach((candle, i) => {
        if (i < data.length - 1) {
            const candleData = data[i];
            const isUp = candleData.close >= candleData.open;
            
            // Mettre à jour la classe
            candle.className = 'candle';
            candle.classList.add(isUp ? 'up' : 'down');
            
            // Mettre à jour la position et la taille
            const x = i * (candleWidth + candleGap) + candleGap;
            const y = updatedPriceToY(Math.max(candleData.open, candleData.close));
            const height = Math.abs(updatedPriceToY(candleData.open) - updatedPriceToY(candleData.close));
            
            candle.style.left = `${x}px`;
            candle.style.top = `${y}px`;
            candle.style.height = `${Math.max(height, 1)}px`;
            
            // Mettre à jour les mèches
            const topWick = candle.querySelector('.top-wick');
            const bottomWick = candle.querySelector('.bottom-wick');
            
            if (topWick && bottomWick) {
                topWick.style.height = `${Math.abs(updatedPriceToY(candleData.high) - y)}px`;
                bottomWick.style.height = `${Math.abs(updatedPriceToY(candleData.low) - (y + height))}px`;
            }
        } else {
            // Supprimer la dernière bougie
            candle.remove();
        }
    });
    
    // Ajouter la nouvelle bougie
    const newCandleElement = document.createElement('div');
    newCandleElement.classList.add('candle');
    
    const isUp = newCandle.close >= newCandle.open;
    newCandleElement.classList.add(isUp ? 'up' : 'down');
    
    const x = (data.length - 1) * (candleWidth + candleGap) + candleGap;
    const y = updatedPriceToY(Math.max(newCandle.open, newCandle.close));
    const height = Math.abs(updatedPriceToY(newCandle.open) - updatedPriceToY(newCandle.close));
    
    newCandleElement.style.left = `${x}px`;
    newCandleElement.style.top = `${y}px`;
    newCandleElement.style.height = `${Math.max(height, 1)}px`;
    newCandleElement.style.opacity = '0';
    
    // Ajouter les mèches
    const topWick = document.createElement('div');
    topWick.classList.add('wick', 'top-wick');
    topWick.style.height = `${Math.abs(updatedPriceToY(newCandle.high) - y)}px`;
    
    const bottomWick = document.createElement('div');
    bottomWick.classList.add('wick', 'bottom-wick');
    bottomWick.style.height = `${Math.abs(updatedPriceToY(newCandle.low) - (y + height))}px`;
    
    newCandleElement.appendChild(topWick);
    newCandleElement.appendChild(bottomWick);
    chartElement.appendChild(newCandleElement);
    
    // Animation d'apparition
    setTimeout(() => {
        newCandleElement.style.opacity = '1';
    }, 50);
    
    // Mettre à jour la ligne de tendance
    const trendLine = chartElement.querySelector('.trend-line');
    if (trendLine) {
        animateTrendLine(trendLine, data, updatedPriceToY, candleWidth, candleGap);
    }
}

// Animer la ligne de tendance
function animateTrendLine(trendLine, data, priceToY, candleWidth, candleGap) {
    // Calculer les points de la ligne de tendance
    const points = [];
    
    data.forEach((candle, i) => {
        const x = i * (candleWidth + candleGap) + candleGap + candleWidth / 2;
        const y = priceToY((candle.open + candle.close) / 2);
        points.push({ x, y });
    });
    
    // Créer le chemin SVG
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        path += ` Q ${points[i - 1].x} ${points[i - 1].y} ${xc} ${yc}`;
    }
    
    // Ajouter le dernier point
    const last = points[points.length - 1];
    path += ` L ${last.x} ${last.y}`;
    
    // Créer l'élément SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    pathElement.setAttribute('fill', 'none');
    pathElement.setAttribute('stroke', 'rgba(0, 102, 204, 0.5)');
    pathElement.setAttribute('stroke-width', '2');
    pathElement.setAttribute('stroke-linecap', 'round');
    pathElement.setAttribute('stroke-linejoin', 'round');
    
    // Animation du tracé
    pathElement.style.strokeDasharray = pathElement.getTotalLength();
    pathElement.style.strokeDashoffset = pathElement.getTotalLength();
    pathElement.style.animation = 'drawPath 2s forwards';
    
    svg.appendChild(pathElement);
    
    // Remplacer l'ancien SVG s'il existe
    while (trendLine.firstChild) {
        trendLine.removeChild(trendLine.firstChild);
    }
    
    trendLine.appendChild(svg);
}

// Créer des particules
function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Taille aléatoire
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position initiale
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Direction aléatoire
        const xDirection = Math.random() * 100 - 50;
        particle.style.setProperty('--x', `${xDirection}px`);
        
        document.body.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

// Animation pour dessiner le chemin
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes drawPath {
    to {
        stroke-dashoffset: 0;
    }
}

.wick {
    position: absolute;
    width: 1px;
    background-color: inherit;
    left: 50%;
    transform: translateX(-50%);
}

.top-wick {
    bottom: 100%;
}

.bottom-wick {
    top: 100%;
}

.trend-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.candle {
    opacity: 0;
    transition: opacity 0.3s ease;
}
</style>
`);