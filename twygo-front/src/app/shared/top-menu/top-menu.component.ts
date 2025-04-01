import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { Router } from '@angular/router'; // Importe o Router

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  standalone: true,
  imports: [NzModalModule, NzSpinModule, CommonModule, FormsModule]
})
export class TopMenuComponent {
  isVisible = false;
  isLoading = false;

  courseData = {
    title: '',
    description: '',
    instructor: '',
    imageUrl: '',
    duration: '',
    end_date: '',
    videoFile: null as File | null
  };

  videoFileName: string | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router // Injete o Router
  ) {}

  // Método para verificar se a URL atual é '/courses'
  isCoursesPage(): boolean {
    return this.router.url === '/courses';
  }

  showModal(): void {
    console.log('Button clicked!');
    this.isVisible = true;
  }

  handleOk(): void {
    this.isLoading = true;
    if (!this.courseData.title || !this.courseData.description || !this.courseData.end_date || !this.courseData.videoFile) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione um vídeo.');
      this.isLoading = false;
      return;
    }

    this.courseService.uploadCourse(this.courseData, this.courseData.videoFile!).subscribe({
      next: (response: any) => {
        console.log('Curso criado com sucesso:', response);
        this.isVisible = false;
        this.resetForm();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Erro ao criar curso:', error);
        alert('Ocorreu um erro ao criar o curso. Verifique o console para mais detalhes.');
      }
    });
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
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
      this.courseData.videoFile = file;
      this.videoFileName = file.name;
    } else {
      alert('Por favor, selecione um arquivo de vídeo válido (ex.: .mp4, .mov).');
      this.courseData.videoFile = null;
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

  private resetForm(): void {
    this.courseData = {
      title: '',
      description: '',
      instructor: '',
      imageUrl: '',
      duration: '',
      end_date: '',
      videoFile: null
    };
    this.videoFileName = null;
  }
}