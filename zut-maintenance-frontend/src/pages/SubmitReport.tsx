import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import {
  UploadIcon,
  XIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ImageIcon } from
'lucide-react';
const LOCATIONS = [
'Faculty of Computer Science',
'Faculty of Mechanical Engineering',
'Faculty of Electrical Engineering',
'Main Library',
'Student Dormitory 1',
'Student Dormitory 2',
'Campus Cafeteria',
'Other'];

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Other'];
export function SubmitReport() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('category', category);
      if (photo) formData.append('image', photo);
      await api.post('/reports', formData);
      setSuccess(true);
      setTimeout(() => navigate('/my-reports'), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to submit report. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Report Submitted Successfully!
        </h2>
        <p className="text-slate-600 mb-6">
          Thank you for helping keep our campus well-maintained. We'll look into
          this issue shortly.
        </p>
        <p className="text-sm text-slate-500">Redirecting to your reports...</p>
      </div>);

  }
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Submit a Maintenance Report
        </h1>
        <p className="mt-2 text-slate-600">
          Notice an issue on campus? Let us know so we can fix it.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error &&
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertCircleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          }

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1">
                
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Broken projector in Room 204"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-slate-700 mb-1">
                  
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  id="location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  
                  {LOCATIONS.map((loc) =>
                  <option key={loc} value={loc}>
                      {loc}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-700 mb-1">
                  
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  
                  {CATEGORIES.map((cat) =>
                  <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-1">
                
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about the issue..."
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-y" />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Photo (Optional)
              </label>

              {!photoPreview ?
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div> :

              <div className="relative mt-1 rounded-md overflow-hidden border border-slate-200 inline-block">
                  <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-48 w-auto object-cover" />
                
                  <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm">
                  
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              }
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden" />
              
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-4 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed">
              
              {isLoading ?
              'Submitting...' :

              <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              }
            </button>
          </div>
        </form>
      </div>
    </div>);

}