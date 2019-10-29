import Cookies, { CookieSetOptions } from "universal-cookie";

export class CookiesService {
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
    console.log("cookie service: set cookie ", name);
  }

  public remove(name: string, options?: CookieSetOptions): void {
    this.cookies.remove(name, options);
    console.log("cookie service: remove cookie ", name);
  }
}
