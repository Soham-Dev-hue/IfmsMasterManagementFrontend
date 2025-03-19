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

  getAllFinancialYears(search: string, filter: string, pageNumber: number, pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}FinancialYearMST/FinancialYear`, {
      params: {
        search,
        filter,
        pageNumber,
        pageSize
      }
    });
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
      return this.http.put(`${this.apiUrl}DepartmentsMaster/update/${id}`, department);
    }
    
    deleteDepartment(id: number): Observable<any> {
      return this.http.patch(`${this.apiUrl}DepartmentsMaster/isdeleted/${id}`,{
        isdeleted: true
      });
    }
    

  getAllDesignations(search:string='',filter:string='',pageNumber?:any,pageSize?:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}DesignationMaster/designations`,{
      params: {
        search: search,
        filter: filter,
        pageNumber: pageNumber,
        pageSize: pageSize
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

  getAllMajorHeads(search:string='',filter:string='',pageNumber?:any,pageSize?:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}MajorHeadsMaster`,{
      params: {
        search: search,
        filter: filter,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  getAllSubMajorHeads(search:string='',filter:string='',pageNumber?:any,pageSize?:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SubMajorHeadsMaster`,{
      params: {
        search: search,
        filter: filter,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }
  getSubMajorHeadByMajorHeadId(id: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}SubMajorHeadsMaster/SubMajorHeadByMajorHeadId/${id}`);
  }
getMinorHeadBySubMajorId(id: any): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}MinorHeadMaster/MinorHeadBySubMajorHeadId/${id}`);
}
getSchemeHeadByMinorHeadId(id: any): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}SchemeHeadsMaster/SchemeHeadByMinorHeadId/${id}`);
}
getMajorHeadByDemandCode(demandCode: any): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}MajorHeadsMaster/GetMajorByDemand/${demandCode}`);
}
  getAllMinorHeads(search:string='',filter:string='',pageNumber?:any,pageSize?:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}MinorHeadMaster/minorhead`,{
      params: {
        search: search,
        filter: filter,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  getAllSchemeHeads(search:string='',filter:string='',pageNumber?:any,pageSize?:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SchemeHeadsMaster`,{
      params: {
        search: search,
        filter: filter,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  getAllDetailHeads(search:string='',filter:string='',pageNumber?:any,pageSize?:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}DetailHeadsMaster/detailhead`,{
      params: {
        search: search,
        filter: filter,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  getAllSubDetailHeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SubDetailHeadsMaster`);
  }
getSubDetailHeadByDetailHeadId(id:any): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}SubDetailHeadsMaster/SubdetailHeadByDetailHeadId/${id}`);
}
  getAllSchemeTypes(search: string, filter: string, pageNumber: number, pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SchemeType/schemetype`,{
      params: {
        search,
        filter,
        pageNumber,
        pageSize
      }}
    );
  }
  createSchemeType(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}SchemeType/create`, data);
  }
  
  updateSchemeType(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}SchemeType/update/${id}`, data);
  }
  
  deleteSchemeType(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}SchemeType/isdeleted/${id}`,{
      isdeleted: true
    });
  }

  getAllSubSchemeTypes(search: string, filter: string, pageNumber: number, pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SubSchemeType/subschemetype`,{
      params:{
        search:search,
        filter:filter,
        pageNumber:pageNumber,
        pageSize:pageSize

      }
    });
  }
  createSubSchemeType(data: any): Observable<any> {
    data.isactive=true;
    data.isdelete=false;
    return this.http.post(`${this.apiUrl}SubSchemeType/create`, data);
  }
  
  updateSubSchemeType(id: number, data: any): Observable<any> {
    data.isactive=true;
    data.isdelete=false;
    return this.http.put(`${this.apiUrl}SubSchemeType/update/${id}`, data);
  }
  
  deleteSubSchemeType(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}SubSchemeType/isdeleted/${id}`,{
      isdeleted: true
    });
  }

  getAllSAOLevels(search:string='',filter:string='',pageNumber:any,pageSize:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}SaoLevelMaster`,{
      params:{
        search:search,
        filter:filter,
        pageNumber:pageNumber,
        pageSize:pageSize

      }
    });
  }

  createSaoLevel(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}SaoLevelMaster`, data);
  }
  
  updateSaoLevel(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}SaoLevelMaster/update/${id}`, data);
  }
  
  deleteSaoLevel(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}SaoLevelMaster/isdeleted/${id}`,{
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
