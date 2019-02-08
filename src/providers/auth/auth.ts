import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { ApiProvider } from '../api/api';
import { Events } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';



export interface InstagramProfile {
  id?: string,
  username: string,
  full_name?: string,
  profile_picture?: string,
  bio?: string,
  website?: string,
  is_business?: boolean,
  counts?: {
    media?: number,
    follows?: number,
    followed_by?: number
  }
}

@Injectable()
export class AuthProvider {
 
  user:User;

  constructor(private afAuth: AngularFireAuth,private storage: AngularFireStorage, 
    private http: HttpClient,private api:ApiProvider,private events:Events, public facebook: Facebook,) {
    console.log('Hello AuthProvider Provider');
    
    this.afAuth.authState.subscribe((user)=>{
      if(user){
        this.user=user;
        
        console.log('user logged in');
      }else{
        console.log('user logout');
      }
    })  
  }


  
  isAuthenticated() {
  
    return new Observable(o => {
      if (this.user) {
        o.next(true);
      } else {
        let uid = localStorage.getItem('uid');
        if (uid) {
          o.next(true)
        } else {
          o.next(false);
        }
      }
    });
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then(r => {
        this.user = r.user;
        
        localStorage.setItem('uid',r.user.uid);
        this.events.publish('user:loggedIn',this.user);
        resolve(r);
      }, err => { reject(err) });
    });

  }


  getInstagramToken() {
    let url = `https://api.instagram.com/oauth/authorize/?client_id=4067bb5e06d74878a6f60513c7702f1c&redirect_uri=http://localhost:8100/&response_type=token`;
    window.location.href = url;
    debugger;
  }


  
  getInstagramProfile(token: string) {
    return new Promise((resolve, reject) => {
      let url = `https://api.instagram.com/v1/users/self/?access_token=${token}`;
      this.http.get(url).subscribe((r: any) => {
        if (r.data) {
          let profile:InstagramProfile=r.data;
          debugger;
          this.api.getProfile(profile.id).subscribe((r:User)=>{
            if(r){
              this.user=r;
              this.saveToken(this.user.uid);
              this.events.publish('user:loggedIn',this.user);
              resolve(this.user);
            }else{
              //profile not found in firebase. create a new profile
              let user={
                
                email:'',
                name:profile.full_name,
                phone:'',
                savedDeals:[],
                influencer:true,
                photo:profile.profile_picture,
                uid:profile.id
              }
              this.api.createProfile(profile.id,user).then(res=>{
                this.api.updateUid(profile.id).then(r=>{
                  console.log(r);
                },err=>{
                  console.log(err);
                })

                this.saveToken(profile.id);
                this.events.publish('user:loggedIn',profile);
                resolve(user);
              },err=>{
                reject(err);
              })
            }
          },err=>{
            console.log('error executing get profile' + err);
            reject(err);
          })
        }else{
          reject('no profile returned');
        }
      },err=>{
        reject(err);
      })
    });
  }

  checkUserExists(){
    return new Promise((resolve,reject)=>{
      
    });
  }

  getProfilePic(uid){
    return new Observable(o=>{
      this.storage.ref('/profile'+uid).getDownloadURL().subscribe(r=>{
        o.next(r);
      },err=>{
        o.error(err);
      })
    });
  }

  signup(user) {
    return new Promise((resolve,reject)=>{
      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(r=>{
        this.user=r.user;
        localStorage.setItem('uid',r.user.uid);
        resolve(r);
      },err=>{
        reject(err);
      });
    });
  
  }

  logout() {
    return new Promise((resolve,reject)=>{
      this.afAuth.auth.signOut().then(r => {
        localStorage.clear();
        this.events.publish('user:loggedOut');
        resolve();
      },err=>{
        localStorage.clear();
        resolve();
      });
    });
  }

  saveToken(uid) {
    localStorage.setItem('uid', uid);
  }

  getToken() {
    return localStorage.getItem('uid');
  }

    getUserDetail(userid) {

    return Observable.create(observer => {
     return this.facebook.api("/"+userid+"/?fields=id,email,name,picture,gender,birthday",["public_profile"])
      .then(res => {
        console.log("got details",JSON.stringify(res));
        observer.next(res);
        //this.users = res;
      })
      .catch(e => {
        console.log(e);
        observer.error(e);
      });

    })
  
  }


  changePassword(email, oldPassword, newPassword) {

    return this.afAuth.auth.signInWithEmailAndPassword(email, oldPassword).then(u => {
      let currentUser = u.user;
      return currentUser.updatePassword(newPassword).then(res => { }, err => console.log(err.message))
    })
  }

  deleteAccount(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(u => {
      let currentUser = u.user;
      return currentUser.delete()
    })
  }








}
