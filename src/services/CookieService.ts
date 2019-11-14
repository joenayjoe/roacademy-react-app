import Cookies, { CookieSetOptions } from "universal-cookie";

export class CookieService {
  private cookies: Cookies;
  constructor() {
    this.cookies = new Cookies();
  }

  public get(name: string) {
    return this.cookies.get(name);
  }

  public set(
    name: string,
    value: string | object,
    options?: CookieSetOptions
  ): void {
    this.cookies.set(name, value, options);
  }

  public remove(name: string, options?: CookieSetOptions): void {
    this.cookies.remove(name, options);
  }
}
