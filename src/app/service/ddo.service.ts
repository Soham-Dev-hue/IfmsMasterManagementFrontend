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
  getAllDDOs(
    search: string,
    filter: string,
    pageNumber: number,
    pageSize: number,
    treasurycode?: string
  ): Observable<any[]> {
    let params: any = {
      search: search,
      filter: filter,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    if (treasurycode) {
      params.treasurycode = treasurycode;
    }
    return this.http.get<any[]>(this.apiUrl + 'Ddo', {
      params,
    });
  }

  // Create a new DDO
  createDDO(ddo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"Ddo/create", ddo);
  }

  // Update an existing DDO
  public UpdateDdo( formData: FormGroup,id:number): Observable<any> {
       // Use id directly to update the URL dynamically
       return this.http.put<any>(`${this.apiUrl}Ddo/update/${id}`, formData);
     }
public getDDOByTreasuryCode(code: string): Observable<any> {
    return this.http.get<any>(this.apiUrl+"Ddo/DdoByTreasury/"+ code);

  
 
}
public GetSaosByLevelValue(level: number): Observable<any> {
  return this.http.get<any>(this.apiUrl+"DdoMaster/GetSaosByLevelValue"+ level);



}
  // Delete a DDO
  SoftDeleteDDO(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}Ddo/${id}`, {
      isDeleted: true
    });
  }
}