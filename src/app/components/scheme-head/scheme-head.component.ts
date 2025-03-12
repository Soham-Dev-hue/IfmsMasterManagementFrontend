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
  items: any[] = [];
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
        this.items = data
          .filter((item: any) => !item.isDeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
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

  OnChangeDemandCode(): void {
    if (this.selectedDemandCode) {
      this.loading = true;
      this.commonService.getMajorHeadByDemandCode(this.selectedDemandCode).subscribe({
        next: (MajorHeads) => {
          this.items = MajorHeads
          console.log("majorheads:",this.items);
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
          this.items = SubMajorHeads
          console.log('SubMajorHeads',this.items);
          this.subMajorHeadOptions = SubMajorHeads.map((sm: any) => ({
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
          this.items = MinorHeads;
          console.log('MinorHeads',this.items);
          
          this.minorHeadOptions = MinorHeads.map((mh: any) => ({
            label: mh.code,
            value: mh.code,
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to fetch Minor Heads.' });
        },
      });
    } else {
      this.minorHeadOptions = [];
    }
    this.selectedMinorHeadCode = null;
    this.schemeHeadOptions = [];
    this.selectedSchemeHeadCode = null;
  }

  onMinorHeadCodeChange(): void {
    if (this.selectedMinorHeadCode && this.selectedDemandCode) {
      this.loading = true;
      this.commonService
        .getSchemeHeadByMinorHeadId(this.selectedMinorHeadCode, this.selectedDemandCode)
        .subscribe({
          next: (SchemeHeads) => {
            this.items = SchemeHeads;
            console.log('SchemeHeads',this.items);
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
      this.schemeHeadOptions = [];
    }
    this.selectedSchemeHeadCode = null;
  }

  onSchemeHeadCodeChange(): void {
    // Add logic here to handle the selection of Scheme Head Code
    console.log('Selected Scheme Head Code:', this.selectedSchemeHeadCode);
  }

  resetFilters(): void {
    this.router.navigateByUrl('/master/scheme-head').then(() => {
      window.location.reload();
    });
  }
}