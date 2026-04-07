import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart as BarChartIcon, CheckCircle, Users, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const chartData = [
  { month: "Jan", leaves: 12 },
  { month: "Feb", leaves: 15 },
  { month: "Mar", leaves: 8 },
  { month: "Apr", leaves: 4 },
  { month: "May", leaves: 21 },
  { month: "Jun", leaves: 35 },
];

export default function HodDashboard() {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/leaves/pending');
        setPendingApprovals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = pendingApprovals.length;
  const recentLeaves = pendingApprovals.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-left duration-500">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent italic">
            HOD Command Center
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Strategic overview and departmental head approvals.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom duration-700">
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-amber-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Staff Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingCount}</div>
            <p className="text-[10px] font-bold text-amber-600 mt-1 uppercase">Professor applications</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-primary hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dept Monthly</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChartIcon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">45</div>
            <p className="text-[10px] font-bold text-primary mt-1 uppercase">Total aggregated leaves</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-green-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quality Index</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">92%</div>
            <p className="text-[10px] font-bold text-green-600 mt-1 uppercase">Approval efficiency</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-blue-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Operational</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">3</div>
            <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase">Total staff out today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom duration-1000">
        <Card className="col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Leave Analytics</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeaves" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="leaves" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorLeaves)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg font-bold">Priority Approvals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border/50">
              {isLoading ? (
                <div className="p-10 text-center animate-pulse">Loading requests...</div>
              ) : recentLeaves.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="text-muted-foreground font-bold italic">No pending professor requests!</div>
                </div>
              ) : (
                recentLeaves.map((leave: any) => (
                  <div key={leave._id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center font-black text-indigo-600 text-sm">
                        {leave.applicant?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{leave.applicant?.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          {leave.type} • {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/leave/approve')} variant="ghost" size="sm" className="text-primary font-bold text-xs h-9 hover:bg-primary/5">
                      Review <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
