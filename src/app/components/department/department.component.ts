import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    TableModule,
    ProgressSpinnerModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [CommonService],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  departments: any[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  selectedFilter: string = '';
  filterOptions: any[] = [
    { label: 'Name', value: 'name' },
    { label: 'Code', value: 'code' },
    { label: 'Demand Code', value: 'demandCode' },
  ];
  isEditMode: boolean = false;
  displayDialog: boolean = false;
  department: any = {};
  saving: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 100;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments(): void {
    this.loading = true;

    this.commonService.getAllDepartments(this.searchQuery, this.selectedFilter, this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        if (response.apiResponseStatus === 'Error') {
          console.error("Error fetching departments:", response);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to fetch departments. Please try again.",
          });
          this.departments = [];
        } else {
          this.departments = response.result.items
          .filter((item: any) => !item.isdeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        }
        console.log(this.departments);
        
        this.loading = false;
      },
      error: (error) => {
        console.error("There was an error!", error);
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch departments. Please try again.",
        });
        this.departments = [];
      },
    });
  }

  onSearchChange(): void {
    this.fetchDepartments();
  }

  onFilterChange(): void {
    this.fetchDepartments();
  }

  onPageChange(event: any): void {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.fetchDepartments();
  }

  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;

    if (isEdit && index !== undefined && this.departments[index]) {
      this.department = { ...this.departments[index] };
    } else {
      this.department = {
        name: '',
        code: '',
        demandCode: '',
        address: '',
      };
    }
  }

  saveDepartment(): void {
    if (this.saving) return; // Prevent duplicate clicks
    this.saving = true;

    const request = this.isEditMode
      ? this.commonService.updateDepartment(this.department.id, this.department)
      : this.commonService.createDepartment(this.department);

    request.subscribe({
      next: (response: any) => {
        if (response.apiResponseStatus === 'Error') {
          console.error("Error saving department:", response);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to save department. Please try again.',
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: this.isEditMode ? 'Department updated successfully!' : 'Department added successfully!',
          });
          this.displayDialog = false;
          this.fetchDepartments();
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving Department:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to save Department. Please try again.',
        });
        this.saving = false;
      },
    });
  }

  deleteDepartment(index: number): void {
    if (index < 0 || index >= this.departments.length) {
      console.error("Invalid index for department deletion:", index);
      return;
    }
  console.log(index);
  
    const department = this.departments[index];
console.log(department);

  
    if (!department || !department.id) {
      console.error("Department ID is undefined:", department);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Invalid department. Unable to delete.',
      });
      return;
    }
  
    const departmentId = department.id;
    console.log("Attempting to delete department:", department);
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departments.splice(index, 1); // Optimistically update UI
  
        this.commonService.deleteDepartment(departmentId).subscribe({
          next: (response: any) => {
            if (response.apiResponseStatus === 'Error') {
              console.error("Error deleting department:", response);
              this.departments.splice(index, 0, department); // Rollback UI change
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete department. Please try again.',
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Department deleted successfully.',
              });
            }
          },
          error: (error) => {
            console.error('Error deleting department:', error);
            this.departments.splice(index, 0, department); // Rollback UI change
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete department. Please try again.',
            });
          },
        });
      }
    });
  }
  
  
}
