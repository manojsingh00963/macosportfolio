import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const FONT_WEIGHTS = {
    // Matches the 100 base weight you passed in renderText for subtitle
    subtitle: { min: 100, max: 400, default: 100 }, 
    title: { min: 400, max: 900, default: 400 }
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={`shine-char ${className}`}
            style={{
                fontVariationSettings: `'wght' ${baseWeight}`,
                fontWeight: baseWeight,
                display: 'inline-block' // Ensures transform/background work correctly
            }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};

const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll(".shine-char");
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const rect = letter.getBoundingClientRect();
            const center = rect.left - left + rect.width / 2;
            const distance = Math.abs(mouseX - center);
            
            // Calculate intensity (1 at center, 0 far away)
            const intensity = Math.exp(-(distance ** 2) / 1000); 

            // Animate Weight
            gsap.to(letter, {
                duration: 0.3,
                fontVariationSettings: `'wght' ${min + (max - min) * intensity}`,
                fontWeight: min + (max - min) * intensity,
                ease: "power2.out",
            });

            // Animate Shine (Background Position)
            // Moves the gradient highlight based on mouse position
            gsap.to(letter, {
                backgroundPosition: `${(mouseX - (rect.left - left)) / rect.width * 100}% center`,
                duration: 0.2,
                ease: "power2.out",
            });
        });
    };

    const handleMouseLeave = () => {
        letters.forEach((letter) => {
            gsap.to(letter, {
                duration: 0.5,
                fontWeight: base,
                fontVariationSettings: `'wght' ${base}`,
                backgroundPosition: "0% center", // Reset shine
                ease: "power3.out",
            });
        });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    };
};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const cleanSub = setupTextHover(subtitleRef.current, "subtitle");
        const cleanTitle = setupTextHover(titleRef.current, "title");
        return () => {
            cleanTitle?.();
            cleanSub?.();
        };
    }, []);

    return (
        <section id="welcome" className="  flex flex-col items-center justify-center  text-white">
            {/* if remove the screen class name then keep min-h-screen */}
            <p ref={subtitleRef}>
                {renderText("Hey, I'm Developer MANic's Welcome to my.", "text-3xl font-georama", 100)}
            </p>
            <h1 ref={titleRef}>
                {renderText("Portfolio", "text-9xl italic font-georama", 400)}
            </h1>
        </section>
    );
}

export default Welcome;