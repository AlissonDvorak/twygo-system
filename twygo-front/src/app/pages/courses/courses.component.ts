// courses.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from '../../shared/top-menu/top-menu.component';
import { Course } from '../../models/course.model';
import { CourseService } from '../../core/services/course.service';
import { ActivatedRoute, Router } from '@angular/router';

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
export class CoursesComponent implements OnInit {
  courses: Course[] = []; // Ajusta para um array de cursos

  constructor(
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses: Course[]) => {
        // Mapeia os cursos para incluir a propriedade videoUrl
        this.courses = courses.map((course: any) => ({
          ...course,
          videoUrl: this.courseService.getCourseVideo(course._id) // Adiciona a URL do vídeo
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar os cursos:', error);
      }
    });
  }

  redirectToCourse(courseId: any): void {
    // Passa o courseId como parte da URL
    this.router.navigate([`/lessons/${courseId}`]);
  }

  onVideoError(event: any, course: Course) {
    console.error('Erro ao carregar o vídeo:', event);
    course.videoUrl = ''; // Remove a URL do vídeo para evitar tentativas repetidas
    course.imageUrl = course.imageUrl || 'https://placehold.co/300x200'; // Garante que imageUrl exista
  }
}