
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDetails, useUpdateUser } from '@/hooks/useUser';
import { useChangePassword } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'Max 100 characters').regex(/^[a-zA-Z\s]*$/, 'Only letters allowed'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Max 100 characters').regex(/^[a-zA-Z\s]*$/, 'Only letters allowed'),
  email: z.string().email('Invalid email').max(200, 'Max 200 characters'),
  phoneNumber: z.string().optional(),
  location: z.string().max(100, 'Max 100 characters').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { data: userDetails, isLoading, error } = useUserDetails();
  const updateUser = useUpdateUser();
  const changePassword = useChangePassword();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      location: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Initialize form with user data
  React.useEffect(() => {
    if (userDetails?.user) {
      form.reset({
        firstName: userDetails.user.firstName || '',
        lastName: userDetails.user.lastName || '',
        email: userDetails.user.email || '',
        phoneNumber: userDetails.user.phoneNumber || '',
        location: userDetails.user.location || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [userDetails, form]);

  const handleProfileUpdate = form.handleSubmit((values) => {
    updateUser.mutate(values);
  });

  const handlePasswordChange = form.handleSubmit((values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    changePassword.mutate({
      email: values.email,
      password: values.newPassword || '',
      passwordConfirmation: values.confirmPassword || '',
    });
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
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
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userDetails?.user?.avatar} alt={`${userDetails?.user?.firstName} ${userDetails?.user?.lastName}`} />
                  <AvatarFallback>{`${userDetails?.user?.firstName?.[0] || ''}${userDetails?.user?.lastName?.[0] || ''}`}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{`${userDetails?.user?.firstName} ${userDetails?.user?.lastName}`}</h3>
                  <p className="text-muted-foreground">{userDetails?.user?.email}</p>
                </div>
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...form.register('firstName')} placeholder="Enter your first name" />
                    {form.formState.errors.firstName && <p className="text-destructive text-xs">{form.formState.errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...form.register('lastName')} placeholder="Enter your last name" />
                    {form.formState.errors.lastName && <p className="text-destructive text-xs">{form.formState.errors.lastName.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register('email')} placeholder="Enter your email" disabled />
                  {form.formState.errors.email && <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...form.register('phoneNumber')} placeholder="Enter your phone number" />
                  {form.formState.errors.phoneNumber && <p className="text-destructive text-xs">{form.formState.errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...form.register('location')} placeholder="Enter your location" />
                  {form.formState.errors.location && <p className="text-destructive text-xs">{form.formState.errors.location.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={updateUser.isPending}>
                  {updateUser.isPending ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Change your password and manage security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" {...form.register('currentPassword')} placeholder="Enter current password" />
                  {form.formState.errors.currentPassword && <p className="text-destructive text-xs">{form.formState.errors.currentPassword.message}</p>}
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...form.register('newPassword')} placeholder="Enter new password" />
                  {form.formState.errors.newPassword && <p className="text-destructive text-xs">{form.formState.errors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" {...form.register('confirmPassword')} placeholder="Confirm new password" />
                  {form.formState.errors.confirmPassword && <p className="text-destructive text-xs">{form.formState.errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="w-full" variant="outline" disabled={changePassword.isPending}>
                  {changePassword.isPending ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
