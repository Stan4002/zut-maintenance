import React, { useEffect, useState } from 'react';
import { Report, ReportStatus } from '../types';
import { api } from '../api/axios';
import {
  X,
  MapPin,
  Tag,
  Calendar,
  User,
  Clock,
  CheckCircle,
  Wrench,
  AlertCircle,
  Image as ImageIcon } from
'lucide-react';
interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
  onUpdate: (updatedReport: Report) => void;
}
const STATUSES: ReportStatus[] = ['Pending', 'In Progress', 'Resolved'];
export function ReportDetailModal({
  report,
  onClose,
  onUpdate
}: ReportDetailModalProps) {
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [note, setNote] = useState(report.adminNote || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.patch(`/reports/${report.id}/status`, {
        status,
        note
      });
      onUpdate(response.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getStatusIcon = (s: ReportStatus) => {
    switch (s) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'In Progress':
        return <Wrench className="h-4 w-4" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4" />;
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}>
      
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-200">
          <div className="pr-4">
            <h2 className="text-xl font-bold text-slate-900">{report.title}</h2>
            <p className="text-sm text-slate-500 mt-1">Report #{report.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0">
            
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Photo */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Photo Evidence
            </h3>
            {report.photoUrl ?
            <img
              src={report.photoUrl?.startsWith('http') ? report.photoUrl : `http://localhost:5000${report.photoUrl}`}
              alt={report.title}
              className="w-full max-h-80 object-cover rounded-lg border border-slate-200" /> :


            <div className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p className="text-sm">No photo attached</p>
              </div>
            }
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Location
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {report.location}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Category
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {report.category}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Submitted
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {formatDate(report.createdAt)}
                </p>
              </div>
            </div>
            {report.user &&
            <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Reported by
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {report.user.name}
                  </p>
                </div>
              </div>
            }
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-slate-700 whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-200">
              {report.description}
            </p>
          </div>

          {/* Status Update Form */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
              Update Status
            </h3>

            {error &&
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            }

            {success &&
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md flex items-start gap-3 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  Status updated successfully!
                </p>
              </div>
            }

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-slate-700 mb-2">
                  
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map((s) =>
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border-2 transition-all ${status === s ? s === 'Resolved' ? 'bg-green-50 border-green-500 text-green-800' : s === 'In Progress' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-yellow-50 border-yellow-500 text-yellow-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    
                      {getStatusIcon(s)}
                      {s}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-slate-700 mb-2">
                  
                  Admin Note{' '}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for the reporter..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y" />
                
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                  
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed">
                  
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>);

}