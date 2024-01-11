import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}
  private API_URL = environment.API_URL;

  getPendingUsers = (page: number) => {
    return this.http.get(`${this.API_URL}/admin/pending/${page}`);
  };
  getUsers = (page: number) => {
    return this.http.get(`${this.API_URL}/admin/users/${page}`);
  };

  getUser(id: any) {
    return this.http.get(`${this.API_URL}/admin/user/${id}`);
  }

  createUser(data: any) {
    return this.http.post(`${this.API_URL}/admin/user/create/`, data);
  }
  updateUser(data: any) {
    return this.http.post(`${this.API_URL}/admin/user/update/`, data);
  }
  acceptUser(id: any) {
    return this.http.post(`${this.API_URL}/admin/accept-user`, {
      id,
    });
  }
  deleteUser(id: any) {
    return this.http.post(`${this.API_URL}/admin/delete-user`, {
      id,
    });
  }
  activate(id: any) {
    return this.http.post(`${this.API_URL}/admin/unblock`, {
      id,
    });
  }
  deactivate(id: any) {
    return this.http.post(`${this.API_URL}/admin/block`, {
      id,
    });
  }
  createBook(data: FormData) {
    return this.http.post(`${this.API_URL}/admin/book/create`, data);
  }

  updateBook(data: FormData) {
    return this.http.post(`${this.API_URL}/admin/book/update`, data);
  }

  deleteBook(data: any) {
    return this.http.post(`${this.API_URL}/admin/book/delete`, data);
  }

  getBooks = (page: number, data: any) => {
    return this.http.get(`${this.API_URL}/admin/books/${page}`, {
      params: data,
    });
  };

  updateConfig(data: any) {
    return this.http.post(`${this.API_URL}/admin/configuration/update`, data);
  }
  getConfig() {
    return this.http.get(`${this.API_URL}/admin/configuration`);
  }
}
