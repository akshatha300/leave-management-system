import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import api from '@/services/api';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    department: '',
    approver: ''
  });
  
  const [availableApprovers, setAvailableApprovers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproversLoading, setIsApproversLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableApprovers = async () => {
      if (!formData.role || (formData.role !== 'Principal' && !formData.department)) {
        setAvailableApprovers([]);
        return;
      }

      setIsApproversLoading(true);
      try {
        // Use the public auth endpoint for available approvers
        const { data } = await api.get('/auth/available-approvers', {
          params: { 
            role: formData.role, 
            department: formData.department 
          }
        });
        setAvailableApprovers(data);
        
        // Auto-assign if only one option exists (like Principal for HODs)
        if (data.length === 1) {
          setFormData(prev => ({ ...prev, approver: data[0]._id }));
        } else {
          setFormData(prev => ({ ...prev, approver: '' }));
        }
      } catch (err) {
        console.error('Failed to fetch available approvers', err);
      } finally {
        setIsApproversLoading(false);
      }
    };

    fetchAvailableApprovers();
  }, [formData.role, formData.department]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.role !== 'Principal' && !formData.approver && availableApprovers.length > 0) {
      setError('Please select a supervisor/approver.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', formData);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-card/80 backdrop-blur-md animate-in zoom-in duration-300">
          <CardContent className="pt-10 pb-10 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Registration Successful!</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Your account has been created. Redirecting you to the login page...
            </CardDescription>
            <Button onClick={() => navigate('/login')} className="w-full mt-4">Login Now</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-card/80 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          </div>
          <CardDescription className="text-base">
            Join the University Leave Management System
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive" className="animate-in head-shake duration-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@ums.edu" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="bg-background/50"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select value={formData.role} onValueChange={(val: string) => setFormData({...formData, role: val, approver: ''})}>
                  <SelectTrigger id="role" className="bg-background/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="HOD">HOD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(val: string) => setFormData({...formData, department: val, approver: ''})}>
                  <SelectTrigger id="department" className="bg-background/50">
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

            <div className="space-y-2">
              <Label htmlFor="approver">Designated Supervisor (Approver)</Label>
              <Select 
                disabled={!formData.department || isApproversLoading}
                value={formData.approver} 
                onValueChange={(val: string) => setFormData({...formData, approver: val})}
              >
                <SelectTrigger id="approver" className="bg-background/50">
                  <SelectValue placeholder={isApproversLoading ? "Loading..." : "Select who will approve your leaves"} />
                </SelectTrigger>
                <SelectContent>
                  {availableApprovers.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center italic">
                      {!formData.department ? "Select a department first" : "No eligible approvers found. Contact admin."}
                    </div>
                  ) : (
                    availableApprovers.map((a) => (
                      <SelectItem key={a._id} value={a._id}>{a.name} ({a.role})</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground mt-1 px-1 italic">
                * Students must pick a Professor. Professors must pick an HOD.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
