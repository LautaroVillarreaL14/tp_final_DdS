import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUser, UpdateUserRoleDto } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(`${this.api}/users`);
  }

  updateRole(id: string, dto: UpdateUserRoleDto): Observable<SafeUser> {
    return this.http.patch<SafeUser>(`${this.api}/users/${id}/role`, dto);
  }

  changeMyPassword(dto: { currentPassword: string; newPassword: string }) {
    return this.http.patch(`${this.api}/users/me/password`, dto);
  }

  changeMyEmail(dto: { newEmail: string; password: string }) {
    return this.http.patch(`${this.api}/users/me/email`, dto);
  }
}
