import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { HeroInterface } from "../../interfaces/hero.interface";

class DialogOverviewExampleDialog {
}

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatListModule],
})
export class HeroDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<HeroDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeroInterface,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
