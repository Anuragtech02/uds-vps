export const runtime = 'edge';

import Button from '@/components/commons/Button';
import { LocalizedLink } from '@/components/commons/LocalizedLink';
import React from 'react';


export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">404 - Page Not Found</h1>
          <p className="text-lg text-slate-600">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <LocalizedLink href='/'>
            <Button className='!bg-blue-1 !text-white'>
              Go back to home
            </Button>
          </LocalizedLink>
          
          <p className="text-sm text-slate-500">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}