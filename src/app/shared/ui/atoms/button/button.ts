import { Component, Input } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './button.html',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() disabled = false;
}
