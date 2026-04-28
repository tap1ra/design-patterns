// Subsystem: Amplifier
export class Amplifier {
  on() { console.log('Amplifier: on'); }
  off() { console.log('Amplifier: off'); }
  setVolume(level: number) { console.log(`Amplifier: setting volume to ${level}`); }
  setSurroundSound() { console.log('Amplifier: surround sound on (5.1)'); }
}

// Subsystem: Projector
export class Projector {
  on() { console.log('Projector: on'); }
  off() { console.log('Projector: off'); }
  wideScreenMode() { console.log('Projector: in widescreen mode (16:9)'); }
}

// Subsystem: Screen
export class Screen {
  up() { console.log('Screen: going up'); }
  down() { console.log('Screen: going down'); }
}

// Subsystem: Lights
export class TheaterLights {
  dim(level: number) { console.log(`TheaterLights: dimming to ${level}%`); }
  on() { console.log('TheaterLights: on'); }
}

// Facade
export class HomeTheaterFacade {
  private amp: Amplifier;
  private projector: Projector;
  private screen: Screen;
  private lights: TheaterLights;
  public onStep: ((msg: string, system: string) => void) | null = null;

  constructor() {
    this.amp = new Amplifier();
    this.projector = new Projector();
    this.screen = new Screen();
    this.lights = new TheaterLights();
  }

  private notify(msg: string, system: string) {
    if (this.onStep) this.onStep(msg, system);
    else console.log(msg);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async watchMovie(movie: string) {
    this.notify(`映画「${movie}」の再生準備を開始します...`, 'general');
    
    await this.delay(800);
    this.lights.dim(10);
    this.notify('照明を暗くします (10%)', 'lights');
    
    await this.delay(800);
    this.screen.down();
    this.notify('スクリーンを下ろします', 'screen');
    
    await this.delay(800);
    this.projector.on();
    this.projector.wideScreenMode();
    this.notify('プロジェクターを起動し、ワイドスクリーンモードに設定', 'projector');
    
    await this.delay(800);
    this.amp.on();
    this.amp.setSurroundSound();
    this.amp.setVolume(5);
    this.notify('アンプを起動し、サラウンドと音量を設定', 'amp');
    
    await this.delay(800);
    this.notify(`映画「${movie}」を再生します。お楽しみください！`, 'general');
  }

  async endMovie() {
    this.notify('映画の再生を終了し、システムをシャットダウンします...', 'general');
    
    await this.delay(800);
    this.amp.off();
    this.notify('アンプをオフ', 'amp');
    
    await this.delay(800);
    this.projector.off();
    this.notify('プロジェクターをオフ', 'projector');
    
    await this.delay(800);
    this.screen.up();
    this.notify('スクリーンを上げます', 'screen');
    
    await this.delay(800);
    this.lights.on();
    this.notify('照明を明るくします', 'lights');
    
    await this.delay(800);
    this.notify('ホームシアターシステムを終了しました。', 'general');
  }
}
