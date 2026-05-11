import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Mail, Briefcase } from 'lucide-react';

export default function WorkersList() {
  // Mock data - replace with actual API call when available
  const workers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@cwmlink.com',
      role: 'Technician',
      department: 'Maintenance',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@cwmlink.com',
      role: 'Manager',
      department: 'Operations',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@cwmlink.com',
      role: 'Technician',
      department: 'Maintenance',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@cwmlink.com',
      role: 'Supervisor',
      department: 'Quality Control',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert.brown@cwmlink.com',
      role: 'Technician',
      department: 'Assembly',
      status: 'On Leave',
    },
  ];

  const stats = [
    {
      title: 'Total Workers',
      value: workers.length.toString(),
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Active',
      value: workers.filter((w) => w.status === 'Active').length.toString(),
      icon: Briefcase,
      color: 'text-green-500',
    },
    {
      title: 'Departments',
      value: new Set(workers.map((w) => w.department)).size.toString(),
      icon: Mail,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Workers Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-gray-900/50 backdrop-blur-sm border-purple-500/20"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workers Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((worker) => (
              <TableRow key={worker.id}>
                <TableCell className="font-medium">{worker.name}</TableCell>
                <TableCell>{worker.email}</TableCell>
                <TableCell>{worker.role}</TableCell>
                <TableCell>{worker.department}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      worker.status === 'Active'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }
                  >
                    {worker.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
