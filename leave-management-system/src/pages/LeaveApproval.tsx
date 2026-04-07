import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import api from '@/services/api';

interface ApprovalRecord {
  _id: string;
  applicant: {
    name: string;
    role: string;
    department: string;
  };
  type: string;
  startDate: string;
  endDate: string;
}

export default function LeaveApproval() {
  const [searchTerm, setSearchTerm] = useState('');
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPending = async () => {
    try {
      const res = await api.get('/leaves/pending');
      setApprovals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
    if (!remarks && status === 'Rejected') {
      alert('Please provide a reason for rejection in the remarks field.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/leaves/approve/${id}`, { status, remarks });
      setProcessingId(null);
      setRemarks('');
      // Refresh list
      fetchPending();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = approvals.filter(item => 
    item.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.applicant?.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Leave Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and manage pending leave requests from your department.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-700">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Pending Requests</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or dept..." 
                  className="pl-9 bg-background/50 border-border/50 focus:ring-primary/20" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="border-border/50 hover:bg-accent/50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="text-left font-medium text-muted-foreground border-b border-border/50">
                  <th className="p-4 pl-6 uppercase tracking-wider text-[10px] font-bold">Applicant</th>
                  <th className="p-4 uppercase tracking-wider text-[10px] font-bold">Role / Dept</th>
                  <th className="p-4 uppercase tracking-wider text-[10px] font-bold">Leave Type</th>
                  <th className="p-4 uppercase tracking-wider text-[10px] font-bold">Duration</th>
                  <th className="p-4 pr-6 text-right uppercase tracking-wider text-[10px] font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr className={`group transition-colors hover:bg-accent/5 pb-0 ${processingId === item._id ? 'bg-primary/5' : ''}`}>
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-foreground">{item.applicant?.name}</div>
                        <div className="text-[10px] text-muted-foreground mono mt-0.5 uppercase tracking-tighter opacity-60">ID: ...{item._id.substring(item._id.length - 6)}</div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary mb-1">
                          {item.applicant?.role}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">{item.applicant?.department}</div>
                      </td>
                      <td className="p-4 font-medium">
                        <span className="px-2 py-1 bg-muted rounded-md text-xs">{item.type}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-semibold">{new Date(item.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(item.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Year: {new Date(item.startDate).getFullYear()}</div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {processingId === item._id ? (
                          <Button variant="ghost" size="sm" onClick={() => setProcessingId(null)} className="text-muted-foreground h-8 px-3">Cancel</Button>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button 
                              onClick={() => setProcessingId(item._id)} 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-4 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-semibold"
                            >
                              Review
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {processingId === item._id && (
                      <tr className="bg-primary/5 border-b border-border/50 animate-in slide-in-from-top-1 duration-200">
                        <td colSpan={5} className="p-6 pt-2">
                          <div className="bg-background/80 p-4 rounded-lg border border-primary/10 shadow-sm space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <span className="h-1 w-1 bg-primary rounded-full"></span>
                                Decision Remarks
                              </label>
                              <textarea 
                                placeholder="Add comments for the applicant... (Required for rejection)" 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/30"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                              <Button 
                                onClick={() => handleAction(item._id, 'Rejected')} 
                                disabled={isSubmitting}
                                variant="outline" 
                                className="h-9 px-6 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all font-semibold"
                              >
                                {isSubmitting ? '...' : 'Reject Application'}
                              </Button>
                              <Button 
                                onClick={() => handleAction(item._id, 'Approved')} 
                                disabled={isSubmitting}
                                className="h-9 px-6 bg-green-600 hover:bg-green-700 text-white transition-all shadow-md shadow-green-200 font-semibold"
                              >
                                {isSubmitting ? '...' : 'Approve Leave'}
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No pending requests to review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
