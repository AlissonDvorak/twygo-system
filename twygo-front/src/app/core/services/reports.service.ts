import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getVideoSizeReport(courseId?: string, lessonId?: string, scope?: string): Observable<any> {
    let params = new HttpParams();
    if (courseId) params = params.set('course_id', courseId);
    if (lessonId) params = params.set('lesson_id', lessonId);
    if (scope) params = params.set('scope', scope);

    return this.http.get(`${this.apiUrl}reports/video-size`, { params });
  }
}