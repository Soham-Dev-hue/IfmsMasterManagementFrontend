import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-detail-head',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule],
  providers: [CommonService],
  templateUrl: './detail-head.component.html',
  styleUrl: './detail-head.component.scss'
})
export class DetailHeadComponent {
items: any[] = [];
  loading: boolean = false;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchDetailHeads();
  }

  fetchDetailHeads(): void {
    this.loading = true;
  
    this.commonService.getAllDetailHeads().subscribe({
      next: (response: any) => {
        // Extract the `result` array from the response
        const data = Array.isArray(response) ? response : response?.data || [];
  
        // Check if `data` is an array
        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", response);
          this.items = [];
          this.loading = false;
          return;
        }
  
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
}
