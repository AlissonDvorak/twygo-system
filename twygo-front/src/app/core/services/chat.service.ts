import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + 'chatbot/';
  // private apiUrl = 'http://localhost:8000/api/chatbot/'; // URL do backend

  constructor(private http: HttpClient) {}

  sendMessage(prompt: string, courseId?: string, lessonId?: string): Observable<{ response: string }> {
    // Cria os parâmetros de query
    let params = new HttpParams().set('prompt', prompt);

    if (lessonId) {
      params = params.set('lesson_id', lessonId);
    } else if (courseId) {
      params = params.set('course_id', courseId);
    }

    return this.http.post<{ response: string }>(this.apiUrl, null, { params });
  }
}