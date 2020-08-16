export const timeAgo = (date: Date) => {
  const MINUTE = 60;
  const HOUR = 60 * 60;
  const DAY = 24 * 60 * 60;
  const WEEK = 7 * DAY;
  const YEAR = 365 * DAY;
  const MONTH = 4 * WEEK;

  let now = new Date().getTime() / 1000;
  let d = new Date(date).getTime() / 1000;
  let diff = now - d;

  if (diff / YEAR >= 1) {
    let time = Math.floor(diff / YEAR);
    let ago = time > 1 ? " years ago" : " year ago";
    return time + ago;
  }
  if (diff / MONTH >= 1) {
    let time = Math.floor(diff / MONTH);
    let ago = time > 1 ? " months ago" : " month ago";
    return time + ago;
  }

  if (diff / WEEK >= 1) {
    let time = Math.floor(diff / WEEK);
    let ago = time > 1 ? " weeks ago" : " week ago";
    return time + ago;
  }
  if (diff / DAY >= 1) {
    let time = Math.floor(diff / DAY);
    let ago = time > 1 ? " days ago" : " day ago";
    return time + ago;
  }
  if (diff / HOUR >= 1) {
    let time = Math.floor(diff / HOUR);
    let ago = time > 1 ? " hours ago" : " hour ago";
    return time + ago;
  }
  if (diff / MINUTE >= 1) {
    let time = Math.floor(diff / MINUTE);
    let ago = time > 1 ? " minutes ago" : " minute ago";
    return time + ago;
  }

  if (diff >= 10) {
    let time = Math.floor(diff);
    let ago = time > 1 ? " seconds ago" : " second ago";
    return time + ago;
  }

  return "just now";
};
