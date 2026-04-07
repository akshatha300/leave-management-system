import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ArrowUpRight, Activity, Download, Users, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const deptData = [
  { name: 'Computer Science', value: 400 },
  { name: 'Electronics', value: 300 },
  { name: 'Mechanical', value: 300 },
  { name: 'Civil', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function PrincipalDashboard() {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, statsRes] = await Promise.all([
          api.get('/leaves/pending'),
          api.get('/leaves/stats')
        ]);
        setPendingApprovals(pendingRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = pendingApprovals.length;
  const recentLeaves = pendingApprovals.slice(0, 4);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-left duration-500">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent italic">
            University Command
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Academic oversight and senior administration approvals.
          </p>
        </div>
        <Button variant="outline" className="shrink-0 border-primary/20 hover:bg-primary/5 h-12 px-6 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom duration-700">
        <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="h-24 w-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">University Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">1,204</div>
            <p className="text-[10px] font-bold mt-2 flex items-center gap-1 uppercase opacity-80">
              <ArrowUpRight className="h-3 w-3" /> +12% Efficiency
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-amber-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingCount}</div>
            <p className="text-[10px] font-bold text-amber-600 mt-1 uppercase">HOD requests to review</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-indigo-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Staff</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">450+</div>
            <p className="text-[10px] font-bold text-indigo-600 mt-1 uppercase">Active faculty members</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-green-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Operations</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">98%</div>
            <p className="text-[10px] font-bold text-green-600 mt-1 uppercase">System uptime status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom duration-1000">
        <Card className="col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg font-bold">Departmental Distribution</CardTitle>
            <CardDescription className="text-xs">Leave trends across major academic branches</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.length > 0 ? stats : deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={8}
                    stroke="none"
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {(stats.length > 0 ? stats : deptData).map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg font-bold">HOD Oversight</CardTitle>
            <CardDescription className="text-xs">Senior management requests</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border/50">
              {isLoading ? (
                <div className="p-10 text-center animate-pulse text-xs font-bold uppercase tracking-widest text-muted-foreground">Synchronizing...</div>
              ) : recentLeaves.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="text-xs text-muted-foreground font-black uppercase tracking-widest">Zero Pending Requests</div>
                </div>
              ) : (
                recentLeaves.map((leave: any) => (
                  <div key={leave._id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center font-black text-orange-600 text-sm">
                        {leave.applicant?.name?.charAt(0) || 'H'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{leave.applicant?.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          HOD • {leave.applicant?.department}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/leave/approve')} variant="ghost" size="sm" className="text-primary font-extrabold text-[10px] h-8 px-4 hover:bg-primary/5 uppercase tracking-tighter">
                      Review →
                    </Button>
                  </div>
                ))
              )}
            </div>
            {recentLeaves.length > 0 && (
              <div className="p-4 bg-muted/10 border-t border-border/10 text-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/leave/approve')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                  See all requests
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
