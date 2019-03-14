module.exports = {
    queryAll:'select * from s',
    queryAllcourse:'select * from c,o where o.kh = c.kh',
    queryByxh:'select * from s where xh=',
    queryUser:'select * from user where id=',
    queryBygh:'select distinct s.xh,s.xm,s.xb,s.csrq,s.jg,s.sjhm,s.yxh from s,e where e.xh = s.xh and e.gh=',
    queryScore:'select e.xq,e.kh,c.km,e.zpcj,c.xf,t.xm from e,c,t where c.kh = e.kh and t.gh = e.gh and e.xh = ',
    queryCourse:'select o.xq,o.kh,c.km,c.xf,t.xm,t.gh from o,t,c where o.gh = t.gh and o.kh = c.kh',
    addCoures:'insert into e(xh,xq,kh,gh) values',
    deleteCourse:'delete from e where e.gh = (select gh from t where t.xm = ',
    queryCoursebygh:'select o.xq,o.kh,c.km,c.xf from o,c where o.kh = c.kh and o.gh = ',
    queryByCourse:'select s.xm,s.xh,e.pscj,e.kscj,e.zpcj from s,e where s.xh = e.xh and e.gh = ',
    updateGrade:'update e set '
};
