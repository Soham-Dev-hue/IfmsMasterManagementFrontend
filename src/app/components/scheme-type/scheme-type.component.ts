import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-scheme-type',
  standalone: true,
   imports: [
     CommonModule,
     TableModule,
     ButtonModule,
     DialogModule,
     FormsModule,
     HttpClientModule,
     ProgressSpinnerModule,
     DropdownModule,
     TagModule,
   ],
  providers: [CommonService],
  templateUrl: './scheme-type.component.html',
  styleUrl: './scheme-type.component.scss'
})
export class SchemeTypeComponent {
items: any[] = [];
  loading: boolean = false;
isEditMode: boolean = false;
item:any={};
  displayDialog: boolean = false;
saving: boolean = false;
pageNumber: number = 1;
pageSize: number = 10;
totalItems: number = 0;
totalPages: number = 0;
filterOptions: any[] = [
  { label: 'All', value: '' },
  { label: 'SchemeType', value: 'type' },
  { label: 'Description', value: 'description' },
];
searchQuery: string ='';
selectedFilter:string = '';
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchSchemeTypes();
  }

  fetchSchemeTypes(): void {
    this.loading = true;
  
    this.commonService.getAllSchemeTypes(this.searchQuery,this.selectedFilter,this.pageNumber,this.pageSize).subscribe({
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
    this.fetchSchemeTypes();
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchSchemeTypes();  // Fetch the data for the updated page
  }
  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;
  
    if (isEdit && index !== undefined) {
      const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
      console.log("Actual Index:", actualIndex);
  
      if (this.items[actualIndex]) {
        this.item = { ...this.items[actualIndex] };
      }
    } else {
      this.item = {
        description: '',
        type: '',
      };
    }
  }
      confirmToggleStatus(item: any): void {
         Swal.fire({
           title: `Are you sure?`,
           text: `You are about to mark this item as ${item.isActive ? 'Inactive' : 'Active'}.`,
           icon: 'warning',
           showCancelButton: true,
           confirmButtonColor: item.isActive ? '#d33' : '#28a745',
           cancelButtonColor: '#6c757d',
           confirmButtonText: item.isActive ? 'Yes, deactivate it!' : 'Yes, activate it!',
         }).then((result) => {
           if (result.isConfirmed) {
             this.commonService.updateActiveStatusSchemeType(item.id, item).subscribe({
               next: (response:any) => {
                 console.log('Response:', response); // Debugging
                 item.isActive = !item.isActive; // Update UI after successful API response
                 Swal.fire({
                   title: 'Updated!',
                   text: `The item has been marked as ${item.isActive ? 'Active' : 'Inactive'}.`,
                   icon: 'success',
                   timer: 1500
                 });
               },
               error: (error:any) => {
                 console.error('Error updating item status:', error);
                 Swal.fire({
                   title: 'Error!',
                   text: 'Failed to update item status. Please try again.',
                   icon: 'error',
                 });
               }
             });
           }
         });
       }
  saveSchemeType(): void {
      if (this.saving) return; // Prevent duplicate clicks
      this.saving = true;
  
      const request = this.isEditMode
        ? this.commonService.updateSchemeType( this.item.id,this.item)
        : this.commonService.createSchemeType(this.item);
  
      request.subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: this.isEditMode ? ' fetchSchemeTypes updated successfully!' : ' fetchSchemeTypes added successfully!',
          });
          this.displayDialog = false;
          this.fetchSchemeTypes();
        },
        error: (error) => {
          console.error('Error saving  fetchSchemeTypes:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to save  fetchSchemeTypes. Please try again.',
          });
        },
        complete: () => {
          this.saving = false;
        }
      });
    }
    deleteSchemeType(index: number): void {
      const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
      console.log("Actual Index:", actualIndex);
    
      if (actualIndex < 0 || actualIndex >= this.items.length) {
        console.error("Invalid index for deletion.");
        return;
      }
    
      const itemId = this.items[actualIndex].id;
      const deletedItem = this.items[actualIndex]; // Store for rollback
    
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
    
          this.commonService.deleteSchemeType(itemId).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Item deleted successfully.',
              });
            },
            error: (error) => {
              console.error('Error deleting item:', error);
              this.items.splice(actualIndex, 0, deletedItem); // Rollback UI change
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
     onFilterChange(): void {
      this.fetchSchemeTypes();
    }
    onSearchChange(): void {
      this.fetchSchemeTypes();
    }
}
