
import React, { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const BrandProfile: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Profile saved in this session. Database integration is pending.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-violet-100 text-violet-700">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Brand Profile</h1>
            <p className="text-sm text-slate-500">Introduce your brand to creators.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input
            label="Brand or company name"
            placeholder="Enter your brand name"
            value={brandName}
            onChange={(event) => setBrandName(event.target.value)}
            required
          />

          <Input
            label="Website"
            placeholder="https://example.com"
            type="url"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />

          <Input
            label="Industry"
            placeholder="e.g. Technology, Fashion, Food"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          />

          <Input
            label="Location"
            placeholder="City, country"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              About your brand
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your brand, audience, and products..."
              rows={5}
              maxLength={2000}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>

          {message && (
            <p role="status" className="text-sm text-emerald-700">
              {message}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandProfile;
