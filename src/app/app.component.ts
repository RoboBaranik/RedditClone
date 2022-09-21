import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularProject';
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'arrow_down',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow_down24.svg'));
    iconRegistry.addSvgIcon(
      'arrow_up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow_up24.svg'));
    iconRegistry.addSvgIcon(
      'error',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error40.svg'), { viewBox: '0 0 40 40' });
  }
}
