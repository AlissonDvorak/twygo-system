import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sumLessonSizes', standalone: true })
export class SumLessonSizesPipe implements PipeTransform {
  transform(lessons: any[]): number {
    return lessons?.reduce((sum, lesson) => sum + (lesson.video_size_mb || 0), 0) || 0;
  }
}