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
@Component({
  selector: 'app-sao-level',
  standalone: true,
 imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule,TagModule,ButtonModule,FormsModule,DialogModule],
  providers: [CommonService],
  templateUrl: './sao-level.component.html',
  styleUrl: './sao-level.component.scss'
})
export class SaoLevelComponent {
items: any[] = [];
  loading: boolean = false;
  isEditMode: boolean = false;
  item: any = {};
  displayDialog: boolean = false;
  saving: boolean = false; // To prevent multiple clicks



  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchSaoLevels();
  }

  fetchSaoLevels(): void {
    this.loading = true;
  
    this.commonService.getAllSAOLevels().subscribe({
      next: (response: any) => {
        // Extract the `result` array from the response
        const data = response?.result || [];
  
        // Check if `data` is an array
        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", response);
          this.items = [];
          this.loading = false;
          return;
        }
  
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
    openDialog(isEdit: boolean = false, index?: number): void {
        this.isEditMode = isEdit;
        this.displayDialog = true;
    
        if (isEdit && index !== undefined && this.items[index]) {
          this.item = { ...this.items[index] };
        } else {
          this.item = {
            name: '',
          };
        }
      }
    saveSaoLevels(): void {
        if (this.saving) return; // Prevent duplicate clicks
        this.saving = true;
    
        const request = this.isEditMode
          ? this.commonService.updateSaoLevel( this.item.id,this.item)
          : this.commonService.createSaoLevel(this.item);
    
        request.subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: this.isEditMode ? ' fetchSaoLevels updated successfully!' : ' fetchSaoLevels added successfully!',
            });
            this.displayDialog = false;
            this.fetchSaoLevels();
          },
          error: (error) => {
            console.error('Error saving  fetchSaoLevels:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to save  fetchSaoLevels. Please try again.',
            });
          },
          complete: () => {
            this.saving = false;
          }
        });
      }
       deleteSaoLevel(index: number): void {
          const itemId = this.items[index].id;
          const deleteditem = this.items[index]; // Store for rollback
        
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
              this.items.splice(index, 1); // Optimistically update UI
        
              this.commonService.deleteSaoLevel(itemId).subscribe({
                next: () => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'item deleted successfully.',
                  });
                },
                error: (error) => {
                  console.error('Error deleting item:', error);
                  this.items.splice(index, 0, deleteditem); // Rollback UI change
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
