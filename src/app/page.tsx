'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Plus,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Camera,
  Mic,
  Monitor,
  Smartphone,
  Bluetooth,
  Clipboard,
  Play,
  Trash2,
  Edit,
  Search,
  Filter,
  Download,
  RefreshCw,
  Code,
  Brain,
  BookOpen,
  Award,
  BarChart3,
  Users,
  AlertCircle,
  ChevronRight,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore, getInitial, StudentUser, AdminUser } from '@/lib/auth-store';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

// Types
type Page = 
  | 'splash' 
  | 'role-selection' 
  | 'student-login' 
  | 'student-register' 
  | 'admin-login' 
  | 'admin-register'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'system-check'
  | 'exam'
  | 'exam-key-verification';

interface Test {
  id: string;
  name: string;
  type: string;
  timeLimit: number;
  totalMarks: number;
  status: string;
  examType: string;
  questions: string;
  createdAt: string;
  resultId?: string;
  marksScored?: number;
  riskScore?: number;
  flagStatus?: string;
}

interface TestResult {
  id: string;
  studentId: string;
  testId: string;
  marksScored: number;
  riskScore: number;
  flagStatus: string;
  startedAt: string | null;
  completedAt: string | null;
  student?: {
    fullName: string;
    email: string;
    collegeName: string;
    department: string;
    studentId: string;
  };
  test?: {
    name: string;
    timeLimit: number;
    totalMarks: number;
  };
  proctoringLogs?: ProctoringLog[];
}

interface ProctoringLog {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  riskPoints: number;
  severity: string;
}

interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'coding';
  options?: string[];
  correctAnswer?: string;
  codeTemplate?: string;
  language?: string;
}

// Helper to compute initial page
function getInitialPage(isAuthenticated: boolean, userType: 'student' | 'admin' | null): Page {
  if (isAuthenticated) {
    if (userType === 'student') return 'student-dashboard';
    if (userType === 'admin') return 'admin-dashboard';
  }
  return 'splash';
}

export default function VeritasAI() {
  const { user, userType, isAuthenticated, setUser, logout } = useAuthStore();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<Page>(() => getInitialPage(isAuthenticated, userType));
  const [splashComplete, setSplashComplete] = useState(isAuthenticated); // Skip splash if already logged in

  // Handle splash screen timer
  useEffect(() => {
    if (!isAuthenticated && currentPage === 'splash') {
      const timer = setTimeout(() => {
        setSplashComplete(true);
        setCurrentPage('role-selection');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, currentPage]);

  const handleLogout = () => {
    logout();
    if (userType === 'student') {
      setCurrentPage('student-login');
    } else {
      setCurrentPage('admin-login');
    }
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF]">
      <AnimatePresence mode="wait">
        {currentPage === 'splash' && <SplashScreen key="splash" />}
        {currentPage === 'role-selection' && (
          <RoleSelection key="role" onSelect={(role) => navigateTo(role === 'student' ? 'student-login' : 'admin-login')} />
        )}
        {currentPage === 'student-login' && (
          <StudentLogin 
            key="student-login" 
            onBack={() => navigateTo('role-selection')}
            onRegister={() => navigateTo('student-register')}
            onSuccess={() => navigateTo('student-dashboard')}
          />
        )}
        {currentPage === 'student-register' && (
          <StudentRegister 
            key="student-register" 
            onBack={() => navigateTo('role-selection')}
            onLogin={() => navigateTo('student-login')}
            onSuccess={() => navigateTo('student-dashboard')}
          />
        )}
        {currentPage === 'admin-login' && (
          <AdminLogin 
            key="admin-login" 
            onBack={() => navigateTo('role-selection')}
            onRegister={() => navigateTo('admin-register')}
            onSuccess={() => navigateTo('admin-dashboard')}
          />
        )}
        {currentPage === 'admin-register' && (
          <AdminRegister 
            key="admin-register" 
            onBack={() => navigateTo('role-selection')}
            onLogin={() => navigateTo('admin-login')}
            onSuccess={() => navigateTo('admin-dashboard')}
          />
        )}
        {currentPage === 'student-dashboard' && (
          <StudentDashboard 
            key="student-dashboard" 
            onLogout={handleLogout}
            onStartTest={(test) => navigateTo('exam-key-verification')}
          />
        )}
        {currentPage === 'admin-dashboard' && (
          <AdminDashboard 
            key="admin-dashboard" 
            onLogout={handleLogout}
          />
        )}
        {currentPage === 'system-check' && (
          <SystemCheck 
            key="system-check"
            onBack={() => navigateTo('student-dashboard')}
            onVerified={() => navigateTo('exam')}
          />
        )}
        {currentPage === 'exam-key-verification' && (
          <ExamKeyVerification 
            key="exam-key"
            onBack={() => navigateTo('student-dashboard')}
            onVerified={() => navigateTo('system-check')}
          />
        )}
        {currentPage === 'exam' && (
          <ExamEnvironment 
            key="exam"
            onComplete={() => navigateTo('student-dashboard')}
          />
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

// ================== SPLASH SCREEN ==================
function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-4"
        >
          <Shield className="w-16 h-16 text-white" />
        </motion.div>
        <h1 className="text-5xl font-bold text-white mb-2">Veritas AI</h1>
        <p className="text-white/80 text-lg">AI-Powered Exam Proctoring</p>
      </motion.div>
    </motion.div>
  );
}

// ================== ROLE SELECTION ==================
function RoleSelection({ onSelect }: { onSelect: (role: 'student' | 'admin') => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF] p-4"
    >
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Shield className="w-12 h-12 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Veritas AI</h1>
          <p className="text-white/80">Select your role to continue</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/95 backdrop-blur border-0"
              onClick={() => onSelect('student')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4CA1AF] to-[#2C3E50] mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-[#2C3E50]">Student</CardTitle>
                <CardDescription>Take proctored exams and view your results</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white hover:opacity-90">
                  Continue as Student
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/95 backdrop-blur border-0"
              onClick={() => onSelect('admin')}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF] mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-[#2C3E50]">Admin</CardTitle>
                <CardDescription>Create tests, monitor exams, and view reports</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full bg-gradient-to-r from-[#2C3E50] to-[#4CA1AF] text-white hover:opacity-90">
                  Continue as Admin
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ================== AUTH WRAPPER ==================
function AuthWrapper({ 
  children, 
  title, 
  subtitle, 
  onBack 
}: { 
  children: React.ReactNode; 
  title: string; 
  subtitle: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF] p-4"
    >
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="text-white mb-4 hover:bg-white/10"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Button>
        <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader className="text-center">
            <Shield className="w-10 h-10 text-[#4CA1AF] mx-auto mb-2" />
            <CardTitle className="text-2xl text-[#2C3E50]">{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// ================== STUDENT LOGIN ==================
function StudentLogin({ onBack, onRegister, onSuccess }: { onBack: () => void; onRegister: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      setUser({
        id: data.student.id,
        fullName: data.student.fullName,
        email: data.student.email,
        collegeName: data.student.collegeName,
        department: data.student.department,
        studentId: data.student.studentId,
        role: 'student'
      }, 'student');

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${data.student.fullName}`,
      });

      onSuccess();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper title="Student Login" subtitle="Enter your credentials to continue" onBack={onBack}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="student@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Login
        </Button>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Button variant="link" className="p-0 text-[#4CA1AF]" onClick={onRegister}>
            Register
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
}

// ================== STUDENT REGISTER ==================
function StudentRegister({ onBack, onLogin, onSuccess }: { onBack: () => void; onLogin: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    department: '',
    studentId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setUser({
        id: data.student.id,
        fullName: data.student.fullName,
        email: data.student.email,
        collegeName: data.student.collegeName,
        department: data.student.department,
        studentId: data.student.studentId,
        role: 'student'
      }, 'student');

      toast({
        title: 'Registration Successful!',
        description: 'Your account has been created.',
      });

      onSuccess();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper title="Student Registration" subtitle="Create your student account" onBack={onBack}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="student@college.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
          {showPassword ? 'Hide' : 'Show'} passwords
        </Button>

        <div className="space-y-2">
          <Label htmlFor="collegeName">College Name *</Label>
          <Input
            id="collegeName"
            name="collegeName"
            placeholder="University of Technology"
            value={formData.collegeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              name="department"
              placeholder="Computer Science"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID *</Label>
            <Input
              id="studentId"
              name="studentId"
              placeholder="STU2024001"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Register
        </Button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Button variant="link" className="p-0 text-[#4CA1AF]" onClick={onLogin}>
            Login
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
}

// ================== ADMIN LOGIN ==================
function AdminLogin({ onBack, onRegister, onSuccess }: { onBack: () => void; onRegister: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      setUser({
        id: data.admin.id,
        fullName: data.admin.fullName,
        email: data.admin.email,
        organizationName: data.admin.organizationName,
        role: data.admin.role,
        department: data.admin.department,
        contactNumber: data.admin.contactNumber,
        userType: 'admin'
      }, 'admin');

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${data.admin.fullName}`,
      });

      onSuccess();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper title="Admin Login" subtitle="Enter your credentials to continue" onBack={onBack}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@institution.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#2C3E50] to-[#4CA1AF] text-white"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Login
        </Button>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Button variant="link" className="p-0 text-[#4CA1AF]" onClick={onRegister}>
            Register
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
}

// ================== ADMIN REGISTER ==================
function AdminRegister({ onBack, onLogin, onSuccess }: { onBack: () => void; onLogin: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    role: '',
    department: '',
    contactNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setUser({
        id: data.admin.id,
        fullName: data.admin.fullName,
        email: data.admin.email,
        organizationName: data.admin.organizationName,
        role: data.admin.role,
        department: data.admin.department,
        contactNumber: data.admin.contactNumber,
        userType: 'admin'
      }, 'admin');

      toast({
        title: 'Registration Successful!',
        description: 'Your admin account has been created.',
      });

      onSuccess();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper title="Admin Registration" subtitle="Create your admin account" onBack={onBack}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Dr. Jane Smith"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@institution.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
          {showPassword ? 'Hide' : 'Show'} passwords
        </Button>

        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization / Institution Name *</Label>
          <Input
            id="organizationName"
            name="organizationName"
            placeholder="University of Technology"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select name="role" value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Instructor">Instructor</SelectItem>
                <SelectItem value="Exam Controller">Exam Controller</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              name="department"
              placeholder="Computer Science"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            placeholder="+1 234 567 8900"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#2C3E50] to-[#4CA1AF] text-white"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Register
        </Button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Button variant="link" className="p-0 text-[#4CA1AF]" onClick={onLogin}>
            Login
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
}

// ================== DASHBOARD HEADER ==================
function DashboardHeader({ onLogout, userType }: { onLogout: () => void; userType: 'student' | 'admin' }) {
  const { user } = useAuthStore();
  const userName = user?.fullName || 'User';
  const initial = getInitial(userName);

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-[#4CA1AF]" />
          <span className="text-xl font-bold bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] bg-clip-text text-transparent">
            Veritas AI
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4CA1AF] to-[#2C3E50] flex items-center justify-center text-white font-semibold">
                {initial}
              </div>
              <span className="hidden md:inline font-medium">{userName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm text-gray-500">
              {userType === 'student' ? 'Student Account' : 'Admin Account'}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ================== STUDENT DASHBOARD ==================
function StudentDashboard({ onLogout, onStartTest }: { onLogout: () => void; onStartTest: (test: Test) => void }) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [tests, setTests] = useState<{ upcoming: Test[]; ongoing: Test[]; completed: Test[] }>({
    upcoming: [],
    ongoing: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [examKey, setExamKey] = useState('');
  const [keyDialog, setKeyDialog] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch(`/api/tests?studentId=${(user as StudentUser)?.id}`);
      const data = await res.json();
      setTests({
        upcoming: data.upcoming || [],
        ongoing: data.ongoing || [],
        completed: data.completed || []
      });
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (test: Test) => {
    setSelectedTest(test);
    setGeneratingKey(true);
    setKeyDialog(true);
    
    try {
      const res = await fetch('/api/exam-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test.id,
          studentId: (user as StudentUser)?.id
        })
      });
      
      const data = await res.json();
      setExamKey(data.key);
      
      toast({
        title: 'Exam Key Generated',
        description: 'A unique exam key has been sent to your registered email.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate exam key',
        variant: 'destructive'
      });
    } finally {
      setGeneratingKey(false);
    }
  };

  const TestCard = ({ test, status }: { test: Test; status: 'upcoming' | 'ongoing' | 'completed' }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{test.name}</h3>
            <p className="text-sm text-gray-500">{test.type} • {test.totalMarks} marks</p>
          </div>
          <Badge variant={
            status === 'completed' ? 'default' :
            status === 'ongoing' ? 'secondary' : 'outline'
          }>
            {status === 'completed' ? 'Completed' : status === 'ongoing' ? 'In Progress' : 'Upcoming'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {test.timeLimit} mins
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {test.type}
          </div>
        </div>

        {status === 'completed' && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Score</span>
                <span className="font-medium">{test.marksScored}/{test.totalMarks}</span>
              </div>
              <Progress value={(test.marksScored! / test.totalMarks) * 100} className="h-2" />
            </div>
            {test.flagStatus === 'Red Flag' && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Flagged
              </Badge>
            )}
          </div>
        )}

        {status === 'upcoming' && (
          <Button 
            className="w-full bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
            onClick={() => handleStartTest(test)}
          >
            <Play className="w-4 h-4 mr-2" />
            Start Test
          </Button>
        )}

        {status === 'ongoing' && (
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => handleStartTest(test)}
          >
            Resume Test
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <DashboardHeader onLogout={onLogout} userType="student" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Here's an overview of your tests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Tests</p>
                <p className="text-2xl font-bold">{tests.upcoming.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Tests</p>
                <p className="text-2xl font-bold">{tests.completed.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold">
                  {tests.completed.length > 0 
                    ? Math.round(tests.completed.reduce((sum, t) => sum + (t.marksScored || 0), 0) / tests.completed.length)
                    : 0}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tests Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tests</CardTitle>
            <CardDescription>View and manage your test activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="ongoing">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4CA1AF]" />
                  </div>
                ) : tests.ongoing.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No ongoing tests at the moment
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {tests.ongoing.map((test) => (
                      <TestCard key={test.id} test={test} status="ongoing" />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upcoming">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4CA1AF]" />
                  </div>
                ) : tests.upcoming.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming tests scheduled
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {tests.upcoming.map((test) => (
                      <TestCard key={test.id} test={test} status="upcoming" />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4CA1AF]" />
                  </div>
                ) : tests.completed.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No completed tests yet
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {tests.completed.map((test) => (
                      <TestCard key={test.id} test={test} status="completed" />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Exam Key Dialog */}
      <Dialog open={keyDialog} onOpenChange={setKeyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start Test: {selectedTest?.name}</DialogTitle>
            <DialogDescription>
              An exam key has been generated and sent to your email. Enter the key below to start the test.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {generatingKey ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#4CA1AF]" />
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">Your Exam Key</p>
                  <p className="text-2xl font-mono font-bold text-[#2C3E50]">{examKey}</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter exam key"
                    value={examKey}
                    onChange={(e) => setExamKey(e.target.value.toUpperCase())}
                    className="text-center font-mono text-lg"
                  />
                  <Button 
                    className="bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
                    onClick={() => {
                      setKeyDialog(false);
                      onStartTest(selectedTest!);
                    }}
                  >
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  This key expires in 1 hour
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// ================== ADMIN DASHBOARD ==================
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'tests') {
      fetchTests();
    } else if (activeTab === 'results') {
      fetchResults();
    }
  }, [activeTab]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tests?adminId=${(user as AdminUser)?.id}`);
      const data = await res.json();
      setTests(data.tests || []);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/results?adminId=${(user as AdminUser)?.id}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (resultId: string) => {
    try {
      const res = await fetch(`/api/results?resultId=${resultId}`);
      const data = await res.json();
      setSelectedResult(data.result);
      setReportOpen(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load report',
        variant: 'destructive'
      });
    }
  };

  const toggleTestStatus = async (testId: string, newStatus: string) => {
    try {
      await fetch('/api/tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: testId, status: newStatus })
      });
      fetchTests();
      toast({
        title: 'Success',
        description: `Test ${newStatus === 'Active' ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update test',
        variant: 'destructive'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <DashboardHeader onLogout={onLogout} userType="admin" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C3E50]">
            Welcome, {user?.fullName}!
          </h1>
          <p className="text-gray-600">{(user as AdminUser)?.role} • {(user as AdminUser)?.organizationName}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-500">Full Name</Label>
                      <p className="font-medium">{user?.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Email</Label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Organization</Label>
                      <p className="font-medium">{(user as AdminUser)?.organizationName}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-500">Role</Label>
                      <p className="font-medium">{(user as AdminUser)?.role}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Department</Label>
                      <p className="font-medium">{(user as AdminUser)?.department}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Contact Number</Label>
                      <p className="font-medium">{(user as AdminUser)?.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Test Management</h2>
              <Button 
                className="bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
                onClick={() => setCreateTestOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Test
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#4CA1AF]" />
              </div>
            ) : tests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tests created yet. Click "Create Test" to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tests.map((test) => (
                  <Card key={test.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          test.type === 'MCQ' ? 'bg-blue-100 text-blue-600' :
                          test.type === 'Coding' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {test.type === 'MCQ' ? <FileText className="w-5 h-5" /> :
                           test.type === 'Coding' ? <Code className="w-5 h-5" /> :
                           <BookOpen className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{test.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{test.type}</span>
                            <span>•</span>
                            <span>{test.timeLimit} mins</span>
                            <span>•</span>
                            <span>{test.totalMarks} marks</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={test.status === 'Active' ? 'default' : 'secondary'}>
                          {test.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTestStatus(test.id, test.status === 'Active' ? 'Draft' : 'Active')}
                        >
                          {test.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Test Results</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#4CA1AF]" />
              </div>
            ) : results.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No test results yet.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.student?.fullName}</TableCell>
                        <TableCell>{result.student?.email}</TableCell>
                        <TableCell>{result.test?.name}</TableCell>
                        <TableCell>{result.marksScored}/{result.test?.totalMarks}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={result.riskScore} className="w-16 h-2" />
                            <span className={result.riskScore >= 50 ? 'text-red-600 font-medium' : ''}>
                              {result.riskScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            result.flagStatus === 'Red Flag' ? 'destructive' :
                            result.flagStatus === 'Warning' ? 'secondary' : 'default'
                          }>
                            {result.flagStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewReport(result.id)}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Test Dialog */}
      <CreateTestDialog 
        open={createTestOpen} 
        onOpenChange={setCreateTestOpen}
        onSuccess={() => {
          setCreateTestOpen(false);
          fetchTests();
        }}
      />

      {/* Detailed Report Dialog */}
      <DetailedReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        result={selectedResult}
      />
    </motion.div>
  );
}

// ================== CREATE TEST DIALOG ==================
function CreateTestDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const { user } = useAuthStore();
  const [testType, setTestType] = useState<'manual' | 'ai'>('manual');
  const [examType, setExamType] = useState<'MCQ' | 'Coding' | 'Theory'>('MCQ');
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    timeLimit: '60',
    totalMarks: '100',
    examMode: 'Closed-book',
    questions: [] as Question[]
  });

  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const generateAIQuestions = async () => {
    if (!aiTopic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for AI generation',
        variant: 'destructive'
      });
      return;
    }

    setGeneratingAI(true);
    try {
      // Simulate AI generation (in production, use actual AI API)
      const generatedQuestions: Question[] = [
        {
          id: '1',
          question: `What is the main concept of ${aiTopic}?`,
          type: 'mcq',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A'
        },
        {
          id: '2',
          question: `Explain the key principles of ${aiTopic}.`,
          type: 'mcq',
          options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
          correctAnswer: 'Answer B'
        },
        {
          id: '3',
          question: `Which of the following best describes ${aiTopic}?`,
          type: 'mcq',
          options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
          correctAnswer: 'Choice 3'
        }
      ];
      
      setFormData({ ...formData, questions: generatedQuestions });
      toast({
        title: 'Success',
        description: `Generated ${generatedQuestions.length} questions for ${aiTopic}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate questions',
        variant: 'destructive'
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Test name is required',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: examType,
          timeLimit: parseInt(formData.timeLimit),
          totalMarks: parseInt(formData.totalMarks),
          examType: formData.examMode,
          questions: formData.questions,
          createdBy: (user as AdminUser)?.id
        })
      });

      if (!res.ok) throw new Error('Failed to create test');

      toast({
        title: 'Success',
        description: 'Test created successfully'
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create test',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Create a new test manually or use AI to generate questions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Creation Mode */}
          <div className="flex gap-2">
            <Button
              variant={testType === 'manual' ? 'default' : 'outline'}
              onClick={() => setTestType('manual')}
              className={testType === 'manual' ? 'bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white' : ''}
            >
              <FileText className="w-4 h-4 mr-2" />
              Manual
            </Button>
            <Button
              variant={testType === 'ai' ? 'default' : 'outline'}
              onClick={() => setTestType('ai')}
              className={testType === 'ai' ? 'bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white' : ''}
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Generated
            </Button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Test Name *</Label>
              <Input
                placeholder="Midterm Exam"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <Select value={examType} onValueChange={(v: 'MCQ' | 'Coding' | 'Theory') => setExamType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Theory">Theory</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Time Limit (mins)</Label>
              <Input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Marks</Label>
              <Input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Exam Mode</Label>
              <Select value={formData.examMode} onValueChange={(v) => setFormData({ ...formData, examMode: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open-book">Open Book</SelectItem>
                  <SelectItem value="Closed-book">Closed Book</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* AI Generation Section */}
          {testType === 'ai' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">AI Question Generator</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input
                    placeholder="e.g., Data Structures, Machine Learning"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={aiDifficulty} onValueChange={(v: 'Easy' | 'Medium' | 'Hard') => setAiDifficulty(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={generateAIQuestions}
                disabled={generatingAI}
                className="w-full"
                variant="outline"
              >
                {generatingAI ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Generate Questions
              </Button>
            </div>
          )}

          {/* Questions Preview */}
          {formData.questions.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Questions ({formData.questions.length})</h4>
              <ScrollArea className="h-48 rounded border p-4">
                {formData.questions.map((q, idx) => (
                  <div key={q.id} className="mb-4 pb-4 border-b last:border-0">
                    <p className="font-medium">Q{idx + 1}: {q.question}</p>
                    {q.options && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {q.options.map((opt, i) => (
                          <div 
                            key={i} 
                            className={`text-sm p-2 rounded ${
                              opt === q.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-gray-50'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Create Test
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ================== DETAILED REPORT DIALOG ==================
function DetailedReportDialog({
  open,
  onOpenChange,
  result
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: TestResult | null;
}) {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detailed Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{result.student?.fullName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{result.student?.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">College</Label>
                  <p className="font-medium">{result.student?.collegeName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Department</Label>
                  <p className="font-medium">{result.student?.department}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Student ID</Label>
                  <p className="font-medium">{result.student?.studentId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Exam Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Test Name</Label>
                  <p className="font-medium">{result.test?.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Time Limit</Label>
                  <p className="font-medium">{result.test?.timeLimit} minutes</p>
                </div>
                <div>
                  <Label className="text-gray-500">Total Marks</Label>
                  <p className="font-medium">{result.test?.totalMarks}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Marks Scored</Label>
                  <p className="font-medium text-lg text-[#4CA1AF]">{result.marksScored}/{result.test?.totalMarks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proctoring Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#4CA1AF]" />
                Proctoring Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-gray-500">Risk Score</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress 
                      value={result.riskScore} 
                      className={`h-3 flex-1 ${
                        result.riskScore >= 50 ? 'bg-red-100' : 
                        result.riskScore >= 25 ? 'bg-yellow-100' : 'bg-green-100'
                      }`}
                    />
                    <span className={`font-bold text-lg ${
                      result.riskScore >= 50 ? 'text-red-600' : 
                      result.riskScore >= 25 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {result.riskScore}/100
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Flag Status</Label>
                  <Badge 
                    variant={
                      result.flagStatus === 'Red Flag' ? 'destructive' :
                      result.flagStatus === 'Warning' ? 'secondary' : 'default'
                    }
                    className="mt-1"
                  >
                    {result.flagStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Alerts & Activity Log */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                AI Generated Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.proctoringLogs && result.proctoringLogs.length > 0 ? (
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {result.proctoringLogs.map((log) => (
                      <div 
                        key={log.id}
                        className={`p-3 rounded-lg ${
                          log.severity === 'High' ? 'bg-red-50 border border-red-200' :
                          log.severity === 'Medium' ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{log.eventType}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              +{log.riskPoints} points
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{log.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>No suspicious activity detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ================== EXAM KEY VERIFICATION ==================
function ExamKeyVerification({ 
  onBack, 
  onVerified 
}: { 
  onBack: () => void; 
  onVerified: () => void;
}) {
  const [key, setKey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!key.trim()) {
      setError('Please enter the exam key');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const res = await fetch(`/api/exam-key?key=${key}&studentId=${(user as StudentUser)?.id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid key');
        return;
      }

      toast({
        title: 'Key Verified',
        description: 'Proceeding to system check...',
      });

      onVerified();
    } catch (error) {
      setError('Failed to verify key');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF] p-4"
    >
      <Card className="w-full max-w-md bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <Shield className="w-10 h-10 text-[#4CA1AF] mx-auto mb-2" />
          <CardTitle>Enter Exam Key</CardTitle>
          <CardDescription>
            Enter the unique key sent to your email to start the exam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Input
            placeholder="Enter 8-character key"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            className="text-center font-mono text-lg tracking-wider"
            maxLength={8}
          />

          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleVerify}
              disabled={verifying}
              className="flex-1 bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Verify & Start
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ================== SYSTEM CHECK ==================
function SystemCheck({ 
  onBack, 
  onVerified 
}: { 
  onBack: () => void; 
  onVerified: () => void;
}) {
  const [checks, setChecks] = useState([
    { id: 'camera', name: 'Camera Access', icon: Camera, status: 'pending' as 'pending' | 'checking' | 'passed' | 'failed' },
    { id: 'microphone', name: 'Microphone Access', icon: Mic, status: 'pending' as 'pending' | 'checking' | 'passed' | 'failed' },
    { id: 'screen', name: 'Screen Sharing', icon: Monitor, status: 'pending' as 'pending' | 'checking' | 'passed' | 'failed' },
    { id: 'fullscreen', name: 'Full-screen Mode', icon: Smartphone, status: 'pending' as 'pending' | 'checking' | 'passed' | 'failed' },
    { id: 'bluetooth', name: 'Bluetooth Disabled', icon: Bluetooth, status: 'pending' as 'pending' | 'checking' | 'passed' | 'failed' },
    { id: 'devices', name: 'No External Devices', icon: Smartphone, status: 'pending' as 'pending' | 'checking' | 'passed' | 'failed' },
    { id: 'apps', name: 'No Unauthorized Apps', icon: Clipboard, status: 'pending' as 'pending' | 'checking' | 'passed' | 'failed' },
  ]);

  const [checkingAll, setCheckingAll] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const runCheck = async (checkId: string) => {
    setChecks(prev => prev.map(c => 
      c.id === checkId ? { ...c, status: 'checking' } : c
    ));

    // Simulate check delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    try {
      let passed = false;

      switch (checkId) {
        case 'camera':
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            passed = true;
          } catch {
            passed = false;
          }
          break;
        case 'microphone':
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            passed = true;
          } catch {
            passed = false;
          }
          break;
        case 'screen':
          // Simulate screen share check
          passed = true;
          break;
        case 'fullscreen':
          // Simulate fullscreen check
          passed = true;
          break;
        case 'bluetooth':
          // Simulate bluetooth check (in production, use Web Bluetooth API)
          passed = true;
          break;
        case 'devices':
          // Simulate external device check
          passed = true;
          break;
        case 'apps':
          // Simulate app check
          passed = true;
          break;
      }

      setChecks(prev => prev.map(c => 
        c.id === checkId ? { ...c, status: passed ? 'passed' : 'failed' } : c
      ));
    } catch (error) {
      setChecks(prev => prev.map(c => 
        c.id === checkId ? { ...c, status: 'failed' } : c
      ));
    }
  };

  const runAllChecks = async () => {
    setCheckingAll(true);
    for (const check of checks) {
      await runCheck(check.id);
    }
    setCheckingAll(false);
  };

  const allPassed = checks.every(c => c.status === 'passed');
  const anyFailed = checks.some(c => c.status === 'failed');

  // Start checks when component mounts - using a ref to track if we've started
  const checksStartedRef = useRef(false);
  
  useEffect(() => {
    if (!checksStartedRef.current) {
      checksStartedRef.current = true;
      // Defer to next tick to avoid synchronous state updates
      const timeoutId = setTimeout(() => {
        runAllChecks();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-[#4CA1AF] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2C3E50]">System Verification</h1>
          <p className="text-gray-600">Please approve all system checks to start the exam</p>
        </div>

        {/* Camera Preview */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/50 text-white">
                <Camera className="w-3 h-3 mr-1" />
                Camera Preview
              </Badge>
            </div>
          </div>
        </Card>

        {/* Checks List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {checks.map((check) => {
                const Icon = check.icon;
                return (
                  <div 
                    key={check.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        check.status === 'passed' ? 'bg-green-100' :
                        check.status === 'failed' ? 'bg-red-100' :
                        check.status === 'checking' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        {check.status === 'checking' ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        ) : check.status === 'passed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : check.status === 'failed' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Icon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{check.name}</p>
                        <p className="text-sm text-gray-500">
                          {check.status === 'checking' ? 'Checking...' :
                           check.status === 'passed' ? 'Verified' :
                           check.status === 'failed' ? 'Failed - Please allow access' :
                           'Pending'}
                        </p>
                      </div>
                    </div>
                    {check.status === 'failed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => runCheck(check.id)}
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onVerified}
            disabled={!allPassed || checkingAll}
            className="flex-1 bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
          >
            {allPassed ? 'Start Exam' : checkingAll ? 'Checking...' : 'Complete All Checks'}
          </Button>
        </div>

        {anyFailed && !checkingAll && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some checks failed. Please allow the required permissions and retry.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </motion.div>
  );
}

// ================== EXAM ENVIRONMENT ==================
function ExamEnvironment({ onComplete }: { onComplete: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [riskScore, setRiskScore] = useState(0);
  const [alerts, setAlerts] = useState<{ message: string; time: Date }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Sample questions
  const questions: Question[] = [
    {
      id: '1',
      question: 'What is the time complexity of binary search?',
      type: 'mcq',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 'O(log n)'
    },
    {
      id: '2',
      question: 'Which data structure uses LIFO principle?',
      type: 'mcq',
      options: ['Queue', 'Stack', 'Array', 'Tree'],
      correctAnswer: 'Stack'
    },
    {
      id: '3',
      question: 'What does CPU stand for?',
      type: 'mcq',
      options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'],
      correctAnswer: 'Central Processing Unit'
    },
    {
      id: '4',
      question: 'Which of the following is not a programming paradigm?',
      type: 'mcq',
      options: ['Object-Oriented', 'Functional', 'Sequential', 'Procedural'],
      correctAnswer: 'Sequential'
    },
    {
      id: '5',
      question: 'What is the primary function of an operating system?',
      type: 'mcq',
      options: ['Run applications', 'Manage hardware resources', 'Connect to internet', 'Store data'],
      correctAnswer: 'Manage hardware resources'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  // Camera effect
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate random proctoring events
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.1) {
        // 10% chance of triggering an alert
        const events = [
          { message: 'Gaze movement detected', points: 5 },
          { message: 'Background noise detected', points: 2 },
          { message: 'Face not clearly visible', points: 10 },
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        
        setRiskScore(prev => Math.min(prev + event.points, 100));
        setAlerts(prev => [...prev, { message: event.message, time: new Date() }]);
        
        toast({
          title: '⚠ Alert',
          description: event.message,
          variant: 'destructive'
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submitted) {
        setRiskScore(prev => Math.min(prev + 15, 100));
        setAlerts(prev => [...prev, { message: 'Exited fullscreen mode', time: new Date() }]);
        toast({
          title: 'Warning',
          description: 'Please stay in fullscreen mode',
          variant: 'destructive'
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [submitted]);

  const handleSubmit = async () => {
    setSubmitted(true);
    
    // Calculate score
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const marksScored = Math.round((correct / questions.length) * 100);

    try {
      // Log proctoring events
      for (const alert of alerts) {
        await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log',
            resultId: 'temp', // In production, use actual result ID
            eventType: 'Suspicious Activity',
            description: alert.message,
            riskPoints: 5,
            severity: alert.message.includes('fullscreen') ? 'High' : 'Medium'
          })
        });
      }

      toast({
        title: 'Exam Submitted',
        description: `Your score: ${marksScored}/100`,
      });

      onComplete();
    } catch (error) {
      console.error('Failed to submit exam:', error);
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF] p-4"
      >
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exam Submitted</h2>
            <p className="text-gray-600 mb-4">Your responses have been recorded</p>
            <Button onClick={onComplete} className="bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100"
    >
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#4CA1AF]" />
            <span className="font-bold">Veritas AI Proctoring</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="font-mono text-xl font-bold text-red-500">
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={riskScore} className="w-24 h-2" />
              <span className={`text-sm font-medium ${riskScore >= 50 ? 'text-red-600' : riskScore >= 25 ? 'text-yellow-600' : 'text-green-600'}`}>
                Risk: {riskScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-4">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Question {currentQuestion + 1} of {questions.length}
                </CardTitle>
                <Badge variant="outline">
                  {questions[currentQuestion].type}
                </Badge>
              </div>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6">{questions[currentQuestion].question}</p>
              
              {questions[currentQuestion].options && (
                <div className="space-y-3">
                  {questions[currentQuestion].options!.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                        answers[questions[currentQuestion].id] === option
                          ? 'border-[#4CA1AF] bg-[#4CA1AF]/10'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestion].id}`}
                        value={option}
                        checked={answers[questions[currentQuestion].id] === option}
                        onChange={() => setAnswers({ ...answers, [questions[currentQuestion].id]: option })}
                        className="sr-only"
                      />
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 ${
                        answers[questions[currentQuestion].id] === option
                          ? 'border-[#4CA1AF] bg-[#4CA1AF] text-white'
                          : 'border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="bg-gradient-to-r from-[#4CA1AF] to-[#2C3E50] text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Proctoring Sidebar */}
        <div className="w-80 bg-white border-l p-4 hidden lg:block">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#4CA1AF]" />
            Proctoring Monitor
          </h3>

          {/* Camera Feed */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <Badge variant="secondary" className="absolute top-2 left-2 bg-black/50 text-white">
              <Camera className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>

          {/* Risk Score */}
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Risk Score</p>
                <div className={`text-3xl font-bold ${
                  riskScore >= 50 ? 'text-red-600' :
                  riskScore >= 25 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {riskScore}/100
                </div>
                <Progress 
                  value={riskScore} 
                  className={`h-3 mt-2 ${
                    riskScore >= 50 ? 'bg-red-100' : 
                    riskScore >= 25 ? 'bg-yellow-100' : 'bg-green-100'
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <div>
            <h4 className="font-medium mb-2 text-sm">Recent Alerts</h4>
            <ScrollArea className="h-32">
              {alerts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No alerts yet
                </p>
              ) : (
                <div className="space-y-2">
                  {alerts.slice(-5).reverse().map((alert, idx) => (
                    <div key={idx} className="text-xs p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">{alert.message}</p>
                      <p className="text-yellow-600">
                        {alert.time.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
