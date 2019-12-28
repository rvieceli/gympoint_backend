import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

export function formatDate(date) {
  return format(parseISO(date), "dd 'de' MMMM 'de' yyyy", {
    locale: pt,
  });
}

export default { formatDate };

const censorWord = str => {
  return str[0] + '*'.repeat(Math.max(str.length - 2, 3)) + str.slice(-1);
};

export const censorEmail = email => {
  const arr = email.split('@');
  return `${censorWord(arr[0])}@${arr[1]}`;
};
