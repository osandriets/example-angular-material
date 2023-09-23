import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HeroInterface } from "../../interfaces/hero.interface";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeroInterface,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(data: HeroInterface): void {
    this.dialogRef.close(data);
  }
}
