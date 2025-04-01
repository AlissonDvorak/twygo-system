import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lesson } from '../../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private apiUrl = 'http://localhost:8000/api/courses/';

  constructor(private http: HttpClient) {}

  getLessonsByCourseId(courseId: string): Observable<Lesson[]> {
    return this.http.get<{ lessons: Lesson[] }>(`${this.apiUrl}${courseId}/lessons/`).pipe(
      map(response => response.lessons.map(lesson => ({
        ...lesson,
        title: lesson.title || 'Untitled Lesson',
        description: lesson.description || 'No description available.',
        duration: lesson.duration || '40 minutes',
        videoUrl: lesson.videoUrl || '',
        thumbnail: lesson.thumbnail || 'https://placehold.co/800x450',
        videoTitle: lesson.videoTitle || `${lesson.title || 'Lesson'} Video`,
        videoInstructor: lesson.videoInstructor || 'Assistir no YouTube',
        video_id: lesson.video_id || '',
        video_size_mb: lesson.video_size_mb || 0,
        transcript: lesson.transcript || '',
        created_at: lesson.created_at || ''
      })))
    );
  }

  addLesson(courseId: string, lessonData: { title: string; description: string; videoFile: File }): Observable<any> {
    const formData = new FormData();
    formData.append('title', lessonData.title);
    formData.append('description', lessonData.description);
    formData.append('video', lessonData.videoFile);

    return this.http.post(`${this.apiUrl}${courseId}/lessons/`, formData);
  }
}