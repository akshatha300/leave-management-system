import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, CheckCircle, XCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const { data } = await api.get('/leaves/history');
        setLeaves(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeaves();
  }, []);

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;
  const totalAllowance = 15;
  const balance = totalAllowance - approvedCount;
  const recentLeaves = leaves.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-left duration-500">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent italic">
            Student Portal
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Welcome back. You have <span className="text-primary font-bold">{pendingCount}</span> pending requests.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/leave/apply')} 
          className="shrink-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
        >
          <FileText className="mr-2 h-5 w-5" />
          Request Leave
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom duration-700">
        <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="h-24 w-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-80">Remaining Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{balance} / {totalAllowance} Days</div>
            <div className="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-out" 
                style={{ width: `${(balance / totalAllowance) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] uppercase font-bold mt-2 opacity-70 tracking-widest">Semester Allowance</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-amber-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingCount}</div>
            <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1 uppercase">
              <TrendingUp className="h-3 w-3" /> Still in review
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-green-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Approved</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{approvedCount}</div>
            <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 uppercase">
              <TrendingUp className="h-3 w-3" /> Successfully authorized
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-destructive hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rejected</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{rejectedCount}</div>
            <p className="text-[10px] font-bold text-destructive mt-1 uppercase">Reviewed applications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom duration-1000">
        <Card className="col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Activity History</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentLeaves.length === 0 ? (
                <div className="p-10 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                  <div className="text-muted-foreground text-sm font-medium">No recent leave requests found.</div>
                </div>
              ) : (
                recentLeaves.map((leave: any) => (
                  <div key={leave._id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110
                        ${leave.status === 'Approved' ? 'bg-green-500/10' : leave.status === 'Rejected' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                        {leave.status === 'Approved' ? <CheckCircle className="h-6 w-6 text-green-600" /> : 
                         leave.status === 'Rejected' ? <XCircle className="h-6 w-6 text-red-600" /> : 
                         <Clock className="h-6 w-6 text-amber-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{leave.type}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter
                      ${leave.status === 'Approved' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 
                        leave.status === 'Rejected' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                      {leave.status}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-muted/10 border-t border-border/10 text-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/leave/history')} className="text-xs font-bold text-primary hover:bg-primary/5 capitalize">
                View detailed history →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <TrendingUp className="h-48 w-48" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Smart Insights</CardTitle>
            <p className="text-xs text-muted-foreground font-medium italic">Based on your leave patterns</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 relative group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary">Attendance Goal</div>
                  <div className="text-xs font-bold text-primary">85% Safe</div>
                </div>
                <div className="text-sm font-bold text-foreground leading-snug">
                  You have used <span className="text-primary">{approvedCount} days</span> this semester. Try to keep casual leaves under 3 more days to maintain optimality.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Upcoming Focus</div>
                <div className="text-sm font-bold text-foreground opacity-80">
                  Semester exams start in <span className="text-amber-600">22 days</span>. Aim for zero sick leaves during the period.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
