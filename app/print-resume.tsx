'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintResume() {
  return <Button variant="outline" className="print-button" onClick={() => window.print()}><Printer size={16} />打印网页</Button>;
}
