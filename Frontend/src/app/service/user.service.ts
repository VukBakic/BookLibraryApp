import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private API_URL = environment.API_URL;

  register(registerData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/user/register`, registerData);
  }

  getUser() {
    return this.http.get(`${this.API_URL}/user/profile`);
  }
  updateUser(data: any) {
    return this.http.post(`${this.API_URL}/user/update`, data);
  }
  userExists(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${this.API_URL}/user/exists/${username}`
    );
  }

  changePassword(password: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/user/change-password`, {
      password,
      newPassword,
    });
  }
  getBookOfTheDay(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/bookoftheday/`);
  }

  getBook(id: any): Observable<any> {
    return this.http.get(`${this.API_URL}/user/book/${id}`);
  }
  getReqBook(id: any): Observable<any> {
    return this.http.get(`${this.API_URL}/user/moderator/book/${id}`);
  }
  getBookRating(id: any): Observable<any> {
    return this.http.get(`${this.API_URL}/user/book/rating/${id}`);
  }
  deleteBook(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/user/moderator/book/delete`, data);
  }
  getReviews = (id: any) => {
    return (page: number) => {
      return this.http.get(`${this.API_URL}/user/review/${id}/${page}`);
    };
  };

  borrowBook(id: any): Observable<any> {
    return this.http.post(`${this.API_URL}/user/borrow`, { book: id });
  }
  canReview(id: any): Observable<any> {
    return this.http.get(`${this.API_URL}/user/check/review/${id}`);
  }
  addReview(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/user/review/add`, data);
  }

  editReview(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/user/review/edit`, data);
  }

  borrowedBooks(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/borrowed`);
  }

  returnBook(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/user/return`, data);
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/genres`);
  }

  getTop3(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/top`);
  }

  getBooks = (page: number, data: any) => {
    return this.http.get(`${this.API_URL}/user/books/${page}`, {
      params: data,
    });
  };

  getReqBooks = (page: number, data: any) => {
    return this.http.get(`${this.API_URL}/user/moderator/books/${page}`, {
      params: data,
    });
  };

  getHistory = (page: number, data: any) => {
    return this.http.get(`${this.API_URL}/user/history/${page}`, {
      params: data,
    });
  };

  createBook(data: FormData) {
    return this.http.post(`${this.API_URL}/user/book/create`, data);
  }

  updateBook(data: FormData) {
    return this.http.post(`${this.API_URL}/user/book/update`, data);
  }
  extendBook(data: any) {
    return this.http.post(`${this.API_URL}/user/extend`, data);
  }

  notifications(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/notifications`);
  }
  getGraph(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/graph`);
  }
  getGraph2(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/graph2`);
  }

  addBookRequest(data: FormData) {
    return this.http.post(`${this.API_URL}/user/book/add`, data);
  }
}
