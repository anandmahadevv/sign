import React from 'react';
import { Save } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { updateProfile } from '@/app/actions';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect('/sign-in');
  
  const ownerId = orgId || userId;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('owner_id', ownerId)
    .single();

  const handleSave = async (formData: FormData) => {
    'use server';
    const agencyName = formData.get('agencyName') as string;
    const brandColor = formData.get('brandColor') as string;
    const logoUrl = formData.get('logoUrl') as string;
    await updateProfile({ 
      agency_name: agencyName,
      brand_color: brandColor,
      logo_url: logoUrl
    });
  };
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/50">Manage your agency preferences and defaults.</p>
      </div>

      <form action={handleSave} className="rounded-xl bg-white/[0.02] p-8 ring-1 ring-white/5 flex flex-col gap-8">
        
        {/* Agency Profile */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Agency Profile</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Agency Name</label>
              <input
                name="agencyName"
                defaultValue={profile?.agency_name || "Sign"}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Support Email</label>
              <input
                defaultValue="hello@hackarena.com"
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Business Address</label>
              <input
                defaultValue="123 Innovation Drive, Tech City, TX 78701"
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Custom Branding */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Custom Branding (Client Portal)</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Brand Color (Hex code)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="brandColor"
                  defaultValue={profile?.brand_color || "#111827"}
                  className="h-10 w-10 cursor-pointer rounded-md border border-white/10 bg-transparent p-1 transition-colors"
                />
                <span className="text-sm text-white/50">Primary color for buttons and accents on the signing page.</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Logo URL</label>
              <input
                name="logoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                defaultValue={profile?.logo_url || ""}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Agreement Defaults */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Agreement Defaults</h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Default Legal / Ownership Terms</label>
              <textarea
                rows={4}
                defaultValue="Client retains full ownership upon final payment. HackArena reserves the right to showcase the final product in our portfolio unless a separate NDA is signed."
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30 focus:bg-white/10 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center gap-2 rounded-md bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}
