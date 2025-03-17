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
  first: number = 0;
  rows: number = 10;
  searchText: string = '';
  selectedfilter: string = '';
  pageNumber?: number;
  pageSize?: number;
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

    const pageNumber =
      event?.first !== undefined &&
      typeof event.rows === 'number' &&
      event.rows > 0
        ? Math.floor(event.first / event.rows)+1
        : undefined;

    const pageSize =
      typeof event?.rows === 'number' && event.rows > 0
        ? event.rows
        : undefined;

    this.commonService
      .getAllSAOLevels(
        this.searchText,
        this.selectedfilter,
        pageNumber,
        pageSize
      )
      .subscribe({
        next: (response: any) => {
          this.items = response.result.items
            .filter((item: any) => !item.isdeleted)
            .sort((a: { id: number }, b: { id: number }) => a.id - b.id);

          this.totalRecords = pageNumber
            ? response.result.totalRecords
            : this.items.length;
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

  onSearch(): void {
    this.first = 0;
    this.fetchSaoLevels();
  }
  onFilterChange(): void {
    this.fetchSaoLevels();
  }
  // Open dialog for adding a new SAO level
  addSaoLevel(): void {
    this.isEditMode = false;
    this.currentSaoLevel = { code: '', name: '' };
    this.displayDialog = true;
  }

  // Open dialog for editing an existing SAO level
  editSaoLevel(item: any): void {
    this.isEditMode = true;
    this.currentSaoLevel = { ...item };
    this.displayDialog = true;
  }

  // Save or update SAO level with SweetAlert2 notifications
  saveSaoLevel(): void {
    if (this.isEditMode) {
      // Update existing SAO level
      this.commonService.updateSaoLevel(this.currentSaoLevel.id, this.currentSaoLevel).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'SAO level updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
          this.fetchSaoLevels();
        },
        error: (error) => {
          console.error('There was an error!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to update SAO level',
          });
        },
      });
    } else {
      // Create new SAO level
      this.commonService.createSaoLevel(this.currentSaoLevel).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'SAO level created successfully',
            timer: 2000,
            showConfirmButton: false
          });
          this.fetchSaoLevels();
        },
        error: (error) => {
          console.error('There was an error!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to create SAO level',
          });
        },
      });
    }
    this.displayDialog = false;
  }

  // Delete SAO level with confirmation dialog using SweetAlert2
  deleteSaoLevel(id: number): void {
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
        this.commonService.deleteSaoLevel(id).subscribe({
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
