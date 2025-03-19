import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-sao-level',
  templateUrl: './sao-level.component.html',
  styleUrls: ['./sao-level.component.scss'],
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
  providers: [MessageService, CommonService],
})
export class SaoLevelComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
 
  searchText: string = '';
  selectedfilter: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  // Dialog state
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  currentSaoLevel: any = { code: '', name: '' };

  constructor(
    private commonService: CommonService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchSaoLevels();
  }

  fetchSaoLevels(event?: TableLazyLoadEvent): void {
    this.loading = true;


    this.commonService.getAllSAOLevels(this.searchText, this.selectedfilter, this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {




        this.totalItems = response?.result?.totalRecords || 0;
        console.log("totalItems", this.totalItems);
        this.totalPages = response?.result?.totalPages || 0;
        console.log("totalpages", this.totalPages);



        this.items = response.result.items
        .filter((item: any) => !item.isdeleted)
        .sort((a: { id: number }, b: { id: number }) => a.id - b.id);

        this.totalRecords = response.result.totalRecords;
        this.loading = false;
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SAO levels. Please try again.',
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
    this.fetchSaoLevels();
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchSaoLevels();  // Fetch the data for the updated page
  }
  onSearch(): void {
    this.first = 0;
    this.fetchSaoLevels();
  }

  // Open dialog for adding a new SAO level
  addSaoLevel(): void {
    this.isEditMode = false;
    this.currentSaoLevel = { code: '', name: '' };
    this.displayDialog = true;
  }
  
  // Open dialog for editing an existing SAO level with pagination-aware index
  editSaoLevel(index: number): void {
    this.isEditMode = true;
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
    console.log("Actual Index:", actualIndex);
  
    if (this.items[actualIndex]) {
      this.currentSaoLevel = { ...this.items[actualIndex] };
      this.displayDialog = true;
    } else {
      console.error("Invalid index for editing.");
    }
  }
  
  // Save or update SAO level with SweetAlert2 notifications
  saveSaoLevel(): void {
    if (!this.currentSaoLevel.code || !this.currentSaoLevel.name) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Both Code and Name are required!',
      });
      return;
    }
  
    const request = this.isEditMode
      ? this.commonService.updateSaoLevel(this.currentSaoLevel.id, this.currentSaoLevel)
      : this.commonService.createSaoLevel(this.currentSaoLevel);
  
    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: this.isEditMode ? 'SAO level updated successfully' : 'SAO level created successfully',
          timer: 2000,
          showConfirmButton: false
        });
        this.fetchSaoLevels();
        this.displayDialog = false;
      },
      error: (error) => {
        console.error('There was an error!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: this.isEditMode ? 'Failed to update SAO level' : 'Failed to create SAO level',
        });
      },
    });
  }
  
  // Delete SAO level with confirmation and pagination-aware index
  deleteSaoLevel(index: number): void {
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
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.items.splice(actualIndex, 1); // Optimistically update UI
  
        this.commonService.deleteSaoLevel(itemId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'SAO level has been deleted.',
              timer: 2000,
              showConfirmButton: false
            });
            this.fetchSaoLevels();
          },
          error: (error) => {
            console.error('There was an error!', error);
            this.items.splice(actualIndex, 0, deletedItem); // Rollback UI change
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete SAO level',
            });
          },
        });
      }
    });
  }
  
  confirmToggleStatus(item: any) {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to mark this item as ${item.isactive ? 'Inactive' : 'Active'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: item.isactive ? '#d33' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: item.isactive ? 'Yes, deactivate it!' : 'Yes, activate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Toggle status
        item.isactive = !item.isactive;
  
        // Show success message
        Swal.fire({
          title: 'Updated!',
          text: `The item has been marked as ${item.isactive ? 'Active' : 'Inactive'}.`,
          icon: 'success',
          timer: 1500
        });
      }
    });
  }
}
