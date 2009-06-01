Ext.namespace("Ext.ux.data");Ext.ux.data.DWRProxy=function(c,b,a){Ext.ux.data.DWRProxy.superclass.constructor.call(this);this.data=c;this.dwr_filter=b;this.dwr_total_cache=false;this.dwr_errorHandler=a};Ext.extend(Ext.ux.data.DWRProxy,Ext.data.DataProxy,{load:function(h,c,j,f,b){var d=this;h=h||{};if(h.cache!=undefined){this.dwr_total_cache=h.cache}if(h.filter!=undefined){this.dwr_filter=h.filter}var a;try{this.data(this.dwr_filter,h.start,h.limit,this.dwr_total_cache,{callback:function(e){a=c.readRecords(e);j.call(f,a,b,true)},errorHandler:function(k,l){f.fireEvent("loadexception",d,b,null,l);d.dwr_errorHandler(k)},timeout:100000});this.dwr_total_cache=true}catch(g){this.fireEvent("loadexception",this,b,null,g);j.call(f,null,b,false);return}}});Ext.ux.data.DWRProxySimple=function(c,b,a){Ext.ux.data.DWRProxySimple.superclass.constructor.call(this);this.data=c;this.dwr_filter=b;this.dwr_errorHandler=a};Ext.extend(Ext.ux.data.DWRProxySimple,Ext.data.DataProxy,{load:function(h,c,j,f,b){var d=this;h=h||{};if(h.filter!=undefined){this.dwr_filter=h.filter}var a;try{this.data(this.dwr_filter,{callback:function(e){a=c.readRecords(e);j.call(f,a,b,true)},errorHandler:function(k,l){f.fireEvent("loadexception",d,b,null,l);d.dwr_errorHandler(k)},timeout:100000});this.dwr_total_cache=true}catch(g){this.fireEvent("loadexception",this,b,null,g);j.call(f,null,b,false);return}}});var merge=function(a,b){for(i in b){if(typeof b[i]=="object"){if(a[i]==undefined){a[i]=b[i]}merge(a[i],b[i])}else{a[i]=b[i]}}};var makeJsonFromText=function(g,d){var e=g.split(".");var f={};for(var c=e.length;c>0;c--){var a={};var b=e[c-1];if(b==e[e.length-1]){a[b]=d}else{a[b]=f}f=a}return f};Ext.ux.BasicForm=Ext.extend(Ext.form.BasicForm,{json:{},getValues:function(){this.json={};var b=this.getValuesRecursive;var a=this.json;this.items.each(function(d){if(d.isFormField){var c={};if(d.getValue()==undefined){c=makeJsonFromText(d.pojo,"")}else{c=makeJsonFromText(d.pojo,d.getValue())}merge(a,c)}});this.json=a;return this.json},findField:function(b){var a=null;this.items.each(function(c){if(c.isFormField&&c.pojo==b){a=c;return false}});return a||null},setValuesRecursive:function(a,e){var d,f;for(f in a){var c=f;var b=a[f];if(e){c=e+"."+c}if(typeof b=="object"){this.setValuesRecursive(b,c)}if(typeof b!="function"&&(d=this.findField(c))){d.setValue(b);if(this.trackResetOnLoad){d.originalValue=d.getValue()}}}},loadRecord:function(a){this.setValuesRecursive(a.data);return this}});Ext.ux.FormPanel=Ext.extend(Ext.FormPanel,{createForm:function(){delete this.initialConfig.listeners;return new Ext.ux.BasicForm(null,this.initialConfig)},initComponent:function(){Ext.ux.FormPanel.superclass.initComponent.call(this);this.form=this.createForm()}});Ext.reg("uxform",Ext.ux.FormPanel);