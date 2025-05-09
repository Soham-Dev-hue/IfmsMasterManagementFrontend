import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SaoComponent } from './components/sao/sao.component';
import { DdoComponent } from './components/ddo/ddo.component';
import { FinancialYearComponent } from './components/financial-year/financial-year.component';
import { HoaComponent } from './components/hoa/hoa.component';
import { TreasuryComponent } from './components/treasury/treasury.component';
import { DepartmentComponent } from './components/department/department.component';
import { DesignationComponent } from './components/designation/designation.component';
import { MajorHeadComponent } from './components/major-head/major-head.component';
import { SubMajorHeadComponent } from './components/sub-major-head/sub-major-head.component';
import { MinorHeadComponent } from './components/minor-head/minor-head.component';
import { SchemeHeadComponent } from './components/scheme-head/scheme-head.component';
import { DetailHeadComponent } from './components/detail-head/detail-head.component';
import { SubDetailHeadComponent } from './components/sub-detail-head/sub-detail-head.component';
import { SchemeTypeComponent } from './components/scheme-type/scheme-type.component';
import { SubSchemeTypeComponent } from './components/sub-scheme-type/sub-scheme-type.component';
import { SaoLevelComponent } from './components/sao-level/sao-level.component';
import { AdmissibleReappropriationComponent } from './components/admissible-reappropriation/admissible-reappropriation.component';
import { MajorHeadRangeByTypeComponent } from './components/major-head-range-by-type/major-head-range-by-type.component';
import { BankComponent } from './components/bank/bank.component';
import { IfscComponent } from './components/ifsc/ifsc.component';
import { RoleHierarchyMappingComponent } from './components/role-hierarchy-mapping/role-hierarchy-mapping.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'master/sao', component: SaoComponent },
  { path: 'master/ddo', component: DdoComponent },
  {path :'master/ddo/role-hierarchy-mapping',component:RoleHierarchyMappingComponent},
  { path: 'master/financial-year', component: FinancialYearComponent },
  { path: 'master/hoa', component: HoaComponent },
  { path: 'master/treasury', component: TreasuryComponent },
  { path: 'master/department', component: DepartmentComponent },
  { path: 'master/designation', component: DesignationComponent },
  { path: 'master/major-head', component: MajorHeadComponent },
  { path: 'master/sub-major-head', component: SubMajorHeadComponent },
  { path: 'master/minor-head', component: MinorHeadComponent },
  { path: 'master/scheme-head', component: SchemeHeadComponent },
  { path: 'master/detail-head', component: DetailHeadComponent },
  { path: 'master/sub-detail-head', component: SubDetailHeadComponent },
  { path: 'master/scheme-type', component: SchemeTypeComponent },
  { path: 'master/sub-scheme-type', component: SubSchemeTypeComponent },
  { path: 'master/sao-level', component: SaoLevelComponent },
  { path: 'master/admissible-reappropriation', component: AdmissibleReappropriationComponent },
  { path: 'master/major-head-range', component: MajorHeadRangeByTypeComponent },
  { path: 'master/bank', component: PageNotFoundComponent },
  { path: 'master/ifsc', component: PageNotFoundComponent },

  // Wildcard Route for any other unknown routes
  { path: '**', component: PageNotFoundComponent }

];
