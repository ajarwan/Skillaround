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


@Directive({
  selector: '[stickySideBar]'
})
export class StickySideBar implements OnInit, OnDestroy {

  public binder = this.onScroll.bind(this);

  constructor(
    public renderer2: Renderer2,
    public el: ElementRef
  ) {
    window.addEventListener('scroll', this.binder, true);
  }

  ngOnInit() {
    window.addEventListener('scroll', this.binder, true);

  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.binder, true);

  }
  public onScroll(e: any) {
    const offset = window.pageYOffset;

    const height = document.getElementsByTagName('body')[0].scrollHeight;
    const footerHeigt = document.getElementsByTagName('footer')[0].scrollHeight;

    const elemtheight = this.el.nativeElement.scrollHeight;
    const elemtoffset = this.el.nativeElement.offsetTop;

    const threshold = height - offset - elemtheight - 130;

    if (threshold <= footerHeigt) {
      // footer
      this.renderer2.removeStyle(this.el.nativeElement, 'top');
      this.renderer2.setStyle(this.el.nativeElement, 'width', '353.313px');
      this.renderer2.setStyle(this.el.nativeElement, 'position', 'absolute');
      this.renderer2.setStyle(this.el.nativeElement, 'bottom', '0px');
      this.renderer2.setStyle(this.el.nativeElement, environment.Lang == 'ar' ? 'left' : 'right', '1182.88px');
      this.renderer2.setStyle(this.el.nativeElement, 'z-index', '100px');
      this.renderer2.addClass(this.el.nativeElement, 'stick');
    } else if (offset >= 300) {
      // center
      this.renderer2.removeStyle(this.el.nativeElement, 'bottom');
      this.renderer2.setStyle(this.el.nativeElement, 'width', '353.313px');
      this.renderer2.setStyle(this.el.nativeElement, 'position', 'fixed');
      this.renderer2.setStyle(this.el.nativeElement, 'top', '130px');
      this.renderer2.setStyle(this.el.nativeElement, environment.Lang == 'ar' ? 'left' : 'right', '1369.78px');
      this.renderer2.setStyle(this.el.nativeElement, 'z-index', '100px');
      this.renderer2.addClass(this.el.nativeElement, 'stick');
    } else {
      // top
      this.renderer2.removeClass(this.el.nativeElement, 'stick');
      this.renderer2.removeStyle(this.el.nativeElement, 'bottom');
      this.renderer2.removeStyle(this.el.nativeElement, 'position');
      this.renderer2.removeStyle(this.el.nativeElement, 'width');
      this.renderer2.removeStyle(this.el.nativeElement, 'top');
      this.renderer2.removeStyle(this.el.nativeElement, environment.Lang == 'ar' ? 'left' : 'right');
      this.renderer2.removeStyle(this.el.nativeElement, 'z-index');
    }

  }




}
