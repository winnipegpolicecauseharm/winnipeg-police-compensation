const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const badgeToYears = [2014, 2015, 2016, 2017, 2018].reduce((badgeToYears, year) => {
  const yearData = parse(
    fs.readFileSync(`data/tabula-${year}.csv`),
    {
      columns: false,
      relax_column_count: true,
    }
  );

  const policeRows = yearData.filter(rowIsPolice);

  policeRows.forEach(row => {
    const badge = row[0];

    if (!badgeToYears[badge]) {
      badgeToYears[badge] = [];
    }

    const dataForYear = year === 2014 ? dataFrom2014(row) : dataFromOtherYears(row);
    dataForYear.year = year;

    badgeToYears[badge].push(dataForYear);
  });

  return badgeToYears;
}, {});

fs.writeFileSync('data/badge-to-year-data.json', JSON.stringify(badgeToYears, null, 2));

function rowIsPolice([identifier]) {
  return identifier.match(/^\d+$/);
}

function dataFrom2014([badge, position, salaryString]) {
  return {
    position,
    salary: parseSalary(salaryString),
  };
}

function dataFromOtherYears([badge, initial, position, department, salaryString]) {
  return {
    position,
    salary: parseSalary(salaryString),
  };
}

function parseSalary(salaryString) {
  return parseInt(salaryString.replace(',', ''));
}
