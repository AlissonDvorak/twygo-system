import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { LessonsService } from '../../core/services/lessons.service';
import { ChatComponent } from '../../shared/chat/chat.component';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule,  ChatComponent],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  course: any = null;
  lessons: any[] = [];
  selectedLesson: any = null;
  courseId: any

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonsService: LessonsService
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    this.courseId = courseId
    console.log('Course ID from route:', courseId);
    setTimeout(() => {
      
    }, 300);
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
            videoUrl: this.courseService.getCourseVideo(courseId) 
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
            videoUrl: this.courseService.getCourseVideo(courseId), 
            thumbnail: lesson.thumbnail,
            videoTitle: lesson.videoTitle,
            videoInstructor: lesson.videoInstructor
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
}