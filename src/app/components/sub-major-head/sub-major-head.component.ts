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
  MajorHeadOptions: any[]=[];
  item:any={};
  filterOptions: any[] = [];
  searchQuery: string = '';
  selectedFilter: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(private commonService: CommonService,private router:Router) {}

  ngOnInit(): void {
    this.fetchSubMajorHeads();
    this. getMajorHeadCodes();
  }
  resetFilters(): void {
    this.router.navigateByUrl("/master/sub-major-head").then(() => {
      window.location.reload();
    });
  }
  
  fetchSubMajorHeads(): void {
    this.loading = true;

    this.commonService.getAllSubMajorHeads(
      this.searchQuery,
        this.selectedFilter,
        this.pageNumber,
        this.pageSize,
        this.selectedMajorHead).subscribe({
      next: (response: any) => {
        // Extract the `result` array from the response
        const data = Array.isArray(response) ? response : response?.data || [];

        // Check if `data` is an array
        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', response);
          this.items = [];
          this.loading = false;
          return;
        }

        // Process the valid array
        this.items = data
          .filter((item: any) => !item.isDeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
          this.totalRecords = response?.result?.totalRecords || this.items.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SubMajorHeads levels. Please try again.',
        });
      },
    });
  }


  getMajorHeadCodes(): void {
    this.commonService.getAllMajorHeads(this.searchQuery,this.selectedFilter).subscribe({
      next: (response:any) => {
        if (response && Array.isArray(response.result?.items))
          this.codes= response.result?.items.filter((head: any) => !head.isDeleted);
         this.MajorHeadOptions = this.codes.map((head: any) => ({
          label: head.code,
          value: head.code,
        }));
      },
      error: (error) => {
        console.error('Error fetching MajorHead Codes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch MajorHead Codes. Please try again.',
        });
      },
    });
  }

  onSearchChange(): void {
    this.fetchSubMajorHeads();
  }
  onFilterChange(): void {
    console.log("Filter Changed:", this.selectedFilter);
    this.fetchSubMajorHeads();
  }
  onCodeChange(): void {
    // console.log("major Code Changed:", this.selectedCode);
    this.fetchSubMajorHeads();
  }
    // getSubMajorHeadByMajorHeadId(code: any): void{
    //   console.log(code);
      
    //     this.loading = true;
    //     this.commonService.getSubMajorHeadByMajorHeadId(code).subscribe({
    //       next: (item:any) => {
    //         console.log(code);
            
    //         this.items = item;
    //         console.log(this.items);
            
    //         this.loading = false;
    //       },
    //       error: (error:any) => {
    //         console.error('Error fetching item:', error);
    //         this.loading = false;
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Error!',
    //           text: 'Failed to fetch item. Please try again.',
    //         });
    //       },
    //     });
    //   }
}
