import isServer from './isServer';

export class Storage {
  public name;

  constructor(name: string) {
    this.name = name;
  }

  public set(val: string) {
    if (isServer()) return;
    localStorage.setItem(this.name, val);
  }

  public get() {
    if (isServer()) return null;
    return localStorage.getItem(this.name);
  }

  public remove() {
    if (isServer()) return;
    localStorage.removeItem(this.name);
  }
}

export const TokenStorage = new Storage('token');
export const EmailStorage = new Storage('email');
export const StreatchedMasterKey = new Storage('streatchedMasterKey');
