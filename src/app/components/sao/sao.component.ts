import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SaoService } from '../../service/sao.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagModule } from 'primeng/tag';
import Swal from 'sweetalert2';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SaoCodes } from './sao-codes.enum';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-sao',
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
    TableModule,
    TagModule
  ],
  providers: [SaoService,CommonService],
  templateUrl: './sao.component.html',
  styleUrls: ['./sao.component.scss'],
})
export class SaoComponent implements OnInit {
  saos: any[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  sao: any = {};
  loading: boolean = false;
  saoCodes = Object.values(SaoCodes);
  searchQuery: string = '';
  selectedFilter: string = '';
  selectedLevel: number | null = null;
  levels:any[] = [];
  

  filterOptions: any[] = [
    { label: 'All', value: '' },
    { label: 'Code', value: 'code' },
    { label: 'Name', value: 'name' },
    { label: 'Next Level Code', value: 'nextLevelCode' },
  ];

  levelOptions:any[] = [];

  constructor(private saoService: SaoService,private commonService:CommonService) {}

  ngOnInit(): void {
    this.fetchSaos();
    this.getSaoLevels();
  }

  fetchSaos(): void {
    this.loading = true;

    this.saoService.getAllany(this.searchQuery, this.selectedFilter).subscribe({
      next: (data) => {
        this.saos = data
          .filter((sao: any) => !sao.isdeleted)
          .sort((a: { id: number }, b: { id: number }) => a.id - b.id);

        this.loading = false;
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SAOs. Please try again.',
        });
      },
    });
  }
  
  getSaoLevels(): void {
    this.commonService.getAllSAOLevels().subscribe({
      next: (response:any) => {
        console.log("API Response:", response);
  
        if (response && Array.isArray(response.result)) {
          this.levels = response.result;
          this.levelOptions = this.levels.map((level: any) => ({
            label: level.name, // Use 'name' instead of 'code' for better UX
            value: level.code, // Value should remain as 'code'
          }));
        } else {
          console.error("Invalid API Response format:", response);
          this.levels = [];
          this.levelOptions = [];
        }
      },
      error: (error) => {
        console.error('Error fetching SAO Levels:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch SAO Levels. Please try again.',
        });
      }
    });
  }
  
  
    onSearchChange(): void {
    this.fetchSaos();
  }

  onFilterChange(): void {
    this.fetchSaos();
  }
  onLevelChange(event: any): void {
    this.loading = true;
    
    const selectedCode = event?.value; // Extract selected code
    console.log("Selected Level Code:", selectedCode);
    
    if (!selectedCode) {
      console.warn("No valid selection made.");
      this.loading = false;
      return;
    }
  
    this.saoService['GetSaosByLevelValue'](selectedCode).subscribe({
      next: (sao: any) => {
        this.saos = Array.isArray(sao.result) ? sao.result : [];
        console.log("SAO List:", this.saos);
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error fetching SAO:", error);
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch SAO. Please try again.",
        });
      },
    });
  }
  
  


confirmToggleStatus(sao: any) {
  Swal.fire({
    title: `Are you sure?`,
    text: `You are about to mark this SAO as ${sao.isactive ? 'Inactive' : 'Active'}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: sao.isactive ? '#d33' : '#28a745',
    cancelButtonColor: '#6c757d',
    confirmButtonText: sao.isactive ? 'Yes, deactivate it!' : 'Yes, activate it!',
  }).then((result) => {
    if (result.isConfirmed) {
      // Toggle status
      sao.isactive = !sao.isactive;

      // Show success message
      Swal.fire({
        title: 'Updated!',
        text: `The SAO has been marked as ${sao.isactive ? 'Active' : 'Inactive'}.`,
        icon: 'success',
        timer: 1500
      });
    }
  });
}

  openDialog(isEdit: boolean = false, index?: number): void {
    this.isEditMode = isEdit;
    this.displayDialog = true;

    if (isEdit && index !== undefined) {
      const selectedSao = this.saos[index];
      this.sao = {
        id: selectedSao.id,
        code: selectedSao.code,
        name: selectedSao.name,
        nextLevelCode: selectedSao.nextLevelCode,
      };
    } else {
      this.sao = {
        code: '',
        name: '',
        nextLevelCode: '',
      };
    }
  }

  deleteSao(index: number): void {
    const saoId = this.saos[index].id;
    const deletedSao = this.saos[index]; // Store for rollback

    
    this.saos.splice(index, 1); // Optimistically update UI

    this.saoService.softDeleteSao(saoId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'SAO deleted successfully.',
        });
      },
      error: (error) => {
        console.error('Error deleting SAO:', error);
        this.saos.splice(index, 0, deletedSao); // Rollback UI change
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete SAO. Please try again.',
        });
      },
    });
  }
  

  saveSao(): void {
    if (this.isEditMode) {
      this.saoService.UpdateSao(this.sao).subscribe({
        next: (updatedSao) => {
          const index = this.saos.findIndex((s) => s.id === updatedSao.id);

          if (index !== -1) {
            this.saos[index] = updatedSao;
          }
          this.displayDialog = false;
          this.sao = {};
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'SAO updated successfully.',
          });
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error updating SAO:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to update SAO. Please try again.',
          });
        },
      });
    } else {
      this.saoService.AddSao(this.sao).subscribe({
        next: (newSao) => {
          this.saos.push(newSao);
          this.displayDialog = false;
          this.sao = {};
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'SAO created successfully.',
          });
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error creating SAO:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to create SAO. Please try again.',
          });
        },
      });
    }
  }
}