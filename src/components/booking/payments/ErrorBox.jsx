import { AlertCircle } from 'lucide-react';

export default function ErrorBox({ message }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-[13px] text-red-200">
      <AlertCircle size={17} className="mt-0.5 shrink-0" /> {message}
    </div>
  );
}
