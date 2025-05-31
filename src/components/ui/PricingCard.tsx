
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export interface PricingPlan {
  name: string;
  price: {
    monthly: number;
    yearly?: number;
  };
  description: string;
  features: string[];
  mostPopular?: boolean;
  buttonText?: string;
  disabled?: boolean;
  recommended?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly?: boolean;
  onSelectPlan?: (plan: PricingPlan) => void;
  currentPlan?: string;
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isYearly = false,
  onSelectPlan,
  currentPlan,
  className,
}) => {
  const { name, price, description, features, mostPopular = false, buttonText = 'Get Started', disabled = false } = plan;
  const isCurrentPlan = currentPlan === name.toLowerCase();

  return (
    <Card
      className={cn(
        'flex flex-col transition-all duration-200',
        mostPopular ? 'border-primary shadow-lg' : '',
        isCurrentPlan ? 'border-devops-green shadow-lg ring-1 ring-devops-green/30' : '',
        className
      )}
    >
      {(mostPopular || isCurrentPlan) && (
        <div className={cn(
          'py-1 text-center text-sm font-medium text-white',
          mostPopular ? 'bg-primary' : 'bg-devops-green',
        )}>
          {isCurrentPlan ? 'Your Plan' : 'Most Popular'}
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-baseline text-3xl font-bold">
          ${isYearly && price.yearly ? price.yearly : price.monthly}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            /{isYearly ? 'year' : 'month'}
          </span>
        </div>
        
        <p className="mt-4 text-muted-foreground">{description}</p>
        
        <ul className="mt-6 space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          variant={mostPopular ? 'default' : 'outline'}
          disabled={disabled}
          onClick={() => onSelectPlan && onSelectPlan(plan)}
        >
          {isCurrentPlan ? 'Current Plan' : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
