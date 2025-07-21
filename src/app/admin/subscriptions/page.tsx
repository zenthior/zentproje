'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone
} from 'lucide-react';

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'paused';
  billingCycle: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  lastPaymentDate?: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto';
  autoRenew: boolean;
  trialPeriod?: boolean;
  discountPercent?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [billingFilter, setBillingFilter] = useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek API çağrısı burada olacak
    // Mock veriler kaldırıldı
    setSubscriptions([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = subscriptions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Billing filter
    if (billingFilter !== 'all') {
      filtered = filtered.filter(sub => sub.billingCycle === billingFilter);
    }

    setFilteredSubscriptions(filtered);
  }, [subscriptions, searchTerm, statusFilter, billingFilter]);

  const handleStatusChange = (subscriptionId: string, newStatus: Subscription['status']) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subscriptionId 
        ? { ...sub, status: newStatus, updatedAt: new Date().toISOString() }
        : sub
    ));
  };

  const handleAutoRenewToggle = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subscriptionId 
        ? { ...sub, autoRenew: !sub.autoRenew, updatedAt: new Date().toISOString() }
        : sub
    ));
  };

  const handleDelete = (subscriptionId: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
    }
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      expired: { label: 'Expired', className: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800', icon: XCircle },
      paused: { label: 'Paused', className: 'bg-orange-100 text-orange-800', icon: AlertCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    return (
      <Badge className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getBillingCycleBadge = (cycle: string) => {
    const cycleConfig = {
      monthly: { label: 'Monthly', className: 'bg-blue-100 text-blue-800' },
      quarterly: { label: 'Quarterly', className: 'bg-purple-100 text-purple-800' },
      yearly: { label: 'Yearly', className: 'bg-indigo-100 text-indigo-800' },
      'one-time': { label: 'One-time', className: 'bg-gray-100 text-gray-800' }
    };
    const config = cycleConfig[cycle as keyof typeof cycleConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPaymentMethodIcon = (method: string) => {
    const methodIcons = {
      credit_card: CreditCard,
      paypal: DollarSign,
      bank_transfer: DollarSign,
      crypto: DollarSign
    };
    const IconComponent = methodIcons[method as keyof typeof methodIcons] || DollarSign;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStats = () => {
    const total = subscriptions.length;
    const active = subscriptions.filter(s => s.status === 'active').length;
    const pending = subscriptions.filter(s => s.status === 'pending').length;
    const totalRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0);
    
    return { total, active, pending, totalRevenue };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage user subscriptions and billing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Subscriptions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue, 'USD')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="paused">Paused</option>
            </select>
            <select
              value={billingFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBillingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Billing</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one-time">One-time</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>
            Manage all user subscriptions and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No subscriptions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Package</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Billing</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Next Billing</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{subscription.userName}</div>
                          <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{subscription.packageName}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(subscription.status)}
                          {subscription.autoRenew && (
                            <Badge variant="outline" className="text-xs">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getBillingCycleBadge(subscription.billingCycle)}
                          {getPaymentMethodIcon(subscription.paymentMethod)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          {formatPrice(subscription.amount, subscription.currency)}
                          {subscription.discountPercent && (
                            <span className="text-green-600 text-sm ml-1">
                              (-{subscription.discountPercent}%)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {subscription.nextBillingDate 
                            ? formatDate(subscription.nextBillingDate)
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(subscription)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <select
                            value={subscription.status}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                              handleStatusChange(subscription.id, e.target.value as Subscription['status'])
                            }
                            className="text-xs px-2 py-1 border rounded"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="paused">Paused</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="expired">Expired</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(subscription.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Subscription Details</h2>
              <Button variant="ghost" onClick={() => setIsDetailModalOpen(false)}>
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{selectedSubscription.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{selectedSubscription.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">User ID:</span>
                    <span className="text-sm">{selectedSubscription.userId}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Package:</span>
                    <div className="font-medium">{selectedSubscription.packageName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    {getStatusBadge(selectedSubscription.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Billing:</span>
                    {getBillingCycleBadge(selectedSubscription.billingCycle)}
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Amount:</span>
                    <div className="font-medium text-lg">
                      {formatPrice(selectedSubscription.amount, selectedSubscription.currency)}
                      {selectedSubscription.discountPercent && (
                        <span className="text-green-600 text-sm ml-2">
                          ({selectedSubscription.discountPercent}% discount)
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Payment Method:</span>
                    <div className="flex items-center gap-1">
                      {getPaymentMethodIcon(selectedSubscription.paymentMethod)}
                      <span className="capitalize">
                        {selectedSubscription.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <div>{formatDate(selectedSubscription.startDate)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">End Date:</span>
                    <div>{formatDate(selectedSubscription.endDate)}</div>
                  </div>
                  {selectedSubscription.nextBillingDate && (
                    <div>
                      <span className="text-sm text-gray-500">Next Billing:</span>
                      <div>{formatDate(selectedSubscription.nextBillingDate)}</div>
                    </div>
                  )}
                  {selectedSubscription.lastPaymentDate && (
                    <div>
                      <span className="text-sm text-gray-500">Last Payment:</span>
                      <div>{formatDate(selectedSubscription.lastPaymentDate)}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Auto Renew:</span>
                    <Badge variant={selectedSubscription.autoRenew ? 'default' : 'secondary'}>
                      {selectedSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  {selectedSubscription.trialPeriod && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Trial Period:</span>
                      <Badge variant="outline">Yes</Badge>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Created:</span>
                    <div>{formatDate(selectedSubscription.createdAt)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Last Updated:</span>
                    <div>{formatDate(selectedSubscription.updatedAt)}</div>
                  </div>
                  {selectedSubscription.notes && (
                    <div>
                      <span className="text-sm text-gray-500">Notes:</span>
                      <div className="text-sm bg-gray-50 p-2 rounded mt-1">
                        {selectedSubscription.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAutoRenewToggle(selectedSubscription.id)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {selectedSubscription.autoRenew ? 'Disable' : 'Enable'} Auto Renew
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;