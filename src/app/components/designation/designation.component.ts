import { Component } from '@angular/core';
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
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule,FormsModule,DropdownModule,DialogModule,TableModule,ButtonModule,TagModule],
  providers: [CommonService],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.scss'
})
export class DesignationComponent {
items: any[] = [];
  loading: boolean = false;
  searchQuery: string ='';
  selectedFilter: string ='';
  filterOptions: any[] = [
    { label: 'Designation', value: 'name' },
  ];
  isEditMode:boolean = false;
  displayDialog: boolean = false;
  item: any = {};
  saving: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchDesignations();
  }

  fetchDesignations(): void {
    this.loading = true;
  
    this.commonService.getAllDesignations(this.searchQuery,this.selectedFilter,this.pageNumber,this.pageSize).subscribe({
      next: (response: any) => {
        // Extract the `result` array from the response
        const data = Array.isArray(response) ? response : response?.result.items || [];
  
        // Check if `data` is an array
        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", response);
          this.items = [];
          this.loading = false;
          return;
        }
        this.totalItems = response?.result?.totalRecords || 0;
        console.log("totalItems", this.totalItems);
        this.totalPages = response?.result?.totalPages || 0;
        console.log("totalpages", this.totalPages);
        // Process the valid array
        this.items = data
          .filter((item: any) => !item.isDeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
  
        this.loading = false;
      },
      error: (error) => {
        console.error("There was an error!", error);
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch SAO levels. Please try again.",
        });
      },
    });
  }
  get first(): number {
    return (this.pageNumber - 1) * this.pageSize; // Adjusting for 1-based pageNumber
  }

  // Setter: Update the pageNumber based on the first index value
  set first(value: number) {
    this.pageNumber = Math.floor(value / this.pageSize) + 1;
    this.fetchDesignations();
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchDesignations();  // Fetch the data for the updated page
  }
   confirmToggleStatus(designation: any) {
        Swal.fire({
          title: `Are you sure?`,
          text: `You are about to mark this designation as ${designation.isActive ? 'Inactive' : 'Active'}.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: designation.isActive ? '#d33' : '#28a745',
          cancelButtonColor: '#6c757d',
          confirmButtonText: designation.isActive ? 'Yes, deactivate it!' : 'Yes, activate it!',
        }).then((result) => {
          if (result.isConfirmed) {
            // Call the service to update status in the backend
            this.commonService.UpdateDesignationStatus(designation).subscribe(
              (response) => {
                // Update the local object with the response from backend
                // or toggle the status if backend doesn't return updated object
                designation.isActive = !designation.isActive;
                
                // Show success message
                Swal.fire({
                  title: 'Updated!',
                  text: `The designation has been marked as ${designation.isActive ? 'Active' : 'Inactive'}.`,
                  icon: 'success',
                  timer: 1500
                });
              },
              (error) => {
                // Handle error
                Swal.fire({
                  title: 'Error!',
                  text: 'Failed to update designation status. Please try again.',
                  icon: 'error'
                });
                console.error('Error updating designation status:', error);
              }
            );
          }
        });
      }
  onSearchChange(): void {
    this.fetchDesignations();
  }

  onFilterChange(): void {
    this.fetchDesignations();
  }
  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;

    if (isEdit && index !== undefined) {
      const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
      console.log("Actual Index:", actualIndex);

      if (this.items[actualIndex]) {
        this.item = { ...this.items[actualIndex] };
      } else {
        console.error("Invalid index for editing");
      }
    } else {
      this.item = {
        name: '',
      };
    }
}

saveDesignation(): void {
    if (this.saving) return; // Prevent duplicate clicks
    this.saving = true;

    const request = this.isEditMode
      ? this.commonService.UpdateDesignation( this.item)
      : this.commonService.createDesignation(this.item);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: this.isEditMode ? 'Designation updated successfully!' : 'Designation added successfully!',
        });
        this.displayDialog = false;
        this.fetchDesignations();
      },
      error: (error) => {
        console.error('Error saving Designation:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to save Designation. Please try again.',
        });
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
  deleteDesignation(index: number): void {
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
    console.log("Actual Index for Deletion:", actualIndex);

    if (actualIndex < 0 || actualIndex >= this.items.length) {
        console.error("Invalid index for deletion");
        return;
    }

    const itemId = this.items[actualIndex].id;
    const deleteditem = this.items[actualIndex]; // Store for rollback

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

            this.commonService.SoftDeleteDesignation(itemId).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Item deleted successfully.',
                    });
                },
                error: (error) => {
                    console.error('Error deleting item:', error);
                    this.items.splice(actualIndex, 0, deleteditem); // Rollback UI change
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to delete item. Please try again.',
                    });
                },
            });
        }
    });
}

}

