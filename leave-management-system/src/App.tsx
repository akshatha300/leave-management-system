import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import StudentDashboard from '@/pages/StudentDashboard';
import ProfessorDashboard from '@/pages/ProfessorDashboard';
import HodDashboard from '@/pages/HodDashboard';
import PrincipalDashboard from '@/pages/PrincipalDashboard';
import ManageUsers from '@/pages/ManageUsers';
import LeaveApplication from '@/pages/LeaveApplication';
import LeaveHistory from '@/pages/LeaveHistory';
import LeaveApproval from '@/pages/LeaveApproval';

const Unauthorized = () => <div>Unauthorized</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            
            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Professor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Professor']} />}>
              <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            </Route>

            {/* HOD Routes */}
            <Route element={<ProtectedRoute allowedRoles={['HOD']} />}>
              <Route path="/hod/dashboard" element={<HodDashboard />} />
            </Route>

            {/* Principal Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Principal']} />}>
              <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
              <Route path="/manage-users" element={<ManageUsers />} />
            </Route>
            
            {/* Shared Feature Routes */}
            <Route path="/leave/apply" element={<LeaveApplication />} />
            <Route path="/leave/history" element={<LeaveHistory />} />
            <Route element={<ProtectedRoute allowedRoles={['Professor', 'HOD', 'Principal']} />}>
              <Route path="/leave/approvals" element={<LeaveApproval />} />
            </Route>
            
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
