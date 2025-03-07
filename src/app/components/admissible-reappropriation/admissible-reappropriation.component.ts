import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Change service if needed
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    HttpClientModule,
    ProgressSpinnerModule,
    DropdownModule
  ],
  providers: [CommonService], // Changble service
  templateUrl: './admissible-reappropriation.component.html',
  styleUrls: ['./admissible-reappropriation.component.scss']
})
export class AdmissibleReappropriationComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;

  constructor(private commonService: CommonService) {} // Change service

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    this.loading = true;

    this.commonService.getAllAdmissibleReappropriations().subscribe({
      next: (data) => {
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
          text: 'Failed to fetch data. Please try again.',
        });
      }
    });
  }
}

