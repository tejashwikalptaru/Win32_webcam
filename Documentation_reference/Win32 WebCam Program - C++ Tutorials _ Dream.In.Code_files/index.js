var Debug={write:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.log(text);}},dir:function(values){if(jsDebug&&!Object.isUndefined(window.console)){console.dir(values);}},error:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.error(text);}},warn:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.warn(text);}},info:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.info(text);}}}
Event.observe(window,'load',function(e){Element.Methods.getOffsetParent=function(element){if(element.offsetParent&&element.offsetParent!=document.body)return $(element.offsetParent);if(element==document.body)return $(element);while((element=element.parentNode)&&element!=document.body)
if(Element.getStyle(element,'position')!='static')
return $(element);return $(document.body);}});function _getOffsetParent(element)
{if(element.offsetParent&&element.offsetParent!=document.body)return $(element.offsetParent);if(element==document.body)return $(element);while((element=element.parentNode)&&element!=document.body)
if(Element.getStyle(element,'position')!='static')
return $(element);return $(document.body);}
Prototype.Browser.IE6=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6;Prototype.Browser.IE7=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==7;Prototype.Browser.IE8=Prototype.Browser.IE&&!Prototype.Browser.IE6&&!Prototype.Browser.IE7;Prototype.Browser.Chrome=Prototype.Browser.WebKit&&(navigator.userAgent.indexOf('Chrome/')>-1);window.IPBoard=Class.create({namePops:[],vars:[],lang:[],templates:[],editors:$A(),initDone:false,initialize:function()
{Debug.write("IPBjs is loading...");document.observe("dom:loaded",function(){this.Cookie.init();Ajax.Responders.register({onLoading:function(){if(!$('ajax_loading'))
{if(!ipb.templates['ajax_loading']){return;}
$('ipboard_body').insert(ipb.templates['ajax_loading']);}
var effect=new Effect.Appear($('ajax_loading'),{duration:0.2});},onComplete:function(){if(!$('ajax_loading')){return;}
var effect=new Effect.Fade($('ajax_loading'),{duration:0.2});}});ipb.delegate.initialize();ipb.initDone=true;}.bind(this));},positionCenter:function(elem,dir)
{if(!$(elem)){return;}
elem_s=$(elem).getDimensions();window_s=document.viewport.getDimensions();window_offsets=document.viewport.getScrollOffsets();center={left:((window_s['width']-elem_s['width'])/2),top:((window_s['height']-elem_s['height'])/2)}
if(typeof(dir)=='undefined'||(dir!='h'&&dir!='v'))
{$(elem).setStyle('top: '+center['top']+'px; left: '+center['left']+'px');}
else if(dir=='h')
{$(elem).setStyle('left: '+center['left']+'px');}
else if(dir=='v')
{$(elem).setStyle('top: '+center['top']+'px');}
$(elem).setStyle('position: fixed');},showModal:function()
{if(!$('ipb_modal'))
{this.createModal();}
this.modal.show();},hideModal:function()
{if(!$('ipb_modal')){return;}
this.modal.hide();},createModal:function()
{this.modal=new Element('div',{id:'ipb_modal'}).hide().addClassName('modal');this.modal.setStyle("width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; overflow: hidden; z-index: 1000; opacity: 0.2");$('ipboard_body').insert({bottom:this.modal});},alert:function(message)
{if(!$('ipb_alert'))
{this.createAlert();}
this.showModal();$('ipb_alert_message').update(message);},createAlert:function()
{wrapper=new Element('div',{id:'ipb_alert'});icon=new Element('div',{id:'ipb_alert_icon'});message=new Element('div',{id:'ipb_alert_message'});ok_button=new Element('input',{'type':'button','value':"OK",id:'ipb_alert_ok'});cancel_button=new Element('input',{'type':'button','value':"Cancel",id:'ipb_alert_cancel'});wrapper.insert({bottom:icon}).insert({bottom:message}).insert({bottom:ok_button}).insert({bottom:cancel_button}).setStyle('z-index: 1001');$('ipboard_body').insert({bottom:wrapper});this.positionCenter(wrapper,'h');},editorInsert:function(content,editorid)
{if(!editorid){Debug.dir(ipb.editors);var editor=$A(ipb.editors).first();Debug.write(editor);}else{var editor=ipb.editors[editorid];}
if(Object.isUndefined(editor))
{Debug.error("Can't find any suitable editor");return;}
editor.insert_text(content);editor.editor_check_focus();}});IPBoard.prototype.delegate={store:$A(),initialize:function()
{document.observe('click',function(e){if(Event.isLeftClick(e)||Prototype.Browser.IE)
{var elem=null;var handler=null;var target=ipb.delegate.store.find(function(item){elem=e.findElement(item['selector']);if(elem){handler=item;return true;}else{return false;}});if(!Object.isUndefined(target))
{if(handler)
{Debug.write("Firing callback for selector "+handler['selector']);handler['callback'](e,elem,handler['params']);}}}})},register:function(selector,callback,params)
{ipb.delegate.store.push({selector:selector,callback:callback,params:params});}}
IPBoard.prototype.Cookie={store:[],initDone:false,set:function(name,value,sticky)
{var expires='';var path='/';var domain='';if(!name)
{return;}
if(sticky)
{if(sticky==1)
{expires="; expires=Wed, 1 Jan 2020 00:00:00 GMT";}
else if(sticky==-1)
{expires="; expires=Thu, 01-Jan-1970 00:00:01 GMT";}
else if(sticky.length>10)
{expires="; expires="+sticky;}}
if(ipb.vars['cookie_domain'])
{domain="; domain="+ipb.vars['cookie_domain'];}
if(ipb.vars['cookie_path'])
{path=ipb.vars['cookie_path'];}
document.cookie=ipb.vars['cookie_id']+name+"="+escape(value)+"; path="+path+expires+domain+';';ipb.Cookie.store[name]=value;Debug.write("Set cookie: "+ipb.vars['cookie_id']+name+"="+value+"; path="+path+expires+domain+';');},get:function(name)
{if(ipb.Cookie.initDone!==true)
{ipb.Cookie.init();}
if(ipb.Cookie.store[name])
{return ipb.Cookie.store[name];}
return'';},doDelete:function(name)
{Debug.write("Deleting cookie "+name);ipb.Cookie.set(name,'',-1);},init:function()
{if(ipb.Cookie.initDone)
{return true;}
skip=['session_id','ipb_admin_session_id','member_id','pass_hash'];cookies=$H(document.cookie.replace(" ",'').toQueryParams(";"));if(cookies)
{cookies.each(function(cookie){cookie[0]=cookie[0].strip();if(ipb.vars['cookie_id']!='')
{if(!cookie[0].startsWith(ipb.vars['cookie_id']))
{return;}
else
{cookie[0]=cookie[0].replace(ipb.vars['cookie_id'],'');}}
if(skip[cookie[0]])
{return;}
else
{ipb.Cookie.store[cookie[0]]=unescape(cookie[1]||'');Debug.write("Loaded cookie: "+cookie[0]+" = "+cookie[1]);}});}
ipb.Cookie.initDone=true;}};IPBoard.prototype.validate={isFilled:function(elem)
{if(!$(elem)){return null;}
return!$F(elem).blank();},isNumeric:function(elem)
{if(!$(elem)){return null;}
return $F(elem).match(/^[\d]+?$/);},isMatching:function(elem1,elem2)
{if(!$(elem1)||!$(elem2)){return null;}
return $F(elem1)==$F(elem2);},email:function(elem)
{if(!$(elem)){return null;}
if($F(elem).match(/^.+@.+\..{2,4}$/)){return true;}else{return false;}}};IPBoard.prototype.Autocomplete=Class.create({initialize:function(id,options)
{this.id=$(id).id;this.timer=null;this.last_string='';this.internal_cache=$H();this.pointer=0;this.items=$A();this.observing=true;this.objHasFocus=null;this.options=Object.extend({min_chars:3,multibox:false,global_cache:false,classname:'ipb_autocomplete',templates:{wrap:new Template("<ul id='#{id}'></ul>"),item:new Template("<li id='#{id}'>#{itemvalue}</li>")}},arguments[1]||{});if(!$(this.id)){Debug.error("Invalid textbox ID");return false;}
this.obj=$(this.id);if(!this.options.url)
{Debug.error("No URL specified for autocomplete");return false;}
$(this.obj).writeAttribute('autocomplete','off');this.buildList();$(this.obj).observe('focus',this.timerEventFocus.bindAsEventListener(this));$(this.obj).observe('blur',this.timerEventBlur.bindAsEventListener(this));$(this.obj).observe('keypress',this.eventKeypress.bindAsEventListener(this));},eventKeypress:function(e)
{if(![Event.KEY_TAB,Event.KEY_UP,Event.KEY_DOWN,Event.KEY_LEFT,Event.KEY_RIGHT,Event.KEY_RETURN].include(e.keyCode)){return;}
if($(this.list).visible())
{switch(e.keyCode)
{case Event.KEY_TAB:case Event.KEY_RETURN:this.selectCurrentItem(e);break;case Event.KEY_UP:case Event.KEY_LEFT:this.selectPreviousItem(e);break;case Event.KEY_DOWN:case Event.KEY_RIGHT:this.selectNextItem(e);break;}
Event.stop(e);}},selectCurrentItem:function(e)
{var current=$(this.list).down('.active');this.unselectAll();if(!Object.isUndefined(current))
{var itemid=$(current).id.replace(this.id+'_ac_item_','');if(!itemid){return;}
var value=this.items[itemid].replace('&amp;','&');if(this.options.multibox)
{if($F(this.obj).indexOf(',')!==-1)
{var pieces=$F(this.obj).split(',');pieces[pieces.length-1]='';$(this.obj).value=pieces.join(',')+' ';}
else
{$(this.obj).value='';}
$(this.obj).value=$F(this.obj)+value+', ';}
else
{$(this.obj).value=value;var effect=new Effect.Fade($(this.list),{duration:0.3});this.observing=false;}}
$(this.obj).focus();},selectThisItem:function(e)
{this.unselectAll();var items=$(this.list).immediateDescendants();var elem=Event.element(e);while(!items.include(elem))
{elem=elem.up();}
$(elem).addClassName('active');},selectPreviousItem:function(e)
{var current=$(this.list).down('.active');this.unselectAll();if(Object.isUndefined(current))
{this.selectFirstItem();}
else
{var prev=$(current).previous();if(prev){$(prev).addClassName('active');}
else
{this.selectLastItem();}}},selectNextItem:function(e)
{var current=$(this.list).down('.active');this.unselectAll();if(Object.isUndefined(current)){this.selectFirstItem();}
else
{var next=$(current).next();if(next){$(next).addClassName('active');}
else
{this.selectFirstItem();}}},selectFirstItem:function()
{if(!$(this.list).visible()){return;}
this.unselectAll();$(this.list).firstDescendant().addClassName('active');},selectLastItem:function()
{if(!$(this.list).visible()){return;}
this.unselectAll();var d=$(this.list).immediateDescendants();var l=d[d.length-1];if(l)
{$(l).addClassName('active');}},unselectAll:function()
{$(this.list).childElements().invoke('removeClassName','active');},timerEventBlur:function(e)
{window.clearTimeout(this.timer);this.eventBlur.bind(this).delay(0.6,e);},timerEventFocus:function(e)
{this.timer=this.eventFocus.bind(this).delay(0.4,e);},eventBlur:function(e)
{this.objHasFocus=false;if($(this.list).visible())
{var effect=new Effect.Fade($(this.list),{duration:0.3});}},eventFocus:function(e)
{if(!this.observing){return;}
this.objHasFocus=true;this.timer=this.eventFocus.bind(this).delay(0.6,e);var curValue=this.getCurrentName();if(curValue==this.last_string){return;}
if(curValue.length<this.options.min_chars){if($(this.list).visible())
{var effect=new Effect.Fade($(this.list),{duration:0.3,afterFinish:function(){$(this.list).update()}.bind(this)});}
return;}
this.last_string=curValue;json=this.cacheRead(curValue);if(json==false){var request=new Ajax.Request(this.options.url+escape(curValue),{method:'get',evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{Debug.error("Invalid response returned from the server");return;}
if(t.responseJSON['error'])
{switch(t.responseJSON['error'])
{case'requestTooShort':Debug.warn("Server said request was too short, skipping...");break;default:Debug.error("Server returned an error: "+t.responseJSON['error']);break;}
return false;}
if(t.responseText!="[]")
{this.cacheWrite(curValue,t.responseJSON);this.updateAndShow(t.responseText.evalJSON());}}.bind(this)});}
else
{this.updateAndShow(json);}},updateAndShow:function(json)
{if(!json){return;}
this.updateList(json);if(!$(this.list).visible()&&this.objHasFocus)
{Debug.write("Showing");var effect=new Effect.Appear($(this.list),{duration:0.3,afterFinish:function(){this.selectFirstItem();}.bind(this)});}},cacheRead:function(value)
{if(this.options.global_cache!=false)
{if(!Object.isUndefined(this.options.global_cache[value])){Debug.write("Read from global cache");return this.options.global_cache[value];}}
else
{if(!Object.isUndefined(this.internal_cache[value])){Debug.write("Read from internal cache");return this.internal_cache[value];}}
return false;},cacheWrite:function(key,value)
{if(this.options.global_cache!==false){this.options.global_cache[key]=value;}else{this.internal_cache[key]=value;}
return true;},getCurrentName:function()
{if(this.options.multibox)
{if($F(this.obj).indexOf(',')===-1){return $F(this.obj).strip();}
else
{var pieces=$F(this.obj).split(',');var lastPiece=pieces[pieces.length-1];return lastPiece.strip();}}
else
{return $F(this.obj).strip();}},buildList:function()
{if($(this.id+'_ac'))
{return;}
var ul=this.options.templates.wrap.evaluate({id:this.id+'_ac'});$$('body')[0].insert({bottom:ul});var finalPos={};var sourcePos=$(this.id).viewportOffset();var sourceDim=$(this.id).getDimensions();var delta=[0,0];var parent=null;var screenScroll=document.viewport.getScrollOffsets();if(Element.getStyle($(this.id),'position')=='absolute')
{parent=element.getOffsetParent();delta=parent.viewportOffset();}
finalPos['left']=sourcePos[0]-delta[0];finalPos['top']=sourcePos[1]-delta[1]+screenScroll.top;finalPos['top']=finalPos['top']+sourceDim.height;$(this.id+'_ac').setStyle('position: absolute; top: '+finalPos['top']+'px; left: '+finalPos['left']+'px;').hide();this.list=$(this.id+'_ac');},updateList:function(json)
{if(!json||!$(this.list)){return;}
var newitems='';this.items=$A();json=$H(json);json.each(function(item)
{var li=this.options.templates.item.evaluate({id:this.id+'_ac_item_'+item.key,itemid:item.key,itemvalue:item.value['showas']||item.value['name'],img:item.value['img']||'',img_w:item.value['img_w']||'',img_h:item.value['img_h']||''});this.items[item.key]=item.value['name'];newitems=newitems+li;}.bind(this));$(this.list).update(newitems);$(this.list).immediateDescendants().each(function(elem){$(elem).observe('mouseover',this.selectThisItem.bindAsEventListener(this));$(elem).observe('click',this.selectCurrentItem.bindAsEventListener(this));$(elem).setStyle('cursor: pointer');}.bind(this));if($(this.list).visible())
{this.selectFirstItem();}}});IPBoard.prototype.editor_values=$H({'templates':$A(),'colors_perrow':8,'colors':['000000','A0522D','556B2F','006400','483D8B','000080','4B0082','2F4F4F','8B0000','FF8C00','808000','008000','008080','0000FF','708090','696969','FF0000','F4A460','9ACD32','2E8B57','48D1CC','4169E1','800080','808080','FF00FF','FFA500','FFFF00','00FF00','00FFFF','00BFFF','9932CC','C0C0C0','FFC0CB','F5DEB3','FFFACD','98FB98','AFEEEE','ADD8E6','DDA0DD','FFFFFF'],'primary_fonts':$H({arial:"Arial",arialblack:"Arial Black",arialnarrow:"Arial Narrow",bookantiqua:"Book Antiqua",centurygothic:"Century Gothic",comicsansms:"Comic Sans MS",couriernew:"Courier New",franklingothicmedium:"Franklin Gothic Medium",garamond:"Garamond",georgia:"Georgia",impact:"Impact",lucidaconsole:"Lucida Console",lucidasansunicode:"Lucida Sans Unicode",microsoftsansserif:"Microsoft Sans Serif",palatinolinotype:"Palatino Linotype",tahoma:"Tahoma",timesnewroman:"Times New Roman",trebuchetms:"Trebuchet MS",verdana:"Verdana"}),'font_sizes':$A([1,2,3,4,5,6,7])});Object.extend(RegExp,{escape:function(text)
{if(!arguments.callee.sRE)
{var specials=['/','.','*','+','?','|','(',')','[',']','{','}','\\','$'];arguments.callee.sRE=new RegExp('(\\'+specials.join('|\\')+')','g');}
return text.replace(arguments.callee.sRE,'\\$1');}});String.prototype.encodeUrl=function()
{text=this;var regcheck=text.match(/[\x90-\xFF]/g);if(regcheck)
{for(var i=0;i<regcheck.length;i++)
{text=text.replace(regcheck[i],'%u00'+(regcheck[i].charCodeAt(0)&0xFF).toString(16).toUpperCase());}}
return escape(text).replace(/\+/g,"%2B").replace(/%20/g,'+').replace(/\*/g,'%2A').replace(/\//g,'%2F').replace(/@/g,'%40');};String.prototype.encodeParam=function()
{text=this;var regcheck=text.match(/[\x90-\xFF]/g);if(regcheck)
{for(var i=0;i<regcheck.length;i++)
{text=text.replace(regcheck[i],'%u00'+(regcheck[i].charCodeAt(0)&0xFF).toString(16).toUpperCase());}}
return escape(text).replace(/\+/g,"%2B");};Date.prototype.getDST=function()
{var beginning=new Date("January 1, 2008");var middle=new Date("July 1, 2008");var difference=middle.getTimezoneOffset()-beginning.getTimezoneOffset();var offset=this.getTimezoneOffset()-beginning.getTimezoneOffset();if(difference!=0)
{return(difference==offset)?1:0;}
else
{return 0;}};var Loader={require:function(name)
{document.write("<script type='text/javascript' src='"+name+".js'></script>");},boot:function()
{$A(document.getElementsByTagName("script")).findAll(function(s)
{return(s.src&&s.src.match(/ipb\.js(\?.*)?$/))}).each(function(s){var path=s.src.replace(/ipb\.js(\?.*)?$/,'');var includes=s.src.match(/\?.*load=([a-z0-9_,]*)/);if(!Object.isUndefined(includes)&&includes!=null&&includes[1])
{includes[1].split(',').each(function(include)
{if(include)
{Loader.require(path+"ips."+include);}})}});}}
var _global=window.IPBoard;_global.prototype.global={searchTimer:[],searchLastQuery:'',rssItems:[],reputation:{},ac_cache:$H(),pageJumps:$H(),pageJumpMenus:$H(),boardMarkers:$H(),init:function()
{Debug.write("Initializing ips.global.js");document.observe("dom:loaded",function(){ipb.global.initEvents();});},initEvents:function()
{ipb.delegate.register(".__user",ipb.global.userPopup);ipb.delegate.register(".warn_link",ipb.global.displayWarnLogs);ipb.delegate.register(".mini_friend_toggle",ipb.global.toggleFriend);if($('rss_feed')){ipb.global.buildRSSmenu();}
if($('newSkin')||$('newLang')){ipb.global.setUpSkinLang();}
if($('pm_notification')){new Effect.Parallel([new Effect.Appear($('pm_notification')),new Effect.BlindDown($('pm_notification'))],{duration:0.5});}
if($('close_pm_notification')){$('close_pm_notification').observe('click',ipb.global.closePMpopup);}
ipb.global.buildPageJumps();ipb.delegate.register('.bbc_spoiler_show',ipb.global.toggleSpoiler);ipb.delegate.register('a[rel~="external"]',ipb.global.openNewWindow);},userPopup:function(e,elem)
{Event.stop(e);var sourceid=elem.identify();var user=$(elem).className.match('__id([0-9]+)');var fid=$(elem).className.match('__fid([0-9]+)');if(user==null||Object.isUndefined(user[1])){Debug.error("Error showing popup");return;}
var popid='popup_'+user[1]+'_user';var _url=ipb.vars['base_url']+'&app=members&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=card&mid='+user[1];Debug.write(fid);if(fid!=null&&!Object.isUndefined(fid[1])&&fid[1])
{_url+='&f='+fid[1];}
Debug.write(_url);ipb.namePops[user]=new ipb.Popup(popid,{type:'balloon',ajaxURL:_url,stem:true,hideAtStart:false,attach:{target:elem,position:'auto'},w:'400px'});},displayWarnLogs:function(e,elem)
{mid=elem.id.match('warn_link_([0-9a-z]+)_([0-9]+)')[2];if(Object.isUndefined(mid)){return;}
if(parseInt(mid)==0){return false;}
Event.stop(e);var _url=ipb.vars['base_url']+'&app=members&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=warn&do=view&mid='+mid;warnLogs=new ipb.Popup('warnLogs',{type:'pane',modal:false,w:'500px',h:'500px',ajaxURL:_url,hideAtStart:false,close:'.cancel'});},toggleFriend:function(e,elem)
{Event.stop(e);var id=$(elem).id.match('friend_(.*)_([0-9]+)');if(Object.isUndefined(id[2])){return;}
var isFriend=($(elem).hasClassName('is_friend'))?1:0;var urlBit=(isFriend)?'remove':'add';var url=ipb.vars['base_url']+"app=members&section=friends&module=ajax&do="+urlBit+"&member_id="+id[2]+"&md5check="+ipb.vars['secure_hash'];new Ajax.Request(url,{method:'get',onSuccess:function(t)
{switch(t.responseText)
{case'pp_friend_timeflood':alert(ipb.lang['cannot_readd_friend']);Event.stop(e);break;case"pp_friend_already":alert(ipb.lang['friend_already']);Event.stop(e);break;case"error":return true;break;default:var newIcon=(isFriend)?ipb.templates['m_add_friend'].evaluate({id:id[2]}):ipb.templates['m_rem_friend'].evaluate({id:id[2]});var friends=$$('.mini_friend_toggle').each(function(fr){if($(fr).id.endsWith('_'+id[2]))
{if(isFriend){$(fr).removeClassName('is_friend').addClassName('is_not_friend').update(newIcon);}else{$(fr).removeClassName('is_not_friend').addClassName('is_friend').update(newIcon);}}});new Effect.Highlight($(elem),{startcolor:ipb.vars['highlight_color']});document.fire('ipb:friendRemoved',{friendID:id[2]});Event.stop(e);break;}}});},toggleFlagSpammer:function(memberId,flagStatus)
{if(flagStatus==true)
{if(confirm(ipb.lang['set_as_spammer']))
{var tid=0;var fid=0;var sid=0;if(typeof(ipb.topic)!='undefined')
{tid=ipb.topic.topic_id;fid=ipb.topic.forum_id;sid=ipb.topic.start_id;}
window.location=ipb.vars['base_url']+'app=forums&module=moderate&section=moderate&do=setAsSpammer&member_id='+memberId+'&t='+tid+'&f='+fid+'&st='+sid+'&auth_key='+ipb.vars['secure_hash'];return false;}
else
{return false;}}
else
{alert(ipb.lang['is_spammer']);return false;}},toggleSpoiler:function(e,button)
{Event.stop(e);var returnvalue=$(button).up().down('.bbc_spoiler_wrapper').down('.bbc_spoiler_content').toggle();if(returnvalue.visible())
{$(button).value='Hide';}
else
{$(button).value='Show';}},setUpSkinLang:function()
{if($('newSkin'))
{var form=$('newSkin').up('form');if(form)
{if($('newSkinSubmit')){$('newSkinSubmit').hide();}
$('newSkin').observe('change',function(e)
{form.submit();return true;});}}
if($('newLang'))
{var form1=$('newLang').up('form');if(form1)
{if($('newLangSubmit')){$('newLangSubmit').hide();}
$('newLang').observe('change',function(e)
{form1.submit();return true;});}}},buildRSSmenu:function()
{$$('link').each(function(link)
{if(link.readAttribute('type')=="application/rss+xml")
{ipb.global.rssItems.push(ipb.templates['rss_item'].evaluate({url:link.readAttribute('href'),title:link.readAttribute('title')}));}});if(ipb.global.rssItems.length>0)
{rssmenu=ipb.templates['rss_shell'].evaluate({items:ipb.global.rssItems.join("\n")});$('rss_feed').insert({after:rssmenu});new ipb.Menu($('rss_feed'),$('rss_menu'));}
else
{$('rss_feed').hide();}},closePMpopup:function(e)
{if($('pm_notification'))
{new Effect.Parallel([new Effect.Fade($('pm_notification')),new Effect.BlindUp($('pm_notification'))],{duration:0.5});}
Event.stop(e);},initGD:function(elem)
{if(!$(elem)){return;}
$(elem).observe('click',ipb.global.generateNewImage);if($('gd-image-link'))
{$('gd-image-link').observe('click',ipb.global.generateNewImage);}},generateImageExternally:function(elem)
{if(!$(elem)){return;}
$(elem).observe('click',ipb.global.generateNewImage);},generateNewImage:function(e)
{img=Event.findElement(e,'img');Event.stop(e);if(img==document){return;}
if(!img)
{anchor=Event.findElement(e,'a');if(anchor)
{img=anchor.up().down('img');}}
oldSrc=img.src.toQueryParams();oldSrc=$H(oldSrc).toObject();if(!oldSrc['captcha_unique_id']){Debug.error("No captcha ID found");}
new Ajax.Request(ipb.vars['base_url']+"app=core&module=global&section=captcha&do=refresh&captcha_unique_id="+oldSrc['captcha_unique_id']+'&secure_key='+ipb.vars['secure_hash'],{method:'get',onSuccess:function(t)
{oldSrc['captcha_unique_id']=t.responseText;img.writeAttribute({src:ipb.vars['base_url']+$H(oldSrc).toQueryString()});$F('regid').value=t.responseText;}});},registerReputation:function(id,url,rating)
{if(!$(id)){return;}
var rep_up=$(id).down('.rep_up');var rep_down=$(id).down('.rep_down');var sendUrl=ipb.vars['base_url']+'&app=core&module=ajax&section=reputation&do=add_rating&app_rate='+url.app+'&type='+url.type+'&type_id='+url.typeid+'&secure_key='+ipb.vars['secure_hash'];if($(rep_up)){$(rep_up).observe('click',ipb.global.repRate.bindAsEventListener(this,1,id));}
if($(rep_down)){$(rep_down).observe('click',ipb.global.repRate.bindAsEventListener(this,-1,id));}
ipb.global.reputation[id]={obj:$(id),url:url,sendUrl:sendUrl,currentRating:rating||0};Debug.write("Registered reputation");},repRate:function(e)
{Event.stop(e);var type=$A(arguments)[1];var id=$A(arguments)[2];var value=(type==1)?1:-1;if(!ipb.global.reputation[id]){return;}else{var rep=ipb.global.reputation[id];}
new Ajax.Request(rep.sendUrl+'&rating='+value,{method:'get',onSuccess:function(t)
{if(t.responseText=='done')
{try{rep.obj.down('.rep_up').hide();rep.obj.down('.rep_down').hide();}catch(err){}
var rep_display=rep.obj.down('.rep_show');if(rep_display)
{['positive','negative','zero'].each(function(c){rep_display.removeClassName(c)});var newValue=rep.currentRating+value;if(newValue>0)
{rep_display.addClassName('positive');}
else if(newValue<0)
{rep_display.addClassName('negative');}
else
{rep_display.addClassName('zero');}
rep_display.update(parseInt(rep.currentRating+value));}}
else
{if(t.responseText=='nopermission')
{alert(ipb.lang['no_permission']);}
else
{alert(ipb.lang['action_failed']+": "+t.responseText);}}}});},timer_liveSearch:function(e)
{ipb.global.searchTimer['show']=setTimeout(ipb.global.liveSearch,400);},timer_hideLiveSearch:function(e)
{ipb.global.searchTimer['hide']=setTimeout(ipb.global.hideLiveSearch,800);},hideLiveSearch:function(e)
{new Effect.Fade($('live_search_popup'),{duration:0.4,afterFinish:function(){$('ajax_result').update('');}});ipb.global.searchLastQuery='';clearTimeout(ipb.global.searchTimer['show']);clearTimeout(ipb.global.searchTimer['hide']);},liveSearch:function(e)
{ipb.global.timer_liveSearch();if($F('main_search').length<ipb.vars['live_search_limit']){return;}
if(!$('live_search_popup'))
{Debug.write("Creating popup");ipb.global.buildSearchPopup();}
else if(!$('live_search_popup').visible())
{new Effect.Appear($('live_search_popup'),{duration:0.4});}
if($F('main_search')==ipb.global.searchLastQuery){return;}
var refine_search='';if(ipb.vars['active_app'])
{refine_search+="&app_search="+ipb.vars['active_app'];}
if(ipb.vars['search_type']&&ipb.vars['search_type_id'])
{refine_search+='&search_type='+ipb.vars['search_type']+'&search_type_id='+ipb.vars['search_type_id'];}
if(ipb.vars['search_type_2']&&ipb.vars['search_type_id_2'])
{refine_search+='&search_type_2='+ipb.vars['search_type_2']+'&search_type_id_2='+ipb.vars['search_type_id_2'];}
new Ajax.Request(ipb.vars['base_url']+"app=core&module=ajax&section=livesearch&do=search&secure_key="+ipb.vars['secure_hash']+"&search_term="+$F('main_search').encodeUrl()+refine_search,{method:'get',onSuccess:function(t){if(!$('ajax_result')){return;}
$('ajax_result').update(t.responseText);}});ipb.global.searchLastQuery=$F('main_search');},buildSearchPopup:function(e)
{pos=$('main_search').cumulativeOffset();finalPos={top:pos.top+$('main_search').getHeight(),left:(pos.left+45)};popup=new Element('div',{id:'live_search_popup'}).hide().setStyle('top: '+finalPos.top+'px; left: '+finalPos.left+'px');$('content').insert({bottom:popup});var refine_search='';if(ipb.vars['active_app'])
{refine_search+="&app_search="+ipb.vars['active_app'];}
if(ipb.vars['search_type']&&ipb.vars['search_type_id'])
{refine_search+='&search_type='+ipb.vars['search_type']+'&search_type_id='+ipb.vars['search_type_id'];}
if(ipb.vars['search_type_2']&&ipb.vars['search_type_id_2'])
{refine_search+='&search_type_2='+ipb.vars['search_type_2']+'&search_type_id_2='+ipb.vars['search_type_id_2'];}
new Ajax.Request(ipb.vars['base_url']+"app=core&module=ajax&section=livesearch&do=template&secure_key="+ipb.vars['secure_hash']+refine_search,{method:'get',onSuccess:function(t){popup.update(t.responseText);}});new Effect.Appear($('live_search_popup'),{duration:0.3});},convertSize:function(size)
{var kb=1024;var mb=1024*1024;var gb=1024*1024*1024;if(size<kb){return size+" B";}
if(size<mb){return(size/kb).toFixed(2)+" KB";}
if(size<gb){return(size/mb).toFixed(2)+" MB";}
return(size/gb).toFixed(2)+" GB";},initImageResize:function()
{var dims=document.viewport.getDimensions();ipb.global.screen_w=dims.width;ipb.global.screen_h=dims.height;ipb.global.max_w=Math.ceil(ipb.global.screen_w*(ipb.vars['image_resize']/100));},findImgs:function(wrapper)
{if(!$(wrapper)){return;}
if(!ipb.vars['image_resize']){return;}
if($(wrapper).hasClassName('imgsize_ignore')){Debug.write("Ignoring this post for image resizing...");return;}
$(wrapper).select('img.bbc_img').each(function(elem){if(!ipb.global.screen_w)
{ipb.global.initImageResize();}
ipb.global.resizeImage(elem);});},resizeImage:function(elem)
{if(elem.tagName!='IMG'){return;}
if(elem.readAttribute('handled')){Debug.write("Handled...");return;}
if(!ipb.global.post_width)
{var post=$(elem).up('.post');if(!Object.isUndefined(post))
{var extra=parseInt(post.getStyle('padding-left'))+parseInt(post.getStyle('padding-right'));ipb.global.post_width=$(post).getWidth()-(extra*2);}}
var widthCompare=(ipb.vars['image_resize_force'])?ipb.vars['image_resize_force']:((ipb.global.post_width)?ipb.global.post_width:ipb.global.max_w);var dims=elem.getDimensions();if(dims.width>widthCompare)
{var percent=Math.ceil((widthCompare/dims.width)*100);if(percent<100)
{elem.height=dims.height*(percent/100);elem.width=dims.width*(percent/100);}
var temp=ipb.templates['resized_img'];var wrap=$(elem).wrap('div').addClassName('resized_img');$(elem).insert({before:temp.evaluate({percent:percent,width:dims.width,height:dims.height})});$(elem).addClassName('resized').setStyle('cursor: pointer;');$(elem).writeAttribute('origWidth',dims.width).writeAttribute('origHeight',dims.height).writeAttribute('shrunk',1);$(elem).writeAttribute('newWidth',elem.width).writeAttribute('newHeight',elem.height).writeAttribute('handled',1);$(elem).observe('click',ipb.global.enlargeImage);}},enlargeImage:function(e)
{var elem=Event.element(e);if(!elem.hasClassName('resized')){elem=Event.findElement(e,'.resized');}
var img=elem;if(!img){return;}
if($(img).readAttribute('shrunk')==1)
{$(img).setStyle('width: '+img.readAttribute('origWidth')+'px; height: '+img.readAttribute('origHeight')+'px; cursor: pointer');$(img).writeAttribute('shrunk',0);}
else
{$(img).setStyle('width: '+img.readAttribute('newWidth')+'px; height: '+img.readAttribute('newHeight')+'px; cursor: pointer');$(img).writeAttribute('shrunk',1);Debug.write("width: "+img.readAttribute('newWidth'));}},registerPageJump:function(source,options)
{if(!source||!options){return;}
ipb.global.pageJumps[source]=options;},buildPageJumps:function()
{$$('.pagejump').each(function(elem){var classes=$(elem).className.match(/pj([0-9]+)/);if(!classes[1]){return;}
$(elem).identify();var temp=ipb.templates['page_jump'].evaluate({id:'pj_'+$(elem).identify()});$$('body')[0].insert(temp);$('pj_'+$(elem).identify()+'_submit').observe('click',ipb.global.pageJump.bindAsEventListener(this,$(elem).identify()));$('pj_'+$(elem).identify()+'_input').observe('keypress',function(e){if(e.which==Event.KEY_RETURN)
{ipb.global.pageJump(e,$(elem).identify());}});var wrap=$('pj_'+$(elem).identify()+'_wrap').addClassName('pj'+classes[1]).writeAttribute('jumpid',classes[1]);var callback={afterOpen:function(popup){try{$('pj_'+$(elem).identify()+'_input').activate();}
catch(err){}}};ipb.global.pageJumpMenus[classes[1]]=new ipb.Menu($(elem),$(wrap),{stopClose:true},callback);});},pageJump:function(e,elem)
{if(!$(elem)||!$('pj_'+$(elem).id+'_input')){return;}
var value=$F('pj_'+$(elem).id+'_input');var jumpid=$('pj_'+$(elem).id+'_wrap').readAttribute('jumpid');if(value.blank()){try{ipb.global.pageJumpMenus[source].doClose();}catch(err){}}
else
{value=parseInt(value);}
var options=ipb.global.pageJumps[jumpid];if(!options){Debug.dir(ipb.global.pageJumps);Debug.write(jumpid);return;}
var pageNum=((value-1)*options.perPage);Debug.write(pageNum);if(pageNum<1){pageNum=0;}
if(ipb.vars['seo_enabled']&&document.location.toString().match(ipb.vars['seo_params']['start'])&&document.location.toString().match(ipb.vars['seo_params']['end'])){if(options.url.match(ipb.vars['seo_params']['varBlock']))
{var url=options.url+ipb.vars['seo_params']['varSep']+options.stKey+ipb.vars['seo_params']['varSep']+pageNum;}
else
{var url=options.url+ipb.vars['seo_params']['varBlock']+options.stKey+ipb.vars['seo_params']['varSep']+pageNum;}}else{var url=options.url+'&amp;'+options.stKey+'='+pageNum;}
url=url.replace(/&amp;/g,'&');url=url.replace(/(http:)?\/\//g,function($0,$1){return $1?$0:'/'});document.location=url;return;},openNewWindow:function(e,link,force)
{var ourHost=document.location.host;var newHost=link.host;if(ourHost!=newHost||force)
{window.open(link.href);Event.stop(e);return false;}
else
{return true;}},registerMarker:function(id,key,url)
{if(!$(id)||key.blank()||url.blank()){return;}
if(Object.isUndefined(ipb.global.boardMarkers)){return;}
Debug.write("Marker INIT: "+id);$(id).observe('click',ipb.global.sendMarker.bindAsEventListener(this,id,key,url));},sendMarker:function(e,id,key,url)
{Event.stop(e);if(!ipb.global.boardMarkers[key]){return;}
new Ajax.Request(url+"&secure_key="+ipb.vars['secure_hash'],{method:'get',evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{Debug.error("Invalid server response");return false;}
if(t.responseJSON['error'])
{Debug.error(t.responseJSON['error']);return false;}
$(id).replace(ipb.global.boardMarkers[key]);}});},registerCheckAll:function(id,classname)
{if(!$(id)){return;}
$(id).observe('click',ipb.global.checkAll.bindAsEventListener(this,classname));$$('.'+classname).each(function(elem){$(elem).observe('click',ipb.global.checkOne.bindAsEventListener(this,id));});},checkAll:function(e,classname)
{Debug.write('checkAll');var elem=Event.element(e);var checkboxes=$$('.'+classname);if(elem.checked){checkboxes.each(function(check){check.checked=true;});}else{checkboxes.each(function(check){check.checked=false;});}},checkOne:function(e,id)
{var elem=Event.element(e);if($(id).checked&&elem.checked==false)
{$(id).checked=false;}},updateReportStatus:function(e,reportID,noauto,noimg)
{Event.stop(e);var url=ipb.vars['base_url']+"app=core&amp;module=ajax&amp;section=reports&amp;do=change_status&secure_key="+ipb.vars['secure_hash']+"&amp;status=3&amp;id="+parseInt(reportID)+"&amp;noimg="+parseInt(noimg)+"&amp;noauto="+parseInt(noauto);new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'post',evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{alert(ipb.lang['action_failed']);return;}
try{$('rstat-'+reportID).update(t.responseJSON['img']);ipb.menus.closeAll(e);}catch(err){Debug.error(err);}}});},getTotalOffset:function(elem,top,left)
{if($(elem).getOffsetParent()!=document.body)
{Debug.write("Checking "+$(elem).id);var extra=$(elem).positionedOffset();top+=extra['top'];left+=extra['left'];return ipb.global.getTotalOffset($(elem).getOffsetParent(),top,left);}
else
{Debug.write("OK Finished!");return{top:top,left:left};}},checkPermission:function(text)
{if(text=="nopermission")
{alert(ipb.lang['nopermission']);return false;}
return true;}}
var _menu=window.IPBoard;_menu.prototype.menus={registered:$H(),init:function()
{Debug.write("Initializing ips.menu.js");document.observe("dom:loaded",function(){ipb.menus.initEvents();});},initEvents:function()
{Event.observe(document,'click',ipb.menus.docCloseAll);$$('.ipbmenu').each(function(menu){id=menu.identify();if($(id+"_menucontent"))
{new ipb.Menu(menu,$(id+"_menucontent"));}});},register:function(source,obj)
{ipb.menus.registered.set(source,obj);},docCloseAll:function(e)
{if((!Event.isLeftClick(e)||e.ctrlKey==true||e.keyCode==91)&&!Prototype.Browser.IE)
{}
else
{ipb.menus.closeAll(e);}},closeAll:function(except)
{ipb.menus.registered.each(function(menu,force){if(typeof(except)=='undefined'||(except&&menu.key!=except))
{try{menu.value.doClose();}catch(err){}}});}}
_menu.prototype.Menu=Class.create({initialize:function(source,target,options,callbacks){if(!$(source)||!$(target)){return;}
if(!$(source).id){$(source).identify();}
this.id=$(source).id+'_menu';this.source=$(source);this.target=$(target);this.callbacks=callbacks||{};this.options=Object.extend({eventType:'click',stopClose:false,offsetX:0,offsetY:0},arguments[2]||{});$(source).observe('click',this.eventClick.bindAsEventListener(this));$(source).observe('mouseover',this.eventOver.bindAsEventListener(this));$(target).observe('click',this.targetClick.bindAsEventListener(this));$(this.target).setStyle('position: absolute;').hide().setStyle({zIndex:9999});$(this.target).descendants().each(function(elem){$(elem).setStyle({zIndex:10000});});ipb.menus.register($(source).id,this);if(Object.isFunction(this.callbacks['afterInit']))
{this.callbacks['afterInit'](this);}},doOpen:function()
{Debug.write("Menu open");var pos={};_source=(this.options.positionSource)?this.options.positionSource:this.source;var sourcePos=$(_source).positionedOffset();var _sourcePos=$(_source).cumulativeOffset();var _offset=$(_source).cumulativeScrollOffset();var realSourcePos={top:_sourcePos.top-_offset.top,left:_sourcePos.left-_offset.left};var sourceDim=$(_source).getDimensions();var screenDim=document.viewport.getDimensions();var menuDim=$(this.target).getDimensions();Debug.write("realSourcePos: "+realSourcePos.top+" x "+realSourcePos.left);Debug.write("sourcePos: "+sourcePos.top+" x "+sourcePos.left);Debug.write("scrollOffset: "+_offset.top+" x "+_offset.left);Debug.write("_sourcePos: "+_sourcePos.top+" x "+_sourcePos.left);Debug.write("sourceDim: "+sourceDim.width+" x "+sourceDim.height);Debug.write("menuDim: "+menuDim.height);Debug.write("screenDim: "+screenDim.height);Debug.write("manual ofset: "+this.options.offsetX+" x "+this.options.offsetY);if(Prototype.Browser.IE7)
{_a=_source.getOffsetParent();_b=this.target.getOffsetParent();}
else
{_a=_getOffsetParent(_source);_b=_getOffsetParent(this.target);}
if(_a!=_b)
{if((realSourcePos.left+menuDim.width)>screenDim.width){diff=menuDim.width-sourceDim.width;pos.left=_sourcePos.left-diff+this.options.offsetX;}else{if(Prototype.Browser.IE7)
{pos.left=(sourcePos.left)+this.options.offsetX;}
else
{pos.left=(_sourcePos.left)+this.options.offsetX;}}
if((((realSourcePos.top+sourceDim.height)+menuDim.height)>screenDim.height)&&(_sourcePos.top-menuDim.height+this.options.offsetY)>0)
{pos.top=_sourcePos.top-menuDim.height+this.options.offsetY;}else{pos.top=_sourcePos.top+sourceDim.height+this.options.offsetY;}}
else
{if((realSourcePos.left+menuDim.width)>screenDim.width){diff=menuDim.width-sourceDim.width;pos.left=sourcePos.left-diff+this.options.offsetX;}else{pos.left=sourcePos.left+this.options.offsetX;}
if((((realSourcePos.top+sourceDim.height)+menuDim.height)>screenDim.height)&&(_sourcePos.top-menuDim.height+this.options.offsetY)>0)
{pos.top=sourcePos.top-menuDim.height+this.options.offsetY;}else{pos.top=sourcePos.top+sourceDim.height+this.options.offsetY;}}
Debug.write("Menu position: "+pos.top+" x "+pos.left);$(this.target).setStyle('top: '+(pos.top-1)+'px; left: '+pos.left+'px;');new Effect.Appear($(this.target),{duration:0.2,afterFinish:function(e){if(Object.isFunction(this.callbacks['afterOpen']))
{this.callbacks['afterOpen'](this);}}.bind(this)});Event.observe(document,'keypress',this.checkKeyPress.bindAsEventListener(this));},checkKeyPress:function(e)
{if(e.keyCode==Event.KEY_ESC)
{this.doClose();}},doClose:function()
{new Effect.Fade($(this.target),{duration:0.3,afterFinish:function(e){if(Object.isFunction(this.callbacks['afterClose']))
{this.callbacks['afterClose'](this);}}.bind(this)});},targetClick:function(e)
{if(this.options.stopClose)
{Event.stop(e);}},eventClick:function(e)
{Event.stop(e);if($(this.target).visible()){if(Object.isFunction(this.callbacks['beforeClose']))
{this.callbacks['beforeClose'](this);}
this.doClose();}else{ipb.menus.closeAll($(this.source).id);if(Object.isFunction(this.callbacks['beforeOpen']))
{this.callbacks['beforeOpen'](this);}
this.doOpen();}},eventOver:function()
{}});_popup=window.IPBoard;_popup.prototype.Popup=Class.create({initialize:function(id,options,callbacks)
{this.id='';this.wrapper=null;this.inner=null;this.stem=null;this.options={};this.timer=[];this.ready=false;this._startup=null;this.hideAfterSetup=false;this.eventPairs={'mouseover':'mouseout','mousedown':'mouseup'};this._tmpEvent=null;this.id=id;this.options=Object.extend({type:'pane',w:'500px',modal:false,modalOpacity:0.4,hideAtStart:true,delay:{show:0,hide:0},defer:false,hideClose:false,closeContents:ipb.templates['close_popup']},arguments[1]||{});this.callbacks=callbacks||{};if(this.options.defer&&$(this.options.attach.target))
{this._defer=this.init.bindAsEventListener(this);$(this.options.attach.target).observe(this.options.attach.event,this._defer);if(this.eventPairs[this.options.attach.event])
{this._startup=function(e){this.hideAfterSetup=true;this.hide()}.bindAsEventListener(this);$(this.options.attach.target).observe(this.eventPairs[this.options.attach.event],this._startup);}}
else
{this.init();}},init:function()
{try{Event.stopObserving($(this.options.attach.target),this.options.attach.event,this._defer);}catch(err){}
this.wrapper=new Element('div',{'id':this.id+'_popup'}).setStyle('z-index: 16000').hide().addClassName('popupWrapper');this.inner=new Element('div',{'id':this.id+'_inner'}).addClassName('popupInner');if(this.options.w){this.inner.setStyle('width: '+this.options.w);}
if(this.options.h){this.inner.setStyle('max-height: '+this.options.h);}
this.wrapper.insert(this.inner);if(this.options.hideClose!=true)
{this.closeLink=new Element('div',{'id':this.id+'_close'}).addClassName('popupClose').addClassName('clickable');this.closeLink.update(this.options.closeContents);this.closeLink.observe('click',this.hide.bindAsEventListener(this));this.wrapper.insert(this.closeLink);}
$$('body')[0].insert(this.wrapper);if(this.options.classname){this.wrapper.addClassName(this.options.classname);}
if(this.options.initial){this.update(this.options.initial);}
if(this.options.ajaxURL){this.updateAjax();setTimeout(this.continueInit.bind(this),80);}else{this.ready=true;this.continueInit();}},continueInit:function()
{if(!this.ready)
{setTimeout(this.continueInit.bind(this),80);return;}
if(this.options.type=='balloon'){this.setUpBalloon();}else{this.setUpPane();}
try{if(this.options.close){closeElem=$(this.wrapper).select(this.options.close)[0];if(Object.isElement(closeElem))
{$(closeElem).observe('click',this.hide.bindAsEventListener(this));}}}catch(err){Debug.write(err);}
if(Object.isFunction(this.callbacks['afterInit']))
{this.callbacks['afterInit'](this);}
if(!this.options.hideAtStart&&!this.hideAfterSetup)
{this.show();}
if(this.hideAfterSetup&&this._startup)
{Event.stopObserving($(this.options.attach.target),this.eventPairs[this.options.attach.event],this._startup);}},updateAjax:function()
{new Ajax.Request(this.options.ajaxURL,{method:'get',onSuccess:function(t)
{if(t.responseText!='error')
{if(t.responseText=='nopermission')
{alert(ipb.lang['no_permission']);return;}
if(t.responseText.match("__session__expired__log__out__"))
{this.update('');alert("Your session has expired, please refresh the page and log back in");return false;}
Debug.write("AJAX done!");this.update(t.responseText);this.ready=true;if(Object.isFunction(this.callbacks['afterAjax']))
{this.callbacks['afterAjax'](this,t.responseText);}}
else
{Debug.write(t.responseText);return;}}.bind(this)});},show:function(e)
{if(e){Event.stop(e);}
if(this.timer['show']){clearTimeout(this.timer['show']);}
if(this.options.delay.show!=0){this.timer['show']=setTimeout(this._show.bind(this),this.options.delay.show);}else{this._show();}},hide:function(e)
{if(e){Event.stop(e);}
if(this.document_event){Event.stopObserving(document,'click',this.document_event);}
if(this.timer['hide']){clearTimeout(this.timer['hide']);}
if(this.options.delay.hide!=0){this.timer['hide']=setTimeout(this._hide.bind(this),this.options.delay.hide);}else{this._hide();}},_show:function()
{if(this.options.modal==false){new Effect.Appear($(this.wrapper),{duration:0.3,afterFinish:function(){if(Object.isFunction(this.callbacks['afterShow']))
{this.callbacks['afterShow'](this);}}.bind(this)});this.document_event=this.handleDocumentClick.bindAsEventListener(this);Event.observe(document,'click',this.document_event);}else{new Effect.Appear($('document_modal'),{duration:0.3,to:this.options.modalOpacity,afterFinish:function(){new Effect.Appear($(this.wrapper),{duration:0.4,afterFinish:function(){if(Object.isFunction(this.callbacks['afterShow']))
{this.callbacks['afterShow'](this);}}.bind(this)})}.bind(this)});}},_hide:function()
{if(this._tmpEvent!=null)
{Event.stopObserving($(this.wrapper),'mouseout',this._tmpEvent);this._tmpEvent=null;}
if(this.options.modal==false){new Effect.Fade($(this.wrapper),{duration:0.3,afterFinish:function(){if(Object.isFunction(this.callbacks['afterHide']))
{this.callbacks['afterHide'](this);}}.bind(this)});}else{new Effect.Fade($(this.wrapper),{duration:0.3,afterFinish:function(){new Effect.Fade($('document_modal'),{duration:0.2,afterFinish:function(){if(Object.isFunction(this.callbacks['afterHide']))
{this.callbacks['afterHide'](this);}}.bind(this)})}.bind(this)});}},handleDocumentClick:function(e)
{if(!Event.element(e).descendantOf(this.wrapper))
{this._hide(e);}},update:function(content)
{this.inner.update(content);},setUpBalloon:function()
{if(this.options.attach)
{var attach=this.options.attach;if(attach.target&&$(attach.target))
{if(this.options.stem==true)
{this.createStem();}
if(!attach.position){attach.position='auto';}
if(Object.isUndefined(attach.offset)){attach.offset={top:0,left:0}}
if(Object.isUndefined(attach.offset.top)){attach.offset.top=0}
if(Object.isUndefined(attach.offset.left)){attach.offset.left=0}
if(attach.position=='auto')
{Debug.write("Popup: auto-positioning");var screendims=document.viewport.getDimensions();var screenscroll=document.viewport.getScrollOffsets();var toff=$(attach.target).viewportOffset();var wrapSize=$(this.wrapper).getDimensions();var delta=[0,0];if(Element.getStyle($(attach.target),'position')=='absolute')
{var parent=element.getOffsetParent();delta=parent.viewportOffset();}
toff['left']=toff[0]-delta[0];toff['top']=toff[1]-delta[1]+screenscroll.top;var start='top';var end='left';if((toff.top-wrapSize.height-attach.offset.top)<(0+screenscroll.top)){var start='bottom';}
if((toff.left+wrapSize.width-attach.offset.left)>(screendims.width-screenscroll.left)){var end='right';}
finalPos=this.position(start+end,{target:$(attach.target),content:$(this.wrapper),offset:attach.offset});if(this.options.stem==true)
{finalPos=this.positionStem(start+end,finalPos);}}
else
{Debug.write("Popup: manual positioning");finalPos=this.position(attach.position,{target:$(attach.target),content:$(this.wrapper),offset:attach.offset});if(this.options.stem==true)
{finalPos=this.positionStem(attach.position,finalPos);}}
if(!Object.isUndefined(attach.event)){$(attach.target).observe(attach.event,this.show.bindAsEventListener(this));if(attach.event!='click'&&!Object.isUndefined(this.eventPairs[attach.event])){$(attach.target).observe(this.eventPairs[attach.event],this.hide.bindAsEventListener(this));}
$(this.wrapper).observe('mouseover',this.wrapperEvent.bindAsEventListener(this));}}}
Debug.write("Popup: Left: "+finalPos.left+"; Top: "+finalPos.top);$(this.wrapper).setStyle('top: '+finalPos.top+'px; left: '+finalPos.left+'px; position: absolute;');},wrapperEvent:function(e)
{if(this.timer['hide'])
{clearTimeout(this.timer['hide']);this.timer['hide']=null;if(this.options.attach.event&&this.options.attach.event=='mouseover')
{if(this._tmpEvent==null){this._tmpEvent=this.hide.bindAsEventListener(this);$(this.wrapper).observe('mouseout',this._tmpEvent);}}}},positionStem:function(pos,finalPos)
{var stemSize={height:16,width:31};var wrapStyle={};var stemStyle={};switch(pos.toLowerCase())
{case'topleft':wrapStyle={marginBottom:stemSize.height+'px'};stemStyle={bottom:-(stemSize.height)+'px',left:'5px'};finalPos.left=finalPos.left-15;break;case'topright':wrapStyle={marginBottom:stemSize.height+'px'};stemStyle={bottom:-(stemSize.height)+'px',right:'5px'};finalPos.left=finalPos.left+15;break;case'bottomleft':wrapStyle={marginTop:stemSize.height+'px'};stemStyle={top:-(stemSize.height)+'px',left:'5px'};finalPos.left=finalPos.left-15;break;case'bottomright':wrapStyle={marginTop:stemSize.height+'px'};stemStyle={top:-(stemSize.height)+'px',right:'5px'};finalPos.left=finalPos.left+15;break;}
$(this.wrapper).setStyle(wrapStyle);$(this.stem).setStyle(stemStyle).setStyle('z-index: 6000').addClassName(pos.toLowerCase());return finalPos;},position:function(pos,v)
{finalPos={};var toff=$(v.target).viewportOffset();var tsize=$(v.target).getDimensions();var wrapSize=$(v.content).getDimensions();var screenscroll=document.viewport.getScrollOffsets();var offset=v.offset;var delta=[0,0];if(Element.getStyle($(v.target),'position')=='absolute')
{var parent=element.getOffsetParent();delta=parent.viewportOffset();}
toff['left']=toff[0]-delta[0];toff['top']=toff[1]-delta[1];if(!Prototype.Browser.Opera){toff['top']+=screenscroll.top;}
switch(pos.toLowerCase())
{case'topleft':finalPos.top=(toff.top-wrapSize.height-tsize.height)-offset.top;finalPos.left=toff.left+offset.left;break;case'topright':finalPos.top=(toff.top-wrapSize.height-tsize.height)-offset.top;finalPos.left=(toff.left-(wrapSize.width-tsize.width))-offset.left;break;case'bottomleft':finalPos.top=(toff.top+tsize.height)+offset.top;finalPos.left=toff.left+offset.left;break;case'bottomright':finalPos.top=(toff.top+tsize.height)+offset.top;finalPos.left=(toff.left-(wrapSize.width-tsize.width))-offset.left;break;}
return finalPos;},createStem:function()
{this.stem=new Element('div',{id:this.id+'_stem'}).update('&nbsp;').addClassName('stem');this.wrapper.insert({top:this.stem});},setUpPane:function()
{if(!$('document_modal')){this.createDocumentModal();}
this.positionPane();},positionPane:function()
{var elem_s=$(this.wrapper).getDimensions();var window_s=document.viewport.getDimensions();var window_offsets=document.viewport.getScrollOffsets();var center={left:((window_s['width']-elem_s['width'])/2),top:(((window_s['height']-elem_s['height'])/2)/2)}
if(center.top<10){center.top=10;}
$(this.wrapper).setStyle('top: '+center['top']+'px; left: '+center['left']+'px; position: fixed;');},createDocumentModal:function()
{var pageSize=$('ipboard_body').getDimensions();var viewSize=document.viewport.getDimensions();var dims=[];if(viewSize['height']<pageSize['height']){dims['height']=pageSize['height'];}else{dims['height']=viewSize['height'];}
if(viewSize['width']<pageSize['width']){dims['width']=pageSize['width'];}else{dims['width']=viewSize['width'];}
var modal=new Element('div',{'id':'document_modal'}).addClassName('modal').hide();modal.setStyle('width: '+dims['width']+'px; height: '+dims['height']+'px; position: absolute; top: 0px; left: 0px; z-index: 15000;');$$('body')[0].insert(modal);},getObj:function()
{return $(this.wrapper);}});ipb=new IPBoard;ipb.global.init();ipb.menus.init();;var _quickpm=window.IPBoard;_quickpm.prototype.quickpm={popupObj:null,sendingToUser:0,init:function()
{Debug.write("Initializing ips.quickpm.js");document.observe("dom:loaded",function(){ipb.quickpm.initEvents();});},initEvents:function()
{ipb.delegate.register(".pm_button",ipb.quickpm.launchPMform);},launchPMform:function(e,target)
{Debug.write("Launching PM form");pmInfo=target.id.match(/pm_([0-9a-z]+)_([0-9]+)/);if(!pmInfo[2]){Debug.error('Could not find member ID in string '+target.id);}
if($('pm_popup_popup'))
{if(pmInfo[2]==ipb.quickpm.sendingToUser)
{try{$('pm_error_'+ipb.quickpm.sendingToUser).hide();}catch(err){}
ipb.quickpm.popupObj.show();Event.stop(e);return;}
else
{ipb.quickpm.popupObj.getObj().remove();ipb.quickpm.sendingToUser=null;ipb.quickpm.sendingToUser=pmInfo[2];}}
else
{ipb.quickpm.sendingToUser=pmInfo[2];}
ipb.quickpm.popupObj=new ipb.Popup('pm_popup',{type:'pane',modal:true,hideAtStart:true,w:'600px'});var popup=ipb.quickpm.popupObj;new Ajax.Request(ipb.vars['base_url']+"&app=members&module=ajax&secure_key="+ipb.vars['secure_hash']+'&section=messenger&do=showQuickForm&toMemberID='+pmInfo[2],{method:'post',evalJSON:'force',onSuccess:function(t)
{if(t.responseJSON['error'])
{switch(t.responseJSON['error'])
{case'noSuchToMember':alert(ipb.lang['member_no_exist']);break;case'cannotUsePMSystem':case'nopermission':alert(ipb.lang['no_permission']);break;default:alert(t.responseJSON['error']);break;}
ipb.quickpm.sendingToUser=0;return;}
else
{popup.update(t.responseJSON['success']);popup.positionPane();popup.show();if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].observe('click',ipb.quickpm.doSend)}
if($(popup.getObj()).select('.cancel')[0]){$(popup.getObj()).select('.cancel')[0].observe('click',ipb.quickpm.cancelForm)}}}});Event.stop(e);},cancelForm:function(e)
{$('pm_error_'+ipb.quickpm.sendingToUser).hide();ipb.quickpm.popupObj.hide();Event.stop(e);},doSend:function(e)
{Debug.write("Sending");if(!ipb.quickpm.sendingToUser){return;}
Event.stop(e);if($F('pm_subject_'+ipb.quickpm.sendingToUser).blank())
{ipb.quickpm.showError(ipb.lang['quickpm_enter_subject']);return;}
if($F('pm_textarea_'+ipb.quickpm.sendingToUser).blank())
{ipb.quickpm.showError(ipb.lang['quickpm_msg_blank']);return;}
var popup=ipb.quickpm.popupObj;if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].disabled=true};new Ajax.Request(ipb.vars['base_url']+'&app=members&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=messenger&do=PMSend&toMemberID='+ipb.quickpm.sendingToUser,{method:'post',parameters:{'Post':$F('pm_textarea_'+ipb.quickpm.sendingToUser).encodeParam(),'std_used':1,'toMemberID':ipb.quickpm.sendingToUser,'subject':$F('pm_subject_'+ipb.quickpm.sendingToUser).encodeParam()},evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON)){alert(ipb.lang['action_failed']);}
if(t.responseJSON['error'])
{popup.hide();ipb.quickpm.sendingToUser=0;Event.stop(e);switch(t.responseJSON['error'])
{case'cannotUsePMSystem':case'nopermission':alert(ipb.lang['no_permission']);break;default:alert(t.responseJSON['error']);break;}}
else if(t.responseJSON['inlineError'])
{ipb.quickpm.showError(t.responseJSON['inlineError']);if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].disabled=false};return;}
else if(t.responseJSON['status'])
{popup.hide();ipb.quickpm.sendingToUser=0;Event.stop(e);alert(ipb.lang['message_sent']);return;}
else
{Debug.dir(t.responseJSON);}}});},showError:function(msg)
{if(!ipb.quickpm.sendingToUser||!$('pm_error_'+ipb.quickpm.sendingToUser)){return;}
$('pm_error_'+ipb.quickpm.sendingToUser).select('.message')[0].update(msg);if(!$('pm_error_'+ipb.quickpm.sendingToUser).visible())
{new Effect.BlindDown($('pm_error_'+ipb.quickpm.sendingToUser),{duration:0.3});}
else
{}
return;}}
ipb.quickpm.init();;var _editor=window.IPBoard;var isRTL=(isRTL)?isRTL:false;_editor_rte=Class.create({_identifyType:function()
{Debug.write("(Editor "+this.id+") This is the RTE class");},togglesource_pre_show_html:function()
{},togglesource_post_show_html:function()
{},editor_write_contents:function(text,do_init)
{if(text.blank()&&Prototype.Browser.Gecko)
{text='<br />';}
if(this.editor_document&&this.editor_document.initialized)
{this.editor_document.body.innerHTML=text;}
else
{if(do_init)
{this.editor_document.designMode='on';}
this.editor_document=this.editor_window.document;this.editor_document.open('text/html','replace');this.editor_document.write(this.ips_frame_html.replace('{:content:}',text));this.editor_document.close();if(do_init)
{this.editor_document.body.contentEditable=true;this.editor_document.initialized=true;}}},removeformat:function(e)
{this.apply_formatting('unlink',false,false);this.apply_formatting('removeformat',false,false);var text=this.get_selection();if(text)
{text=this.strip_html(text);text=this.strip_empty_html(text);text=text.replace(/\r/g,"");text=text.replace(/\n/g,"<br />");text=text.replace(/<!--(.*?)-->/g,"");text=text.replace(/&lt;!--(.*?)--&gt;/g,"");this.insert_text(text);}},editor_get_contents:function()
{return this.editor_document.body.innerHTML;},editor_set_content:function(init_text)
{if($(this.id+'_iframe'))
{this.editor_box=$(this.id+'_iframe');}
else
{var iframe=new Element('iframe',{'id':this.id+'_iframe','tabindex':0});if(Prototype.Browser.IE&&window.location.protocol=='https:')
{iframe.writeAttribute('src',this.options.file_path+'/index.html');}
this.items['text_obj'].up().insert(iframe);this.editor_box=iframe;}
if(!Prototype.Browser.IE)
{this.editor_box.setStyle('border: 1px inset');}
else
{if(!Object.isUndefined(init_text))
{init_text=init_text.replace(/&sect/g,"&amp;sect");}}
var test_height=ipb.Cookie.get('ips_rte_height');if(Object.isNumber(test_height)&&test_height>50)
{this.items['text_obj'].setStyle({height:test_height+'px'});Debug.write("Set text_obj height to "+test_height);}
var tobj_dims=this.items['text_obj'].getDimensions();if(Object.isUndefined(tobj_dims)||tobj_dims['height']==0)
{tobj_dims['height']=250;}
this.editor_box.setStyle({width:'100%',height:tobj_dims.height+'px',className:this.items['text_obj'].className});this.items['text_obj'].hide();this.editor_window=this.editor_box.contentWindow;this.editor_document=this.editor_window.document;this.editor_write_contents((Object.isUndefined(init_text)||!init_text?this.items['text_obj'].value:init_text),true);this.editor_document.editor_id=this.editor_id;this.editor_window.editor_id=this.editor_id;this.editor_window.has_focus=false;},apply_formatting:function(cmd,dialog,argument)
{dialog=(Object.isUndefined(dialog)?false:dialog);argument=(Object.isUndefined(argument)?true:argument);if(Prototype.Browser.IE&&this.forum_fix_ie_newlines)
{if(cmd=='justifyleft'||cmd=='justifycenter'||cmd=='justifyright')
{var _a=cmd.replace("justify","");this.wrap_tags_lite("["+_a+"]","[/"+_a+"]");return true;}
else if(cmd=='outdent'||cmd=='indent'||cmd=='insertorderedlist'||cmd=='insertunorderedlist')
{this.editor_check_focus();var sel=this.editor_document.selection;var ts=this.editor_document.selection.createRange();var t=ts.htmlText.replace(/<p([^>]*)>(.*)<\/p>/i,'$2');if((sel.type=="Text"||sel.type=="None"))
{ts.pasteHTML(t+"<p />\n");}
else
{this.editor_document.body.innerHTML+="<p />";}}}
if(Prototype.Browser.IE&&this._ie_cache!=null)
{this.editor_check_focus();this._ie_cache.select();}
this.editor_document.execCommand(cmd,dialog,argument);return false;},get_selection:function()
{var rng=this._ie_cache?this._ie_cache:this.editor_document.selection.createRange();if(rng.htmlText)
{return rng.htmlText;}
else
{var rtn='';for(var i=0;i<rng.length;i++)
{rtn+=rng.item(i).outerHTML;}}
return rtn;},editor_set_functions:function()
{Event.observe(this.editor_document,'mouseup',this.events.editor_document_onmouseup.bindAsEventListener(this));Event.observe(this.editor_document,'keyup',this.events.editor_document_onkeyup.bindAsEventListener(this));Event.observe(this.editor_document,'keydown',this.events.editor_document_onkeydown.bindAsEventListener(this));Event.observe(this.editor_window,'blur',this.events.editor_window_onblur.bindAsEventListener(this));Event.observe(this.editor_window,'focus',this.events.editor_window_onfocus.bindAsEventListener(this));},set_context:function(cmd)
{if(this._showing_html)
{return false;}
this.button_update.each(function(item)
{var obj=$(this.id+'_cmd_'+item);if(obj!=null)
{try{var state=new String(this.editor_document.queryCommandState(item));if(obj.readAttribute('state')!=state)
{obj.writeAttribute('state',new String(state));this.set_button_context(obj,(obj.readAttribute('cmd')==cmd?'mouseover':'mouseout'));}}
catch(error)
{Debug.write("#1 "+error);}}}.bind(this));this.button_set_font_context();this.button_set_size_context();},button_set_font_context:function(font_state)
{changeto='';if(this._showing_html)
{return false;}
if(this.items['buttons']['fontname'])
{if(Object.isUndefined(font_state)){font_state=this.editor_document.queryCommandValue('fontname')||'';}
if(font_state.blank()){if(!Prototype.Browser.IE&&window.getComputedStyle)
{font_state=this.editor_document.body.style.fontFamily;}}else if(font_state==null){font_state='';}
if(font_state!=this.font_state)
{this.font_state=font_state;var fontword=font_state;var commapos=fontword.indexOf(",");if(commapos!=-1){fontword=fontword.substr(0,commapos);}
fontword=fontword.toLowerCase();changeto='';ipb.editor_values.get('primary_fonts').any(function(font){if(font.value.toLowerCase()==fontword){changeto=font.value;return true;}else{return false;}});changeto=(changeto=='')?this.fontoptions['_default']:changeto;this.items['buttons']['fontname'].update(changeto);}}},button_set_size_context:function(size_state)
{if(this.items['buttons']['fontsize'])
{if(Object.isUndefined(size_state)){size_state=this.editor_document.queryCommandValue('fontsize');}
if(size_state==null||size_state=='')
{if(Prototype.Browser.Gecko)
{size_state=this.convert_size(this.editor_document.body.style.fontSize,0);if(!size_state)
{size_state='2';}}}
changeto='';if(size_state!=this.size_state)
{this.size_state=size_state;ipb.editor_values.get('font_sizes').any(function(size){if(parseInt(size)==parseInt(this.size_state)){changeto=size;return true;}else{return false;}}.bind(this));changeto=(changeto=='')?this.sizeoptions['_default']:changeto;this.items['buttons']['fontsize'].update(changeto);}}},insert_text:function(text)
{this.editor_check_focus();if(typeof(this.editor_document.selection)!='undefined'&&this.editor_document.selection.type!='Text'&&this.editor_document.selection.type!='None')
{this.editor_document.selection.clear();}
var sel=this._ie_cache?this._ie_cache:this.editor_document.selection.createRange();sel.pasteHTML(text);sel.select();this._ie_cache=null;},insert_emoticon:function(emo_id,emo_image,emo_code,event)
{try
{var _emo_url=ipb.vars['emoticon_url']+"/"+emo_image;var _emo_html=' <img src="'+_emo_url+'" class="bbc_emoticon" alt="'+this.unhtmlspecialchars(emo_code)+'" />';this.wrap_tags_lite(" "+_emo_html," ");}
catch(error)
{Debug.write("#2 "+error);}},togglesource:function(e,update)
{Event.stop(e);if(this._showing_html)
{if(update)
{this.editor_document.initialized=false;this.editor_write_contents($(this.id+'_htmlsource').value,true);}
$(this.editor_box).show();$(this.items['controls']).show();$(this.id+'_htmlsource').remove();$(this.id+'_ts_controls').remove();this._showing_html=false;this.editor_check_focus();}
else
{this._showing_html=true;this.togglesource_pre_show_html();var textarea=new Element('textarea',{id:this.id+'_htmlsource',tabindex:3});textarea.className=this.items['text_obj'].className;var dims=this.items['text_obj'].getDimensions();textarea.value=this.clean_html(this.editor_get_contents());var controlbar=ipb.editor_values.get('templates')['togglesource'].evaluate({id:this.id});$(this.items['text_obj']).insert({after:textarea});$(textarea).insert({after:controlbar});$(this.id+'_ts_update').writeAttribute('cmd','togglesource').writeAttribute('editor_id',this.id).observe('click',this.togglesource.bindAsEventListener(this,1));$(this.id+'_ts_cancel').writeAttribute('cmd','togglesource').writeAttribute('editor_id',this.id).observe('click',this.togglesource.bindAsEventListener(this,0));$(this.items['controls']).hide();$(this.editor_box).hide();this.editor_check_focus();}},update_for_form_submit:function()
{Debug.write("Updating for submit");this.items['text_obj'].value=this.editor_get_contents();if(Prototype.Browser.WebKit)
{this.items['text_obj'].value=this.items['text_obj'].value.replace(/<span class="Apple-style-span" style="text-decoration: underline;">([^>]*)<\/span>/gi,"<u>$1</u>");this.items['text_obj'].value=this.items['text_obj'].value.replace(/<span class="Apple-style-span" style="text-decoration: line-through;">([^>]*)<\/span>/gi,"<strike>$1</strike>");}
return true;}});_editor_std=Class.create({_identifyType:function()
{Debug.write("(Editor "+this.id+") This is the STD class");},editor_set_content:function(init_text)
{var iframe=this.items['text_obj'].up().down('iframe',0);if(!Object.isUndefined(iframe))
{var iframeDims=iframe.getDimensions();$(this.items['text_obj']).setStyle({'width':iframeDims.width,'height':iframeDims.height}).show();$(iframe).setStyle('width: 0px; height: 0px; border: none;');}
this.editor_window=this.items['text_obj'];this.editor_document=this.items['text_obj'];this.editor_box=this.items['text_obj'];if(!Object.isUndefined(init_text))
{this.editor_write_contents(init_text);}
this.editor_document.editor_id=this.id;this.editor_window.editor_id=this.id;if(!Prototype.Browser.IE&&$(this.id+'_cmd_spellcheck')){$(this.id+'_cmd_spellcheck').hide();}
if($(this.id+'_cmd_removeformat')){$(this.id+'_cmd_removeformat').hide();}
if($(this.id+'_cmd_togglesource')){$(this.id+'_cmd_togglesource').hide();}
if($(this.id+'_cmd_justifyfull')){$(this.id+'_cmd_justifyfull').hide();}
if($(this.id+'_cmd_outdent')){$(this.id+'_cmd_outdent').hide();}
if($(this.id+'_cmd_switcheditor')){$(this.id+'_cmd_switcheditor').hide();}},editor_write_contents:function(text)
{this.items['text_obj'].value=text;},editor_get_contents:function()
{return this.editor_document.value;},apply_formatting:function(cmd,dialog,argument)
{switch(cmd)
{case'bold':case'italic':case'underline':{this.wrap_tags(cmd.substr(0,1),false);return;}
case'justifyleft':case'justifycenter':case'justifyright':{this.wrap_tags(cmd.substr(7),false);return;}
case'indent':{this.wrap_tags(cmd,false);return;}
case'createlink':{var sel=this.get_selection();if(sel)
{this.wrap_tags('url',argument);}
else
{this.wrap_tags('url',argument,argument);}
return;}
case'fontname':{this.wrap_tags('font',argument);return;}
case'fontsize':{this.wrap_tags('size',argument);return;}
case'forecolor':{this.wrap_tags('color',argument);return;}
case'backcolor':{this.wrap_tags('background',argument);return;}
case'insertimage':{this.wrap_tags('img',false,argument);return;}
case'strikethrough':{this.wrap_tags('s',false);return;}
case'superscript':{this.wrap_tags('sup',false);return;}
case'subscript':{this.wrap_tags('sub',false);return;}
case'removeformat':return;}},editor_set_functions:function()
{Event.observe(this.editor_document,'keypress',this.events.editor_document_onkeypress.bindAsEventListener(this));Event.observe(this.editor_window,'focus',this.events.editor_window_onfocus.bindAsEventListener(this));Event.observe(this.editor_window,'blur',this.events.editor_window_onblur.bindAsEventListener(this));},set_context:function()
{},get_selection:function()
{if(!Object.isUndefined(this.editor_document.selectionStart))
{return this.editor_document.value.substr(this.editor_document.selectionStart,this.editor_document.selectionEnd-this.editor_document.selectionStart);}
else if((document.selection&&document.selection.createRange)||this._ie_cache)
{return this._ie_cache?this._ie_cache.text:document.selection.createRange().text;}
else if(window.getSelection)
{return window.getSelection()+'';}
else
{return false;}},insert_text:function(text)
{this.editor_check_focus();if(!Object.isUndefined(this.editor_document.selectionStart))
{var open=this.editor_document.selectionStart+0;var st=this.editor_document.scrollTop;var end=open+text.length;if(Prototype.Browser.Opera)
{var opera_len=text.match(/\n/g);try
{end+=parseInt(opera_len.length);}
catch(e)
{Debug.write("#3 "+e);}}
this.editor_document.value=this.editor_document.value.substr(0,this.editor_document.selectionStart)+text+this.editor_document.value.substr(this.editor_document.selectionEnd);if(!text.match(new RegExp("\\"+this.open_brace+"(\\S+?)"+"\\"+this.close_brace+"\\"+this.open_brace+"/(\\S+?)"+"\\"+this.close_brace)))
{this.editor_document.selectionStart=open;this.editor_document.selectionEnd=end;this.editor_document.scrollTop=st;Debug.write("Insert 0");}
else
{if(Prototype.Browser.Gecko){this.editor_document.scrollTop=st;}}
this.editor_document.setSelectionRange(open,end);Debug.write("Insert 1");}
else if((document.selection&&document.selection.createRange)||this._ie_cache)
{var sel=this._ie_cache?this._ie_cache:document.selection.createRange();sel.text=text.replace(/\r?\n/g,'\r\n');sel.select();Debug.write("Insert 2");}
else
{this.editor_document.value+=text;Debug.write("Insert 3");}
this._ie_cache=null;},insert_emoticon:function(emo_id,emo_image,emo_code,event)
{this.editor_check_focus();emo_code=this.unhtmlspecialchars(emo_code);this.wrap_tags_lite(" "+emo_code," ");},insertorderedlist:function(e)
{this.insertlist('ol');},insertunorderedlist:function(e)
{this.insertlist('ul');},insertlist:function(list_type)
{var open_tag;var close_tag;var item_open_tag='<li>';var item_close_tag='</li>';var regex='';var all_add='';if(this.use_bbcode)
{regex=new RegExp('([\r\n]+|^[\r\n]*)(?!\\[\\*\\]|\\[\\/?list)(?=[^\r\n])','gi');open_tag=list_type=='ol'?'[list=1]\n':'[list]\n';close_tag='[/list]';item_open_tag='[*]';item_close_tag='';}
else
{regex=new RegExp('([\r\n]+|^[\r\n]*)(?!<li>|<\\/?ol|ul)(?=[^\r\n])','gi');open_tag=list_type=='ol'?'<ol>\n':'<ul>\n';close_tag=list_type=='ol'?'</ol>\n':'</ul>\n';}
if(text=this.get_selection())
{text=open_tag+text.replace(regex,"\n"+item_open_tag+'$1'+item_close_tag)+'\n'+close_tag;if(this.use_bbcode)
{text=text.replace(new RegExp('\\[\\*\\][\r\n]+','gi'),item_open_tag);}
this.insert_text(text);}
else
{var to_insert=open_tag;var listitems='';while(val=prompt(ipb.lang['editor_enter_list'],''))
{listitems+=item_open_tag+val+item_close_tag+'\n';}
if(listitems)
{to_insert+=listitems;to_insert+=close_tag;this.insert_text(to_insert);}}},removeformat:function()
{var text=this.get_selection();if(text)
{text=this.strip_html(text);this.insert_text(text);}},unlink:function()
{var text=this.get_selection();var link_regex='';var link_text='';if(text!==false)
{if(text.match(link_regex))
{text=(this.use_bbcode)?text.replace(/\[url=([^\]]+?)\]([^\[]+?)\[\/url\]/ig,"$2"):text.replace(/<a href=['\"]([^\"']+?)['\"]([^>]+?)?>(.+?)<\/a>/ig,"$3");}
this.insert_text(text);}},undo:function()
{this.history_record_state(this.editor_get_contents());this.history_time_shift(-1);if((text=this.history_fetch_recording())!==false)
{this.editor_document.value=text;}},redo:function()
{this.history_time_shift(1);if((text=this.history_fetch_recording())!==false)
{this.editor_document.value=text;}},update_for_form_submit:function(subjecttext,minchars)
{return true;}});if(USE_RTE){Debug.write("Extending with RTE")
_type=_editor_rte;}else{Debug.write("Extending with STD");_type=_editor_std;}
_editor.prototype.editor=Class.create(_type,{initialize:function(editor_id,mode,initial_content,options)
{this.id=editor_id;this.is_rte=mode;this.use_bbcode=!mode;this.events=null;this.options=[];this.items=[];this.settings={};this.open_brace='';this.close_brace='';this.allow_advanced=0;this.initialized=0;this.ips_frame_html='';this.forum_fix_ie_newlines=1;this.has_focus=null;this.history_recordings=[];this.history_pointer=-1;this._ie_cache=null;this._showing_html=false;this._loading=false;this.original=$H();this.hidden_objects=[];this.fontoptions=$A();this.sizeoptions=$A();this.font_state=null;this.size_state=null;this.palettes={};this.defaults={};this.key_handlers=[];this.showing_sidebar=false;this.emoticons_loaded=false;this.options=Object.extend({file_path:'',forum_fix_ie_newlines:1,char_set:'UTF-8',ignore_controls:[],button_update:[]},arguments[3]||{});this.button_update=$A(["bold","italic","underline","justifyleft","justifycenter","justifyright","insertorderedlist","insertunorderedlist","superscript","subscript","strikethrough"].concat(this.options.button_update));this.values=ipb.editor_values;this.items['text_obj']=$(this.id+"_textarea");this.items['buttons']=$A();this.items['controls']=$(this.id+'_controls');this.open_brace=this.use_bbcode?'[':'<';this.close_brace=this.use_bbcode?']':'>';this.allow_advanced=this.use_bbcode?0:1;this.doc_body=$$('body')[0];this.events=new _editor_events();this._identifyType();if(this.values.get('bbcodes')&&$(this.id+'_cmd_otherstyles'))
{this.buildCustomStyles();}
if(this.items['text_obj'].up('form')){this.items['text_obj'].up('form').observe('submit',function(e){this.update_for_form_submit();}.bindAsEventListener(this));}
this.init(initial_content);Debug.write("All editor initialization complete");},init:function(initial_text)
{try{if(this.initialized){return;}
if($(this.id+'_wysiwyg_used')){$(this.id+'_wysiwyg_used').value=parseInt(this.is_rte);}
if(ipb.Cookie.get('emoticon_sidebar')=='1'&&$(this.id+'_sidebar'))
{this.buildEmoticons();$(this.id+'_sidebar').show();$('editor_'+this.id).addClassName('with_sidebar');ipb.Cookie.set('emoticon_sidebar',1,1);this.showing_sidebar=true;}
this.ips_frame_html=this.get_frame_html();this.editor_set_content(initial_text);this.editor_set_functions();this.editor_set_controls();this.initialized=true;}
catch(err){Debug.error("#4 "+err);}},buildCustomStyles:function()
{var buttons=false;var other_styles=false;var toolbar=ipb.editor_values.get('templates')['toolbar'].evaluate({'id':this.id,'toolbarid':'3'});$(this.id+'_toolbar_2').insert({after:toolbar});this.init_editor_menu($(this.id+'_cmd_otherstyles'));this.values.get('bbcodes').each(function(bbcode){if(!bbcode.value['image'].blank())
{$(this.id+'_toolbar_3').insert(ipb.editor_values.get('templates')['button'].evaluate({'id':this.id,'cmd':bbcode.key,'title':bbcode.value['title'],'img':bbcode.value['image']}));buttons=true;}
else
{$(this.id+'_popup_otherstyles_menu').insert(ipb.editor_values.get('templates')['menu_item'].evaluate({'id':this.id,'cmd':bbcode.key,'title':bbcode.value['title']}));other_styles=true;}
if(!(bbcode.value['useoption']=='0'&&bbcode.value['single_tag']=='1'))
{var item_wrap=new Element('div',{id:this.id+'_palette_otherstyles_'+bbcode.key});item_wrap.addClassName('ipb_palette').addClassName('extended');item_wrap.writeAttribute("styleid",bbcode.key);var _content=this.values.get('templates')['generic'].evaluate({id:this.id+'_'+bbcode.key,title:bbcode.value['title'],example:bbcode.value['example'],option_text:bbcode.value['menu_option_text']||'',value_text:bbcode.value['menu_content_text']||''});item_wrap.update(_content);this.doc_body.insert({top:item_wrap});if(bbcode.value['useoption']=='0'){item_wrap.select('.optional').invoke('remove');}
if(bbcode.value['single_tag']=='1'){item_wrap.select('.tagcontent').invoke('remove');}
this.palettes['otherstyles_'+bbcode.key]=new ipb.Menu($(this.id+'_cmd_custom_'+bbcode.key