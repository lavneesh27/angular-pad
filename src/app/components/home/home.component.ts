import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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
  @ViewChild('sidebar') sidebar: ElementRef | undefined;
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

      this.notes.sort((a: any, b: any) =>
        new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1
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
          return (
            note.title.toLowerCase().includes(searchText.toLowerCase()) ||
            note.content.toLowerCase().includes(searchText.toLowerCase())
          );
        });
    });
  }
}
