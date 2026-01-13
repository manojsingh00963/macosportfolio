import { WindowControls } from '#components';
import { socials } from '#constants';
import WindowWrapper from '#hoc/windowWrapper';
import React, { useState } from 'react';
import { Phone, Mail, Calendar, Send, CheckCircle2, AlertCircle, BugPlay } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const phoneNumber = "+91 9876543210";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            // It is recommended to use environment variables for these IDs
            await emailjs.send(
                "YOUR_SERVICE_ID", 
                "YOUR_TEMPLATE_ID",
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                },
                "YOUR_PUBLIC_KEY"
            );

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error("EmailJS Error:", err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="window-header border-b border-white/10 pb-2 mb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <WindowControls target="contact" />
                    <h2 className="font-semibold text-sm uppercase tracking-widest opacity-80">
                        Messenger
                    </h2>
                </div>

                <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-[10px] text-green-500 font-bold font-mono">
                        Available
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-2">
                {/* LEFT SECTION */}
                <div className="space-y-6">
                    {/* Profile */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/images/developermanics.png"
                            alt="Manoj Singh"
                            className="w-20 h-20 rounded-2xl border border-white/20 shadow-xl object-cover"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-black">Manoj Singh</h3>
                            <p className="text-gray-400 text-sm font-medium">
                                Full-Stack Developer
                            </p>
                            <p className="text-blue-400 text-xs font-medium mt-1">
                                Available for Freelance
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white/50 border border-white/10 rounded-2xl p-4 space-y-3">
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                            Quick Actions
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600/10 hover:bg-green-600/20 border border-green-500/30 transition-all active:scale-95"
                            >
                                <Phone size={16} className="text-green-400" />
                                <span className="text-sm font-bold text-green-400">Call</span>
                            </a>

                            <a
                                href="https://cal.com/your-username"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 transition-all active:scale-95"
                            >
                                <Calendar size={16} className="text-blue-400" />
                                <span className="text-sm font-bold text-blue-400">Schedule</span>
                            </a>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="flex justify-center flex-wrap gap-3">
                        {socials.map(({ id,  bg, link, icon, text }) => (
                            <a
                                key={id}
                                href={link}
                                style={{backgroundColor:bg}}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={text}
                                className="p-3 rounded bg-black/80 border border-blue hover:border-blue-500/50 hover:bg-blue-500/10 transition-all hover:-translate-y-1"
                            >
                                <img src={icon} alt={text} className="size-5 opacity-70 hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* RIGHT SECTION — EMAIL FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-white/10 p-5 border-double border-2  border-gray-800 backdrop-blur-md"
                >
                    <div className="space-y-4">
                        <input
                            required
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-white/50 border border-gray-900 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none  px-4 py-3 transition-all"
                        />

                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-white/50 border border-gray-900 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none  px-4 py-3 transition-all"
                        />

                        <textarea
                            required
                            name="message"
                            rows="4"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full bg-white/50 border border-gray-900 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none px-4 py-3 resize-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'sending' || status === 'success'}
                        className={`w-full py-4  border-gray-900 cursor-pointer font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            status === 'success'
                                ? 'bg-green-600 text-white cursor-default'
                                : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-400 text-black hover:bg-gray-200 active:scale-[0.98]'
                        } disabled:opacity-80`}
                    >
                        {status === 'idle' && (
                            <>
                                Send Message <Send size={14} />
                            </>
                        )}
                        {status === 'sending' && 'Sending...'}
                        {status === 'success' && (
                            <>
                                Message Sent <CheckCircle2 size={16} />
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                Failed — Try Again <AlertCircle size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </>
    );
};

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;