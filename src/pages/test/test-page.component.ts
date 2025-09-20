import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-page',
  template: `
    <div style="padding: 20px;">
      <h1>Test Page</h1>
      <p>This is a test page to demonstrate refresh protection.</p>
      <p>
        Try refreshing this page - you should be redirected to the homepage.
      </p>
      <a routerLink="/" style="color: blue; text-decoration: underline;"
        >Back to Home</a
      >
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class TestPageComponent {}
