import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import Swal from 'sweetalert2';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-admissible-reappropriation',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    HttpClientModule,
    ProgressSpinnerModule,
    TagModule
  ],
  providers: [CommonService],
  templateUrl: './admissible-reappropriation.component.html',
  styleUrls: ['./admissible-reappropriation.component.scss']
})
export class AdmissibleReappropriationComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  item: any = {
    fromDtlHead: '',
    fromSubdtlHead: null,
    toDtlHead: '',
    toSubdtlHead: null
  };
  saving: boolean = false;
  pageNumber: number = 1;
  searchQuery: string = '';
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // For dropdowns (you may need to populate these from your service)
  dtlHeadOptions: any[] = [];
  subdtlHeadOptions: any[] = [];

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchItems();
    // Load dropdown options if needed
     this.loadDropdownOptions();
  }

  fetchItems(): void {
    this.loading = true;
    this.cdr.markForCheck(); // Mark for change detection

    this.commonService.getAllAdmissibleReappropriations().subscribe({
      next: (response: any) => {
        const data = response || [];
        
        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", response);
          this.items = [];
          this.loading = false;
          this.cdr.detectChanges(); // Trigger change detection
          return;
        }

        // this.totalItems = response?.result?.totalRecords || 0;
        // this.totalPages = response?.result?.totalPages || 0;
        this.items = data
          .filter((item: any) => !item.isdeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);

        this.loading = false;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error("There was an error!", error);
        this.loading = false;
        this.cdr.detectChanges(); // Trigger change detection
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch admissible reappropriations. Please try again.",
        });
      },
    });
  }

  // get first(): number {
  //   return (this.pageNumber - 1) * this.pageSize;
  // }

  // set first(value: number) {
  //   this.pageNumber = Math.floor(value / this.pageSize) + 1;
  //   this.fetchItems();
  // }

  // onPageChange(event: any): void {
  //   this.pageNumber = Math.floor(event.first / event.rows) + 1;
  //   this.pageSize = event.rows;
  //   this.fetchItems();
  // }

   openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;
    this.cdr.detectChanges(); // Ensure dialog state is updated

    if (isEdit && index !== undefined) {
      const actualIndex = index - ((this.pageNumber - 1) * this.pageSize);
      
      if (actualIndex >= 0 && actualIndex < this.items.length) {
        this.item = { ...this.items[actualIndex] };
      } else {
        console.error("Invalid index after pagination adjustment:", actualIndex);
        this.resetItem();
      }
    } else {
     
      this.resetItem();
    }
  }

   resetItem(): void {
    this.item = {
      fromDtlHead: '',
      fromSubdtlHead: '',
      toDtlHead: '',
      toSubdtlHead: ''
   };
  }

  saveItem(): void {
    if (this.saving) return;
    this.saving = true;
    this.cdr.markForCheck(); // Mark for change detection

    // Validate required fields
    if (!this.item.fromDtlHead || !this.item.toDtlHead) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
      });
      this.saving = false;
      this.cdr.detectChanges(); // Trigger change detection
      return;
    }

    const request = this.isEditMode
      ? this.commonService.updateAdmissibleReappropriations(this.item,this.item.id)
      : this.commonService.createAdmissibleReappropriations(this.item);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: this.isEditMode 
            ? 'Admissible reappropriation updated successfully!' 
            : 'Admissible reappropriation added successfully!',
        });
        this.displayDialog = false;
        this.fetchItems();
      },
      error: (error) => {
        console.error('Error saving admissible reappropriation:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to save admissible reappropriation. Please try again.',
        });
      },
      complete: () => {
        this.saving = false;
        this.cdr.detectChanges(); // Trigger change detection
      }
    });
   }

  deleteItem(index: number): void {
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize);
    
    if (actualIndex < 0 || actualIndex >= this.items.length) {
      console.error("Invalid index for deletion:", actualIndex);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Invalid selection. Unable to delete.',
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
        this.cdr.detectChanges(); // Trigger change detection
  
        this.commonService.softDeleteAdmissibleReappropriations(itemId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Admissible reappropriation deleted successfully.',
            });
          },
          error: (error) => {
            console.error('Error deleting admissible reappropriation:', error);
            this.items.splice(actualIndex, 0, deletedItem); // Rollback UI change
            this.cdr.detectChanges(); // Trigger change detection
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete admissible reappropriation. Please try again.',
            });
          },
        });
      }
    });
   }

   onSearchChange(): void {
  //   this.fetchItems();
   }

  // // Optional: Load dropdown options from service
  loadDropdownOptions(): void {
    this.commonService.getAllDetailHeads('','',1,1000).subscribe({
      next: (options:any) => {
        this.dtlHeadOptions = options.result.items
            .map((level: any) => ({
              label: level.name,
              value: level.code
            }))
            .sort((a: any, b: any) => a.value - b.value);
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error loading dtl head options:', error);
      }
    });

    this.commonService.getAllSubDetailHeads().subscribe({
      next: (options: any) => {
        console.log("subdetails", options);
    
        this.subdtlHeadOptions = options.map((option: any) => ({
          label: option.name ?? "Unknown", // Handle null names
          value: option.code ? option.code.trim() : "N/A" // Ensure code exists
        }));
    
        console.log(this.subdtlHeadOptions);
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error("Error fetching sub detail heads", error);
      }
    });
    
  }
}