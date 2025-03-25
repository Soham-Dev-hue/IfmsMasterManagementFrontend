import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AutoCompleteModule } from 'primeng/autocomplete';
// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';

// Services
import { SaoService } from '../../service/sao.service';
import { CommonService } from '../../service/common.service';

// Sweet Alert
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-hierarchy-mapping',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AutoCompleteModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    TagModule,
    ProgressSpinnerModule,
    CheckboxModule
  ],
  providers: [SaoService, CommonService],
  templateUrl: './role-hierarchy-mapping.component.html',
  styleUrls: ['./role-hierarchy-mapping.component.scss']
})
export class RoleHierarchyMappingComponent implements OnInit {
  // Table related properties
  roleHierarchies: any[] = [];
  loading: boolean = false;
  
  // Search and Filter properties
  searchQuery: string = '';
  selectedFilter: string = '';
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'Code', value: 'code' },
    { label: 'Name', value: 'name' },
    { label: 'Next Level Code', value: 'nextLevelCode' },
    { label: 'Own DDO', value: 'ownDdo' }
  ];
hasSearched: boolean = false;
  // Level Filter properties
  levels: any[] = [];
  levelOptions: any[] = [];
  selectedLevel: any;

  // Pagination properties
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  filteredSuggestions: string[] = [];
  // Dialog properties
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  roleHierarchy: any = {};
  
  // Dropdown options
  saoCodes: any[] = [];
  availableNextLevelCodes: any[] = [];
  
  // Untagged state
  isUntagged: boolean = false;

  constructor(
    private saoService: SaoService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSaoLevels();
    this.getSaoCodes();
  }

  // Fetch SAO Levels for dropdown
  getSaoLevels(): void {
    this.commonService.getAllSAOLevels('', '', 1, 100).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.result?.items)) {
          this.levels = response.result?.items.filter((level: any) => !level.isdeleted);
          this.levelOptions = this.levels.map((level: any) => ({
            label: level.name === 'Department' ? 'ALL' : level.name,
            value: level.code
          }));
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
  search(event: any) {
    const query = event.query.trim(); // Trim unnecessary spaces

    if (!query) {
        this.hasSearched = false;
        this.roleHierarchies = []; // Clear suggestions if query is empty
        return;
    }

    this.saoService.getAllany(query, this.selectedFilter || '', '', 1, 1000).subscribe({
        next: (data: any) => {
            if (data?.result?.items?.length) {
                this.roleHierarchies = data.result.items
                    .map((item: { name: string; code: string; nextLevelCode: string; ownDdo: string }) => {
                        switch (this.selectedFilter) {
                            case 'code':
                                return item.code?.trim();
                            case 'nextLevelCode':
                                return item.nextLevelCode?.trim();
                            case 'ownDdo':
                                return item.ownDdo?.trim();
                            default:
                                return item.name?.trim();
                        }
                    })
                    .filter((value: string | any[]) => value && value.length > 0); // Remove empty values
            } else {
                this.roleHierarchies = []; // No results found
            }
        },
        error: (err) => {
            console.error("Error fetching search results:", err);
            this.roleHierarchies = []; // Ensure suggestions don't persist on failure
        }
    });
}





// Mock API Call (Replace with actual HTTP request)


  searchSuggestions(event: any): void {
    const query = event.query;
    if (!query) {
      this.hasSearched=false
      this.filteredSuggestions = [];
      return;
    }

    this.saoService.getAllany(query,'','',this.pageNumber,this.pageSize).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.items)) {
          this.filteredSuggestions = response.items.map((item: any) => item.name);
        } else {
          this.filteredSuggestions = [];
        }
      },
      error: (error) => {
        console.error('Error fetching search suggestions:', error);
      }
    });
  }

  /**
   * Handle selection from autocomplete
   */
  onSearchSelect(event: any): void {
    console.log('Selected search:', event);
    this.searchQuery = event;
  }

  /**
   * Handle clearing of search input
   */
  onSearchClear(): void {
    this.searchQuery = '';
    this.filteredSuggestions = [];
  }

  /**
   * Handle blur event on search input
   */
  onSearchBlur(): void {
    console.log('Search input lost focus');
  }
  // Fetch SAO Codes for dropdowns
  getSaoCodes(): void {
    this.commonService.getAllSAOLevels('', '', 1, 100).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.result?.items)) {
          // Filter active and non-deleted SAO levels
          this.saoCodes = response.result.items
            .filter((level: any) => !level.isdeleted && level.isactive)
            .map((level: any) => ({
              label: level.name,
              value: level.code
            }))
            .sort((a: any, b: any) => a.value - b.value); // Optional: sort by code
        }
      },
      error: (error) => {
        console.error('Error fetching SAO Codes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SAO Levels. Please try again.',
        });
      }
    });
  }

  // On Primary Role Selection
  onPrimaryRoleSelect(event: any): void {
    const selectedCode = event.value;
    // Filter next level codes to be less than selected primary role code
    this.availableNextLevelCodes = this.saoCodes.filter(
      code => code.value < selectedCode
    );
  }
  deleteRoleHierarchy(index: number): void {
    const actualIndex = index - ((this.pageNumber - 1) * this.pageSize);
    const roleHierarchyId = this.roleHierarchies[actualIndex].id;
    const deletedRoleHierarchy = this.roleHierarchies[actualIndex];

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Role Hierarchy!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Optimistically remove from UI
        this.roleHierarchies.splice(actualIndex, 1);

        // Call service method to soft delete
        this.saoService.softDeleteSao(roleHierarchyId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Role Hierarchy deleted successfully.',
            });
          },
          error: (error) => {
            console.error('Error deleting Role Hierarchy:', error);
            // Rollback UI change if deletion fails
            this.roleHierarchies.splice(actualIndex, 0, deletedRoleHierarchy);
            
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete Role Hierarchy. Please try again.',
            });
          }
        });
      }
    });
  }
  // Open Create/Edit Dialog
  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;
    this.isUntagged = false;

    if (isEdit && index !== undefined) {

      const selectedRoleHierarchy = this.roleHierarchies[index];
  
      this.roleHierarchy = { ...selectedRoleHierarchy };
    } else {
      // Reset form for new entry
      this.roleHierarchy = {
        primaryRole: null,
        name: '',
        nextLevelCode: null,
        ownDdo: '',
        treasuryCode: ''
      };
    }
  }

  // Toggle Untagged State
  toggleUntagged(): void {
    this.isUntagged = !this.isUntagged;
    if (!this.isUntagged) {
      // Reset DDO and Treasury codes if not untagged
      this.roleHierarchy.ownDdo = '';
      this.roleHierarchy.treasuryCode = '';
    }
  }

  // Save Role Hierarchy
  saveRoleHierarchy(): void {
    // Validation
    if (!this.validateForm()) return;

    if (this.isEditMode) {
      // Update existing role hierarchy
      this.saoService.UpdateSao(this.roleHierarchy).subscribe({
        next: (updatedRoleHierarchy) => {
          this.handleSuccessResponse('updated');
        },
        error: this.handleErrorResponse
      });
    } else {
      // Add new role hierarchy
      this.saoService.AddSao(this.roleHierarchy).subscribe({
        next: (newRoleHierarchy) => {
          this.handleSuccessResponse('created');
        },
        error: this.handleErrorResponse
      });
    }
  }

  // Form Validation
  validateForm(): boolean {
    const { primaryRole, name, nextLevelCode } = this.roleHierarchy;
    
    if (!primaryRole) {
      Swal.fire({
        icon: 'warning',
        title: 'Primary Role Required',
        text: 'Please select a primary role.'
      });
      return false;
    }

    if (!name || name.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Name Required',
        text: 'Please enter a name.'
      });
      return false;
    }

    if (!nextLevelCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Next Level Code Required',
        text: 'Please select a next level code.'
      });
      return false;
    }

    // Additional untagged validation
    if (this.isUntagged) {
      if (!this.roleHierarchy.ownDdo || !this.roleHierarchy.treasuryCode) {
        Swal.fire({
          icon: 'warning',
          title: 'Untagged Fields Required',
          text: 'Please fill in Own DDO and Treasury Code.'
        });
        return false;
      }
    }

    return true;
  }

  // Success Response Handler
  private handleSuccessResponse(action: 'created' | 'updated'): void {
    this.displayDialog = false;
    Swal.fire({
      icon: 'success',
      title: action === 'created' ? 'Created!' : 'Updated!',
      text: `Role Hierarchy ${action} successfully.`
    });
    this.ngOnInit(); // Refresh data
  }

  // Error Response Handler
  private handleErrorResponse = (error: any) => {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to process Role Hierarchy. Please try again.'
    });
  }

  // Fetching Role Hierarchies based on search and filters
 // Add this method to handle search button click

// Modify the fetchRoleHierarchies method to handle empty state
onSearchClick(): void {
  this.hasSearched=true;
  if (!this.searchQuery && !this.selectedLevel) {
    Swal.fire({
      icon: 'warning',
      title: 'Search Criteria Required',
      text: 'Please enter a search query or select a level to filter by.'
    });
    return;
  }
  
  this.pageNumber = 1; // Reset to first page on new search
  this.fetchRoleHierarchies();
}

// Modify the fetchRoleHierarchies method to handle empty state
fetchRoleHierarchies(): void {
  this.loading = true;
  console.log("Selected Level:", this.selectedLevel);

  // Ensure selectedLevel is formatted correctly (prepend "0" if necessary)
  const formattedLevel = this.selectedLevel < 10 ? `0${this.selectedLevel}` : `${this.selectedLevel}`;

  console.log("Formatted Level:", formattedLevel);
  console.log(typeof formattedLevel);

  this.saoService.getAllany(
    this.searchQuery,
    this.selectedFilter,
    formattedLevel, // Use formattedLevel here
    this.pageNumber,
    this.pageSize
  ).subscribe({
    next: (data) => {
      this.roleHierarchies = data.result?.items || [];
      this.totalItems = data.result?.totalRecords || 0;
      this.totalPages = data.result?.totalPages || 0;
      this.loading = false;
      console.log("Role Hierarchies Data:", data); // Log the received data
      console.log("Role Hierarchies:", this.roleHierarchies);
      console.log("Total Items:", this.totalItems);
      console.log("Total Pages:", this.totalPages);
    },
    error: (error) => {
      console.error('Error fetching Role Hierarchies:', error);
      this.roleHierarchies = [];
      this.totalItems = 0;
      this.totalPages = 0;
      this.loading = false;
      console.log("Role Hierarchies:", this.roleHierarchies);
      console.log("Total Items:", this.totalItems);
      console.log("Total Pages:", this.totalPages);
    }
  });
}

  // Search and Filter Methods
  onSearchChange(): void {
    this.fetchRoleHierarchies();
  }

  onFilterChange(): void {
    this.fetchRoleHierarchies();
  }

  onLevelChange(event: any): void {
    this.fetchRoleHierarchies();
  }

  // Pagination
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.fetchRoleHierarchies();
  }

  // Reset Filters
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedFilter = '';
    this.selectedLevel = null;
    this.fetchRoleHierarchies();
    this.hasSearched=false;
  }
}