import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
//import {  any  } from "../models/user.model";
import { FormGroup } from "@angular/forms";





@Injectable({
    providedIn: 'root'
  })
  export class SaoService 
  {
    [x: string]: any;
    public url = environment.BaseURL;
    constructor(private http: HttpClient) { }

    // In your user-service.service.ts
    // getAllany(search: string, filter: string,pageNumber:number,pageSize:number): Observable<any> {
    //   return this.http.get<any>(`${this.url}SaoMaster/soas`, {
    //     params: {
    //       search: search,
    //       filter: filter,
    //       pageNumber: pageNumber.toString(),
    //       pageSize: pageSize.toString(),
    //     },
    //   });
    // }

    getAllany(
      search: string,
      filter: string,
      pageNumber: number,
      pageSize: number,
      soalevelCode?: string
    ): Observable<any> {
      let params: any = {
        search: search,
        filter: filter,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      };
      if (soalevelCode) {
        params.soalevelCode = soalevelCode;
      }
      return this.http.get<any>(`${this.url}SaoMaster/soas`, {
        params,
      });
    }




    GetSaosByLevelValue(level: number): Observable<any> {
      return this.http.get<any>(`${this.url}SaoMaster/GetSaosByLevelValue/${level}`);
    }
  

      public AddSao(SaoData: any): Observable<any> {
        return this.http.post<any>(this.url+"SaoMaster",SaoData);  // Send plain object instead of FormGroup
      }
      public GetSaoById(id: number): Observable<any>{
        return this.http.get<any>(this.url+"GetSaoById/"+ id);
    }
   
    public UpdateSao( formData: FormGroup): Observable<any> {
      // Use id directly to update the URL dynamically
      return this.http.put<any>(`${this.url}SaoMaster`, formData);
    }
   // Inside your anyervice (user-service.service.ts)
   softDeleteSao(id: number): Observable<any> {
    return this.http.patch<any>(`${this.url}SaoMaster/${id}`, {
      isDeleted: true
    });
  }
  
  
}

    
