Ext.namespace("Ext.ux.data");Ext.ux.data.DWRProxy=function(c,b,a){Ext.ux.data.DWRProxy.superclass.constructor.call(this);this.data=c;this.dwr_filter=b;this.dwr_total_cache=false;this.dwr_errorHandler=a};Ext.extend(Ext.ux.data.DWRProxy,Ext.data.DataProxy,{load:function(h,c,i,f,b){var d=this;h=h||{};if(h.cache!=undefined){this.dwr_total_cache=h.cache}if(h.filter!=undefined){this.dwr_filter=h.filter}var a;try{this.data(this.dwr_filter,h.start,h.limit,this.dwr_total_cache,{callback:function(e){a=c.readRecords(e);i.call(f,a,b,true)},errorHandler:function(j,k){f.fireEvent("loadexception",d,b,null,k);d.dwr_errorHandler(j)},timeout:100000});this.dwr_total_cache=true}catch(g){this.fireEvent("loadexception",this,b,null,g);i.call(f,null,b,false);return}}});Ext.ux.data.DWRProxySimple=function(c,b,a){Ext.ux.data.DWRProxySimple.superclass.constructor.call(this);this.data=c;this.dwr_filter=b;this.dwr_errorHandler=a};Ext.extend(Ext.ux.data.DWRProxySimple,Ext.data.DataProxy,{load:function(h,c,i,f,b){var d=this;h=h||{};if(h.filter!=undefined){this.dwr_filter=h.filter}var a;try{this.data(this.dwr_filter,{callback:function(e){a=c.readRecords(e);i.call(f,a,b,true)},errorHandler:function(j,k){f.fireEvent("loadexception",d,b,null,k);d.dwr_errorHandler(j)},timeout:100000});this.dwr_total_cache=true}catch(g){this.fireEvent("loadexception",this,b,null,g);i.call(f,null,b,false);return}}});