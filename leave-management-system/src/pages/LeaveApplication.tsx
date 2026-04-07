import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import api from '@/services/api';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';

export default function LeaveApplication() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Date Validation
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (start < today) {
      setMessage('Start date cannot be in the past.');
      setIsLoading(false);
      return;
    }

    if (end < start) {
      setMessage('End date cannot be before start date.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/leaves/apply', formData);
      setIsSuccess(true);
      // Auto-navigate back after 5 seconds if they don't click anything
      setTimeout(() => navigate(-1), 5000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error applying for leave.');
    } finally {
      setIsLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-20 animate-in zoom-in duration-500">
        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-md text-center p-10 space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black text-foreground">Request Sent!</CardTitle>
            <CardDescription className="text-base font-medium">
              Your leave application for <span className="text-primary font-bold">{formData.type}</span> has been submitted successfully.
            </CardDescription>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl text-left border border-border/50">
            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
              <Calendar className="h-3 w-3" /> Duration
            </div>
            <div className="text-sm font-bold">
              {new Date(formData.startDate).toLocaleDateString()} — {new Date(formData.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="space-y-3 pt-4">
            <Button onClick={() => navigate(-1)} className="w-full h-12 font-bold shadow-lg shadow-primary/20">
              Go to Dashboard
            </Button>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
              Redirecting automatically in 5s...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Apply for Leave</h1>
          <p className="text-muted-foreground mt-1">Submit your request for administrative review.</p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="h-2 bg-primary/20 w-full"></div>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Leave Details</CardTitle>
          <CardDescription>All fields are required unless marked otherwise.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {message && (
              <div className={`p-4 text-sm rounded-lg flex items-center gap-3 font-medium transition-all
                ${message.includes('successfully') ? 'bg-green-500/10 text-green-600 border border-green-200' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                <div className={`h-2 w-2 rounded-full ${message.includes('successfully') ? 'bg-green-500' : 'bg-destructive'}`}></div>
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type of Leave</label>
              <select 
                className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-colors focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Annual Leave</option>
                <option>Conference Leave</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start Date</label>
                <Input 
                  type="date" 
                  min={todayStr}
                  className="h-11 bg-background/50 focus:ring-4 focus:ring-primary/5 transition-all"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End Date</label>
                <Input 
                  type="date" 
                  min={formData.startDate || todayStr}
                  className="h-11 bg-background/50 focus:ring-4 focus:ring-primary/5 transition-all"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reason for Application</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-colors focus:border-primary/40 focus:ring-4 focus:ring-primary/5 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Explain the reason for your leave request..."
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Supporting Documents (Optional)</label>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer bg-muted/5">
                <Input type="file" className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-sm font-semibold text-primary">Click to upload</div>
                  <div className="text-xs text-muted-foreground mt-1">PDF, JPG up to 5MB</div>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch p-6 bg-muted/20 border-t border-border/50 gap-4">
            {user?.approver && (
              <div className="text-xs bg-primary/5 p-3 rounded-lg border border-primary/10 flex items-center justify-between">
                <span className="text-muted-foreground font-medium uppercase tracking-wider">Designated Approver:</span>
                <span className="font-bold text-primary">{user.approver.name} ({user.approver.role})</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Button variant="ghost" type="button" onClick={() => window.history.back()} className="font-semibold">Back</Button>
              <Button type="submit" disabled={isLoading} className="h-11 px-8 bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold">
                {isLoading ? 'Processing...' : 'Submit Request'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
