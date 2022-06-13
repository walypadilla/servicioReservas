const momment = require('moment');

const dateList = (date) => {
	return momment(date).format('dddd LL');
};

const dateListCalendar = (date) => {
	return momment(date).format('L');
};

module.exports = { dateList, dateListCalendar };
