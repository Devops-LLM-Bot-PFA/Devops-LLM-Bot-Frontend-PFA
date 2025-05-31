
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Server, ShieldCheck, Zap } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero section */}
      <section className="py-20 hero-gradient text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Manage Your DevOps LLM Bot with Ease
            </h1>
            <p className="text-xl mb-10 text-white/90">
              Deploy, configure, and monitor your Kubernetes LLM instances in one powerful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-devops-navy hover:bg-white/90">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-devops-navy hover:bg-white/90">
                <a href="#learn-more">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white"></div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="learn-more" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful DevOps Management</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the deployment and management of AI-powered DevOps assistants in your environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg card-gradient-hover border">
              <div className="w-12 h-12 bg-devops-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-devops-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">One-Click Deployment</h3>
              <p className="text-muted-foreground">
                Seamlessly deploy your LLM Bot to Kubernetes with minimal configuration and maximum reliability.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-lg card-gradient-hover border">
              <div className="w-12 h-12 bg-devops-purple/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-devops-purple">
                  <circle cx="19" cy="5" r="2"></circle>
                  <circle cx="5" cy="19" r="2"></circle>
                  <path d="M5 17v-6a6 6 0 0 1 6-6h2"></path>
                  <path d="M19 7v6a6 6 0 0 1-6 6h-2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Monitoring</h3>
              <p className="text-muted-foreground">
                Track performance metrics, usage statistics and health indicators in real-time.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-lg card-gradient-hover border">
              <div className="w-12 h-12 bg-devops-green/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-devops-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure By Design</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with isolated environments and credential management.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Video demo section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch our demo video to see how DevOpsWizard can transform your AI-assisted DevOps workflow.
            </p>
          </div>
          
          <div className="mx-auto max-w-4xl rounded-xl overflow-hidden shadow-xl">
            <div className="aspect-w-16 aspect-h-9 bg-devops-navy flex items-center justify-center">
              {/* Placeholder for actual video */}
              <div className="text-center p-20">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <p className="text-white text-xl font-medium">Video Demo</p>
                <p className="text-white/70 mt-2">Click to play</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Streamline Your DevOps?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create your account now and deploy your first Kubernetes LLM Bot instance in minutes.
            </p>
            <Button asChild size="lg">
              <Link to="/auth" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
