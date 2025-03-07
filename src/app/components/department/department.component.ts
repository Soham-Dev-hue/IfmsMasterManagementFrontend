import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-department',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule,DropdownModule,FormsModule],
  providers: [CommonService],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {
  departments: any[] = [];
  loading: boolean = false;
  searchQuery: string ='';
  selectedFilter: string ='';
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'Name', value:'name' },
    { label: 'Code', value: 'code' },
    { label: 'DemandCode', value: 'demandCode' },
  ];

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments(): void {
    this.loading = true;

    this.commonService.getAllDepartments(this.searchQuery,this.selectedFilter).subscribe({
      next: (data) => {
        this.departments = data
          .filter((dept: any) => !dept.isDeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);

        this.loading = false;
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch departments. Please try again.',
        });
      }
    });
  }

  onSearchChange(): void {
    this.fetchDepartments();
  }

  onFilterChange(): void {
    this.fetchDepartments();
  }
}
