import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sub-major-head',
  standalone: true,
  imports: [ CommonModule,
      TableModule,
      ButtonModule,
      DialogModule,
      FormsModule,
      HttpClientModule,
      ProgressSpinnerModule,
      DropdownModule,
      TagModule],
  providers: [CommonService],
  templateUrl: './sub-major-head.component.html',
  styleUrl: './sub-major-head.component.scss'
})
export class SubMajorHeadComponent {
items: any[] = [];
  loading: boolean = false;
  selectedMajorHead: string ='';
  codes: any[] = []; //
  MajorHeadIdOptions: any[]=[];
  item:any={};
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchQuery: string ='';
  selectedFilter: string ='';
  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'Code', value: 'code' },
    { label: 'Name', value: 'name' },
    { label: 'MajorHeadId', value: 'majorHeadId' },
  ];

  // "code": "02",
  // "name": "STATE LEGISLATURES",
  // "majorHeadId": 2011,
  constructor(private commonService: CommonService,private router:Router) {}

  ngOnInit(): void {
    this.fetchSubMajorHeads();
    this. getMajorHeadIds();
  }
  resetFilters(): void {
    this.router.navigateByUrl("/master/sub-major-head").then(() => {
      window.location.reload();
    });
  }
  
  fetchSubMajorHeads(): void {
    this.loading = true;
  
    this.commonService.getAllSubMajorHeads(this.searchQuery,this.selectedFilter,this.pageNumber,this.pageSize).subscribe({
      next: (response: any) => {
        // Extract the `result` array from the response
        const data = Array.isArray(response) ? response : response?.result.items|| [];
  
        // Check if `data` is an array
        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", response);
          this.items = [];
          this.loading = false;
          return;
        }
        this.totalItems = response?.result?.totalRecords || 0;
        console.log("totalSufetchSubMajorHeads", this.totalItems);
        this.totalPages = response?.result?.totalPages || 0;
        console.log("totalpages", this.totalPages);
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
   getMajorHeadIds(): void {
      this.commonService.getAllMajorHeads('','',this.pageNumber,this.pageSize).subscribe({
        next: (response:any) => {
  

  
          this.MajorHeadIdOptions = response.result.items.map((code: any) => ({
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
    getSubMajorHeadByMajorHeadId(code: any): void{
      console.log(code);
      
        this.loading = true;
        this.commonService.getSubMajorHeadByMajorHeadId(code).subscribe({
          next: (item:any) => {
            console.log(code);
            
            this.items = item.result;
            console.log(this.items);
            
            this.loading = false;
          },
          error: (error:any) => {
            console.error('Error fetching item:', error);
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to fetch item. Please try again.',
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
        this.fetchSubMajorHeads();
      }
      onPageChange(event: any): void {
        this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
        this.pageSize = event.rows;
        console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
        this.fetchSubMajorHeads();  // Fetch the data for the updated page
      }
      onSearchChange(): void {
        this.fetchSubMajorHeads();
      }
    
      onFilterChange(): void {
        this.fetchSubMajorHeads();
      }
}
