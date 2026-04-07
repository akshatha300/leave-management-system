import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, FileCheck, AlertCircle, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function ProfessorDashboard() {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/leaves/pending');
        setPendingApprovals(data);
      } catch (err) {
        console.error(err);
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
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">
            Professor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Welcome back. There are <span className="text-amber-600 font-bold">{pendingCount}</span> students awaiting your approval.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/leave/apply')} 
          variant="outline"
          className="shrink-0 border-primary/20 hover:bg-primary/5 h-12 px-6 rounded-xl font-bold transition-all shadow-sm"
        >
          Apply Personal Leave
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom duration-700">
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-amber-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">To Action</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingCount}</div>
            <p className="text-[10px] font-bold text-amber-600 mt-1 uppercase tracking-tighter">Student requests pending</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-primary hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">My Balance</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">18 Days</div>
            <p className="text-[10px] font-bold text-primary mt-1 uppercase">Annual leave remaining</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-blue-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Leaves</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">12</div>
            <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase">Department students away</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-t-4 border-green-500 hover:shadow-2xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Processed</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <FileCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">42</div>
            <p className="text-[10px] font-bold text-green-600 mt-1 uppercase">Total semester approvals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom duration-1000">
        <Card className="col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Priority Approvals</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentLeaves.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="text-muted-foreground font-bold italic">All student requests are up to date!</div>
                </div>
              ) : recentLeaves.map((leave: any) => (
                <div key={leave._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors group gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-sm group-hover:rotate-12 transition-transform">
                      {leave.applicant?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{leave.applicant?.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {leave.type} • {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button onClick={() => navigate('/leave/approve')} variant="ghost" size="sm" className="flex-1 sm:flex-none text-primary font-bold text-xs h-9 hover:bg-primary/5">
                      Review <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col justify-center items-center p-8 text-center bg-gradient-to-br from-muted/50 to-muted">
           <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-10 w-10 text-primary opacity-50" />
           </div>
           <h3 className="font-bold text-lg">Department Schedule</h3>
           <p className="text-sm text-muted-foreground mt-2 max-w-[240px]">
             The full department leave calendar is syncronized with the University ERP.
           </p>
           <Button variant="outline" className="mt-6 border-primary/20 text-primary font-bold rounded-xl h-10">
              Open Full Calendar
           </Button>
        </Card>
      </div>
    </div>
  );
}
