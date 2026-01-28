export class DateFormatter {
  static formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  static formatDateTime(dateString: string | undefined, timeString: string | undefined): string {
    if (!dateString || !timeString) return '';
    const date = new Date(dateString);
    const time = new Date(timeString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds} ${month}-${day}-${year}`;
  }
}
