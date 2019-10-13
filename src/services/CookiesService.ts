import Cookies, { CookieSetOptions } from "universal-cookie";

export class CookiesService {
  private cookies: Cookies;
  constructor() {
    this.cookies = new Cookies();
  }

  public get(name: string): string {
    return this.cookies.get(name);
  }

  public set(name: string, value: string | object, options?:CookieSetOptions): void {
    this.cookies.set(name, value, options);
  }

  public remove(name: string): void {
    this.cookies.remove(name);
  }
}
