export interface Lesson {
    _id: string;
    course_id: string;
    title?: string;
    description?: string;
    duration?: string;
    videoUrl?: string;
    thumbnail?: string;
    videoTitle?: string;
    videoInstructor?: string;
    video_id?: string; 
    video_size_mb?: number; 
    transcript?: string; 
    created_at?: string; 
  }