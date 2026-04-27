import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { environment } from '../../environments/environment';
import { TodoApiService } from './todo-api.service';

describe('TodoApiService', () => {
  let service: TodoApiService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/api/v1/todos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoApiService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TodoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен запрашивать список задач с фильтром', () => {
    service.getTodos('active', 'milk').subscribe();
    const req = httpMock.expectOne(`${apiUrl}?filter=active&q=milk`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('должен отправлять создание задачи', () => {
    service.createTodo('Новая').subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Новая' });
    req.flush({ id: '1', title: 'Новая', completed: false });
  });

  it('должен отправлять переключение статуса задачи', () => {
    service.toggleTodo('7').subscribe();
    const req = httpMock.expectOne(`${apiUrl}/7/toggle`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: '7', title: 'T', completed: true });
  });
});

