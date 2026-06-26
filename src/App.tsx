import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  ArrowDown,
  ArrowUpRight,
  Menu,
  X,
  MapPin,
  Sparkles,
  Code,
  Layers,
  Cpu,
  Server,
  Terminal,
  Palette,
  Award,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Hourglass,
  Trophy,
  Medal,
  Target,
  Eye,
  Download
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Helper Component for Magnetic CTA button hovers
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = el.getBoundingClientRect();
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <div ref={ref} className="inline-block w-full sm:w-auto">{children}</div>;
}

// Helper Component for 3D card tilt
function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xc = rect.width / 2;
      const yc = rect.height / 2;

      const tiltX = (yc - y) / 15;
      const tiltY = (x - xc) / 20;

      gsap.to(el, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`perspective-container ${className}`} style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}

// Helper Component for Splitting Text character by character
function SplitText({ text, className = '', charClassName = '' }: { text: string; className?: string; charClassName?: string }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIdx) => (
            <span key={charIdx} className="char-mask">
              <span
                className={`char-item ${charClassName}`}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            </span>
          ))}
          {wordIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// Helper Component for Rolling Number stats counters
function RollingCounter({ value, suffix = '', prefix = '', duration = 2 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        setCount(Math.floor(obj.val));
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration]);

  return (
    <span ref={elementRef}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function App() {
  // State variables
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Certificate viewer modal state
  const [activeCertificate, setActiveCertificate] = useState<{
    title: string;
    orgOrEvent: string;
    assets: Array<{
      title: string;
      url: string;
      type: 'image' | 'pdf';
    }>;
    currentIndex: number;
  } | null>(null);

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate contact form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', mobile: '', message: '' });
    }, 1500);
  };


  // References for GSAP
  const mainRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<((value: number, start?: number) => void) | null>(null);
  const yTo = useRef<((value: number, start?: number) => void) | null>(null);
  const xDotTo = useRef<((value: number, start?: number) => void) | null>(null);
  const yDotTo = useRef<((value: number, start?: number) => void) | null>(null);

  // Mouse movement tracking for custom cursor and spotlight glow (DOM direct updates for max performance)
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleMouseMoveSpotlight = (e: MouseEvent) => {
      const spotlight = spotlightRef.current;
      if (spotlight) {
        spotlight.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(99, 102, 241, 0.08), transparent 80%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMoveSpotlight);

    let handleMouseMoveCursor: ((e: MouseEvent) => void) | undefined;
    let handleMouseLeave: (() => void) | undefined;
    let handleMouseEnter: (() => void) | undefined;

    if (!isTouchDevice) {
      const dot = cursorDotRef.current;
      const ring = cursorRingRef.current;
      if (dot && ring) {
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });

        xTo.current = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
        yTo.current = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
        xDotTo.current = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
        yDotTo.current = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });

        let hasFiredMove = false;

        handleMouseMoveCursor = (e: MouseEvent) => {
          if (!hasFiredMove) {
            gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
            hasFiredMove = true;
          }
          if (xDotTo.current) xDotTo.current(e.clientX);
          if (yDotTo.current) yDotTo.current(e.clientY);
          if (xTo.current) xTo.current(e.clientX);
          if (yTo.current) yTo.current(e.clientY);

          // Detect hover states for interactive elements
          const target = e.target as HTMLElement;
          if (target) {
            const isLinkOrButton = target.closest('button, a, input, textarea, [role="button"]');
            const isCard = target.closest('.glass-panel, img, .perspective-container');

            if (isLinkOrButton) {
              ring.classList.add('cursor-hover');
              ring.classList.remove('cursor-card-hover');
            } else if (isCard) {
              ring.classList.add('cursor-card-hover');
              ring.classList.remove('cursor-hover');
            } else {
              ring.classList.remove('cursor-hover', 'cursor-card-hover');
            }
          }
        };

        handleMouseLeave = () => {
          gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
          hasFiredMove = false;
        };

        handleMouseEnter = () => {
          gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        };

        window.addEventListener('mousemove', handleMouseMoveCursor);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveSpotlight);
      if (handleMouseMoveCursor) window.removeEventListener('mousemove', handleMouseMoveCursor);
      if (handleMouseLeave) document.removeEventListener('mouseleave', handleMouseLeave);
      if (handleMouseEnter) document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Section highlight on scroll
  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'achievements', 'certifications', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Animations setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance sequences
      const heroTl = gsap.timeline();

      // Step 1: Background grid and orbs fade in
      heroTl.fromTo(['.bg-grid-pattern', '.bg-orb'],
        { opacity: 0 },
        {
          opacity: (_, el) => el.classList.contains('bg-grid-pattern') ? 0.4 : 1,
          duration: 1.5,
          ease: 'power2.out'
        }
      );

      // Step 1.5: Greeting fade-in
      heroTl.fromTo('.hero-greeting',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=1.2'
      );

      // Step 2: Name reveals (using vertical translate reveal on spans)
      heroTl.fromTo('.hero-name-char',
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, stagger: 0.02, ease: 'power4.out' },
        '-=0.4'
      );

      // Step 2b: Underline line animation
      heroTl.to('.hero-underline',
        { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
        '-=0.3'
      );

      // Step 3: Role/tagline slide up character-by-character
      heroTl.fromTo('.hero-tagline-char',
        { yPercent: 100 },
        { yPercent: 0, duration: 0.4, stagger: 0.015, ease: 'power3.out' },
        '-=0.4'
      );

      // Step 4: Tagline description fade & shift up
      heroTl.fromTo('.hero-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );

      // Step 5: CTA buttons float in
      heroTl.fromTo('.hero-ctas-wrapper',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );

      // Avatar Card animation
      heroTl.fromTo('.hero-avatar-card',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.2)' },
        '-=0.8'
      );

      // Gentle floating animation loop for CTAs wrapper after entry completes
      heroTl.add(() => {
        gsap.to('.hero-ctas-wrapper', {
          y: -6,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // Scroll triggered reveals for generic elements
      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((sec) => {
        gsap.fromTo(sec,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });

      // Skills cards ScrollTrigger stagger
      gsap.fromTo('.skills-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );

      // Project cards ScrollTrigger reveal and scale
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });

      // Experience timeline vertical drawing line
      gsap.fromTo('.experience-draw-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: '.experience-timeline-container',
            start: 'top 65%',
            end: 'bottom 65%',
            scrub: true,
          }
        }
      );

      // Experience item details scroll entry
      gsap.utils.toArray<HTMLElement>('.timeline-reveal').forEach((item) => {
        gsap.fromTo(item,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );
      });

      // Education card dynamic meter fill
      gsap.utils.toArray<HTMLElement>('.edu-fill-meter').forEach((bar) => {
        const val = bar.getAttribute('data-value') || '0%';
        gsap.fromTo(bar,
          { width: '0%' },
          {
            width: val,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
            }
          }
        );
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Nav links configuration
  const navLinks = [
    { label: 'About Me', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Experience', id: 'experience' },
    { label: 'Education', id: 'education' },
    { label: 'Projects', id: 'projects' },
    { label: 'Achievements', id: 'achievements' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Contact', id: 'contact' },
  ];

  // Projects configuration data structure
  const projectsData = [
    {
      id: 'campus-hyper-brain',
      featured: true,
      status: 'In Progress',
      statusType: 'saas',
      title: 'Campus Hyper Brain',
      subtitle: 'Solo Developer | Google TechSprint Finalist',
      desc: 'An AI study platform that converts college syllabi into structured study guides. Built a custom AI tutor interface using the Gemini API to help students test themselves on specific topics.',
      tech: ['React', 'Gemini API', 'Tailwind CSS', 'TypeScript'],
      github: 'https://github.com/Aditya1708-tech/campus-hyper-brain',
      live: null,
      mockup: (
        <div className="bg-[#0b0f19] border border-white/5 rounded-2xl p-4 md:p-6 h-60 flex flex-col justify-between overflow-hidden relative shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-1.5"><Sparkles size={10} className="text-cyan-400" /> campus-hyper-brain.ai</span>
            <span className="text-indigo-400 font-bold">Finalist Node</span>
          </div>

          <div className="my-2 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs text-gray-300 shadow-inner">
            <span>Tell me about Quicksort optimization</span>
            <button className="px-3 py-1 rounded-lg bg-indigo-600 text-[10px] text-white font-bold shadow-md shadow-indigo-600/30">Ask AI</button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <p className="font-bold text-gray-200">Syllabus Breakdown</p>
              <p className="text-gray-500 mt-1">4 core modules parsed</p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <p className="font-bold text-gray-200">AI Tutor Active</p>
              <p className="text-gray-500 mt-1">Interactive chatbot session</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bitexpress',
      featured: false,
      status: 'Completed',
      statusType: 'completed',
      title: 'BiteXpress',
      subtitle: '',
      desc: 'A food delivery platform supporting multiple restaurants. Built a dynamic cart system, coupon validation rules, and simulated checkout flow.',
      tech: ['React', 'JavaScript', 'REST APIs', 'CSS3'],
      github: 'https://github.com/Aditya1708-tech/BiteXpress',
      live: 'https://aditya1708-tech.github.io/BiteXpress/',
      mockup: (
        <div className="bg-[#0b0f19] border border-white/5 rounded-2xl p-4 h-48 flex flex-col justify-between overflow-hidden shadow-xl">
          <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-white/5 pb-2">
            <span>BiteXpress Food Cart</span>
            <span className="text-cyan-400 font-bold">3 items</span>
          </div>

          <div className="space-y-2 my-2 text-xs">
            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-gray-300">Spicy Miso Ramen</span>
              <span className="text-cyan-400 font-bold">$14.50</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-gray-300">Taro Milk Boba</span>
              <span className="text-cyan-400 font-bold">$5.75</span>
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-bold border-t border-white/5 pt-2 text-gray-300">
            <span>Subtotal (Promo applied)</span>
            <span className="text-emerald-400">$18.22</span>
          </div>
        </div>
      )
    },
    {
      id: 'to-do-list',
      featured: false,
      status: 'Completed',
      statusType: 'completed',
      title: 'To-Do List App',
      subtitle: '',
      desc: 'A simple productivity dashboard. Focused on clean semantic HTML and responsive layouts, deployed on Vercel.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Vercel'],
      github: 'https://github.com/Aditya1708-tech/To-Do-List',
      live: 'https://to-do-list-seven-gules-74.vercel.app/',
      mockup: (
        <div className="bg-[#0b0f19] border border-white/5 rounded-2xl p-4 h-48 flex flex-col justify-between overflow-hidden shadow-xl">
          <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-white/5 pb-2">
            <span>Productivity Board</span>
            <span className="text-emerald-400 font-bold">66% Completed</span>
          </div>

          <div className="space-y-2 my-2 text-xs">
            <div className="flex items-center gap-2 text-gray-500 line-through">
              <div className="w-4 h-4 rounded border border-indigo-500 bg-indigo-500/20 flex items-center justify-center text-[9px] text-indigo-400">✓</div>
              <span>Deploy portfolio on Vercel</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 line-through">
              <div className="w-4 h-4 rounded border border-indigo-500 bg-indigo-500/20 flex items-center justify-center text-[9px] text-indigo-400">✓</div>
              <span>Write structured syllabus parser</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-4 h-4 rounded border border-white/20" />
              <span>Implement user authentication</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'calculator',
      featured: false,
      status: 'Completed',
      statusType: 'completed',
      title: 'Calculator App',
      subtitle: '',
      desc: 'A responsive glassmorphic calculator supporting full arithmetic operations and keyboard input shortcuts.',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      github: 'https://github.com/Aditya1708-tech/Calculator-New',
      live: 'https://aditya1708-tech.github.io/Calculator-New/',
      mockup: (
        <div className="bg-[#0b0f19] border border-white/5 rounded-2xl p-4 h-48 flex flex-col justify-between overflow-hidden shadow-xl text-xs">
          <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-white/5 pb-2">
            <span>Standard Calculator</span>
            <span className="text-purple-400 font-bold">Active</span>
          </div>

          <div className="text-right py-2 bg-white/5 rounded px-2 border border-white/5 font-mono w-full">
            <div className="text-[10px] text-gray-500">12.5 * 8</div>
            <div className="text-sm font-bold text-gray-200">100</div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center font-bold text-[10px] text-gray-400 w-full mt-2">
            <div className="p-1 rounded bg-white/5 border border-white/5 text-purple-400">C</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">/</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">*</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">-</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">7</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">8</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">9</div>
            <div className="p-1 rounded bg-indigo-600 text-white font-extrabold row-span-2 flex items-center justify-center">+</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">4</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">5</div>
            <div className="p-1 rounded bg-white/5 border border-white/5">6</div>
          </div>
        </div>
      )
    }
  ];

  // Experiences configuration data structure
  const experienceData = [
    {
      id: 'skillnexis',
      role: 'Full Stack Developer Intern',
      company: 'SkillNexis',
      location: 'Remote',
      period: 'Jun 2026 – Present',
      current: true,
      desc: 'Building full-stack web applications using React, Next.js, Node.js, and MongoDB during my developer internship.',
      highlights: [
        'Developed scalable components and user interfaces using React and Next.js',
        'Integrated REST APIs and worked with MongoDB schemas',
        'Participated in active team sprints and daily syncs'
      ],
      tech: ['React', 'Next.js', 'Node.js', 'MongoDB', 'REST APIs'],
      icon: <Server className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'flyrank-ai',
      role: 'Frontend Engineering Intern',
      company: 'FlyRank AI',
      location: 'Remote',
      period: 'Jun 2026 – Present',
      current: true,
      desc: 'Contributing to frontend workflows and user interface development for AI web applications.',
      highlights: [
        'Built responsive web interfaces using React and Tailwind CSS',
        'Collaborated with design and engineering teams to refine layouts'
      ],
      tech: ['React', 'Tailwind CSS', 'UI Development'],
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'apexplanet',
      role: 'Web Development Intern',
      company: 'ApexPlanet Software Pvt Ltd',
      location: 'Virtual',
      period: 'Aug 2025 – Oct 2025',
      current: false,
      desc: 'Completed a frontend web development internship focused on responsive designs and client applications.',
      highlights: [
        'Built responsive layouts using HTML5, CSS3, and JavaScript',
        'Tested and documented web APIs and user flows'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', 'Web APIs'],
      icon: <Code className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <div ref={mainRef} className="relative min-h-screen text-gray-100 overflow-hidden bg-[#030712]">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40" />

      {/* Drifting Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orb bg-orb-1 pointer-events-none z-0 rounded-full" />
      <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-orb bg-orb-2 pointer-events-none z-0 rounded-full" />

      {/* Interactive spotlight backglow following cursor (direct DOM update) */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(600px circle at -300px -300px, rgba(99, 102, 241, 0.08), transparent 80%)'
        }}
      />

      {/* Custom Trailing Cursor Follower */}
      <div ref={cursorDotRef} className="cursor-dot hidden md:block" />
      <div ref={cursorRingRef} className="cursor-ring hidden md:block" />

      {/* Glass Sticky Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('home')}
            className="text-xl font-extrabold tracking-tight text-gradient hover:opacity-85 transition-opacity"
          >
            Aditya Pawar
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`relative py-1 font-medium text-sm transition-colors duration-200 hover:text-white ${activeSection === link.id ? 'text-white font-semibold' : 'text-gray-400'
                  }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Contact Button Desktop */}
          <div className="hidden md:block">
            <Magnetic>
              <button
                onClick={() => scrollTo('contact')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-indigo-400 transition-all duration-200"
              >
                Get in touch
              </button>
            </Magnetic>
          </div>

          {/* Mobile menu triggers */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[65px] left-0 w-full bg-[#030712]/95 border-b border-white/5 backdrop-blur-lg flex flex-col p-6 gap-4 md:hidden"
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-left py-2 font-semibold text-lg transition-colors ${activeSection === link.id ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('contact')}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-center"
              >
                Get In Touch
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Core Pages Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20">

        {/* ================= HERO SECTION ================= */}
        <section id="home" className="min-h-[85vh] flex flex-col md:flex-row items-center justify-between gap-12 py-12 md:py-24 text-left">

          {/* Details (Left Column) */}
          <div className="flex-1 max-w-2xl order-2 md:order-1">
            <div className="overflow-hidden mb-3">
              <h4 className="hero-greeting text-xs md:text-sm font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Code size={14} /> BCA Student &amp; Developer
              </h4>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              <div className="overflow-hidden py-1">
                <SplitText text="Hi, I'm Aditya Pawar" className="hero-name-chars block text-gray-100" charClassName="hero-name-char" />
              </div>
              <div className="relative mt-2 overflow-hidden py-2">
                <SplitText text="I build things for the web" className="hero-tagline-chars block" charClassName="hero-tagline-char text-gradient" />
                {/* Accent Underline */}
                <div className="hero-underline absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full w-full origin-left scale-x-0" />
              </div>
            </h1>

            <p className="hero-desc text-gray-400 text-base md:text-lg mb-4 leading-relaxed text-justify opacity-0">
              I'm a BCA student at IMR, Jalgaon. I build web applications, explore AI models, and work on frontend and backend projects.
            </p>

            <div className="hero-desc flex items-center gap-2 text-xs text-gray-500 mb-8 opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Currently learning Next.js &amp; fueled by green tea</span>
            </div>

            <div className="hero-ctas-wrapper inline-block w-full">
              <div className="hero-ctas flex flex-col sm:flex-row gap-4 opacity-0">
                <Magnetic>
                  <button
                    onClick={() => scrollTo('projects')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white flex items-center justify-center gap-2 group transition-all cursor-pointer"
                  >
                    View My Projects
                    <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                  </button>
                </Magnetic>

                <Magnetic>
                  <button
                    onClick={() => scrollTo('about')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
                  >
                    Read My Story
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Image (Right Column) */}
          <div className="hero-avatar-card flex justify-center md:justify-end order-1 md:order-2 flex-shrink-0 relative">
            {/* Soft Ambient Outer Glow behind the card */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />

            <div className="relative w-72 h-72 md:w-[330px] md:h-[330px] overflow-hidden rounded-3xl glass-panel border border-white/10 z-10">
              {/* Premium Glow Aura Behind Image inside the card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/10 opacity-60 z-0 pointer-events-none" />

              <img
                src="/aditya pawar.png?v=3"
                alt="Aditya Dnyaneshwar Pawar"
                className="w-full h-full object-contain object-bottom transition-transform duration-700 hover:scale-[1.03] z-10 relative"
              />
            </div>
          </div>

        </section>


        {/* ================= ABOUT STORY SECTION ================= */}
        <section id="about" className="reveal-section py-20 border-t border-white/5">
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">01 / Profile</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">A bit about me</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Info panel / Sidebar info */}
            <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center gap-3.5 text-gray-300 text-sm">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <MapPin size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Location</p>
                  <p className="font-semibold text-gray-200">Jalgaon, Maharashtra</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-gray-300 text-sm">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <GraduationCap size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Education</p>
                  <p className="font-semibold text-gray-200 text-xs sm:text-sm">BCA Student at IMR</p>
                </div>
              </div>
            </div>

            {/* In-depth content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-2xl p-8 shadow-xl">
                <h4 className="text-xl font-bold text-gray-100 mb-4 leading-snug">
                  BCA Student &amp; Aspiring Full-Stack Developer
                </h4>
                <div className="text-gray-400 space-y-4 text-justify leading-relaxed text-sm md:text-base">
                  <p>
                    I'm a computer applications student at IMR, Jalgaon, focused on building practical web applications. What started as basic coding assignments quickly turned into a passion for full-stack web development and exploring AI capabilities.
                  </p>
                  <p>
                    My biggest milestone so far has been building <strong>Campus Hyper Brain</strong>—an AI study tool that parses college syllabi into structured prep guides. Working on this solo project pushed me to learn the Gemini API, handle custom user inputs, and manage a complete product lifecycle. It was incredibly rewarding to see it reach the top 10 nationwide in Google's TechSprint challenge.
                  </p>
                  <p>
                    Currently, I'm gaining hands-on experience through internships at SkillNexis and FlyRank AI, where I work with React, Next.js, and MongoDB. I enjoy solving real problems with clean code and building user-focused tools.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ================= SKILLS SECTION ================= */}
        <section id="skills" className="py-20 border-t border-white/5">
          <div className="reveal-section mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">02 / Skills</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">Technologies I use</h3>
            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed text-sm">
              A list of tools, programming languages, and frameworks I've worked with in my projects and internships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Frontend',
                icon: <Layers className="w-5 h-5 text-cyan-400" />,
                skills: [
                  { name: 'HTML5', level: '95%' },
                  { name: 'CSS3', level: '90%' },
                  { name: 'JavaScript (ES6+)', level: '88%' },
                  { name: 'React', level: '85%' },
                ],
              },
              {
                title: 'Programming',
                icon: <Cpu className="w-5 h-5 text-purple-400" />,
                skills: [
                  { name: 'C', level: '75%' },
                  { name: 'C++', level: '80%' },
                  { name: 'Python', level: '78%' },
                ],
              },
              {
                title: 'Backend & APIs',
                icon: <Server className="w-5 h-5 text-indigo-400" />,
                skills: [
                  { name: 'REST APIs', level: '82%' },
                  { name: 'Gemini API', level: '85%' },
                ],
              },
              {
                title: 'Design',
                icon: <Palette className="w-5 h-5 text-pink-400" />,
                skills: [
                  { name: 'UI/UX', level: '80%' },
                  { name: 'Responsive Design', level: '95%' },
                  { name: 'Figma', level: '75%' },
                ],
              },
              {
                title: 'Tools & Platforms',
                icon: <Terminal className="w-5 h-5 text-emerald-400" />,
                skills: [
                  { name: 'Git', level: '85%' },
                  { name: 'GitHub', level: '90%' },
                  { name: 'VS Code', level: '95%' },
                  { name: 'Vercel', level: '80%' },
                  { name: 'GitHub Pages', level: '85%' },
                  { name: 'Flutter', level: '70%' },
                ],
                fullWidth: true,
              }
            ].map((category, idx) => (
              <div
                key={idx}
                className={`skills-card gsap-reveal glass-panel rounded-2xl p-6 hover:border-indigo-500/20 hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 ${category.fullWidth ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    {category.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-100">{category.title}</h4>
                </div>
                <div className="space-y-4">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-gray-300">
                        <span>{skill.name}</span>
                        <span className="text-cyan-400 font-bold">{skill.level}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="edu-fill-meter h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                          data-value={skill.level}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= EXPERIENCE TIMELINE ================= */}
        <section id="experience" className="reveal-section py-20 border-t border-white/5">
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">03 / Internships</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">Where I've worked</h3>
            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed text-sm">
              Hands-on developer internships where I helped build user interfaces and API integrations.
            </p>
          </div>

          <div className="max-w-4xl relative">
            <div className="experience-timeline-container relative pl-8 md:pl-12 py-2">

              {/* Scroll drawing line */}
              <div className="absolute left-[7px] md:left-[19px] top-0 bottom-0 w-[2px] bg-white/5">
                <div className="experience-draw-line w-full h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 rounded-full scale-y-0" />
              </div>

              {/* Timeline Items */}
              <div className="space-y-12">
                {experienceData.map((exp) => (
                  <div key={exp.id} className="timeline-reveal relative group">
                    {/* Glowing timeline node */}
                    <div className={`absolute -left-[31px] md:-left-[23px] top-2.5 w-4 h-4 rounded-full border-2 border-[#030712] shadow-lg transition-all duration-300 group-hover:scale-125 z-10 ${exp.current
                        ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                        : 'bg-indigo-500'
                      }`} />

                    {/* Premium Card layout */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={`glass-panel rounded-2xl p-6 md:p-8 hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all duration-300 relative ${exp.current ? 'border-emerald-500/10' : ''
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                        <div className="flex gap-3.5 items-center">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                            {exp.icon}
                          </div>
                          <div>
                            <h4 className="text-lg md:text-xl font-bold text-gray-100 flex items-center gap-2">
                              {exp.role}
                            </h4>
                            <p className="text-indigo-400 text-sm font-semibold mt-0.5">{exp.company}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3.5 py-1 text-xs font-bold text-gray-400 bg-white/5 rounded-full border border-white/5 whitespace-nowrap">
                            {exp.period}
                          </span>
                          {exp.current && (
                            <span className="px-3.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/25 whitespace-nowrap animate-pulse flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Current
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed text-justify mb-4">
                        {exp.desc}
                      </p>

                      <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-400 mb-6">
                        {exp.highlights.map((highlight, hIdx) => (
                          <li key={hIdx}>{highlight}</li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {exp.tech.map((t) => (
                          <span key={t} className="px-2.5 py-0.5 text-[10px] font-semibold text-gray-300 bg-white/5 rounded-full border border-white/5 hover:border-indigo-500/30 transition-colors">
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ================= EDUCATION CARDS SECTION ================= */}
        <section id="education" className="reveal-section py-20 border-t border-white/5">
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">04 / Education</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">Academic Path</h3>
            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed text-sm">
              My current and previous academic credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* BCA */}
            <motion.div
              whileHover={{ y: -6 }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all duration-300 md:col-span-2 lg:col-span-2"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-100">BCA (Bachelor of Computer Applications)</h4>
                    <p className="text-indigo-400 text-sm font-medium mt-1">Institute of Management And Research, Jalgaon</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500/10 border border-indigo-500/25 rounded-full text-indigo-400 whitespace-nowrap">
                    2024 - Present
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mt-4">
                  Studying database management systems, data structures, object-oriented programming, and web development fundamentals.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Current Status</span>
                  <span className="font-semibold text-cyan-400">Ongoing</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="edu-fill-meter h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    data-value="100%"
                  />
                </div>
              </div>
            </motion.div>

            {/* HSC */}
            <motion.div
              whileHover={{ y: -6 }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all duration-300 md:col-span-1 lg:col-span-1"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-100">HSC (12th Grade)</h4>
                    <p className="text-purple-400 text-xs font-medium mt-1">Moolji Jaitha College, Jalgaon</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 font-bold bg-purple-500/10 border border-purple-500/25 rounded-full text-purple-400 whitespace-nowrap">
                    2023 - 2024
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Final Score</span>
                  <span className="font-bold text-purple-400">86.0%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="edu-fill-meter h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    data-value="86%"
                  />
                </div>
              </div>
            </motion.div>

            {/* SSC */}
            <motion.div
              whileHover={{ y: -6 }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all duration-300 md:col-span-2 lg:col-span-1"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-100">SSC (10th Grade)</h4>
                    <p className="text-cyan-400 text-xs font-medium mt-1">Kendriya Vidyalaya, Jalgaon</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 font-bold bg-cyan-500/10 border border-cyan-500/25 rounded-full text-cyan-400 whitespace-nowrap">
                    2021 - 2022
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Final Score</span>
                  <span className="font-bold text-cyan-400">79.4%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="edu-fill-meter h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    data-value="79.4%"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ================= PROJECTS SECTION ================= */}
        <section id="projects" className="py-20 border-t border-white/5">
          <div className="reveal-section mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">05 / Projects</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">Projects I've built</h3>
            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed text-sm">
              A collection of web apps I built to practice different frontend and backend technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectsData.map((project) => (
              <Tilt key={project.id} className={project.featured ? 'md:col-span-2' : ''}>
                <div
                  className="project-card gsap-reveal glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-indigo-500/25 transition-all duration-300 gap-6 w-full h-full"
                >
                  <div className={`${project.featured ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-center' : 'flex flex-col gap-6'}`}>

                    {/* Left Column Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {project.featured ? (
                          <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase">Featured Project</span>
                        ) : (
                          <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">Project</span>
                        )}

                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 ${project.statusType === 'saas'
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                          }`}>
                          {project.statusType === 'saas' ? <Hourglass size={10} /> : <CheckCircle2 size={10} />}
                          {project.status}
                        </span>
                      </div>

                      <h4 className="text-2xl md:text-3xl font-extrabold text-gray-100 group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h4>

                      {project.subtitle && (
                        <p className="text-xs font-semibold text-indigo-400">
                          {project.subtitle}
                        </p>
                      )}

                      <p className="text-gray-400 text-sm leading-relaxed text-justify">
                        {project.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tech.map((t) => (
                          <span key={t} className="px-2.5 py-0.5 text-[10px] font-semibold text-gray-300 bg-white/5 rounded-full border border-white/5">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Desktop Button Actions inside layout for featured card */}
                      {project.featured && (
                        <div className="hidden lg:flex flex-wrap items-center gap-4 pt-4">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-indigo-500/40 bg-white/5 hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-300 cursor-pointer"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                              Repository
                            </a>
                          )}

                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all duration-300 cursor-pointer"
                            >
                              <ExternalLink size={15} />
                              Live Preview
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Preview Mockup */}
                    <div>
                      {project.mockup}
                    </div>

                  </div>

                  {/* Mobile Button Actions (always shown at the bottom of the card for normal cards, and for featured cards on smaller screens) */}
                  <div className={`flex flex-wrap items-center gap-4 pt-4 border-t border-white/5 ${project.featured ? 'lg:hidden' : ''}`}>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-indigo-500/40 bg-white/5 hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-300 cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                        Repository
                      </a>
                    )}

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all duration-300 cursor-pointer"
                      >
                        <ExternalLink size={15} />
                        Live Preview
                      </a>
                    )}
                  </div>

                </div>
              </Tilt>
            ))}
          </div>
        </section>

        {/* ================= ACHIEVEMENTS & HACKATHONS SECTION ================= */}
        <section id="achievements" className="py-20 border-t border-white/5">
          <div className="reveal-section mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">06 / Highlights</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">Achievements &amp; Hackathons</h3>
            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed text-sm">
              Events and milestones I've participated in outside of college classes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Achievement: Build with Google TechSprint (spans 2 columns on large screens) */}
            <Tilt className="lg:col-span-2">
              <div className="glass-panel rounded-3xl p-8 border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300 h-full">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
                        <Trophy size={12} /> Featured Achievement
                      </span>
                      <span className="px-2.5 py-1 text-xs font-semibold text-gray-300 bg-white/5 rounded-full border border-white/5">
                        National Finalist
                      </span>
                    </div>

                    <h4 className="text-2xl md:text-3xl font-extrabold text-gray-100 group-hover:text-amber-400 transition-colors">
                      Build with Google TechSprint
                    </h4>
                    <p className="text-sm font-bold text-amber-500/80">
                      Top 10 Nationwide Finalist | Solo Developer
                    </p>

                    <p className="text-gray-400 text-sm leading-relaxed text-justify">
                      Built the <strong>Campus Hyper Brain</strong> study platform as a solo developer and placed in the top 10 nationwide in Google's TechSprint hackathon. Designed the tool to automatically parse university syllabi and generate customized study aids using Gemini API models.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Google TechSprint', 'Gemini API', 'Solo Run', 'Top 10 National'].map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 bg-amber-500/5 rounded-full border border-amber-500/10">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setActiveCertificate({
                          title: 'Build with Google TechSprint',
                          orgOrEvent: 'Google Developer Challenge',
                          assets: [
                            { title: 'Finalist Certificate', url: '/certificates/Build With Google/top 10 certificate.jpg', type: 'image' },
                            { title: 'Finalist Certificate (PDF)', url: '/certificates/Build With Google/top 10 certificate.pdf', type: 'pdf' },
                            { title: 'Team Showcase', url: '/certificates/Build With Google/top 10 teams.jpeg', type: 'image' }
                          ],
                          currentIndex: 0
                        })}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 border border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300 cursor-pointer"
                      >
                        <Eye size={14} />
                        View Certificates
                      </button>
                    </div>
                  </div>

                  <div className="flex-shrink-0 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400 self-start md:self-center">
                    <Trophy size={48} className="animate-pulse" />
                  </div>
                </div>
              </div>
            </Tilt>

            {/* Sidebar / Stats Counters */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Achievement stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel rounded-2xl p-4 text-center">
                  <p className="text-3xl font-extrabold text-gradient">
                    <RollingCounter value={100} suffix="s" />
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-wider">Teams Competed</p>
                </div>
                <div className="glass-panel rounded-2xl p-4 text-center">
                  <p className="text-3xl font-extrabold text-gradient">
                    <RollingCounter prefix="Top " value={10} />
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-wider">National Finalist</p>
                </div>
              </div>

              {/* Google Arcade Reward Badge Card */}
              <Tilt>
                <div className="glass-panel rounded-2xl p-5 border border-indigo-500/10 hover:border-indigo-500/20 transition-all flex items-center gap-4 h-full">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Medal size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-200 text-sm">Google Arcade 2025</h5>
                    <p className="text-xs text-gray-400 mt-1">Earned Google Arcade Trooper rewards through developer challenge labs.</p>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* Timeline/Cards hybrid for secondary achievements (spans all 3 columns) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

              {/* Explore & Evolve */}
              <Tilt>
                <div className="glass-panel rounded-2xl p-6 hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/25 rounded text-indigo-400 uppercase">
                        Finalist
                      </span>
                      <span className="text-xs font-semibold text-gray-500">Team CodeStrix</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-200">Explore &amp; Evolve Hackathon</h4>
                    <p className="text-xs text-indigo-400 font-semibold mt-1">Lead Presenter</p>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed text-justify">
                      Lead presenter for team CodeStrix, pitching our project to a panel of judges and securing a finalist spot in the hackathon.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-6 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                      <Target size={12} className="text-indigo-400" /> Pitch &amp; Presentation
                    </div>
                    <button
                      onClick={() => setActiveCertificate({
                        title: 'Explore & Evolve Hackathon',
                        orgOrEvent: 'IEEE CS CU & Christ University',
                        assets: [
                          { title: 'Presentation Certificate', url: '/certificates/IEEE/ieee certificate.jpg', type: 'image' },
                          { title: 'Participation Certificate', url: '/certificates/IEEE/44.png', type: 'image' },
                          { title: 'Appreciation Certificate', url: '/certificates/IEEE/ieee.jpg', type: 'image' },
                          { title: 'Hackathon Badge', url: '/certificates/IEEE/ieee badge.jpg', type: 'image' }
                        ],
                        currentIndex: 0
                      })}
                      className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-indigo-400 transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  </div>
                </div>
              </Tilt>

              {/* AINCAT 2025 */}
              <Tilt>
                <div className="glass-panel rounded-2xl p-6 hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/25 rounded text-cyan-400 uppercase">
                        Landmark
                      </span>
                      <span className="text-xs font-semibold text-gray-500">Assessment</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-200">AINCAT 2025</h4>
                    <p className="text-xs text-cyan-400 font-semibold mt-1">Academic &amp; Tech Aptitude</p>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed text-justify">
                      Passed the AINCAT technical assessment, demonstrating analytical skills and understanding of core computer science fundamentals.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-6 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                      <Target size={12} className="text-cyan-400" /> Score verified
                    </div>
                    <button
                      onClick={() => setActiveCertificate({
                        title: 'AINCAT 2025 Assessment',
                        orgOrEvent: 'AINCAT',
                        assets: [
                          { title: 'Score Card & Certificate', url: '/certificates/aincat_page-0001.jpg', type: 'image' }
                        ],
                        currentIndex: 0
                      })}
                      className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 text-cyan-400 transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  </div>
                </div>
              </Tilt>

              {/* Young Turks 2025 */}
              <Tilt>
                <div className="glass-panel rounded-2xl p-6 hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/25 rounded text-emerald-400 uppercase">
                        Awardee
                      </span>
                      <span className="text-xs font-semibold text-gray-500">Recognition</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-200">Young Turks 2025</h4>
                    <p className="text-xs text-emerald-400 font-semibold mt-1">Emerging Developer Talent</p>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed text-justify">
                      Selected for the developer cohort recognizing software engineering potential and coding talent among college students.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-6 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                      <Target size={12} className="text-emerald-400" /> Young Talent cohort
                    </div>
                    <button
                      onClick={() => setActiveCertificate({
                        title: 'Young Turks 2025 Cohort',
                        orgOrEvent: 'Young Turks Program',
                        assets: [
                          { title: 'Cohort Recognition', url: '/certificates/young turks_page-0001.jpg', type: 'image' }
                        ],
                        currentIndex: 0
                      })}
                      className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-400 transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  </div>
                </div>
              </Tilt>

            </div>

          </div>
        </section>

        {/* ================= CERTIFICATIONS SECTION ================= */}
        <section id="certifications" className="py-20 border-t border-white/5">
          <div className="reveal-section mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">07 / Certificates</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">Certifications</h3>
            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed text-sm">
              Coursework and simulations I've completed to learn new technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Technology Job Simulation',
                org: 'Deloitte',
                badge: <Briefcase className="w-6 h-6 text-purple-400" />,
                desc: 'Completed simulated tasks in software engineering, cloud configurations, and security audits.',
                verifyUrl: 'https://www.theforage.com/simulations/deloitte-global/technology-gcgo',
                certUrl: '/certificates/deloitte-job-simulation.jpg'
              },
              {
                title: 'Cybersecurity Analyst Job Simulation',
                org: 'Tata Group',
                badge: <Award className="w-6 h-6 text-indigo-400" />,
                desc: 'Completed simulated security analyst exercises, reviewing configurations and tracking security incidents.',
                verifyUrl: 'https://www.theforage.com/simulations/tata/cybersecurity-analyst-otwo',
                certUrl: '/certificates/cyber_security_certificate-1.jpg'
              },
              {
                title: 'Frontend Web Development',
                org: 'Reliance Foundation',
                badge: <Layers className="w-6 h-6 text-cyan-400" />,
                desc: 'Completed frontend training focusing on HTML/CSS structure, responsive design, and DOM manipulation.',
                verifyUrl: '#',
                certUrl: '/certificates/front-end-reliance.jpg'
              },
              {
                title: 'JavaScript Programming',
                org: 'Infosys Springboard',
                badge: <Code className="w-6 h-6 text-emerald-400" />,
                desc: 'Completed coursework covering standard JavaScript scopes, asynchronous execution, and basic API requests.',
                verifyUrl: '#',
                certUrl: '/certificates/javascript-infosys-1.jpg'
              }
            ].map((cert, cIdx) => (
              <Tilt key={cIdx}>
                <div
                  className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-indigo-500/5 transition-all duration-300 h-full"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        {cert.badge}
                      </div>
                      <span className="px-3 py-1 text-xs font-bold bg-white/5 border border-white/5 rounded-full text-gray-300">
                        {cert.org}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
                        {cert.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-2 leading-relaxed text-justify font-sans">
                        {cert.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-3">
                    <button
                      onClick={() => setActiveCertificate({
                        title: cert.title,
                        orgOrEvent: cert.org,
                        assets: [{ title: 'Certificate', url: cert.certUrl, type: 'image' }],
                        currentIndex: 0
                      })}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye size={12} />
                      View
                    </button>
                    {cert.verifyUrl !== '#' && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-indigo-400 transition-all duration-200 cursor-pointer"
                      >
                        Verify
                      </a>
                    )}
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </section>

        {/* ================= CONTACT FORM SECTION ================= */}
        <section id="contact" className="reveal-section py-20 border-t border-white/5">
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">08 / Contact</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">Get in touch</h3>
            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed text-sm">
              Have a question or want to work together? Drop a message below or send me an email.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Sidebar contact info */}
            <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Direct Mail</p>
                <a
                  href="mailto:pawaraditya1383@gmail.com"
                  className="inline-flex items-center gap-2.5 text-sm text-gray-400 hover:text-indigo-400 transition-colors break-all"
                >
                  <Mail size={16} className="text-indigo-400" />
                  <span>pawaraditya1383@gmail.com</span>
                </a>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Location</p>
                <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <MapPin size={16} className="text-indigo-400" />
                  <span>Jalgaon, Maharashtra, India</span>
                </div>
              </div>
            </div>

            {/* Glassmorphic Contact Card */}
            <div className="lg:col-span-2">
              <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-2xl relative min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="contact-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSubmit}
                      className="space-y-6 w-full"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Name</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your Name"
                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="name@example.com"
                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Mobile Number</label>
                        <input
                          type="number"
                          name="mobile"
                          required
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="Mobile Number"
                          className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your Message</label>
                        <textarea
                          name="message"
                          rows={5}
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Type your message..."
                          className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending Message...' : 'Submit Message'}
                        {!isSubmitting && <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-8 space-y-6 flex flex-col items-center justify-center w-full"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center text-cyan-400">
                          <Sparkles size={28} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-extrabold text-gradient">Message sent!</h4>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto">
                          Thanks for reaching out! I'll read your message and get back to you as soon as I can.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Modern minimal footer */}
      <footer className="w-full py-8 border-t border-white/5 text-center bg-gray-950/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} Aditya Pawar. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Designed &amp; Engineered by <a href="mailto:pawaraditya1383@gmail.com" className="text-gray-400 hover:text-indigo-400 transition-colors font-medium">pawaraditya1383@gmail.com</a>
          </span>
        </div>
      </footer>

      {/* Certificate Lightbox Viewer Modal */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-[#030712]/90 backdrop-blur-md"
            onClick={() => setActiveCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-3xl p-4 md:p-6 bg-[#0b0f19]/80 border border-white/10 flex flex-col gap-4 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-base md:text-lg font-extrabold text-gray-100 flex items-center gap-2">
                    <Award className="text-indigo-400 w-5 h-5" />
                    {activeCertificate.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold">{activeCertificate.orgOrEvent}</p>
                </div>
                <button
                  onClick={() => setActiveCertificate(null)}
                  className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Multi-asset tabs (if more than 1 asset) */}
              {activeCertificate.assets.length > 1 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {activeCertificate.assets.map((asset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCertificate({
                        ...activeCertificate,
                        currentIndex: idx
                      })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        activeCertificate.currentIndex === idx
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 shadow-md'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      {asset.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Viewer Area */}
              <div className="flex-1 flex items-center justify-center bg-black/40 rounded-2xl overflow-y-auto border border-white/5 min-h-[300px] max-h-[60vh] p-2 relative group/viewer">
                {activeCertificate.assets[activeCertificate.currentIndex].type === 'image' ? (
                  <img
                    src={activeCertificate.assets[activeCertificate.currentIndex].url}
                    alt={activeCertificate.assets[activeCertificate.currentIndex].title}
                    className="max-w-full max-h-[58vh] object-contain rounded-xl shadow-xl transition-all duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 w-full">
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <GraduationCap size={48} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-200">PDF Document Available</p>
                      <p className="text-xs text-gray-400 max-w-sm mt-1">This certification is provided as an official PDF document.</p>
                    </div>
                    <a
                      href={activeCertificate.assets[activeCertificate.currentIndex].url}
                      download
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Download size={14} />
                      Download PDF
                    </a>
                  </div>
                )}
              </div>

              {/* Action Bar (Download current asset) */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Asset {activeCertificate.currentIndex + 1} of {activeCertificate.assets.length}
                </span>
                
                {activeCertificate.assets[activeCertificate.currentIndex].type === 'image' && (
                  <a
                    href={activeCertificate.assets[activeCertificate.currentIndex].url}
                    download={`${activeCertificate.title.replace(/\s+/g, '_')}_${activeCertificate.assets[activeCertificate.currentIndex].title.replace(/\s+/g, '_')}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download size={14} />
                    Download File
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
