if (console == undefined) {
	var console = {
		log: function(msg) {
			alert(msg);
		}
	};
}

var excludeNone = function(bean) {
	for(var x in bean) {
		if( typeof(bean[x]) == 'object') {
			excludeNone(bean[x]);
			var entity = bean[x];
			for(var j in entity){
				if( ( j != 'id' || (j == 'id' && (entity[j] == 0 || entity[j] == null)))  && (entity[j] == null || entity[j] == 0 || entity[j].trim == '')){
					delete entity[j];
				}
			}
			if(Ext.util.JSON.encode(entity) == "{}"){	delete bean[x];		}
		} else if(typeof(bean[x]) == 'Array') {
			if(bean[x].length == 0){ delete bean[x]; }
		} else {
			if((typeof bean[x] == 'function') || bean[x] == 0  || (typeof bean[x] != "number"  &&  bean[x].trim() == '')) {
				delete bean[x];
			} 
		}
	}
};

Ext.ux.Panel  = Ext.extend(Ext.Panel, {
	initComponent: function() {
		this.title = "Panel Padrão do Sistema";
		this.frame = true;
		Ext.ux.Panel.superclass.initComponent.call(this, arguments);
		this.insert(0, this.initialConfig.form);
		this.insert(1, this.initialConfig.grid);
	}
});


var Project = function() {
	
	var errorHandler = function(mensagem, erro) {
		console.log(mensagem);
	};
	
	var search = function() {
		var json = panel.getComponent(0).getForm().getValues();
		json.$dwrClassName = 'Project';
		excludeNone(json);
		store.load({
			params: {filter: json, start: 0, limit: 10, cache:false}
		});
	};
	var add = function() {
		makeWindow();
	};
	var save = function(json) {
		json.$dwrClassName = 'Project';
		INSYSTEM.excludeNone(area);
		AjaxFacade.cadastrar(area, {
			callback: function(retorno) {
				var record = new Ext.data.Record(retorno);
				store_area.insert(0, record);
				store_area.commitChanges();
				limpaForm_area();	
			}, 
			errorHandler: function(mensagem, erro) {
				messageManager(mensagem, erro, errorHandler_cadastrar);
			},
			warningHandler: function(mensagem, erro) {
				warningHandler_app();
			}
		});
	};
	
	var panel;
	var store = new Ext.data.Store({
		/*autoLoad:{
			params: {filter: {}, start: 0, limit: 10, cache:false}
		},*/
		proxy: new Ext.ux.data.DWRProxy(AjaxFacade.find, {$dwrClassName:"Project"}, errorHandler),
		reader: new Ext.data.JsonReader({root: 'results',totalProperty: 'total',id: 'id'}, 
				['id', 'name', 'manager.name', 'manager.address.country'])
	});
	
	var panelModel = {
			title:'Cadastrar|Alterar Projeto',frame:true,autoHeight:true,
			items:[{
				xtype:'uxform',
				monitorValid:true,
				 buttons: [{
						text: 'Save',formBind:true, handler:function() {
					 		save(this.ownerCt.getForm().getValues());
				 		}
			        },{
						text: 'Cancel',formBind:true, handler:function() {
							this.ownerCt.ownerCt.ownerCt.hide();
				 		}
			        }],
			        
				items:[
					{
						xtype:'textfield', pojo: "name",name: 'name',fieldLabel: 'Project Name',allowBlank:false
					},{
						layout:'column',
						items: [{//coluna 1
							columnWidth:0.5, layout: 'form',
							items:[
								{
									xtype:'datefield', pojo: "begin",fieldLabel: 'Inicio',
									name: 'begin', allowBlank:false
								}
							]
						},{//coluna 2
							columnWidth:0.5, layout: 'form',
								items:[
									{
										xtype:'datefield',pojo: "end",fieldLabel: 'Fim',
										name: 'end',allowBlank:false
									}
								]
							}
						]
					},
					{
						xtype:'textfield', pojo: "id",	hidden:true, hideLabel:true
					},
					{
						xtype:'fieldset', title: 'Manager',	autoHeight:true,
						items:[{
								xtype:'textfield', pojo: "manager.id", hidden:true, hideLabel:true
							},{
								xtype:'textfield', pojo: "manager.name",fieldLabel: 'Manager Name',
								name: 'manager.name',allowBlank:true
						},{
							xtype:'fieldset',title: 'Address',autoHeight:true,
							items:[
								{height: 5},
								{
									layout:'column',
									items: [{//coluna 1
										columnWidth:0.5, layout: 'form',
										items:[
											{
												xtype:'textfield', pojo: "manager.address.id", 
												hidden:true, hideLabel:true
											},{
												xtype:'textfield', 
												pojo: "manager.address.street",
												fieldLabel: 'Street',
												name: 'manager.address.street',
												allowBlank:true
											}
										]
									},{//coluna 2
										columnWidth:0.5, layout: 'form',
											items:[
												{
													xtype:'textfield', width:60,
													pojo: "manager.address.number",
													fieldLabel: 'Number',
													name: 'manager.address.number',
													allowBlank:true
												}
											]
										}
									]
								}, {
							    	   layout:'column', labelAlign: 'top',
										items: [{//coluna 1
												columnWidth:0.33, layout: 'form',
												items:[
													{
														xtype:'textfield', 
														pojo: "manager.address.postalcode",
														fieldLabel: 'Postal Code',
														name: 'manager.address.postalcode',
														allowBlank:true
													}
												]
											},{//coluna 2
												columnWidth:0.33, layout: 'form',
												items:[
													{
														xtype:'textfield', 
														pojo: "manager.address.city",
														fieldLabel: 'City',
														name: 'manager.address.city',
														allowBlank:true
													}
												]
											}, {
												columnWidth:0.33, layout: 'form',
												items:[
													{
														xtype:'textfield',
														pojo: "manager.address.country",
														fieldLabel: 'Country',
														name: 'manager.address.country',
														allowBlank:true
													}
												]
											}
										]
							       }
							]
						}]
					}
				]}	
			]
		};
		
		
	var window;
	
	var makeWindow = function() {
		window = new Ext.Window({
			width:600,height:400,border:true,
			plain:true, autoCreate:true, modal:true, closable:true
			,items:[panelModel]	
		});
		window.show();
	};
	
	var _init = function () {
		
		panel = new Ext.ux.Panel({
			renderTo:'project',
			autoScroll: true,
			form: { 
				xtype:'uxform',
				frame:true,labelAlign: 'top',
				items:[
					{
						layout:'column',
						items: [
							{//coluna								
								columnWidth:0.40, layout: 'form',
								items:[{
									xtype:'textfield', pojo:'name', fieldLabel:'Pesquisar', width: 400, maxLength:60, allowBlank:true, labelSeparator: ''
								}]
							},{
								columnWidth:0.10, layout: 'form',
								items: [{
									Width:45, layout: 'form', height: 18
								},{
									Width:45, layout: 'form',
									items:[{xtype:'button', text:'Pesquisar',listeners: {click:search}}]
								}]
							}, {
								items: [{
									Width:45, layout: 'form', height: 18
								},{
									Width:45, layout: 'form',
									items:[{xtype:'button', text:'Novo',listeners: {click:add}}]
								}]
							}
						]
					}
				]
			},
			grid: {
				xtype:'grid',
				title:'Projetos cadastrados no Sistema',
				autoHeight:true, frame:true,
				store: store,
				cm: new Ext.grid.ColumnModel([
					{hidden:true, header: "Id", width: 20, resizable:false, sortable: true, dataIndex: 'id'}, 		
					{header: "Name", width: 80, autoHeight:true, sortable: true, dataIndex: 'name'},
					{header: "Manager", width: 80, autoHeight:true, sortable: true, dataIndex: 'manager.name'},
					{header: "Country", width: 80, autoHeight:true, sortable: true, dataIndex: 'manager.address.country'}
				]),
				sm: new Ext.grid.CheckboxSelectionModel(),
				viewConfig: {forceFit: true},
				bbar: new Ext.PagingToolbar({
					pageSize:10,store: store,displayInfo: true,	displayMsg: 'Exibindo o resultado: {0} a {1} de {2} registros',
					emptyMsg: "Sem resultados a exibir",
					items: ['-', {
						pressed: true,enableToggle: true,text: 'Alterar',cls: 'x-btn-text-icon details',toggleHandler: function(){}
					}, {
						pressed: true,enableToggle: true,text: 'Excluir',cls: 'x-btn-text-icon details',toggleHandler: function(){}
					}]
				})
			}
		});
		
		store.load({
			params: {filter: {$dwrClassName:"Project"}, start: 0, limit: 10, cache:false}
		});
		/* grid.render('project'); */

	};
	
	return {
		init:function() {
			_init();
		}
	};
	
}();

Ext.onReady(Project.init);