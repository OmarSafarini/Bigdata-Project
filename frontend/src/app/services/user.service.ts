import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  getUserById(id: string) : Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }



  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  addIngredient(userId: string, ingredient: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/ingredients`, { ingredient });
  }

  removeIngredient(userId: string, ingredient: string) {
    return this.http.put(`${this.apiUrl}/${userId}/ingredients/remove`, { ingredient });
  }

  login(email: string, password: string) {
    return this.http.post<{ userId: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }

  getLoggedInUser(): Observable<any> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      throw new Error('User not logged in');
    }

    return this.getUserById(userId);
  }


}
