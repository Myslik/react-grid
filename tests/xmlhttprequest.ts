export class XMLHttpRequest {
  static requests: XMLHttpRequest[] = [];

  method: string;
  url: string;

  open(method: string, url: string, async?: boolean) {
    this.method = method;
    this.url = url;
  }

  onload: (this: this, ev: Event) => any;
  onerror: (this: this, ev: ErrorEvent) => any;

  send() {
    XMLHttpRequest.requests.push(this);
  }
}