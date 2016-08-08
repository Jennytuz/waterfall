var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
//mongoose模块引入
var db = require('./db');


// view engine setup
////引入arttemplate模板
var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//浏览器访问地址 http://localhost:3000/api/book/1
app.get('/api/book/:page', (req, res) => {
	var page = req.params.page;
	page = page || 1;
	page = parseInt(page);
	var pageSize = 40; //每一页显示的数据数量
		
	db.Book.find().count((err,total)=>{
		if(err){
			console.log(err);
		}
		//总页数
		var pageCount = Math.ceil(total / pageSize);

		//页面范围限制
		if (page > pageCount) {
			page = pageCount;
			res.json({status:'n',msg:"已到最后一页"})
		}
		if (page < 1) {
			page = 1;
		}
		db.Book.find().limit(pageSize).skip((page-1)*pageSize).exec((err,data)=>{
			res.json({status:"y",msg:"数据获取成功",data:data});
		})
	})
	
	
	
	
})


app.listen(3000, (req, res) => {
	console.log('服务器运行中。。。');
})