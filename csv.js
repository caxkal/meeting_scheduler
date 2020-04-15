const csv = require('csv-parser');
const fs = require('fs');

parse = (filename, useData) => {
    const data = []
    fs.createReadStream(filename)
        .pipe(csv(['Title', 'Duration', 'Speaker']))
        .on('data', (row) => data.push(row))
        .on('end', () => {
            useData(data)
        });
}

module.exports = {
    parse,
}