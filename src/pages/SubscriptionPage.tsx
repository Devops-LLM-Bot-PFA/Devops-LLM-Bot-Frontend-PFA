
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserDetails } from '@/hooks/useUser';
import { useSubscriptions, useSelectSubscription } from '@/hooks/useSubscriptions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Zap, Crown, Rocket, X } from 'lucide-react';

// Local mapping for subscription plans
const PLAN_DETAILS = {
  free: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    interval: 'month',
    features: [
      { name: '5 Projects', included: true },
      { name: 'Basic Support', included: true },
      { name: '1GB Storage', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false },
    ],
  },
  basic: {
    name: 'Basic',
    description: 'Great for small teams',
    price: 9,
    interval: 'month',
    features: [
      { name: '25 Projects', included: true },
      { name: 'Email Support', included: true },
      { name: '10GB Storage', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Perfect for growing businesses',
    price: 29,
    interval: 'month',
    features: [
      { name: 'Unlimited Projects', included: true },
      { name: 'Priority Support', included: true },
      { name: '100GB Storage', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'API Access', included: true },
    ],
  },
};

const SubscriptionPage: React.FC = () => {
  const { data: userDetails, isLoading: userLoading } = useUserDetails();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const selectSubscription = useSelectSubscription();
  const isLoading = userLoading || subscriptionsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <Skeleton className="h-14 w-full rounded-md" />
            <Skeleton className="h-6 w-4/5 rounded-md mx-auto" />
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentType = userDetails?.subscription?.type;
  const currentPlan = currentType ? PLAN_DETAILS[currentType] : undefined;
  const plans = subscriptions?.map(sub => ({ ...PLAN_DETAILS[sub.type], type: sub.type, id: sub.id })) ?? [];

  const selectPlan = async (id: string) => {
    try {
      await selectSubscription.mutateAsync(id);
    } catch (err) {
      console.error('Selection error:', err);
    }
  };

  const icons = {
    free: <Zap className="h-8 w-8 text-blue-500" />,    
    basic: <Rocket className="h-8 w-8 text-green-500" />,    
    pro: <Crown className="h-8 w-8 text-purple-500" />
  };  

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="text-center pt-20 pb-16 px-4">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible subscription tiers to grow with your team's needs.
          </p>
          {currentPlan && (
            <div className="mt-6 inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <span className="text-sm font-medium text-card-foreground">
                Current: {currentPlan.name}
              </span>
            </div>
          )}
        </section>

        {/* Plans Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map(plan => {
              const active = currentType === plan.type;
              return (
                <Card 
                  key={plan.type}
                  className={`group transform hover:scale-105 transition shadow-lg rounded-2xl ${
                    active ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}                
                >
                  <CardHeader className="flex flex-col items-center pt-6">
                    <div className="mb-3 p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-full">
                      {icons[plan.type] || icons.free}
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-3 text-3xl font-bold text-foreground">
                      ${plan.price}
                      <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                    </div>
                    {active && (
                      <Badge className="mt-2" variant="default">
                        Current Plan
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center">
                          {f.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mr-2" />
                          )}
                          <span className={f.included ? 'text-foreground' : 'text-muted-foreground line-through'}>
                            {f.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={active ? 'outline' : 'default'}
                      disabled={active || selectSubscription.isPending}
                      onClick={() => !active && selectPlan(plan.id)}
                    >
                      {selectSubscription.isPending
                        ? 'Processing...'
                        : active
                        ? 'Selected'
                        : 'Select'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-card py-12 text-center border-t border-border">
          <h3 className="text-2xl font-semibold text-card-foreground">
            Need something custom?
          </h3>
          <p className="mt-2 text-muted-foreground">
            Contact our sales team for enterprise solutions and custom integrations.
          </p>
          <Button variant="outline" className="mt-4">
            Contact Sales
          </Button>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
