import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you are looking for might have been removed or is temporarily unavailable.</p>
      <button (click)="navigate()" class="home-button">Go Back Home</button>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(to right, #ff4c4c, #ff6b6b);
      color: #fff;
      text-align: center;
      font-family: 'Poppins', sans-serif;
      animation: fadeIn 1s ease-in-out;
    }

    h1 {
      font-size: 8rem;
      font-weight: 700;
      text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
      animation: bounce 1s infinite alternate;
    }

    h2 {
      font-size: 2rem;
      font-weight: 600;
      margin-top: -10px;
    }

    p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 10px 20px;
      line-height: 1.5;
      opacity: 0.9;
    }

    .home-button {
      margin-top: 20px;
      padding: 12px 24px;
      background: #fff;
      color: #ff4c4c;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: 25px;
      transition: all 0.3s ease-in-out;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      border: none;
      outline: none;
    }

    .home-button:hover {
      background: #ff2c2c;
      color: #fff;
      transform: scale(1.05);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(-10px);
      }
    }
  `]
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  navigate() {
    this.router.navigate(['/']);
  }
}
