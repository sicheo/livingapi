"use strict";
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run('CREATE TABLE lorem (info TEXT)');
    let stmt = db.prepare('INSERT INTO lorem VALUES(json(?))');
    for (let i = 0; i < 10; i++) {
        stmt.run(JSON.stringify({ a: i }));
    }
    stmt.finalize();
    db.each('SELECT rowid AS id, json_extract(info, \'$.a\') AS info FROM lorem', function (err, row) {
        console.log(row.id + ": " + row.info);
    });
});
