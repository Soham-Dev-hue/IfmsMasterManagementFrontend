import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-financial-year',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule, DialogModule, InputTextModule, ButtonModule, FormsModule,TagModule],
  providers: [CommonService],
  templateUrl: './financial-year.component.html',
  styleUrl: './financial-year.component.scss'
})
export class FinancialYearComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  item: any = { };
  saving: boolean = false;
  pageNumber: number = 1;
  searchQuery: string = '';
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchFinancialYears();
  }

  fetchFinancialYears(): void {
    this.loading = true;

    this.commonService.getAllFinancialYears(this.searchQuery,'',this.pageNumber,this.pageSize).subscribe({
      next: (response: any) => {
        const data = response?.result.items || [];

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
        this.items = data
          .filter((item: any) => !item.isdeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);

        this.loading = false;
      },
      error: (error) => {
        console.error("There was an error!", error);
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch financial years. Please try again.",
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
    this.fetchFinancialYears();
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchFinancialYears();  // Fetch the data for the updated page
  }
 confirmToggleStatus(fy: any) {
     Swal.fire({
       title: `Are you sure?`,
       text: `You are about to mark this fy as ${fy.isactive ? 'Inactive' : 'Active'}.`,
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: fy.isactive ? '#d33' : '#28a745',
       cancelButtonColor: '#6c757d',
       confirmButtonText: fy.isactive ? 'Yes, deactivate it!' : 'Yes, activate it!',
     }).then((result) => {
       if (result.isConfirmed) {
         // Call the service to update status in the backend
         this.commonService.UpdatefinancialYearStatus(fy).subscribe(
           (response) => {
             // Update the local object with the response from backend
             // or toggle the status if backend doesn't return updated object
             fy.isactive = !fy.isactive;
             
             // Show success message
             Swal.fire({
               title: 'Updated!',
               text: `The fy has been marked as ${fy.isactive ? 'Active' : 'Inactive'}.`,
               icon: 'success',
               timer: 1500
             });
           },
           (error) => {
             // Handle error
             Swal.fire({
               title: 'Error!',
               text: 'Failed to update fy status. Please try again.',
               icon: 'error'
             });
             console.error('Error updating fy status:', error);
           }
         );
       }
     });
   }
openDialog(isEdit: boolean = false, index?: number): void {
  this.isEditMode = isEdit;
  this.displayDialog = true;

  console.log("Received index:", index);
  console.log("Items list:", this.items);

  if (isEdit && index !== undefined) {
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
    console.log("Actual Index:", actualIndex);

    // Ensure actualIndex is within bounds before accessing `this.items`
    if (actualIndex >= 0 && actualIndex < this.items.length) {
      this.item = { ...this.items[actualIndex] };
    } else {
      console.error("Invalid index after pagination adjustment:", actualIndex);
      this.item = { stringValue: '' }; // Fallback default value
    }
  } else {
    this.item = { stringValue: '' };
  }
}


  saveFinancialYear(): void {
    if (this.saving) return;
    this.saving = true;

    const request = this.isEditMode
      ? this.commonService.UpdateFinancialYear(this.item)
      : this.commonService.createFinancialYear(this.item);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: this.isEditMode ? 'Financial year updated successfully!' : 'Financial year added successfully!',
        });
        this.displayDialog = false;
        this.fetchFinancialYears();
      },
      error: (error) => {
        console.error('Error saving financial year:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to save financial year. Please try again.',
        });
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  deleteFinancialYear(index: number): void {
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
    
    // Validate actualIndex
    if (actualIndex < 0 || actualIndex >= this.items.length) {
      console.error("Invalid index for financial year deletion:", actualIndex);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Invalid financial year selection. Unable to delete.',
      });
      return;
    }
  
    const itemId = this.items[actualIndex].id;
    const deletedItem = this.items[actualIndex];
  
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
        this.items.splice(actualIndex, 1); // Optimistic UI update
  
        this.commonService.SoftDeleteFinancialYear(itemId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Financial year deleted successfully.',
            });
          },
          error: (error) => {
            console.error('Error deleting financial year:', error);
            this.items.splice(actualIndex, 0, deletedItem); // Rollback UI change
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete financial year. Please try again.',
            });
          },
        });
      }
    });
  }
  onSearchChange(): void {
    this.fetchFinancialYears();
  }

  onFilterChange(): void {
    this.fetchFinancialYears();
  }

}