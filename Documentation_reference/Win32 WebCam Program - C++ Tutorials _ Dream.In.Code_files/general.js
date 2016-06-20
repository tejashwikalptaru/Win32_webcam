var cmPageURL; if(self == top) cmPageURL = document.location.href; else cmPageURL = document.referrer;
var cmifr = (self==top ? '' : 'env=ifr;');
document.write('<scr'+'ipt type="text/javascript" language="javascript" src="http://a.collective-media.net/cmadj/ns.dreamincode/general;ppos=atf;kw=;tile=2;sz=300x250;net=ns;ord=738379711622198?;'+cmifr+'ord1=' +Math.floor(Math.random() * 1000000) + ';cmpgurl='+escape(escape(cmPageURL))+'?"></scr'+'ipt>');
