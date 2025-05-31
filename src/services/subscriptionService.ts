
import { httpClient, API_CONFIG } from '@/config/api';

// Types for subscriptions
export interface Subscription {
  id: string;
  type: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: Array<{
    name: string;
    included: boolean;
  }>;
}

export interface UserSubscriptionResponse {
  user: any; // Replace with your actual user type
}

export class SubscriptionService {
  static async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      const data = await httpClient.makeRequest<Subscription[]>(
        API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.GET_ALL,
        {
          method: 'GET',
        }
      );
      return data;
    } catch (error) {
      // Return mock data based on your database structure
      return [
        {
          id: "sbu_JrZ9xoiIerqSB5KsL0DD",
          type: "free",
          name: "Free",
          description: "Perfect for getting started",
          price: 0,
          interval: "month",
          features: [
            { name: "5 Projects", included: true },
            { name: "Basic Support", included: true },
            { name: "1GB Storage", included: true },
            { name: "Advanced Analytics", included: false },
            { name: "Priority Support", included: false },
            { name: "Custom Integrations", included: false }
          ]
        },
        {
          id: "sbu_6qzvFRxX9WJEvjPqLXFL",
          type: "basic",
          name: "Basic",
          description: "Great for small teams",
          price: 9,
          interval: "month",
          features: [
            { name: "25 Projects", included: true },
            { name: "Email Support", included: true },
            { name: "10GB Storage", included: true },
            { name: "Advanced Analytics", included: true },
            { name: "Priority Support", included: false },
            { name: "Custom Integrations", included: false }
          ]
        },
        {
          id: "sbu_29eSDlV9xrtofkTc7T7C",
          type: "pro",
          name: "Pro",
          description: "Perfect for growing businesses",
          price: 29,
          interval: "month",
          features: [
            { name: "Unlimited Projects", included: true },
            { name: "Priority Support", included: true },
            { name: "100GB Storage", included: true },
            { name: "Advanced Analytics", included: true },
            { name: "Custom Integrations", included: true },
            { name: "API Access", included: true }
          ]
        }
      ];
    }
  }

  static async selectSubscription(subscriptionId: string): Promise<UserSubscriptionResponse> {
    return httpClient.makeRequest<UserSubscriptionResponse>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.SELECT}/${subscriptionId}`,
      {
        method: 'POST',
      }
    );
  }
}
