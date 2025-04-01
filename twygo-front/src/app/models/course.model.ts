// course.model.ts
export interface Course {
  _id?: string; 
  title: string;
  description: string;
  end_date?: string; 
  video_size_mb?: number; 
  video_id?: string; 
  videoUrl?: string;
  instructor?: string;
  lessons?: any[] | number; 
  duration?: string;
  imageUrl?: string;
}