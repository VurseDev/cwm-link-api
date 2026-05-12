import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from '@/lib/auth';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    toast.success('Desconectado com sucesso');
    navigate('/login');
  };

  const user = session?.user || { name: 'Usuário', email: '' };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { path: '/dashboard/parts', icon: Package, label: 'Peças' },
    { path: '/dashboard/workers', icon: Users, label: 'Trabalhadores' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Ethereal light effect */}
      <div className="light-effect" />

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } transition-all duration-300 glass border-r border-border min-h-screen`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <h1 className="text-xl font-semibold text-foreground tracking-tight">CWM Link</h1>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        !sidebarOpen && 'justify-center'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="ml-2">{item.label}</span>}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="glass border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                {navItems.find((item) => item.path === location.pathname)?.label ||
                  'Dashboard'}
              </h2>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="w-5 h-5" />
                    <span>{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
