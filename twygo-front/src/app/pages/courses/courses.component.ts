import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicione OnDestroy
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { CourseService } from '../../core/services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs'; // Adicione Subscription

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [CommonModule, NzModalModule, NzSpinModule, FormsModule]
})
export class CoursesComponent implements OnInit, OnDestroy { // Adicione OnDestroy
  courses: Course[] = [];
  selectedCourseId: string | null = null;
  isEditModalVisible = false;
  isLoading = false;
  editCourse: any;
  editCourseData: Partial<Course> = {
    title: '',
    description: '',
    end_date: ''
  };
  private courseAddedSubscription: Subscription; // Subscription para gerenciar o observable

  constructor(
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Assina o evento de adição de curso no construtor
    this.courseAddedSubscription = this.courseService.courseAdded$.subscribe(() => {
      this.loadCourses();
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    // Cancela a assinatura para evitar memory leaks
    if (this.courseAddedSubscription) {
      this.courseAddedSubscription.unsubscribe();
    }
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
    video.currentTime = 0;
  }

  toggleSettingsMenu(courseId: any, event: Event): void {
    event.stopPropagation();
    this.selectedCourseId = this.selectedCourseId === courseId ? null : courseId;
  }

  openEditModal(course: Course): void {
    this.editCourse = course;
    this.editCourseData = {
      title: course.title,
      description: course.description,
      end_date: course.end_date
    };
    this.isEditModalVisible = true;
    this.selectedCourseId = null;
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.editCourseData = { title: '', description: '', end_date: '' };
  }

  saveEdit(): void {
    if (!this.isEditFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    this.courseService.updateCourse(this.editCourse._id!, this.editCourseData).subscribe({
      next: (response) => {
        this.isEditModalVisible = false;
        this.isLoading = false;
        this.loadCourses();
      },
      error: (error) => {
        console.error('Erro ao atualizar curso:', error);
        alert('Ocorreu um erro ao salvar as alterações.');
        this.isLoading = false;
      }
    });
  }

  deleteCourse(courseId: string): void {
    if (confirm('Tem certeza que deseja excluir este curso? Isso também excluirá todas as aulas associadas.')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: (response) => {
          this.loadCourses();
          this.selectedCourseId = null;
        },
        error: (error) => {
          console.error('Erro ao excluir curso:', error);
          alert('Ocorreu um erro ao excluir o curso.');
        }
      });
    }
  }

  isEditFormValid(): boolean {
    return !!this.editCourseData.title && !!this.editCourseData.description && !!this.editCourseData.end_date;
  }
}