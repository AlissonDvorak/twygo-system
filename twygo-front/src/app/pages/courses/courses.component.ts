// src/app/pages/courses/courses.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { TopMenuComponent } from '../../shared/top-menu/top-menu.component';
import { Course } from '../../models/course.model';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TopMenuComponent
  ]
})
export class CoursesComponent {
  courses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Erro ao carregar os cursos:', error);
      }
    });
  }
}