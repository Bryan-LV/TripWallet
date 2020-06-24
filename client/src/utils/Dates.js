import dayjs from 'dayjs';

export const createYMDDate = (date) => {
  if (date) {
    const year = dayjs(date).get('y');
    const day = dayjs(date).get('date');
    let month = dayjs(date).get('month');
    month++
    return `${year}-${month}-${day}`;
  }
  else {
    const year = dayjs().get('y');
    const day = dayjs().get('date');
    let month = dayjs().get('month');
    month++
    return `${year}-${month}-${day}`;
  }
}
