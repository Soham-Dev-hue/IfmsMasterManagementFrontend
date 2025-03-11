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
  selector: 'app-scheme-type',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule,TagModule,ButtonModule,FormsModule,DialogModule],
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

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchSchemeTypes();
  }

  fetchSchemeTypes(): void {
    this.loading = true;
  
    this.commonService.getAllSchemeTypes('','',1,100).subscribe({
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
  
        // Process the valid array
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
          type: '',
        };
      }
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
      
            this.commonService.deleteSchemeType(itemId).subscribe({
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
