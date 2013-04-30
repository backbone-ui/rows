// Backbone.js Rows extension
//
// Created by: Makis Tracend (@tracend)
// Source: https://github.com/backbone-ui/tags
//
// Licensed under the MIT license: 
// http://makesites.org/licenses/MIT

(function(_, Backbone) {
	
    // fallbacks
	if( _.isUndefined( Backbone.UI ) ) Backbone.UI = {};
	// Support backbone app (if available)
	var View = ( typeof APP != "undefined" && !_.isUndefined( APP.View) ) ? APP.View : Backbone.View;
    
	Backbone.UI.Rows = View.extend({
		//el : ".backend-container", 
		events : {
			"click .del a" : "deleteRow",
			"click .add" : "newRow"
			//"change .row-new select" : "newRow"
		},
		initialize: function( options ){
			//fallbacks
			options || (options = {});
			_.bindAll( this, 'render', 'newRow', 'addRow', 'deleteRow', 'updateField');
			//
			this.$field = options.field || false;
			// to be added in a template file...
			this.views = {
				"row" : '<dl class="row"><dt class="key"></dt><dd class="value"></dd><dd class="del"><a href="#" >x</a></dd></dl>'
			};
			
			this.render();
			//return APP.View.prototype.initialize.apply( this, options );
		},
		render: function(){
			if( !this.$field ) return;
			// get the tags from the input field
			var field = this.$field.val() || false;
			if(!field) return;
			var rows = JSON.parse( this.$field.val() );
			// 
			for(var key in rows){
				this.addRow( key, rows[key] );
			}
		}, 
		newRow: function( e ){
			var $el = $(this.el).find(".row-new");
			var key = $el.find("input").val();
			var value = $el.find("select").val();
			this.addRow(key,value);
			this.updateField();
			// reset input fields
			$el.find("input").val("");
			$el.find("select").val(0);
		}, 
		addRow: function( key, value ){
			var template = this.views.row;
			var rows = $(this.el).find(".rows");
			// find the title of the value
			var title = "";
			//for( var i in stores ){
			//	if( stores[i].id == value) {
			//		title = stores[i].title;
			//		break;
			//	}
			//}
			// better way to do this?
			$(template).find(".key").html( key ).closest(".row").find(".value").attr("data-id", value).html( title ).closest(".row").appendTo( rows );
		}, 
		deleteRow: function( e ){
			e.preventDefault();
			// find tag
			var tag = $(e.target).closest(".row");
			// remove tag
			$(this.el).find(tag).remove();
			// update input field
			this.updateField();
			
		}, 
		updateField: function(){
			if( !this.$field ) return;
			var rows = {};
			$(this.el).find(".row").each(function(){
				var key = $(this).find(".key").html();
				var value = $(this).find(".value").attr('data-id');
				rows[key] = value;
			});
			// make a string from the tags
			var value = JSON.stringify( rows );
			// update input (hidden) field
			this.$field.val( value );
		}
	});
    
    
})(this._, this.Backbone);