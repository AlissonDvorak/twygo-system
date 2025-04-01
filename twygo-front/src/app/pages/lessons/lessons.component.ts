import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { LessonsService } from '../../core/services/lessons.service';
import { ChatComponent } from '../../shared/chat/chat.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, ChatComponent, NzModalModule, NzSpinModule, FormsModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  course: any = null;
  lessons: any[] = [];
  selectedLesson: any = null;
  courseId: string | null = null;
  isModalVisible = false;
  isLoading = false;
  videoFileName: string | null = null;

  lessonData = {
    title: '',
    description: '',
    videoFile: null as File | null
  };

  courseData = {
    title: '',
    description: '',
    instructor: '',
    imageUrl: '',
    duration: '',
    end_date: '',
    videoFile: null as File | null
  };


  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonsService: LessonsService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    console.log('Course ID from route:', this.courseId);
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course: any) => {
          this.course = {
            title: course.title,
            description: course.description,
            lessonsCount: course.lessonsCount,
            duration: course.duration,
            instructor: course.instructor,
            imageUrl: course.imageUrl,
            videoUrl: this.courseService.getCourseVideo(this.courseId)
          };
        },
        error: (err: any) => {
          console.error('Erro ao buscar curso:', err);
        }
      });

      this.loadLessons();
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

  showAddLessonModal() {
    this.isModalVisible = true;
  }

  handleOk() {
    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione um vídeo.');
      return;
    }

    this.isLoading = true;
    // Como isFormValid() garante que videoFile não é null, podemos usar ! para afirmar isso ao TypeScript
    const lessonDataToSend = {
      title: this.lessonData.title,
      description: this.lessonData.description,
      videoFile: this.lessonData.videoFile!
    };

    this.lessonsService.addLesson(this.courseId!, lessonDataToSend).subscribe({
      next: (response) => {
        console.log('Aula adicionada com sucesso:', response);
        this.isModalVisible = false;
        this.resetForm();
        this.isLoading = false;
        this.loadLessons();
      },
      error: (error) => {
        console.error('Erro ao adicionar aula:', error);
        alert('Ocorreu um erro ao adicionar a aula. Verifique o console para mais detalhes.');
        this.isLoading = false;
      }
    });
  }

  handleCancel() {
    this.isModalVisible = false;
    this.resetForm();
  }

  handleVideoUpload(event: Event | DragEvent): void {
    event.preventDefault();
    let file: File | null = null;

    if (event instanceof DragEvent && event.dataTransfer?.files) {
      file = event.dataTransfer.files[0];
    } else if (event.target instanceof HTMLInputElement && event.target.files) {
      file = event.target.files[0];
    }

    if (file && file.type.startsWith('video/')) {
      this.lessonData.videoFile = file;
      this.videoFileName = file.name;
    } else {
      alert('Por favor, selecione um arquivo de vídeo válido (ex.: .mp4, .mov).');
      this.lessonData.videoFile = null;
      this.videoFileName = null;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const dropArea = event.target as HTMLElement;
    dropArea.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const dropArea = event.target as HTMLElement;
    dropArea.classList.remove('drag-over');
  }

  isFormValid(): boolean {
    return !!this.lessonData.title && !!this.lessonData.description && !!this.lessonData.videoFile;
  }

  private resetForm(): void {
    this.lessonData = {
      title: '',
      description: '',
      videoFile: null
    };
    this.videoFileName = null;
  }

  private loadLessons(): void {
    this.lessonsService.getLessonsByCourseId(this.courseId!).subscribe({
      next: (lessons: any[]) => {
        this.lessons = lessons.map((lesson: any, index: number) => ({
          id: index + 1,
          _id: lesson._id,
          course_id: lesson.course_id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          thumbnail: lesson.thumbnail,
          videoTitle: lesson.videoTitle,
          videoInstructor: lesson.videoInstructor
        }));
      },
      error: (err: any) => {
        console.error('Erro ao buscar lições:', err);
      }
    });
  }
}