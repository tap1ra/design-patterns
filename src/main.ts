import './index.css';
import { ObserverView } from './patterns/observer/ObserverView';
import { StateView } from './patterns/state/StateView';
import { StrategyView } from './patterns/strategy/StrategyView';
import { SingletonView } from './patterns/singleton/SingletonView';
import { FactoryView } from './patterns/factory/FactoryView';
import { CommandView } from './patterns/command/CommandView';
import { DecoratorView } from './patterns/decorator/DecoratorView';
import { BuilderView } from './patterns/builder/BuilderView';
import { FacadeView } from './patterns/facade/FacadeView';

class App {
  private mainContent: HTMLElement;
  private currentPattern: string = '';
  
  // Cache views to preserve state
  private views: Record<string, { render: () => void }> = {};

  constructor() {
    this.mainContent = document.getElementById('main-content') as HTMLElement;
    this.initNavigation();
    
    // Default route
    this.loadPattern('observer');
  }

  private initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const pattern = target.getAttribute('data-pattern');
        
        if (pattern && pattern !== this.currentPattern) {
          // Update active styling
          navItems.forEach(nav => nav.classList.remove('active'));
          target.classList.add('active');
          
          this.loadPattern(pattern);
        }
      });
    });
  }

  private loadPattern(pattern: string) {
    this.currentPattern = pattern;
    this.mainContent.innerHTML = ''; // Clear container
    
    // Create view if it doesn't exist yet
    if (!this.views[pattern]) {
      if (pattern === 'observer') {
        this.views[pattern] = new ObserverView(this.mainContent);
      } else if (pattern === 'state') {
        this.views[pattern] = new StateView(this.mainContent);
      } else if (pattern === 'strategy') {
        this.views[pattern] = new StrategyView(this.mainContent);
      } else if (pattern === 'singleton') {
        this.views[pattern] = new SingletonView(this.mainContent);
      } else if (pattern === 'factory') {
        this.views[pattern] = new FactoryView(this.mainContent);
      } else if (pattern === 'command') {
        this.views[pattern] = new CommandView(this.mainContent);
      } else if (pattern === 'decorator') {
        this.views[pattern] = new DecoratorView(this.mainContent);
      } else if (pattern === 'builder') {
        this.views[pattern] = new BuilderView(this.mainContent);
      } else if (pattern === 'facade') {
        this.views[pattern] = new FacadeView(this.mainContent);
      }
    }
    
    // Render the view
    if (this.views[pattern]) {
      this.views[pattern].render();
    }
  }
}

// Bootstrap app
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
