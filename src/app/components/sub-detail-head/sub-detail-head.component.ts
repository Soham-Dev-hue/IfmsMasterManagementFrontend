import { Component } from '@angular/core';
import { CommonService } from '../../service/common.service';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-sub-detail-head',
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
  templateUrl: './sub-detail-head.component.html',
  styleUrl: './sub-detail-head.component.scss'
})
export class SubDetailHeadComponent {
items: any[] = [];
  loading: boolean = false;
  item:any={};
  displayDialog: boolean = false;
saving: boolean = false;
codes: any[] = []; //
DetailHeadIdOptions: any[]=[];

  constructor(private commonService: CommonService,private router:Router) {}

  ngOnInit(): void {
    this.fetchSubDetailHeads();
    this.getDetailHeadIds();
  }

  fetchSubDetailHeads(): void {
    this.loading = true;
  
    this.commonService.getAllSubDetailHeads().subscribe({
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
   getDetailHeadIds(): void {
          this.commonService.getAllDetailHeads("","",1,1000).subscribe({
            next: (response:any) => {
     console.log(response);
     
 
      
              this.DetailHeadIdOptions = response.result.items.map((code: any) => ({
                label: code.code, 
                value: code.code
              }));
            },
            error: (error) => {
              console.error('Error fetching Treasury Codes:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch Treasury Codes. Please try again.',
              });
            }
          });
        }
        getSubDetailHeadByDetailHeadId(code: any): void{
          console.log(code);
          
            this.loading = true;
            this.commonService.getSubDetailHeadByDetailHeadId(code).subscribe({
              next: (item) => {
                console.log(code);
                
                this.items = item;
                console.log(this.items);
                
                this.loading = false;
              },
              error: (error) => {
                console.error('Error fetching item:', error);
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'Failed to fetch item. Please try again.',
                });
              },
            });
          }
          resetFilters(): void {
            this.router.navigateByUrl("/master/sub-detail-head").then(() => {
              window.location.reload();
            });
          }
}
