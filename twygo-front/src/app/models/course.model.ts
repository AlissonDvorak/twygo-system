export interface Course {
  _id: string;
  title: string;
  description: string;
  end_date: string;
  video_size_mb: number;
  video_id: string;
  transcript: string;
  instructor?: string; // Opcional, já que não vem da API
  lessons?: number; // Opcional
  duration?: string; // Opcional
  imageUrl?: string; // Opcional
}