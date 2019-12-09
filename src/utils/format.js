import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

export function formatDate(date) {
  return format(parseISO(date), "dd 'de' MMMM 'de' yyyy", {
    locale: pt,
  });
}

export default { formatDate };
