import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scheme-head',
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
  templateUrl: './scheme-head.component.html',
  styleUrl: './scheme-head.component.scss',
})
export class SchemeHeadComponent implements OnInit {
  items: any[] = []; // Data to display in the table
  loading: boolean = false;
  DemandCodeOptions: any[] = [];
  selectedDemandCode: any;
  MajorHeadOptions: any[] = [];
  selectedMajorHeadId: any;
  subMajorHeadOptions: any[] = [];
  selectedSubMajorHeadId: any;
  minorHeadOptions: any[] = [];
  selectedMinorHeadCode: any;
  schemeHeadOptions: any[] = [];
  selectedSchemeHeadCode: any;
  originalItems: any[] = []; // Store the original data for resetting
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  selectedFilter: string ='';
  searchQuery: string ='';


  constructor(private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSchemeHeads();
    this.getDemandCodes();
  }

  fetchSchemeHeads(): void {
    this.loading = true;
    this.commonService.getAllSchemeHeads().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : response?.data || [];
        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', response);
          this.items = [];
          this.loading = false;
          return;
        }


        this.totalItems = response?.result?.totalRecords || 0;
        console.log("totalItems", this.totalItems);
        this.totalPages = response?.result?.totalPages || 0;
        console.log("totalpages", this.totalPages);




        this.items = data
          .filter((item: any) => !item.isDeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        this.originalItems = [...this.items]; // Store the original data
        this.loading = false;
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SAO levels. Please try again.',
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
    this.fetchSchemeHeads();
  }
  getDemandCodes(): void {
    this.commonService.getAllDepartments('', '', 0, 100).subscribe({
      next: (departments) => {
        this.DemandCodeOptions = departments.result.items.map((data: any) => ({
          label: data.demandCode,
          value: data.demandCode,
        }));
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch data Heads.' });
      },
    });
  }
  onPageChange(event: any): void {
    this.pageNumber = Math.floor(event.first / event.rows) + 1;  // Correct the pageNumber to be 1-based
    this.pageSize = event.rows;
    console.log(`Updated pageNumber: ${this.pageNumber}, pageSize: ${this.pageSize}`);
    this.fetchSchemeHeads();  // Fetch the data for the updated page
  }
  OnChangeDemandCode(): void {
    if (this.selectedDemandCode) {
      this.loading = true;
      console.log(this.selectedDemandCode);
      
      this.commonService.getMajorHeadByDemandCode(this.selectedDemandCode).subscribe({
        next: (MajorHeads) => {
          console.log(MajorHeads);
          this.items = MajorHeads; // Update items with MajorHeads
          this.MajorHeadOptions = MajorHeads.map((m: any) => ({
            label: m.code,
            value: m.id,
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Major Heads.' });
        },
      });
    } else {
      this.items = [...this.originalItems]; // Reset to original data
      this.MajorHeadOptions = [];
    }
    this.selectedMajorHeadId = null;
    this.subMajorHeadOptions = [];
    this.selectedSubMajorHeadId = null;
    this.minorHeadOptions = [];
    this.selectedMinorHeadCode = null;
    this.schemeHeadOptions = [];
    this.selectedSchemeHeadCode = null;
  }

  getSubMajorHeadByMajorHeadId(): void {
    if (this.selectedMajorHeadId) {
      this.loading = true;
      this.commonService.getSubMajorHeadByMajorHeadId(this.selectedMajorHeadId).subscribe({
        next: (SubMajorHeads) => {
          console.log(SubMajorHeads);
          this.items = SubMajorHeads.result; // Update items with SubMajorHeads
          this.subMajorHeadOptions = SubMajorHeads.result.map((sm: any) => ({
            label: sm.code,
            value: sm.id,
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Sub-Major Heads.' });
        },
      });
    } else {
      this.items = []; // Clear items if no SubMajorHead is selected
      this.subMajorHeadOptions = [];
    }
    this.selectedSubMajorHeadId = null;
    this.minorHeadOptions = [];
    this.selectedMinorHeadCode = null;
    this.schemeHeadOptions = [];
    this.selectedSchemeHeadCode = null;
  }

  getMinorHeadBySubMajorHeadId(): void {
    if (this.selectedSubMajorHeadId) {
      this.loading = true;
      this.commonService.getMinorHeadBySubMajorId(this.selectedSubMajorHeadId).subscribe({
        next: (MinorHeads) => {
          console.log(MinorHeads);
          this.items = MinorHeads.result; // Update items with MinorHeads
          this.minorHeadOptions = MinorHeads.result.map((mh: any) => ({
            label: mh.code,
            value: mh.id,
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Minor Heads.' });
        },
      });
    } else {
      this.items = []; // Clear items if no MinorHead is selected
      this.minorHeadOptions = [];
    }
    this.selectedMinorHeadCode = null;
    this.schemeHeadOptions = [];
    this.selectedSchemeHeadCode = null;
  }

  onMinorHeadCodeChange(): void {
    if (this.selectedMinorHeadCode) {
      this.loading = true;
      this.commonService.getSchemeHeadByMinorHeadId(this.selectedMinorHeadCode).subscribe({
        next: (SchemeHeads) => {
          console.log(SchemeHeads);
          
          this.items = SchemeHeads; // Update items with SchemeHeads
          this.schemeHeadOptions = SchemeHeads.map((sh: any) => ({
            label: sh.code,
            value: sh.id,
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Scheme Heads.' });
        },
      });
    } else {
      this.items = []; // Clear items if no SchemeHead is selected
      this.schemeHeadOptions = [];
    }
    this.selectedSchemeHeadCode = null;
  }

  onSchemeHeadCodeChange(): void {
    if (this.selectedSchemeHeadCode) {
      this.items = this.items.filter((item) => item.id === this.selectedSchemeHeadCode); // Filter items
    } else {
      this.items = [...this.originalItems]; // Reset to original data
    }
  }

  resetFilters(): void {
    this.selectedDemandCode = null;
    this.selectedMajorHeadId = null;
    this.selectedSubMajorHeadId = null;
    this.selectedMinorHeadCode = null;
    this.selectedSchemeHeadCode = null;
    this.items = [...this.originalItems]; // Reset to original data
  }
}