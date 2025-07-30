import { Component } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-<%= dasherize(name) %>',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component {}
