import { InvalidHtmlContentError } from "../errors/values/html-content/InvalidHtmlContentError";

export class HtmlContentValue {
  public static from(value: string): HtmlContentValue | InvalidHtmlContentError {
    if (typeof value !== 'string' || value.trim() === '') {
      return new InvalidHtmlContentError('HTML content must be a non-empty string.');
    }

    const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
    if (!htmlTagPattern.test(value)) {
      return new InvalidHtmlContentError('HTML content must contain valid HTML tags.');
    }

    const containsMaliciousContent = /on\w+\s*=\s*["']?javascript:/i.test(value) || /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(value);
    if (containsMaliciousContent) {
      return new InvalidHtmlContentError('HTML content contains potentially malicious code.');
    }

    return new HtmlContentValue(value);
  }

  private constructor(public value: string) {}
}
