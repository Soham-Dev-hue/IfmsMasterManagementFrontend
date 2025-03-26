import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DdoService } from '../../service/ddo.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CommonService } from '../../service/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ddo',
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
    TagModule
  ],
  providers: [DdoService, CommonService],
  templateUrl: './ddo.component.html',
  styleUrls: ['./ddo.component.scss'],
})
export class DdoComponent implements OnInit {
  ddoList: any[] = []; // List of DDOs
  displayDialog: boolean = false; // Controls dialog visibility
  isEditMode: boolean = false; // Tracks if dialog is in edit mode
  ddo: any = {}; // Current DDO being edited/created
  loading: boolean = false; // Loading state
  searchQuery: string = '';
  selectedFilter: string = '';
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'TreasuryCode', value: 'treasurycode' },
    { label: 'Designation', value: 'designation' },
    { label: 'DDO-CODE', value: 'ddoCode' },
    { label: 'Address', value: 'address' },
  ];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  selectedCode: string = '';
  TreasuryCodeOptions: any[] = [];

  constructor(private ddoService: DdoService, private commonService: CommonService,private router:Router) {}

  ngOnInit(): void {
    this.fetchDDOs();
    this.getTreasuryCodes();
  }

  // Fetch DDOs from the backend
  fetchDDOs(): void {
    this.loading = true;
    this.ddoService.getAllDDOs(this.searchQuery, this.selectedFilter, this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        this.totalItems = response?.result?.totalRecords || 0;
        this.totalPages = response?.result?.totalPages || 0;
        this.ddoList = response.result.items
          .filter((ddo: any) => !ddo.isDeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching DDOs:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch DDOs. Please try again.',
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
    this.fetchDDOs();
  }

  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    this.fetchDDOs();  // Fetch the data for the updated page
  }
  resetFilters(): void {
    this.router.navigateByUrl("/master/ddo").then(() => {
      window.location.reload();
    });
  }
  getTreasuryCodes(): void {
    this.commonService.getAllTreasuries().subscribe({
      next: (codes) => {
        console.log(codes);
        
        this.TreasuryCodeOptions = codes.map((code: any) => ({
          label: code.code,
          value: code.code
        }));
      },
      error: (error) => {
        console.error('Error fetching Treasury Codes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch Treasury Codes. Please try again.',
        });
      }
    });
  }

  getDdoByTreasuryCode(code: any): void {
    this.loading = true;
    this.ddoService.getDDOByTreasuryCode(code).subscribe({
      next: (ddo) => {
        this.ddoList = ddo.result;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching DDO:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch DDO. Please try again.',
        });
      },
    });
  }

  onSearchChange(): void {
    this.fetchDDOs();
  }

  onFilterChange(): void {
    this.fetchDDOs();
  }

  // Open dialog for create/edit
  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;

    if (isEdit && index !== undefined) {
      const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust for pagination
      if (actualIndex >= 0 && actualIndex < this.ddoList.length) {
        const selectedDDO = this.ddoList[actualIndex];
        this.ddo = { ...selectedDDO };
      } else {
        console.error("Invalid actual index:", actualIndex);
      }
    } else {
      // Reset form for new entry
      this.ddo = {
        id: null,
        code: '',
        name: '',
        nextLevelCode: '',
      };
    }
  }

  // Delete a DDO
  deleteDDO(index: number): void {
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize); // Adjust index with pagination
    const ddoId = this.ddoList[actualIndex].id;
    const deletedDDO = this.ddoList[actualIndex]; // Store for rollback

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
        this.ddoList.splice(actualIndex, 1); // Optimistically update UI

        this.ddoService.SoftDeleteDDO(ddoId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'DDO deleted successfully.',
            });
          },
          error: (error) => {
            console.error('Error deleting DDO:', error);
            this.ddoList.splice(actualIndex, 0, deletedDDO); // Rollback UI change
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete DDO. Please try again.',
            });
          },
        });
      }
    });
  }

    confirmToggleStatus(ddo: any) {
      Swal.fire({
        title: `Are you sure?`,
        text: `You are about to mark this ddo as ${ddo.isActive ? 'Inactive' : 'Active'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ddo.isActive ? '#d33' : '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: ddo.isActive ? 'Yes, deactivate it!' : 'Yes, activate it!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Call the service to update status in the backend
          this.ddoService.UpdateDdoStatus(ddo,ddo.id).subscribe(
            (response) => {
              // Update the local object with the response from backend
              // or toggle the status if backend doesn't return updated object
              ddo.isActive = !ddo.isActive;
              
              // Show success message
              Swal.fire({
                title: 'Updated!',
                text: `The ddo has been marked as ${ddo.isActive ? 'Active' : 'Inactive'}.`,
                icon: 'success',
                timer: 1500
              });
            },
            (error) => {
              // Handle error
              Swal.fire({
                title: 'Error!',
                text: 'Failed to update ddo status. Please try again.',
                icon: 'error'
              });
              console.error('Error updating ddo status:', error);
            }
          );
        }
      });
    }

  // Save DDO (create or update)
  saveDDO(): void {
    if (this.isEditMode) {
      console.log(this.ddo);
      
      this.ddoService.UpdateDdo(this.ddo,this.ddo.id).subscribe({
        next: (updatedddo) => {
          const index = this.ddoList.findIndex((s) => s.id === updatedddo.id);
          if (index !== -1) {
            this.ddoList[index] = updatedddo;
          }
          this.displayDialog = false;
          this.ddo = {};
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'DDO updated successfully.',
          });
          this.fetchDDOs(); // Refresh the list
        },
        error: (error: any) => {
          console.error('Error updating DDO:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to update DDO. Please try again.',
          });
        },
      });
    } else {
      this.ddoService.createDDO(this.ddo).subscribe({
        next: (newddo) => {
          this.displayDialog = false;
          this.ddo = {};
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'DDO created successfully.',
          });
          this.fetchDDOs(); // Refresh the list
        },
        error: (error) => {
          console.error('Error creating DDO:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to create DDO. Please try again.',
          });
        },
      });
    }
  }
}