// // src/app/core/services/course.service.ts
// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Course } from '../../models/course.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class CourseService {
//   private mockData = {
//     active_courses: [
//       {
//         _id: '67e9c56fff584c5d84905a47',
//         title: 'Introdução a Python',
//         description: 'Curso de introdução a Python módulo 1',
//         end_date: '2025-12-31T00:00:00',
//         video_size_mb: 85.87229442596436,
//         video_id: '67e9c504ff584c5d849058ed',
//         transcript: 'Bem-vindos ao curso de Python...',
//         instructor: 'John Doe',
//         lessons: 10,
//         duration: '2h 30min',
//         imageUrl: null
//       },
//       {
//         _id: '67eb13d15fbcd42f37e9a1fb',
//         title: 'JavaScript',
//         description: 'Introdução a JS',
//         end_date: '2025-12-31T00:00:00',
//         video_size_mb: 0.8549280166625977,
//         video_id: '67eb13cc5fbcd42f37e9a1f6',
//         transcript: 'Olha, se...'
//       },
//       {
//         _id: '67ec24e15fbcd42f37e9b2fc',
//         title: 'Fundamentos de Angular',
//         description: 'Aprenda os conceitos básicos de Angular para construir aplicações web modernas.',
//         end_date: '2025-12-31T00:00:00',
//         video_size_mb: 120.456789,
//         video_id: '67ec24dc5fbcd42f37e9b2f7',
//         transcript: 'Neste curso, vamos explorar...'
//       }
//     ]
//   };

//   constructor() {}

//   getCourses(): Observable<Course[]> {
//     return of(this.mockData).pipe(
//       map(response => {
//         return response.active_courses.map(course => ({
//           ...course,
//           instructor: course.instructor || 'Instrutor Desconhecido',
//           lessons: course.lessons || Math.floor(Math.random() * 10) + 5, // Gera um número aleatório entre 5 e 14
//           duration: course.duration || `${Math.floor(Math.random() * 5) + 3} hours`, // Gera uma duração aleatória entre 3 e 7 horas
//           imageUrl: course.imageUrl || `https://placehold.co/300x200`
//         }));
//       })
//     );
//   }
// }


// src/app/core/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importe o HttpClient
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8000/api/courses/'; // URL da API

  constructor(private http: HttpClient) {} // Injete o HttpClient

  getCourses(): Observable<Course[]> {
    return this.http.get<{ active_courses: Course[] }>(this.apiUrl).pipe(
      map(response => {
        return response.active_courses.map(course => ({
          ...course,
          instructor: course.instructor || 'Instrutor Desconhecido',
          lessons: course.lessons || Math.floor(Math.random() * 10) + 5, // Gera um número aleatório entre 5 e 14
          duration: course.duration || `${Math.floor(Math.random() * 5) + 3} hours`, // Gera uma duração aleatória entre 3 e 7 horas
          imageUrl: course.imageUrl || `https://placehold.co/300x200`
        }));
      })
    );
  }
}