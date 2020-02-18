export default class TimeFormatter {
  static getTimeDiff(d1: Date, d2: Date): string {
    let diff: number = d2.getTime()-d1.getTime();
    let ret: string = 'vor ';

    if (diff < 1000) ret += 'weniger als einer Sekunde';
    else if (diff < 60000) ret += `${Math.floor(diff/1000)} Sekunde${Math.floor(diff/1000) > 1 ? 'n' : ''}`;
    else if (diff < 3600000) ret += `${Math.floor(diff/1000/60)} Minute${Math.floor(diff/1000/60) > 1 ? 'n' : ''}`;
    else if (diff < 86400000) ret += `${Math.floor(diff/1000/60/60)} Stunde${Math.floor(diff/1000/60/60) > 1 ? 'n' : ''}`;
    else if (diff < 2592000000) ret += `${Math.floor(diff/1000/60/60/24)} Tag${Math.floor(diff/1000/60/60/24) > 1 ? 'en' : ''}`;
    else ret = `am ${TimeFormatter.formatDate(d1)}`;

    return ret;
  }

  static formatDate(d: Date): string {
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth()+1).toString().padStart(2, '0')}.${d.getFullYear().toString().padStart(4, '0')}`;
  }

  static formatTime(d: Date): string {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
}