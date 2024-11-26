import { parse, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatTimeAgo(dateString: string) {
  const date = parse(dateString, 'dd/MM/yyyy HH:mm', new Date());
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}
