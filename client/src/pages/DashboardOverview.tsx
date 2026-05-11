import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function DashboardOverview() {
  const stats = [
    {
      title: 'Total Parts',
      value: '1,234',
      icon: Package,
      trend: '+12%',
      color: 'text-blue-500',
    },
    {
      title: 'Available',
      value: '856',
      icon: CheckCircle,
      trend: '+8%',
      color: 'text-green-500',
    },
    {
      title: 'In Use',
      value: '289',
      icon: TrendingUp,
      trend: '+15%',
      color: 'text-purple-500',
    },
    {
      title: 'Maintenance',
      value: '89',
      icon: AlertCircle,
      trend: '-5%',
      color: 'text-yellow-500',
    },
  ];

  const chartData = [
    { month: 'Jan', parts: 400, usage: 240 },
    { month: 'Feb', parts: 450, usage: 280 },
    { month: 'Mar', parts: 520, usage: 320 },
    { month: 'Apr', parts: 480, usage: 300 },
    { month: 'May', parts: 600, usage: 380 },
    { month: 'Jun', parts: 650, usage: 420 },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Part Added',
      description: 'New hydraulic pump added to inventory',
      time: '2 minutes ago',
    },
    {
      id: 2,
      action: 'Status Changed',
      description: 'Part #1234 moved to maintenance',
      time: '15 minutes ago',
    },
    {
      id: 3,
      action: 'Part Removed',
      description: 'Old bearing removed from system',
      time: '1 hour ago',
    },
    {
      id: 4,
      action: 'Worker Added',
      description: 'New technician John Doe added',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/50 transition-all hover:glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-green-500 mt-1">{stat.trend} from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle>Parts Inventory Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #4b5563',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="parts"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle>Parts Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #4b5563',
                  }}
                />
                <Bar dataKey="usage" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
