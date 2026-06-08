import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/axios';
import { Report, ReportStatus } from '../types';
import { ReportDetailModal } from '../components/ReportDetailModal';
import {
  Search,
  Filter,
  Eye,
  Clock,
  Wrench,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  BarChart3 } from
'lucide-react';
const CATEGORIES = ['All', 'Electrical', 'Plumbing', 'Furniture', 'Other'];
const STATUSES: Array<'All' | ReportStatus> = [
'All',
'Pending',
'In Progress',
'Resolved'];

export function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | ReportStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (err) {
        setError('Failed to load reports.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (statusFilter !== 'All' && report.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && report.category !== categoryFilter)
      return false;
      if (
      searchQuery &&
      !report.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !report.location.toLowerCase().includes(searchQuery.toLowerCase()))

      return false;
      return true;
    });
  }, [reports, statusFilter, categoryFilter, searchQuery]);
  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === 'Pending').length,
      inProgress: reports.filter((r) => r.status === 'In Progress').length,
      resolved: reports.filter((r) => r.status === 'Resolved').length
    };
  }, [reports]);
  const handleReportUpdate = (updatedReport: Report) => {
    setReports(
      reports.map((r) => r.id === updatedReport.id ? updatedReport : r)
    );
    setSelectedReport(updatedReport);
  };
  const getStatusBadge = (status: ReportStatus) => {
    const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
    switch (status) {
      case 'Pending':
        return (
          <span
            className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`}>
            
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>);

      case 'In Progress':
        return (
          <span
            className={`${baseClasses} bg-blue-100 text-blue-800 border-blue-200`}>
            
            <Wrench className="mr-1 h-3 w-3" /> In Progress
          </span>);

      case 'Resolved':
        return (
          <span
            className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}>
            
            <CheckCircle className="mr-1 h-3 w-3" /> Resolved
          </span>);

    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>);

  }
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Manage and respond to maintenance reports from across campus.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Reports"
          value={stats.total}
          icon={<ClipboardList className="h-6 w-6 text-slate-600" />}
          bg="bg-slate-100" />
        
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          bg="bg-yellow-100" />
        
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<Wrench className="h-6 w-6 text-blue-600" />}
          bg="bg-blue-100" />
        
        <StatCard
          label="Resolved"
          value={stats.resolved}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          bg="bg-green-100" />
        
      </div>

      {error &&
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      }

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            
          </div>
          <div className="flex gap-3 flex-col sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) =>
              setStatusFilter(e.target.value as 'All' | ReportStatus)
              }
              className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              
              {STATUSES.map((s) =>
              <option key={s} value={s}>
                  Status: {s}
                </option>
              )}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              
              {CATEGORIES.map((c) =>
              <option key={c} value={c}>
                  Category: {c}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredReports.length === 0 ?
              <tr>
                  <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-slate-500">
                  
                    <Filter className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium">No reports match your filters</p>
                    <p className="text-sm mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  </td>
                </tr> :

              filteredReports.map((report) =>
              <tr
                key={report.id}
                className="hover:bg-slate-50 transition-colors">
                
                    <td className="px-6 py-4">
                      <div
                    className="text-sm font-medium text-slate-900 max-w-xs truncate"
                    title={report.title}>
                    
                        {report.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">
                        {report.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">
                        {report.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">
                        {report.user?.name || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500">
                        {formatDate(report.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                    onClick={() => setSelectedReport(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                    
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredReports.length === 0 ?
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <Filter className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-slate-600">
              No reports match your filters
            </p>
          </div> :

        filteredReports.map((report) =>
        <div
          key={report.id}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          
              <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="font-semibold text-slate-900">{report.title}</h3>
                {getStatusBadge(report.status)}
              </div>
              <div className="space-y-1 text-sm text-slate-600 mb-4">
                <p>
                  <span className="font-medium">Location:</span>{' '}
                  {report.location}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{' '}
                  {report.category}
                </p>
                <p>
                  <span className="font-medium">Reporter:</span>{' '}
                  {report.user?.name || '—'}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {formatDate(report.createdAt)}
                </p>
              </div>
              <button
            onClick={() => setSelectedReport(report)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
            
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
        )
        }
      </div>

      {selectedReport &&
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdate={handleReportUpdate} />

      }
    </div>);

}
function StatCard({
  label,
  value,
  icon,
  bg





}: {label: string;value: number;icon: React.ReactNode;bg: string;}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
      <div
        className={`${bg} h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
        
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>);

}