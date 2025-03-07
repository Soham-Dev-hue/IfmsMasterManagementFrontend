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
  providers: [DdoService,CommonService],
  templateUrl: './ddo.component.html',
  styleUrls: ['./ddo.component.scss'],
})
export class DdoComponent implements OnInit {
  ddoList: any[] = []; // List of DDOs
  displayDialog: boolean = false; // Controls dialog visibility
  isEditMode: boolean = false; // Tracks if dialog is in edit mode
  ddo: any = {}; // Current DDO being edited/created
  ddos:any[] = []; //
  loading: boolean = false; // Loading state
  searchQuery: string = '';
  selectedFilter: string = '';
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'TreasuryCode', value: 'treasurycode' },
    { label: 'Designation', value: 'designation' },
  ];
  selectedCode: string ='';
  codes: any[] = []; //
  TreasuryCodeOptions: any[]=[];

  constructor(private ddoService: DdoService, private commonService: CommonService) {}


  ngOnInit(): void {
    this.fetchDDOs();
    this.getTreasuryCodes();
  }

  // Fetch DDOs from the backend
  fetchDDOs(): void {
    this.loading = true;
    this.ddoService.getAllDDOs(this.searchQuery,this.selectedFilter).subscribe({
      next: (data) => {
        this.ddoList = data
        .filter((ddo: any) => !ddo.isdeleted)
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
  getTreasuryCodes(): void {
    this.commonService.getAllTreasuries().subscribe({
      next: (codes) => {

console.log(this.codes);

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
  getDdoByTreasuryCode(code: any): void{
    this.loading = true;
    this.ddoService.getDDOByTreasuryCode(code).subscribe({
      next: (ddo) => {
        console.log(code);
        
        this.ddoList = ddo;
        console.log(this.ddoList);
        
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
      const selectedddo = this.ddoList[index];
      this.ddo = {
        id: selectedddo.id,
        code: selectedddo.code,
        name: selectedddo.name,
        nextLevelCode: selectedddo.nextLevelCode,
      };
    } else {
      this.ddo = {
        code: '',
        name: '',
        nextLevelCode: '',
      };
    }
  }

  // Delete a DDO
  deleteDDO(index: number): void {
    const ddoId = this.ddoList[index].id;
    const deletedDDO = this.ddoList[index]; // Store for rollback
  
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
        this.ddoList.splice(index, 1); // Optimistically update UI
  
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
            this.ddoList.splice(index, 0, deletedDDO); // Rollback UI change
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
    text: `You are about to mark this ddo as ${ddo.isactive ? 'Inactive' : 'Active'}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: ddo.isactive ? '#d33' : '#28a745',
    cancelButtonColor: '#6c757d',
    confirmButtonText: ddo.isactive ? 'Yes, deactivate it!' : 'Yes, activate it!',
  }).then((result) => {
    if (result.isConfirmed) {
      // Toggle status
      ddo.isactive = !ddo.isactive;

      // Show success message
      Swal.fire({
        title: 'Updated!',
        text: `The ddo has been marked as ${ddo.isactive ? 'Active' : 'Inactive'}.`,
        icon: 'success',
        timer: 1500
      });
    }
  });
}
  // Save DDO (create or update)
 saveDDO(): void {
     if (this.isEditMode) {
       this.ddoService.UpdateDdo(this.ddo).subscribe({
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
             text: 'ddo updated successfully.',
           });
           this.ngOnInit();
         },
         error: (error:any) => {
           console.error('Error updating ddo:', error);
           Swal.fire({
             icon: 'error',
             title: 'Error!',
             text: 'Failed to update ddo. Please try again.',
           });
         },
       });
     } else {
       this.ddoService.createDDO(this.ddo).subscribe({
         next: (newddo) => {
           this.ddos.push(newddo);
           this.displayDialog = false;
           this.ddo = {};
           Swal.fire({
             icon: 'success',
             title: 'Created!',
             text: 'ddo created successfully.',
           });
           this.ngOnInit();
         },
         error: (error) => {
           console.error('Error creating ddo:', error);
           Swal.fire({
             icon: 'error',
             title: 'Error!',
             text: 'Failed to create ddo. Please try again.',
           });
         },
       });
     }
   }
}