import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private data: DataService
  ) {}
  notes: any;
  searchNote: string = '';
  ngOnInit(): void {
    this.data.getAllNotes().subscribe((res: any) => {
      this.notes = res.map(
        (e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        },
        () => {
          alert('Error while fetching notes');
        }
      );
      console.log(this.notes);

      this.notes.sort((a: any, b: any) =>
        new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
      );
    });
  }
  filter(searchText: string) {
    this.data.getAllNotes().subscribe((res: any) => {
      this.notes = res
        .map(
          (e: any) => {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;

            return data;
          },
          () => {
            alert('Error while fetching users');
          }
        )
        .filter((note: any) => {
          const title = note.title || ''; // Ensure title is defined
          const content = note.content || ''; // Ensure content is defined
          return (
            note.title.toLowerCase().includes(searchText.toLowerCase()) ||
            note.content.toLowerCase().includes(searchText.toLowerCase())
          );
        });
    });
  }
}
