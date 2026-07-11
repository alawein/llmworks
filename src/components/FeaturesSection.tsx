import { Badge, Card } from '@alawein/ui';
import React, { memo, useRef, useEffect } from 'react';

import { Swords, Users, TrendingUp, Zap, Eye, Trophy, LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  status: 'trust' | 'primary';
  badge: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Swords,
    title: 'Strategic Intelligence Testing',
    description:
      'Scripted debate, creative challenge, and reasoning workflows show how evaluation screens behave before provider-backed scoring is implemented.',
    status: 'trust',
    badge: 'Strategic',
    gradient: 'from-red-500/20 via-orange-500/20 to-yellow-500/20',
  },
  {
    icon: Users,
    title: 'Multi-Agent Scenarios',
    description:
      'Scripted collaboration and competition layouts preview how multi-agent evaluation flows can be reviewed.',
    status: 'trust',
    badge: 'Intelligence',
    gradient: 'from-blue-500/20 via-purple-500/20 to-pink-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Strategic Ranking System',
    description:
      'Sample ranking views show how persisted run records and future measured results will be presented.',
    status: 'trust',
    badge: 'Rankings',
    gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
  },
  {
    icon: Zap,
    title: 'Review Workflow Preview',
    description:
      'Illustrative judgment panels show where evaluator notes and transparent reasoning summaries will live once scoring is implemented.',
    status: 'trust',
    badge: 'Command',
    gradient: 'from-yellow-500/20 via-amber-500/20 to-orange-500/20',
  },
  {
    icon: Eye,
    title: 'Complete Visibility',
    description:
      'Demo review traces, decision trees, and reasoning breakdowns make the planned evaluation review path visible.',
    status: 'trust',
    badge: 'Intelligence',
    gradient: 'from-indigo-500/20 via-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Trophy,
    title: 'Elite Certification',
    description:
      'Planned benchmark protocol templates show how established tasks and custom challenges can be organized.',
    status: 'trust',
    badge: 'Prestige',
    gradient: 'from-purple-500/20 via-violet-500/20 to-fuchsia-500/20',
  },
];

const FeatureCard = memo(({ feature, index }: { feature: Feature; index: number }) => {
  const IconComponent = feature.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const element = cardRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="card-sophisticated group magnetic-hover"
      style={
        {
          animationDelay: `${index * 120}ms`,
          '--mouse-x': '50%',
          '--mouse-y': '50%',
        } as React.CSSProperties
      }
      role="article"
      aria-labelledby={`feature-${index}-title`}
    >
      {/* Gradient Border Effect */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      <div className="relative flex flex-col items-center text-center p-8 h-full">
        {/* Enhanced Icon Section */}
        <div className="relative mb-8">
          <div className="glass-subtle p-6 rounded-2xl group-hover:scale-110 transition-all duration-500">
            <IconComponent
              className="h-10 w-10 text-primary transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
              aria-hidden="true"
            />
          </div>

          {/* Floating Badge */}
          <Badge
            className="absolute -top-3 -right-3 glass-panel border-0 text-xs px-3 py-1 font-semibold animate-pulse"
            style={{
              background: `radial-gradient(circle at center, hsl(var(--color-primary) / 0.2), hsl(var(--color-secondary) / 0.1))`,
              color: 'hsl(var(--color-primary))',
            }}
          >
            {feature.badge}
          </Badge>
        </div>

        {/* Sophisticated Typography */}
        <h3
          id={`feature-${index}-title`}
          className="heading-refined text-xl mb-4 group-hover:text-primary transition-colors duration-300"
        >
          {feature.title}
        </h3>

        <p className="body-elegant text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {feature.description}
        </p>

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--color-primary) / 0.3), transparent 70%)`,
          }}
        ></div>
      </div>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export const FeaturesSection = memo(() => {
  return (
    <section
      className="relative py-32 overflow-hidden section-angled"
      aria-labelledby="features-heading"
      style={{
        background: `
          radial-gradient(circle at 80% 20%, hsl(var(--color-accent) / 0.03), transparent 60%),
          radial-gradient(circle at 20% 80%, hsl(var(--color-primary) / 0.02), transparent 60%),
          var(--color-background)
        `,
      }}
    >
      {/* Sophisticated Background Effects */}
      <div className="absolute inset-0 subtle-texture opacity-30"></div>
      <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 right-1/3 w-px h-24 bg-gradient-to-t from-secondary/20 to-transparent"></div>

      <div className="container-elegant relative z-10">
        {/* Refined Header */}
        <header className="text-center mb-20 stagger-children">
          <div style={{ '--stagger-index': 0 } as React.CSSProperties}>
            <Badge className="glass-subtle border-0 px-6 py-3 mb-8 text-sm font-medium">
              <Trophy className="h-4 w-4 mr-2 text-primary" />
              <span className="heading-refined text-primary">Strategic Excellence</span>
            </Badge>
          </div>

          <div style={{ '--stagger-index': 1 } as React.CSSProperties}>
            <h2
              id="features-heading"
              className="heading-display text-5xl md:text-6xl mb-8 max-w-4xl mx-auto"
            >
              <span className="block">Where Intelligence</span>
              <span className="block">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Meets Strategy
                </span>
              </span>
            </h2>
          </div>

          <div style={{ '--stagger-index': 2 } as React.CSSProperties}>
            <p className="body-elegant text-xl max-w-3xl mx-auto opacity-80">
              Beyond simple Q&A testing. The current product presents scripted evaluation demos,
              benchmark run tracking, and sample dashboards while provider scoring is still in
              progress.
            </p>
          </div>
        </header>

        {/* Enhanced Feature Grid */}
        <div
          className="grid-sophisticated max-w-7xl mx-auto stagger-children"
          role="list"
          aria-label="Platform capabilities"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              role="listitem"
              style={{ '--stagger-index': index + 3 } as React.CSSProperties}
            >
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20 stagger-children">
          <div style={{ '--stagger-index': 9 } as React.CSSProperties}>
            <p className="body-elegant opacity-60 mb-6">Ready to explore the demo surfaces?</p>
            <div className="flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';
