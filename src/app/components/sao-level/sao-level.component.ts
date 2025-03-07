import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-sao-level',
  standalone: true,
imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule],
  providers: [CommonService],
  templateUrl: './sao-level.component.html',
  styleUrl: './sao-level.component.scss'
})
export class SaoLevelComponent {
items: any[] = [];
  loading: boolean = false;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchSaoLevels();
  }

  fetchSaoLevels(): void {
    this.loading = true;
  
    this.commonService.getAllSAOLevels().subscribe({
      next: (response: any) => {
        // Extract the `result` array from the response
        const data = response?.result || [];
  
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
