import moment from 'moment-timezone';
export const getDateByFormat = (date, format:string) => {
  return moment(date).format(format);
}
export const getNowDateByFormat = (format:string) => {
  return moment().tz('Asia/Phnom_Penh').format(format); 
}
export const getNowDate = () => {
  return moment().tz('Asia/Phnom_Penh').format('YYYY-MM-DD'); 
}
export const getNowDateTime = () => {
  return moment().tz('Asia/Phnom_Penh').format('YYYY-MM-DD HH:mm:ss'); 
}
export const modifyDate = (date:string, number:number, modifier:string) => {
  return moment(date).add(number, modifier)
}
export const isDateBetween = (date, from, to) => {
  return moment(date).isBetween(from, to, null, "[]");
}

export const constructDateRange = (startDate, endDate) => {
  var dateArray = [];
  var currentDate = moment(startDate);
  var endDate = moment(endDate);
  while (currentDate <= endDate) {
    dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
    currentDate = moment(currentDate).add(1, 'days');
  }

  return dateArray;
}