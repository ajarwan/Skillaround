import { Directive, HostListener, ElementRef, Renderer2, OnInit, OnDestroy, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[myUnderline]'
})
export class UnderlineDirective {

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) { }
  // Event listeners for element hosting
  // the directive
  @HostListener('mouseenter') onMouseEnter() {
    this.hover(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover(false);
  }
  // Event method to be called on mouse enter and on mouse leave
  hover(shouldUnderline: boolean) {
    if (shouldUnderline) {
      this.renderer.setStyle(this.el.nativeElement, 'text-decoration', 'underline');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'text-decoration', 'none');
    }
  }
}

