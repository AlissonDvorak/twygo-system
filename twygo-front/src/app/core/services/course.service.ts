import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8000/api/courses/';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<{ active_courses: Course[] }>(this.apiUrl).pipe(
      map(response => {
        return response.active_courses.map(course => ({
          ...course,
          instructor: course.instructor || 'Instrutor Desconhecido',
          lessons: course.lessons || Math.floor(Math.random() * 10) + 5,
          duration: course.duration || `${Math.floor(Math.random() * 5) + 3} hours`,
          imageUrl: course.imageUrl || `https://placehold.co/300x200`
        }));
      })
    );
  }

  uploadCourse(courseData: any, videoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('end_date', courseData.end_date);
    formData.append('video', videoFile);

    return this.http.post(this.apiUrl, formData);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}`).pipe(
      map(course => ({
        ...course,
        instructor: course.instructor || 'Instrutor Desconhecido',
        lessonsCount: Array.isArray(course.lessons) ? course.lessons.length : course.lessons || Math.floor(Math.random() * 10) + 5,
        duration: course.duration || `${Math.floor(Math.random() * 5) + 3} hours`,
        imageUrl: course.imageUrl || `https://placehold.co/350x300`,
        lessons: Array.isArray(course.lessons) ? course.lessons : []
      }))
    );
  }

  // Novo método para buscar o vídeo do curso
  getCourseVideo(courseId: any): string {
    console.log('URL do vídeo:', `${this.apiUrl}${courseId}/video`);
    return `${this.apiUrl}${courseId}/video`;
  }

  
  


}