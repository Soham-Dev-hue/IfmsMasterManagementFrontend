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

  constructor(private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {
    console.log("Component reloaded successfully");
    this.fetchMinorHeads(); // Fetch all minor heads on init
    // this.getMajorHeadIds(); // Fetch major heads for dropdown
  }

  // Fetch all minor heads
  fetchMinorHeads(): void {
    this.loading = true;
    this.commonService.getAllMinorHeads().subscribe({
      next: (data) => {
        this.items = data.filter((item: any) => !item.isDeleted); // Filter out deleted items
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch minor heads.' });
      }
    });
  }

  // Reset filters and reload the page
  resetFilters(): void {
    this.router.navigateByUrl("/master/minor-head").then(() => {
      window.location.reload();
    });
  }

  // Fetch major heads for dropdown
  // getMajorHeadIds(): void {
  //   this.commonService.getAllMajorHeads().subscribe({
  //     next: (majorHeads) => {
  //       this.majorHeadOptions = majorHeads.map((major: any) => ({
  //         label: major.code,
  //         value: major.id // Use major head ID as value
  //       }));
  //     },
  //     error: () => {
  //       Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Major Heads.' });
  //     }
  //   });
  // }

  // When a major head is selected, fetch corresponding sub-major heads
  onMajorHeadChange(): void {
    if (this.selectedMajorHead) {
      this.loading = true;
      this.commonService.getSubMajorHeadByMajorHeadId(this.selectedMajorHead).subscribe({
        next: (subMajorHeads) => {
          this.subMajorHeadOptions = subMajorHeads.map((sm: any) => ({
            label: sm.code,
            value: sm.id // Use sub-major head ID as value
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Sub-Major Heads.' });
        }
      });
    } else {
      this.subMajorHeadOptions = []; // Reset sub-major head options if no major head is selected
    }
    this.selectedSubMajorHeadId = null; // Reset sub-major head selection
    this.minorHeadOptions = []; // Reset minor head options
    this.selectedMinorHeadCode = null; // Reset minor head selection
  }

  // When a sub-major head is selected, fetch corresponding minor heads
  getMinorHeadBySubMajorHeadId(): void {
    if (!this.selectedSubMajorHeadId) return;

    this.loading = true;
    this.commonService.getMinorHeadBySubMajorId(this.selectedSubMajorHeadId).subscribe({
      next: (minorHeads) => {
        this.items = minorHeads; // Update the table with filtered minor heads
        this.minorHeadOptions = minorHeads.map((minor: any) => ({
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
}