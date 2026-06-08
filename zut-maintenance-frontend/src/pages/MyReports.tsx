import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';
import { Report } from '../types';
import { ReportDetailModal } from '../components/ReportDetailModal';
import {
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  PlusCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  WrenchIcon } from
'lucide-react';
export function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports/mine');
        setReports(response.data);
      } catch (err) {
        setError('Failed to load your reports.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);
  const getStatusBadge = (status: Report['status']) => {
    const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
    switch (status) {
      case 'Pending':
        return (
          <span
            className={`${base} bg-yellow-100 text-yellow-800 border-yellow-200`}>
            
            <ClockIcon className="mr-1 h-3 w-3" /> Pending
          </span>);

      case 'In Progress':
        return (
          <span className={`${base} bg-blue-100 text-blue-800 border-blue-200`}>
            <WrenchIcon className="mr-1 h-3 w-3" /> In Progress
          </span>);

      case 'Resolved':
        return (
          <span
            className={`${base} bg-green-100 text-green-800 border-green-200`}>
            
            <CheckCircleIcon className="mr-1 h-3 w-3" /> Resolved
          </span>);

      default:
        return null;
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
          <p className="mt-2 text-slate-600">
            Track the status of maintenance issues you've reported.
          </p>
        </div>
        <Link
          to="/submit"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          New Report
        </Link>
      </div>

      {error &&
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 mb-6">
          <AlertCircleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      }

      {reports.length === 0 ?
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900">No reports submitted yet</h3>
          <p className="mt-1 text-sm text-slate-500">
            No reports submitted yet. Click Submit Report to get started.
          </p>
          <div className="mt-6">
            <Link
            to="/submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Submit your first report
            </Link>
          </div>
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) =>
        <div
          key={report.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3
                className="text-lg font-semibold text-slate-900 line-clamp-2"
                title={report.title}>
                
                    {report.title}
                  </h3>
                  <div className="flex-shrink-0 mt-1">
                    {getStatusBadge(report.status)}
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {report.description}
                </p>

                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPinIcon className="flex-shrink-0 mr-2 h-4 w-4 text-slate-400" />
                    <span className="truncate" title={report.location}>
                      {report.location}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <TagIcon className="flex-shrink-0 mr-2 h-4 w-4 text-slate-400" />
                    <span>{report.category}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <CalendarIcon className="flex-shrink-0 mr-2 h-4 w-4 text-slate-400" />
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>
              </div>

              {report.adminNote &&
          <div className="bg-blue-50 px-5 py-3 border-t border-blue-100">
                  <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
                    Admin Note
                  </p>
                  <p className="text-sm text-blue-900 italic">
                    "{report.adminNote}"
                  </p>
                </div>
          }
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedReport(report)}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                <PlusCircleIcon className="h-4 w-4" />
                View Details
              </button>
            </div>
            </div>
        )}
        </div>
      }

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={(updated) => {
            setReports(reports.map((r) => (r.id === updated.id ? updated : r)));
            setSelectedReport(updated);
          }}
        />
      )}
    </div>);

}