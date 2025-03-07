import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financial-year',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, HttpClientModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  providers: [CommonService],
  templateUrl: './financial-year.component.html',
  styleUrl: './financial-year.component.scss'
})
export class FinancialYearComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  item: any = { };
  saving: boolean = false;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.fetchFinancialYears();
  }

  fetchFinancialYears(): void {
    this.loading = true;

    this.commonService.getAllFinancialYears().subscribe({
      next: (response: any) => {
        const data = response?.result || [];

        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", response);
          this.items = [];
          this.loading = false;
          return;
        }

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
          text: "Failed to fetch financial years. Please try again.",
        });
      },
    });
  }

  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;

    if (isEdit && index !== undefined && this.items[index]) {
      this.item = { ...this.items[index] };
    } else {
      this.item = {
        stringValue: '',
      };
    }
  }

  saveFinancialYear(): void {
    if (this.saving) return;
    this.saving = true;

    const request = this.isEditMode
      ? this.commonService.UpdateFinancialYear(this.item)
      : this.commonService.createFinancialYear(this.item);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: this.isEditMode ? 'Financial year updated successfully!' : 'Financial year added successfully!',
        });
        this.displayDialog = false;
        this.fetchFinancialYears();
      },
      error: (error) => {
        console.error('Error saving financial year:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to save financial year. Please try again.',
        });
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  deleteFinancialYear(index: number): void {
    const itemId = this.items[index].id;
    const deletedItem = this.items[index];

    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.items.splice(index, 1);

        this.commonService.SoftDeleteFinancialYear(itemId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Financial year deleted successfully.',
            });
          },
          error: (error) => {
            console.error('Error deleting financial year:', error);
            this.items.splice(index, 0, deletedItem);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete financial year. Please try again.',
            });
          },
        });
      }
    });
  }
}