import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Mail, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Eye,
  Ban,
  Unlock,
  Key,
  LogOut,
  FileText,
  ExternalLink,
  TreePine,
  Satellite,
  BarChart3,
  Map,
  Home,
  Database
} from 'lucide-react';
import { authService } from '../utils/auth';
import { toast } from 'sonner@2.0.3';
import { GooglePlantationMap } from './GooglePlantationMap';
import { InteractiveMap } from './InteractiveMap';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const [pendingRes, usersRes, emailRes] = await Promise.all([
      authService.getPendingRegistrations(),
      authService.getApprovedUsers(),
      authService.getEmailLogs()
    ]);

    if (pendingRes.success) setPendingRegistrations(pendingRes.data);
    if (usersRes.success) setApprovedUsers(usersRes.data);
    if (emailRes.success) setEmailLogs(emailRes.data);
    
    setLoading(false);
  };

  const handleApprove = async (registrationId: string) => {
    const result = await authService.approveRegistration(registrationId);
    if (result.success) {
      toast.success('Registration approved successfully');
      loadData();
    } else {
      toast.error(result.message || 'Approval failed');
    }
  };

  const handleReject = async (registrationId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    const result = await authService.rejectRegistration(registrationId, rejectionReason);
    if (result.success) {
      toast.success('Registration rejected successfully');
      setRejectionReason('');
      setSelectedRegistration(null);
      loadData();
    } else {
      toast.error(result.message || 'Rejection failed');
    }
  };

  const handleToggleUserStatus = async (userId: string, banned: boolean) => {
    const result = await authService.toggleUserStatus(userId, banned);
    if (result.success) {
      toast.success(`User ${banned ? 'banned' : 'unbanned'} successfully`);
      loadData();
    } else {
      toast.error(result.message || 'Status update failed');
    }
  };

  const handleChangePassword = async (userId: string) => {
    if (!newPassword.trim()) {
      toast.error('Please enter a new password');
      return;
    }
    
    const result = await authService.changeUserPassword(userId, newPassword);
    if (result.success) {
      toast.success('Password changed successfully');
      setNewPassword('');
      setSelectedUser(null);
      loadData();
    } else {
      toast.error(result.message || 'Password change failed');
    }
  };

  const stats = [
    {
      title: 'Pending Registrations',
      value: pendingRegistrations.length,
      icon: Users,
      color: 'text-yellow-600'
    },
    {
      title: 'Approved Users',
      value: approvedUsers.length,
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      title: 'Patrons',
      value: approvedUsers.filter(u => u.userType === 'patron').length,
      icon: UserCheck,
      color: 'text-blue-600'
    },
    {
      title: 'Credit Clients',
      value: approvedUsers.filter(u => u.userType === 'creditClient').length,
      icon: UserCheck,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">BlueMercantile Administration Panel</p>
            </div>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approvals
              {pendingRegistrations.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {pendingRegistrations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">
              Approved Users
              {approvedUsers.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {approvedUsers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="plantations">
              <TreePine className="h-4 w-4 mr-1" />
              Track Plantations
              <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                6
              </span>
            </TabsTrigger>
            <TabsTrigger value="emails">
              Email Logs
              {emailLogs.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {emailLogs.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Registration Approvals</CardTitle>
                <CardDescription>
                  Review and approve or reject user registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRegistrations.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending registrations</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>{registration.fullName}</TableCell>
                          <TableCell>
                            <Badge variant={registration.userType === 'patron' ? 'default' : 'secondary'}>
                              {registration.userType}
                            </Badge>
                          </TableCell>
                          <TableCell>{registration.entityType || 'N/A'}</TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{new Date(registration.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Registration Details</DialogTitle>
                                  <DialogDescription>
                                    Review registration information and supporting documents
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Full Name</Label>
                                      <p>{registration.fullName}</p>
                                    </div>
                                    <div>
                                      <Label>User Type</Label>
                                      <p>{registration.userType}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p>{registration.email}</p>
                                    </div>
                                    <div>
                                      <Label>Mobile</Label>
                                      <p>{registration.mobile}</p>
                                    </div>
                                    <div>
                                      <Label>Aadhar ID</Label>
                                      <p>{registration.aadharId}</p>
                                    </div>
                                    <div>
                                      <Label>Wallet Address</Label>
                                      <p className="text-xs break-all">{registration.walletAddress}</p>
                                    </div>
                                  </div>
                                  {registration.userType === 'patron' && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Entity Type</Label>
                                        <p>{registration.entityType}</p>
                                      </div>
                                      <div>
                                        <Label>Land Title Number</Label>
                                        <p>{registration.landTitleNumber}</p>
                                      </div>
                                      <div>
                                        <Label>Initial Hectares</Label>
                                        <p>{registration.initialHectares}</p>
                                      </div>
                                      <div>
                                        <Label>Plantation Status</Label>
                                        <p>{registration.plantationStatus}</p>
                                      </div>
                                      <div>
                                        <Label>Plantation Date</Label>
                                        <p>{registration.plantationDate ? new Date(registration.plantationDate).toLocaleDateString() : 'N/A'}</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Plantation Coordinates */}
                                  {registration.plantationCoordinates && (
                                    <div>
                                      <Label>Plantation Coordinates</Label>
                                      <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div>
                                            <span className="font-medium">Latitude:</span> {registration.plantationCoordinates.latitude?.toFixed(6)}
                                          </div>
                                          <div>
                                            <span className="font-medium">Longitude:</span> {registration.plantationCoordinates.longitude?.toFixed(6)}
                                          </div>
                                          {registration.plantationCoordinates.accuracy && (
                                            <div className="col-span-2">
                                              <span className="font-medium">Accuracy:</span> ±{registration.plantationCoordinates.accuracy.toFixed(0)}m
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* IPFS Document Information */}
                                  {registration.ownershipDocumentIPFS && (
                                    <div>
                                      <Label>Ownership Document (IPFS)</Label>
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                                        <div className="flex items-start space-x-3">
                                          <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            <div className="space-y-2 text-sm">
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium text-blue-800">File:</span>
                                                <span className="truncate">{registration.ownershipDocumentIPFS.name}</span>
                                              </div>
                                              
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium text-blue-800">Size:</span>
                                                <span>{(registration.ownershipDocumentIPFS.size / 1024 / 1024).toFixed(2)} MB</span>
                                              </div>
                                              
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium text-blue-800">IPFS Hash:</span>
                                                <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono">
                                                  {registration.ownershipDocumentIPFS.hash}
                                                </code>
                                              </div>
                                              
                                              <div className="flex items-center space-x-2 mt-3">
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => {
                                                    if (registration.ownershipDocumentIPFS?.url) {
                                                      window.open(registration.ownershipDocumentIPFS.url, '_blank');
                                                    }
                                                  }}
                                                  className="flex items-center space-x-1 text-blue-700 border-blue-300 hover:bg-blue-100"
                                                >
                                                  <ExternalLink className="h-3 w-3" />
                                                  <span>View Document</span>
                                                </Button>
                                                
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(registration.ownershipDocumentIPFS?.hash || '');
                                                    toast.success('IPFS hash copied to clipboard');
                                                  }}
                                                  className="text-blue-700 border-blue-300 hover:bg-blue-100"
                                                >
                                                  Copy Hash
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              size="sm"
                              onClick={() => handleApprove(registration.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setSelectedRegistration(registration)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Registration</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting this registration.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea
                                    placeholder="Enter rejection reason..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleReject(registration.id)}
                                  >
                                    Reject Registration
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Approved Users</CardTitle>
                <CardDescription>
                  Manage approved user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="patrons" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="patrons">
                      Patrons
                      {approvedUsers.filter(user => user.userType === 'patron').length > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                          {approvedUsers.filter(user => user.userType === 'patron').length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="creditClients">
                      Credit Clients
                      {approvedUsers.filter(user => user.userType === 'creditClient').length > 0 && (
                        <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                          {approvedUsers.filter(user => user.userType === 'creditClient').length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="patrons" className="mt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Patron Users</h3>
                      <p className="text-sm text-gray-600">
                        Farmers, NGOs, and Field Workers who generate carbon credits
                      </p>
                    </div>
                    {approvedUsers.filter(user => user.userType === 'patron').length === 0 ? (
                      <div className="text-center py-8">
                        <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No approved patrons</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Entity Type</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {approvedUsers.filter(user => user.userType === 'patron').map((user) => (
                            <TableRow key={user.userId}>
                              <TableCell className="font-mono">{user.userId}</TableCell>
                              <TableCell>{user.fullName}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {user.entityType || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.banned ? 'destructive' : 'default'}>
                                  {user.banned ? 'Banned' : 'Active'}
                                </Badge>
                              </TableCell>
                              <TableCell className="space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>User Details - {user.fullName}</DialogTitle>
                                      <DialogDescription>
                                        View complete user information and registration details
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>User ID</Label>
                                          <p className="font-mono">{user.userId}</p>
                                        </div>
                                        <div>
                                          <Label>Full Name</Label>
                                          <p>{user.fullName}</p>
                                        </div>
                                        <div>
                                          <Label>User Type</Label>
                                          <p>{user.userType}</p>
                                        </div>
                                        <div>
                                          <Label>Entity Type</Label>
                                          <p>{user.entityType || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <p>{user.email}</p>
                                        </div>
                                        <div>
                                          <Label>Mobile</Label>
                                          <p>{user.mobile}</p>
                                        </div>
                                        <div>
                                          <Label>Aadhar ID</Label>
                                          <p>{user.aadharId}</p>
                                        </div>
                                        <div>
                                          <Label>Plantation Address</Label>
                                          <p>{user.plantationAddress}</p>
                                        </div>
                                      </div>
                                      
                                      {user.plantationCoordinates && (
                                        <div>
                                          <Label>Plantation Coordinates</Label>
                                          <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>
                                                <span className="font-medium">Latitude:</span> {user.plantationCoordinates.latitude?.toFixed(6)}
                                              </div>
                                              <div>
                                                <span className="font-medium">Longitude:</span> {user.plantationCoordinates.longitude?.toFixed(6)}
                                              </div>
                                              {user.plantationCoordinates.accuracy && (
                                                <div className="col-span-2">
                                                  <span className="font-medium">Accuracy:</span> ±{user.plantationCoordinates.accuracy.toFixed(0)}m
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Wallet Address</Label>
                                          <p className="text-xs break-all font-mono">{user.walletAddress}</p>
                                        </div>
                                        <div>
                                          <Label>Land Title Number</Label>
                                          <p>{user.landTitleNumber}</p>
                                        </div>
                                        <div>
                                          <Label>Initial Hectares</Label>
                                          <p>{user.initialHectares}</p>
                                        </div>
                                        <div>
                                          <Label>Plantation Status</Label>
                                          <p>{user.plantationStatus}</p>
                                        </div>
                                        <div>
                                          <Label>Plantation Date</Label>
                                          <p>{user.plantationDate ? new Date(user.plantationDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label>Approved Date</Label>
                                          <p>{new Date(user.approvedAt).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button
                                  size="sm"
                                  variant={user.banned ? 'default' : 'destructive'}
                                  onClick={() => handleToggleUserStatus(user.userId, !user.banned)}
                                >
                                  {user.banned ? <Unlock className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                </Button>
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedUser(user)}
                                    >
                                      <Key className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Change Password</DialogTitle>
                                      <DialogDescription>
                                        Enter a new password for {user.fullName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Current Password</Label>
                                        <p className="font-mono">{user.password}</p>
                                      </div>
                                      <div>
                                        <Label>New Password</Label>
                                        <Input
                                          type="text"
                                          value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}
                                          placeholder="Enter new password"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleChangePassword(user.userId)}
                                      >
                                        Change Password
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="creditClients" className="mt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Credit Client Users</h3>
                      <p className="text-sm text-gray-600">
                        Organizations and individuals who purchase carbon credits
                      </p>
                    </div>
                    {approvedUsers.filter(user => user.userType === 'creditClient').length === 0 ? (
                      <div className="text-center py-8">
                        <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No approved credit clients</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Wallet Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {approvedUsers.filter(user => user.userType === 'creditClient').map((user) => (
                            <TableRow key={user.userId}>
                              <TableCell className="font-mono">{user.userId}</TableCell>
                              <TableCell>{user.fullName}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell className="font-mono text-xs max-w-32 truncate">
                                {user.walletAddress}
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.banned ? 'destructive' : 'default'}>
                                  {user.banned ? 'Banned' : 'Active'}
                                </Badge>
                              </TableCell>
                              <TableCell className="space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>User Details - {user.fullName}</DialogTitle>
                                      <DialogDescription>
                                        View complete user information and registration details
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>User ID</Label>
                                          <p className="font-mono">{user.userId}</p>
                                        </div>
                                        <div>
                                          <Label>Full Name</Label>
                                          <p>{user.fullName}</p>
                                        </div>
                                        <div>
                                          <Label>User Type</Label>
                                          <p>{user.userType}</p>
                                        </div>
                                        <div>
                                          <Label>Entity Type</Label>
                                          <p>{user.entityType || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <p>{user.email}</p>
                                        </div>
                                        <div>
                                          <Label>Mobile</Label>
                                          <p>{user.mobile}</p>
                                        </div>
                                        <div>
                                          <Label>Aadhar ID</Label>
                                          <p>{user.aadharId}</p>
                                        </div>
                                        <div>
                                          <Label>Plantation Address</Label>
                                          <p>{user.plantationAddress}</p>
                                        </div>
                                      </div>
                                      
                                      {user.plantationCoordinates && (
                                        <div>
                                          <Label>Plantation Coordinates</Label>
                                          <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>
                                                <span className="font-medium">Latitude:</span> {user.plantationCoordinates.latitude?.toFixed(6)}
                                              </div>
                                              <div>
                                                <span className="font-medium">Longitude:</span> {user.plantationCoordinates.longitude?.toFixed(6)}
                                              </div>
                                              {user.plantationCoordinates.accuracy && (
                                                <div className="col-span-2">
                                                  <span className="font-medium">Accuracy:</span> ±{user.plantationCoordinates.accuracy.toFixed(0)}m
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Wallet Address</Label>
                                          <p className="text-xs break-all font-mono">{user.walletAddress}</p>
                                        </div>
                                        <div>
                                          <Label>Land Title Number</Label>
                                          <p>{user.landTitleNumber}</p>
                                        </div>
                                        <div>
                                          <Label>Initial Hectares</Label>
                                          <p>{user.initialHectares}</p>
                                        </div>
                                        <div>
                                          <Label>Plantation Status</Label>
                                          <p>{user.plantationStatus}</p>
                                        </div>
                                        <div>
                                          <Label>Plantation Date</Label>
                                          <p>{user.plantationDate ? new Date(user.plantationDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label>Approved Date</Label>
                                          <p>{new Date(user.approvedAt).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button
                                  size="sm"
                                  variant={user.banned ? 'default' : 'destructive'}
                                  onClick={() => handleToggleUserStatus(user.userId, !user.banned)}
                                >
                                  {user.banned ? <Unlock className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                </Button>
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedUser(user)}
                                    >
                                      <Key className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Change Password</DialogTitle>
                                      <DialogDescription>
                                        Enter a new password for {user.fullName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Current Password</Label>
                                        <p className="font-mono">{user.password}</p>
                                      </div>
                                      <div>
                                        <Label>New Password</Label>
                                        <Input
                                          type="text"
                                          value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}
                                          placeholder="Enter new password"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleChangePassword(user.userId)}
                                      >
                                        Change Password
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plantations">
            <InteractiveMap />
          </TabsContent>

          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Email Logs</CardTitle>
                <CardDescription>
                  View all sent email notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emailLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No email logs</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>To</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailLogs.map((email, index) => (
                        <TableRow key={index}>
                          <TableCell>{email.to}</TableCell>
                          <TableCell>{email.subject}</TableCell>
                          <TableCell>{new Date(email.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Email Content</DialogTitle>
                                  <DialogDescription>
                                    View the complete email message that was sent
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>To</Label>
                                    <p>{email.to}</p>
                                  </div>
                                  <div>
                                    <Label>Subject</Label>
                                    <p>{email.subject}</p>
                                  </div>
                                  <div>
                                    <Label>Content</Label>
                                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">{email.content}</pre>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}