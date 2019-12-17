import moment from 'moment-timezone';

const getLanguage = (word) => {
  const language = {
    "0": "០", 
    "1": "១",
    "2": "២", 
    "3": "៣",
    "4": "៤", 
    "5": "៥", 
    "6": "៦", 
    "7": "៧", 
    "8": "៨", 
    "9": "៩",
    "day": ["អាទិត្យ","ច័ន្ទ","អង្គារ","ពុធ","ព្រហស្បតិ៍","សុក្រ","សៅរ៍"],
    "number": ["០","១","២","៣","៤","៥","៦","៧","៨","៩"],
    "month": ["មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា","កក្តដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ"],       
    "year ago": " :n ឆ្នាំមុន",
    "month ago": " :n ខែមុន",
    "day ago": " :n ថ្ងៃមុន",
    "hour ago": " :n ម៉ោងមុន",
    "minute ago": " :n នាទីមុន"
  }

  return language[word];
}


const ToKhmerNumber = (number) =>
{
  const digit = getLanguage('number');
  return number.toString().split("").map((char) => digit[parseInt(char)]).join("");
}

const ToKhmerMonthName = function(month)
{
  const n = parseInt(month);
  const month_name = getLanguage('month');
  
  return month_name[n-1];
}

const ToKhmerDayName = function(day)
{
  const n = parseInt(day);
  const day_name = getLanguage('day');
  
  return day_name[n];
}

export const ToKhmerDateTime = function(date)
{
  const js_date = new Date(date);
  
  const minute = js_date.getMinutes();
  const hour = js_date.getHours();
  const day = js_date.getDate();
  const month = js_date.getMonth();
  const year = js_date.getFullYear();
  const dayweek = js_date.getDay();
  
  
  return ToKhmerDayName(dayweek) + ' ' +
        ToKhmerNumber(day) + ' ' +
        ToKhmerMonthName(month) + ', ' +
        ToKhmerNumber(year) + ' ' +
        ToKhmerNumber(hour) + ':' +
        ToKhmerNumber(minute);
}

export const ToKhmerDate = function(date) 
{
  const js_date = new Date(date);
  
  const day = js_date.getDate();
  const month = js_date.getMonth();
  const year = js_date.getFullYear();
  const dayweek = js_date.getDay();
  
  return ToKhmerDayName(dayweek) + ' ' +
        ToKhmerNumber(day) + ' ' +
        ToKhmerMonthName(month) + ", " +
        ToKhmerNumber(year);
}

export const getKhmerElapseTime = function(time) 
{
  return getElapseTimeFromTimestamp(new Date(time));
}

const getElapseTimeFromTimestamp = function(time)
{
  const diff = (moment().tz('Asia/Phnom_Penh') - time)/1000;
  const year = Math.floor(diff / (3600 * 24 * 30 * 12));
  const month = Math.floor(diff / (3600 * 24 * 30));
  const day = Math.floor(diff / (3600 * 24));
  const hour = Math.floor(diff / (3600));
  const min = Math.floor(diff / (60));
  if (year > 0) {
    return getLanguage("year ago").replace(":n", ToKhmerNumber(year));
  } else if (month > 0) {
    return getLanguage("month ago").replace(":n", ToKhmerNumber(month));
  } else if (day > 0) {
    return getLanguage("day ago").replace(":n", ToKhmerNumber(day));
  } else if (hour > 0) {
    return getLanguage("hour ago").replace(":n", ToKhmerNumber(hour));
  } else if (min > 0) {
    return getLanguage("minute ago").replace(":n", ToKhmerNumber(min));
  } else {
    return getLanguage("minute ago").replace(":n", ToKhmerNumber(1));
  }
}
