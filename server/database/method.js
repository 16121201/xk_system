var db =require('./data.base.config');
var mysql = require('mysql');
var sql = require('./sql');

let  pool = mysql.createPool(db);

let method = {
    getALL: (req, res) => {
        pool.getConnection(function (error, conn) {
            if (error) {
                throw error
            } else {
                conn.query(sql.queryAll, (error, rows) => {
                    if (error) throw error;
                    res.json(rows);
                    conn.release();
                })
            }
        })
    },
    getALLcourse: (req, res) => {
        pool.getConnection(function (error, conn) {
            if (error) {
                throw error
            } else {
                conn.query(sql.queryAllcourse, (error, rows) => {
                    if (error) throw error;
                    res.json(rows);
                    conn.release();
                })
            }
        })
    },
    getByxh: (req, res) => {
        pool.getConnection(function (error, conn) {
            if (error) {
                throw error
            } else {
                conn.query(sql.queryByxh+req.query.xh, (error, rows) => {
                    if (error) throw error;
                    res.json(rows);
                    conn.release();
                })
            }
        })
    },
    updateByxh: (req, res) => {
        pool.getConnection(function (error, conn) {
            if (error) {
                throw error
            } else {
                conn.query("update s set", (error, rows) => {
                    if (error) throw error;
                    res.json(rows);
                    conn.release();
                })
            }
        })
    },
    Login:(req, res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query.id);
            if (error) {
                throw error
            } else {
                conn.query(sql.queryUser+'\''+req.query.id+'\'', (error, rows) => {
                    if (error) throw error;
                    var row = JSON.stringify(rows);
                    row = JSON.parse(row);
                    if(row.length === 0){
                        row = [{status: 'no user'}];
                    }
                    else if(row[0].password !== req.query.password){
                        row[0].status = 'wrong password';
                        row[0].password = '';
                    }
                    else{
                        row[0].status = 'right password';
                        row[0].password = '';
                    }
                    res.json(row);
                    conn.release();
                })
            }
        })
    },
    getBygh:(req, res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query.gh);
            if (error) {
                throw error
            } else {
                conn.query(sql.queryBygh+'\''+req.query.gh+'\'', (error, rows) => {
                    if (error) throw error;
                    res.json(rows);
                    conn.release();
                })
            }
        })
    },
    getScore:(req,res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query.xh);
            if (error) {
                throw error
            } else {
                conn.query(sql.queryScore+'\''+req.query.xh+'\'', (error, rows) => {
                    if (error) throw error;
                    res.json(rows);
                    conn.release();
                })
            }
        })
    },
    getCourse:(req,res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query);
            if (error) {
                throw error
            } else {
                let queryCourse = sql.queryCourse;
                if(req.query.kh !== '')
                    queryCourse = queryCourse + ' and o.kh = \''+req.query.kh+ '\'';
                if(req.query.km !== '')
                    queryCourse = queryCourse + ' and c.km = \''+req.query.km+ '\'';
                if(req.query.xm !== '')
                    queryCourse = queryCourse + ' and t.xm = \''+req.query.xm+ '\'';
                if(req.query.gh !== '')
                    queryCourse = queryCourse + ' and o.gh = \''+req.query.gh+ '\'';
                if(req.query.page !== ''){
                    let start = (req.query.page - 1)*req.query.page_size;
                    let end = req.query.page*req.query.page_size;
                    queryCourse = queryCourse+' limit '+ start + ',' + end
                }
                conn.query(queryCourse, (error, rows) => {//+'and o.kh = '+'\''+req.query.kh+'\''
                    if (error) throw error;
                    res.json(rows);
                    conn.release();
                })
            }
        })
    },
    addCourse:(req,res) => {
        pool.getConnection(function (error, conn) {
            if (error) {
                throw error
            } else {
                conn.query(sql.addCoures+' (\''+req.query.xh+'\',\''+req.query.xq + '\',\''+req.query.kh+'\',\''+req.query.gh+'\')', (error, rows) => {
                    if (error){
                        res.json(rows);
                        throw error;
                    }
                    else{
                        res.json(rows);
                    }
                    conn.release();
                })
            }
        })
    },
    deleteCourse:(req,res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query);
            if (error) {
                throw error
            } else {
                conn.query(sql.deleteCourse+'\'' + req.query.xm+'\') and e.xh = \''+req.query.xh+'\' and e.xq = \''+req.query.xq + '\' and e.kh = \''+req.query.kh + '\'', (error, rows) => {
                    if (error){
                        res.json(rows);
                        throw error;
                    }
                    else{
                        res.json(rows);
                    }
                    conn.release();
                })
            }
        })
    },
    getCoursebygh:(req,res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query);
            if (error) {
                throw error
            } else {
                conn.query(sql.queryCoursebygh+'\'' + req.query.gh+'\'', (error, rows) => {
                    if (error){
                        throw error;
                    }
                    else{
                        res.json(rows);
                    }
                    conn.release();
                })
            }
        })
    },
    getBycourse:(req,res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query);
            if (error) {
                throw error
            } else {
                let queryByCourse = sql.queryByCourse+'\'' + req.query.gh+'\''+' and e.xq = \''+req.query.xq+'\' and e.kh = \''+req.query.kh+'\'';
                if(!isNaN(req.query.page)){
                    let start = (req.query.page - 1)*req.query.page_size;
                    let end = req.query.page*req.query.page_size;
                    console.log(start);
                    console.log(end);
                    queryByCourse =  queryByCourse+' limit '+ start + ',' + end
                }
                conn.query(queryByCourse, (error, rows) => {
                    if (error){
                        throw error;
                    }
                    else{
                        res.json(rows);
                    }
                    conn.release();
                })
            }
        })
    },
    updateGrade:(req,res) => {
        pool.getConnection(function (error, conn) {
            console.log(req.query);
            if (error) {
                throw error
            } else {
                let updateGrade = sql.updateGrade+'pscj = '+req.query.pscj+',kscj = '+req.query.kscj+',zpcj = '+req.query.zpcj+' where xh = \'' +
                    req.query.xh+'\' and xq = \''+req.query.xq+'\' and kh = \''+req.query.kh+'\' and gh = \''+req.query.gh+'\'';
                conn.query(updateGrade, (error, rows) => {
                    if (error){
                        res.json(rows);
                        throw error;
                    }
                    else{
                        res.json(rows);
                    }
                    conn.release();
                })
            }
        })
    }
};
module.exports = method;

