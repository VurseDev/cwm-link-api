import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  // Empty state - to be replaced with real API data when workers API is available
  const workers: any[] = [];

  const stats = [
    {
      title: 'Total de Trabalhadores',
      value: '-',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Ativos',
      value: '-',
      icon: Briefcase,
      color: 'text-green-500',
    },
    {
      title: 'Departamentos',
      value: '-',
      icon: Mail,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gestão de Trabalhadores</h1>
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

      {/* Workers Table - Empty State */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Users className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Nenhum trabalhador encontrado</p>
                    <p className="text-sm">Os dados dos trabalhadores serão exibidos aqui quando a API estiver disponível</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>{worker.email}</TableCell>
                  <TableCell>{worker.role}</TableCell>
                  <TableCell>{worker.department}</TableCell>
                  <TableCell>{worker.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
