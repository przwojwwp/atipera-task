import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { PeriodicElement, ELEMENT_DATA } from './periodic-element';
import { EditDialogComponent } from './edit-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    // EditDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data = signal<PeriodicElement[]>([]);
  filterText = signal('');
  filtered = signal<PeriodicElement[]>([]);

  constructor(private dialog: MatDialog) {
    effect(() => {
      const filter = this.filterText().toLowerCase();
      this.filtered.set(
        !filter
          ? this.data()
          : this.data().filter(
              (el) =>
                el.name.toLowerCase().includes(filter) ||
                el.symbol.toLowerCase().includes(filter) ||
                el.position.toString().includes(filter) ||
                el.weight.toString().includes(filter)
            )
      );
    });
  }

  displayedColumns = ['position', 'name', 'weight', 'symbol', 'actions'];
  private filterTimeout: any;

  ngOnInit() {
    setTimeout(() => {
      this.data.set(ELEMENT_DATA);
    }, 1000);
  }

  onFilterChange(value: string) {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.filterText.set(value);
    }, 1000);
  }

  openEditDialog(element: PeriodicElement) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updated = this.data().map((el) =>
          el.position === result.position ? result : el
        );
        this.data.set(updated);
      }
    });
  }
}
