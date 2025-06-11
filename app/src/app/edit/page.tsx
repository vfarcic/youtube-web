'use client';

import { useSearchParams } from 'next/navigation';
import AspectSelection from '../components/AspectSelection';

export default function EditPage() {
  const searchParams = useSearchParams();
  
  // Extract video context for progress tracking (Issue #16)
  const videoId = searchParams.get('videoId');
  const videoName = searchParams.get('videoName'); 
  const category = searchParams.get('category');

  return (
    <main className="container">
      <AspectSelection 
        videoId={videoId || undefined}
        videoName={videoName || undefined}
        category={category || undefined}
      />
    </main>
  );
} 