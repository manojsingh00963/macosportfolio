import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 400 },
    title: { min: 400, max: 900, default: 400 }
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ))
}

const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll("span");
    const { min, max } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight) => {
        gsap.to(letter, {
            duration: 0.25,
            ease: 'power3.out',
            fontVariationSettings: `'wght' ${weight}`,
        });
    };

    const handleMouseMove = (e) => {
        const { left: containerLeft } = container.getBoundingClientRect();
        const mouseX = e.clientX - containerLeft;

        letters.forEach((letter) => {
            const { left, width } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (left - containerLeft + width / 2));
            const intensity = Math.exp(-(distance ** 2) / 2000);

            animateLetter(letter, min + (max - min) * intensity);
        });
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
    };
};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const cleanTitle = setupTextHover(titleRef.current, "title");
        const cleanSub = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            cleanTitle?.();
            cleanSub?.();
        };
    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText("Hey, I'm MANic's Welcome to my", "text-3xl font-georama", 100)}
            </p>
            <h1 ref={titleRef}>
                {renderText("Portfolio", "text-9xl italic font-georama")}
            </h1>
        </section>
    );
}

export default Welcome;
