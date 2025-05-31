
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About DevOpsWizard</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">
              DevOpsWizard is a cutting-edge platform designed to help developers and ops teams harness the power of AI for their DevOps workflows.
              Our mission is to simplify the deployment and management of AI-powered tools that can automate and enhance the software development lifecycle.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p>
              We believe that AI should be accessible to every development team, regardless of their size or expertise in machine learning.
              DevOpsWizard bridges the gap between complex AI models and practical DevOps use cases, making it possible to deploy, manage,
              and monitor LLM-powered bots with minimal overhead.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose DevOpsWizard</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-devops-blue/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-blue">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span><strong>Simplified Deployment:</strong> Deploy your LLM bot to Kubernetes in minutes, not days.</span>
              </li>
              <li className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-devops-blue/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-blue">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span><strong>Comprehensive Monitoring:</strong> Real-time insights into your bot's performance and usage.</span>
              </li>
              <li className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-devops-blue/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-blue">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span><strong>Secure Management:</strong> Enterprise-grade security for your AI-assisted DevOps workflow.</span>
              </li>
              <li className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-devops-blue/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-blue">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span><strong>Cost-Effective:</strong> Flexible pricing plans to accommodate teams of all sizes.</span>
              </li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
            <p>
              DevOpsWizard is built by a team of experienced engineers who understand the challenges of modern DevOps workflows.
              We've worked with companies of all sizes, from startups to enterprises, and we've seen firsthand the impact that
              well-implemented AI tools can have on developer productivity and software quality.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Get Started Today</h2>
            <p>
              Ready to enhance your DevOps workflow with AI? Sign up for DevOpsWizard today and deploy your first
              Kubernetes LLM Bot instance in minutes.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
