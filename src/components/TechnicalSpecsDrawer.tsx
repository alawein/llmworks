import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@alawein/ui';
import { memo, useState } from 'react';

import {
  FileText,
  Cpu,
  Database,
  Network,
  Shield,
  Zap,
  Code,
  Layers,
  HardDrive,
  Monitor,
  Server,
  Cloud,
  Lock,
  Settings,
  Activity,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface TechnicalSpec {
  category: string;
  specs: {
    label: string;
    value: string;
    description?: string;
    status?: 'optimal' | 'warning' | 'critical';
  }[];
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: string[];
  response: string;
}

interface Architecture {
  layer: string;
  components: {
    name: string;
    technology: string;
    status: 'active' | 'inactive' | 'maintenance';
    load: number;
    description: string;
  }[];
}

const TechnicalSpecsDrawerComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSpec, setActiveSpec] = useState('system');
  const [expandedSections, setExpandedSections] = useState<string[]>(['architecture']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleCopyEndpoint = async (path: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        console.warn('Clipboard API is not available for endpoint copy');
        return;
      }

      await navigator.clipboard.writeText(path);
    } catch (error) {
      console.warn('Failed to copy endpoint path', error);
    }
  };

  const technicalSpecs: TechnicalSpec[] = [
    {
      category: 'Current App Stack',
      specs: [
        {
          label: 'Frontend',
          value: 'Vite + React + TypeScript',
          description: 'Route screens, scripted demos, and sample dashboards',
          status: 'optimal',
        },
        {
          label: 'UI System',
          value: 'Radix + Tailwind',
          description: 'Shared components and design tokens',
          status: 'optimal',
        },
        {
          label: 'Backend',
          value: 'Supabase',
          description: 'Auth, database, and edge functions',
          status: 'optimal',
        },
        {
          label: 'Benchmark Queue',
          value: 'benchmark_runs',
          description: 'Queues run records; scoring worker is not implemented',
          status: 'warning',
        },
      ],
    },
    {
      category: 'Planned Evaluation Work',
      specs: [
        {
          label: 'Provider Calls',
          value: 'Not implemented',
          description: 'No frontend provider inference path exists yet',
          status: 'warning',
        },
        {
          label: 'Benchmark Scoring',
          value: 'Not implemented',
          description: 'Dataset execution and scoring workers are planned work',
          status: 'warning',
        },
        {
          label: 'Measured Reports',
          value: 'Not implemented',
          description: 'Current reports and dashboards use sample data',
          status: 'warning',
        },
      ],
    },
    {
      category: 'Database Systems',
      specs: [
        {
          label: 'Primary Database',
          value: 'Supabase Postgres',
          description: 'Application tables and benchmark queue tables',
        },
        {
          label: 'Benchmark Runs',
          value: 'public.benchmark_runs',
          description: 'Pending run records created by the benchmarks edge function',
        },
        {
          label: 'Benchmark Results',
          value: 'public.benchmark_results',
          description: 'Reserved for future scored outputs',
        },
      ],
    },
  ];

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: 'supabase.functions.invoke("benchmarks")',
      description: 'List planned benchmark presets',
      response: 'benchmark definitions',
    },
    {
      method: 'POST',
      path: 'supabase.functions.invoke("benchmarks/:id/run")',
      description: 'Queue a benchmark run record',
      parameters: ['models', 'config'],
      response: 'runId, pending status, scoring-pending message',
    },
    {
      method: 'GET',
      path: 'supabase.functions.invoke("benchmarks/:id/results")',
      description: 'Read persisted result rows for the signed-in user',
      response: 'benchmark_results[]',
    },
  ];

  const architectureLayers: Architecture[] = [
    {
      layer: 'Presentation Layer',
      components: [
        {
          name: 'React Frontend',
          technology: 'Vite + TypeScript',
          status: 'active',
          load: 23,
          description: 'Scripted demos, sample dashboards, and run-tracking UI',
        },
        {
          name: 'Route Surfaces',
          technology: 'React Router',
          status: 'active',
          load: 18,
          description: 'Arena, Bench, Compare, Settings, and Dashboard screens',
        },
      ],
    },
    {
      layer: 'Backend Layer',
      components: [
        {
          name: 'Supabase Auth',
          technology: 'Supabase',
          status: 'active',
          load: 12,
          description: 'Authenticated user context for backend operations',
        },
        {
          name: 'Benchmarks Function',
          technology: 'Supabase Edge Functions',
          status: 'active',
          load: 8,
          description: 'Lists presets and queues benchmark run records',
        },
        {
          name: 'Scoring Worker',
          technology: 'Planned',
          status: 'maintenance',
          load: 0,
          description: 'Future provider inference and scoring path',
        },
      ],
    },
    {
      layer: 'Data Layer',
      components: [
        {
          name: 'Application Database',
          technology: 'Supabase Postgres',
          status: 'active',
          load: 20,
          description: 'App data, roles, audit log, and benchmark queue records',
        },
        {
          name: 'Benchmark Results',
          technology: 'Postgres table',
          status: 'maintenance',
          load: 0,
          description: 'Reserved for future measured benchmark output',
        },
      ],
    },
  ];

  const securitySpecs = [
    {
      feature: 'Authentication',
      status: 'Supabase',
      description: 'Signed-in users are required for benchmark edge-function access',
    },
    {
      feature: 'Row-Level Security',
      status: 'Configured',
      description: 'Benchmark tables scope records to the owning user',
    },
    {
      feature: 'Provider Secrets',
      status: 'Operator-managed',
      description: 'Do not claim server-side encryption until implementation exists',
    },
    {
      feature: 'Sample Data Labels',
      status: 'Required',
      description: 'Demos and exports must disclose sample data before presenting metrics',
    },
  ];

  const performanceMetrics = [
    {
      metric: 'Benchmark Queue',
      value: 'Pending',
      target: 'Scoring worker planned',
      status: 'warning' as const,
    },
    {
      metric: 'Provider Calls',
      value: 'Not wired',
      target: 'Future integration',
      status: 'warning' as const,
    },
    {
      metric: 'Dashboard Metrics',
      value: 'Sample',
      target: 'Measured after scoring ships',
      status: 'warning' as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'optimal':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'inactive':
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'maintenance':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'warning':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/30';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'performance-elite strategic-rank';
      case 'POST':
        return 'performance-superior strategic-rank';
      case 'PUT':
        return 'rank-gold strategic-rank';
      case 'DELETE':
        return 'rank-bronze strategic-rank';
      default:
        return 'performance-standard strategic-rank';
    }
  };

  return (
    <div
      className={`glass-panel transition-all duration-500 ${isExpanded ? 'fixed inset-4 z-50' : 'w-full max-w-6xl mx-auto'}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="glass-subtle p-2 rounded-xl">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="heading-refined text-lg">Technical Specifications</CardTitle>
              <p className="text-xs text-muted-foreground">
                Current stack and planned capability reference
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="glass-minimal">
              <Download className="h-4 w-4 mr-2" />
              <span className="text-xs">Export</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="glass-minimal p-2"
              aria-label={
                isExpanded ? 'Collapse technical specifications' : 'Expand technical specifications'
              }
              aria-expanded={isExpanded}
              aria-controls="technical-specifications-panel"
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent id="technical-specifications-panel">
        <Tabs value={activeSpec} onValueChange={setActiveSpec} className="space-y-6">
          <TabsList className="glass-subtle p-1 rounded-xl grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="system" className="text-xs">
              System
            </TabsTrigger>
            <TabsTrigger value="api" className="text-xs">
              API
            </TabsTrigger>
            <TabsTrigger value="architecture" className="text-xs">
              Architecture
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              Security
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            {technicalSpecs.map((category, categoryIndex) => (
              <div key={category.category}>
                <Button
                  variant="ghost"
                  onClick={() => toggleSection(category.category)}
                  className="w-full justify-between p-4 h-auto glass-subtle hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    {categoryIndex === 0 && <Layers className="h-4 w-4 text-primary" />}
                    {categoryIndex === 1 && <Cpu className="h-4 w-4 text-secondary" />}
                    {categoryIndex === 2 && <Database className="h-4 w-4 text-accent" />}
                    <span className="heading-refined text-sm">{category.category}</span>
                  </div>
                  {expandedSections.includes(category.category) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {expandedSections.includes(category.category) && (
                  <div className="mt-3 space-y-3 pl-4">
                    {category.specs.map((spec) => (
                      <Card key={spec.label} className="glass-minimal border-border/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">{spec.label}</span>
                              {spec.status && (
                                <Badge className={`text-xs ${getStatusColor(spec.status)}`}>
                                  {spec.status.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm font-mono text-primary">{spec.value}</span>
                          </div>
                          {spec.description && (
                            <p className="text-xs text-muted-foreground">{spec.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Current Backend Surface</h3>
              <Badge className="performance-standard strategic-rank">Supabase</Badge>
            </div>

            <div className="space-y-3">
              {apiEndpoints.map((endpoint) => (
                <Card
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="glass-subtle border-border/20 hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                        <div>
                          <div className="text-sm font-mono font-medium text-primary">
                            {endpoint.path}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {endpoint.description}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="glass-minimal p-1"
                        aria-label={`Copy ${endpoint.path} endpoint`}
                        onClick={() => void handleCopyEndpoint(endpoint.path)}
                      >
                        <Copy className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>

                    {endpoint.parameters && (
                      <div className="mb-2">
                        <div className="text-xs text-muted-foreground mb-1">Parameters:</div>
                        <div className="flex flex-wrap gap-2">
                          {endpoint.parameters.map((param) => (
                            <Badge key={param} variant="outline" className="text-xs font-mono">
                              {param}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Response:</div>
                      <div className="text-xs font-mono text-success bg-black/20 p-2 rounded">
                        {endpoint.response}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Current Architecture Layers</h3>
              <Button variant="outline" size="sm" className="glass-minimal">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Diagram
              </Button>
            </div>

            <div className="space-y-4">
              {architectureLayers.map((layer, layerIndex) => (
                <Card key={layer.layer} className="glass-subtle border-border/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {layerIndex === 0 && <Monitor className="h-4 w-4 text-primary" />}
                      {layerIndex === 1 && <Server className="h-4 w-4 text-secondary" />}
                      {layerIndex === 2 && <Database className="h-4 w-4 text-accent" />}
                      {layerIndex === 3 && <Cloud className="h-4 w-4 text-success" />}
                      {layer.layer}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {layer.components.map((component) => (
                      <div key={component.name} className="glass-minimal p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(component.status)}>
                              {component.status.toUpperCase()}
                            </Badge>
                            <div>
                              <div className="text-sm font-medium">{component.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {component.technology}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Load</div>
                            <div className="text-sm font-bold text-primary">{component.load}%</div>
                          </div>
                        </div>
                        <Progress value={component.load} className="h-1 mb-2" />
                        <div className="text-xs text-muted-foreground">{component.description}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Security Notes</h3>
              <Badge className="performance-standard strategic-rank">Current state</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {securitySpecs.map((spec) => (
                <Card key={spec.feature} className="glass-subtle border-border/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">{spec.feature}</span>
                      </div>
                      <Badge className="performance-superior strategic-rank">{spec.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{spec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="heading-refined text-sm">Implementation Status</h3>
              <Badge className="performance-standard strategic-rank">No SLA claim</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {performanceMetrics.map((metric) => (
                <Card key={metric.metric} className="glass-subtle border-border/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-subtle border-border/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  System Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-success">98.7%</span>
                  <Badge className="performance-elite strategic-rank">EXCELLENT</Badge>
                </div>
                <Progress value={98.7} className="h-3 mb-2" />
                <div className="text-xs text-muted-foreground">
                  Based on availability, performance, security, and user satisfaction metrics
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
};

export const TechnicalSpecsDrawer = memo(TechnicalSpecsDrawerComponent);
