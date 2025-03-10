import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private apiUrl = environment.BaseURL; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getAllFinancialYears(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}FinancialYearMST/getFinancialYear`);
  }
  createFinancialYear(treasury: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"FinancialYearMST", treasury);
  }

  // Update an existing DDO
  public UpdateFinancialYear( formData: FormGroup): Observable<any> {
       // Use id directly to update the URL dynamically
       return this.http.put<any>(`${this.apiUrl}FinancialYearMST`, formData);
     }

     SoftDeleteFinancialYear(id: number): Observable<any> {
      return this.http.patch<any>(`${this.apiUrl}FinancialYearMST/${id}`, {
        isdeleted: true
      });
    }

  getAllHOAs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}HOA/get-hoa-details`);
  }




//treasury




  getAllTreasuries(search:string='',filter:string=''): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}TreasuryMaster`,{
      params: {
        search: search,
        filter: filter
      }
    });
  }
  createTreasury(treasury: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"TreasuryMaster", treasury);
  }

  // Update an existing DDO
  public UpdateTreasury( formData: FormGroup): Observable<any> {
       // Use id directly to update the URL dynamically
       return this.http.put<any>(`${this.apiUrl}TreasuryMaster`, formData);
     }

     SoftDeleteTreasury(id: number): Observable<any> {
      return this.http.patch<any>(`${this.apiUrl}TreasuryMaster/${id}`, {
        isdeleted: true
      });
    }

    getAllDepartments(search: string, filter: string, pageNumber: number, pageSize: number): Observable<any> {
      return this.http.get(`${this.apiUrl}DepartmentsMaster/departments`, {
        params: {
          search,
          filter,
          pageNumber,
          pageSize
        }
      });
    }
    
    createDepartment(department: any): Observable<any> {
      return this.http.post(`${this.apiUrl}DepartmentsMaster/create`, department);
    }
    
    updateDepartment(id: number, department: any): Observable<any> {
      return this.http.put(`api/Departments/update/${id}`, department);
    }
    
    deleteDepartment(id: number): Observable<any> {
      return this.http.patch(`${this.apiUrl}DepartmentsMaster/isdeleted/${id}`,{
        isdeleted: true
      });
    }
    

  getAllDesignations(search:string='',filter:string=''): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}DesignationMaster`,{
      params: {
        search: search,
        filter: filter
      }
    });
  }
  createDesignation(designation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"DesignationMaster", designation);
  }

  // Update an existing DDO
  public UpdateDesignation( formData: FormGroup): Observable<any> {
       // Use id directly to update the URL dynamically
       return this.http.put<any>(`${this.apiUrl}DesignationMaster`, formData);
     }

     SoftDeleteDesignation(id: number): Observable<any> {
      return this.http.patch<any>(`${this.apiUrl}DesignationMaster/${id}`, {
        isdeleted: true
      });
    }

  getAllMajorHeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}MajorHeadsMaster`);
  }

  getAllSubMajorHeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SubMajorHeadsMaster`);
  }

  getAllMinorHeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}MinorHeadMaster`);
  }

  getAllSchemeHeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SchemeHeadsMaster`);
  }

  getAllDetailHeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}DetailHeadsMaster`);
  }

  getAllSubDetailHeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SubDetailHeadsMaster`);
  }

  getAllSchemeTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SchemeType/get-scheme-types`);
  }
  createSchemeType(department: any): Observable<any> {
    return this.http.post(`${this.apiUrl}DepartmentsMaster/create`, department);
  }
  
  updateSchemeType(id: number, department: any): Observable<any> {
    return this.http.put(`api/Departments/update/${id}`, department);
  }
  
  deleteSchemeType(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}DepartmentsMaster/isdeleted/${id}`,{
      isdeleted: true
    });
  }

  getAllSubSchemeTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SubSchemeType/get-sub-scheme-types`);
  }
  createSubSchemeType(department: any): Observable<any> {
    return this.http.post(`${this.apiUrl}DepartmentsMaster/create`, department);
  }
  
  updateSubSchemeType(id: number, department: any): Observable<any> {
    return this.http.put(`api/Departments/update/${id}`, department);
  }
  
  deleteSubSchemeType(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}DepartmentsMaster/isdeleted/${id}`,{
      isdeleted: true
    });
  }

  getAllSAOLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SaoLevelMaster`);
  }
  createSaoLevel(department: any): Observable<any> {
    return this.http.post(`${this.apiUrl}DepartmentsMaster/create`, department);
  }
  
  updateSaoLevel(id: number, department: any): Observable<any> {
    return this.http.put(`api/Departments/update/${id}`, department);
  }
  
  deleteSaoLevel(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}DepartmentsMaster/isdeleted/${id}`,{
      isdeleted: true
    });
  }

  getAllAdmissibleReappropriations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}AdmissibleReappropriationMaster`);
  }

  getAllMajorHeadRanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}MajorHeadRangeByType`);
  }

  getAllBanks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}BankMaster`);
  }

  getAllIFSCs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}IFSCMaster`);
  }
}
