import { dockApps } from '#constants';
import { Tooltip } from 'react-tooltip'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useWindowStore from '#store/window.js';

const Dock = () => {
    
    const dockRef = useRef(null);
    const { openWindow, closeWindow, focusWindow, windows } = useWindowStore();

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2.5) / 20000);
                gsap.to(icon, {
                    scale: 1 + 0.2 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power3.out",
                });
            });
        }

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();
            animateIcons(e.clientX - left);
        };

        const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
            scale: 1, y: 0, duration: 0.3, ease: "power1.out"
        }),
        );
        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        };
    }, []);


    const toggleApp = (app) => {
        if (!app.canOpen) return;

        const win = windows?.[app.id];

        if (!win) {
            console.error(`No window found for app id: ${app.id}`);
            return;
        }

        if (win.isOpen) {
            closeWindow(app.id);
        } else {
            openWindow(app.id);
        }

        console.log('Window state:', win);
    };
    


    return (
        <section id="dock">
            <div ref={dockRef} className="dock-container">
                {dockApps.map((app) => (
                    <div key={app.id} className="relative flex justify-center">
                        <button
                            type="button"
                            className="dock-icon"
                            aria-label={app.name}
                            disabled={!app.canOpen}
                            onClick={() => toggleApp(app)}
                        >
                            <img
                                src={`/images/${app.icon}`}
                                alt={app.name}
                                loading="lazy"
                                className={app.canOpen ? "" : "opacity-60"}
                            />
                        </button>
                    </div>
                ))}

                <Tooltip id="dock-tooltip" place="top" className="tooltip" effect="solid" />
            </div>
        </section>
    )
}

export default Dock

// {dockApps.map(({ id, icon, name, canOpen }) => (
//     <div key={id} className="relative flex justify-center" >
//         <button
//             type='button'
//             className='dock-icon'
//             aria-label={name}
//             data-tooltip-id="dock-tooltip"
//             data-tooltip-content={name}
//             data-tooltip-delay-show={150}
//             disabled={!canOpen}
//             onClick={() => toggleApp(id, canOpen)}
//         >
//             <img src={`/images/${icon}`} alt={name} loading="lazy" className={canOpen ? "" : "opacity-60"} />
//         </button>
//     </div>
// ))}