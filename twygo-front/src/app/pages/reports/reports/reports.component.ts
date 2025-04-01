import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { Chart, registerables } from 'chart.js';
import { SumLessonSizesPipe } from '../../../core/pipes/sum-lesson-sizes.pipe';
import { ReportsService } from '../../../core/services/reports.service';



Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSpinModule, SumLessonSizesPipe],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  reportData: any = null;
  isLoading = false;
  chart: Chart | null = null;

  filters = {
    courseId: '',
    lessonId: '',
    scope: ''
  };

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadReport();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  onFilterChange() {
    this.loadReport();
  }

  clearFilters() {
    this.filters = { courseId: '', lessonId: '', scope: '' };
    this.loadReport();
  }

  loadReport() {
    this.isLoading = true;
    this.reportsService.getVideoSizeReport(this.filters.courseId, this.filters.lessonId, this.filters.scope).subscribe({
      next: (data: any) => {
        this.reportData = data;
        this.isLoading = false;
        setTimeout(() => {
          this.renderChart();
        }, 200);
        
      },
      error: (error: any) => {
        console.error('Erro ao carregar relatório:', error);
        alert('Ocorreu um erro ao carregar o relatório.');
        this.isLoading = false;
      }
    });
  }

  getReportTitle(): string {
    if (!this.reportData) return '';
    switch (this.reportData.type) {
      case 'lesson': return `Relatório da Lição: ${this.reportData.title}`;
      case 'course': return `Relatório do Curso: ${this.reportData.course_title}`;
      case 'general': return 'Relatório Geral de Tamanhos de Vídeo';
      default: return 'Relatório';
    }
  }

  renderChart() {
    if (!this.chartCanvas || !this.reportData) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    let chartData: any = {};
    let chartType: string = 'bar';

    switch (this.reportData.type) {
      case 'lesson':
        chartData = {
          labels: [this.reportData.title],
          datasets: [{
            label: 'Tamanho do Vídeo (MB)',
            data: [this.reportData.video_size_mb],
            backgroundColor: '#482ce8'
          }]
        };
        break;

      case 'course':
        chartData = {
          labels: ['Vídeo Introdutório', 'Lições'],
          datasets: [{
            label: 'Tamanho (MB)',
            data: [
              this.reportData.details.intro_video_size_mb || 0,
              this.reportData.details.lessons_size_mb || 0
            ],
            backgroundColor: ['#482ce8', '#f5f5f5']
          }]
        };
        chartType = 'pie';
        break;

      case 'general':
        if (this.reportData.data?.length) {
          chartData = {
            labels: this.reportData.data.map((c: any) => c.course_title),
            datasets: [{
              label: 'Tamanho Total (MB)',
              data: this.reportData.data.map((c: any) => c.total_size_mb),
              backgroundColor: '#482ce8'
            }]
          };
        } else if (this.reportData.details) {
          chartData = {
            labels: ['Vídeos Introdutórios', 'Lições'],
            datasets: [{
              label: 'Tamanho (MB)',
              data: [
                this.reportData.details.intro_videos_size_mb || 0,
                this.reportData.details.lessons_size_mb || 0
              ],
              backgroundColor: ['#482ce8', '#f5f5f5']
            }]
          };
          chartType = 'pie';
        }
        break;
    }

    this.chartCanvas.nativeElement.parentElement?.setAttribute('data-chart-type', chartType);

    this.chart = new Chart(ctx, {
      type: chartType as any,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true, 
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.dataset.label}: ${context.raw} MB`
            }
          }
        },
        scales: chartType === 'bar' ? {
          y: { beginAtZero: true, title: { display: true, text: 'Tamanho (MB)' } }
        } : undefined
      }
    });
  }
}