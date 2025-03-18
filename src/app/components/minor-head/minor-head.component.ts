import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minor-head',
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
  templateUrl: './minor-head.component.html',
  styleUrl: './minor-head.component.scss'
})
export class MinorHeadComponent {
  items: any[] = []; // Stores all minor heads
  loading: boolean = false; // Loading state
  selectedMajorHead: any; // Selected major head
  selectedSubMajorHeadId: any; // Selected sub-major head
  selectedMinorHeadCode: any; // Selected minor head code
  majorHeadOptions: any[] = []; // Dropdown options for major heads
  subMajorHeadOptions: any[] = []; // Dropdown options for sub-major heads
  minorHeadOptions: any[] = []; // Dropdown options for minor head codes
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  selectedFilter: string ='';
  searchQuery: string ='';
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'Code', value: 'code' },
    { label: 'Name', value: 'name' },
  ];
  constructor(private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {
    console.log("Component reloaded successfully");
    this.fetchMinorHeads(); // Fetch all minor heads on init
    this.getMajorHeadIds(); // Fetch major heads for dropdown
  }

  // Fetch all minor heads
  fetchMinorHeads(): void {
    this.loading = true;
    this.commonService.getAllMinorHeads('','',this.pageNumber,this.pageSize).subscribe({
      next: (data:any) => {


        this.totalItems = data?.result?.totalRecords || 0;
        console.log("totalItems", this.totalItems);
        this.totalPages = data?.result?.totalPages || 0;
        console.log("totalpages", this.totalPages);



        this.items = data.result.items.filter((item: any) => !item.isdeleted); // Filter out deleted items
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch minor heads.' });
      }
    });
  }
  get first(): number {
    return (this.pageNumber - 1) * this.pageSize; // Adjusting for 1-based pageNumber
  }

  // Setter: Update the pageNumber based on the first index value
  set first(value: number) {
    this.pageNumber = Math.floor(value / this.pageSize) + 1;
    this.fetchMinorHeads();
  }
  // Reset filters and reload the page
  resetFilters(): void {
    this.router.navigateByUrl("/master/minor-head").then(() => {
      window.location.reload();
    });
  }

  // Fetch major heads for dropdown
  getMajorHeadIds(): void {
    this.commonService.getAllMajorHeads('','',1,100).subscribe({
      next: (majorHeads:any) => {
        this.majorHeadOptions = majorHeads.result.items.map((major: any) => ({
          label: major.code,
          value: major.code // Use major head ID as value
        }));
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Major Heads.' });
      }
    });
  }

  // When a major head is selected, fetch corresponding sub-major heads
  onMajorHeadChange(): void {
    if (this.selectedMajorHead) {
      this.loading = true;
      this.commonService.getSubMajorHeadByMajorHeadId(this.selectedMajorHead).subscribe({
        next: (subMajorHeads) => {
          console.log('API Response:', subMajorHeads);
  console.log(subMajorHeads.result);
  this.items = subMajorHeads.result;
          if (subMajorHeads?.result?.length) {
            this.subMajorHeadOptions = subMajorHeads.result.map((sm: any) => ({
              label: sm.code || "N/A",  // Fallback for missing code
              value: sm.id || null       // Ensure valid ID assignment
            }));
          } else {
            this.subMajorHeadOptions = [];
          }
  
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching Sub-Major Heads:', err);
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Sub-Major Heads.' });
        }
      });
    } else {
      this.subMajorHeadOptions = []; // Reset sub-major head options if no major head is selected
    }
  
    // Reset related selections
    this.selectedSubMajorHeadId = null;
    this.minorHeadOptions = [];
    this.selectedMinorHeadCode = null;
  }
  

  // When a sub-major head is selected, fetch corresponding minor heads
  getMinorHeadBySubMajorHeadId(): void {
    if (!this.selectedSubMajorHeadId) return;

    this.loading = true;
    this.commonService.getMinorHeadBySubMajorId(this.selectedSubMajorHeadId).subscribe({
      next: (minorHeads) => {
        this.items = minorHeads.result; // Update the table with filtered minor heads
        this.minorHeadOptions = minorHeads.result.map((minor: any) => ({
          label: minor.code,
          value: minor.code // Use minor head code as value
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Minor Heads.' });
      }
    });
  }

  // When a minor head code is selected, filter the table
  onMinorHeadCodeChange(): void {
    if (this.selectedMinorHeadCode) {
      this.items = this.items.filter((item) => item.code === this.selectedMinorHeadCode);
    } else {
      this.getMinorHeadBySubMajorHeadId(); // Reset to show all minor heads for the selected sub-major head
    }
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchMinorHeads();  // Fetch the data for the updated page
  }
  onFilterChange(): void {
    this.fetchMinorHeads();
  }
  onSearchChange(): void {
    this.fetchMinorHeads();
  }
}