import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-sub-scheme-type',
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
  templateUrl: './sub-scheme-type.component.html',
  styleUrl: './sub-scheme-type.component.scss'
})
export class SubSchemeTypeComponent {
items: any[] = [];
  loading: boolean = false;
  isEditMode: boolean = false;
  item: any = {};
  saving: boolean=false;
  displayDialog: boolean = false;
  pageNumber: number = 1;
pageSize: number = 10;
totalItems: number = 0;
ID:number = 0;
totalPages: number = 0;
actualIndex: number = 0;
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'SchemeType', value: 'type' },
    { label: 'Description', value: 'description' },
  ];
  searchQuery: string ='';
  selectedFilter:string = '';

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchSubSchemeTypes();
  }

  fetchSubSchemeTypes(): void {
    this.loading = true;
  
    this.commonService.getAllSubSchemeTypes(this.searchQuery,this.selectedFilter,this.pageNumber,this.pageSize).subscribe({
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
          .filter((item: any) => !item.isdelete)
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
    this.fetchSubSchemeTypes();
  }
  onPageChange(event: any): void {
    
    this.actualIndex=0;
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchSubSchemeTypes();  // Fetch the data for the updated page
  }
  onFilterChange(): void {
    this.fetchSubSchemeTypes();
  }
  onSearchChange(): void {
    this.fetchSubSchemeTypes();
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
    openDialog(item?:any,isEdit: boolean = false, index?: number): void {
      this.isEditMode = isEdit;
      this.displayDialog = true;
  console.log(item);
  
      if (isEdit && index !== undefined) {
          // Calculate the actual index
         // this.actualIndex = (this.pageNumber - 1) * this.pageSize + index;
          console.log('Index:', index);
          console.log('Actual Index:', this.actualIndex);
          console.log(this.items);
          
  this.ID=item.id;
     
          this.item = {
            description: item.description || '',
            type: item.type || '',
        };
          
      } 
  }
  saveSubSchemeType(): void {
    if (this.saving) return; // Prevent duplicate clicks
    this.saving = true;
  
    console.log("Saving ID:", this.item?.id); // Debugging log
    console.log(this.item);
    if (this.isEditMode && !this.ID) {
      console.error("ID is missing during edit!");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot update item without an ID.",
      });
      this.saving = false;
      return;
    }
  console.log(this.item);
  
    const request = this.isEditMode
      ? this.commonService.updateSubSchemeType(this.ID, this.item)
      : this.commonService.createSubSchemeType(this.item);
  
    request.subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: this.isEditMode ? "SubSchemeType updated successfully!" : "SubSchemeType added successfully!",
        });
        this.displayDialog = false;
        this.fetchSubSchemeTypes();
      },
      error: (error) => {
        console.error("Error saving SubSchemeType:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to save SubSchemeType. Please try again.",
        });
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
  
  deleteSubSchemeType(index: number): void {
    console.log(this.items);
    const actualIndex=index-((this.pageNumber-1)*this.pageSize);
    console.log(actualIndex);
    
    // Check if the item at the specified index exists
    if (!this.items[actualIndex]) {
        console.error('Item not found at index:', actualIndex);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Item not found. Please try again.',
        });
        return;
    }

    // Get the item ID directly from the items array
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
            // Optimistically remove the item from the UI
            this.items.splice(actualIndex, 1);

            // Call the API to delete the item
            this.commonService.deleteSubSchemeType(itemId).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Item deleted successfully.',
                    });
                    // Refresh the list to reflect the changes
                    this.fetchSubSchemeTypes();
                },
                error: (error) => {
                    console.error('Error deleting item:', error);
                    // Rollback the UI change if the API call fails
                    this.items.splice(index, 0, deletedItem);
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
