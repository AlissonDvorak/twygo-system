import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from '../../shared/top-menu/top-menu.component';
import { Course } from '../../models/course.model';
import { CourseService } from '../../core/services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [CommonModule, TopMenuComponent, NzModalModule, NzSpinModule, FormsModule]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  selectedCourseId: string | null = null;
  isEditModalVisible = false;
  isLoading = false;
  editCourse: any
  editCourseData: Partial<Course> = {
    title: '',
    description: '',
    end_date: ''
  };

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
        // console.log(courses),
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
    event.stopPropagation(); // Impede que o clique no ícone redirecione
    this.selectedCourseId = this.selectedCourseId === courseId ? null : courseId;
  }

  openEditModal(course: Course): void {
    this.editCourse = course
    // console.log('Editando curso:', course);
    this.editCourseData = {
      title: course.title,
      description: course.description,
      end_date: course.end_date
    };
    this.isEditModalVisible = true;
    this.selectedCourseId = null; // Fecha o menu
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.editCourseData = { title: '', description: '', end_date: '' };
  }

  saveEdit(): void {
    // console.log('Editando curso:', this.selectedCourseId, this.editCourseData)
    if (!this.isEditFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    this.courseService.updateCourse(this.editCourse._id!, this.editCourseData).subscribe({
      
      next: (response) => {
        // console.log('Curso atualizado:', response);
        this.isEditModalVisible = false;
        this.isLoading = false;
        this.loadCourses(); // Recarrega os cursos
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
          // console.log('Curso excluído:', response);
          this.loadCourses(); // Recarrega os cursos
          this.selectedCourseId = null; // Fecha o menu
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