import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DdoService {
  private apiUrl = environment.BaseURL; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all DDOs
  getAllDDOs(search:string='',filter:string=''): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"DdoMaster",{
      params: {
        search: search,
        filter: filter
      }
    });
  }

  // Create a new DDO
  createDDO(ddo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"DdoMaster", ddo);
  }

  // Update an existing DDO
  public UpdateDdo( formData: FormGroup): Observable<any> {
       // Use id directly to update the URL dynamically
       return this.http.put<any>(`${this.apiUrl}DdoMaster`, formData);
     }
public getDDOByTreasuryCode(code: string): Observable<any> {
    return this.http.get<any>(this.apiUrl+"DdoMaster/DdoByTreasury/"+ code);

  
 
}
public GetSaosByLevelValue(level: number): Observable<any> {
  return this.http.get<any>(this.apiUrl+"DdoMaster/GetSaosByLevelValue"+ level);



}
  // Delete a DDO
  SoftDeleteDDO(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}DdoMaster/${id}`, {
      isDeleted: true
    });
  }
}