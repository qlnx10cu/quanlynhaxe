const query = require('../lib/db')
const Encrypt = require('../lib/encryptPassword');
const config = require('../config');

class AbstractTwo {
    static async getList(ClassTableOne, ClassTableTwo, param, paramQsl1, paramQsl2) {
        let where = ' 1=? ';
        let param1 = ClassTableOne.getArrayParam(param);
        param1 = Object.assign(param1, paramQsl1);
        let param2 = ClassTableTwo.getArrayParam(param);
        param2 = Object.assign(param2, paramQsl2);
        let wherevalue = [
            1,
        ];
        if (Object.keys(param1).length) {
            for (var k in param1) {
                where = where + " AND tb1." + k + ' = ? ';
                wherevalue.push(param1[k]);
            }
        }
        if (Object.keys(param2).length) {
            for (var k in param2) {
                where = where + " AND tb2." + k + ' = ? ';
                wherevalue.push(param2[k]);
            }
        }
        let sql = `SELECT ${ClassTableOne.getSelect('tb1')},${ClassTableTwo.getSelect('tb2')} FROM ${ClassTableOne.getNameTable()} tb1 INNER JOIN ${ClassTableTwo.getNameTable()} tb2 ON ${ClassTableOne.getJoin()} where ${where} `;
        let res = await query(sql, wherevalue);
        return res;
    }
    static async getOne(ClassTableOne, ClassTableTwo, param, param1, param2) {
        let res = await AbstractTwo.getList(ClassTableOne, ClassTableTwo, param, param1, param2);
        if (!res)
            return null;
        return res[0];
    }
    static async add(ClassTableOne, ClassTableTwo, param) {
        let param1 = ClassTableOne.getArrayParam(param);
        let values = '';
        for (var a in param1) {
            values = values + `'${param1[a]}'` + ',';
        }
        values = values.substr(0, values.length - 1);
        let sql1 = `INSERT INTO ${ClassTableOne.getNameTable()} (` + ClassTableOne.getColmun(param1) + `) VALUES (${values})`;
        let res1 = await query(sql1);
        let param2 = ClassTableTwo.getArrayParam(param);
        values = '';
        for (var a in param2) {
            values = values + `'${param2[a]}'` + ',';
        }
        values = values.substr(0, values.length - 1);
        let sql2 = `INSERT INTO ${ClassTableTwo.getNameTable()} (` + ClassTableTwo.getColmun(param2) + `) VALUES (${values})`;
        let res2 = await query(sql2);
        return res2;
    }
    static async addAuto(ClassTableOne, ClassTableTwo, param) {
        let param1 = ClassTableOne.getArrayParam(param);
        let values = '', val = '';
        for (var a in param1)
            values = values + `'${param1[a]}'` + ',';
        values = values.substr(0, values.length - 1);
        let sql1 = `INSERT INTO ${ClassTableOne.getNameTable()} (` + ClassTableOne.getColmun(param1) + `) VALUES (${values})`;
        let res1 = await query(sql1);
        let id = [];
        let param2 = ClassTableTwo.getArrayParam(param);
        let col = ClassTableTwo.getForgenKey() + "," + ClassTableTwo.getColmun(param2);
        values = res1.insertId;

        for (var a in param2) {
            values = values + ",'" + param2[a] + "'";
        }
        let sql2 = `INSERT INTO ${ClassTableTwo.getNameTable()} (` + col + `) VALUES (${values})`;
        let res2 = await query(sql2);
        return res2;
    }
    static async addMutil(ClassTableOne, ClassTableTwo, param) {
        let param1 = ClassTableOne.getArrayParam(param[0]);


        let param2 = ClassTableTwo.getArrayParam(param[0]);
        let index = 0;
        console.log(param);
        console.log(param1);
        console.log(param2);


        let sql = "SELECT AUTO_INCREMENT as stt FROM  INFORMATION_SCHEMA.TABLES " +
            " WHERE TABLE_SCHEMA = '" + config.database.database + "' " +
            " AND  TABLE_NAME   = 'phutung' ";
        let res = await query(sql, params);
        index = res[0].stt;

        if (param1) {
            let val = '';
            var col = ClassTableOne.getColmun(param1);
            var params = [];
            param.forEach(element => {
                var values = '';
                for (var k in col) {
                    values = values + "?,";
                    params.push(element[col[k]]);
                }
                values = values.substr(0, values.length - 1);
                val = val + "(" + values + "),";
            });
            val = val.substr(0, val.length - 1);
            sql = `INSERT INTO ${ClassTableOne.getNameTable()} (` + col + `) VALUES ${val} ${ClassTableOne.getDuplicate()}`;
            res = await query(sql, params);
        }
        if (param2) {
            let val = '';
            var col = ClassTableTwo.getColmun(param2);
            var params = [];
            param.forEach(element => {
                var values = '?';
                params.push(index++);
                for (var k in col) {
                    values = values + ",?";
                    params.push(element[col[k]]);
                }
                val = val + "(" + values + "),";
            });
            col = ClassTableTwo.getForgenKey() + "," + col;
            val = val.substr(0, val.length - 1);
            sql = `INSERT INTO ${ClassTableTwo.getNameTable()} (` + col + `) VALUES ${val}`;
            res = await query(sql, params);
        }
        return res;
    }
    static async update(ClassTableOne, ClassTableTwo, paramSetValue, paramWhere) {
        if (!paramSetValue || !paramWhere)
            return false;

        let param = [1], where = ' 1=? ', res = null;
        for (var k in paramWhere) {
            where = where + " AND " + k + ' = ? ';
            param.push(paramWhere[k]);
        }
        let paramSetValue1 = ClassTableOne.getArrayParam(paramSetValue);
        if (Object.keys(paramSetValue1).length) {

            let param1 = [];
            let set1 = '';
            for (var k in paramSetValue1) {
                set1 = set1 + k + ' = ? ,';
                param1.push(paramSetValue1[k]);
            }
            set1 = set1.substr(0, set1.length - 1);
            let sql = `UPDATE ${ClassTableOne.getNameTable()} SET ${set1} WHERE ${ClassTableOne.getKey()} IN (SELECT ${ClassTableOne.getForgenKey()} FROM ${ClassTableTwo.getNameTable()} where ${where})`;
            res = await query(sql, param1.concat(param));
        }

        let paramSetValue2 = ClassTableTwo.getArrayParam(paramSetValue);
        if (Object.keys(paramSetValue2).length) {

            let set2 = '';
            let param2 = [];
            for (var k in paramSetValue2) {
                set2 = set2 + k + ' = ? ,';
                param2.push(paramSetValue2[k]);
            }
            set2 = set2.substr(0, set2.length - 1);
            let sql = `UPDATE ${ClassTableTwo.getNameTable()} SET ${set2} where ${where}`;
            res = await query(sql, param2.concat(param));
        }

        return res;
    }
    static async delete(ClassTableOne, ClassTableTwo, param1) {
        let res = null;
        if (!param1) {
            return null;
        }
        let where = ' 1=? ';
        let wherevalue = [
            1,
        ];
        for (var k in param1) {
            where = where + " AND " + k + ' = ? ';
            wherevalue.push(param1[k]);
        }
        let sql = `DELETE FROM ${ClassTableOne.getNameTable()} WHERE ${ClassTableOne.getKey()} IN (SELECT ${ClassTableOne.getForgenKey()} FROM ${ClassTableTwo.getNameTable()} where ${where})`;
        res = await query(sql, wherevalue);
        sql = `DELETE FROM ${ClassTableTwo.getNameTable()} where ${where}`;
        res = await query(sql, wherevalue);
        return res;
    }
}

module.exports = AbstractTwo;