import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-hoa',
  standalone: true,
 imports: [
     TableModule,
     ProgressSpinnerModule,
     CommonModule,
     HttpClientModule,
     FormsModule,
     DropdownModule,
     DialogModule,
     ButtonModule,
     InputTextModule,
     TagModule,
     SkeletonModule
     
   ],
  providers: [CommonService],
  templateUrl: './hoa.component.html',
  styleUrl: './hoa.component.scss'
})
export class HoaComponent {
items: any[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'HOA Text', value: 'hoatext' },
    { label: 'Demand', value: 'demand' },
    { label: 'Major', value: 'major' },
  ];
  selectedFilter:string = '';


  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchHoas();
  }

  fetchHoas(): void {
    this.loading = true;
  
    this.commonService.getAllHOAs(this.searchQuery,this.selectedFilter,this.pageNumber,this.pageSize).subscribe({
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
  get first(): number {
    return (this.pageNumber - 1) * this.pageSize; // Adjusting for 1-based pageNumber
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchHoas();  // Fetch the data for the updated page
  }
  // Setter: Update the pageNumber based on the first index value
  set first(value: number) {
    this.pageNumber = Math.floor(value / this.pageSize) + 1;
    this.fetchHoas();
  }
  onFilterChange(): void {
    this.fetchHoas();
  }
  onSearchChange(): void {
    this.fetchHoas();
  }
}
