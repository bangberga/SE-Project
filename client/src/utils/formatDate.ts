import moment from "moment";

const formatDate = (date: string) => {
  return moment(date).format("dddd Do MMMM, YYYY. h:mma");
};

const interval = (date: string) => {
  return moment(date).fromNow();
};

export { formatDate, interval };
