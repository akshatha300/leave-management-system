import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import api from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  approver?: {
    _id: string;
    name: string;
    role: string;
  };
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  
  // password state for create/edit
  const [password, setPassword] = useState('');

  // Available approvers for current role selection
  const [availableApprovers, setAvailableApprovers] = useState<User[]>([]);
  const [isApproversLoading, setIsApproversLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAvailableApprovers = async () => {
      if (!currentUser.role || (currentUser.role !== 'Principal' && !currentUser.department)) {
        setAvailableApprovers([]);
        return;
      }

      setIsApproversLoading(true);
      try {
        const { data } = await api.get('/users/available-approvers', {
          params: { 
            role: currentUser.role, 
            department: currentUser.department 
          }
        });
        setAvailableApprovers(data);
        
        // Auto-assign if only one principal exists for HODs
        if (currentUser.role === 'HOD' && data.length === 1 && !currentUser.approver) {
          setCurrentUser(prev => ({ ...prev, approver: data[0] }));
        }
      } catch (err) {
        console.error('Failed to fetch available approvers', err);
      } finally {
        setIsApproversLoading(false);
      }
    };

    fetchAvailableApprovers();
  }, [currentUser.role, currentUser.department]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentUser({ role: 'Student' });
    setPassword('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setIsEditing(true);
    setCurrentUser(user);
    setPassword(''); // leave blank for edit unless they want to change it
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      if (isEditing) {
        if (!currentUser._id) return;
        const payload: any = { ...currentUser };
        if (password) payload.password = password;
        
        const { data } = await api.put(`/users/${currentUser._id}`, payload);
        setUsers(users.map(u => (u._id === data._id ? data : u)));
      } else {
        if (!password) {
          setError('Password is required for new users');
          return;
        }
        const payload = { ...currentUser, password, approver: currentUser.approver?._id || currentUser.approver };
        const { data } = await api.post('/users', payload);
        setUsers([...users, data]);
      }
      setIsModalOpen(false);
      fetchUsers(); // Refresh to get populated approvers
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground mt-1 font-medium">Add, edit, or remove staff and student accounts.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Directory
          </CardTitle>
          <CardDescription>All active accounts in the system</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Department</th>
                  <th className="px-6 py-4 font-bold">Supervisor/Approver</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center animate-pulse text-muted-foreground">Loading...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{user.department || '-'}</td>
                      <td className="px-6 py-4">
                        {user.approver ? (
                          <div className="flex flex-col">
                            <span className="text-foreground font-medium">{user.approver.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{user.approver.role}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(user._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name" 
                value={currentUser.name || ''} 
                onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={currentUser.email || ''} 
                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder={isEditing ? 'Leave blank to keep current' : ''}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <div className="col-span-3">
                <Select value={currentUser.role} onValueChange={(val: string) => setCurrentUser({...currentUser, role: val, department: val === 'Principal' ? undefined : currentUser.department})}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="HOD">HOD</SelectItem>
                    <SelectItem value="Principal">Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {currentUser.role !== 'Principal' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                <div className="col-span-3">
                  <Select value={currentUser.department} onValueChange={(val: string) => setCurrentUser({...currentUser, department: val})}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentUser.role !== 'Principal' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="approver" className="text-right">Approver</Label>
                <div className="col-span-3">
                  <Select 
                    value={typeof currentUser.approver === 'object' ? currentUser.approver?._id : currentUser.approver} 
                    onValueChange={(val: string) => setCurrentUser({...currentUser, approver: availableApprovers.find(a => a._id === val)})}
                  >
                    <SelectTrigger id="approver">
                      <SelectValue placeholder={isApproversLoading ? "Loading..." : "Select supervisor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableApprovers.length === 0 ? (
                        <div className="p-2 text-xs text-muted-foreground">No eligible approvers found in this department.</div>
                      ) : (
                        availableApprovers.map((a) => (
                          <SelectItem key={a._id} value={a._id}>{a.name} ({a.role})</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Create User'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
