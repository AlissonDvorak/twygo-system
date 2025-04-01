import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from '../../shared/top-menu/top-menu.component';
import { Course } from '../../models/course.model';
import { CourseService } from '../../core/services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatComponent } from '../../shared/chat/chat.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [CommonModule, TopMenuComponent]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

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
        this.courses = courses.map((course: any) => ({
          ...course,
          videoUrl: this.courseService.getCourseVideo(course._id)
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar os cursos:', error);
      }
    });
  }

  redirectToCourse(courseId: any): void {
    this.router.navigate([`/lessons/${courseId}`]);
  }

  onVideoError(event: any, course: Course) {
    console.error('Erro ao carregar o vídeo:', event);
    course.videoUrl = '';
    course.imageUrl = course.imageUrl || 'https://placehold.co/300x200';
  }

  setVideoToStart(video: HTMLVideoElement): void {
    video.currentTime = 0; // Define o tempo do vídeo como 0 (primeiro frame)
  }
}