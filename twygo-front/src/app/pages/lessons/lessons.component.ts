// lessons.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { LessonsService } from '../../core/services/lessons.service';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  course: any = null;
  lessons: any[] = [];
  selectedLesson: any = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonsService: LessonsService
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    console.log('Course ID from route:', courseId);
    if (courseId) {
      // Busca os dados do curso
      this.courseService.getCourseById(courseId).subscribe({
        next: (course: any) => {
          this.course = {
            title: course.title,
            description: course.description,
            lessonsCount: course.lessonsCount,
            duration: course.duration,
            instructor: course.instructor,
            imageUrl: course.imageUrl,
            videoUrl: this.courseService.getCourseVideo(courseId) // Vídeo do curso (fallback)
          };
        },
        error: (err: any) => {
          console.error('Erro ao buscar curso:', err);
        }
      });

      // Busca as lições do curso
      this.lessonsService.getLessonsByCourseId(courseId).subscribe({
        next: (lessons: any[]) => {
          this.lessons = lessons.map((lesson: any, index: number) => ({
            id: index + 1,
            _id: lesson._id,
            course_id: lesson.course_id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            videoUrl: lesson._id ? this.courseService.getCourseVideo(courseId, lesson._id) : this.courseService.getCourseVideo(courseId), // Usa o vídeo da lição ou do curso
            thumbnail: lesson.thumbnail,
            videoTitle: lesson.videoTitle,
            videoInstructor: lesson.videoInstructor,
            video_id: lesson.video_id,
            video_size_mb: lesson.video_size_mb,
            transcript: lesson.transcript,
            created_at: lesson.created_at
          }));
        },
        error: (err: any) => {
          console.error('Erro ao buscar lições:', err);
        }
      });
    } else {
      console.error('Nenhum courseId encontrado nos route parameters');
    }
  }

  selectLesson(lesson: any) {
    this.selectedLesson = lesson;
  }

  backToLessons() {
    this.selectedLesson = null;
  }

  addLesson() {
    console.log('Add Lesson clicked!');
  }

  onVideoError(event: any) {
    console.error('Erro ao carregar o vídeo:', event);
    // Fallback para o vídeo do curso se o vídeo da lição falhar
    if (this.selectedLesson && this.selectedLesson.videoUrl !== this.course.videoUrl) {
      this.selectedLesson.videoUrl = this.course.videoUrl;
    }
  }
}