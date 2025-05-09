import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl + 'courses/';
  private courseAddedSubject = new Subject<void>();
  courseAdded$: Observable<void> = this.courseAddedSubject.asObservable();


  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<{ active_courses: Course[] }>(this.apiUrl).pipe(
      map(response => {
        return response.active_courses.map(course => ({
          ...course,
          instructor: course.instructor || 'Instrutor Desconhecido',
          lessons: course.lessons_count || 0,
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
    formData.append('duration', courseData.duration);

    return this.http.post(this.apiUrl, formData);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}`).pipe(
      map(course => ({
        ...course,
        instructor: course.instructor || 'Instrutor Desconhecido',
        lessonsCount: course.lessons_count || 0,  
        duration: course.duration || `${Math.floor(Math.random() * 5) + 3} hours`,
        imageUrl: course.imageUrl || `https://placehold.co/350x300`,
      }))
    );
  }

  getCourseVideo(courseId: any, lessonId?: any): string {
    if (lessonId) {
      return `${this.apiUrl}${courseId}/video?lesson_id=${lessonId}`;
    }
    return `${this.apiUrl}${courseId}/video`;
  }

  updateCourse(courseId: any, courseData: Partial<Course>): Observable<any> {
    return this.http.put(`${this.apiUrl}${courseId}`, courseData);
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${courseId}`);
  }

  notifyCourseAdded(): void {
    this.courseAddedSubject.next();
  }
}