
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDetails } from '@/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: userDetails, isLoading, error } = useUserDetails();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6">
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-destructive">Error Loading Profile</h2>
              <p className="text-muted-foreground">There was an error loading your profile. Please try again.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Details</h1>
            <p className="text-muted-foreground">
              View your account information and details.
            </p>
          </div>
          <Button asChild>
            <Link to="/profile">Edit Profile</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userDetails?.user?.avatar} alt={`${userDetails?.user?.firstName} ${userDetails?.user?.lastName}`} />
                <AvatarFallback className="text-2xl">{`${userDetails?.user?.firstName?.[0] || ''}${userDetails?.user?.lastName?.[0] || ''}`}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{`${userDetails?.user?.firstName} ${userDetails?.user?.lastName}`}</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant={user?.isAdmin ? "default" : "secondary"}>
                    {user?.isAdmin ? 'Administrator' : 'User'}
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{userDetails?.user?.email}</p>
                  </div>
                </div>
                
                {userDetails?.user?.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{userDetails.user.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {userDetails?.user?.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{userDetails.user.location}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(userDetails?.user?.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(userDetails?.user?.lastUpdated || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfileDetailsPage;
