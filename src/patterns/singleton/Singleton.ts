export class SettingsManager {
  private static instance: SettingsManager | null = null;
  private settings: Record<string, string | boolean | number> = {
    theme: 'dark',
    notifications: true,
    volume: 80
  };
  public readonly instanceId: string;

  // コンストラクタをprivateにし、外部からの `new` を禁止する
  private constructor() {
    this.instanceId = Math.random().toString(36).substring(2, 9);
    console.log(`SettingsManagerの新しいインスタンスが生成されました。 (ID: ${this.instanceId})`);
  }

  // 唯一のインスタンスを取得するための静的メソッド
  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  public getSetting(key: string) {
    return this.settings[key];
  }

  public setSetting(key: string, value: string | boolean | number) {
    this.settings[key] = value;
    console.log(`設定を更新しました: ${key} = ${value} (Instance ID: ${this.instanceId})`);
  }

  public getAllSettings() {
    return { ...this.settings };
  }
}
