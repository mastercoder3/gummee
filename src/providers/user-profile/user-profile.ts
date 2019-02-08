import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';

export interface UserProfile{
  
}

@Injectable()
export class UserProfileProvider {

  
  constructor(public http: HttpClient,authSvc:AuthProvider) {

  }

  updateUserProfile(id){
    
  }

  createUserProfile(id){

  }

  getUserProfile(id){

  }
  

}
