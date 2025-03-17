import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-major-head',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule],
  providers: [CommonService],
  templateUrl: './major-head.component.html',
  styleUrl: './major-head.component.scss'
})
export class MajorHeadComponent {
 items: any[] = [];
  loading: boolean = false;
  searchText: string = '';
  selectedfilter: string = '';
  pageNumber?: number;
  pageSize?: number;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchMajorHeads();
  }

  fetchMajorHeads(event?: TableLazyLoadEvent): void {
    this.loading = true;

    const pageNumber =
      event?.first !== undefined &&
      typeof event.rows === 'number' &&
      event.rows > 0
        ? Math.floor(event.first / event.rows)+1
        : undefined;

    const pageSize =
      typeof event?.rows === 'number' && event.rows > 0
        ? event.rows
        : undefined;

    this.commonService.getAllMajorHeads(this.searchText,
        this.selectedfilter,
        pageNumber,
        pageSize).subscribe({
      next: (response:any) => {
        const data = Array.isArray(response)
            ? response
            : response?.result.items || [];
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
          text: 'Failed to fetch departments. Please try again.',
        });
      }
    });
  }
}


