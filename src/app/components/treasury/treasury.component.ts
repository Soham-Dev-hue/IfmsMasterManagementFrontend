import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonService } from '../../service/common.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-treasury',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule,
    TagModule
  ],
  providers: [CommonService],
  templateUrl: './treasury.component.html',
  styleUrl: './treasury.component.scss',
})
export class TreasuryComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  selectedFilter: string = '';
  isEditMode: boolean = false;
  item: any = {};
  displayDialog: boolean = false;
  saving: boolean = false; // To prevent multiple clicks
TreasuryCodeOptions:any[]=[];
  filterOptions = [
    { label: 'All', value: '' },
    { label: 'Code', value: 'code' },
    { label: 'Officer Name', value: 'officerName' },
    { label: 'District Code', value: 'districtCode' },
    { label: 'Treasury Name', value: 'treasuryName' }
  ];
codes:any[]=[];
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchItems();
 
  }

  fetchItems(): void {
    this.loading = true;
    
    this.commonService.getAllTreasuries(this.searchQuery, this.selectedFilter).subscribe({
      next: (data) => {
        this.items = (data || [])
          .filter((item: any) => !item.isdeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching treasury data:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch data. Please try again later.',
        });
      }
    });
  }

  onSearchChange(): void {
    this.fetchItems();
  }

  onFilterChange(): void {
    this.fetchItems();
  }

  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;

    if (isEdit && index !== undefined && this.items[index]) {
      this.item = { ...this.items[index] };
    } else {
      this.item = {
        code: '',
        treasuryName: '',
        officerName: '',
        address: '',
        districtCode: ''
      };
    }
  }
//  getTreasuryCodes(): void {
//     this.commonService.getAllTreasuries().subscribe({
//       next: (codes) => {

// console.log(this.codes);

//         this.TreasuryCodeOptions = codes.map((code: any) => ({
//           label: code.code, 
//           value: code.code
//         }));
//       },
//       error: (error) => {
//         console.error('Error fetching Treasury Codes:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error!',
//           text: 'Failed to fetch Treasury Codes. Please try again.',
//         });
//       }
//     });
//   }
  savetreasury(): void {
    if (this.saving) return; // Prevent duplicate clicks
    this.saving = true;

    const request = this.isEditMode
      ? this.commonService.UpdateTreasury( this.item)
      : this.commonService.createTreasury(this.item);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: this.isEditMode ? 'Treasury updated successfully!' : 'Treasury added successfully!',
        });
        this.displayDialog = false;
        this.fetchItems();
      },
      error: (error) => {
        console.error('Error saving treasury:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to save treasury. Please try again.',
        });
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
   deleteTreasury(index: number): void {
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
    
          this.commonService.SoftDeleteTreasury(itemId).subscribe({
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
   confirmToggleStatus(treasury: any) {
     Swal.fire({
       title: `Are you sure?`,
       text: `You are about to mark this treasury as ${treasury.isactive ? 'Inactive' : 'Active'}.`,
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: treasury.isactive ? '#d33' : '#28a745',
       cancelButtonColor: '#6c757d',
       confirmButtonText: treasury.isactive ? 'Yes, deactivate it!' : 'Yes, activate it!',
     }).then((result) => {
       if (result.isConfirmed) {
         // Call the service to update status in the backend
         this.commonService.UpdateTreasuryStatus(treasury).subscribe(
           (response) => {
             // Update the local object with the response from backend
             // or toggle the status if backend doesn't return updated object
             treasury.isactive = !treasury.isactive;
             
             // Show success message
             Swal.fire({
               title: 'Updated!',
               text: `The treasury has been marked as ${treasury.isactive ? 'Active' : 'Inactive'}.`,
               icon: 'success',
               timer: 1500
             });
           },
           (error) => {
             // Handle error
             Swal.fire({
               title: 'Error!',
               text: 'Failed to update treasury status. Please try again.',
               icon: 'error'
             });
             console.error('Error updating treasury status:', error);
           }
         );
       }
     });
   }
}
