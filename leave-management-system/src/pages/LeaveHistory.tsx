import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

import api from '@/services/api';

interface LeaveRecord {
  _id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function LeaveHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get('/leaves/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching leaves', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const filteredHistory = history.filter(item => 
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave History</h1>
          <p className="text-muted-foreground mt-1">View your past and pending leave requests.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Records</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left font-medium text-muted-foreground">
                  <th className="p-4">Leave ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item._id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">...{item._id.substring(item._id.length - 6)}</td>
                    <td className="p-4 font-medium">{item.type}</td>
                    <td className="p-4">{new Date(item.startDate).toLocaleDateString()}</td>
                    <td className="p-4">{new Date(item.endDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing 1 to {filteredHistory.length} of {filteredHistory.length} entries
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
