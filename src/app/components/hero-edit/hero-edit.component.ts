import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { HeroService } from '../../services/hero.service';
import { HeroInterface } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-edit',
  templateUrl: './hero-edit.component.html',
  styleUrls: ['./hero-edit.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule,
    FormsModule, ReactiveFormsModule,
  ],
})
export class HeroEditComponent {
  form!: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<HeroEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeroInterface,
    private readonly fb: UntypedFormBuilder,
    private heroService: HeroService,
  ) {

    this.form = this.fb.group({
      uuid: [data.uuid ?? null, [Validators.required]],
      nameLabel: [data.nameLabel ?? '', [Validators.required]],
      genderLabel: [data.genderLabel ?? '', [Validators.required]],
      citizenshipLabel: [data.citizenshipLabel ?? '', [Validators.required]],
      skillsLabel: [data.skillsLabel ?? '', [Validators.required]],
      occupationLabel: [data.occupationLabel ?? '', [Validators.required]],
      memberOfLabel: [data.memberOfLabel ?? '', [Validators.required]],
      creatorLabel: [data.creatorLabel ?? '', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.form.valid){
      if(this.data.uuid) {
        this.heroService.edit(this.form.value);
      } else {
        this.heroService.add(this.form.value);
      }

      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }

  }
}
