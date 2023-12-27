import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  selectedColor: string = '';
  colors: any = [
    '',
    '#FAAFA8',
    '#F39F76',
    '#FFF8B8',
    '#E2F6D3',
    '#B4DDD3',
    '#D4E4ED',
    '#AECCDC',
    '#D3BFDB',
    '#F6E2DD',
    '#E9E3D4',
  ];
  private modalService = inject(NgbModal);
  noteId: any;
  constructor(
    private data: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private _location: Location,
  ) {}
  ngOnInit() {
    this.aRoute.params.subscribe(async (params) => {
      this.noteId = params['id'];

      this.note = this.noteId
        ? await this.data.getNote(this.noteId)
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
  updateNote() {
    if (this.note.content == '') {
      alert('Please enter some text!');
      return;
    }
    this.data.updateNote(this.note).then(() => {
      this.route.navigate(['home']);
    });
    this.modalService.dismissAll();
  }
  goBack() {
    this._location.back();
  }
  delete() {
    this.data.deleteNote(this.note).then(() => {
      alert('deleted');
      this.route.navigate(['home']);
    });
  }
  open(content: TemplateRef<any>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'sm',
      windowClass: 'dark-modal',
    });
  }
  pickColor(color:string){
    this.note.color = color;
  }
}
