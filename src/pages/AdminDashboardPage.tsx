
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Server, Users, Database, Activity } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { allInstances, getSystemStatus } = useAdmin();
  const systemStatus = getSystemStatus();

  // Generate data for bar chart
  const instancesByPlan = [
    { name: 'Free', count: allInstances.filter(i => i.plan === 'free').length },
    { name: 'Pro', count: allInstances.filter(i => i.plan === 'pro').length },
    { name: 'Enterprise', count: allInstances.filter(i => i.plan === 'enterprise').length },
  ];

  // Generate data for instance status chart
  const instanceStatusData = [
    { name: 'Running', value: systemStatus.runningInstances },
    { name: 'Stopped', value: systemStatus.stoppedInstances },
    { name: 'Error', value: systemStatus.errorInstances },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* System Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Instances"
            value={systemStatus.totalInstances}
            icon={<Server className="h-5 w-5" />}
          />
          <StatsCard
            title="Active Users"
            value={Math.round(systemStatus.totalInstances * 1.4)}
            icon={<Users className="h-5 w-5" />}
            trend={5.2}
          />
          <StatsCard
            title="Total CPU Usage"
            value={`${Math.round(systemStatus.totalCpuUsage)}%`}
            icon={<Activity className="h-5 w-5" />}
            description="Across all instances"
          />
          <StatsCard
            title="Total Storage"
            value={`${allInstances.reduce((acc, inst) => acc + inst.storage, 0)} GB`}
            icon={<Database className="h-5 w-5" />}
            description="SSD Storage"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Instances by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={instancesByPlan} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Instances" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Instance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={instanceStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Instances" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* System Health */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>CPU Usage</span>
                    <span>{Math.round(systemStatus.totalCpuUsage)}%</span>
                  </div>
                  <Progress value={systemStatus.totalCpuUsage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Memory Usage</span>
                    <span>{Math.round(systemStatus.totalMemoryUsage)}%</span>
                  </div>
                  <Progress value={systemStatus.totalMemoryUsage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Network Load</span>
                    <span>{Math.round(systemStatus.totalCpuUsage * 0.7)}%</span>
                  </div>
                  <Progress value={systemStatus.totalCpuUsage * 0.7} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Instances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Instances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Plan</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Resources</th>
                  </tr>
                </thead>
                <tbody>
                  {allInstances.slice(0, 5).map((instance) => (
                    <tr key={instance.id} className="border-b">
                      <td className="py-3 px-4">{instance.id}</td>
                      <td className="py-3 px-4">{instance.name}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={instance.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 capitalize">{instance.plan}
                      </td>
                      <td className="py-3 px-4">{new Date(instance.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{instance.cpu}vCPU, {instance.memory}GB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
