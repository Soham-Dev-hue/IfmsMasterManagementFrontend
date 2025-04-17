import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SaoService } from '../../service/sao.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-sao',
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
    TableModule,
    TagModule,
    InputTextModule
  ],
  providers: [SaoService, CommonService],
  templateUrl: './sao.component.html',
  styleUrls: ['./sao.component.scss'],
})
export class SaoComponent implements OnInit {
  saos: any[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  sao: any = {};
  loading: boolean = false;
  searchQuery: string = '';
  selectedFilter: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  state: boolean = false;
  // Level related properties
  levels: any[] = [];
  selectedLevel: any;
  showActiveOnly: boolean = true;
  showInactiveOnly: boolean = false;
  // For create/edit dialog
  primaryRoleOptions: any[] = [];
  nextLevelCodeOptions: any[] = [];
  activeFilter: string = 'active'; 
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'Code', value: 'code' },
    { label: 'Name', value: 'name' },
    { label: 'Next Level Code', value: 'nextLevelCode' },
  ];

  constructor(
    private saoService: SaoService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchSaos();
    this.getSaoLevels();
  }
 
  fetchSaos(): void {
    this.loading = true;
    const formattedLevel = this.selectedLevel < 10 ? `0${this.selectedLevel}` : `${this.selectedLevel}`;
    this.saoService.getAllany(
      this.searchQuery,
      this.selectedFilter,
      formattedLevel,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (data) => {
        this.totalItems = data.result?.totalRecords || 0;
        this.totalPages = data.result?.totalPages || 0;
        this.saos = (data.result.items || [])
          .filter((sao: any) => !sao.isdeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching SAOs:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SAOs. Please try again.',
        });
      },
    });
  }
// Add this property to track if we're showing inactive


// Add this method to fetch all SAOs without pagination
fetchAllSaos(): void {
  this.loading = true;
  const formattedLevel = this.selectedLevel < 10 ? `0${this.selectedLevel}` : `${this.selectedLevel}`;
  
  // Fetch all records by setting pageSize to a very large number
  this.saoService.getAllany(
    this.searchQuery,
    this.selectedFilter,
    formattedLevel,
    1,  // pageNumber
    10000  // large pageSize to get all records
  ).subscribe({
    next: (data) => {
      this.totalItems = data.result?.totalRecords || 0;
      this.totalPages = data.result?.totalPages || 0;
      
      // Apply inactive filter on frontend
      this.saos = (data.result.items || [])
        .filter((sao: any) => !sao.isdeleted)
        .filter((sao: any) => this.showInactiveOnly ? !sao.isactive : true)
        .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
      console.log(this.saos);
      
      this.loading = false;
    },
    error: (error) => {
      console.error('Error fetching SAOs:', error);
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch SAOs. Please try again.',
      });
    },
  });
}

// Modify toggle method
toggleInactive(): void {
  this.showInactiveOnly = !this.showInactiveOnly;
  if (this.showInactiveOnly) {
    this.fetchAllSaos(); // Fetch all when showing inactive
  } else {
    this.fetchSaos(); // Normal paginated fetch for active/all
  }
}
  get first(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }

  set first(value: number) {
    this.pageNumber = Math.floor(value / this.pageSize) + 1;
    this.fetchSaos();
  }

  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.fetchSaos();
  }
  toggleActiveStatus(): void {
    if (this.activeFilter === 'active') {
      this.activeFilter = 'inactive';
    } else if (this.activeFilter === 'inactive') {
      this.activeFilter = 'all';
    } else {
      this.activeFilter = 'active';
    }
    this.fetchSaos();
  }
  resetFilters(): void {
    this.router.navigateByUrl("/master/sao").then(() => {
      window.location.reload();
    });
  }

  getSaoLevels(): void {
    this.commonService.getAllSAOLevels('', '', 1, 100).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.result?.items)) {
          this.levels = response.result.items.filter((level: any) => !level.isdeleted);
          
          // Prepare primary role options
          this.primaryRoleOptions = this.levels
            .filter(level => level.isactive)
            .map(level => ({
              label: level.name,
              value: level.code
            }))
            .sort((a, b) => b.value - a.value); // Sort descending for hierarchy
        }
      },
      error: (error) => {
        console.error('Error fetching SAO Levels:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SAO Levels. Please try again.',  
        });
      }
    });
  }

  onSearchChange(): void {
    this.fetchSaos();
  }

  onFilterChange(): void {
    this.fetchSaos();
  }

  onLevelChange(event: any): void {
    this.loading = true;
    if (event?.value === 1) {
      this.ngOnInit();
      return;
    }
    
    const selectedCode: number = event?.value;
    const formattedLevel = selectedCode < 10 ? `0${selectedCode}` : `${selectedCode}`;

    this.saoService.getAllany(
      this.searchQuery,
      this.selectedFilter,
      formattedLevel,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (sao: any) => {
        this.saos = sao.result?.items || [];
        this.totalItems = sao.result?.totalRecords || 0;
        this.totalPages = sao.result?.totalPages || 0;
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error fetching SAO:", error);
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch SAO. Please try again.",
        });
      },
    });
  }

  // When primary role is selected in dialog
  onPrimaryRoleSelect(event: any): void {
    const selectedCode = event.value;
    
    // Filter next level codes to only show higher levels (lower numeric values)
    this.nextLevelCodeOptions = this.levels
      .filter(level => level.code < selectedCode && level.isactive)
      .map(level => ({
        label: level.name,
        value: level.code
      }))
      .sort((a, b) => b.value - a.value); // Sort descending for hierarchy
  }

  // Handle SAO code field click
  onSaoCodeClick(): void {
    Swal.fire({
      icon: 'info',
      title: 'SAO Code',
      text: 'SAO Code will be system generated based on your selections.',
      confirmButtonText: 'OK'
    });
  }

  confirmToggleStatus(sao: any) {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to mark this SAO as ${sao.isactive ? 'Inactive' : 'Active'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: sao.isactive ? '#d33' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: sao.isactive ? 'Yes, deactivate it!' : 'Yes, activate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saoService.UpdateSaoStatus(sao).subscribe(
          (response) => {
            sao.isactive = !sao.isactive;
            Swal.fire({
              title: 'Updated!',
              text: `The SAO has been marked as ${sao.isactive ? 'Active' : 'Inactive'}.`,
              icon: 'success',
              timer: 1500
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update SAO status. Please try again.',
              icon: 'error'
            });
            console.error('Error updating SAO status:', error);
          }
        );
      }
    });
  }

  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;

    if (isEdit && index !== undefined) {
      const actualIndex = index - ((this.pageNumber - 1) * this.pageSize);
      const selectedSao = this.saos[actualIndex];
      
      this.sao = {
        id: selectedSao.id,
        code: selectedSao.code,
        name: selectedSao.name,
        primaryRole: selectedSao.primaryRole,
        nextLevelCode: selectedSao.nextLevelCode,
      };
      
      // Set next level options based on current primary role
      if (this.sao.primaryRole) {
        this.onPrimaryRoleSelect({ value: this.sao.primaryRole });
      }
    } else {
      this.sao = {
        code: '',
        name: '',
        primaryRole: null,
        nextLevelCode: null,
      };
      this.nextLevelCodeOptions = [];
    }
  }

  deleteSao(index: number): void {
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize);
    const saoId = this.saos[actualIndex].id;
    const deletedSao = this.saos[actualIndex];

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this SAO!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saos.splice(actualIndex, 1);
        this.saoService.softDeleteSao(saoId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'SAO deleted successfully.',
            });
          },
          error: (error) => {
            console.error('Error deleting SAO:', error);
            this.saos.splice(actualIndex, 0, deletedSao);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete SAO. Please try again.',
            });
          },
        });
      }
    });
  }
  
  saveSao(): void {
    if (!this.validateForm()) return;

    if (this.isEditMode) {
      this.saoService.UpdateSao(this.sao).subscribe({
        next: (updatedSao) => {
          this.handleSuccessResponse('updated');
        },
        error: (error) => {
          this.handleErrorResponse(error);
        }
      });
    } else {
      this.saoService.AddSao(this.sao).subscribe({
        next: (newSao) => {
          this.handleSuccessResponse('created');
        },
        error: (error) => {
          this.handleErrorResponse(error);
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.sao.primaryRole) {
      Swal.fire({
        icon: 'warning',
        title: 'Primary Role Required',
        text: 'Please select a primary role.'
      });
      return false;
    }

    if (!this.sao.name || this.sao.name.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Name Required',
        text: 'Please enter a name.'
      });
      return false;
    }

    if (!this.sao.nextLevelCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Next Level Code Required',
        text: 'Please select a next level code.'
      });
      return false;
    }

    return true;
  }

  private handleSuccessResponse(action: 'created' | 'updated'): void {
    this.displayDialog = false;
    Swal.fire({
      icon: 'success',
      title: action === 'created' ? 'Created!' : 'Updated!',
      text: `SAO ${action} successfully.`,
    });
    this.ngOnInit();
  }

  private handleErrorResponse(error: any): void {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to process SAO. Please try again.',
    });
  }
}