import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  defaultRoute = '';
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {        
          this.previousUrl = this.currentUrl;
          this.currentUrl = event.url;           
      }
    });
  }

  defaultNavigation(): void {
    this.defaultRoute = 'login';
    this.router.navigateByUrl(this.defaultRoute);
  }
  changeNavigation(url: string): void {
    this.router.navigateByUrl(url);
  }
  changeNavigationByParams(url: string, params: any): void {
    this.router.navigate([url], { state: params });
  }
  public getPreviousUrl() {
    return this.previousUrl;
  }
}
