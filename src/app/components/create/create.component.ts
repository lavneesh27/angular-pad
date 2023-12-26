import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent implements OnInit {
  note: any = {
    title: '',
    content: '',
  };
  constructor(
    private data: DataService,
    private route: Router,
    private aRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.aRoute.params.subscribe(async (params) => {
      const noteId = params['id'];
  
      this.note = noteId
        ? await this.data.getNote(noteId)
        : { title: '', content: '' };
    });
  }

  addNote() {
    if (this.note.content == '') {
      alert('Please enter some text!');
      return;
    }
    this.data.addNote(this.note).then(() => {
      this.route.navigate(['home']);
    });
  }
}
