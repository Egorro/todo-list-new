import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Todo } from '../models/todo.model';
import { environment } from '../../environments/environment';

export type TodoFilter = 'all' | 'active' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/todos`;

  getTodos(filter: TodoFilter = 'all', q = ''): Observable<Todo[]> {
    let params = new HttpParams().set('filter', filter);
    if (q.trim()) {
      params = params.set('q', q.trim());
    }
    return this.http.get<Todo[]>(this.apiUrl, { params });
  }

  createTodo(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, { title });
  }

  updateTitle(id: string, title: string): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, { title });
  }

  toggleTodo(id: string): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

