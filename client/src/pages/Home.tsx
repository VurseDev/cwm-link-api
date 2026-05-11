import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Package, BarChart3, Users, Lock, FileText, Zap } from 'lucide-react';

export default function Home() {
  const [displayedText, setDisplayedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    'Parts Management',
    'Inventory Control',
    'Supply Chain Excellence'
  ];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        setDisplayedText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  const features = [
    {
      icon: Package,
      title: 'Parts Management',
      description: 'Complete CRUD operations for parts with real-time tracking and status updates.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Interactive charts and statistics showing parts distribution and trends over time.',
    },
    {
      icon: Users,
      title: 'Worker Management',
      description: 'Manage your team with comprehensive worker profiles and activity tracking.',
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Token-based authentication with protected routes and role-based access control.',
    },
    {
      icon: FileText,
      title: 'Activity Logs',
      description: 'Detailed audit trails for all parts with timestamped action logs.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant synchronization across all devices with live data updates.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Ethereal light effect */}
      <div className="light-effect" />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 md:px-12 flex justify-between items-center z-50">
        <div className="text-xl font-semibold text-foreground tracking-tight">
          CWM Link
        </div>
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Sign in →
        </Link>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-8 font-medium">
              FOR ENTERPRISES
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight leading-tight">
              Turn your inventory into excellence
            </h1>

            <div className="flex items-center justify-center min-h-[4rem] mb-6">
              <span className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                {displayedText}
              </span>
              <span className="inline-block w-0.5 h-10 md:h-12 bg-foreground ml-2 animate-pulse" />
            </div>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade parts management system with real-time tracking,
              comprehensive analytics, and seamless inventory control.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login">
                <Button size="lg" className="rounded-full px-8 glow">
                  Get Started
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Integration logos style */}
            <div className="flex gap-8 items-center justify-center mt-12 flex-wrap opacity-60">
              <Package className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
              <BarChart3 className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
              <Lock className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
              <Zap className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
              <FileText className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32 w-full max-w-6xl" id="features">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 hover:glass-hover transition-all duration-300 hover:-translate-y-2"
              >
                <feature.icon className="w-10 h-10 mb-5 opacity-90" />
                <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[0.95rem]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
