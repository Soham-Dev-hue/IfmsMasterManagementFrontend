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
import { TagModule } from 'primeng/tag';

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
    InputTextModule,
    TagModule
  ],
  providers: [CommonService],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
 items : any[] = [];
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
  item: any = {};
  saving: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  showInactiveOnly: boolean = false;



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
          this.items = [];
        } else {

          this.totalItems = response?.result?.totalRecords || 0;
          console.log("totalItems", this.totalItems);
          this.totalPages = response?.result?.totalPages || 0;
          console.log("totalpages", this.totalPages);


          this.items= response.result.items
          .filter((item: any) => !item.isdeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        }
        console.log(this.items);
        
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
        this.items = [];
      },
    });
  }
  get first(): number {
    return (this.pageNumber - 1) * this.pageSize; // Adjusting for 1-based pageNumber
  }

  // Setter: Update the pageNumber based on the first index value
  set first(value: number) {
    this.pageNumber = Math.floor(value / this.pageSize) + 1;
    this.fetchDepartments();
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchDepartments();  // Fetch the data for the updated page
  }
  onSearchChange(): void {
    this.fetchDepartments();
  }

  onFilterChange(): void {
    this.fetchDepartments();
  }

 

  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;
  console.log(index);
  console.log(this.items);
  
    if (isEdit && index !== undefined) {
      const actualIndex=index-((this.pageNumber-1)*this.pageSize); // Adjust index with pagination
      console.log(actualIndex);
  
      if (this.items[actualIndex]) {
        this.item = { ...this.items[actualIndex] };
      }
    } else {
      this.item = {
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
      ? this.commonService.updateDepartment(this.item.id, this.item)
      : this.commonService.createDepartment(this.item);

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
    const actualIndex = index - (this.pageNumber - 1) * this.pageSize; // Adjust index based on pagination
    console.log("Clicked index:", index);
    console.log("Actual index in items array:", actualIndex);
  
    if (actualIndex < 0 || actualIndex >= this.items.length) {
      console.error("Invalid index for department deletion:", actualIndex);
      return;
    }
  
    const department = this.items[actualIndex];
    console.log("Department to delete:", department);
  
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
    console.log("Attempting to delete department with ID:", departmentId);
  
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
        this.items.splice(actualIndex, 1); // Optimistically update UI
  
        this.commonService.deleteDepartment(departmentId).subscribe({
          next: (response: any) => {
            if (response.apiResponseStatus === 'Error') {
              console.error("Error deleting department:", response);
              this.items.splice(actualIndex, 0, department); // Rollback UI change
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
            this.items.splice(actualIndex, 0, department); // Rollback UI change
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
   fetchAllDepartments(): void {
      this.loading = true;
      
      this.commonService.getAllDepartments(
        this.searchQuery,
        this.selectedFilter,
        1,
        15000
      ).subscribe({
        next: (data: any) => {
          console.log('Full API response:', data); // Debug - check exact property names
          
          // First filter out deleted items
          const allItems = (data.result.items || [])
            .filter((item: any) => !item.isdeleted);
          
          // Then apply active status filter based on actual property name
          this.items = this.showInactiveOnly 
            ? allItems.filter((item: any) => {
                // Check all possible inactive states
                return item.isActive === false || 
                       item.isactive === false ||
                       item.active === false ||
                       item.status === 'inactive';
              })
            : allItems.filter((item: any) => {
                // Show active only when not in inactive mode
                return !this.showInactiveOnly && 
                      (item.isActive === true || 
                       item.isactive === true ||
                       item.active === true ||
                       item.status === 'active');
              });
          
          console.log('Filtered items:', this.items);
          
          // Update pagination info
          this.totalItems = this.items.length;
          this.totalPages = 1;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading = false;
          Swal.fire('Error', 'Failed to load items', 'error');
        }
      });
  }
  
  toggleInactive(): void {
    this.showInactiveOnly = !this.showInactiveOnly;
    this.pageNumber = 1; // Always reset to first page
    
    if (this.showInactiveOnly) {
        this.fetchAllDepartments(); // Get all records for inactive filter
    } else {
        this.fetchDepartments(); // Normal paginated fetch
    }
  }
  
 confirmToggleStatus(dept: any) {
      Swal.fire({
        title: `Are you sure?`,
        text: `You are about to mark this dept as ${dept.isactive ? 'Inactive' : 'Active'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: dept.isactive ? '#d33' : '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: dept.isactive ? 'Yes, deactivate it!' : 'Yes, activate it!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Call the service to update status in the backend
          this.commonService.UpdateDepartmentStatus(dept.id,dept).subscribe(
            (response) => {
              // Update the local object with the response from backend
              // or toggle the status if backend doesn't return updated object
              dept.isactive = !dept.isactive;
              
              // Show success message
              Swal.fire({
                title: 'Updated!',
                text: `The dept has been marked as ${dept.isactive ? 'Active' : 'Inactive'}.`,
                icon: 'success',
                timer: 1500
              });
            },
            (error) => {
              // Handle error
              Swal.fire({
                title: 'Error!',
                text: 'Failed to update dept status. Please try again.',
                icon: 'error'
              });
              console.error('Error updating dept status:', error);
            }
          );
        }
      });
    }
}
