import { Routes } from '@angular/router';
import { CoursesComponent } from './pages/courses/courses.component';
import { TopMenuComponent } from './shared/top-menu/top-menu.component';
import { LessonsComponent } from './pages/lessons/lessons.component';

export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent },
  { path: 'topo', component: TopMenuComponent },
  { path: 'lessons/:id', component: LessonsComponent }

];